"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { products, services } from "@/data/content";

// Hizmet başlıkları veride büyük harf tutulur; footer linklerinde başlık düzenine çevrilir.
const toTitleCase = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .split(" ")
    .map((word, index) =>
      index > 0 && word === "ve"
        ? word
        : word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1)
    )
    .join(" ");

// Alt bilgi: kurumsal linkler + adres + iletişim + yukarı dön
export default function SiteFooter() {
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
          <h3>KURUMSAL</h3>
          <a href="#corporate">Hakkımızda</a>
          <a href="#corporate">Vizyon &amp; Misyon</a>
          <a href="#corporate">Kalite Politikamız</a>
          <a href="#corporate">Sürdürülebilirlik</a>
          <a href="#corporate">Kariyer</a>
        </div>
        <div className="reveal" data-reveal="up" data-delay="80">
          <h3>ÜRÜNLER</h3>
          {products.map((product) => (
            <a key={product.href + product.title.join(" ")} href="#solutions">
              {product.title.join(" ")}
            </a>
          ))}
        </div>
        <div className="reveal" data-reveal="up" data-delay="160">
          <h3>HİZMETLER</h3>
          {services.map((service) => (
            <a key={service.title} href="#services">
              {toTitleCase(service.title)}
            </a>
          ))}
        </div>
        <div className="reveal" data-reveal="up" data-delay="240">
          <h3>ADRESLERİMİZ</h3>
          <p className="contact-line">
            <span>
              <strong>İstanbul:</strong> Yenişehir Mah. Sümbül Sk. Atlantis
              Premium İş. Mrk. A Bl. D:18 Pendik/İstanbul
            </span>
          </p>
          <p className="contact-line">
            <span>
              <strong>İzmir:</strong> 1203/12 Sk. No:2/F Merkez Çarşı
              Yenişehir-İzmir
            </span>
          </p>
        </div>
        <div className="reveal" data-reveal="up" data-delay="320">
          <h3>İLETİŞİM</h3>
          <p className="contact-line">
            <Mail aria-hidden="true" />{" "}
            <a
              href="mailto:bilgi@mirais.com.tr"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              bilgi@mirais.com.tr
            </a>
          </p>
          <p className="contact-line">
            <Phone aria-hidden="true" />{" "}
            <a
              href="tel:+902166840575"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              +90 (216) 684 05 75
            </a>
          </p>
          <p className="contact-line">
            <MessageCircle aria-hidden="true" />{" "}
            <a
              href="https://wa.link/fwl04l"
              target="_blank"
              rel="noopener"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              WhatsApp Hattı
            </a>
          </p>
          <div className="socials">
            <a
              href="https://www.linkedin.com/company/mirais/"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="https://www.instagram.com/mirais/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/mirais/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <Youtube />
            </a>
            <a href="mailto:bilgi@mirais.com.tr" aria-label="E-posta">
              <Mail />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
          <span>© 2026 Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş. Tüm hakları saklıdır.</span>
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
