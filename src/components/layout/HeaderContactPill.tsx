import { contacts } from "@/lib/constants";

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
      aria-hidden="true"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeaderContactPill() {
  return (
    <a
      href={contacts.phoneHref}
      className="phone-pill-premium group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-2.5 py-1.5 font-bold text-accent-foreground shadow-[var(--shadow-red)] hover:bg-accent-secondary hover:shadow-[0_16px_48px_rgba(230,0,18,0.35)] sm:gap-2 sm:px-4 sm:py-2 lg:px-5"
    >
      <PhoneIcon />
      <span className="relative z-[1] whitespace-nowrap text-[10px] font-bold leading-none tracking-tight sm:text-xs lg:text-sm">
        <span className="sm:hidden">{contacts.phoneDisplayShort}</span>
        <span className="hidden sm:inline">{contacts.phoneDisplay}</span>
      </span>
    </a>
  );
}
