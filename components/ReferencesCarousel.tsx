import { referenceLogos } from "@/data/references";

// Referans logo duvarı: sonsuz kayan şerit (marquee)
// İkinci kopya aria-hidden — ekran okuyucu logoları bir kez okur
export default function ReferencesCarousel() {
  return (
    <section
      className="section references"
      id="references"
      aria-labelledby="references-title"
    >
      <div className="container">
        <div className="section-heading reveal" data-reveal="up">
          <div className="section-heading-left">
            <p className="eyebrow">REFERANSLAR</p>
            <h2 id="references-title">Bize güvenen markalar</h2>
          </div>
          <a className="text-link" href="#">
            TÜM REFERANSLAR
          </a>
        </div>
      </div>
      <div className="refs-viewport reveal" data-reveal="blur" data-delay="150">
        <div className="refs-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="refs-group"
              aria-hidden={copy === 1 || undefined}
            >
              {referenceLogos.map((logo) => (
                <div key={`${copy}-${logo.src}`} className="refs-item">
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ""}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
