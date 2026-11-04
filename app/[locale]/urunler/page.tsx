import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import QuoteStrip from "@/components/QuoteStrip";
import { Link, categoryHref } from "@/lib/i18n/navigation";
import { getCategoryImage, getRootCategories } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return buildMetadata({
    locale,
    href: "/urunler",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Ürün kataloğu: üst kategoriler ve ürün kartları (ana sayfa stili) */
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "products" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });

  const categories = getRootCategories();

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("productsEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section" aria-label={t("title")}>
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: t("title") },
            ]}
          />
        </div>
        <div className="container">
          <div className="product-grid">
            {categories.map((category, index) => (
              <Link
                key={`${category.slug}-${index}`}
                className="product-card reveal"
                data-reveal="deal"
                data-delay={(index % 4) * 140}
                href={categoryHref(category.slug)}
                aria-label={t("title")}
              >
<div className="card-image">
                  {getCategoryImage(category, locale) ? (
                    <Image
                      src={getCategoryImage(category, locale)!}
                      alt={category.names[locale]}
                      width={800}
                      height={500}
                      sizes="(max-width: 36rem) 100vw, (max-width: 62rem) 50vw, 33vw"
                    />
                  ) : (
                    <span
                      className="card-image__placeholder"
                      aria-hidden="true"
                    />
                  )}
                  <span className="card-badge" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div className="card-body">
                  <h3>{category.names[locale]}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuoteStrip
        title={t("quoteTitle")}
        text={t("quoteText")}
        buttonLabel={tCommon("requestQuote")}
      />
    </main>
  );
}
