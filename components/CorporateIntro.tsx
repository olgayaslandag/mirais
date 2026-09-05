"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { corporateAccordion, corporateFacts } from "@/data/content";

// Sayı animasyonu: `start` gelince 0'dan hedefe sayar ("23K+" → 23 + "K+")
// Başlatma kararı ebeveyndeki tek observer'a ait — her sayı kendi dar
// elementini ayrı izlemeye kalkınca bazıları tetiklenemiyordu
function CountUp({ value, start }: { value: string; start: boolean }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!start) return;
    const parts = value.match(/^(\d+)(.*)$/);
    if (!parts) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseInt(parts[1], 10);
    const suffix = parts[2];
    const duration = 1500;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${Math.round(target * eased)}${suffix}`);
      if (p < 1) raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [start, value]);

  return <strong>{text}</strong>;
}

// Kurumsal blok: görsel + istatistik + akordeon
export default function CorporateIntro() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const factsRef = useRef<HTMLDivElement | null>(null);
  const [factsInView, setFactsInView] = useState(false);

  // İstatistik bloğu görünür alana girince üç sayacı birden başlat
  useEffect(() => {
    const el = factsRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) {
      setFactsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFactsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="corporate-intro"
      id="corporate"
      aria-labelledby="corporate-title"
    >
      <div className="container corporate-intro__grid">
        <div
          className="corporate-intro__visuals reveal"
          data-reveal="left"
          aria-label="Kayra Metal üretim ve mimari uygulamaları"
        >
          <figure className="corporate-photo corporate-photo-main">
            <img
              src="/assets/img/services/toz-boya-2.jpg"
              alt="Kayra Metal elektrostatik toz boya tesisi"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <div className="corporate-intro__statement reveal" data-reveal="right">
          <p className="eyebrow">KURUMSAL</p>
          <h2 id="corporate-title">Metali hassasiyetle işliyor, güvene dönüştürüyoruz.</h2>
          <p className="section-desc">
            2006&apos;dan bu yana alüminyum profil, aksesuar ve kompozit panel
            çözümlerimizle yapı sektörünün ihtiyaçlarına değer katıyoruz.
            Yüksek hacimli stok, hızlı tedarik gücümüz ve Amanos System
            markamızla yurt içi ve yurt dışında yüzlerce projede güvenilir
            üretim ortağı olmaya devam ediyoruz.
          </p>
          <div className="corporate-intro__details">
            <div className="corporate-intro__content">
              <div className="corporate-intro__facts" ref={factsRef}>
                {corporateFacts.map((fact) => (
                  <div key={fact.label}>
                    <CountUp value={fact.value} start={factsInView} />
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
              <div className="corporate-accordion">
                {corporateAccordion.map((item, i) => {
                  const open = openIndex === i;
                  return (
                    <div
                      key={item.title}
                      className={`corporate-accordion__item${
                        open ? " is-open" : ""
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`corporate-panel-${i + 1}`}
                        onClick={() => setOpenIndex(open ? null : i)}
                      >
                        {item.title} <Plus size={14} />
                      </button>
                      <div
                        className="corporate-accordion__panel"
                        id={`corporate-panel-${i + 1}`}
                        aria-hidden={!open}
                      >
                        <div className="corporate-accordion__panel-inner">
                          {item.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
