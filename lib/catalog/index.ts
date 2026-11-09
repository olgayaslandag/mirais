import categoriesJson from "@/data/catalog/categories.json";
import productsTrJson from "@/data/catalog/products.tr.json";
import productsEnJson from "@/data/catalog/products.en.json";
import brandsJson from "@/data/catalog/brands.json";

/* ------------------------------------------------------------------ *
 * Tipler
 * ------------------------------------------------------------------ */
export type Locale = "tr" | "en";

export type SpecTable = {
  columns: string[];
  rows: string[][];
};

export type ProductTab = {
  title: string;
  id?: string;
  html?: string;
  specs?: SpecTable;
};

export type CategoryIntro = {
  html: string;
  specs: SpecTable | null;
};

export type Category = {
  slug: string;
  parent: string | null;
  brand: string;
  names: { tr: string; en: string };
  descriptions: { tr: string; en: string };
  image: string | null;
  aliases: { tr: string[]; en: string[] };
  intro: { tr: CategoryIntro | null; en: CategoryIntro | null };
};

export type Product = {
  id: number;
  slug: string;
  aliases: string[];
  brand: string;
  brandSlug: string;
  categories: string[];
  images: string[];
  videos: string[];
  name: string;
  shortDescription: string;
  descriptionHtml: string;
  specs?: SpecTable;
  tabs: ProductTab[];
  seoDescription: string;
  fallbackFrom?: Locale;
  translations: Locale[];
};

export type Brand = {
  slug: string;
  names: { tr: string; en: string };
  logo: string;
  site: string;
  descriptions: { tr: string; en: string };
};

/* ------------------------------------------------------------------ *
 * Sabit kategori sıralaması: ana sayfa ve ürünler sayfası için 8 ürün grubu
 * ------------------------------------------------------------------ */
export const HOME_CATEGORY_ORDER: string[] = [
  "emniyetli-bicaklar",
  "emniyetli-kaplar",
  "hazneli-platformlar",
  "guvenli-dolaplar",
  "varil-emniyet-urunleri",
  "endustriyel-kullukler",
];

const IMAGE_PLACEHOLDER = "/assets/img/products/hazneli-platformlar.jpg";

const TR_CHAR_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", i: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", Â: "a",
  î: "i", Î: "i", û: "u", Û: "u",
};

const UPLOADS_URL_RE =
  /^https?:\/\/(?:(?:www\.)?mirais\.com\.tr|localhost\/mirais)\/wp-content\/uploads\/(.+)$/i;

function normalizeImageUrl(url: string): string {
  if (typeof url !== "string" || !url) return IMAGE_PLACEHOLDER;
  const match = UPLOADS_URL_RE.exec(url.trim());
  if (!match) return url;
  let rel = match[1].split("?")[0].split("#")[0];
  try {
    rel = decodeURIComponent(rel);
  } catch {
    /* bozuk encoding: olduğu gibi devam */
  }
  const extMatch = /\.([a-z0-9]+)$/i.exec(rel);
  const ext = (extMatch?.[1] ?? "jpg").toLowerCase();
  const stem = extMatch ? rel.slice(0, rel.length - ext.length - 1) : rel;
  const slug = stem
    .replace(/[çÇğĞıIİiöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_CHAR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/assets/img/products/${slug || "image"}.${ext}`;
}

/* ------------------------------------------------------------------ *
 * Ham veri (build script'i tarafından üretilmiş, elle düzeltilmiş JSON)
 * ------------------------------------------------------------------ */
const normalizeProductImages = (products: Product[]): Product[] =>
  products.map((product) => ({
    ...product,
    images: product.images.map(normalizeImageUrl),
  }));

const categories = categoriesJson as Category[];
const productsByLocale: Record<Locale, Product[]> = {
  tr: normalizeProductImages(productsTrJson as Product[]),
  en: normalizeProductImages(productsEnJson as Product[]),
};
const brands = brandsJson as Brand[];

/* ------------------------------------------------------------------ *
 * Birincil anahtar kontrolleri (fail-fast: bozuk veri build'de yakalansın)
 * ------------------------------------------------------------------ */
function assertUnique(values: string[], label: string) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`[catalog] ${label} slug'ı yineleniyor: ${value}`);
    }
    seen.add(value);
  }
}

assertUnique(
  categories.map((category) => category.slug),
  "kategori",
);
for (const locale of ["tr", "en"] as Locale[]) {
  assertUnique(
    productsByLocale[locale].map((product) => product.slug),
    `${locale} ürün`,
  );
}
assertUnique(
  brands.map((brand) => brand.slug),
  "marka",
);

