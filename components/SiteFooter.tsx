"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

type Office = {
  city: string;
  address: string;
  phone: string;
  fax: string;
};

type SiteFooterProps = {
  locale: string;
  labels: Record<string, string>;
  offices: Office[];
  productLinks: { label: string; href: string }[];
  serviceLinks: { label: string; href: string }[];
  email: string;
  whatsappUrl: string;
  whatsappLabel: string;
  copyright: string;
};

const socialLinks = {
  linkedin: {
    url: "https://www.linkedin.com/company/mirais/",
    icon: <Linkedin />,
    ariaLabel: "LinkedIn",
  },
  instagram: {
    url: "https://www.instagram.com/mirais/",
    icon: <Instagram />,
    ariaLabel: "Instagram",
  },
  facebook: {
    url: "https://www.facebook.com/mirais/",
    icon: <Mail />,
    ariaLabel: "Facebook",
  },
  email: {
    url: "mailto:bilgi@mirais.com.tr",
    icon: <Mail />,
    ariaLabel: "E-posta",
  },
};

export default function SiteFooter({
  locale,
  labels,
  offices,
  productLinks,
  serviceLinks,
  email,
  whatsappUrl,
  whatsappLabel,
  copyright,
}: SiteFooterProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer id="contact" role="contentinfo">
      <div className="container footer-grid">
        <div className="reveal" data-reveal="up" data-delay="0">
          <h3>{labels.about}</h3>
          <a href="#corporate">{labels.vision}</a>
          <a href="#corporate">{labels.quality}</a>
          <a href="#corporate">{labels.sustainability}</a>
          <a href="#corporate">{labels.careers}</a>
        </div>
        <div className="reveal" data-reveal="up" data-delay="80">
          <h3>{labels.products}</h3>
          {productLinks.map((link, index) => (
            <a key={`${link.href}-${index}`} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="reveal" data-reveal="up" data-delay="160">
          <h3>{labels.services}</h3>
          {serviceLinks.map((link, index) => (
            <a key={`${link.href}-${index}`} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="reveal" data-reveal="up" data-delay="240">
          <h3>{labels.addresses}</h3>
          {offices.map((office) => (
            <div key={office.city} className="office-line">
              <span>
                <strong>{office.city}:</strong> <br /> {office.address}
              </span>
            </div>
          ))}
        </div>
        <div className="reveal" data-reveal="up" data-delay="320">
          <h3>{labels.contact}</h3>
          <p className="contact-line">
            <Mail aria-hidden="true" />{" "}
            <a
              href={`mailto:${email}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {email}
            </a>
          </p>
          <p className="contact-line">
            <Phone aria-hidden="true" />{" "}
            <a
              href={`tel:${offices[0].phone.replace(/\s/g, "")}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {offices[0].phone}
            </a>
          </p>
          <p className="contact-line">
            <MessageCircle aria-hidden="true" />{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {whatsappLabel}
            </a>
          </p>
          <div className="socials">
            <a
              href={socialLinks.linkedin.url}
              target="_blank"
              rel="noopener"
              aria-label={socialLinks.linkedin.ariaLabel}
            >
              {socialLinks.linkedin.icon}
            </a>
            <a
              href={socialLinks.instagram.url}
              target="_blank"
              rel="noopener"
              aria-label={socialLinks.instagram.ariaLabel}
            >
              {socialLinks.instagram.icon}
            </a>
            <a
              href={socialLinks.facebook.url}
              target="_blank"
              rel="noopener"
              aria-label={socialLinks.facebook.ariaLabel}
            >
              {socialLinks.facebook.icon}
            </a>
            <a
              href={socialLinks.email.url}
              aria-label={socialLinks.email.ariaLabel}
            >
              {socialLinks.email.icon}
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{copyright}</span>
        <div>
          <a href="#">KVKK</a>
          <a href="#">Gizlilik Politikası</a>
          <a href="#">Kullanım Şartları</a>
        </div>
        <button
          className="back-top"
          aria-label="Yukarı çık"
          onClick={scrollTop}
          hidden={!showTop}
        >
          <ArrowUp />
        </button>
      </div>
    </footer>
  );
}
