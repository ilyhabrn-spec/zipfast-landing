import { steps } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";

export function HowItWorks() {
  return (
    <SectionShell id="how-it-works" tone="band" className="py-20 lg:py-28">
      <Reveal variant="up" className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Процесс работы
        </h2>
        <p className="mt-4 text-muted">
          Чёткий порядок действий, чтобы минимизировать простой и риски.
        </p>
      </Reveal>

      <ol className="mt-16 grid gap-8 lg:grid-cols-3">
        {steps.map((item, index) => (
          <li key={item.step} className="relative">
            {index < steps.length - 1 && (
              <div
                className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border lg:block"
                aria-hidden="true"
              />
            )}
            <Reveal delayMs={80 + index * 100} variant="up">
              <div className="fx-card p-8 text-center lg:text-left">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-accent-soft)] bg-surface text-lg font-bold text-accent">
                  {item.step}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
