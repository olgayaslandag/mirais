import type { ReactNode } from "react";

/**
 * İç sayfa başlığı: eyebrow + başlık + açıklama.
 * Koyu degrade zemin; alt bölümlerde video yok.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="page-hero" aria-labelledby="page-hero-title">
      <div className="container page-hero__inner">
        {eyebrow ? <p className="eyebrow page-hero__eyebrow">{eyebrow}</p> : null}
        <h1 id="page-hero-title" className="page-hero__title">
          {title}
        </h1>
        {description ? (
          <p className="lead page-hero__lead">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
