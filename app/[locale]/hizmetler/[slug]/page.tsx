import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { asRouteHref, Link, getPathname } from "@/lib/i18n/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import QuoteStrip from "@/components/QuoteStrip";
import { getSiteContent } from "@/data/content";
import { buildMetadata, localizedPath } from "@/lib/seo";
import { getServiceCounterpart } from "@/lib/i18n/slugs";
import { locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export function generateStaticParams() {
  const params: Array<{ locale: Locale; slug: string }> = [];
  locales.forEach((locale) => {
    const slugs = serviceSlugs[locale as keyof typeof serviceSlugs];
    slugs.forEach((slug) => {
      params.push({ locale, slug });
    });
  });
  return params;
}

const serviceSlugs = {
  tr: ["urun-satisi", "teknik-destek", "risk-analizi", "egitim-danismanlik"],
  en: ["product-sales", "technical-support", "risk-analysis", "training-consultancy"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const content = getSiteContent(locale);
  const service = content.services.find((s) => s.slug === slug);

  if (!service) {
    return {
      notFound: true,
    };
  }

  // Counterpart slug'ı bul (ters dilde aynı hizmet)
  const counterpartSlug = getServiceCounterpart(slug, locale, locale === "tr" ? "en" : "tr");

  // Alternates: counterpart varsa o dilin path'i; yoksa undefined (only canonical)
  const alternates: Record<string, string | null> = {};
  if (counterpartSlug) {
    const counterpartHref = { pathname: "/hizmetler/[slug]", params: { slug: counterpartSlug } } as never;
    alternates[locale === "tr" ? "en" : "tr"] = localizedPath(locale === "tr" ? "en" : "tr", counterpartHref);
  }

  return buildMetadata({
    locale,
    href: { pathname: "/hizmetler/[slug]", params: { slug } },
    title: service.title,
    description: service.metaDescription || service.description,
    image: service.image,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
  });
}

/** Hizmet detay sayfası: slug üzerinden hizmet bilgilerini gösterir */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "services" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const content = getSiteContent(activeLocale as Locale);
  const service = content.services.find((s) => s.slug === slug);

  if (!service) {
    return <p>{tCommon("notFoundTitle")}</p>;
  }

  const breadcrumbItems = [
    { name: tCommon("home"), href: asRouteHref("/") },
    { name: t("title"), href: asRouteHref("/hizmetler") },
    { name: service.title },
  ];

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("servicesEyebrow")}
        title={service.title}
        description={service.description}
      />

      <section className="section section--soft" style={{ paddingBottom: 0 }} aria-labelledby="service-detail-breadcrumb">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={breadcrumbItems}
          />
        </div>
      </section>

      {/* Section 2: Overview & Visual Grid */}
      <section className="section" style={{ paddingTop: '1rem' }} aria-labelledby="service-overview-title">
        <div className="container">
          <div className="two-column">
            <div className="reveal" data-reveal="left">
              <p className="eyebrow">{t("overviewEyebrow")}</p>
              <h2 id="service-overview-title">{t("overviewTitle")}</h2>
              <p className="section-desc">{service.overviewText}</p>
            </div>
            <div className="reveal" data-reveal="right">
              <Image
                src={service.image}
                alt={service.alt}
                width={800}
                height={500}
                className="service-overview-image"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section className="section" aria-labelledby="service-features-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("featuresEyebrow")}</p>
              <h2 id="service-features-title">{t("featuresTitle")}</h2>
            </div>
          </div>
          <div className="features-grid reveal" data-reveal="up">
            {service.benefitsWithIcons.map((benefit, index) => (
              <div
                key={index}
                className="feature-card"
                data-reveal="deal"
                data-delay={index * 140}
              >
                <div className="feature-card__icon">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Process / Workflow Steps */}
      <section className="section section--soft" aria-labelledby="service-process-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("processEyebrow")}</p>
              <h2 id="service-process-title">{t("processTitle")}</h2>
            </div>
          </div>
          <ol className="process-steps">
            {service.processSteps.map((step, index) => (
              <li
                className="process-step reveal"
                data-reveal="up"
                key={`${step.title}-${index}`}
              >
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

      {/* Section 5: Benefits & Standards */}
      <section className="section section--soft" aria-labelledby="service-benefits-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("benefitsEyebrow")}</p>
              <h2 id="service-benefits-title">{t("benefitsTitle")}</h2>
            </div>
          </div>
          <p className="section-desc reveal" data-reveal="up">
            {service.benefitsParagraph}
          </p>
        </div>
      </section>

      {/* Section 6: Brands / Partner Integration */}
      <section className="section" aria-labelledby="service-brands-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{t("brandsEyebrow")}</p>
              <h2 id="service-brands-title">{t("brandsTitle")}</h2>
            </div>
          </div>
          <div className="brands-grid reveal" data-reveal="blur">
            {service.brands.map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                className="brand-card"
                href={asRouteHref(`/hizmetler/${slug}`)}
                aria-label={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={220}
                  height={80}
                  loading="lazy"
                />
                <span className="brand-card__name">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: QuoteStrip / CTA Band */}
      <QuoteStrip
        title={t("ctaTitle")}
        text={t("ctaText")}
        buttonLabel={tCommon("requestQuote")}
        href={asRouteHref("/hizmetler")}
      />
    </main>
  );
}