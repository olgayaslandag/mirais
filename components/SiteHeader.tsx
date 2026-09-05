"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navLinks } from "@/data/content";

const AMANOS_LOGO =
  "/assets/img/amanos-logo.png";

// Üst menü: scroll'da .scrolled, mobilde açılır menü
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="site-header"
      className={`site-header${scrolled ? " scrolled" : ""}`}
    >
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Kayra Metal ana sayfa">
          <Image
            className="brand-logo brand-logo-dark"
            src="/assets/img/logo_original.png"
            alt="Kayra Metal"
            width={180}
            height={48}
            priority
          />
          <Image
            className="brand-logo brand-logo-light"
            src="/assets/img/logo_white.svg"
            alt="Kayra Metal"
            width={180}
            height={48}
            priority
          />
        </a>

        <button
          className="menu-toggle d-lg-none"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          id="main-nav"
          aria-label="Ana menü"
          className={`main-nav${open ? " open" : ""}`}
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <button className="language" aria-label="Dil seçimi" type="button">
            TR <ChevronDown size={14} />
          </button>
          <a className="nav-amanos" href="#" aria-label="Amanos">
            {/* Yerel logo: next/image optimizasyonu yerine ham img, orijinal davranış korunur */}
            <img
              className="nav-amanos-light"
              src={AMANOS_LOGO}
              alt="Amanos"
              width={90}
              height={24}
              decoding="async"
            />
            <img
              className="nav-amanos-dark"
              src={AMANOS_LOGO}
              alt=""
              aria-hidden="true"
              width={90}
              height={24}
              decoding="async"
            />
          </a>
        </nav>
      </div>
    </header>
  );
}
