import { localBusinessJsonLd, webSiteJsonLd } from "@/lib/seo";

export function JsonLd() {
  const data = [localBusinessJsonLd(), webSiteJsonLd()];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
