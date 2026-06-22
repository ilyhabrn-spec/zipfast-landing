import { features } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionShell } from "@/components/ui/SectionShell";

export function Features() {
  return (
    <SectionShell id="features" tone="band" className="py-20 lg:py-28">
      <Reveal variant="up" className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Сервис и <span className="text-gradient-red">ремонт</span>
        </h2>
        <p className="mt-4 text-muted">
          Полный цикл сервиса для предприятий Алтайского края и Республики
          Алтай: от экстренного ремонта до планового ТО пищевого, холодильного,
          теплового, моечного и стирального оборудования.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {features.map((feature, idx) => (
          <Reveal
            as="article"
            key={feature.title}
            delayMs={80 + idx * 90}
            variant={idx % 2 === 0 ? "left" : "right"}
          >
            <TiltCard intensity={12}>
              <div className="group fx-card-shine fx-card p-8">
                <div className="flex items-start gap-4">
                  <span
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-accent-soft)] bg-surface text-2xl"
                    role="img"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
