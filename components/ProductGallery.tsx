"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Ürün galerisi: kapak görsel + küçük görseller.
 * Uzak görsel yüklenemezse kategori görseline düşülür.
 */
export default function ProductGallery({
  images,
  alt,
  fallbackImage,
}: {
  images: string[];
  alt: string;
  fallbackImage?: string | null;
}) {
  const list = images.length ? images : fallbackImage ? [fallbackImage] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);

  if (!list.length) {
    return <div className="product-gallery__empty" aria-hidden="true" />;
  }

  const active = list[Math.min(activeIndex, list.length - 1)];

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {failed.includes(active) ? (
          <div className="product-gallery__empty" aria-hidden="true" />
        ) : (
          <Image
            src={active}
            alt={alt}
            width={900}
            height={900}
            sizes="(max-width: 62rem) 100vw, 50vw"
            priority
            onError={() =>
              setFailed((previous) =>
                previous.includes(active) ? previous : [...previous, active],
              )
            }
          />
        )}
      </div>
      {list.length > 1 ? (
        <ul className="product-gallery__thumbs">
          {list.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`${alt} — görsel ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <Image
                  src={image}
                  alt=""
                  width={120}
                  height={120}
                  sizes="120px"
                  onError={() =>
                    setFailed((previous) =>
                      previous.includes(image) ? previous : [...previous, image],
                    )
                  }
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
