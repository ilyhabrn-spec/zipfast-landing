import { contacts, site } from "@/lib/constants";

export const seo = {
  title: "ЗИП ФАСТ — ремонт пищевого оборудования в Алтайском крае",
  yandexVerification: "d419101082c7ba08",
  ymCounterId: "75053788",
  description:
    "Ремонт и сервис промышленного пищевого, холодильного и теплового оборудования в Алтайском крае и Республике Алтай. Rational, Unox, MKN, Miwe. Выезд инженера. ☎ +7 (962) 806-27-70",
  keywords: [
    "ремонт пищевого оборудования",
    "ремонт пищевого оборудования Барнаул",
    "сервис Rational Алтай",
    "ремонт пароконвектомата",
    "ремонт промышленного оборудования Алтайский край",
    "ЗИП ФАСТ",
    "выезд инженера Барнаул",
    "ремонт холодильного оборудования",
    "сервис Unox MKN Miwe",
    "ремонт оборудования Горно-Алтайск",
  ],
  locale: "ru_RU",
  cities: ["Барнаул", "Бийск", "Рубцовск", "Новоалтайск", "Горно-Алтайск"],
  services: [
    "Ремонт пароконвектоматов",
    "Ремонт пищевого оборудования",
    "Ремонт холодильного оборудования",
    "Диагностика на объекте",
    "Выезд инженера",
    "Техническое обслуживание",
    "Поставка запчастей",
  ],
} as const;

export const publicRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/game", changeFrequency: "monthly" as const, priority: 0.3 },
];

export function absoluteUrl(path = "") {
  return `${site.url}${path}`;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: contacts.phone,
    email: contacts.email,
    foundingDate: String(site.foundedYear),
    areaServed: seo.cities.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: site.region,
      },
    })),
    knowsAbout: seo.services,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Сервис и ремонт оборудования",
      itemListElement: seo.services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service,
          areaServed: site.region,
        },
      })),
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: seo.description,
    inLanguage: "ru-RU",
    publisher: { "@id": `${site.url}/#organization` },
  };
}
