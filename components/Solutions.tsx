import { ArrowRight, ArrowUpRight } from "lucide-react";
import { products } from "@/data/content";
import CarouselControls from "./CarouselControls";

// Çözümler: 8 ürün kartı + başlık + navigasyon
export default function Solutions() {
  return (
    <section
      className="section solutions"
      id="solutions"
      aria-labelledby="solutions-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">ÇÖZÜMLER</p>
            <h2 id="solutions-title">Fonksiyonel ve kaliteli çözümler</h2>
            <p className="section-desc">
              Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş. olarak değişen müşteri ihtiyaçlarına fonksiyonel
              ve kaliteli ürünler sunuyor, güvenilir çözüm ortağı olmaya devam
              ediyoruz.
            </p>
          </div>
          <a className="text-link" href="#contact">
            TÜM ÇÖZÜMLER <ArrowRight size={16} />
          </a>
        </div>
        <div className="product-wrap">
          <div className="product-grid">
            {products.map((product, i) => (
              <a
                key={product.alt}
                className="product-card reveal"
                data-reveal="deal"
                data-delay={(i % 4) * 140}
                href={product.href}
                aria-label={product.alt}
              >
                <div className="card-image">
                  <img
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-badge" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div className="card-body">
                  <h3>
                    {product.title.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < product.title.length - 1 && <br />}
                      </span>
                    ))}
                  </h3>
                </div>
              </a>
            ))}
          </div>
          <CarouselControls
            targetSelector=".product-grid"
            label="Çözüm navigasyonu"
            itemCount={products.length}
          />
        </div>
      </div>
    </section>
  );
}
