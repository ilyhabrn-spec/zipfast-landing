"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "zipfast-game-promo-dismissed";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_DELAY_MS = 4500;
const SCROLL_TRIGGER_PX = 280;
const FALLBACK_DELAY_MS = 11000;

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < DISMISS_MS;
  } catch {
    return false;
  }
}

function rememberDismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function GamePromoPopup() {
  const [phase, setPhase] = useState<"idle" | "enter" | "visible" | "exit">("idle");

  const dismiss = useCallback(() => {
    rememberDismiss();
    setPhase("exit");
  }, []);

  useEffect(() => {
    if (isDismissedRecently()) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = false;
    let minDelayPassed = false;
    let scrolledEnough = false;

    const reveal = () => {
      if (shown) return;
      if (!minDelayPassed) return;
      if (!scrolledEnough) return;
      shown = true;
      setPhase(reduced ? "visible" : "enter");
      if (!reduced) {
        window.setTimeout(() => setPhase("visible"), 520);
      }
    };

    const onScroll = () => {
      if (window.scrollY >= SCROLL_TRIGGER_PX) {
        scrolledEnough = true;
        reveal();
      }
    };

    const minTimer = window.setTimeout(() => {
      minDelayPassed = true;
      reveal();
    }, MIN_DELAY_MS);

    const fallbackTimer = window.setTimeout(() => {
      scrolledEnough = true;
      reveal();
    }, FALLBACK_DELAY_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const timer = window.setTimeout(() => setPhase("idle"), 420);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "visible" && phase !== "enter") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, dismiss]);

  if (phase === "idle") return null;

  return (
    <div
      className={`game-promo ${phase === "enter" ? "is-entering" : ""} ${phase === "exit" ? "is-exiting" : ""}`}
      role="dialog"
      aria-labelledby="game-promo-title"
      aria-describedby="game-promo-desc"
    >
      <div className="game-promo__card fx-card">
        <button
          type="button"
          className="game-promo__close"
          onClick={dismiss}
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="game-promo__visual" aria-hidden>
          <div className="game-promo__gauge">
            <div className="game-promo__gauge-track" />
            <div className="game-promo__gauge-zone" />
            <div className="game-promo__gauge-needle" />
          </div>
          <span className="game-promo__badge">NEW</span>
        </div>

        <div className="game-promo__body">
          <p className="game-promo__eyebrow">Мини-игра</p>
          <h2 id="game-promo-title" className="game-promo__title">
            Сервис <span className="text-accent">Rush</span>
          </h2>
          <p id="game-promo-desc" className="game-promo__desc">
            45 секунд — попадай в зону «починки» и побей свой рекорд.
          </p>

          <div className="game-promo__actions">
            <Button href="/game" className="game-promo__cta w-full sm:w-auto">
              Играть
            </Button>
            <button type="button" className="game-promo__later" onClick={dismiss}>
              Не сейчас
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
