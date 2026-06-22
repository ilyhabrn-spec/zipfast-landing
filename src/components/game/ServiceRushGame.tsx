"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Phase = "idle" | "playing" | "over";

const GAME_MS = 45_000;
const START_ZONE = 0.22;
const MIN_ZONE = 0.07;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function ServiceRushGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({
    phase: "idle" as Phase,
    startedAt: 0,
    pointer: 0.5,
    pointerDir: 1,
    speed: 1.35,
    zoneCenter: 0.5,
    zoneWidth: START_ZONE,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hits: 0,
    misses: 0,
    flash: 0,
    shake: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  const [ui, setUi] = useState({
    phase: "idle" as Phase,
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeft: GAME_MS / 1000,
    best: 0,
  });

  useEffect(() => {
    const best = Number(localStorage.getItem("service-rush-best") || 0);
    setUi((s) => ({ ...s, best }));
  }, []);

  const syncUi = useCallback((partial?: Partial<typeof ui>) => {
    const s = stateRef.current;
    setUi((prev) => ({
      ...prev,
      phase: s.phase,
      score: s.score,
      combo: s.combo,
      bestCombo: s.bestCombo,
      timeLeft: s.phase === "playing" ? Math.max(0, (GAME_MS - (performance.now() - s.startedAt)) / 1000) : prev.timeLeft,
      ...partial,
    }));
  }, []);

  const spawnParticles = (x: number, y: number, ok: boolean) => {
    const s = stateRef.current;
    const color = ok ? "#e60012" : "#64748b";
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * (1.5 + Math.random() * 2.5),
        vy: Math.sin(angle) * (1.5 + Math.random() * 2.5),
        life: 1,
        color,
      });
    }
  };

  const resetRound = () => {
    const s = stateRef.current;
    s.phase = "playing";
    s.startedAt = performance.now();
    s.pointer = 0.5;
    s.pointerDir = 1;
    s.speed = 1.35;
    s.zoneCenter = 0.5;
    s.zoneWidth = START_ZONE;
    s.score = 0;
    s.combo = 0;
    s.bestCombo = 0;
    s.hits = 0;
    s.misses = 0;
    s.flash = 0;
    s.shake = 0;
    s.particles = [];
    syncUi({ timeLeft: GAME_MS / 1000 });
  };

  const endRound = useCallback(() => {
    const s = stateRef.current;
    s.phase = "over";
    const best = Number(localStorage.getItem("service-rush-best") || 0);
    if (s.score > best) {
      localStorage.setItem("service-rush-best", String(s.score));
      syncUi({ best: s.score });
    } else {
      syncUi({ best });
    }
  }, [syncUi]);

  const handleAction = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "idle" || s.phase === "over") {
      resetRound();
      return;
    }
    if (s.phase !== "playing") return;

    const half = s.zoneWidth / 2;
    const inZone = s.pointer >= s.zoneCenter - half && s.pointer <= s.zoneCenter + half;

    if (inZone) {
      s.hits += 1;
      s.combo += 1;
      s.bestCombo = Math.max(s.bestCombo, s.combo);
      const comboBonus = 1 + Math.floor(s.combo / 5) * 0.5;
      s.score += Math.round(10 * comboBonus);
      s.speed = clamp(s.speed + 0.08, 1.35, 4.2);
      s.zoneWidth = clamp(s.zoneWidth - 0.004, MIN_ZONE, START_ZONE);
      s.zoneCenter = clamp(Math.random(), 0.15 + half, 0.85 - half);
      s.flash = 1;
      spawnParticles(s.pointer, 0.5, true);
    } else {
      s.misses += 1;
      s.combo = 0;
      s.score = Math.max(0, s.score - 5);
      s.shake = 1;
      spawnParticles(s.pointer, 0.5, false);
    }
    syncUi();
  }, [syncUi, endRound]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "Enter") return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest("a, button, input, textarea, select, [contenteditable='true']") &&
        !target.closest(".game-canvas-wrap")
      ) {
        return;
      }

      e.preventDefault();
      handleAction();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (s.phase === "playing") {
        const elapsed = now - s.startedAt;
        if (elapsed >= GAME_MS) endRound();

        s.pointer += s.pointerDir * s.speed * dt * 0.85;
        if (s.pointer >= 1) {
          s.pointer = 1;
          s.pointerDir = -1;
        }
        if (s.pointer <= 0) {
          s.pointer = 0;
          s.pointerDir = 1;
        }

        s.flash = Math.max(0, s.flash - dt * 3.5);
        s.shake = Math.max(0, s.shake - dt * 4);
        s.particles = s.particles
          .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt * 1.8 }))
          .filter((p) => p.life > 0);

        if (Math.floor(elapsed / 1000) !== Math.floor((elapsed - dt * 1000) / 1000)) {
          syncUi();
        }
      }

      const shakeX = s.shake * (Math.random() - 0.5) * 8;
      const shakeY = s.shake * (Math.random() - 0.5) * 4;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#f8f9fb");
      bg.addColorStop(1, "#eef1f6");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (s.flash > 0) {
        ctx.fillStyle = `rgba(230, 0, 18, ${s.flash * 0.08})`;
        ctx.fillRect(0, 0, w, h);
      }

      const barW = Math.min(w * 0.88, 520);
      const barH = 28;
      const barX = (w - barW) / 2 + shakeX;
      const barY = h * 0.46 + shakeY;

      const half = (s.zoneWidth * barW) / 2;
      const zoneX = barX + s.zoneCenter * barW - half;

      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 14);
      ctx.fill();

      const zoneGrad = ctx.createLinearGradient(zoneX, barY, zoneX + half * 2, barY);
      zoneGrad.addColorStop(0, "rgba(230,0,18,0.55)");
      zoneGrad.addColorStop(0.5, "rgba(230,0,18,0.95)");
      zoneGrad.addColorStop(1, "rgba(230,0,18,0.55)");
      ctx.fillStyle = zoneGrad;
      ctx.beginPath();
      ctx.roundRect(zoneX, barY, half * 2, barH, 12);
      ctx.fill();

      const ptrX = barX + s.pointer * barW;
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.moveTo(ptrX, barY - 10);
      ctx.lineTo(ptrX - 8, barY - 26);
      ctx.lineTo(ptrX + 8, barY - 26);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ptrX, barY + 2);
      ctx.lineTo(ptrX, barY + barH + 18);
      ctx.stroke();

      for (const p of s.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(barX + p.x * barW, barY + barH / 2 + p.y * 40, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (s.phase === "idle" || s.phase === "over") {
        ctx.fillStyle = "rgba(248, 249, 251, 0.82)";
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [syncUi, endRound]);

  const shareScore = async () => {
    const text = `Я набрал ${ui.score} очков в «Сервис Rush» от ЗИП ФАСТ! Сможешь больше?`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/game` : "https://zip-fast.ru/game";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Сервис Rush", text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    alert("Результат скопирован — отправьте друзьям!");
  };

  return (
    <div className="game-shell mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">ЗИП ФАСТ presents</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Сервис <span className="text-accent">Rush</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted sm:text-base">
          Поймай красную зону — «почини» оборудование. 45 секунд, растущая скорость, комбо × очки.
        </p>
      </div>

      <div className="game-hud mb-4 grid w-full grid-cols-3 gap-3 text-center text-sm">
        <div className="fx-card rounded-2xl px-3 py-2">
          <p className="text-muted">Очки</p>
          <p className="font-display text-2xl font-bold">{ui.score}</p>
        </div>
        <div className="fx-card rounded-2xl px-3 py-2">
          <p className="text-muted">Комбо</p>
          <p className="font-display text-2xl font-bold text-accent">×{ui.combo}</p>
        </div>
        <div className="fx-card rounded-2xl px-3 py-2">
          <p className="text-muted">Время</p>
          <p className="font-display text-2xl font-bold">{ui.timeLeft.toFixed(0)}с</p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        className="game-canvas-wrap relative w-full overflow-hidden rounded-3xl border border-border bg-white shadow-[var(--shadow-elevated)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        onClick={handleAction}
        aria-label="Играть"
      >
        <canvas ref={canvasRef} className="block h-[min(52vh,420px)] w-full touch-none" />

        {ui.phase === "idle" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/75 p-6 text-center backdrop-blur-sm">
            <p className="font-display text-2xl font-bold">Тап / Пробел — старт</p>
            <p className="text-sm text-muted">Попади стрелкой в красную зону</p>
            {ui.best > 0 && <p className="text-sm text-muted">Рекорд: {ui.best}</p>}
          </div>
        )}

        {ui.phase === "over" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 p-6 text-center backdrop-blur-sm">
            <p className="font-display text-3xl font-bold">Время!</p>
            <p className="text-lg">
              Очки: <strong>{ui.score}</strong> · Лучшее комбо: <strong>{ui.bestCombo}</strong>
            </p>
            {ui.score >= ui.best && ui.score > 0 && (
              <p className="text-sm font-semibold text-accent">Новый рекорд!</p>
            )}
            <p className="mt-2 text-sm text-muted">Тап — сыграть снова</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted sm:text-sm">
        {ui.phase === "playing" ? "Жми в нужный момент — промах сбрасывает комбо" : "Работает на телефоне и компьютере"}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {ui.phase === "over" && (
          <button
            type="button"
            onClick={shareScore}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-red)] transition hover:bg-accent-secondary"
          >
            Поделиться результатом
          </button>
        )}
        <Link
          href="/"
          className="rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          onClick={() => {
            stateRef.current.phase = "idle";
          }}
        >
          На главную
        </Link>
      </div>

      {ui.best > 0 && ui.phase !== "idle" && (
        <p className="mt-4 text-sm text-muted">Личный рекорд: {ui.best}</p>
      )}
    </div>
  );
}
