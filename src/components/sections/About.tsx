import { company, equipmentTypes, stats } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { AboutEquipmentVisual } from "@/components/sections/AboutEquipmentVisual";

export function About() {
  return (
    <SectionShell id="about" tone="base" className="py-20 lg:py-28" scrollFx={false}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="section-scroll-content">
          <Reveal variant="left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              О компании
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-gradient-red">ЗИП ФАСТ</span> — сервис
              полного цикла в Алтайском крае и Республике Алтай
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {company.paragraphs.map((paragraph, idx) => (
              <Reveal key={idx} delayMs={80 + idx * 80} variant="fade">
                <p className="text-muted leading-relaxed">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={320} variant="scale">
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, idx) => (
                <TiltCard key={stat.label} intensity={8}>
                  <div
                    className="fx-stat-card fx-card p-4 text-center"
                    style={{ ["--stat-delay" as never]: `${idx * 80}ms` }}
                  >
                    <div className="text-2xl font-bold text-accent sm:text-3xl">
                      <CountUp value={stat.value} />
                    </div>
                    <div className="mt-1 text-xs text-muted">{stat.label}</div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delayMs={120} variant="right" className="relative">
          <AboutEquipmentVisual />
        </Reveal>
      </div>

      <Reveal delayMs={200} variant="up" className="section-scroll-content mt-20">
        <h3 className="text-center text-2xl font-bold sm:text-3xl">
          Направления <span className="text-gradient-red">оборудования</span>
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          Ремонтируем и обслуживаем промышленное оборудование любой сложности
          — пищевое, холодильное, тепловое, моечное и стиральное.
        </p>
      </Reveal>

      <div className="section-scroll-content mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {equipmentTypes.map((type, idx) => (
          <Reveal key={type.title} delayMs={60 + idx * 70} variant="scale">
            <TiltCard intensity={10} className="h-full">
              <div className="group fx-card-shine fx-card h-full p-6 text-center">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {type.icon}
                </span>
                <h4 className="mt-4 font-bold text-foreground">{type.title}</h4>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {type.description}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
