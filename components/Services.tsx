import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/data/content";
import CarouselControls from "./CarouselControls";

// Hizmetler: 4 kart + başlık + navigasyon
export default function Services() {
  return (
    <section
      className="section services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">YAŞAMINIZA ÖZEL</p>
            <h2 id="services-title">Hizmetler</h2>
            <p className="section-desc">
              Yüzey işlemleri, mekanik işlemler ve size özel imalat çözümleri
              ile güçlü projeler oluşturuyoruz.
            </p>
          </div>
          <a className="text-link" href="#contact">
            TÜM HİZMETLER <ArrowRight size={16} />
          </a>
        </div>
        <div className="service-wrap">
          <div className="service-grid">
            {services.map((service, i) => (
              <a
                key={service.title}
                className="service-card reveal"
                data-reveal="deal"
                data-delay={i * 140}
                href={service.href}
                aria-label={service.title}
              >
                <div className="service-image">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-badge" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </a>
            ))}
          </div>
          <CarouselControls
            targetSelector=".service-grid"
            label="Hizmet navigasyonu"
            itemCount={services.length}
          />
        </div>
      </div>
    </section>
  );
}
