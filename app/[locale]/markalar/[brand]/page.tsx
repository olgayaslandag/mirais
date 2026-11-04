import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import QuoteStrip from "@/components/QuoteStrip";
import { Link, categoryHref } from "@/lib/i18n/navigation";
import {
  countProductsByBrand,
  getBrand,
  getBrands,
  getCategoriesByBrand,
  getCategoryImage,
  getProductsByCategory,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBrands().map((brand) => ({ locale, brand: brand.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; brand: string }>;
}) {
  const { locale, brand } = await params;
  const entry = getBrand(brand);
  if (!entry) return {};
  const t = await getTranslations({ locale, namespace: "brands" });
  return buildMetadata({
    locale,
    href: { pathname: "/markalar/[brand]", params: { brand } },
    title: entry.names[locale],
    description: entry.descriptions[locale] || t("subtitle"),
    image: entry.logo,
  });
}

/** Marka detay sayfası: tanıtım, sorumlu olunan kategoriler, ürünler */
export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: Locale; brand: string }>;
}) {
  const { locale, brand } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const entry = getBrand(brand);
  if (!entry) notFound();

  const t = await getTranslations({ locale: activeLocale, namespace: "brands" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });

  const categories = getCategoriesByBrand(entry.slug);
  const count = countProductsByBrand(entry.slug, locale);
  const products = categories.flatMap((category) =>
    getProductsByCategory(category.slug, locale),
  );
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values(),
  );
  const coverImage = categories[0]
    ? getCategoryImage(categories[0], locale)
    : null;

  return (
    <main id="top">
      <PageHero
        eyebrow={tNav("markalar")}
        title={entry.names[locale]}
        description={entry.descriptions[locale]}
      />

      <section className="section">
        <div className="container brand-detail">
          <div className="brand-detail__logo reveal" data-reveal="left">
            <Image
              src={entry.logo}
              alt={entry.names[locale]}
              width={320}
              height={120}
              priority
            />
            <p className="brand-panel__count">{t("productCount", { count })}</p>
            <a
              className="text-link"
              href={entry.site}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("officialSite")} <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="brand-detail__body reveal" data-reveal="right">
            <h2>{entry.names[locale]}</h2>
            <p className="section-desc">{entry.descriptions[locale]}</p>
            {categories.length > 0 ? (
              <div className="brand-panel__categories">
                <h3>{t("categories")}</h3>
                <ul>
                  {categories.map((category, catIndex) => (
                    <li key={`${category.slug}-${catIndex}`}>
                      <Link href={categoryHref(category.slug)}>
                        {category.names[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {uniqueProducts.length > 0 ? (
        <section className="section section--soft" aria-labelledby="brand-products-title">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading-left">
                <p className="eyebrow">{entry.names[locale]}</p>
                <h2 id="brand-products-title">
                  {t("productCount", { count: uniqueProducts.length })}
                </h2>
              </div>
            </div>
            <ProductGrid products={uniqueProducts} fallbackImage={coverImage} />
          </div>
        </section>
      ) : null}

      <QuoteStrip
        title={t("title")}
        text={t("subtitle")}
        buttonLabel={tCommon("requestQuote")}
      />
    </main>
  );
}
