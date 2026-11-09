/**
 * build-slug-map.mjs - generates data/catalog/product-slug-map.json
 *
 * Sources for pairs:
 * 1. Same-slug pairs (TR and EN share the same slug)
 * 2. ID-based pairs (same product ID in both locales)
 * 3. Expanded PRODUCT_SLUG_MAP manual entries
 */
import fs from "node:fs";
import path from "node:path";

const CATALOG_DIR = "/Users/macboo/Desktop/Projeler/websites/mirais/data/catalog";
const TR_PRODUCTS = JSON.parse(
  fs.readFileSync(path.join(CATALOG_DIR, "products.tr.json"), "utf8"),
);
const EN_PRODUCTS = JSON.parse(
  fs.readFileSync(path.join(CATALOG_DIR, "products.en.json"), "utf8"),
);

// Build lookup maps
const trBySlug = new Map(TR_PRODUCTS.map((p) => [p.slug, p]));
const trById = new Map(TR_PRODUCTS.map((p) => [p.id, p]));
const enBySlug = new Map(EN_PRODUCTS.map((p) => [p.slug, p]));
const enById = new Map(EN_PRODUCTS.map((p) => [p.id, p]));

// 1. Same-slug pairs: slug exists in both locales
const sameSlugPairs = [];
for (const slug of trBySlug.keys()) {
  if (enBySlug.has(slug)) {
    sameSlugPairs.push([slug, slug]);
  }
}

// 2. ID-based pairs: same product ID in both locales
const idPairs = [];
for (const [id, trProduct] of trById) {
  if (enById.has(id)) {
    const enProduct = enById.get(id);
    const alreadyInSameSlug = sameSlugPairs.some(
      (pair) => pair[0] === trProduct.slug && pair[1] === enProduct.slug,
    );
    if (!alreadyInSameSlug) {
      idPairs.push([trProduct.slug, enProduct.slug]);
    }
  }
}

// 3. Expanded PRODUCT_SLUG_MAP manual entries (renamed pairs)
const manualEntries = [
  ["waste-collection-box", "atik-toplama-kutusu"],
  ["atik-toplama-kutusu", "waste-collection-box"],
].flatMap((entry) => [entry, entry.reverse()]);

// Combine all pairs, deduplicating
const allPairs = [...sameSlugPairs, ...idPairs, ...manualEntries];
const seen = new Set();
const uniquePairs = allPairs.filter((pair) => {
  const key = pair[0] + "|" + pair[1];
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// Write output
const output = { pairs: uniquePairs };
const outputPath = path.join(CATALOG_DIR, "product-slug-map.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log("Generated product-slug-map.json with " + uniquePairs.length + " pairs");
console.log("First 20 pairs:", JSON.stringify(uniquePairs.slice(0, 20)));