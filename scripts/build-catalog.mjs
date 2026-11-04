#!/usr/bin/env node
/**
 * Katalog veri hattı: WooCommerce CSV export → data/catalog/*.json
 *
 * Çalıştırma: node scripts/build-catalog.mjs [csv-yolu]
 *
 * Çıktılar (deterministik, sıralı, zaman damgası yok):
 *   data/catalog/categories.json       → kanon kategori ağacı (slug, ad/açıklama, intro, görsel, alias)
 *   data/catalog/products.tr.json       → TR ürün kayıtları
 *   data/catalog/products.en.json       → EN ürün kayıtları (çeviri yoksa TR fallback)
 *   data/catalog/brands.json            → marka kayıtları
 *   data/catalog/legacy-redirects.json  → eski WordPress URL → yeni yol (301/302)
 *   data/catalog/catalog-report.txt     → duplike / eksik çeviri / boş içerik raporu
 *
 * Kural: script TEK SEFERLİK çalıştırılır; üretilen JSON kanonik kaynak olur.
 * Elle düzeltmeler `data/catalog/overrides.json` üzerinden verilir ve birleştirme
 * sonunda uygulanır (aksi halde yeniden çalıştırmada kaybolur).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isUploadsUrl, uploadsUrlToLocalPath } from "./lib/image-map.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "data", "catalog");
const CSV_DEFAULT = join(ROOT, "wc-product-export-26-10-2026-1793029084996.csv");

// --inspect=<id> : tek ürünün temizlenmiş halini döker (hata ayıklama)
const inspectArg = process.argv.find((arg) => arg.startsWith("--inspect="));
const INSPECT_ID = inspectArg ? Number(inspectArg.split("=")[1]) : null;
const pathArg = process.argv.find((arg) => !arg.startsWith("--") && arg.endsWith(".csv"));
const CSV_PATH = resolve(ROOT, pathArg ?? CSV_DEFAULT);

/* ------------------------------------------------------------------ *
 * 1) RFC4180 CSV ayrıştırıcı (çok satırlı alan + "" kaçışı)
 * ------------------------------------------------------------------ */
function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = input.length;
  while (i < n) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\r") {
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/* ------------------------------------------------------------------ *
 * 2) PHP serialize alt kümesi ayrıştırıcı
 *    a:N:{...} / s:N:"..." / i:N / d:N / b:N / N;
 *    Bildirilen bayt uzunluğu doğruysa kullanılır; değilse geri izleme
 *    (yapısal) çözüm denenir.
 * ------------------------------------------------------------------ */
function byteEnd(src, start, byteLimit) {
  let bytes = 0;
  let i = start;
  while (i < src.length && bytes < byteLimit) {
    const cp = src.codePointAt(i);
    const ch = String.fromCodePoint(cp);
    bytes += Buffer.byteLength(ch, "utf8");
    i += ch.length;
    if (bytes > byteLimit) return -1;
  }
  return bytes === byteLimit ? i : -1;
}

function parsePhpValue(src, pos) {
  const ch = src[pos];
  if (ch === "a") return parsePhpArray(src, pos);
  if (ch === "s") return parsePhpString(src, pos);
  if (ch === "i") {
    const m = /^i:(-?\d+);/.exec(src.slice(pos));
    if (!m) throw new Error(`php-int @${pos}`);
    return { value: Number(m[1]), pos: pos + m[0].length };
  }
  if (ch === "d") {
    const m = /^d:(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?);/.exec(src.slice(pos));
    if (!m) throw new Error(`php-double @${pos}`);
    return { value: Number(m[1]), pos: pos + m[0].length };
  }
  if (ch === "b") {
    const m = /^b:([01]);/.exec(src.slice(pos));
    if (!m) throw new Error(`php-bool @${pos}`);
    return { value: m[1] === "1", pos: pos + m[0].length };
  }
  if (ch === "N") {
    const m = /^N;/.exec(src.slice(pos));
    if (!m) throw new Error(`php-null @${pos}`);
    return { value: null, pos: pos + m[0].length };
  }
  throw new Error(`php-unknown '${ch}' @${pos}`);
}

function parsePhpString(src, pos) {
  const m = /^s:(\d+):"/.exec(src.slice(pos));
  if (!m) throw new Error(`php-string-head @${pos}`);
  const declared = Number(m[1]);
  const start = pos + m[0].length;
  const end = byteEnd(src, start, declared);
  if (end >= 0 && src.slice(end, end + 2) === '";') {
    return { value: src.slice(start, end), pos: end + 2 };
  }
  // Geri izleme: kapatıcı adaylarını sırayla dene, kalanın tamamı çözülebiliyorsa kabul et
  let idx = src.indexOf('";', start);
  while (idx !== -1) {
    try {
      const rest = parsePhpValue(src, idx + 2);
      if (rest.pos === src.length) return { value: src.slice(start, idx), pos: idx + 2 };
    } catch {
      /* sonraki adaya geç */
    }
    idx = src.indexOf('";', idx + 1);
  }
  throw new Error(`php-string-body @${pos}`);
}

function parsePhpArray(src, pos) {
  const m = /^a:(\d+):\{/.exec(src.slice(pos));
  if (!m) throw new Error(`php-array-head @${pos}`);
  let i = pos + m[0].length;
  const map = {};
  for (let n = 0; n < Number(m[1]); n += 1) {
    const key = parsePhpValue(src, i);
    i = key.pos;
    const value = parsePhpValue(src, i);
    i = value.pos;
    map[String(key.value)] = value.value;
  }
  if (src[i] !== "}") throw new Error(`php-array-end @${i}`);
  return { value: map, pos: i + 1 };
}

function parsePhpSerialized(input) {
  const src = String(input ?? "").trim();
  if (!src) return null;
  const result = parsePhpValue(src, 0);
  if (result.pos !== src.length) throw new Error("php-trailing-data");
  return result.value;
}

/* ------------------------------------------------------------------ *
 * 3) HTML temizleyici (allowlist) + video/görsel çıkarımı
 * ------------------------------------------------------------------ */
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "b", "i", "u", "s", "ul", "ol", "li", "h3", "h4",
  "a", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
  "colgroup", "col", "img", "figure", "figcaption", "span", "div", "sup", "sub",
  "small", "hr", "blockquote", "dl", "dt", "dd", "pre", "code",
]);
// İçeriği de atılacak etiketler (tag + içerik)
const DROP_WITH_CONTENT = new Set([
  "script", "style", "iframe", "object", "embed", "noscript", "svg", "math",
  "form", "input", "button", "select", "textarea", "link", "meta", "base",
  "head", "title", "frame", "frameset", "applet", "template",
]);
const ALLOWED_ATTRS = {
  a: ["href", "title"],
  img: ["src", "alt", "width", "height"],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  col: ["span"],
  colgroup: ["span"],
  ol: ["start", "type"],
};
const VOID_TAGS = new Set(["br", "img", "hr", "col"]);

// WordPress tablo çıktısında <td>/<tr> kapanış etiketi gelmez; tarayıcıya bırakılmadan
// kapatılır (yapısal tablo çıkarımı da buna dayanır)
const IMPLIED_END = {
  td: ["td", "th"],
  th: ["td", "th"],
  tr: ["td", "th", "tr"],
  tbody: ["td", "th", "tr", "tbody", "thead", "tfoot"],
  thead: ["td", "th", "tr", "tbody", "thead", "tfoot"],
  tfoot: ["td", "th", "tr", "tbody", "thead", "tfoot"],
  table: ["td", "th", "tr", "tbody", "thead", "tfoot", "table"],
  li: ["li"],
};

const ENTITY_MAP = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…",
  mdash: "—", ndash: "–", laquo: "«", raquo: "»", middot: "·", bull: "•",
  copy: "©", reg: "®", trade: "™", euro: "€", pound: "£", deg: "°",
};

