import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import { site } from "@/lib/constants";
import { seo, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { YandexMetrika } from "@/components/seo/YandexMetrika";
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
  metadataBase: new URL(site.url),
  title: {
    default: seo.title,
    template: `%s | ${site.name}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  alternates: {
    canonical: absoluteUrl(),
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    locale: seo.locale,
    siteName: site.name,
    url: absoluteUrl(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? seo.yandexVerification,
  },
  icons: {
    icon: "/icon.svg",
  },
  other: {
    "geo.region": "RU-ALT",
    "geo.placename": site.region,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="yandex-verification" content={seo.yandexVerification} />
      </head>
      <body className={`${inter.className} ${onest.variable} min-h-screen`}>
        <JsonLd />
        <YandexMetrika />
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
