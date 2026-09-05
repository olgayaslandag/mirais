"use client";

import { useEffect, useRef } from "react";

// Scroll ile beliren animasyon: kademeli (stagger) + yön varyantlı
// - .reveal[data-delay="120"] veya style="--reveal-delay:.12s" ile özel gecikme verilebilir
// - Verilmezse aynı ebevendeki sıraya göre 0/80/160ms kademelenir
// - .section-heading görünen alana girince .inview alır (başlık → açıklama sırayla akar)
export function useRevealRoot<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const headings = Array.from(
      root.querySelectorAll<HTMLElement>(".section-heading, .section-heading-left")
    );
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible", "visible"));
      headings.forEach((el) => el.classList.add("inview"));
      return;
    }
    // Aynı grid içindeki kartları kademelendir: ebeveyn başına sıra sayacı
    const siblingIndex = new Map<ParentNode | null, number>();
    const ensureDelay = (el: HTMLElement) => {
      const explicit = el.dataset.delay ?? el.getAttribute("data-reveal-delay");
      if (explicit != null && explicit !== "") {
        const ms = /^\d+$/.test(explicit.trim()) ? `${explicit.trim()}ms` : explicit.trim();
        el.style.setProperty("--reveal-delay", ms);
      } else if (!el.style.getPropertyValue("--reveal-delay")) {
        const parent = el.parentNode;
        const n = siblingIndex.get(parent) ?? 0;
        siblingIndex.set(parent, n + 1);
        // İlk 8 öğe kademelenir, sonrası sabitlenir (uzun listelerde bekleme olmasın)
        el.style.setProperty("--reveal-delay", `${Math.min(n, 7) * 90}ms`);
      }
    };
    targets.forEach(ensureDelay);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Gecikme kadar bekle, sonra görünür yap (CSS transition gecikmeyi zaten uygular)
            window.setTimeout(() => {
              el.classList.add("is-visible", "visible");
              el.style.opacity = "";
              el.style.transform = "";
            }, 30);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
            headingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    targets.forEach((el) => revealObserver.observe(el));
    headings.forEach((el) => headingObserver.observe(el));
    // Sonradan DOM'a eklenenleri de yakala (örn. Instagram akışı fetch sonrası basılır):
    // eklenen .reveal düğümlerine gecikme verilip gözlemeye alınır
    const pending = new Set<HTMLElement>();
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const fresh: HTMLElement[] = [];
          if (node.matches(".reveal")) fresh.push(node);
          node.querySelectorAll<HTMLElement>(".reveal").forEach((child) => fresh.push(child));
          fresh.forEach((el) => {
            if (el.classList.contains("visible") || pending.has(el)) return;
            pending.add(el);
            ensureDelay(el);
            revealObserver.observe(el);
          });
          const freshHeadings: HTMLElement[] = [];
          if (node.matches(".section-heading, .section-heading-left")) freshHeadings.push(node);
          node.querySelectorAll<HTMLElement>(".section-heading, .section-heading-left").forEach((child) => freshHeadings.push(child));
          freshHeadings.forEach((el) => {
            if (!el.classList.contains("inview")) headingObserver.observe(el);
          });
        });
      });
    });
    mutationObserver.observe(root, { childList: true, subtree: true });
    return () => {
      revealObserver.disconnect();
      headingObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return ref;
}

// Anchor kaydırma: sabit header payı (82px) ile yumuşak kaydırma
export function useSmoothAnchors() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 82;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
