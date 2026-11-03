"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { RouteHref } from "@/lib/i18n/navigation";

type NavLink = {
  label: string;
  href: RouteHref;
};

type SiteHeaderProps = {
  locale: string;
  categories: any[];
  navLinks: NavLink[];
};

export default function SiteHeader({ locale, categories, navLinks }: SiteHeaderProps) {
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
        <a className="brand" href="/" aria-label="Mira İş Sağlığı ve Güvenliği Ekipmanları ana sayfa">
          <Image
            className="brand-logo brand-logo-dark"
            src="/assets/img/logo.svg"
            alt="Mira İş Sağlığı ve Güvenliği Ekipmanları"
            width={180}
            height={48}
            priority
          />
          <Image
            className="brand-logo brand-logo-light"
            src="/assets/img/mirais-logo-white.svg"
            alt="Mira İş Sağlığı ve Güvenliği Ekipmanları"
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
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
