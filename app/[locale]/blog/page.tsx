import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import BlogCard from "@/components/BlogCard";
import QuoteStrip from "@/components/QuoteStrip";
import { getAllPosts } from "@/lib/mdx";
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
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    locale,
    href: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Blog listesi: kapak, tarih ve özet kartları */
export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "blog" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const posts = await getAllPosts(locale);

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("blogEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: t("title") },
            ]}
          />
        </div>
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                  readMoreLabel={tCommon("readMore")}
                  delay={(index % 3) * 120}
                />
              ))}
            </div>
          ) : (
            <p className="section-desc">{t("empty")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
