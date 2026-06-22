"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "top");

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  const updateActiveSection = useCallback(() => {
    const offset = getHeaderOffset();
    const marker = window.scrollY + offset;

    let current = sections[0]?.id ?? "top";

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      if (getSectionTop(el) <= marker + 4) {
        current = section.id;
      }
    }

    setActiveId(current);
  }, [sections]);

  const updateProgress = useCallback(() => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    setProgress(clamp01(window.scrollY / max));
    updateActiveSection();
  }, [updateActiveSection]);

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
    updateProgress();

    if (lenis) {
      lenis.on("scroll", updateProgress);
      return () => lenis.off("scroll", updateProgress);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lenis, updateProgress]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ids.includes(hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, [ids, scrollToSection]);

  return (
    <>
      <div className="scroll-progress-track" aria-hidden="true">
        <div
          className="scroll-progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
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
