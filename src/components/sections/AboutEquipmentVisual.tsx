"use client";

import { useLenis } from "@/components/providers/ScrollProvider";
import { useEffect, useRef } from "react";

type AboutEquipmentVisualProps = {
  className?: string;
};

export function AboutEquipmentVisual({ className = "" }: AboutEquipmentVisualProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const update = (scrollY: number) => {
      const el = wrapRef.current;
      if (!el || !imageRef.current) return;

      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = (center - viewportCenter) / window.innerHeight;
      const rotate = distance * -3;
      const translateY = distance * -24;
      const scale = 1 + Math.max(0, 0.05 - Math.abs(distance) * 0.07);

      imageRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
    };

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => update(scroll);
      lenis.on("scroll", onScroll);
      update(lenis.scroll);
      return () => lenis.off("scroll", onScroll);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(window.scrollY));
    };

    update(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <div ref={wrapRef} className={`about-equipment ${className}`}>
      <div ref={imageRef} className="about-equipment-frame will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/parokonvektomat-mkn.png"
          alt="Промышленный пароконвектомат MKN FlexiCombi Classic"
          width={1990}
          height={1521}
          className="about-equipment-image"
          decoding="async"
          loading="eager"
        />
      </div>

      <div className="about-equipment-chip about-equipment-chip--clients fx-float-chip">
        <span className="about-equipment-chip-value font-display">40+</span>
        <span className="about-equipment-chip-label font-display">сервисных клиентов</span>
      </div>

      <div className="about-equipment-chip about-equipment-chip--model font-display fx-float-chip fx-float-chip--delay">
        MKN FlexiCombi
      </div>
    </div>
  );
}
