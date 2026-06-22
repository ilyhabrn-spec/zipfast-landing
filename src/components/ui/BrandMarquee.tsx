import type { ReactNode } from "react";

type BrandMarqueeProps = {
  children: ReactNode;
  className?: string;
};

export function BrandMarquee({ children, className = "" }: BrandMarqueeProps) {
  return (
    <div className={`fx-marquee ${className}`}>
      <div className="fx-marquee-track">
        <div className="fx-marquee-group">{children}</div>
        <div className="fx-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
