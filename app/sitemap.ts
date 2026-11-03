import type { MetadataRoute } from "next";
import { getPathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import {
  getBrands,
  getCategories,
  getChildCategories,
  getProducts,
  getRootCategories,
} from "@/lib/catalog";
import { getAllPosts, getPostSlugs } from "@/lib/mdx";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap: tüm sayfalar, kategoriler, markalar, ürünler ve blog yazıları.
 * Her kayıt hreflang çiftleri (tr/en/x-default) içerir.
 * lastModified sabit bir tarihtir (deterministik üretim için).
 */
const LAST_MODIFIED = new Date("2026-10-27T00:00:00.000Z");

function entry(
  pathname: string,
  params: Record<string, string> = {},
): MetadataRoute.Sitemap[number] {
  const href = { pathname, params } as never;
  const tr = getPathname({ locale: "tr", href });
  const en = getPathname({ locale: "en", href });
  return {
    url: `${siteUrl}${tr}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.7,
    alternates: {
      languages: {
        tr,
        en,
        "x-default": tr,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Statik sayfalar
  for (const pathname of [
    "/",
    "/kurumsal",
    "/markalar",
    "/urunler",
    "/hizmetler",
    "/blog",
    "/kariyer",
    "/iletisim",
    "/kvkk",
    "/gizlilik",
    "/kullanim-sartlari",
    "/cerez-politikasi",
  ]) {
    entries.push(entry(pathname));
  }

  // Kategoriler (üst + alt)
  for (const category of getRootCategories()) {
    entries.push(entry("/urunler/[category]", { category: category.slug }));
    for (const child of getChildCategories(category.slug)) {
      entries.push(
        entry("/urunler/[category]/[subcategory]", {
          category: category.slug,
          subcategory: child.slug,
        }),
      );
    }
  }

  // Markalar
  for (const brand of getBrands()) {
    entries.push(entry("/markalar/[brand]", { brand: brand.slug }));
  }

  // Ürünler (her locale kendi slug'ıyla)
  for (const locale of routing.locales) {
    for (const product of getProducts(locale)) {
      const tr = getPathname({
        locale: "tr",
        href: { pathname: "/urun/[slug]", params: { slug: product.slug } } as never,
      });
      const en = getPathname({
        locale: "en",
        href: { pathname: "/urun/[slug]", params: { slug: product.slug } } as never,
      });
      entries.push({
        url: `${siteUrl}${locale === "tr" ? tr : en}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: { tr, en, "x-default": tr } },
      });
    }
  }

  // Blog yazıları
  for (const locale of routing.locales) {
    const slugs = await getPostSlugs(locale);
    for (const slug of slugs) {
      const tr = getPathname({
        locale: "tr",
        href: { pathname: "/blog/[slug]", params: { slug } } as never,
      });
      const en = getPathname({
        locale: "en",
        href: { pathname: "/blog/[slug]", params: { slug } } as never,
      });
      entries.push({
        url: `${siteUrl}${locale === "tr" ? tr : en}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: { tr, en, "x-default": tr } },
      });
    }
  }

  return entries;
}
