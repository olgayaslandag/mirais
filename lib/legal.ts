import legalJson from "@/data/catalog/legal.json";
import type { Locale } from "@/lib/i18n/routing";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalSlug = "kvkk" | "gizlilik" | "kullanim-sartlari" | "cerez-politikasi";

const legal = legalJson as {
  updatedAt: string;
  documents: Record<
    LegalSlug,
    Record<Locale, { title: string; intro: string; sections: LegalSection[] }>
  >;
};

export const legalSlugs: LegalSlug[] = [
  "kvkk",
  "gizlilik",
  "kullanim-sartlari",
  "cerez-politikasi",
];

export function getLegalUpdatedAt(): string {
  return legal.updatedAt;
}

export function getLegalDocument(
  slug: LegalSlug,
  locale: Locale,
): LegalDocument | undefined {
  const entry = legal.documents[slug]?.[locale];
  if (!entry) return undefined;
  return {
    title: entry.title,
    intro: entry.intro,
    sections: entry.sections,
  };
}
