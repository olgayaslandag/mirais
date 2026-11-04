"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, productHref } from "@/lib/i18n/navigation";
import type { Product } from "@/lib/catalog";

/**
 * Ürün kartı: kapak görseli + ad + kategori ipucu.
 * Uzak görsel yüklenemezse (WP sunucusu erişilemezse) yedek görsele düşer.
 */
export default function ProductCard({
  product,
  fallbackImage,
  eyebrow,
  delay = 0,
}: {
  product: Product;
  fallbackImage?: string | null;
  eyebrow?: string;
  delay?: number;
}) {
  const initial = product.images[0] ?? fallbackImage ?? null;
  const [src, setSrc] = useState<string | null>(initial);

  return (
    <Link
      className="product-card reveal"
      data-reveal="deal"
      data-delay={delay}
      href={productHref(product.slug)}
      aria-label={product.name}
    >
      <div className="card-image">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            width={600}
            height={600}
            sizes="(max-width: 36rem) 50vw, (max-width: 62rem) 50vw, 25vw"
            onError={() => {
              if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage);
              else setSrc(null);
            }}
          />
        ) : (
          <span className="card-image__placeholder" aria-hidden="true" />
        )}
        <span className="card-badge" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="card-body">
        {eyebrow ? <span className="card-eyebrow">{eyebrow}</span> : null}
        <h3>{product.name}</h3>
      </div>
    </Link>
  );
}
