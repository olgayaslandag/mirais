"use client";

import { useEffect, useRef, useState } from "react";

// Açılış perdesi: logo + ilerleme çubuğu + yüzde sayaç
// - Sayfa `load` olana kadar %90'a doğru ilerler, sonra %100'e tamamlar
// - En az MIN_MS görünür, en fazla MAX_MS içinde kapanır (takılı kalmaz)
// - Kapanışta perde yukarı sıyrılır, `preloader-done` olayı yayınlanır
const MIN_MS = 1100;
const MAX_MS = 6000;
const EXIT_MS = 750;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    // Hareket azaltmada perde hiç gösterilmez
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("is-loaded");
      setGone(true);
      return;
    }

    const t0 = performance.now();
    const loadedRef = { current: document.readyState === "complete" };
    const valueRef = { current: 0 };
    let raf = 0;
    let maxTimer = 0;
    let exitTimer = 0;

    document.documentElement.classList.add("is-loading");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
      setProgress(100);
      const wait = Math.max(0, MIN_MS - (performance.now() - t0));
      exitTimer = window.setTimeout(() => {
        setLeaving(true);
        document.documentElement.classList.add("is-loaded");
        document.documentElement.classList.remove("is-loading");
        document.body.style.overflow = prevOverflow;
        window.dispatchEvent(new Event("preloader-done"));
        window.setTimeout(() => setGone(true), EXIT_MS);
      }, wait);
    };

    const onLoad = () => {
      loadedRef.current = true;
    };
    if (!loadedRef.current) {
      window.addEventListener("load", onLoad);
    }

    const tick = () => {
      const v = valueRef.current;
      if (loadedRef.current) {
        valueRef.current = Math.min(100, v + (100 - v) * 0.12 + 0.6);
        setProgress(Math.floor(valueRef.current));
        if (valueRef.current >= 99.5) {
          finish();
          return;
        }
      } else {
        // Yükleme sürerken %90 sınırına doğru yavaşla
        valueRef.current = Math.min(90, v + (90 - v) * 0.04 + 0.12);
        setProgress(Math.floor(valueRef.current));
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    // Güvenlik supabı: her durumda kapanır
    maxTimer = window.setTimeout(finish, MAX_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", onLoad);
      document.documentElement.classList.remove("is-loading");
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className={`preloader${leaving ? " preloader--leaving" : ""}`}
      role="status"
      aria-label="Sayfa yükleniyor"
      aria-hidden={leaving || undefined}
    >
      <div className="preloader__inner">
        <span className="preloader__logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/mirais-logo-white.svg"
            alt="Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş."
            width={220}
            height={120}
            draggable={false}
          />
        </span>
        <span className="preloader__bar" aria-hidden="true">
          <span
            className="preloader__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </span>
        <span className="preloader__meta">
          <span className="preloader__name">MİRA İŞ SAĞLIĞI VE GÜVENLİĞİ EKİPMANALARI</span>
          <span className="preloader__pct">{progress}%</span>
        </span>
      </div>
    </div>
  );
}
