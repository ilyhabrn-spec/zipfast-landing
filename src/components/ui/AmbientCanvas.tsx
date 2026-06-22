"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useEffect, useRef } from "react";

export function AmbientCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.style.setProperty("--scroll-progress", "0");
      root.style.setProperty("--ambient-section", "0");
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    );

    const update = (scrollY: number) => {
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(1, scrollY / maxScroll);
      const wave = Math.sin(progress * Math.PI * 3);
      const wave2 = Math.cos(progress * Math.PI * 2);

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-y", `${scrollY.toFixed(1)}px`);
      root.style.setProperty("--scroll-wave", wave.toFixed(4));
      root.style.setProperty("--scroll-wave-2", wave2.toFixed(4));

      let active = 0;
      let best = -1;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible > best) {
          best = visible;
          active = index;
        }
      });

      const phase = active / Math.max(1, sections.length - 1);
      root.style.setProperty("--ambient-section", String(active));
      root.style.setProperty("--section-phase", phase.toFixed(4));
    };

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => update(scroll);
      lenis.on("scroll", onScroll);
      update(lenis.scroll);
      return () => lenis.off("scroll", onScroll);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(window.scrollY));
    };

    update(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lenis]);

  return (
    <div ref={rootRef} className="ambient-field" aria-hidden="true">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="ambient-line-slate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0" />
            <stop offset="40%" stopColor="#64748b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ambient-line-stone" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78716c" stopOpacity="0" />
            <stop offset="50%" stopColor="#78716c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#78716c" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="ambient-field__base" />

      <div className="ambient-field__layer ambient-field__layer--deep">
        <div className="ambient-obj ambient-obj--orb ambient-obj--orb-a" />
        <div className="ambient-obj ambient-obj--orb ambient-obj--orb-b" />
      </div>

      <div className="ambient-field__layer ambient-field__layer--lines">
        <svg
          className="ambient-geo ambient-geo--line-a"
          viewBox="0 0 320 320"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <line x1="24" y1="280" x2="296" y2="48" stroke="url(#ambient-line-slate)" strokeWidth="1" strokeLinecap="round" />
          <line x1="48" y1="296" x2="180" y2="120" stroke="rgba(100,116,139,0.16)" strokeWidth="0.75" strokeLinecap="round" />
        </svg>

        <svg
          className="ambient-geo ambient-geo--line-b"
          viewBox="0 0 320 320"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <line x1="32" y1="48" x2="288" y2="272" stroke="url(#ambient-line-stone)" strokeWidth="0.9" strokeLinecap="round" />
        </svg>

        <svg
          className="ambient-geo ambient-geo--flow"
          viewBox="0 0 400 400"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M 32 320 Q 140 60 220 200 T 368 88"
            stroke="url(#ambient-line-slate)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M 368 312 Q 260 140 180 228 T 32 96"
            stroke="rgba(148,163,184,0.2)"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="ambient-field__layer ambient-field__layer--mid">
        <svg
          className="ambient-geo ambient-geo--ring"
          viewBox="0 0 200 200"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <circle cx="100" cy="100" r="88" stroke="rgba(100,116,139,0.14)" strokeWidth="0.65" />
          <circle cx="100" cy="100" r="58" stroke="rgba(148,163,184,0.18)" strokeWidth="0.55" />
          <circle cx="100" cy="100" r="32" stroke="rgba(120,113,108,0.12)" strokeWidth="0.45" />
        </svg>

        <svg
          className="ambient-geo ambient-geo--hex"
          viewBox="0 0 200 200"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <polygon
            points="100,18 172,60 172,140 100,182 28,140 28,60"
            stroke="rgba(100,116,139,0.16)"
            strokeWidth="0.85"
          />
        </svg>

        <svg
          className="ambient-geo ambient-geo--arc"
          viewBox="0 0 200 200"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M 28 140 Q 100 20 172 100"
            stroke="rgba(120,113,108,0.18)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="ambient-field__layer ambient-field__layer--front">
        <div className="ambient-obj ambient-obj--blob" />
      </div>
    </div>
  );
}
