import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import LegalDoc from "@/components/LegalDoc";
import { getLegalDocument, getLegalUpdatedAt, type LegalSlug } from "@/lib/legal";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Legal sayfalarının ortak gövdesi (KVKK, gizlilik, kullanım şartları, çerez).
 * İçerik paragraf olarak render edilir; ham HTML basılmaz.
 */
export default async function LegalPage({
  slug,
  locale,
}: {
  slug: LegalSlug;
  locale: Locale;
}) {
  const document = getLegalDocument(slug, locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  if (!document) return null;

  return (
    <main id="top">
      <PageHero
        title={document.title}
      />
      <section className="section">
        <div className="container breadcrumb-wrap">
          <Breadcrumb
            items={[
              { name: tCommon("home"), href: "/" },
              { name: document.title },
            ]}
          />
        </div>
        <div className="container">
          <LegalDoc
            document={document}
            updatedLabel={t("lastUpdated")}
            updatedAt={getLegalUpdatedAt()}
          />
        </div>
      </section>
    </main>
  );
}
