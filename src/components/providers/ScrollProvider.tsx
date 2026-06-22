"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  return (header?.getBoundingClientRect().height ?? 88) + 12;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.45,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      lerp: 0.085,
    });

    setLenis(instance);

    const onScrollState = () => {
      document.documentElement.classList.add("is-scrolling");
    };
    instance.on("scroll", onScrollState);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      let linkPath: string;
      let id: string;

      if (href.startsWith("#")) {
        linkPath = window.location.pathname;
        id = decodeURIComponent(href.slice(1));
      } else {
        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return;
        linkPath = href.slice(0, hashIndex) || "/";
        id = decodeURIComponent(href.slice(hashIndex + 1));
      }

      if (!id) return;
      if (linkPath !== window.location.pathname) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      instance.scrollTo(target, { offset: -getHeaderOffset(), duration: 1.15 });
      window.history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      instance.off("scroll", onScrollState);
      document.removeEventListener("click", onAnchorClick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
