"use client";

import { useEffect, useState } from "react";

export function PageIntro() {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }

    const exitTimer = window.setTimeout(() => setPhase("exit"), 900);
    const doneTimer = window.setTimeout(() => setPhase("done"), 1600);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`page-intro ${phase === "exit" ? "is-exiting" : ""}`}
      aria-hidden="true"
    >
      <div className="page-intro-curtain page-intro-curtain--left" />
      <div className="page-intro-curtain page-intro-curtain--right" />
      <div className="page-intro-logo font-display">
        <span className="page-intro-logo-mark">Z</span>
        <span className="page-intro-logo-text">ЗИП ФАСТ</span>
      </div>
    </div>
  );
}
