import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryNav from "@/components/CategoryNav";
import ProductGrid from "@/components/ProductGrid";
import RichContent from "@/components/RichContent";
import QuoteStrip from "@/components/QuoteStrip";
import { categoryHref, Link } from "@/lib/i18n/navigation";
import {
  getCategory,
  getCategoryImage,
  getCategoryPath,
  getChildCategories,
  getProductsByCategory,
  getRootCategories,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getRootCategories().flatMap((root) =>
      getChildCategories(root.slug).map((child) => ({
        locale,
        category: root.slug,
        subcategory: child.slug,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string; subcategory: string }>;
}) {
  const { locale, category, subcategory } = await params;
  const entry = getCategory(subcategory);
  if (!entry) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  return buildMetadata({
    locale,
    href: {
      pathname: "/urunler/[category]/[subcategory]",
      params: { category, subcategory },
    },
    title: `${entry.names[locale]} | ${t("title")}`,
    description: entry.descriptions[locale] || t("subtitle"),
    image: getCategoryImage(entry, locale),
  });
}

/** Alt kategori sayfası: kendi ürünleri + kardeş kategoriler */
export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string; subcategory: string }>;
}) {
  const { locale, category, subcategory } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const parent = getCategory(category);
  const entry = getCategory(subcategory);
  if (!entry || !parent || entry.parent !== parent.slug) notFound();

  const t = await getTranslations({ locale: activeLocale, namespace: "products" });
  const tCategory = await getTranslations({ locale: activeLocale, namespace: "category" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });

  const products = getProductsByCategory(entry.slug, locale);
  const siblings = getChildCategories(parent.slug);
  const path = getCategoryPath(entry.slug);
  const intro = entry.intro[locale];

  const navItems = getRootCategories().map((root) => ({
    slug: root.slug,
    name: root.names[locale],
    children: getChildCategories(root.slug).map((child) => ({
      slug: child.slug,
      name: child.names[locale],
    })),
  }));

  return (
    <main id="top">
<PageHero
        eyebrow={parent.names[locale]}
        title={entry.names[locale]}
        description={entry.descriptions[locale]}
      />

      <section className="section">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: tCategory("breadcrumbProducts"), href: "/urunler" },
              ...path.map((item) => ({
                name: item.names[locale],
                href: categoryHref(item.slug),
              })),
            ]}
          />
        </div>
        <div className="container layout-sidebar">
          <aside className="layout-sidebar__aside">
            <CategoryNav
              items={navItems}
              activeSlug={parent.slug}
              activeChildSlug={entry.slug}
              locale={activeLocale}
              placeholderLabel={tCategory("selectPlaceholder")}
            />
          </aside>

          <div className="layout-sidebar__content">
            {intro?.html ? (
              <div className="category-intro">
                <RichContent html={intro.html} />
              </div>
            ) : null}

            {siblings.length > 1 ? (
              <div className="sibling-list">
                <h2>{tCategory("subcategories")}</h2>
                <ul>
                  {siblings.map((sibling) => (
                    <li key={sibling.slug}>
                      <Link
                        href={categoryHref(parent.slug, sibling.slug)}
                        aria-current={sibling.slug === entry.slug ? "page" : undefined}
                      >
                        {sibling.names[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {products.length > 0 ? (
              <div className="category-products">
                <h2>
                  {entry.names[locale]} ({t("productCount", { count: products.length })})
                </h2>
                <ProductGrid
                  products={products}
                  fallbackImage={getCategoryImage(entry, locale)}
                  eyebrow={entry.brand}
                />
              </div>
            ) : (
              <div className="empty-state">
                <h2>{t("noProducts")}</h2>
                <p className="section-desc">{t("noProductsText")}</p>
              </div>
            )}
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
