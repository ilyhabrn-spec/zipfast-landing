import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, "../public/images/parokonvektomat.jpg");
const output = path.join(__dirname, "../public/images/parokonvektomat.png");

function idx(x, y, width) {
  return y * width + x;
}

function rgb(data, x, y, width) {
  const p = idx(x, y, width) * 4;
  return [data[p], data[p + 1], data[p + 2]];
}

function avg([r, g, b]) {
  return (r + g + b) / 3;
}

function spread([r, g, b]) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isBackdropLike(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a >= 168 && s <= 34;
}

function isStrictWhite(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a >= 244 && s <= 14;
}

function isForegroundSeed(r, g, b) {
  const a = avg([r, g, b]);
  const s = spread([r, g, b]);
  return a < 128 || s > 42;
}

function canGrowForeground(r, g, b) {
  return avg([r, g, b]) < 238;
}

const NEIGHBORS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function flood(data, width, height, seedFn, growFn) {
  const mask = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    const i = idx(x, y, width);
    if (mask[i]) return;
    const [r, g, b] = rgb(data, x, y, width);
    if (!seedFn(r, g, b, x, y)) return;
    mask[i] = 1;
    queue.push(i);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const i = queue.pop();
    const x = i % width;
    const y = (i - x) / width;
    const [pr, pg, pb] = rgb(data, x, y, width);
    const parentAvg = avg([pr, pg, pb]);

    for (const [dx, dy] of NEIGHBORS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

      const ni = idx(nx, ny, width);
      if (mask[ni]) continue;

      const [r, g, b] = rgb(data, nx, ny, width);
      if (!growFn(r, g, b, parentAvg)) continue;

      mask[ni] = 1;
      queue.push(ni);
    }
  }

  return mask;
}

function floodFromSeeds(data, width, height, seeds, growFn) {
  const mask = new Uint8Array(width * height);
  const queue = [];

  for (const [x, y] of seeds) {
    const i = idx(x, y, width);
    if (mask[i]) continue;
    const [r, g, b] = rgb(data, x, y, width);
    if (!growFn(r, g, b, 255)) continue;
    mask[i] = 1;
    queue.push(i);
  }

  while (queue.length) {
    const i = queue.pop();
    const x = i % width;
    const y = (i - x) / width;

    for (const [dx, dy] of NEIGHBORS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

      const ni = idx(nx, ny, width);
      if (mask[ni]) continue;

      const [r, g, b] = rgb(data, nx, ny, width);
      if (!growFn(r, g, b, 255)) continue;

      mask[ni] = 1;
      queue.push(ni);
    }
  }

  return mask;
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const total = width * height;

const backdrop = flood(
  data,
  width,
  height,
  (r, g, b) => isStrictWhite(r, g, b),
  (r, g, b, parentAvg) => {
    if (!isBackdropLike(r, g, b)) return false;
    return avg([r, g, b]) >= parentAvg - 20;
  },
);

const seeds = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b] = rgb(data, x, y, width);
    if (isForegroundSeed(r, g, b)) seeds.push([x, y]);
  }
}

const foreground = floodFromSeeds(data, width, height, seeds, (r, g, b) =>
  canGrowForeground(r, g, b),
);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y, width);
    const p = i * 4;
    const color = rgb(data, x, y, width);

    if (backdrop[i] || (isBackdropLike(...color) && !foreground[i])) {
      data[p + 3] = 0;
      continue;
    }

    if (!foreground[i] || !isBackdropLike(...color)) continue;

    let touchesVoid = false;
    for (const [dx, dy] of NEIGHBORS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = idx(nx, ny, width);
      if (backdrop[ni] || (isBackdropLike(...rgb(data, nx, ny, width)) && !foreground[ni])) {
        touchesVoid = true;
        break;
      }
    }

    if (touchesVoid) {
      const a = avg(color);
      const feather = Math.min(1, Math.max(0, (a - 168) / 58));
      data[p + 3] = Math.round(255 * (1 - feather * 0.85));
    }
  }
}

await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(output);

let transparent = 0;
let semi = 0;
let opaqueBg = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = idx(x, y, width) * 4;
    const a = data[p + 3];
    const color = [data[p], data[p + 1], data[p + 2]];
    if (a < 20) transparent++;
    else if (a < 240) semi++;
    else if (isBackdropLike(...color)) opaqueBg++;
  }
}

console.log(
  `Saved ${output} — transparent ${((transparent / total) * 100).toFixed(1)}%, semi ${((semi / total) * 100).toFixed(1)}%, leftover bg ${((opaqueBg / total) * 100).toFixed(1)}%`,
);
