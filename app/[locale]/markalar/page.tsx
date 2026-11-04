import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import QuoteStrip from "@/components/QuoteStrip";
import { Link, brandHref, categoryHref } from "@/lib/i18n/navigation";
import {
  getBrands,
  getCategoriesByBrand,
  getCategoryImage,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brands" });
  return buildMetadata({
    locale,
    href: "/markalar",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Markalar sayfası: temsil edilen üç marka ve kapsadıkları kategoriler */
export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "brands" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const brands = getBrands();

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("brandsEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section">
        <div className="container brand-list">
          <div className="container breadcrumb-wrap">
            <Breadcrumb
              items={[
                { name: tCommon("home"), href: "/" },
                { name: t("title") },
              ]}
            />
          </div>
          <div className="brands-list">
          {brands.map((brand, index) => {
            const categories = getCategoriesByBrand(brand.slug);
            return (
              <article
                className="brand-panel reveal"
                data-reveal="up"
                data-delay={(index % 2) * 120}
                key={`${brand.slug}-${index}`}
              >
                <div className="brand-panel__head">
                  <Image
                    src={brand.logo}
                    alt={brand.names[locale]}
                    width={240}
                    height={90}
                    loading="lazy"
                  />
                  <Link
                    className="text-link"
                    href={brandHref(brand.slug)}
                    aria-label={brand.names[locale]}
                  >
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <p className="section-desc">{brand.descriptions[locale]}</p>
                {categories.length > 0 ? (
                  <div className="brand-panel__categories">
                    <h3>{t("categories")}</h3>
                    <ul>
                      {categories.map((category, catIndex) => (
                        <li key={`${brand.slug}-${category.slug}-${catIndex}`}>
                          <Link href={categoryHref(category.slug)}>
                            {category.names[locale]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <a
                  className="text-link"
                  href={brand.site}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("officialSite")} <ExternalLink size={15} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
      </section>

      <QuoteStrip
        title={t("title")}
        text={t("subtitle")}
        buttonLabel={tCommon("requestQuote")}
      />
    </main>
  );
}
