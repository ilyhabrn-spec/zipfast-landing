import Image from "next/image";
import { brands, brandsNote } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";

export function Brands() {
  return (
    <SectionShell id="brands" tone="deep" className="py-20 lg:py-28">
      <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Обслуживаемые бренды
        </h2>
        <p className="mt-4 text-muted">
          Ремонтируем и обслуживаем профессиональное оборудование ведущих
          европейских производителей — с поставкой санкционных запчастей из
          любой точки мира.
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-5xl lg:grid-cols-5 lg:gap-5">
        {brands.map((brand, idx) => (
          <Reveal key={brand.id} delayMs={60 + idx * 70} variant="scale">
            <div className="brand-card fx-card flex aspect-square w-full flex-col items-center justify-center gap-3 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] sm:p-5">
              <div className="brand-card__logo relative h-16 w-[8rem] sm:h-[4.5rem] sm:w-[8.5rem]">
                <Image
                  src={brand.logo}
                  alt={`Логотип ${brand.name}`}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 640px) 40vw, 136px"
                />
              </div>
              <span className="text-center text-sm font-bold tracking-wide text-foreground sm:text-base">
                {brand.name}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={400} variant="fade" className="mx-auto mt-8 max-w-xl text-center">
        <p className="text-sm text-muted">{brandsNote}</p>
      </Reveal>
    </SectionShell>
  );
}
