import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Brands } from "@/components/sections/Brands";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Cta } from "@/components/sections/Cta";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress
        sections={[
          { id: "top", label: "Главная" },
          { id: "about", label: "О компании" },
          { id: "features", label: "Услуги" },
          { id: "brands", label: "Бренды" },
          { id: "how-it-works", label: "Процесс" },
          { id: "testimonials", label: "Отзывы" },
          { id: "cta", label: "Контакты" },
        ]}
      />
      <Hero />
      <About />
      <Features />
      <Brands />
      <HowItWorks />
      <Testimonials />
      <Cta />
    </>
  );
}
