"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

type Fact = { value: string; label: string };
type AccordionItem = { title: string; body: string };
type CorporateIntroProps = {
  eyebrow: string;
  title: string;
  text: string | string[];
  facts: Fact[];
  accordion: AccordionItem[];
  imageAlt: string;
};

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
export default function CorporateIntro({ eyebrow, title, text, facts, accordion, imageAlt }: CorporateIntroProps) {
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
          aria-label={imageAlt}
        >
          <div className="corporate-video" aria-hidden="true">
            <img
              src="/assets/img/corporate/baretler-renkli.jpg"
              alt={imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="corporate-overlay" aria-hidden="true" />
        </div>
        <div className="corporate-intro__statement reveal" data-reveal="right">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="corporate-title">{title}</h2>
          <div className="section-desc">
            {Array.isArray(text) ? (
              text.map((paragraph, i) => <p key={`corporate-paragraph-${i}`}>{paragraph}</p>)
            ) : (
              <p>{text}</p>
            )}
          </div>
          <div className="corporate-intro__details">
            <div className="corporate-intro__content">
              <div className="corporate-intro__facts" ref={factsRef}>
                {facts.map((fact, i) => (
                  <div key={`${fact.label}-${i}`}>
                    <CountUp value={fact.value} start={factsInView} />
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
              <div className="corporate-accordion">
                {accordion.map((item, i) => {
                  const open = openIndex === i;
                  return (
                    <div
                      key={`${item.title}-${i}`}
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
