import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, "../public/images/parokonvektomat.jpg");
const output = path.join(__dirname, "../public/images/parokonvektomat-site.png");

const BG = [245, 243, 239];
const BG_DR_THRESHOLD = 8;

function idx(x, y, width) {
  return y * width + x;
}

function pixelOffset(i, channels) {
  return i * channels;
}

function rgb(data, x, y, width, channels) {
  const p = pixelOffset(idx(x, y, width), channels);
  return [data[p], data[p + 1], data[p + 2]];
}

function avg(rgb) {
  return (rgb[0] + rgb[1] + rgb[2]) / 3;
}

function spread(rgb) {
  return Math.max(...rgb) - Math.min(...rgb);
}

function bgDistance(r, g, b) {
  return Math.abs(r - BG[0]) + Math.abs(g - BG[1]) + Math.abs(b - BG[2]);
}

function isExactBg(r, g, b) {
  return bgDistance(r, g, b) <= BG_DR_THRESHOLD;
}

function isStrictWhite(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a >= 242 && s <= 16;
}

function isBackdropLike(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a >= 165 && s <= 36;
}

function isForegroundSeed(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a < 132 || s > 44;
}

function canGrowForeground(r, g, b) {
  const a = avg([r, g, b]);
  if (isBackdropLike(r, g, b) && a >= 215) return false;
  return a < 228;
}

const NEIGHBORS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
let { width, height, channels } = info;
const total = width * height;

const backdrop = new Uint8Array(total);
const queue = [];

function seedBackdrop(x, y) {
  const i = idx(x, y, width);
  if (backdrop[i]) return;
  const [r, g, b] = rgb(data, x, y, width, channels);
  if (!isStrictWhite(r, g, b)) return;
  backdrop[i] = 1;
  queue.push(i);
}

for (let x = 0; x < width; x++) {
  seedBackdrop(x, 0);
  seedBackdrop(x, height - 1);
}
for (let y = 0; y < height; y++) {
  seedBackdrop(0, y);
  seedBackdrop(width - 1, y);
}

while (queue.length) {
  const i = queue.pop();
  const x = i % width;
  const y = (i - x) / width;
  const parentAvg = avg(rgb(data, x, y, width, channels));

  for (const [dx, dy] of NEIGHBORS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

    const ni = idx(nx, ny, width);
    if (backdrop[ni]) continue;

    const color = rgb(data, nx, ny, width, channels);
    if (!isBackdropLike(...color)) continue;
    if (avg(color) < parentAvg - 24) continue;

    backdrop[ni] = 1;
    queue.push(ni);
  }
}

const foreground = new Uint8Array(total);
const fgQueue = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y, width);
    const color = rgb(data, x, y, width, channels);
    if (!isForegroundSeed(...color)) continue;
    foreground[i] = 1;
    fgQueue.push(i);
  }
}

while (fgQueue.length) {
  const i = fgQueue.pop();
  const x = i % width;
  const y = (i - x) / width;

  for (const [dx, dy] of NEIGHBORS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

    const ni = idx(nx, ny, width);
    if (foreground[ni]) continue;

    const color = rgb(data, nx, ny, width, channels);
    if (!canGrowForeground(...color)) continue;

    foreground[ni] = 1;
    fgQueue.push(ni);
  }
}

let minFgY = height;
let maxFgY = 0;
let minFgX = width;
let maxFgX = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!foreground[idx(x, y, width)]) continue;
    if (y < minFgY) minFgY = y;
    if (y > maxFgY) maxFgY = y;
    if (x < minFgX) minFgX = x;
    if (x > maxFgX) maxFgX = x;
  }
}

let replaced = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y, width);
    const p = pixelOffset(i, channels);
    const color = [data[p], data[p + 1], data[p + 2]];
    const a = avg(color);
    const s = spread(color);

    const inTopMargin = y < minFgY + 6;
    const outsideEquipment =
      y < minFgY || y > maxFgY + 4 || x < minFgX - 4 || x > maxFgX + 4;

    const inTopZone = y < Math.floor(height * 0.15);

    const shouldReplace =
      (!foreground[i] &&
        (backdrop[i] ||
          (a >= 236 && s <= 20) ||
          (isBackdropLike(...color) && a >= 210))) ||
      (inTopMargin && isBackdropLike(...color) && a >= 190) ||
      (outsideEquipment && isBackdropLike(...color) && a >= 185) ||
      (inTopZone && isBackdropLike(...color) && a >= 175);

    if (!shouldReplace) continue;

    data[p] = BG[0];
    data[p + 1] = BG[1];
    data[p + 2] = BG[2];
    replaced++;
  }
}

function findCropTop() {
  const xStart = Math.floor(width * 0.18);
  const xEnd = Math.ceil(width * 0.82);

  for (let y = 0; y < height; y++) {
    let nonBg = 0;
    let sampled = 0;

    for (let x = xStart; x < xEnd; x++) {
      const color = rgb(data, x, y, width, channels);
      sampled++;
      if (!isExactBg(...color)) nonBg++;
    }

    if (nonBg / sampled > 0.025) {
      return Math.max(0, y - 10);
    }
  }

  return 0;
}

const cropTop = findCropTop();
const cropBottom = 0;
const cropLeft = 0;
const cropRight = 0;
const cropHeight = height - cropTop - cropBottom;
const cropWidth = width - cropLeft - cropRight;

const cropped = Buffer.alloc(cropWidth * cropHeight * channels);

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    const srcP = pixelOffset(idx(x + cropLeft, y + cropTop, width), channels);
    const dstP = (y * cropWidth + x) * channels;
    cropped[dstP] = data[srcP];
    cropped[dstP + 1] = data[srcP + 1];
    cropped[dstP + 2] = data[srcP + 2];
  }
}

const trimmed = await sharp(cropped, {
  raw: { width: cropWidth, height: cropHeight, channels },
})
  .trim({
    background: { r: BG[0], g: BG[1], b: BG[2] },
    threshold: 12,
  })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

await sharp(trimmed.data).toFile(output);

console.log(
  `Saved ${output} — recolored ${((replaced / total) * 100).toFixed(1)}%, manual top crop ${cropTop}px, trim → ${trimmed.info.width}x${trimmed.info.height}`,
);
