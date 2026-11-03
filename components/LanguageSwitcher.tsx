"use client";

import { useParams, usePathname } from "next/navigation";
import { getPathname } from "@/lib/i18n/navigation";
import { resolveRoute } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Dil değiştirici: aynı sayfanın diğer dildeki karşılığına gider.
 *
 * next-intl'in `usePathname()` bağımlı olarak şablon ya da somut iç yol döndürür;
 * `resolveRoute` ikisini de tek bir iç şablona indirger, ardından
 * `getPathname` hedef dilin yerelleştirilmiş yolunu üretir
 * (/urunler/... ↔ /en/products/...).
 *
 * `Link` yerine düz `<a>` kullanılır: `locale` özelliği next-intl'de
 * prefix'i zorlar ve varsayılan dilde ("/tr/...") hatalı adres üretir.
 */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const params = useParams();

  const route = resolveRoute(
    pathname,
    params as Record<string, string | string[] | undefined>,
    locale,
    // Locale önekleri: dış yolda "/en", üretimde dahili yolda "/tr" görünür
    ["/en", "/tr"],
  );

  const hrefFor = (target: Locale) => {
    if (!route) return target === locale ? "/" : "/en";
    return getPathname({
      locale: target,
      href: { pathname: route.template, params: route.params } as never,
    });
  };

  return (
    <div className="lang-switch" role="group" aria-label="Dil seçimi">
      {(["tr", "en"] as Locale[]).map((item) => {
        const isActive = item === locale;
        return (
          <a
            key={item}
            href={hrefFor(item)}
            hrefLang={item}
            lang={item}
            aria-current={isActive ? "true" : undefined}
            className={`lang-switch__item${isActive ? " is-active" : ""}`}
          >
            {item.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
