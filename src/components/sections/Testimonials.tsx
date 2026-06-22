import { testimonials } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionShell } from "@/components/ui/SectionShell";

export function Testimonials() {
  return (
    <SectionShell id="testimonials" tone="base" className="py-20 lg:py-28">
      <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Отзывы
        </h2>
        <p className="mt-4 text-muted">
          Социальное доказательство — отзывы реальных людей.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, idx) => (
          <Reveal
            as="blockquote"
            key={`${item.author}-${idx}`}
            delayMs={80 + idx * 110}
            variant="scale"
          >
            <TiltCard intensity={9}>
              <div className="fx-card-shine fx-card flex h-full flex-col p-8">
                <p className="flex-1 text-base leading-relaxed lg:text-lg">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-[var(--border-subtle)] pt-6">
                  <cite className="not-italic">
                    <span className="font-semibold">{item.author}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {item.role}
                    </span>
                  </cite>
                </footer>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
