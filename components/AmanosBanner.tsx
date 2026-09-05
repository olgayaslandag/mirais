import { ArrowRight } from "lucide-react";

// Amanos bandı: mimari çözümler için dış siteye yönlendirme
export default function AmanosBanner() {
  return (
    <section className="amanos" aria-labelledby="amanos-title">
      <div className="container amanos-grid">
        <div className="amanos-copy reveal" data-reveal="left">
          <p className="eyebrow">MİMARİ ÇÖZÜMLER</p>
          <h2 id="amanos-title">
            Mimari çözümler için
            <br />
            Amanos web sitemiz
            <br />
            hizmetinizde.
          </h2>
          <a className="outline-btn outline-btn-danger" href="#">
            AMANOS SİTESİNE GİT <ArrowRight size={16} />
          </a>
        </div>
        <div className="amanos-logo reveal" data-reveal="zoom" data-delay="150">
          <img
            src="/assets/img/amanos-logo.png"
            alt="Amanos"
            width={220}
            height={60}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
