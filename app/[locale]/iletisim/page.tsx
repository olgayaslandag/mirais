import type { Metadata } from "next";
import { MapPin, Phone, Mail, Printer, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
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
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    locale,
    href: "/iletisim",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** İletişim sayfası: şube kartları + yalnızca arayüz olan form */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);
  const t = await getTranslations({ locale: activeLocale, namespace: "contact" });
  const tCommon = await getTranslations({ locale: activeLocale, namespace: "common" });
  const tNav = await getTranslations({ locale: activeLocale, namespace: "nav" });
  const content = getSiteContent(activeLocale);

  return (
    <main id="top">
      <PageHero
        eyebrow={tCommon("contactEyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <section className="section">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: t("title") },
            ]}
          />
        </div>
        <div className="container contact-layout">
          <div className="contact-layout__offices">
            <h2>{t("offices")}</h2>
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
                  <Printer size={16} aria-hidden="true" /> {office.fax}
                </p>
                <p className="contact-line">
                  <Mail size={16} aria-hidden="true" />{" "}
                  <a href={`mailto:${office.email}`}>{office.email}</a>
                </p>
                <a
                  className="text-link"
                  href={office.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("map")}
                </a>
              </article>
            ))}
            <p className="contact-line">
              <MessageCircle size={16} aria-hidden="true" />{" "}
              <a href={content.whatsappUrl} target="_blank" rel="noopener noreferrer">
                {content.whatsappLabel}
              </a>
            </p>
          </div>

          <div className="contact-layout__form">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
