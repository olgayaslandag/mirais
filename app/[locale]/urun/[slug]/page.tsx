import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGallery from "@/components/ProductGallery";
import ProductGrid from "@/components/ProductGrid";
import RichContent from "@/components/RichContent";
import SpecTable from "@/components/SpecTable";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import QuoteStrip from "@/components/QuoteStrip";
import { categoryHref, Link } from "@/lib/i18n/navigation";
import {
  getCategory,
  getCategoryImage,
  getCategoryPath,
  getProduct,
  getProducts,
  getRelatedProducts,
  type SpecTable as SpecTableData,
} from "@/lib/catalog";
import { buildMetadata, localizedPath, productJsonLd, siteUrl } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProducts(locale).map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProduct(slug, locale);
  if (!product) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  const description =
    product.seoDescription || product.shortDescription || t("description");
  return buildMetadata({
    locale,
    href: { pathname: "/urun/[slug]", params: { slug } },
    title: product.name,
    description,
    image: product.images[0] ?? null,
    type: "website",
  });
}

/** Ürün detay sayfası */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const product = getProduct(slug, locale);
  if (!product) notFound();

  const t = await getTranslations({ locale: activeLocale, namespace: "products" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });

  const primaryCategory = product.categories[product.categories.length - 1];
  const category = getCategory(primaryCategory);
  const categoryPath = getCategoryPath(primaryCategory);
  const related = getRelatedProducts(product, locale, 4);
  const fallbackImage = category ? getCategoryImage(category, locale) : null;

  // Helper: HTML'den düz metin çıkar (normalize)
  const stripHtml = (html: string): string =>
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // Lead paragrafı (shortDescription) descriptionHtml içinde geçiyorsa gösterme
  const showLead =
    product.shortDescription &&
    !stripHtml(product.descriptionHtml).includes(stripHtml(product.shortDescription));

  // Helper: iki SpecTable'ın aynı olup olmadığını kontrol et (basit shallow compare)
  const sameSpecs = (a: SpecTableData | undefined, b: SpecTableData | undefined): boolean => {
    if (!a || !b) return false;
    if (a.columns.length !== b.columns.length) return false;
    if (a.rows.length !== b.rows.length) return false;
    for (let i = 0; i < a.columns.length; i += 1) {
      if (a.columns[i] !== b.columns[i]) return false;
    }
    for (let i = 0; i < a.rows.length; i += 1) {
      for (let j = 0; j < a.rows[i].length; j += 1) {
        if (a.rows[i][j] !== b.rows[i][j]) return false;
      }
    }
    return true;
  };

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.seoDescription || product.shortDescription || product.name,
    image: product.images,
    brand: product.brand,
  });

  return (
    <main id="top">
      <PageHero
        eyebrow={product.brand}
        title={product.name}
      />

      <section className="section product-detail-section">
        <div className="container product-detail">
          <div className="product-detail__media">
            <ProductGallery
              images={product.images}
              alt={product.name}
              fallbackImage={fallbackImage}
            />
            {product.videos.length > 0 ? (
              <div className="product-detail__videos">
                <h2>{t("videos")}</h2>
                {product.videos.map((videoId) => (
                  <YouTubeEmbed
                    key={videoId}
                    videoId={videoId}
                    title={product.name}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-detail__info">
            {showLead ? (
              <p className="product-detail__lead">{product.shortDescription}</p>
            ) : null}

            {product.descriptionHtml ? (
              <div className="product-detail__description">
                <h2>{t("description")}</h2>
                <RichContent html={product.descriptionHtml} />
              </div>
            ) : null}

            {product.specs ? (
              <div className="product-detail__specs">
                <h2>{t("specs")}</h2>
                <SpecTable specs={product.specs} />
              </div>
            ) : null}

            {product.tabs.length > 0 ? (
              <div className="product-detail__tabs">
                {product.tabs.map((tab, index) => (
                  <section className="product-tab" key={`${tab.title}-${index}`}>
                    <h2>{tab.title}</h2>
                    {tab.specs && !sameSpecs(tab.specs, product.specs) ? (
                      <SpecTable specs={tab.specs} />
                    ) : null}
                    {tab.html ? <RichContent html={tab.html} /> : null}
                  </section>
                ))}
              </div>
            ) : null}

            <dl className="product-meta">
              <div>
                <dt>{t("brand")}</dt>
                <dd>{product.brand}</dd>
              </div>
              {category ? (
                <div>
                  <dt>{t("title")}</dt>
                  <dd>
                    <Link href={categoryHref(category.slug)}>
                      {category.names[locale]}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="product-detail__cta">
              <Link className="btn btn-sm btn-primary" href="/iletisim">
                {tCommon("requestQuote")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section related-products" aria-labelledby="related-title">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading-left">
                <p className="eyebrow">{t("related")}</p>
                <h2 id="related-title">{t("related")}</h2>
              </div>
            </div>
            <ProductGrid products={related} fallbackImage={fallbackImage} />
          </div>
        </section>
      ) : null}

      <QuoteStrip
        title={t("quoteTitle")}
        text={t("quoteText")}
        buttonLabel={tCommon("requestQuote")}
      />

      <script
        type="application/ld+json"
        // Ürün verisi build script'i tarafından üretilmiş JSON'dan gelir
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
