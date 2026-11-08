"use client";

import CarouselControls from "@/components/CarouselControls";
import CategoryCard from "./CategoryCard";

type CategoryGridProps = {
  categories: {
    slug: string;
    name: string;
    image: string | null;
  }[];
  withCarousel?: boolean;
};

export default function CategoryGrid({
  categories,
  withCarousel = false,
}: CategoryGridProps) {
  const itemsWithDelay = categories.map((category, index) => ({
    ...category,
    delay: (index % 4) * 140,
  }));

  return (
    <div className="product-wrap">
      <div className="product-grid">
        {itemsWithDelay.map((category) => (
          <CategoryCard
            key={category.slug}
            slug={category.slug}
            name={category.name}
            image={category.image}
            delay={category.delay}
          />
        ))}
      </div>
      {withCarousel && (
        <CarouselControls
          targetSelector=".product-grid"
          label="Kategori navigasyonu"
          itemCount={categories.length}
        />
      )}
    </div>
  );
}