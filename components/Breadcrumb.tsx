import { Fragment } from "react";
import { Link } from "@/lib/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { RouteHref } from "@/lib/i18n/navigation";

export type Crumb = {
  name: string;
  href?: RouteHref;
};

/**
 * Breadcrumb + BreadcrumbList JSON-LD.
 * Görsel hiyerarşi ve arama motorları için aynı veriyi üretir.
 */
export default function Breadcrumb({
  items,
  withJsonLd = true,
}: {
  items: Crumb[];
  withJsonLd?: boolean;
}) {
  const jsonLd = withJsonLd
    ? breadcrumbJsonLd(
        items.map((item, index) => ({
          name: item.name,
          url:
            index === items.length - 1
              ? "#"
              : item.href
                ? String(item.href)
                : "#",
        })),
      )
    : null;

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li className="breadcrumb__item" key={`${item.name}-${index}`}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="breadcrumb__link">{item.name}</Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>{item.name}</span>
                )}
                {isLast ? null : (
                  <span className="breadcrumb__sep" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {jsonLd ? (
        <script
          type="application/ld+json"
          // JSON-LD verisi bizim ürettiğimiz düz nesnedir; kullanıcı girdisi içermez
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  );
}
