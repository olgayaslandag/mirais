import ProductCard from "./ProductCard";
import type { Product } from "@/lib/catalog";

/** Ürün ızgarası: kategori sayfalarında ve ana sayfada kullanılır */
export default function ProductGrid({
  products,
  fallbackImage,
  eyebrow,
  columns,
}: {
  products: Product[];
  fallbackImage?: string | null;
  eyebrow?: string;
  columns?: 3 | 4;
}) {
  if (!products.length) return null;
  return (
    <div className={`product-grid${columns === 3 ? " product-grid--3" : ""}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          fallbackImage={fallbackImage}
          eyebrow={eyebrow}
          delay={(index % (columns === 3 ? 3 : 4)) * 140}
        />
      ))}
    </div>
  );
}
