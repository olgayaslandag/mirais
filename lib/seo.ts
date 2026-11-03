import type { Metadata } from "next";
import { getPathname, type Locale, type RouteHref } from "@/lib/i18n/navigation";

export const siteUrl = "https://mirais.com.tr";
export const siteName = "Mira İş Sağlığı ve Güvenliği Ekipmanları";

/** Yerelleştirilmiş mutlak yol üretir (/kurumsal ↔ /en/corporate) */
export function localizedPath(locale: Locale, href: RouteHref): string {
  return getPathname({ locale, href: href as never });
}

type BuildMetadataArgs = {
  locale: Locale;
  href: RouteHref;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * Locale bazlı metadata üretir: canonical + hreflang (tr/en/x-default).
 * Kaynak slug'lar iki dilde aynı olduğu için hreflang çiftleri her zaman tutarlıdır.
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  image,
  type = "website",
  publishedTime,
}: BuildMetadataArgs): Metadata {
  const canonical = localizedPath(locale, href);
  const trPath = localizedPath("tr", href);
  const enPath = localizedPath("en", href);
  const ogImage = image ? absoluteUrl(image) : `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        tr: trPath,
        en: enPath,
        "x-default": trPath,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type,
      images: [{ url: ogImage }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ------------------------------------------------------------------ *
 * JSON-LD
 * ------------------------------------------------------------------ */
export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/assets/img/logo.svg`,
    email: "bilgi@mirais.com.tr",
    telephone: "+90-216-684-05-75",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "İstanbul",
        addressCountry: "TR",
        streetAddress: "Yenişehir Mah. Sümbül Sk. Atlantis Premium İş. Mrk. A Bl. D:18 Pendik",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "İzmir",
        addressCountry: "TR",
        streetAddress: "1203/12 Sokak No:2F Halkapınar Yenişehir, 35170 Konak",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/mirais/",
      "https://www.instagram.com/mirais/",
      "https://www.facebook.com/mirais/",
    ],
    description:
      locale === "tr"
        ? "Martor, Justrite ve Röetzmeier iş sağlığı ve güvenliği ekipmanlarında Türkiye distribütörü."
        : "National distributor of Martor, Justrite and Röetzmeier occupational health and safety equipment.",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(args: {
  name: string;
  description: string;
  image: string[];
  url: string;
  brand: string;
  sku?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image.map(absoluteUrl),
    url: args.url,
    brand: { "@type": "Brand", name: args.brand },
    ...(args.sku ? { sku: args.sku } : {}),
    // Fiyat alanları CSV'de boş: teklif tabanlı katalog, offers bilinçli olarak yok.
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  date: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.date,
    mainEntityOfPage: args.url,
    ...(args.image ? { image: absoluteUrl(args.image) } : {}),
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/img/logo.svg` },
    },
  };
}