const categoryIndex = new Map(categories.map((category) => [category.slug, category]));
const brandIndex = new Map(brands.map((brand) => [brand.slug, brand]));

/* ------------------------------------------------------------------ *
 * Sorgu fonksiyonları
 * ------------------------------------------------------------------ */
export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categoryIndex.get(slug);
}

export function getChildCategories(parentSlug: string): Category[] {
  return categories.filter((category) => category.parent === parentSlug);
}

export function getRootCategories(): Category[] {
  return categories.filter((category) => category.parent === null);
}

/** Kategori yolu (üst kategoriler dahil) — breadcrumb için */
export function getCategoryPath(slug: string): Category[] {
  const path: Category[] = [];
  let current = categoryIndex.get(slug);
  while (current) {
    path.unshift(current);
    current = current.parent ? categoryIndex.get(current.parent) : undefined;
  }
  return path;
}

export function getBrands(): Brand[] {
  return brands;
}

export function getBrand(slug: string): Brand | undefined {
  return brandIndex.get(slug);
}

export function getProducts(locale: Locale): Product[] {
  return productsByLocale[locale];
}

export function getProduct(slug: string, locale: Locale): Product | undefined {
  return productsByLocale[locale].find((product) => product.slug === slug);
}

/** Ürünün tüm çeviri kardeşleri (aynı kimlik veya çeviri grubu) */
export function getProductSiblings(product: Product, locale: Locale): Product[] {
  return productsByLocale[locale].filter(
    (candidate) =>
      candidate.id === product.id ||
      candidate.translations.some((translation) =>
        product.translations.includes(translation),
      ),
  );
}

/** Kategoriye ait ürünler (alt kategorilerdeki ürünler de dahil) */
export function getProductsByCategory(
  categorySlug: string,
  locale: Locale,
): Product[] {
  const includeDescendants = new Set<string>([categorySlug]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (
        category.parent &&
        includeDescendants.has(category.parent) &&
        !includeDescendants.has(category.slug)
      ) {
        includeDescendants.add(category.slug);
        changed = true;
      }
    }
  }
  return productsByLocale[locale].filter((product) =>
    product.categories.some((slug) => includeDescendants.has(slug)),
  );
}

/** Bir kategorideki doğrudan ürünler (alt kategori ürünleri hariç) */
export function getDirectProductsByCategory(
  categorySlug: string,
  locale: Locale,
): Product[] {
  return productsByLocale[locale].filter((product) =>
    product.categories.includes(categorySlug),
  );
}

/** Arama (ad, kısa açıklama ve kategori adlarında) */
export function searchProducts(query: string, locale: Locale): Product[] {
  const needle = query.trim().toLocaleLowerCase("tr-TR");
  if (!needle) return [];
  return productsByLocale[locale].filter((product) => {
    const haystack = [
      product.name,
      product.shortDescription,
      product.brand,
      ...product.categories.map(
        (slug) => categoryIndex.get(slug)?.names[locale] ?? slug,
      ),
    ]
      .join(" ")
      .toLocaleLowerCase("tr-TR");
    return haystack.includes(needle);
  });
}

/** Aynı kategorideki benzer ürünler */
export function getRelatedProducts(
  product: Product,
  locale: Locale,
  limit = 4,
): Product[] {
  const scores = productsByLocale[locale]
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      candidate,
      score: candidate.categories.filter((slug) =>
        product.categories.includes(slug),
      ).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.candidate.id - b.candidate.id,
    );
  return scores.slice(0, limit).map((entry) => entry.candidate);
}

/** Markanın sorumlu olduğu kategoriler */
export function getCategoriesByBrand(brandSlug: string): Category[] {
  const brand = brandIndex.get(brandSlug);
  if (!brand) return [];
  return categories.filter((category) => category.brand === brand.names.tr);
}

/** Markanın ürün sayısı */
export function countProductsByBrand(brandSlug: string, locale: Locale): number {
  const brand = brandIndex.get(brandSlug);
  if (!brand) return 0;
  return productsByLocale[locale].filter(
    (product) => product.brand === brand.names.tr,
  ).length;
}

/** Kategori kapak görseli: kategori görseli öncelikli, yoksa placeholder */
export function getCategoryImage(
  category: Category,
  locale: Locale,
): string | null {
  if (category.image) return category.image;
  return "/assets/img/products/placeholder-category.png";
}
