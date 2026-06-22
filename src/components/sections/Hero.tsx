import { brands, contacts, hero } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { TiltCard } from "@/components/ui/TiltCard";
import { BrandMarquee } from "@/components/ui/BrandMarquee";

const pillarDetails: Record<(typeof hero.highlights)[number], string> = {
  "Ремонт и ТО": "Диагностика, ремонт и плановое обслуживание промышленного пищевого оборудования",
  "Запчасти из импорта":
    "Оригинальные комплектующие — быстро, когда официальные каналы недоступны",
};

export function Hero() {
  return (
    <section
      id="top"
      data-scroll-section
      className="hero-main section-canvas section-canvas--base relative overflow-hidden"
    >
      <div className="section-scroll-bg" aria-hidden="true" />
      <div className="section-scroll-glow" aria-hidden="true" />
      <HeroBackground />

      <Container className="section-scroll-content relative z-[1]">
        <div className="hero-main-content">
          <Reveal variant="fade">
            <p className="hero-main-kicker font-display">
              <span className="hero-kicker-dot" aria-hidden="true" />
              ЗИП ФАСТ · с 2013 года
            </p>
          </Reveal>

          <Reveal delayMs={80} variant="up">
            <h1 className="hero-headline font-display">
              <span className="hero-headline-line">
                <span
                  className="hero-headline-part hero-headline-part--accent"
                  style={{ ["--hero-delay" as never]: "100ms" }}
                >
                  {hero.title}
                </span>
              </span>
              <span className="hero-headline-line">
                <span
                  className="hero-headline-part"
                  style={{ ["--hero-delay" as never]: "220ms" }}
                >
                  {hero.titleHighlight}
                </span>
              </span>
            </h1>
          </Reveal>

          <Reveal delayMs={160} variant="fade">
            <p className="hero-main-desc font-display">{hero.description}</p>
          </Reveal>

          <div className="hero-main-pillars">
            {hero.highlights.map((item, index) => (
              <Reveal
                key={item}
                delayMs={220 + index * 100}
                variant="scale"
                className="h-full"
              >
                <TiltCard className="h-full" intensity={14}>
                  <div className="hero-main-pillar fx-card-shine h-full">
                    <span className="hero-pillar-icon" aria-hidden="true">
                      {index === 0 ? "⚙" : "✦"}
                    </span>
                    <h2 className="hero-main-pillar-title font-display">{item}</h2>
                    <p className="hero-main-pillar-text font-display">
                      {pillarDetails[item]}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={480} variant="up">
            <div className="hero-main-cta">
              <Button
                href={contacts.phoneHref}
                className="hero-main-call-btn fx-btn-shine font-display"
              >
                Позвонить диспетчеру
              </Button>
              <a href={contacts.phoneHref} className="hero-main-phone font-display">
                {contacts.phoneDisplay}
              </a>
              <SocialLinks size="md" className="hero-main-social" />
            </div>
          </Reveal>

          <Reveal delayMs={560} variant="fade">
            <div className="hero-main-brands">
              <p className="hero-main-brands-label font-display">Обслуживаемые бренды</p>
              <BrandMarquee className="mt-4">
                {brands.map((brand) => (
                  <span key={brand.id} className="hero-main-brand fx-marquee-item font-display">
                    {brand.name}
                  </span>
                ))}
              </BrandMarquee>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
