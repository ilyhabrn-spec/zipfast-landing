import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <div className={`fx-glow-card ${className}`}>
      <div className="fx-glow-card-border" aria-hidden="true" />
      <div className="fx-glow-card-content">{children}</div>
    </div>
  );
}
