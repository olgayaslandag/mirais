#!/usr/bin/env node
/**
 * WooCommerce uploads URL → yerel asset yolu eşlemesi (paylaşılan saf fonksiyonlar).
 *
 * https://mirais.com.tr/wp-content/uploads/2018/01/JUSTRİTE-28657.jpg
 *   → /assets/img/products/2018-01-justrite-28657.jpg
 *
 * Deterministik ve çarpışmasızdır: uploads altındaki tam yol slug'a çevrilir,
 * bu yüzden farklı dizinlerdeki aynı isimli dosyalar ayrışır.
 */

const TR_MAP = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", i: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", Â: "a",
  î: "i", Î: "i", û: "u", Û: "u",
};

const UPLOADS_RE =
  /^https?:\/\/(?:(?:www\.)?mirais\.com\.tr|localhost\/mirais)\/wp-content\/uploads\/(.+)$/i;

/** localhost varyantını kanonik https URL'ye çevirir; eşleşmezse null döner */
export function normalizeUploadsUrl(url) {
  const v = String(url ?? "").trim();
  const m = UPLOADS_RE.exec(v);
  if (!m) return null;
  return `https://mirais.com.tr/wp-content/uploads/${m[1]}`;
}

export function isUploadsUrl(url) {
  return UPLOADS_RE.test(String(url ?? "").trim());
}

function slugifyPath(rel) {
  let decoded = rel;
  try {
    decoded = decodeURIComponent(rel);
  } catch {
    /* bozuk encoding: olduğu gibi devam */
  }
  const extMatch = /\.([a-z0-9]+)$/i.exec(decoded);
  const ext = (extMatch?.[1] ?? "jpg").toLowerCase();
  const stem = extMatch ? decoded.slice(0, decoded.length - ext.length - 1) : decoded;
  const slug = stem
    .replace(/[çÇğĞıIİiöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { slug: slug || "image", ext };
}

/** Bir uploads URL'sinin yerel yolunu döndürür; uploads URL'si değilse null */
export function uploadsUrlToLocalPath(url) {
  const canonical = normalizeUploadsUrl(url);
  if (!canonical) return null;
  const rel = canonical.replace(/^https?:\/\/(?:www\.)?mirais\.com\.tr\/wp-content\/uploads\//i, "");
  const clean = rel.split("?")[0].split("#")[0];
  const { slug, ext } = slugifyPath(clean);
  return `/assets/img/products/${slug}.${ext}`;
}
