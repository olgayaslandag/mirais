import { Download } from "lucide-react";
import { catalogCta } from "@/data/content";

// Katalog indirme bandı: Hero sonrası koyu lacivert şerit (hook yok — server component)
export default function CatalogBand() {
  return (
    <section
      className="catalog-band"
      id="katalog"
      aria-labelledby="catalog-title"
    >
      <div className="container">
        <div className="catalog-band__grid">
          <div className="catalog-band__content reveal" data-reveal="right">
            <p className="eyebrow">{catalogCta.eyebrow}</p>
            <h2 id="catalog-title">{catalogCta.title}</h2>
            <p className="section-desc">{catalogCta.description}</p>
          </div>
          <div className="catalog-band__action reveal" data-reveal="left">
            <a className="catalog-band__btn" href={catalogCta.href} download>
              <Download size={18} aria-hidden="true" />
              {catalogCta.buttonLabel}
            </a>
            <p className="catalog-band__note">{catalogCta.fileNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
