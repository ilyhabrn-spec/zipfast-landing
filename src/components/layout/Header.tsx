"use client";

import Link from "next/link";
import { useLenis } from "@/components/providers/ScrollProvider";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { HeaderActions } from "@/components/layout/HeaderActions";

export function Header() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = (y: number) => setScrolled(y > 12);

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

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--header-height",
      scrolled ? "3.75rem" : "4.25rem",
    );
  }, [scrolled]);

  return (
    <header
      className={`header-shell header-enter fixed inset-x-0 top-0 z-50 border-b border-border bg-canvas-card/88 backdrop-blur-xl ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <Container
        as="nav"
        className={`flex items-center justify-between gap-2 transition-[height] duration-500 ease-[var(--ease-premium)] sm:gap-3 lg:gap-4 ${
          scrolled
            ? "h-[3.75rem] sm:h-[4.25rem] lg:h-[4.75rem]"
            : "h-[4.25rem] sm:h-20 lg:h-[5.5rem]"
        }`}
      >
        <Link
          href="/"
          className="header-brand group flex min-w-0 shrink items-center gap-2 sm:gap-3 lg:gap-4"
        >
          <span className="header-logo-mark inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-accent-foreground shadow-[var(--shadow-red)] sm:h-10 sm:w-10 sm:rounded-2xl sm:text-base lg:h-12 lg:w-12 lg:text-lg">
            Z
          </span>
          <div className="flex min-w-0 flex-col justify-center gap-0.5 sm:gap-1">
            <span className="header-brand-title truncate text-[0.95rem] sm:text-lg lg:text-xl">
              {site.name}
            </span>
            <span className="header-brand-region truncate text-[8px] text-muted/90 sm:text-[10px] lg:text-[11px]">
              {site.headerRegion}
            </span>
          </div>
        </Link>

        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-9">
          {navLinks.map((link, index) => (
            <li
              key={link.href}
              className="header-enter"
              style={{
                animationDelay: `${120 + index * 50}ms`,
              }}
            >
              <a
                href={link.href}
                className="nav-link-premium whitespace-nowrap text-[10px] text-muted lg:text-[11px]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <HeaderActions />
      </Container>
    </header>
  );
}
