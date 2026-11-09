import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import BlogCard from "@/components/BlogCard";
import QuoteStrip from "@/components/QuoteStrip";
import { Link, blogHref } from "@/lib/i18n/navigation";
import { formatDate, getAllPosts, getPost, getPostSlugs } from "@/lib/mdx";
import { articleJsonLd, buildMetadata, localizedPath, siteUrl } from "@/lib/seo";
import { getBlogCounterpart } from "@/lib/i18n/slugs";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) =>
      (await getPostSlugs(locale)).map((slug) => ({ locale, slug })),
    ),
  );
  return params.flat();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);
  if (!post) return {};
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    locale,
    href: { pathname: "/blog/[slug]", params: { slug } },
    title: post.frontmatter.title,
    description: post.frontmatter.description || t("subtitle"),
    image: post.frontmatter.cover ?? null,
    type: "article",
    publishedTime: post.frontmatter.date,
  });
}

/** Blog yazısı: MDX gövde + yazar/tarih + önceki/sonraki */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const post = await getPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale: activeLocale, namespace: "blog" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });

  const allPosts = await getAllPosts(locale);
  const index = allPosts.findIndex((item) => item.slug === post.slug);
  const previous = index > 0 ? allPosts[index - 1] : undefined;
  const next = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : undefined;

  const canonical = `${siteUrl}${localizedPath(locale, {
    pathname: "/blog/[slug]",
    params: { slug: post.slug },
  })}`;
  const jsonLd = articleJsonLd({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    url: canonical,
    image: post.frontmatter.cover,
  });

  return (
    <main id="top">
      <PageHero
        eyebrow={t("title")}
        title={post.frontmatter.title}
        description={post.frontmatter.description}
      />

      <article className="section article">
        <div className="container breadcrumb-wrap article__inner">
          <div className="article__meta">
            <time dateTime={post.frontmatter.date}>
              {t("publishedOn")}: {formatDate(post.frontmatter.date, locale)}
            </time>
            {post.frontmatter.author ? (
              <span>{post.frontmatter.author}</span>
            ) : null}
            {post.frontmatter.tags?.length ? (
              <ul className="article__tags">
{post.frontmatter.tags.map((tag, tagIndex) => (
                <li key={`${tag}-${tagIndex}`}>
                    <Link href="/blog" className="article__tags-link">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {post.frontmatter.cover ? (
            <Image
              className="article__cover"
              src={post.frontmatter.cover}
              alt=""
              width={1200}
              height={675}
              priority
            />
          ) : null}

          <div className="rich-content article__body">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          <nav className="article__nav" aria-label={t("title")}>
            {previous ? (
              <Link href={blogHref(previous.slug)} className="text-link">
                ← {t("prev")}: {previous.frontmatter.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={blogHref(next.slug)} className="text-link">
                {t("next")}: {next.frontmatter.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <div className="related-posts">
            <h3 className="section-heading-left">
              <span className="eyebrow">{t("relatedPosts")}</span>
              {t("relatedPostsTitle")}
            </h3>
            <div className="blog-grid">
              {previous && <BlogCard key={`prev-${previous.slug}`} post={previous} locale={locale} readMoreLabel={tCommon("readMore")} />}
              {next && <BlogCard key={`next-${next.slug}`} post={next} locale={locale} readMoreLabel={tCommon("readMore")} />}
              {allPosts
                .filter((p) => p.slug !== post.slug && p.slug !== previous?.slug && p.slug !== next?.slug)
                .slice(0, 3 - (previous ? 1 : 0) - (next ? 1 : 0))
                .map((p, pIndex) => (
                  <BlogCard
                    key={`${p.slug}-${pIndex}`}
                    post={p}
                    locale={locale}
                    readMoreLabel={tCommon("readMore")}
                    delay={0}
                  />
                ))}
            </div>
          </div>

          <p className="article__back">
            <Link className="text-link" href="/blog">
              ← {t("backToBlog")}
            </Link>
          </p>
        </div>
      </article>

      <QuoteStrip
        title={t("title")}
        text={t("subtitle")}
        buttonLabel={tCommon("contactUs")}
        href="/iletisim"
      />
    </main>
  );
}