function decodeEntities(input) {
  return String(input ?? "").replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const key = body.toLowerCase();
    return ENTITY_MAP[key] ?? match;
  });
}

function escapeText(input) {
  return String(input ?? "")
    .replace(/&(?![a-zA-Z#][a-zA-Z0-9]{0,10};)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeUrl(value) {
  const v = String(value ?? "").trim();
  if (!v) return null;
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v)) return v;
  return null;
}

function isExternal(href) {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?mirais\.com\.tr/i.test(href);
}

function parseAttributes(raw) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(raw))) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function cleanHtml(input, options = {}) {
  const { collectVideos = true } = options;
  const videos = [];
  let html = String(input ?? "");

  // 1) iframe'ler: yalnızca YouTube gömme kaydı video olarak toplanır, sonra tamamen silinir
  if (collectVideos) {
    html = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (match) => {
      const src = /src\s*=\s*["']([^"']+)["']/i.exec(match)?.[1] ?? "";
      const id = /youtube\.com\/embed\/([\w-]+)/i.exec(src)?.[1];
      if (id) videos.push(id);
      return "";
    });
  }
  html = html.replace(/<iframe\b[^>]*\/?>/gi, (match) => {
    if (collectVideos) {
      const src = /src\s*=\s*["']([^"']+)["']/i.exec(match)?.[1] ?? "";
      const id = /youtube\.com\/embed\/([\w-]+)/i.exec(src)?.[1];
      if (id) videos.push(id);
    }
    return "";
  });

  // 2) WordPress shortcode'leri ve kalan iframe benzeri kalıntılar
  html = html.replace(/\[gallery[^\]]*\]/gi, "");
  html = html.replace(/\[caption[^\]]*\][\s\S]*?\[\/caption\]/gi, "");
  html = html.replace(/\[(\/?)([a-zA-Z]+)[^\]]*\]/g, (match, closing, name) =>
    ["caption", "gallery", "embed", "vc_row", "vc_column"].includes(name.toLowerCase())
      ? ""
      : match,
  );

  // 3) Tokenize + allowlist süzgeci
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g;
  let out = "";
  let cursor = 0;
  let match;
  const openStack = [];
  while ((match = tagRe.exec(html))) {
    const text = html.slice(cursor, match.index);
    // Yalnızca gerçek metin parçaları işlenir (etiketler arası boşluk <br> üretmez)
    if (text.trim().length) {
      out += escapeText(text).replace(/\r?\n/g, "<br />");
    } else if (text.includes("\n")) {
      out += " ";
    }
    cursor = match.index + match[0].length;

    const rawName = match[1].toLowerCase();
    const isClosing = match[0].startsWith("</");
    const selfClosing = match[0].endsWith("/>");

    if (DROP_WITH_CONTENT.has(rawName)) {
      if (!isClosing && !selfClosing) {
        const endRe = new RegExp(`</${rawName}\\s*>`, "gi");
        endRe.lastIndex = cursor;
        const end = endRe.exec(html);
        cursor = end ? end.index + end[0].length : html.length;
        tagRe.lastIndex = cursor;
      }
      continue;
    }
    if (!ALLOWED_TAGS.has(rawName)) continue; // etiket atılır, içerik korunur

    if (isClosing) {
      const idx = openStack.lastIndexOf(rawName);
      if (idx === -1) continue; // eşleşmeyen kapanış yok sayılır
      // Üstteki etiketler önce kapatılır
      while (openStack.length > idx + 1) out += `</${openStack.pop()}>`;
      openStack.pop();
      out += `</${rawName}>`;
      continue;
    }

    const attrs = parseAttributes(match[2] ?? "");
    const allowed = ALLOWED_ATTRS[rawName] ?? [];
    const parts = [];
    for (const attr of allowed) {
      if (!(attr in attrs)) continue;
      if (attr === "href") {
        const href = safeUrl(attrs.href);
        if (!href) continue;
        parts.push(`href="${escapeText(href)}"`);
        if (isExternal(href)) {
          parts.push('target="_blank"');
          parts.push('rel="noopener noreferrer"');
        }
        continue;
      }
      if (attr === "src") {
        const src = safeUrl(attrs.src);
        if (!src || !/^https?:\/\//i.test(src)) continue;
        parts.push(`src="${escapeText(src)}"`);
        continue;
      }
      if (attr === "alt") {
        parts.push(`alt="${escapeText(attrs.alt)}"`);
        continue;
      }
      parts.push(`${attr}="${escapeText(attrs[attr])}"`);
    }
    if (rawName === "a" && !parts.some((p) => p.startsWith("href="))) continue;
    if (rawName === "img" && !parts.some((p) => p.startsWith("src="))) continue;

    if (VOID_TAGS.has(rawName) || selfClosing) {
      out += `<${rawName}${parts.length ? " " + parts.join(" ") : ""} />`;
      continue;
    }
    // Tablo/liste yapısında örtülü kapanış: yeni etiket açılmadan önce açık kalanlar kapatılır
    const implied = IMPLIED_END[rawName];
    if (implied) {
      let target = -1;
      for (let i = openStack.length - 1; i >= 0; i -= 1) {
        if (implied.includes(openStack[i])) {
          target = i;
          break;
        }
      }
      if (target !== -1) {
        // Hedef etikete kadar yığındaki tüm açık etiketler kapatılır
        while (openStack.length > target) out += `</${openStack.pop()}>`;
        // Ardından aynı seviyedeki kalan kardeş etiketler de kapatılır
        while (openStack.length && implied.includes(openStack[openStack.length - 1])) {
          out += `</${openStack.pop()}>`;
        }
      }
    }
    out += `<${rawName}${parts.length ? " " + parts.join(" ") : ""}>`;
    openStack.push(rawName);
  }
  if (html.slice(cursor).trim().length) {
    out += escapeText(html.slice(cursor)).replace(/\r?\n/g, "<br />");
  }
  while (openStack.length) out += `</${openStack.pop()}>`;

  return { html: out.replace(/(<br \/>){3,}/g, "<br /><br />").trim(), videos };
}

/* ------------------------------------------------------------------ *
 * 4) Spec tablosu çıkarımı (<table> → columns/rows)
 * ------------------------------------------------------------------ */
function extractSpecs(html) {
  const tableMatch = /<table\b[\s\S]*?<\/table>/i.exec(html ?? "");
  if (!tableMatch) return null;
  const tableHtml = tableMatch[0];
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = [];
  let rowMatch;
  while ((rowMatch = rowRe.exec(tableHtml))) {
    const cells = [];
    const cellRe = /<(th|td)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
    let cellMatch;
    while ((cellMatch = cellRe.exec(rowMatch[1]))) {
      const text = decodeEntities(
        cellMatch[3].replace(/<[^>]+>/g, " "),
      )
        .replace(/\s+/g, " ")
        .trim();
      const attrs = parseAttributes(cellMatch[2] ?? "");
      const colspan = Math.min(6, Math.max(1, Number(attrs.colspan) || 1));
      cells.push(text);
      for (let c = 1; c < colspan; c += 1) cells.push("");
    }
    if (cells.length) rows.push(cells);
  }
  if (!rows.length) return null;
  const columns = rows[0];
  const body = rows.slice(1).map((row) => {
    const copy = [...row];
    while (copy.length < columns.length) copy.push("");
    return copy.slice(0, columns.length);
  });
  if (!body.length) return { columns, rows: [] };
  return { columns, rows: body };
}

/* ------------------------------------------------------------------ *
 * 5) Metin temizliği (metin sütunları)
 * ------------------------------------------------------------------ */
