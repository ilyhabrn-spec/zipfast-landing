"use client";

import { useEffect, useState } from "react";
import { contacts, navLinks } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-canvas-card text-accent transition-all duration-[400ms] hover:border-accent hover:bg-surface hover:shadow-[var(--shadow-soft)] sm:h-11 sm:w-11"
        style={{ transitionTimingFunction: "var(--ease-premium)" }}
      >
        <span
          className={`relative block h-3.5 w-4 transition-transform duration-500 sm:h-4 sm:w-5 ${
            open ? "rotate-90" : ""
          }`}
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-full w-full" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-full w-full" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        style={{
          top: "var(--header-height, 4.25rem)",
          transitionTimingFunction: "var(--ease-premium)",
        }}
        onClick={close}
        aria-hidden={!open}
      />

      <nav
        id="mobile-nav-panel"
        className={`mobile-menu-panel fixed inset-x-0 z-50 border-b border-border bg-canvas-card/95 px-6 py-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl lg:hidden ${
          open ? "is-open" : "is-closed"
        }`}
        style={{ top: "var(--header-height, 4.25rem)" }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-0.5">
          {navLinks.map((link, index) => (
            <li
              key={link.href}
              className="header-enter"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <a
                href={link.href}
                onClick={close}
                className="mobile-nav-link block rounded-xl px-4 py-3 text-sm text-foreground hover:bg-surface hover:text-accent sm:text-base"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-4 border-t border-accent/10 pt-6">
          <Button href={contacts.phoneHref} className="w-full font-display" onClick={close}>
            {contacts.phoneDisplay}
          </Button>
          <SocialLinks size="md" />
        </div>
      </nav>
    </div>
  );
}
