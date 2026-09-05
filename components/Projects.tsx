import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/content";
import CarouselControls from "./CarouselControls";

// Projeler: carousel (kayar pencere + sayfa noktaları + oklar)
export default function Projects() {
  return (
    <section
      className="section projects"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">ÖRNEK</p>
            <h2 id="projects-title">PROJELER</h2>
            <p className="section-desc">
              Müşteri memnuniyeti konusundaki hassasiyetimiz ile yaşam
              alanlarına değer katacak sürdürülebilir, ulaşılabilir, kaliteli
              ve uzun ömürlü ürünleri sunma kabiliyetimiz ile yurt içi ve yurt
              dışındaki birçok nitelikli projeye ürün ve hizmet sunuyoruz.
            </p>
          </div>
          <a className="text-link" href="#contact">
            TÜM PROJELER <ArrowRight size={16} />
          </a>
        </div>
        <div className="project-wrap">
          <div
            className="project-viewport"
            role="region"
            aria-roledescription="carousel"
            aria-label="Projeler"
            tabIndex={0}
          >
            <div className="project-grid">
              {projects.map((project, i) => (
                <a
                  key={project.title}
                  className="project-card reveal"
                  data-reveal="deal"
                  data-delay={(i % 4) * 140}
                  href={project.href}
                  aria-label={project.title}
                >
                  <div>
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="card-badge" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <strong>{project.title}</strong>
                </a>
              ))}
            </div>
          </div>
          <CarouselControls
            targetSelector=".project-grid"
            label="Proje navigasyonu"
            showDots
            itemCount={projects.length}
          />
        </div>
      </div>
    </section>
  );
}
