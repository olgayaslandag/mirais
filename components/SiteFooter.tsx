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
          <a href="#solutions">Alüminyum Profiller</a>
          <a href="#solutions">Aksesuarlar</a>
          <a href="#solutions">Kompozit Paneller</a>
          <a href="#solutions">Kupeste Profilleri</a>
        </div>
        <div className="reveal" data-reveal="up" data-delay="160">
          <h3>HİZMETLER</h3>
          <a href="#services">Yüzey İşlemleri</a>
          <a href="#services">Mekanik İşlemler</a>
          <a href="#services">İzomat</a>
          <a href="#services">Proje Hizmetleri</a>
        </div>
        <div className="reveal" data-reveal="up" data-delay="240">
          <h3>ADRESLERİMİZ</h3>
          <p className="contact-line">
            <span>
              <strong>Merkez:</strong> Akçaburgaz, 592. Sk No:14/1, PK34522
              Esenyurt / İstanbul
            </span>
          </p>
          <p className="contact-line">
            <span>
              <strong>Fabrika:</strong> Sarıcaali Küme Evler No:311/1, 39750
              Lüleburgaz / Kırklareli
            </span>
          </p>
        </div>
        <div className="reveal" data-reveal="up" data-delay="320">
          <h3>İLETİŞİM</h3>
          <p className="contact-line">
            <Mail aria-hidden="true" />{" "}
            <a
              href="mailto:kayra@kayrametal.com"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              kayra@kayrametal.com
            </a>
          </p>
          <p className="contact-line">
            <Phone aria-hidden="true" />{" "}
            <a
              href="tel:+902124520050"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              0(212) 452 00 50
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
              href="https://www.linkedin.com/company/kayra-metal-san-tic-ltd-ti/"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="http://instagram.com/kayrametal"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/Kayrametal/?locale=tr_TR"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <Youtube />
            </a>
            <a href="mailto:kayra@kayrametal.com" aria-label="E-posta">
              <Mail />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2024 Kayra Metal A.Ş. Tüm hakları saklıdır.</span>
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
