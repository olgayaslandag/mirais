import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CorporateIntro from "@/components/CorporateIntro";
import Solutions from "@/components/Solutions";
import CatalogBand from "@/components/CatalogBand";
import Services from "@/components/Services";
import InstagramFeed from "@/components/InstagramFeed";
import BrandsSection from "@/components/BrandsSection";
import { getSiteContent, HERO_AUTOPLAY_MS } from "@/data/content";
import {
  getBrands,
  getCategory,
  getCategoryImage,
} from "@/lib/catalog";
import type { Category } from "@/lib/catalog";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";

/** Kaynak: mirais.com.tr navbardaki ürün kategorileri (eski WP menüsünün 8 terimi) */
const HOME_CATEGORY_ORDER: string[] = [
  "emniyetli-bicaklar",
  "emniyetli-kaplar",
  "hazneli-platformlar",
  "guvenli-dolaplar",
  "varil-emniyet-urunleri",
  "endustriyel-kullukler",
  "paslanmaz-celik-kaplar",
  "seramik-uclu-kesiciler",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: activeLocale, namespace: "meta" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  return buildMetadata({
    locale: activeLocale,
    href: "/",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Ana sayfa: bölüm sırası orijinal sitedeki sırayı korur.
 * Tüm içerik server component olarak hazırlanır; yalnızca etkileşimli
 * bileşenler (Hero, CorporateIntro, InstagramFeed) client'tır.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Geçersiz [locale] segmenti (ör. /xyz) düzen ile eşzamanlı render'da sayfaya
  // ulaşabilir; burada doğrulanmazsa getSiteContent undefined döner ve sayfa çöker.
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "home" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const content = getSiteContent(activeLocale);

  const solutionCategories = HOME_CATEGORY_ORDER.map((slug) =>
    getCategory(slug),
  )
    .filter((category): category is Category => category !== undefined)
    .map((category) => ({
      slug: category.slug,
      parent: category.parent,
      name: category.names[locale],
      description: category.descriptions[locale],
      image: getCategoryImage(category, locale) ?? "/placeholder-category.png",
    }));

  return (
    <main id="top">
      <Hero
        slides={content.heroSlides}
        autoplayMs={HERO_AUTOPLAY_MS}
        ctaLabel={t("heroCta")}
        scrollLabel={t("heroScroll")}
      />
      <CorporateIntro
        eyebrow={t("corporateEyebrow")}
        title={t("corporateTitle")}
        text={t("corporateText")}
        facts={content.corporate.facts}
        accordion={content.corporate.accordion}
        imageAlt={t("corporateTitle")}
      />
      <Solutions
        eyebrow={t("solutionsEyebrow")}
        title={t("solutionsTitle")}
        text={t("solutionsText")}
        categories={solutionCategories}
        allLabel={tCommon("allSolutions")}
        ctaLabel={tCommon("allServices")}
      />
      <CatalogBand />
      <Services
        eyebrow={tCommon("servicesEyebrow")}
        title={t("servicesTitle")}
        text={t("servicesText")}
        services={content.services.map((service) => ({
          title: service.title,
          description: service.description,
          image: service.image,
          alt: service.alt,
          href: "/hizmetler",
        }))}
        allLabel={tCommon("allServices")}
        ctaLabel={tCommon("allServices")}
      />
      <InstagramFeed />
      <BrandsSection
        eyebrow={t("brandsEyebrow")}
        title={t("brandsTitle")}
        brands={getBrands().map((brand) => ({
          slug: brand.slug,
          name: brand.names[locale],
          logo: brand.logo,
        }))}
      />
    </main>
  );
}