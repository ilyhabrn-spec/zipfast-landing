"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Section = { id: string; label: string };

type ScrollProgressProps = {
  sections: Section[];
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  return (header?.getBoundingClientRect().height ?? 88) + 12;
}

function getSectionTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function ScrollProgress({ sections }: ScrollProgressProps) {
  const lenis = useLenis();
  const fillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "top");

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  const applyProgress = useCallback((value: number) => {
    const next = clamp01(value);
    if (Math.abs(next - progressRef.current) < 0.0005) return;
    progressRef.current = next;
    const fill = fillRef.current;
    if (fill) {
      fill.style.transform = `scale3d(${next}, 1, 1)`;
    }
  }, []);

  const updateActiveSection = useCallback(
    (scrollY: number) => {
      const offset = getHeaderOffset();
      const marker = scrollY + offset;

      let current = sections[0]?.id ?? "top";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (getSectionTop(el) <= marker + 4) {
          current = section.id;
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    },
    [sections],
  );

  const updateFromScroll = useCallback(
    (scrollY: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      applyProgress(scrollY / max);
      updateActiveSection(scrollY);
    },
    [applyProgress, updateActiveSection],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      const offset = -getHeaderOffset();

      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 1.15 });
      } else {
        window.scrollTo({
          top: Math.max(0, getSectionTop(el) + offset),
          behavior: "smooth",
        });
      }

      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    },
    [lenis],
  );

  useEffect(() => {
    const initialY = lenis?.scroll ?? window.scrollY;
    updateFromScroll(initialY);

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => updateFromScroll(scroll);
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateFromScroll(window.scrollY));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lenis, updateFromScroll]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ids.includes(hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, [ids, scrollToSection]);

  return (
    <>
      <div className="scroll-progress-track" aria-hidden="true">
        <div ref={fillRef} className="scroll-progress-fill" />
      </div>

      <aside className="scroll-nav">
        <div className="scroll-nav-panel">
          <ul className="scroll-nav-list">
            {sections.map((s) => {
              const active = s.id === activeId;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(s.id);
                    }}
                    className={`scroll-nav-dot group ${active ? "is-active" : ""}`}
                    aria-label={s.label}
                    aria-current={active ? "true" : undefined}
                  >
                    <span className="scroll-nav-dot-core" />
                    <span className={`scroll-nav-label font-display ${active ? "is-visible" : ""}`}>
                      {s.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
