import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, locales, type Locale } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { Link, categoryHref, getPathname, type RouteHref } from "@/lib/i18n/navigation";
import SiteShell from "@/components/SiteShell";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Preloader from "@/components/Preloader";
import { getCategories, getRootCategories, getChildCategories } from "@/lib/catalog";
import { getSiteContent } from "@/data/content";
import { siteUrl } from "@/lib/seo";
import "../globals.css";

// tr/en dışındaki [locale] segmentleri render başlamadan 404 alır:
// bilinmeyen tek segmentli yollar (ör. /xyz.png) SSR'da çökmez.
export const dynamicParams = true;

// Rubik (değişken font, latin + latin-ext alt kümeleri birleştirilmiş) repoda yerelleştirildi:
// build sırasında dış font servisi çağrısı yapılmaz (ağ bağımsız, tekrarlanabilir build).
// latin-ext Türkçe karakterleri (ğ Ğ İ ı ş Ş) de kapsar; tek dosyada tam kapsam.
const rubik = localFont({
  src: "../../assets/fonts/rubik.woff2",
  weight: "300 800",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const viewport: Viewport = {
  themeColor: "#142844",
};

/** Statik üretim: her locale için önceden render edilir */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: t("title"),
      template: `%s | ${t("shortName")}`,
    },
    description: t("description"),
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-270x270.png", sizes: "270x270", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/og-image.png" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Middleware geçerli locale'i garanti eder; savunma amaçlı 404
  const activeLocale = resolveLocale(locale);
  setRequestLocale(activeLocale);

  const messages = await getMessages();
  const t = await getTranslations({ locale: activeLocale });
  const content = getSiteContent(activeLocale);

  // Header menüsü: kategori ağacı (üst + alt)
  const navCategories = getRootCategories().map((category) => ({
    slug: category.slug,
    name: category.names[activeLocale],
    children: getChildCategories(category.slug).map((child) => ({
      slug: child.slug,
      name: child.names[activeLocale],
    })),
  }));

  const navLinks: { label: string; href: RouteHref }[] = [
    { label: t("nav.kurumsal"), href: "/kurumsal" },
    { label: t("nav.markalar"), href: "/markalar" },
    { label: t("nav.urunler"), href: "/urunler" },
    { label: t("nav.hizmetler"), href: "/hizmetler" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.kariyer"), href: "/kariyer" },
    { label: t("nav.iletisim"), href: "/iletisim" },
  ];

  const footerProductLinks: { label: string; href: string }[] = getRootCategories().map((category) => ({
    label: category.names[activeLocale],
    href: getPathname({ locale: activeLocale, href: categoryHref(category.slug) as never }),
  }));

  const footerServiceLinks: { label: string; href: string }[] =
    content.services.map((service) => ({
      label: service.title,
      href: "/hizmetler",
    }));

  return (
    <html lang={activeLocale} suppressHydrationWarning>
      <body className={rubik.className}>
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#top">
            {t("nav.skipToContent")}
          </a>
          <Preloader />
          <SiteShell
            header={
              <SiteHeader
                locale={activeLocale}
                categories={navCategories}
                navLinks={navLinks}
              />
            }
            footer={
              <SiteFooter
                locale={activeLocale}
                labels={{
                  corporate: t("footer.corporate"),
                  products: t("footer.products"),
                  services: t("footer.services"),
                  addresses: t("footer.addresses"),
                  contact: t("footer.contact"),
                  menu: t("footer.menu"),
                  rights: t("footer.rights"),
                  kvkk: t("footer.kvkk"),
                  privacy: t("footer.privacy"),
                  terms: t("footer.terms"),
                  cookies: t("footer.cookies"),
                }}
                menuLinks={navLinks}
                offices={content.offices.map((office) => ({
                  city: office.city,
                  address: office.address,
                  phone: office.phone,
                  fax: office.fax,
                }))}
                productLinks={footerProductLinks}
                serviceLinks={footerServiceLinks}
                email={content.contactEmail}
                whatsappUrl={content.whatsappUrl}
                whatsappLabel={content.whatsappLabel}
                copyright={`© ${new Date().getFullYear()} Mira ${t("footer.rights")}`}
              />
            }
          >
            {children}
          </SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
