import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link, blogHref } from "@/lib/i18n/navigation";
import { type BlogPost } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n/routing";

/** Blog kartı: kapak + özet */
export default function BlogCard({
  post,
  locale,
  readMoreLabel,
  delay = 0,
}: {
  post: BlogPost;
  locale: Locale;
  readMoreLabel: string;
  delay?: number;
}) {
  const { frontmatter } = post;
  return (
    <article className="blog-card reveal" data-reveal="up" data-delay={delay}>
      <Link className="blog-card__link" href={blogHref(post.slug)}>
        <div className="blog-card__media">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt=""
              width={800}
              height={450}
              sizes="(max-width: 36rem) 100vw, (max-width: 62rem) 50vw, 33vw"
            />
          ) : (
            <span className="blog-card__placeholder" aria-hidden="true" />
          )}
          <span className="card-badge" aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
        <div className="blog-card__body">
          <h3>{frontmatter.title}</h3>
          <p className="blog-card__excerpt">{frontmatter.description}</p>
          <span className="blog-card__more">
            {readMoreLabel} <ArrowRight size={15} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
