"use client";

import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import CorporateIntro from "@/components/CorporateIntro";
import Solutions from "@/components/Solutions";
import AmanosBanner from "@/components/AmanosBanner";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import InstagramFeed from "@/components/InstagramFeed";
import ReferencesCarousel from "@/components/ReferencesCarousel";
import SiteFooter from "@/components/SiteFooter";
import { useRevealRoot, useSmoothAnchors } from "@/hooks/useSiteEffects";

// Ana sayfa: orijinal index.html bölüm sırasının birebir karşılığı
export default function HomePage() {
  const rootRef = useRevealRoot<HTMLDivElement>();
  useSmoothAnchors();

  return (
    <div ref={rootRef}>
      <SiteHeader />
      <main id="top">
        <Hero />
        <CorporateIntro />
        <Solutions />
        <Services />
        <AmanosBanner />
        <Projects />
        <InstagramFeed />
        <ReferencesCarousel />
      </main>
      <SiteFooter />
    </div>
  );
}
