import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionShellProps = {
  id: string;
  children: ReactNode;
  tone?: "base" | "band" | "deep";
  className?: string;
  scrollFx?: boolean;
};

export function SectionShell({
  id,
  children,
  tone = "base",
  className = "",
  scrollFx = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-scroll-section
      className={`section-canvas section-canvas--${tone} section-flow ${className}`}
    >
      <div className="section-scroll-bg" aria-hidden="true" />
      <Container
        className={`relative z-[1] ${scrollFx ? "section-scroll-content" : ""}`}
      >
        {children}
      </Container>
    </section>
  );
}
