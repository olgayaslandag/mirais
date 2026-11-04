import type { LegalDocument } from "@/lib/legal";

/**
 * Legal belge görünümü: başlıklar ve paragraflar.
 * Ham HTML basılmaz (XSS kuralı): içerik yalnızca paragraf/başlık olarak render edilir.
 */
export default function LegalDoc({
  document,
  updatedLabel,
  updatedAt,
}: {
  document: LegalDocument;
  updatedLabel: string;
  updatedAt: string;
}) {
  return (
    <article className="legal-doc">
      <header className="legal-doc__header">
        <h1 className="legal-doc__title">{document.title}</h1>
        <p className="legal-doc__meta">
          {updatedLabel}: {updatedAt}
        </p>
      </header>

      {document.intro ? (
        <p className="legal-doc__intro">{document.intro}</p>
      ) : null}

      {document.sections.map((section, index) => (
        <section className="legal-doc__section" key={`${section.heading}-${index}`}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${index}-${paragraphIndex}`}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
