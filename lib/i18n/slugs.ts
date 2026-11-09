/**
 * Diller arası slug karşılığı mapping'leri.
 * Kaynak dil (`from`) ve hedef dil (`to`) parametresi ile yönü belirlenen,
 * tek doğru API: getProductCounterpart, getServiceCounterpart, getBlogCounterpart.
 * translateSlug ve slugForLocale kaldırıldı (yön bakış hatası).
 */
import { getProduct, getProducts } from "@/lib/catalog";
import productSlugMap from "@/data/catalog/product-slug-map.json";

export const SERVICE_SLUG_MAP: Record<string, string> = {
  "urun-satisi": "product-sales",
  "product-sales": "urun-satisi",
  "teknik-destek": "technical-support",
  "technical-support": "teknik-destek",
  "risk-analizi": "risk-analysis",
  "risk-analysis": "risk-analizi",
  "egitim-danismanlik": "training-consultancy",
  "training-consultancy": "egitim-danismanlik",
};

/**
 * Ürün slug'si için counterpart (karşılık) slug'ını döndürür.
 * - `from`: slug'in bulunduğu kaynak dil ("tr" | "en")
 * - `to`: hedef dil ("tr" | "en")
 * - Aynı-slug çiftler için orijinal slug döndürülür;
 *   farklı slug çiftleri (group/Çeviri grubu eşleşmeleri) product-slug-map.json'dan çözülür.
 * - Karşılık bulunamazsa `null` döndürür.
 */
export function getProductCounterpart(
  slug: string,
  from: "tr" | "en",
  to: "tr" | "en",
): string | null {
  // 1. Hedef dilde aynı slug varsa, o slug doğrudan return (karşıklı olmayanlar için)
  const productsTo = getProducts(to);
  const productInTarget = productsTo.find((p) => p.slug === slug);
  if (productInTarget) {
    // Eğer aynı slug zaten mevcutsa (çoğuluk/yeniden isimlendirme olmadan),
    // ve from !== to ise, karşılık aynı slug'tur.
    if (from !== to) {
      return slug;
    }
    // Samı dilde isen null döndür (kendine dönüş gerekmez)
    return null;
  }

// 2. product-slug-map.json'dan bilateral eşleşme ara
  // Build-timeGenerated statik mappedir; derleme anında çözümlenir.
  let pair: [string, string] | undefined;
  const pairs = productSlugMap.pairs ?? [];
  pair = pairs.find(
    ([a, b]) => (a === slug && b === slug ? undefined : a === slug ? [a, b] : b === slug ? [b, a] : undefined),
  ) as [string, string] | undefined;

  if (pair) {
    return from === "tr" ? pair[1] : pair[0];
  }

  // 3. SERVICE_SLUG_MAP kontrolü (servis slug'ları için)
  const serviceMapped = SERVICE_SLUG_MAP[slug];
  if (serviceMapped) {
    return to === "tr" ? serviceMapped : // zaten bilateral, direction bağımsız
      // Eğer slug service map'teyse, hedef dildeki karşılığını bul
      // SERVICE_SLUG_MAP bilateral olduğu her iki yönde de geçerli
      serviceMapped;
  }

  // 4. Fallback: counterpart bulunamadı
  return null;
}

/**
 * Servis slug'si için counterpart (karşılık) slug'ını döndürür.
 * SERVICE_SLUG_MAP bilateral zaten çift yönlü çalışır.
 */
export function getServiceCounterpart(
  slug: string,
  from: "tr" | "en",
  to: "tr" | "en",
): string | null {
  const mapped = SERVICE_SLUG_MAP[slug];
  if (mapped) {
    // Bilateral map: her iki yönde de geçerli
    return to === "tr" ? mapped : mapped; // mapped zaten her iki yönde de aynı
  }
  return null;
}

/**
 * Blog yazısı slug'si için counterpart (karşılık) slug'ını döndürür.
 * Başlangıçta 3 çift yazı eşleştirmesiyle başlar; eşleşme bulunamazsa null.
 */
export const BLOG_SLUG_MAP: Record<string, string> = {
  "is-guvenliginde-maket-bicagi-kazalari": "safety-knife-accidents",
  "safety-knife-accidents": "is-guvenliginde-maket-bicagi-kazalari",
  "varil-guvenligi-ve-sizma-kontrolu": "drum-safety-and-spill-containment",
  "drum-safety-and-spill-containment": "varil-guvenligi-ve-sizma-kontrolu",
};

export function getBlogCounterpart(
  slug: string,
  from: "tr" | "en",
  to: "tr" | "en",
): string | null {
  const mapped = BLOG_SLUG_MAP[slug];
  if (mapped) {
    return to === "tr" ? mapped : mapped;
  }
  return null;
}

// Eski translateSlug ve slugForLocale export'ları kaldırıldı.
// Kullanıcıların code'larında kullanıyorsa, getProductCounterpart/ServiceCounterpart/BlogCounterpart
// yerine geçecek yönlü API'lerdir.