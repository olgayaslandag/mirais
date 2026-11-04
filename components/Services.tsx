import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import CarouselControls from "@/components/CarouselControls";

type Service = {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
};

type ServicesProps = {
  eyebrow: string;
  title: string;
  text: string;
  services: Service[];
  allLabel: string;
  ctaLabel: string;
};

export default function Services({ eyebrow, title, text, services, allLabel, ctaLabel }: ServicesProps) {
  return (
    <section
      className="section services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="services-title">{title}</h2>
            <p className="section-desc">{text}</p>
          </div>
          <a className="text-link" href="#contact">
            {allLabel} <ArrowRight size={16} />
          </a>
        </div>
        <div className="service-wrap">
          <div className="service-grid">
            {services.map((service, i) => (
              <a
                key={`${service.title}-${i}`}
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

type CarouselControlsProps = {
  targetSelector: string;
  label: string;
  itemCount: number;
};
