import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import JobList from "@/components/JobList";
import QuoteStrip from "@/components/QuoteStrip";
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
  const t = await getTranslations({ locale, namespace: "careers" });
  return buildMetadata({
    locale,
    href: "/kariyer",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Kariyer sayfası: pozisyon listesi ve e-posta başvuru akışı */
export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "careers" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("careersEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section" aria-labelledby="positions-title">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: t("title") },
            ]}
          />
        </div>
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-left">
              <p className="eyebrow">{tCommon("careersEyebrow")}</p>
              <h2 id="positions-title">{t("openPositions")}</h2>
            </div>
          </div>
          <JobList
            locale={locale}
            labels={{
              location: t("location"),
              department: t("department"),
              experience: t("experience"),
              skills: t("skills"),
              apply: t("apply"),
              applySubject: (position: string) => t("applySubject", { position }),
              applyNote: t("applyNote"),
              empty: t("empty"),
            }}
          />
          <p className="section-desc careers-note">{t("cvNote")}</p>
        </div>
      </section>

      <QuoteStrip
        title={t("title")}
        text={t("subtitle")}
        buttonLabel={tCommon("contactUs")}
        href="/iletisim"
      />
    </main>
  );
}
