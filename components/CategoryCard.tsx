"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link, categoryHref } from "@/lib/i18n/navigation";

type CategoryCardProps = {
  slug: string;
  name: string;
  image: string | null;
  delay?: number;
  priority?: boolean;
};

export default function CategoryCard({
  slug,
  name,
  image,
  delay = 0,
  priority,
}: CategoryCardProps) {
  return (
    <Link
      key={slug}
      className="product-card reveal"
      data-reveal="deal"
      data-delay={delay}
      href={categoryHref(slug)}
      aria-label={name}
    >
      <div className="card-image">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={800}
            height={500}
            sizes="(max-width: 36rem) 100vw, (max-width: 62rem) 50vw, 33vw"
          />
        ) : (
          <span
            className="card-image__placeholder"
            aria-hidden="true"
          />
        )}
        <span className="card-badge" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="card-body">
        <h3>{name}</h3>
      </div>
    </Link>
  );
}