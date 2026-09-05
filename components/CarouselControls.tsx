"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Yatay kaydırma okları + sayfa noktaları: kayar pencereyi sayfa sayfa gezdirir
// 4 ve daha az kartta oklar hiç görünmez; showDots kapalıysa noktalar da çizilmez
export default function CarouselControls({
  targetSelector,
  label,
  showDots = false,
  itemCount,
}: {
  targetSelector: string;
  label: string;
  showDots?: boolean;
  itemCount: number;
}) {
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Kayar pencereyi bul: carousel sarmalayıcı varsa onu, yoksa ızgaranın kendisi
  const getScroller = useCallback((): HTMLElement | null => {
    const controls = controlsRef.current;
    const wrap = controls?.closest(
      ".project-wrap, .product-wrap, .service-wrap"
    );
    const grid = wrap?.querySelector<HTMLElement>(targetSelector);
    if (!grid) return null;
    return grid.closest<HTMLElement>(".project-viewport") ?? grid;
  }, [targetSelector]);

  // Konumu oku: aktif sayfa + baş/son durumu
  const sync = useCallback(() => {
    const scroller = getScroller();
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 1) {
      setPage(0);
      setPageCount(1);
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const count = Math.max(
      1,
      Math.round(scroller.scrollWidth / scroller.clientWidth)
    );
    const current = Math.min(
      count - 1,
      Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth))
    );
    setPage(current);
    setPageCount(count);
    setCanPrev(scroller.scrollLeft > 1);
    setCanNext(scroller.scrollLeft < max - 1);
  }, [getScroller]);

  // Kaydırma + yeniden boyutlandırmada durumu tazele
  useEffect(() => {
    sync();
    const scroller = getScroller();
    if (!scroller) return;
    const onScroll = () => window.requestAnimationFrame(sync);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
    };
  }, [getScroller, sync]);

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Oklar: bir pencere genişliği kadar kaydır (sayfa sayfa gezinme)
  const scroll = (dir: 1 | -1) => {
    const scroller = getScroller();
    if (!scroller) return;
    scroller.scrollBy({
      left: dir * scroller.clientWidth,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  };

  // Noktalar: doğrudan ilgili sayfaya git
  const goToPage = (index: number) => {
    const scroller = getScroller();
    if (!scroller) return;
    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  };

  // 4 ve altı kart sığar: kaydırmaya gerek yok, kontrolleri çizme
  if (itemCount <= 4) return null;

  return (
    <div
      ref={controlsRef}
      className="carousel-controls"
      aria-label={label}
    >
      {showDots && pageCount > 1 && (
        <div className="carousel-dots" role="tablist" aria-label={label}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-current={i === page}
              aria-label={`Sayfa ${i + 1}`}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>
      )}
      <div className="carousel-arrows">
        <button
          type="button"
          aria-label="Önceki"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
        >
          <ArrowLeft size={18} />
        </button>
        <button type="button" aria-label="Sonraki" onClick={() => scroll(1)} disabled={!canNext}>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
