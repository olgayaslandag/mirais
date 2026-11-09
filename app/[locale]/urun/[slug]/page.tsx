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
import { categoryHref, Link, productHref } from "@/lib/i18n/navigation";
import {
  getCategory,
  getCategoryImage,
  getCategoryPath,
  getProduct,
  getProducts,
  getRelatedProducts,
  type SpecTable as SpecTableData,
} from "@/lib/catalog";
import { buildMetadata, productJsonLd, siteUrl, absoluteUrl, localizedPath } from "@/lib/seo";
import { getProductCounterpart } from "@/lib/i18n/slugs";
import { locales, type Locale as LocaleFromRouting } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProducts(locale).map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleFromRouting; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug, locale);
  if (!product) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  const description =
    product.seoDescription || product.shortDescription || t("description");

  // Counterpart slug'ı bul (ters dilde aynı/benzer ürün)
  const counterpartSlug = getProductCounterpart(slug, locale, locale === "tr" ? "en" : "tr");

  // Alternates: counterpart varsa o dilin path'i; yoksa sadece canonical
  const alternates: Record<string, string | null> = {};
  if (counterpartSlug) {
    const counterpartHref = { pathname: "/urun/[slug]", params: { slug: counterpartSlug } } as never;
    alternates[locale === "tr" ? "en" : "tr"] = localizedPath(locale === "tr" ? "en" : "tr", counterpartHref);
  }

  return buildMetadata({
    locale,
    href: { pathname: "/urun/[slug]", params: { slug } },
    title: product.name,
    description,
    image: product.images[0] ?? null,
    type: "website",
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
  });
}

/** Ürün detay sayfası */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: LocaleFromRouting; slug: string }>;
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
      .toLocaleLowerCase('tr-TR');

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
    url: absoluteUrl(localizedPath(locale, {
      pathname: "/urun/[slug]",
      params: { slug: product.slug },
    } as never)),
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
          </div>

          <div className="product-detail__info">
            {showLead ? (
              <p className="product-detail__lead">{product.shortDescription}</p>
            ) : null}

            {product.descriptionHtml ? (
              <div className="product-detail__description">
                <RichContent html={product.descriptionHtml} />
              </div>
            ) : null}

            {product.specs ? (
              <div className="product-detail__specs">
                <SpecTable specs={product.specs} />
              </div>
            ) : null}

            {product.tabs.length > 0 ? (
              <div className="product-detail__tabs">
                {product.tabs.map((tab, index) => (
                  <section className="product-tab" key={`${tab.title}-${index}-${index}`}>
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

      {product.videos.length > 0 ? (
        <section className="section product-videos-section" aria-labelledby="videos-title">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading-left">
                <p className="eyebrow">{t("videoEyebrow")}</p>
                <h2 id="videos-title">{t("videos")}</h2>
              </div>
            </div>
            <div className="video-grid">
              {product.videos.map((videoId, videoIndex) => (
                <YouTubeEmbed
                  key={`${videoId}-${videoIndex}`}
                  videoId={videoId}
                  title={product.name}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="section related-products" aria-labelledby="related-title">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading-left">
                <p className="eyebrow">{t("relatedEyebrow")}</p>
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
