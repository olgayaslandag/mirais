/**
 * WordPress içeriğinden üretilmiş, build aşamasında allowlist ile temizlenmiş HTML'i basar.
 *
 * GÜVENLİK: Bu dosya, projedeki TEK `dangerouslySetInnerHTML` kullanım yeridir.
 * İçerik `scripts/build-catalog.mjs` içindeki temizleyiciden geçer; izin verilen
 * etiketler: p, br, strong, em, b, i, u, ul, ol, li, h3, h4, a[href], table,
 * thead, tbody, tr, th, td, img[src,alt], vb. `script`, `iframe`, `style`
 * ve event handler öznitelikleri kaldırılır. Ham WordPress HTML'i asla basılmaz.
 */
export default function RichContent({
  html,
  className = "rich-content",
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
