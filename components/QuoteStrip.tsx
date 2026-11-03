import { ArrowRight } from "lucide-react";
import { Link, type RouteHref } from "@/lib/i18n/navigation";

/**
 * Sayfa sonu teklif bandı: iletişim sayfasına yönlendirir.
 */
export default function QuoteStrip({
  title,
  text,
  buttonLabel,
  href = "/iletisim",
}: {
  title: string;
  text?: string;
  buttonLabel: string;
  href?: RouteHref;
}) {
  return (
    <section className="quote-strip" aria-labelledby="quote-strip-title">
      <div className="container quote-strip__inner">
        <div>
          <h2 id="quote-strip-title">{title}</h2>
          {text ? <p className="section-desc">{text}</p> : null}
        </div>
        <Link className="btn btn-sm btn-primary" href={href}>
          {buttonLabel} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
