import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import Accordion from "@/components/Accordion";
import QuoteStrip from "@/components/QuoteStrip";
import CorporateIntro from "@/components/CorporateIntro";
import { Link, brandHref } from "@/lib/i18n/navigation";
import { getBrands, getProducts, getRootCategories } from "@/lib/catalog";
import { getSiteContent } from "@/data/content";
import { buildMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: activeLocale, namespace: "meta" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const content = getSiteContent(activeLocale);
  return buildMetadata({
    locale: activeLocale,
    href: "/kurumsal",
    title: tNav("kurumsal"),
    description: content.corporate.founded,
  });
}

/** Kurumsal sayfası: tanıtım, tarihçe, akordeon, kalite, şubeler, kariyer CTA */
export default async function CorporatePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tBrands = await getTranslations({ locale: activeLocale, namespace: "brands" });
  const content = getSiteContent(activeLocale);
  const brands = getBrands();
  const productCount = getProducts(activeLocale).length;
  const categoryCount = getRootCategories().length;

  return (
    <main id="top">
      <PageHero
        eyebrow="TARİHÇE"
        title={content.corporate.title}
        description={content.corporate.founded}
      />

      <CorporateIntro
        eyebrow="HAKKIMIZDA"
        title={content.corporate.title}
        text={content.corporate.intro}
        facts={content.corporate.facts}
        accordion={content.corporate.accordion}
        imageAlt={content.corporate.title}
      />

      <section className="section section--soft" aria-labelledby="timeline-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">TARİHÇE</p>
              <h2 id="timeline-title">2003'ten bugüne</h2>
            </div>
          </div>
          <ol className="timeline">
            {content.corporate.timeline.map((item) => (
              <li className="timeline__item reveal" data-reveal="up" key={item.year}>
                <span className="timeline__year">{item.year}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--soft" id="kalite" aria-labelledby="quality-title">
        <div className="container two-column">
          <div className="reveal" data-reveal="right">
            <p className="eyebrow">STANDARTLAR</p>
            <h2 id="quality-title">{content.corporate.quality.title}</h2>
            <p className="section-desc">{content.corporate.quality.body}</p>
          </div>
          <div className="reveal" data-reveal="left" id="surdurulebilirlik">
            <p className="eyebrow">ÇEVRE</p>
            <h2>{content.corporate.sustainability.title}</h2>
            <p className="section-desc">{content.corporate.sustainability.body}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="brands-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">TEMSİLCİLİKLERİMİZ</p>
              <h2 id="brands-title">{tBrands("title")}</h2>
              <p className="section-desc">{tBrands("subtitle")}</p>
            </div>
            <div className="brands-grid reveal" data-reveal="blur">
              {brands.map((brand) => (
                <Link
                  className="brand-card"
                  key={brand.slug}
                  href={brandHref(brand.slug)}
                  aria-label={brand.names[locale]}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.names[locale]}
                    width={220}
                    height={80}
                    loading="lazy"
                  />
                  <span className="brand-card__name">{brand.names[locale]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="offices-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">İLETİŞİM & ŞUBELER</p>
              <h2 id="offices-title">{tCommon("contactUs")}</h2>
            </div>
            <div className="office-grid">
              {content.offices.map((office) => (
                <article className="office-card reveal" data-reveal="up" key={office.city}>
                  <h3>
                    <MapPin size={18} aria-hidden="true" /> {office.city}
                  </h3>
                  <p>{office.address}</p>
                  <p className="contact-line">
                    <Phone size={16} aria-hidden="true" />{" "}
                    <a href={`tel:${office.phone.replace(/\s/g, "")}`}>
                      {office.phone}
                    </a>
                  </p>
                  <p className="contact-line">
                    <Mail size={16} aria-hidden="true" />{" "}
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </p>
                  <div className="office-action">
                    <a
                      className="text-link"
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tBrands("officialSite")} <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <QuoteStrip
        title={t("kariyer")}
        text={activeLocale === "tr" ? "İş güvenliği sektöründe bizimle birlikte büyüyün" : "Grow with us in occupational safety"}
        buttonLabel={tCommon("contactUs")}
        href="/kariyer"
      />
    </main>
  );
}