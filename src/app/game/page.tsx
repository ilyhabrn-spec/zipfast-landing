import type { Metadata } from "next";
import { ServiceRushGame } from "@/components/game/ServiceRushGame";

export const metadata: Metadata = {
  title: "Сервис Rush — мини-игра",
  description:
    "Сервис Rush от ЗИП ФАСТ — затягивающая аркада на 45 секунд. Побей рекорд и поделись результатом!",
  openGraph: {
    title: "Сервис Rush — сколько очков наберёшь?",
    description: "Мини-игра от сервиса пищевого оборудования ЗИП ФАСТ. 45 секунд на рекорд!",
    type: "website",
  },
};

export default function GamePage() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-6 lg:py-10">
      <ServiceRushGame />
    </section>
  );
}
