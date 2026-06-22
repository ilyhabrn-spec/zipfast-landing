import { HeaderContactPill } from "@/components/layout/HeaderContactPill";
import { HeaderSocialBar } from "@/components/layout/HeaderSocialBar";
import { MobileNav } from "@/components/layout/MobileNav";

type HeaderActionsProps = {
  scrolled?: boolean;
};

export function HeaderActions({ scrolled = false }: HeaderActionsProps) {
  return (
    <div
      className={`flex shrink-0 items-center gap-1.5 transition-transform duration-500 sm:gap-2.5 lg:gap-3 ${
        scrolled ? "scale-[0.97]" : "scale-100"
      }`}
      style={{ transitionTimingFunction: "var(--ease-premium)" }}
    >
      <HeaderSocialBar />
      <span
        className="hidden h-5 w-px shrink-0 bg-gradient-to-b from-transparent via-accent/25 to-transparent sm:block"
        aria-hidden="true"
      />
      <HeaderContactPill />
      <MobileNav />
    </div>
  );
}
