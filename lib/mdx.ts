import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Blog içeriği: content/blog/{tr,en}/*.mdx dosyaları.
 * Frontmatter: title, description, date, cover, tags
 */
const BLOG_ROOT = join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  cover?: string;
  tags?: string[];
  author?: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
};

export async function getPostSlugs(locale: Locale): Promise<string[]> {
  try {
    const files = await readdir(join(BLOG_ROOT, locale));
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .sort();
  } catch {
    return [];
  }
}

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<BlogPost | null> {
  try {
    const raw = await readFile(join(BLOG_ROOT, locale, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    const frontmatter: BlogFrontmatter = {
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      cover: data.cover ? String(data.cover) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
      author: data.author ? String(data.author) : undefined,
    };
    return { slug, frontmatter, content };
  } catch {
    return null;
  }
}

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
  const slugs = await getPostSlugs(locale);
  const posts = await Promise.all(slugs.map((slug) => getPost(slug, locale)));
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

/** Tarihi dile göre biçimlendirir */
export function formatDate(date: string, locale: Locale): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}
