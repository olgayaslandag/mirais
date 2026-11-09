import { defineRouting } from "next-intl/routing";

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  pathnames: {
    "/": { tr: "/", en: "/" },
    "/kurumsal": { tr: "/kurumsal", en: "/corporate" },
    "/urunler": { tr: "/urunler", en: "/products" },
    "/markalar": { tr: "/markalar", en: "/brands" },
    "/markalar/[brand]": { tr: "/markalar/[brand]", en: "/brands/[brand]" },
    "/urunler/[category]": { tr: "/urunler/[category]", en: "/products/[category]" },
    "/urunler/[category]/[subcategory]": {
      tr: "/urunler/[category]/[subcategory]",
      en: "/products/[category]/[subcategory]",
    },
    "/urun/[slug]": { tr: "/urun/[slug]", en: "/product/[slug]" },
    "/hizmetler": { tr: "/hizmetler", en: "/services" },
    "/hizmetler/[slug]": { tr: "/hizmetler/[slug]", en: "/services/[slug]" },
    "/blog": { tr: "/blog", en: "/blog" },
    "/blog/[slug]": { tr: "/blog/[slug]", en: "/blog/[slug]" },
    "/kariyer": { tr: "/kariyer", en: "/careers" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/kvkk": { tr: "/kvkk", en: "/personal-data-protection" },
    "/gizlilik": { tr: "/gizlilik", en: "/privacy" },
    "/kullanim-sartlari": { tr: "/kullanim-sartlari", en: "/terms" },
    "/cerez-politikasi": { tr: "/cerez-politikasi", en: "/cookie-policy" },
  },
});

/** İç yol (dosya sistemi) → yerelleştirilmiş dış yol eşlemesi için ters tablo */
export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};