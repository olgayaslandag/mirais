type Brand = {
  name: string;
  logo: string;
};

type BrandsSectionProps = {
  eyebrow: string;
  title: string;
  brands: Brand[];
};

export default function BrandsSection({ eyebrow, title, brands }: BrandsSectionProps) {
  return (
    <section
      className="section brands"
      id="brands"
      aria-labelledby="brands-title"
    >
      <div className="container">
        <div className="section-heading reveal" data-reveal="up">
          <div className="section-heading-left">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="brands-title">{title}</h2>
          </div>
        </div>
        <div className="brands-grid reveal" data-reveal="blur" data-delay="150">
          {brands.map((b, i) => (
            <div key={`${b.name}-${i}`} className="brand-card">
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
