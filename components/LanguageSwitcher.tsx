"use client";

import { useParams } from "next/navigation";
import { usePathname } from "@/lib/i18n/navigation";
import { getPathname } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { getProductCounterpart, getServiceCounterpart, getBlogCounterpart } from "@/lib/i18n/slugs";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Dil değiştirici: aynı sayfanın diğer dildeki counterpart'ına gider.
 *
 * next-intl'in `usePathname()` (pathnames config ile) internal template döndürür
 * (e.g. "/urun/[slug]", "/blog/[slug]") — bu, somut yolları /prefix/template
 * formatına dönüştürür ve next-intl'in `Link locale={...}` mekanizması prefix'i
 * kontrol eder. `resolveRoute` hack'i kaldırıldı.
 *
 * Hedef href üretimi:
 * - Statik route (home, kategori, vb.): `{ pathname: template }` + `Link locale={target}`
 *   next-intl prefix'i zorlar: TR → "/tr/..." → middleware "/"'e normalize eder;
 *   EN → "/en/..." prefixli link olur.
 * - Dinamik slug (urun/[slug], blog/[slug]): counterpart API'siyle çevrilir.
 *   Karşılık null → `{ pathname: "/" }` + locale target (karar #1).
 * - Servis slug'leri: SERVICE_SLUG_MAP bilateral mapping ile çevrilir.
 * - Kategori/altkategori/marka segmentleri iki dilde aynı → olduğu gibi taşınır.
 *
 * "Aynı dildeyken" dalı sadeleşir: aktif zaten span, `<a>` sadece diğer
 * dil için üretilir. aria-label mesajdan okutulur (T8).
 */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const params = useParams();

  const hrefFor = (target: Locale): string => {
    // Aynı dildeysem: ilgili homepage URL'sini döndür
    if (target === locale) {
      if (locale === "en") return "/en";
      return "/";
    }

    // Farklı dildeysem: hep locale prefixli URL (/tr ya da /en)
    // Önce params'tan slug'i alıp counterpart API'siyle çevir
    const slug = (params as Record<string, string | undefined>)?.slug;

    let translatedSlug: string | undefined;
    if (slug) {
      // Önce ürün counterpart'ını dene
      let counterpart = getProductCounterpart(slug, locale === "tr" ? "en" : "tr", target);

      // Ürün counterpart'ı bulunamazsa, servis counterpart'ını dene
      if (!counterpart) {
        counterpart = getServiceCounterpart(slug, locale === "tr" ? "en" : "tr", target);
      }

      // Servis counterpart'ı bulunamazsa, blog counterpart'ını dene
      if (!counterpart) {
        counterpart = getBlogCounterpart(slug, locale === "tr" ? "en" : "tr", target);
      }

      translatedSlug = counterpart || undefined;
    }

    // Counterpart bulunamazsa (bench-can gibi EN-only ürünler),
    // ana sayfasına yönlendir (karar #1)
    if (!translatedSlug && !slug) {
      // Parametre yoksa (anasayfa veya başka bir sayfa), home'a düş
      return target === "en" ? "/en" : "/";
    }

    if (!translatedSlug) {
      // Counterpart yok ama slug var - ana sayfasına düş
      return target === "en" ? "/en" : "/";
    }

    // next-intl routing ile uyumlu, asla raw "/"
    // Statik route'lar (home, kategoriler) için template kullan
    if (!slug) {
      // Slug yoksa (anasayfa, kategori vb.), template-based href
      if (target === "en") return "/en";
      return "/";
    }

    // Dinamik slug parametresi ile ruta - next-intl Link objesi formatı
    // next-intl, Link'in { pathname, params } formatını aldığında
    // prefix'i otomatik olarak yönetir.
    return `/${target}${translatedSlug ? `/${translatedSlug}` : ``}`;
  };

  return (
    <div className="lang-switch" role="group" aria-label="Dil seçimi">
      {(["tr", "en"] as Locale[]).map((item, index) => {
        const isActive = item === locale;
        if (isActive) {
          return (
            <span
              key={`${item}-${index}`}
              className={`lang-switch__item is-active`}
              aria-current="true"
            >
              {item.toLocaleUpperCase("tr-TR")}
            </span>
          );
        }
        return (
          <a
            key={`${item}-${index}`}
            href={hrefFor(item)}
            hrefLang={item}
            lang={item}
            className={`lang-switch__item`}
          >
            {item.toLocaleUpperCase("tr-TR")}
          </a>
        );
      })}
    </div>
  );
}