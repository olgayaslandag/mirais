import { routing, type Locale } from "./routing";

/**
 * Rotaların iç (dosya sistemi) şablonları — en spesifik önce.
 * next-intl `usePathname()` bağımlı olarak ya şablonu ("/urunler/[category]")
 * ya da somut yolu döndürür; bu liste ikisini de tek bir iç şablona indirger.
 */
export const ROUTE_TEMPLATES: { template: string; params: string[] }[] = [
  { template: "/", params: [] },
  { template: "/kurumsal", params: [] },
  { template: "/markalar", params: [] },
  { template: "/markalar/[brand]", params: ["brand"] },
  { template: "/urunler", params: [] },
  { template: "/urunler/[category]/[subcategory]", params: ["category", "subcategory"] },
  { template: "/urunler/[category]", params: ["category"] },
  { template: "/urun/[slug]", params: ["slug"] },
  { template: "/hizmetler", params: [] },
  { template: "/blog", params: [] },
  { template: "/blog/[slug]", params: ["slug"] },
  { template: "/kariyer", params: [] },
  { template: "/iletisim", params: [] },
  { template: "/kvkk", params: [] },
  { template: "/gizlilik", params: [] },
  { template: "/kullanim-sartlari", params: [] },
  { template: "/cerez-politikasi", params: [] },
];

/** İç şablonun verilen dildeki (dış) karşılığı */
export function localizedTemplate(internal: string, locale: Locale): string {
  const entry = (routing.pathnames as Record<string, unknown>)[internal];
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    const value = (entry as Record<string, string>)[locale];
    if (typeof value === "string") return value;
  }
  return internal;
}

export type ResolvedRoute = {
  template: string;
  params: Record<string, string>;
};

function templateToRegex(template: string): RegExp {
  const pattern = template
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\[\[([^\]]+)\\\]/g, "(.*)")
    .replace(/\\\[([^\]]+)\\\]/g, "([^/]+)");
  return new RegExp(`^${pattern}$`);
}

/**
 * Somut iç yolu iç şablona + parametrelere dönüştürür.
 * Şablon biçiminde gelen yollar doğrudan kullanılır (parametreler useParams'tan gelir).
 * `localePrefixes` verilirse locale öneki iç yolda kalıyorsa (EN: "/en/...")
 * önek düşürülüp yeniden eşleştirme yapılır.
 */
export function resolveRoute(
  pathname: string,
  params: Record<string, string | string[] | undefined> = {},
  locale: Locale = "tr",
  localePrefixes: string[] = [],
): ResolvedRoute | null {
  if (!pathname) return null;

  // 1) next-intl şablonu döndürmüşse parametreleri useParams'tan doldur
  if (pathname.includes("[")) {
    const resolved: Record<string, string> = {};
    const pattern = /\[([^\]]+)\]/g;
    let match = pattern.exec(pathname);
    while (match) {
      const value = params[match[1]];
      if (typeof value === "string") resolved[match[1]] = value;
      match = pattern.exec(pathname);
    }
    return { template: pathname, params: resolved };
  }

  // 2) Somut yol: şablonlara karşı eşleştir
  //    Dış yol aktif dilin YERELLEŞTİRİLMİŞ şablonunu kullanır
  //    (EN: "/en/products/[category]"), üretim (SSG) sırasında ise dahili yol
  //    görünür ("/tr/urunler/[category]") — her iki biçim de eşleştirilir.
  const candidates = [pathname];
  for (const prefix of localePrefixes) {
    if (pathname === prefix) {
      candidates.push("/");
    } else if (pathname.startsWith(`${prefix}/`)) {
      candidates.push(pathname.slice(prefix.length));
    }
  }

  for (const candidate of candidates) {
    for (const entry of ROUTE_TEMPLATES) {
      const patterns = [
        entry.template,
        localizedTemplate(entry.template, locale),
      ];
      for (const pattern of patterns) {
        const match = templateToRegex(pattern).exec(candidate);
        if (!match) continue;
        const resolved: Record<string, string> = {};
        entry.params.forEach((key, index) => {
          resolved[key] = decodeURIComponent(match[index + 1] ?? "");
        });
        return { template: entry.template, params: resolved };
      }
    }
  }

  return null;
}

/** Dış yoldan locale önekini ayırır (EN "/en/...", TR prefixesiz) */
export function stripLocalePrefix(pathname: string, locale: Locale): string {
  if (locale === "en" && pathname.startsWith("/en")) {
    const rest = pathname.slice(3);
    return rest || "/";
  }
  return pathname || "/";
}
