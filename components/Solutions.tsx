import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, categoryHref } from "@/lib/i18n/navigation";
import CarouselControls from "@/components/CarouselControls";

type Product = {
  title: string[];
  image: string;
  alt: string;
  href: string;
  description: string;
};

type SolutionsProps = {
  eyebrow: string;
  title: string;
  text: string;
  categories: { slug: string; parent: string | null; name: string; description: string; image: string }[];
  allLabel: string;
  ctaLabel: string;
};

export default function Solutions({ eyebrow, title, text, categories, allLabel, ctaLabel }: SolutionsProps) {
  return (
    <section
      className="section solutions"
      id="solutions"
      aria-labelledby="solutions-title"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-heading-left">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="solutions-title">{title}</h2>
            <p className="section-desc">{text}</p>
          </div>
          <a className="text-link" href="#contact">
            {allLabel} <ArrowRight size={16} />
          </a>
        </div>
        <div className="product-wrap">
          <div className="product-grid">
            {categories.map((category, i) => (
              <Link
                key={category.slug}
                className="product-card reveal"
                data-reveal="deal"
                data-delay={(i % 4) * 140}
                href={categoryHref(category.slug)}
                aria-label={category.name}
              >
                <div className="card-image">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-badge" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div className="card-body">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <CarouselControls
            targetSelector=".product-grid"
            label="Çözüm navigasyonu"
            itemCount={categories.length}
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
