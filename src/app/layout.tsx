import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import { site } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProvider } from "@/components/providers/ScrollProvider";
import { PageIntro } from "@/components/ui/PageIntro";
import { AmbientCanvas } from "@/components/ui/AmbientCanvas";
import { ScrollOrchestrator } from "@/components/ui/ScrollOrchestrator";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — сервис пищевого оборудования`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "ремонт пищевого оборудования",
    "сервис Rational",
    "ЗИП ФАСТ",
    "Алтайский край",
    "Республика Алтай",
    "промышленное оборудование",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} ${onest.variable} min-h-screen`}>
        <ScrollProvider>
          <AmbientCanvas />
          <ScrollOrchestrator />
          <PageIntro />
          <Header />
          <main>{children}</main>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  );
}
