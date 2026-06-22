import { contacts, cta } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionShell } from "@/components/ui/SectionShell";

export function Cta() {
  return (
    <SectionShell id="cta" tone="band" className="py-20 lg:py-28">
      <Reveal variant="scale">
        <GlowCard className="relative overflow-hidden px-8 py-16 text-center lg:px-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_60%)] opacity-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-red"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-accent-secondary/10 blur-3xl"
            aria-hidden="true"
          />

          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            {cta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">
            {cta.subtitle}
          </p>

          <div className="relative mt-8 flex flex-col items-center gap-6">
            <Button href={contacts.phoneHref} className="fx-btn-shine elevated">
              {cta.button}
            </Button>

            <a
              href={contacts.phoneHref}
              className="text-2xl font-bold text-accent transition-colors hover:text-accent-secondary"
            >
              {contacts.phoneDisplay}
            </a>

            <SocialLinks size="md" />

            <a
              href={contacts.emailHref}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {contacts.email}
            </a>
          </div>
        </GlowCard>
      </Reveal>
    </SectionShell>
  );
}
