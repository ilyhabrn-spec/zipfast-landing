"use client";

import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({
  children,
  className = "",
  intensity = 10,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    el.style.setProperty("--tilt-x", `${(-y * intensity).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * intensity).toFixed(2)}deg`);
    el.style.setProperty("--tilt-glow-x", `${(x * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--tilt-glow-y", `${(y * 100 + 50).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-glow-x", "50%");
    el.style.setProperty("--tilt-glow-y", "50%");
  };

  return (
    <div
      ref={ref}
      className={`fx-tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="fx-tilt-inner">{children}</div>
    </div>
  );
}
