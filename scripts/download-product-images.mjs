#!/usr/bin/env node
/**
 * WooCommerce CSV'deki tüm wp-content/uploads görsellerini yerel olarak indirir.
 *
 * Çalıştırma: node scripts/download-product-images.mjs
 *
 * - Kaynak: wc-product-export-*.csv içindeki tüm uploads URL'leri (Görseller sütunu
 *   + açıklama/tab HTML'lerindeki <img> src'leri dahil, yinelenenler tek sefer).
 * - Hedef: public/assets/img/products/<uploads-alt-yolunun-slug'u>.<ext>
 *   (scripts/lib/image-map.mjs → uploadsUrlToLocalPath ile birebir aynı adlandırma).
 * - 404/boyutlu görselde (-300x300.jpg gibi) orijinal tam boyut URL denenir;
 *   yine de alınamazsa raporlanır (katalogda o URL uzaktan kalır).
 * - Rapor: data/catalog/image-download-report.txt
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeUploadsUrl, uploadsUrlToLocalPath } from "./lib/image-map.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = join(ROOT, "wc-product-export-26-10-2026-1793029084996.csv");
const OUT_DIR = join(ROOT, "public", "assets", "img", "products");
const REPORT_PATH = join(ROOT, "data", "catalog", "image-download-report.txt");

const csv = readFileSync(CSV_PATH, "utf8");
const URL_RE = /https?:\/\/(?:(?:www\.)?mirais\.com\.tr|localhost\/mirais)\/wp-content\/uploads\/[^\s"'<>\\),]+/gi;
const urls = [...new Set([...csv.matchAll(URL_RE)].map((m) => normalizeUploadsUrl(m[0])))].sort();

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(dirname(REPORT_PATH), { recursive: true });

function localNameFor(url) {
  const local = uploadsUrlToLocalPath(url);
  return local.split("/").pop();
}

function originalVariant(url) {
  return url.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "");
}

async function fetchImage(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return { ok: false, status: res.status, body: null };
  const type = res.headers.get("content-type") ?? "";
  const body = Buffer.from(await res.arrayBuffer());
  return { ok: type.startsWith("image/") && body.length > 0, status: res.status, type, body };
}

async function downloadOne(url) {
  const name = localNameFor(url);
  const dest = join(OUT_DIR, name);
  if (existsSync(dest) && statSync(dest).size > 0) {
    return { url, name, status: "exists", bytes: statSync(dest).size };
  }
  let result = await fetchImage(url);
  let source = url;
  if (!result.ok) {
    const original = originalVariant(url);
    if (original !== url) {
      const retry = await fetchImage(original);
      if (retry.ok) {
        result = retry;
        source = original;
      } else {
        return { url, name, status: `failed(${result.status}/${retry.status})`, bytes: 0, source: url };
      }
    } else {
      return { url, name, status: `failed(${result.status})`, bytes: 0, source: url };
    }
  }
  writeFileSync(dest, result.body);
  return { url, name, status: "ok", bytes: result.body.length, source };
}

const CONCURRENCY = 6;
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = await Promise.all(urls.slice(i, i + CONCURRENCY).map(downloadOne));
  results.push(...batch);
  process.stdout.write(`\r${Math.min(i + CONCURRENCY, urls.length)}/${urls.length}`);
}
process.stdout.write("\n");

const failed = results.filter((r) => r.status.startsWith("failed"));
const lines = [
  `# Görsel indirme raporu — ${new Date().toISOString()}`,
  `# Kaynak CSV: ${CSV_PATH.replace(`${ROOT}/`, "")}`,
  `# Benzersiz URL: ${urls.length} | Başarılı: ${results.length - failed.length} | Başarısız: ${failed.length}`,
  "",
  ...results.map((r) => `${r.status}\t${r.bytes}\t${r.name}\t${r.source ?? r.url}`),
];
writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
console.log(`unique=${urls.length} ok=${results.length - failed.length} failed=${failed.length}`);
console.log(`report: ${REPORT_PATH.replace(`${ROOT}/`, "")}`);
if (failed.length) {
  console.log("başarısız URL'ler:");
  for (const f of failed) console.log(`  ${f.url}`);
}