function cleanText(input) {
  return decodeEntities(
    String(input ?? "")
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      // WordPress shortcode'ları metin içeriğinde de temizlenir
      .replace(/\[[a-zA-Z][^\]]*\]/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function cleanRichText(input) {
  const raw = String(input ?? "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/http:\/\/localhost\/mirais\//g, "https://mirais.com.tr/")
    .replace(/https?:\/\/localhost\/mirais\//g, "https://mirais.com.tr/");
  const cleaned = cleanHtml(raw);
  let html = cleaned.html;
  // WP uploads URL'leri indirilen yerel görsellere eşlenir (bkz. scripts/download-product-images.mjs)
  html = html.replace(
    /https?:\/\/(?:www\.)?mirais\.com\.tr\/wp-content\/uploads\/[^\s"'<>\\)]+/gi,
    (match) => isUploadsUrl(match) ? uploadsUrlToLocalPath(match) : match,
  );
  return { html, videos: cleaned.videos };
}

/* ------------------------------------------------------------------ *
 * 6) Slug üretimi (ASCII kebab, WP sanitize_title ile uyumlu)
 * ------------------------------------------------------------------ */
const TR_MAP = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", i: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", Â: "a", î: "i", Î: "i", û: "u", Û: "u",
};

function slugify(input) {
  const base = String(input ?? "")
    .replace(/[çÇğĞıIİiöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase('tr-TR');
  return base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "") || "urun";
}

/* ------------------------------------------------------------------ *
 * 7) Kategori sabitleri (CSV'deki gerçek adlardan türetildi)
 * ------------------------------------------------------------------ */
const CATEGORY_SEED = [
  {
    slug: "emniyetli-bicaklar",
    parent: null,
    brand: "Martor",
    names: { tr: "Emniyetli Bıçaklar", en: "Safety Knifes" },
    descriptions: {
      tr: "Martor SECUMAX, SECUNORM ve SECUPRO serisi emniyetli bıçak ve kesicilerle el yaralanmalarını önleyin.",
      en: "Prevent hand injuries with Martor SECUMAX, SECUNORM and SECUPRO safety knives and cutters.",
    },
    image: "/assets/img/products/emniyetli-bicaklar.jpg",
    aliases: { tr: [], en: ["safety-knifes"] },
  },
  {
    slug: "aksesuarlar",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: { tr: "Aksesuarlar", en: "Accessories" },
    descriptions: {
      tr: "Kemer çantaları, bağlantı setleri ve Martor kesici aksesuarları.",
      en: "Belt bags, connector sets and Martor cutter accessories.",
    },
    image: null,
    aliases: { tr: [], en: ["accessories"] },
  },
  {
    slug: "guvenli-makaslar",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: { tr: "Güvenli Makaslar", en: "Safe Scissors" },
    descriptions: {
      tr: "SECUMAX 363, 564 ve 565 güvenli makaslarla kaza riski olmadan kesim yapın.",
      en: "Safe cutting without accident risk with SECUMAX 363, 564 and 565 scissors.",
    },
    image: null,
    aliases: { tr: [], en: ["safe-scissors"] },
  },
  {
    slug: "mdp-metal-dedektorunde-algilanabilen-bicaklar",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: {
      tr: "MDP – Metal Dedektöründe Algılanabilen Bıçaklar",
      en: "Knives Detectable in Metal Detectors",
    },
    descriptions: {
      tr: "Metal dedektöründen geçebilen MDP bıçaklar; gıda ve ilaç üretimi için tasarlandı.",
      en: "MDP knives detectable in metal detectors; designed for food and pharmaceutical production.",
    },
    image: null,
    aliases: { tr: [], en: ["knives-detectable-in-metal-detectors"] },
  },
  {
    slug: "secumax-gizli-kesici-uc",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: { tr: "SECUMAX – Gizli Kesici Uç", en: "SECUMAX – Hidden Cutting Edge" },
    descriptions: {
      tr: "Kesici ucu gizlenen SECUMAX bıçaklar: yanlışlıkla temas edilemeyecek güvenlik.",
      en: "SECUMAX knives with hidden cutting edge: safety against accidental contact.",
    },
    image: null,
    aliases: { tr: [], en: ["secumax-hidden-cutting-edge"] },
  },
  {
    slug: "secunorm-yari-otomatik-kesici-uc-geri-cekme",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: {
      tr: "SECUNORM – Yarı Otomatik Kesici Uç Geri Çekme",
      en: "SECUNORM – Semi-Automatic Insert Retraction",
    },
    descriptions: {
      tr: "Kesici ucu yarı otomatik geri çekilen SECUNORM bıçaklar.",
      en: "SECUNORM knives with semi-automatic blade retraction.",
    },
    image: null,
    aliases: { tr: [], en: ["secunorm-semi-automatic-insert-retraction"] },
  },
  {
    slug: "secupro-tam-otomatik-kesici-uc-geri-cekme",
    parent: "emniyetli-bicaklar",
    brand: "Martor",
    names: {
      tr: "SECUPRO – Tam Otomatik Kesici Uç Geri Çekme",
      en: "SECUPRO – Fully Automatic Cutter Retraction",
    },
    descriptions: {
      tr: "Kesici ucu tam otomatik geri çekilen SECUPRO bıçaklar.",
      en: "SECUPRO knives with fully automatic blade retraction.",
    },
    image: null,
    aliases: { tr: [], en: ["secupro-fully-automatic-cutter-retraction"] },
  },
  {
    slug: "emniyetli-kaplar",
    parent: null,
    brand: "Justrite",
    names: { tr: "Emniyetli Kaplar", en: "Safety Containers" },
    descriptions: {
      tr: "Justrite ve Röetzmeier emniyetli kaplarıyla yanıcı sıvıları güvenle depolayın ve aktarın.",
      en: "Store and transfer flammable liquids safely with Justrite and Röetzmeier safety containers.",
    },
    image: "/assets/img/products/emniyetli-kaplar.jpg",
    aliases: { tr: [], en: ["safety-containers"] },
  },
  {
    slug: "paslanmaz-celik-kaplar",
    parent: "emniyetli-kaplar",
    brand: "Röetzmeier",
    names: { tr: "Paslanmaz Çelik Kaplar", en: "Stainless Steel Containers" },
    descriptions: {
      tr: "Röetzmeier paslanmaz çelik güvenli kaplar; hijyenik ve dayanıklı depolama.",
      en: "Röetzmeier stainless steel safety containers; hygienic and durable storage.",
    },
    image: "/assets/img/products/paslanmaz-celik-kaplar.jpg",
    aliases: { tr: [], en: ["stainless-steel-containers"] },
  },
  {
    slug: "hazneli-platformlar",
    parent: null,
    brand: "Justrite",
    names: { tr: "Hazneli Platformlar", en: "Platforms" },
    descriptions: {
      tr: "Sızdırmaz hazneli platformlar ve varil istifleme sistemleriyle döküntüyü kontrol altında tutun.",
      en: "Control spills with spill containment pallets and barrel stacking systems.",
    },
    image: "/assets/img/products/hazneli-platformlar.jpg",
    aliases: { tr: [], en: ["platforms"] },
  },
  {
    slug: "varil-emniyet-urunleri",
    parent: "hazneli-platformlar",
    brand: "Justrite",
    names: { tr: "Varil Emniyet Ürünleri", en: "Barrel Safety Products" },
    descriptions: {
      tr: "Varil hunileri, ventilleri, emniyet vanaları ve antistatik kablolar.",
      en: "Barrel funnels, valves, safety valves and antistatic cables.",
    },
    image: "/assets/img/products/varil-emniyet-urunleri.jpg",
    aliases: { tr: [], en: ["barrel-safety-products"] },
  },
  {
    slug: "guvenli-dolaplar",
    parent: null,
    brand: "Justrite",
    names: { tr: "Güvenli Dolaplar", en: "Safety Cabinets" },
    descriptions: {
      tr: "Çelik ve polietilen güvenli dolaplarla kimyasal depolamayı standartlara uygun hale getirin.",
      en: "Make chemical storage compliant with steel and polyethylene safety cabinets.",
    },
    image: "/assets/img/products/guvenli-dolaplar.jpg",
    aliases: { tr: [], en: ["safety-cabinets"] },
  },
  {
    slug: "endustriyel-kullukler",
    parent: null,
    brand: "Justrite",
    names: { tr: "Endüstriyel Küllükler", en: "Industrial Ashtrays" },
    descriptions: {
      tr: "Yangın güvenliğine uygun Justrite endüstriyel küllüklerle açık alan risklerini azaltın.",
      en: "Reduce open-area risks with fire-safe Justrite industrial ashtrays.",
    },
    image: "/assets/img/products/endustriyel-kullukler.jpg",
    aliases: { tr: [], en: ["industrial-ashtrays"] },
  },
  {
    slug: "seramik-uclu-kesiciler",
    parent: null,
    brand: "Martor",
    names: { tr: "Seramik Uçlu Kesiciler", en: "Ceramic Blade Cutters" },
    descriptions: {
      tr: "Kıvılcımsız kesim yapan seramik uçlu kesiciler. Ürün bilgisi için bizimle iletişime geçin.",
      en: "Ceramic blade cutters for spark-free cutting. Contact us for product information.",
    },
    image: "/assets/img/products/seramik-uclu-kesiciler.jpg",
    aliases: { tr: [], en: [] },
  },
];

// CSV'deki "Kategoriler" değerleri → kanon slug (çoklu yol: "A > B")
const CATEGORY_PATH_MAP = new Map([
  ["Emniyetli Bıçaklar", "emniyetli-bicaklar"],
  ["Emniyetli Bıçaklar > Aksesuarlar", "emniyetli-bicaklar/aksesuarlar"],
  ["Emniyetli Bıçaklar > Güvenli Makaslar", "emniyetli-bicaklar/guvenli-makaslar"],
  [
    "Emniyetli Bıçaklar > MDP – Metal Dedektöründe Algılanabilen Bıçaklar",
    "emniyetli-bicaklar/mdp-metal-dedektorunde-algilanabilen-bicaklar",
  ],
  ["Emniyetli Bıçaklar > SECUMAX – Gizli Kesici Uç", "emniyetli-bicaklar/secumax-gizli-kesici-uc"],
  [
    "Emniyetli Bıçaklar > SECUNORM – Yarı Otomatik Kesici Uç Geri Çekme",
    "emniyetli-bicaklar/secunorm-yari-otomatik-kesici-uc-geri-cekme",
  ],
  [
    "Emniyetli Bıçaklar > SECUPRO – Tam Otomatik Kesici Uç Geri Çekme",
    "emniyetli-bicaklar/secupro-tam-otomatik-kesici-uc-geri-cekme",
  ],
  ["Emniyetli Kaplar", "emniyetli-kaplar"],
  ["Emniyetli Kaplar > Paslanmaz Çelik Kaplar", "emniyetli-kaplar/paslanmaz-celik-kaplar"],
  ["Endüstriyel Küllükler", "endustriyel-kullukler"],
  ["Güvenli Dolaplar", "guvenli-dolaplar"],
  ["Hazneli Platformlar", "hazneli-platformlar"],
  ["Hazneli Platformlar > Varil Emniyet Ürünleri", "hazneli-platformlar/varil-emniyet-urunleri"],
  ["Safety Knifes", "emniyetli-bicaklar"],
  ["Safety Knifes > Accessories", "emniyetli-bicaklar/aksesuarlar"],
  ["Safety Knifes > Safe Scissors", "emniyetli-bicaklar/guvenli-makaslar"],
  [
    "Safety Knifes > Knives Detectable in Metal Detectors",
    "emniyetli-bicaklar/mdp-metal-dedektorunde-algilanabilen-bicaklar",
  ],
  ["Safety Knifes > SECUMAX – Hidden Cutting Edge", "emniyetli-bicaklar/secumax-gizli-kesici-uc"],
  [
    "Safety Knifes > SECUNORM – Semi-Automatic Insert Retraction",
    "emniyetli-bicaklar/secunorm-yari-otomatik-kesici-uc-geri-cekme",
  ],
  [
    "Safety Knifes > SECUPRO – Fully Automatic Cutter Retraction",
    "emniyetli-bicaklar/secupro-tam-otomatik-kesici-uc-geri-cekme",
  ],
  ["Safety Containers", "emniyetli-kaplar"],
  ["Safety Containers > Stainless Steel Containers", "emniyetli-kaplar/paslanmaz-celik-kaplar"],
  ["Industrial Ashtrays", "endustriyel-kullukler"],
  ["Safety Cabinets", "guvenli-dolaplar"],
  ["Platforms", "hazneli-platformlar"],
  ["Platforms > Barrel Safety Products", "hazneli-platformlar/varil-emniyet-urunleri"],
]);

// Kategori tanıtım içeriği kaynağı: yayın dışı "kategori-landing" satırları
const CATEGORY_INTRO_SOURCE = {
  "secumax-gizli-kesici-uc": 396,
  "secupro-tam-otomatik-kesici-uc-geri-cekme": 397,
  "secunorm-yari-otomatik-kesici-uc-geri-cekme": 398,
  "mdp-metal-dedektorunde-algilanabilen-bicaklar": 399,
  "guvenli-makaslar": 400,
};

/* ------------------------------------------------------------------ *
 * 8) Eski WordPress slug'ları (product-sitemap.xml ve
 *    product_cat-sitemap.xml'den alındı) → 301 üretimi için
 * ------------------------------------------------------------------ */
const LEGACY_PRODUCT_SLUGS = {
  73: { tr: ["hazneli-paletler"] },
  82: { tr: ["varil-istifleme-sistemleri"] },
  83: { tr: ["varil-arabasi"] },
  87: { tr: ["plunger"] },
  124: { tr: ["pisetler"] },
  128: { tr: ["daldirma-kabi"] },
  131: { tr: ["karistirma-kaplari"] },
  134: { tr: ["kontamine-atik-kovasi"] },
  139: { tr: ["uno-tip-1"] },
  146: { tr: ["laboratuvar-icin-kaplar"] },
  149: { tr: ["uno-tip-2"] },
  152: { tr: ["emniyetli-kap-polietilen"] },
  155: { tr: ["celik-guvenli-dolaplar"] },
  158: { tr: ["polietilen-guvenli-dolaplar"] },
  162: { tr: ["varil-hunileri"] },
  179: { tr: ["varil-ventilleri"] },
  184: { tr: ["varil-emniyet-vanalari"] },
  190: { tr: ["antistatik-kablolar"] },
  194: { tr: ["endustriyel-kullukler"] },
  233: { tr: ["guvenli-variller"] },
  249: { tr: ["guvenli-kaplar"] },
  253: { tr: ["guvenli-tasima-kaplari"] },
  566: { tr: ["secumax-564"] },
  567: { tr: ["secumax-565"] },
  568: { tr: ["secumax-363"] },
  580: { tr: ["secumax-320-mdp"] },
  581: { tr: ["secunorm-handy-mdp"] },
  582: { tr: ["secunorm-smartcut-mdp"] },
  584: { tr: ["secumax-145-mdp"] },
  585: { tr: ["secumax-150-mdp"] },
  586: { tr: ["secumax-halka-bicak-mdp"] },
  587: { tr: ["secunorm-profi25-mdp"] },
  588: { tr: ["secunorm-profi40-mdp"] },
  589: { tr: ["secumax-opticut"] },
  590: { tr: ["secumax-salvex-sos"] },
  591: { tr: ["secumax-opticut-2"] },
  592: { tr: ["secumax-plasticut"] },
  593: { tr: ["secumax-easysafe"] },
  594: { tr: ["secumax-145"] },
  595: { tr: ["secumax-350"] },
  596: { tr: ["secumax-cardycut"] },
  597: { tr: ["secumax-320"] },
  598: { tr: ["secunorm-multisafe"] },
  599: { tr: ["secunorm-mizar"] },
  600: { tr: ["secunorm-handy"] },
  601: { tr: ["secunorm-380"] },
  602: { tr: ["secunorm-500"] },
  603: { tr: ["secunorm-540"] },
  604: { tr: ["secupro-625"] },
  605: { tr: ["secupro-martego"] },
  606: { tr: ["secupro-megasafe"] },
  607: { tr: ["secupro-merak"] },
  608: { tr: ["secupro-maxisafe"] },
  618: { tr: ["secunorm-610-xdr"] },
  620: { tr: ["secumax-polycut"] },
  624: { tr: ["secuplus-rippex-210"] },
  626: { tr: ["secuplus-rippex-220"] },
  630: { tr: ["connector-seti"] },
  633: { tr: ["kemer-cantasi-s"] },
  635: { tr: ["kemer-cantasi-m"] },
  637: { tr: ["kemer-cantasi-l"] },
  639: { tr: ["kemer-cantasi-xxl"] },
  641: { tr: ["atik-toplama-kutusu"] },
  643: { tr: ["tool-retractor"] },
  756: { en: ["waste-collection-box"] },
  758: { en: ["connector-set"] },
  759: { en: ["belt-bag-l"] },
  760: { en: ["belt-bag-m"] },
  762: { en: ["belt-bag-s"] },
  763: { en: ["belt-bag-xxl"] },
  764: { en: ["secumax-145-2"] },
  765: { en: ["secumax-145-mdp-2"] },
  766: { en: ["secumax-150-mdp-2"] },
  767: { en: ["secumax-320-2"] },
  768: { en: ["secumax-320-mdp-2"] },
  769: { en: ["769"] },
  770: { en: ["secumax-363-2"] },
  771: { en: ["secumax-564-2"] },
  772: { en: ["secumax-565-2"] },
  773: { en: ["secumax-cardycut-2"] },
  774: { en: ["secumax-easysafe-2"] },
  775: { en: ["secumax-ring-cutter-mdp"] },
  776: { en: ["secumax-opticut-3"] },
  777: { en: ["secumax-plasticut-2"] },
  778: { en: ["secumax-polycut-2"] },
  779: { en: ["secumax-salvex-sos-2"] },
  780: { en: ["secunorm-380-2"] },
  781: { en: ["secunorm-500-2"] },
  782: { en: ["secunorm-540-2"] },
  783: { en: ["secunorm-610-xdr-2"] },
  784: { en: ["secunorm-handy-2"] },
  785: { en: ["secunorm-handy-mdp-2"] },
  786: { en: ["secunorm-mizar-2"] },
  787: { en: ["secunorm-multisafe-2"] },
  788: { en: ["secunorm-profi25-mdp-2"] },
  789: { en: ["secunorm-profi40-mdp-2"] },
  791: { en: ["secunorm-smartcut-mdp-2"] },
  792: { en: ["secuplus-rippex-210-2"] },
  794: { en: ["secuplus-rippex-220-2"] },
  795: { en: ["secupro-625-2"] },
  796: { en: ["secupro-martego-2"] },
  797: { en: ["secupro-maxisafe-2"] },
  799: { en: ["secupro-megasafe-2"] },
  801: { en: ["secupro-merak-2"] },
  802: { en: ["tool-retractor-2"] },
  803: { en: ["antistatic-cables"] },
  804: { en: ["bench-can"] },
  805: { en: ["safety-can-polyethylene"] },
  806: { en: ["industrial-ashtrays"] },
  807: { en: ["spill-containment-pallet"] },
  809: { en: ["dip-tanks"] },
  810: { en: ["oily-waste-cans"] },
  811: { en: ["cans-for-laboratory"] },
  813: { en: ["dispensing-cans"] },
  814: { en: ["plunger-2"] },
  815: { en: ["polyethylene-safe-cabinets"] },
  816: { en: ["uno-type-1"] },
  817: { en: ["uno-type-2"] },
  818: { en: ["spill-containment-drum-caddy"] },
  819: { en: ["barrel-safety-valves"] },
  820: { en: ["barrel-funnels"] },
  821: { en: ["barrel-stacking-systems"] },
  822: { en: ["barrel-valves"] },
  823: { en: ["safety-cans"] },
  824: { en: ["safe-barrels"] },
  872: { tr: ["secupro-425"] },
  874: { tr: ["secumax-370"] },
  877: { tr: ["secuplus-567-mdp"] },
  879: { tr: ["secuplus-568"] },
  881: { tr: ["tool-belt"] },
};

/* ------------------------------------------------------------------ *
 * 9) Marka sabitleri
 * ------------------------------------------------------------------ */
const BRANDS = [
  {
    slug: "martor",
    names: { tr: "Martor", en: "Martor" },
    logo: "/assets/img/brands/martor.png",
    site: "https://www.martor.de",
    descriptions: {
      tr: "Alman menşeli Martor; emniyetli bıçak, kesici ve otomatik geri çekmeli kesici uç sistemlerinin üreticisidir.",
      en: "German manufacturer Martor produces safety knives, cutters and automatic blade retraction systems.",
    },
  },
  {
    slug: "justrite",
    names: { tr: "Justrite", en: "Justrite" },
    logo: "/assets/img/brands/justrite.png",
    site: "https://www.justritemfg.com",
    descriptions: {
      tr: "Justrite; yangın ve kimyasal depolama güvenliği, emniyetli kaplar, dolaplar ve sızdırma önleme ürünleri sunar.",
      en: "Justrite provides fire and chemical storage safety: safety containers, cabinets and spill containment products.",
    },
  },
  {
    slug: "roetzmeier",
    names: { tr: "Röetzmeier", en: "Röetzmeier" },
    logo: "/assets/img/brands/roetzmeier.png",
    site: "https://www.roetzmeier.de",
    descriptions: {
      tr: "Röetzmeier; paslanmaz çelik emniyetli kaplar, variller ve hijyenik depolama çözümleri üretir.",
      en: "Röetzmeier manufactures stainless steel safety containers, barrels and hygienic storage solutions.",
    },
  },
];

const BRAND_SLUGS = {
  Martor: "martor",
  Justrite: "justrite",
  "Röetzmeier": "roetzmeier",
};

function guessBrand(name) {
  if (/^(SECUMAX|SECUNORM|SECUPRO|SECUPLUS|KEMER|CONNECTOR|TOOL|ATIK)/i.test(name)) {
    return "Martor";
  }
  return "";
}

/* ------------------------------------------------------------------ *
 * 10) CSV okuma ve satır modeli
 * ------------------------------------------------------------------ */
const csvText = readFileSync(CSV_PATH, "utf8");
const csvRows = parseCsv(csvText);
const header = csvRows[0].map((h) => h.trim());
const col = {};
header.forEach((name, index) => {
  col[name] = index;
});

function cell(row, name) {
  const index = col[name];
  if (index === undefined) return "";
  return (row[index] ?? "").trim();
}

const report = {
  csvFile: CSV_PATH.replace(`${ROOT}/`, ""),
  totalRows: 0,
  excluded: [],
  unknownCategories: [],
  duplicates: [],
  missingEn: [],
  emptyDescriptions: [],
  parseFailures: [],
  noImages: [],
  brandGuesses: [],
  localeFixes: [],
  galleryRemoved: 0,
  introSources: [],
};

const rawProducts = [];
for (const row of csvRows.slice(1)) {
  const id = cell(row, "Kimlik");
  if (!id || !/^\d+$/.test(id)) continue;
  report.totalRows += 1;
  const published = cell(row, "Yayımlanmış") === "1";
  const record = {
    id: Number(id),
    published,
    name: cleanText(cell(row, "İsim")),
    rawName: cell(row, "İsim"),
    sku: cell(row, "Stok kodu (SKU)"),
    shortDescription: cleanText(cell(row, "Kısa açıklama")),
    shortDescriptionRaw: cell(row, "Kısa açıklama"),
    descriptionRaw: cell(row, "Açıklama"),
    categoriesRaw: cell(row, "Kategoriler"),
    imagesRaw: cell(row, "Görseller"),
    locale: (cell(row, "Dil") || "tr").toLocaleLowerCase('tr-TR') === "en" ? "en" : "tr",
    group: cell(row, "Çeviri grubu"),
    brand: cell(row, "Marka") || cell(row, "Markalar"),
    seoDescription: cleanText(cell(row, "Meta: _yoast_wpseo_metadesc")),
    tabsMeta: cell(row, "Meta: yikes_woo_products_tabs"),
  };
  rawProducts.push(record);
}

/* Yayın dışı satırlar → rapor */
const publishedRows = [];
for (const record of rawProducts) {
  if (record.published) publishedRows.push(record);
  else report.excluded.push(record.id);
}

/* ------------------------------------------------------------------ *
 * 11) Kategori çözümlemesi
 * ------------------------------------------------------------------ */
function resolveCategories(rawValue) {
  const slugs = [];
  const unknown = [];
  for (const chunk of rawValue.split(",")) {
    const path = chunk.trim();
    if (!path) continue;
    const mapped = CATEGORY_PATH_MAP.get(path);
    if (!mapped) {
      unknown.push(path);
      continue;
    }
    for (const part of mapped.split("/")) {
      if (!slugs.includes(part)) slugs.push(part);
    }
  }
  return { slugs, unknown };
}

/* ------------------------------------------------------------------ *
 * 12) Sekmeler (yikes_woo_products_tabs) → tabs[]
 * ------------------------------------------------------------------ */
function parseTabs(meta) {
  if (!meta) return [];
  let decoded;
  try {
    decoded = parsePhpSerialized(meta);
  } catch (error) {
    report.parseFailures.push({ stage: "php", message: String(error.message ?? error) });
    return [];
  }
  const tabs = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.title === "string" && typeof node.content === "string") {
      tabs.push({
        title: node.title,
        id: node.id ? String(node.id) : undefined,
        content: node.content,
      });
      return;
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(decoded);
  return tabs;
}

/* ------------------------------------------------------------------ *
 * 13) Ürün kayıtlarını oluştur
 * ------------------------------------------------------------------ */
function buildTabs(record) {
  const tabs = [];
  const videos = [];
  for (const tab of parseTabs(record.tabsMeta)) {
    const cleaned = cleanRichText(tab.content);
    cleaned.videos.forEach((id) => {
      if (!videos.includes(id)) videos.push(id);
    });
    const specs = extractSpecs(cleaned.html);
    // Tablo yapısal tabloya dönüşür; kalan metin html olarak korunur
    const remainingHtml = specs
      ? cleaned.html.replace(/<table\b[\s\S]*?<\/table>/i, "").trim()
      : cleaned.html;
    tabs.push({
      title: tab.title,
      id: tab.id,
      html: remainingHtml || undefined,
      specs: specs ?? undefined,
    });
  }
  return { tabs, videos };
}

function buildImages(raw) {
  // WooCommerce "Görseller" URL'leri yerel asset yoluna çevrilir; diğer URL'ler
  // olduğu gibi kalır. Yinelenenler korunur düzeniyle elenir.
  const urls = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => isUploadsUrl(value) ? uploadsUrlToLocalPath(value) : value);
  const unique = [];
  for (const url of urls) if (url && !unique.includes(url)) unique.push(url);
  return unique;
}

// Çeviri grubundaki TR kardeşin adı (EN satırında ad boşsa kullanılır)
const trNameByGroup = new Map();
for (const record of publishedRows) {
  if (record.locale === "tr" && record.group && record.name) {
    trNameByGroup.set(record.group, record.name);
  }
}

const productRecords = [];
const borrowedNames = [];
for (const record of publishedRows) {
  const { slugs, unknown } = resolveCategories(record.categoriesRaw);
  for (const path of unknown) {
    report.unknownCategories.push({ id: record.id, path });
  }
  const cleaned = cleanRichText(record.descriptionRaw);
  const { tabs, videos } = buildTabs(record);
  // Kısa açıklama alanında gömülü YouTube iframe'leri de toplanır
  const shortCleaned = cleanRichText(record.shortDescriptionRaw);
  const images = buildImages(record.imagesRaw);
  if (!images.length) report.noImages.push(record.id);
  if (!record.shortDescription && !cleaned.html) {
    // Metin yok; spec/tab varsa ürün sayfası yine de anlamlı
    report.emptyDescriptions.push({
      id: record.id,
      name: record.name,
      hasTabs: tabs.length > 0,
    });
  }
  let brand = record.brand;
  if (!brand) {
    brand = guessBrand(record.name);
    if (brand) report.brandGuesses.push({ id: record.id, name: record.name, brand });
  }
  const allVideos = [...videos, ...cleaned.videos, ...shortCleaned.videos];
  // Açıklama içindeki ilk tablo yapısal spec tablosuna dönüştürülür (erişilebilirlik)
  const descriptionSpecs = extractSpecs(cleaned.html);
  const descriptionHtml = descriptionSpecs
    ? cleaned.html.replace(/<table\b[\s\S]*?<\/table>/i, "").trim()
    : cleaned.html;
  // Tab'dan spec devral: ürün açıklamasında tablo yoksa, ilk tab'daki tabloyu ürün düzeyine taşı
  // ve o tab'dan spec'i kaldır (tekrar önlemek için; tab metni kalır)
  let tabSpecs = null;
  let tabSpecsIndex = -1;
  if (!descriptionSpecs) {
    for (let i = 0; i < tabs.length; i += 1) {
      if (tabs[i].specs) {
        tabSpecs = tabs[i].specs;
        tabSpecsIndex = i;
        break;
      }
    }
  }
  const finalSpecs = descriptionSpecs ?? tabSpecs ?? undefined;
  if (tabSpecsIndex !== -1) {
    tabs[tabSpecsIndex] = { ...tabs[tabSpecsIndex], specs: undefined };
  }
  // EN satırında ad boşsa aynı çeviri grubundaki TR adı devralınır
  let name = record.name;
  let borrowedFrom = false;
  if (!name && record.locale === "en" && record.group && trNameByGroup.has(record.group)) {
    name = trNameByGroup.get(record.group);
    borrowedFrom = true;
    borrowedNames.push({ id: record.id, name, group: record.group });
  }
  productRecords.push({
    id: record.id,
    locale: record.locale,
    name,
    borrowedFrom,
    rawName: record.rawName,
    group: record.group,
    brand,
    brandSlug: BRAND_SLUGS[brand] ?? "",
    categories: slugs,
    images,
    videos: [...new Set(allVideos)],
    shortDescription: record.shortDescription,
    descriptionHtml,
    specs: finalSpecs,
    tabs,
    seoDescription: record.seoDescription,
    sku: record.sku,
  });
}

/* ------------------------------------------------------------------ *
 * 14) Duplike kuralı: aynı locale + aynı isim → en yüksek id korunur
 * ------------------------------------------------------------------ */
const kept = [];
const dropped = [];
{
  const byKey = new Map();
  for (const record of productRecords) {
    const key = `${record.locale}::${record.name.toLocaleLowerCase("tr-TR")}`;
    const bucket = byKey.get(key) ?? [];
    bucket.push(record);
    byKey.set(key, bucket);
  }
  for (const bucket of byKey.values()) {
    if (bucket.length === 1) {
      kept.push(bucket[0]);
      continue;
    }
    const sorted = [...bucket].sort((a, b) => a.id - b.id);
    const winner = sorted[sorted.length - 1];
    kept.push(winner);
    for (const loser of sorted.slice(0, -1)) {
      dropped.push(loser);
      report.duplicates.push({
        locale: loser.locale,
        droppedId: loser.id,
        keptId: winner.id,
        name: winner.name,
      });
    }
  }
}
kept.sort((a, b) => a.id - b.id);
dropped.sort((a, b) => a.id - b.id);

/* ------------------------------------------------------------------ *
 * 15) Slug ataması (locale başına benzersiz)
 * ------------------------------------------------------------------ */
const usedSlugs = { tr: new Set(), en: new Set() };
for (const record of kept) {
  const base = slugify(record.name);
  let slug = base;
  let counter = 2;
  while (usedSlugs[record.locale].has(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  usedSlugs[record.locale].add(slug);
  record.slug = slug;
  record.aliases = (LEGACY_PRODUCT_SLUGS[record.id]?.[record.locale] ?? []).filter(
    (legacy) => legacy !== slug,
  );
}

/* ------------------------------------------------------------------ *
 * 16) Çeviri grupları ve EN fallback
 * ------------------------------------------------------------------ */
const groupMap = new Map();
for (const record of kept) {
  if (!record.group) continue;
  const entry = groupMap.get(record.group) ?? {};
  entry[record.locale] = record;
  groupMap.set(record.group, entry);
}

const trProducts = kept.filter((r) => r.locale === "tr");
const enProducts = kept.filter((r) => r.locale === "en");

const enFallbacks = [];
for (const trProduct of trProducts) {
  const twin = trProduct.group ? groupMap.get(trProduct.group)?.en : undefined;
  if (twin) continue;
  const fallback = {
    ...trProduct,
    fallbackFrom: "tr",
    translations: ["tr"],
    aliases: trProduct.aliases,
  };
  enFallbacks.push(fallback);
  report.missingEn.push({ id: trProduct.id, name: trProduct.name, slug: trProduct.slug });
}

/* ------------------------------------------------------------------ *
 * 17) Kategori tanıtım içerikleri (yayın dışı landing satırları)
 * ------------------------------------------------------------------ */
const allRowsById = new Map(rawProducts.map((r) => [r.id, r]));
const categoryIntro = {};
for (const [slug, sourceId] of Object.entries(CATEGORY_INTRO_SOURCE)) {
  const source = allRowsById.get(sourceId);
  if (!source) continue;
  const cleaned = cleanRichText(source.descriptionRaw);
  const { tabs } = buildTabs(source);
  // Metin kaynağı: temizlenmiş açıklama → kısa açıklama → (yoksa boş)
  const text = cleaned.html || cleanText(source.shortDescriptionRaw);
  categoryIntro[slug] = {
    tr: {
      html: text,
      specs: tabs.find((tab) => tab.specs)?.specs ?? null,
    },
    en: null,
  };
  report.introSources.push({ category: slug, sourceId, hasText: Boolean(text) });
}

/* ------------------------------------------------------------------ *
 * 18) Kategori listesi (sıra: üst → alt)
 * ------------------------------------------------------------------ */
const categories = CATEGORY_SEED.map((seed) => {
  const intro = categoryIntro[seed.slug] ?? { tr: null, en: null };
  return {
    slug: seed.slug,
    parent: seed.parent,
    brand: seed.brand,
    names: seed.names,
    descriptions: seed.descriptions,
    image: seed.image,
    aliases: seed.aliases,
    intro: { tr: intro.tr, en: intro.en },
  };
});

/* ------------------------------------------------------------------ *
 * 19) Legacy yönlendirmeler (301 / 302)
 * ------------------------------------------------------------------ */
const redirects = [];
const redirectKeys = new Set();
function addRedirect(source, destination, permanent = true) {
  if (!source || source === destination) return;
  // Eski WordPress URL'leri sondaki eğik çizgiyle çalışır: iki varyant da üretilir
  // (aksi halde "/x/" isteği önce 308 ile "/x"e düşer, iki atlam olur).
  const sources = source.endsWith("/")
    ? [source, source.replace(/\/$/, "")]
    : [source, `${source}/`];
  for (const item of sources) {
    if (!item || item === destination || item === "/") continue;
    const key = `${item}->${destination}`;
    if (redirectKeys.has(key)) continue;
    redirectKeys.add(key);
    redirects.push({ source: item, destination, permanent });
  }
}

// 19.1 Sayfa URL'leri
addRedirect("/referanslar", "/kurumsal", true);
for (const source of ["/hesabim", "/sepet", "/odeme"]) {
  addRedirect(source, "/iletisim", false);
}
for (const source of ["/en/my-account", "/en/cart", "/en/checkout"]) {
  addRedirect(source, "/en/contact", false);
}

// 19.2 Kategori URL'leri (eski /urun-kategori/... → yeni /urunler/...)
for (const category of categories) {
  const trPath = category.parent
    ? `${categories.find((c) => c.slug === category.parent)?.slug}/${category.slug}`
    : category.slug;
  const enPath = category.parent
    ? `${categories.find((c) => c.slug === category.parent)?.slug}/${category.slug}`
    : category.slug;
  // TR: eski slug kanon slug ile aynı → yalnızca taban yol değişir
  addRedirect(`/urun-kategori/${trPath}`, `/urunler/${trPath}`, true);
  for (const alias of category.aliases.en) {
    const legacyPath = category.parent
      ? `${categories.find((c) => c.slug === category.parent)?.aliases.en[0] ?? ""}/${alias}`
      : alias;
    addRedirect(`/en/urun-kategori/${legacyPath}`, `/en/products/${enPath}`, true);
  }
}

// 19.3 Ürün URL'leri (eski /urun/<slug>/ → yeni slug)
for (const record of kept) {
  const legacy = LEGACY_PRODUCT_SLUGS[record.id] ?? {};
  for (const slug of legacy.tr ?? []) {
    addRedirect(`/urun/${slug}`, `/urun/${record.slug}`, true);
  }
  for (const slug of legacy.en ?? []) {
    addRedirect(`/en/urun/${slug}`, `/en/product/${record.slug}`, true);
  }
}
for (const fallback of enFallbacks) {
  for (const slug of fallback.aliases ?? []) {
    addRedirect(`/en/urun/${slug}`, `/en/product/${fallback.slug}`, true);
  }
}
redirects.sort((a, b) => a.source.localeCompare(b.source));

/* ------------------------------------------------------------------ *
 * 20) Overrides birleştirme (elle düzeltmeler, en son uygulanır)
 * ------------------------------------------------------------------ */
const overridesPath = join(OUT_DIR, "overrides.json");
let overrides = { products: {}, categories: {} };
if (existsSync(overridesPath)) {
  overrides = JSON.parse(readFileSync(overridesPath, "utf8"));
}

function applyProductOverrides(list) {
  return list.map((product) => {
    const patch = overrides.products?.[String(product.id)];
    if (!patch) return product;
    const merged = { ...product, ...patch };
    if (patch.tabs) merged.tabs = patch.tabs;
    if (patch.images) merged.images = patch.images;
    if (patch.categories) merged.categories = patch.categories;
    return merged;
  });
}

function applyCategoryOverrides(list) {
  return list.map((category) => {
    const patch = overrides.categories?.[category.slug];
    if (!patch) return category;
    return {
      ...category,
      ...patch,
      names: { ...category.names, ...(patch.names ?? {}) },
      descriptions: { ...category.descriptions, ...(patch.descriptions ?? {}) },
      aliases: { ...category.aliases, ...(patch.aliases ?? {}) },
    };
  });
}

const finalCategories = applyCategoryOverrides(categories);
const finalTr = applyProductOverrides(trProducts);
const finalEn = applyProductOverrides([...enProducts, ...enFallbacks]);

/* Ürün çıktısını sadeleştir (iç alanlar dışarı sızmaz) */
function toPublicProduct(product) {
  return {
    id: product.id,
    slug: product.slug,
    aliases: product.aliases ?? [],
    brand: product.brand,
    brandSlug: product.brandSlug ?? BRAND_SLUGS[product.brand] ?? "",
    categories: product.categories,
    images: product.images,
    videos: product.videos ?? [],
    name: product.name,
    shortDescription: product.shortDescription ?? "",
    descriptionHtml: product.descriptionHtml ?? "",
    specs: product.specs ?? undefined,
    tabs: product.tabs ?? [],
    seoDescription: product.seoDescription ?? "",
    fallbackFrom: product.fallbackFrom ?? (product.borrowedFrom ? "tr" : undefined),
    translations: product.translations ?? [product.locale],
  };
}

const outTr = finalTr.map(toPublicProduct);
const outEn = finalEn.map(toPublicProduct);

/* ------------------------------------------------------------------ *
 * 21) Çıktıları yaz
 * ------------------------------------------------------------------ */
mkdirSync(OUT_DIR, { recursive: true });
function writeJson(name, value) {
  writeFileSync(join(OUT_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
writeJson("categories.json", finalCategories);
writeJson("products.tr.json", outTr);
writeJson("products.en.json", outEn);
writeJson("brands.json", BRANDS);
writeJson("legacy-redirects.json", redirects);

/* Rapor */
const lines = [];
lines.push("MIRA İŞ SAĞLIĞI KATALOG DERLEME RAPORU");
lines.push("=".repeat(72));
lines.push(`Kaynak CSV      : ${report.csvFile}`);
lines.push(`Okunan satır    : ${report.totalRows}`);
lines.push(`Yayınlanan      : ${publishedRows.length}`);
lines.push(`Yayın dışı (${report.excluded.length}) : ${report.excluded.join(", ")}`);
lines.push(`TR ürün         : ${outTr.length}`);
lines.push(`EN ürün         : ${outEn.length} (${enProducts.length} özgün + ${enFallbacks.length} TR fallback)`);
lines.push(`Çeviri grubu    : ${groupMap.size}`);
lines.push(`Kategori        : ${finalCategories.length}`);
lines.push(`Yönlendirme    : ${redirects.length}`);
lines.push("");
lines.push("KATEGORİ HARİTASI");
lines.push("-".repeat(72));
for (const category of finalCategories) {
  lines.push(
    `${category.slug}  (üst: ${category.parent ?? "-"})  marka: ${category.brand}  ` +
      `TR: ${category.names.tr} | EN: ${category.names.en}`,
  );
}
lines.push("");
lines.push(`BİLİNMEYEN KATEGORİ (${report.unknownCategories.length})`);
lines.push("-".repeat(72));
if (report.unknownCategories.length === 0) lines.push("Yok.");
for (const item of report.unknownCategories) lines.push(`  #${item.id}  ${item.path}`);
lines.push("");
lines.push(`YİNELENEN ÜRÜN (${report.duplicates.length})`);
lines.push("-".repeat(72));
if (report.duplicates.length === 0) lines.push("Yok.");
for (const item of report.duplicates) {
  lines.push(
    `  ${item.locale.toLocaleUpperCase('tr-TR')}  #${item.droppedId} -> #${item.keptId}  ${item.name}`,
  );
}
lines.push("");
lines.push(`EN ÇEVİRİSİ EKSİK (TR fallback, ${report.missingEn.length})`);
lines.push("-".repeat(72));
if (report.missingEn.length === 0) lines.push("Yok.");
for (const item of report.missingEn) lines.push(`  #${item.id}  ${item.name}  (${item.slug})`);
lines.push("");
lines.push(`BOŞ AÇIKLAMA METNİ (${report.emptyDescriptions.length})`);
lines.push("-".repeat(72));
if (report.emptyDescriptions.length === 0) lines.push("Yok.");
for (const item of report.emptyDescriptions) {
  lines.push(
    `  #${item.id}  ${item.name}` +
      (item.hasTabs ? "  (spec/tab mevcut, metin yok — içerik borcu)" : "  (tamamen boş)"),
  );
}
lines.push("");
lines.push(`SEKMЕ PARSE HATASI (${report.parseFailures.length})`);
lines.push("-".repeat(72));
if (report.parseFailures.length === 0) lines.push("Yok.");
for (const item of report.parseFailures) lines.push(`  ${item.message}`);
lines.push("");
lines.push(`GÖRSELİ OLMAYAN ÜRÜN (${report.noImages.length})`);
lines.push("-".repeat(72));
if (report.noImages.length === 0) lines.push("Yok.");
for (const id of report.noImages) lines.push(`  #${id}`);
lines.push("");
lines.push(`MARKA ALANI BOŞ (tahmin edildi, ${report.brandGuesses.length})`);
lines.push("-".repeat(72));
if (report.brandGuesses.length === 0) lines.push("Yok.");
for (const item of report.brandGuesses) lines.push(`  #${item.id}  ${item.name} -> ${item.brand}`);
lines.push("");
lines.push(`EN ADI BOŞ (TR adı kullanıldı, ${borrowedNames.length})`);
lines.push("-".repeat(72));
if (borrowedNames.length === 0) lines.push("Yok.");
for (const item of borrowedNames) lines.push(`  #${item.id}  ${item.name}  (grup ${item.group})`);
lines.push("");
lines.push("KATEGORİ TANITIM KAYNAKLARI (yayın dışı landing satırları)");
lines.push("-".repeat(72));
for (const item of report.introSources) lines.push(`  ${item.category}  <- #${item.sourceId}`);
lines.push("");
lines.push("YÖNLENDİRME ÖZETİ");
lines.push("-".repeat(72));
const byKind = { category: 0, product: 0, page: 0 };
for (const redirect of redirects) {
  if (redirect.source.startsWith("/urun-kategori/") || redirect.source.startsWith("/en/urun-kategori/")) {
    byKind.category += 1;
  } else if (redirect.source.startsWith("/urun/") || redirect.source.startsWith("/en/urun/")) {
    byKind.product += 1;
  } else {
    byKind.page += 1;
  }
}
lines.push(`  kategori : ${byKind.category}`);
lines.push(`  ürün    : ${byKind.product}`);
lines.push(`  sayfa   : ${byKind.page}`);
lines.push("");
lines.push("NOT: Ürün permalink kalıbı product-sitemap.xml ile doğrulandı:");
lines.push("     TR: /urun/<slug>/   EN: /en/urun/<slug>/");
lines.push("     Yeni: TR /urun/<slug>   EN /en/product/<slug>");
lines.push("");

writeFileSync(join(OUT_DIR, "catalog-report.txt"), `${lines.join("\n")}\n`, "utf8");

/* ------------------------------------------------------------------ *
 * 22) Konsol özeti
 * ------------------------------------------------------------------ */
if (INSPECT_ID) {
  const record = productRecords.find((r) => r.id === INSPECT_ID);
  if (!record) {
    console.error(`#${INSPECT_ID} bulunamadı`);
  } else {
    console.log(`#${record.id} ${record.name} (${record.locale})`);
    console.log("--- shortDescription ---");
    console.log(record.shortDescription.slice(0, 400));
    console.log("--- descriptionHtml ---");
    console.log(record.descriptionHtml.slice(0, 1200));
    console.log("--- specs ---");
    console.log(JSON.stringify(record.specs ?? null, null, 1).slice(0, 800));
    console.log("--- tabs ---");
    for (const tab of record.tabs) {
      console.log(` * ${tab.title} | specs: ${tab.specs ? "var" : "yok"}`);
      console.log(`   html: ${(tab.html ?? "(tabloya dönüştürüldü)").slice(0, 400)}`);
    }
  }
  process.exit(0);
}

console.log("Katalog derlendi:");
console.log(`  satır        : ${report.totalRows} (yayın dışı ${report.excluded.length})`);
console.log(`  kategori     : ${finalCategories.length}`);
console.log(`  TR ürün      : ${outTr.length}`);
console.log(`  EN ürün      : ${outEn.length} (fallback ${enFallbacks.length})`);
console.log(`  yönlendirme : ${redirects.length}`);
console.log(`  bilinmeyen kategori : ${report.unknownCategories.length}`);
console.log(`  yinelenen    : ${report.duplicates.length}`);
console.log(`  parse hatası : ${report.parseFailures.length}`);
console.log(`  çıktı        : ${OUT_DIR}`);
