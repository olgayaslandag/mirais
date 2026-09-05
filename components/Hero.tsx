"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides, HERO_AUTOPLAY_MS } from "@/data/content";
import HeroVideo from "./HeroVideo";

// Hero slider: slayt başına video + metin, otomatik geçiş + oklar + gösterge
export default function Hero() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const count = heroSlides.length;

  // Slayt değişiminde zemin: blur'dan nete dönüş animasyonunu yeniden tetikle
  // (HeroVideo remount edilmez, sadece kapsayıcıda animasyon restart yapılır)
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("is-switching");
    // Animasyonu yeniden başlatmak için reflow şart
    void el.offsetWidth;
    el.classList.add("is-switching");
  }, [active]);

  const goTo = useCallback(
    (i: number) => setActive(((i % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Otomatik geçiş: hover/odakta durur, hareket azaltmada kapalıdır
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setActive((i) => (i + 1) % count);
      }
    }, HERO_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  const slide = heroSlides[active];

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div ref={bgRef} className="hero-video is-switching" aria-hidden="true">
        {/* Statik iframe yok: player JS ile üretilir, slayt değişince aynı player'a yüklenir */}
        <HeroVideo videoId={slide.videoId} />
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        {/* Kademeli giriş: başlık → yazı → buton ayrı ayrı fadeInUp ile gelir */}
        <div className="hero-copy" key={slide.index}>
          <p className="eyebrow hero-anim" style={{ ["--d" as string]: "0.05s" }}>
            {slide.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-anim" style={{ ["--d" as string]: "0.18s" }}>
            {slide.title.map((line, i) => (
              <span key={line}>
                {line}
                {i < slide.title.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <span className="rule hero-anim" aria-hidden="true" style={{ ["--d" as string]: "0.34s" }} />
          <p className="lead hero-anim" style={{ ["--d" as string]: "0.46s" }}>{slide.lead}</p>
          <span className="hero-anim hero-cta" style={{ ["--d" as string]: "0.6s" }}>
            <a className="btn btn-sm btn-primary" href="#corporate">
              HAKKIMIZDA <ArrowRight size={16} />
            </a>
          </span>
        </div>
        <div className="hero-side hero-anim" style={{ ["--d" as string]: "0.7s" }}>
          <div
            className="slide-index"
            aria-label="Hero slaytları"
            role="tablist"
          >
            {heroSlides.map((s, i) =>
              i === active ? (
                <strong key={s.index} role="tab" aria-selected="true">
                  {s.index}
                </strong>
              ) : (
                <button
                  key={s.index}
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-label={`Slayt ${s.index}`}
                  onClick={() => goTo(i)}
                >
                  {s.index}
                </button>
              )
            )}
          </div>
          <div className="hero-arrows">
            <button type="button" aria-label="Önceki slayt" onClick={prev}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" aria-label="Sonraki slayt" onClick={next}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Otomatik geçiş ilerleme çizgisi + kaydır işareti */}
      <div className="hero-progress" aria-hidden="true">
        <span key={active} className="hero-progress__bar" style={{ ["--hero-ms" as string]: `${HERO_AUTOPLAY_MS}ms` }} />
      </div>
      <a className="hero-scroll" href="#corporate" aria-label="Aşağı kaydır">
        <span className="hero-scroll__mouse"><span className="hero-scroll__wheel" /></span>
        <span className="hero-scroll__text">KEŞFET</span>
      </a>
    </section>
  );
}
