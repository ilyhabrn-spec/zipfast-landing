"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 17) % 84)}%`,
  top: `${12 + ((i * 23) % 76)}%`,
  size: 3 + (i % 3),
  delay: `${(i * 0.35).toFixed(2)}s`,
  duration: `${4.5 + (i % 4)}s`,
}));

export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const updateParallax = (scrollY: number) => {
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0) scale(${1 + scrollY * 0.00008})`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(0, ${scrollY * 0.11}px, 0) scale(${1 + scrollY * 0.00005})`;
      }
      if (rootRef.current) {
        rootRef.current.style.setProperty("--hero-scroll", `${scrollY * 0.0004}`);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !rootRef.current) return;

      const rect = rootRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      spotlightRef.current.style.setProperty("--spot-x", `${x}%`);
      spotlightRef.current.style.setProperty("--spot-y", `${y}%`);
      rootRef.current.style.setProperty("--mouse-x", `${x}%`);
      rootRef.current.style.setProperty("--mouse-y", `${y}%`);
    };

    let scrollCleanup: (() => void) | undefined;

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => updateParallax(scroll);
      lenis.on("scroll", onScroll);
      updateParallax(lenis.scroll);
      scrollCleanup = () => lenis.off("scroll", onScroll);
    } else {
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => updateParallax(window.scrollY));
      };
      updateParallax(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      scrollCleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
      };
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      scrollCleanup?.();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [lenis]);

  return (
    <div ref={rootRef} className="hero-fx-root pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-main-bg absolute inset-0" />

      <div
        ref={spotlightRef}
        className="hero-fx-spotlight absolute inset-0"
        aria-hidden="true"
      />

      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="hero-fx-particle absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          aria-hidden="true"
        />
      ))}

      <div
        ref={leftRef}
        className="hero-main-glow hero-main-glow--left hero-fx-orb absolute rounded-full will-change-transform"
      />
      <div
        ref={rightRef}
        className="hero-main-glow hero-main-glow--right hero-fx-orb absolute rounded-full will-change-transform"
      />
      <div className="hero-fx-ring hero-fx-ring--1 absolute rounded-full" aria-hidden="true" />
      <div className="hero-fx-ring hero-fx-ring--2 absolute rounded-full" aria-hidden="true" />
    </div>
  );
}
