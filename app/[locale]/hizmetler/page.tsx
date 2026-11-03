import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import Accordion from "@/components/Accordion";
import QuoteStrip from "@/components/QuoteStrip";
import CarouselControls from "@/components/CarouselControls";
import { getSiteContent } from "@/data/content";
import { buildMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildMetadata({
    locale,
    href: "/hizmetler",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Hizmetler sayfası: 4 hizmet, süreç adımları, SSS */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "services" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const content = getSiteContent(activeLocale);

  const anchors = [
    "urun-satisi",
    "teknik-destek",
    "risk-analizi",
    "egitim-danismanlik",
  ];

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("servicesEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section" aria-labelledby="services-list-title">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: t("title") },
            ]}
          />
        </div>
        <div className="container">
          <h2 id="services-list-title" className="sr-only">
            {t("title")}
          </h2>
          <div className="service-wrap">
          <div className="service-grid">
            {content.services.map((service, i) => (
              <a
                key={service.title}
                className="service-card reveal"
                data-reveal="deal"
                data-delay={i * 140}
                href={service.href}
                aria-label={service.title}
              >
                <div className="service-image">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-badge" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </a>
            ))}
          </div>
          <CarouselControls
            targetSelector=".service-grid"
            label="Hizmet navigasyonu"
            itemCount={content.services.length}
          />
        </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="process-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("processTitle")}</p>
              <h2 id="process-title">{t("processTitle")}</h2>
            </div>
          </div>
          <ol className="process-steps">
            {content.servicesPage.steps.map((step, index) => (
              <li className="process-step reveal" data-reveal="up" key={step.title}>
                <span className="process-step__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p className="section-desc">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container narrow">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("faqTitle")}</p>
              <h2 id="faq-title">{t("faqTitle")}</h2>
            </div>
          </div>
          <Accordion
            items={content.servicesPage.faq.map((item) => ({
              title: item.question,
              body: item.answer,
            }))}
            idPrefix="services-faq"
          />
        </div>
      </section>

      <QuoteStrip
        title={t("title")}
        text={t("subtitle")}
        buttonLabel={tCommon("requestQuote")}
      />
    </main>
  );
}