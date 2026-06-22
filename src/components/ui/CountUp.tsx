"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type CountUpProps = {
  value: string;
  className?: string;
  durationMs?: number;
};

function parseValue(raw: string) {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { target: null as number | null, suffix: raw };
  return { target: Number(match[1]), suffix: match[2] ?? "" };
}

export function CountUp({
  value,
  className = "",
  durationMs = 1400,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const { target, suffix } = parseValue(value);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || target === null) return;
    started.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(`${Math.round(target * eased)}${suffix}`);

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target, suffix, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
