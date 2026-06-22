"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useEffect } from "react";

export function ScrollOrchestrator() {
  const lenis = useLenis();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    );

    const update = (scrollY: number) => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty(
        "--page-scroll",
        String(Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - vh))),
      );

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = 1 - Math.min(1, Math.abs(center - vh * 0.5) / (vh * 0.65));
        const shift = (center - vh * 0.5) * 0.06;

        section.style.setProperty("--section-progress", progress.toFixed(3));
        section.style.setProperty("--section-shift", shift.toFixed(2));

        const bg = section.querySelector<HTMLElement>(".section-scroll-bg");
        if (bg) {
          bg.style.transform = `translate3d(0, ${shift * 0.35}px, 0) scale(${1 + progress * 0.02})`;
        }

        const content = section.querySelector<HTMLElement>(".section-scroll-content");
        if (content) {
          const opacity = 0.72 + progress * 0.28;
          const scale = 0.985 + progress * 0.015;
          content.style.opacity = opacity.toFixed(3);
          content.style.transform = `translate3d(0, ${(1 - progress) * 18}px, 0) scale(${scale.toFixed(4)})`;
        }
      }
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lenis]);

  return null;
}
