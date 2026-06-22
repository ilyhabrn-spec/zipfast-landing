"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "fade" | "scale" | "left" | "right";
  as?: "div" | "section" | "article" | "header" | "footer" | "blockquote";
};

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "up",
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  });

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${variant} ${inView ? "is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as never]: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}

