import { brands } from "@/data/content";

// Temsilciliklerimiz: bağlantısız durağan marka kartları
export default function BrandsSection() {
  return (
    <section
      className="section brands"
      id="brands"
      aria-labelledby="brands-title"
    >
      <div className="container">
        <div className="section-heading reveal" data-reveal="up">
          <div className="section-heading-left">
            <p className="eyebrow">MARKALAR</p>
            <h2 id="brands-title">Temsilciliklerimiz</h2>
          </div>
        </div>
        <div className="brands-grid reveal" data-reveal="blur" data-delay="150">
          {brands.map((b) => (
            <div key={b.name} className="brand-card">
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                decoding="async"
              />
              <span className="brand-card__name">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
