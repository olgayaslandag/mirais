"use client";

import { Link, useRouter, getPathname } from "@/lib/i18n/navigation";
import { categoryHref } from "@/lib/i18n/navigation";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/routing";

export type CategoryNavItem = {
  slug: string;
  name: string;
  children: { slug: string; name: string }[];
};

/**
 * Kategori kenar çubuğu: üst kategoriler ve alt kategoriler, aktif olan vurgulanır.
 * Masaüstünde <nav> listesi, mobilde (<=62rem) <select> gösterilir.
 */
export default function CategoryNav({
  items,
  activeSlug,
  activeChildSlug,
  locale,
  placeholderLabel,
}: {
  items: CategoryNavItem[];
  activeSlug?: string;
  activeChildSlug?: string;
  locale: Locale;
  placeholderLabel: string;
}) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string>("");

  const initialValue = useMemo(() => {
    if (activeChildSlug && activeSlug) return `cat:${activeSlug}:${activeChildSlug}`;
    if (activeSlug) return `cat:${activeSlug}`;
    return "";
  }, [activeSlug, activeChildSlug]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (!value) return;
    const parts = value.split(":");
    if (parts[0] !== "cat") return;
    const template = parts.length === 3
      ? "/urunler/[category]/[subcategory]"
      : "/urunler/[category]";
    const params = parts.length === 3
      ? { category: parts[1], subcategory: parts[2] }
      : { category: parts[1] };
    router.push(
      getPathname({ locale, href: { pathname: template, params } as never }) as never,
    );
  };

  return (
    <>
      <nav className="category-nav" aria-label="Ürün kategorileri">
        {items.map((item, index) => {
          const isActive = item.slug === activeSlug;
          return (
            <div className="category-nav__group" key={`${item.slug}-${index}`}>
              <Link
                className={`category-nav__item${isActive ? " is-active" : ""}`}
                href={categoryHref(item.slug)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
              {item.children.length > 0 ? (
                <ul className="category-nav__children">
                  {item.children.map((child, childIndex) => {
                    const isChildActive = child.slug === activeChildSlug;
                    return (
                      <li key={`${item.slug}-${child.slug}-${childIndex}`}>
                        <Link
                          className={`category-nav__item category-nav__item--child${
                            isChildActive ? " is-active" : ""
                          }`}
                          href={categoryHref(item.slug, child.slug)}
                          aria-current={isChildActive ? "page" : undefined}
                        >
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

      <select
        className="category-nav__select"
        aria-label="Ürün kategorileri"
        value={selectedValue || initialValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">{placeholderLabel}</option>
        {items.map((item, index) => (
          <optgroup key={`${item.slug}-${index}`} label={item.name}>
            <option value={`cat:${item.slug}`}>{item.name}</option>
            {item.children.map((child, childIndex) => (
              <option key={`${item.slug}-${child.slug}-${childIndex}`} value={`cat:${item.slug}:${child.slug}`}>
                {child.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </>
  );
}