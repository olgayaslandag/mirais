import { createNavigation } from "next-intl/navigation";
import { routing, type Locale } from "./routing";

/**
 * Yerelleştirilmiş yönlendirme yardımcıları.
 * `Link`, `redirect`, `usePathname` ve `useRouter` otomatik olarak
 * aktif locale'in yol adresini üretir (/kurumsal ↔ /en/corporate).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type { Locale };

/** Dinamik rotalar için Link'in beklediği nesne biçiminde href üretir */
export type RouteHref = Parameters<typeof Link>[0]["href"];

/** Serbest metin yolunu güvenli biçime dönüştürür (yerelleştirme Link içinde yapılır) */
export function asRouteHref(pathname: string): RouteHref {
  return pathname as unknown as RouteHref;
}

export function categoryHref(category: string, subcategory?: string): RouteHref {
  if (subcategory) {
    return {
      pathname: "/urunler/[category]/[subcategory]",
      params: { category, subcategory },
    } as RouteHref;
  }
  return { pathname: "/urunler/[category]", params: { category } } as RouteHref;
}

export function productHref(slug: string): RouteHref {
  return { pathname: "/urun/[slug]", params: { slug } } as RouteHref;
}

export function brandHref(brand: string): RouteHref {
  return { pathname: "/markalar/[brand]", params: { brand } } as RouteHref;
}

export function blogHref(slug: string): RouteHref {
  return { pathname: "/blog/[slug]", params: { slug } } as RouteHref;
}

/**
 * Bölüm (hash) bağlantısı: önce yerelleştirilmiş yol üretilir, sonra hash eklenir.
 * next-intl `Link` hash'i çevirmediği için bu bağlantılar düz `<a>` olarak kullanılır.
 */
export function hashHref(
  locale: Locale,
  pathname: string,
  hash: string,
): string {
  return `${getPathname({ locale, href: pathname as never })}${hash}`;
}
