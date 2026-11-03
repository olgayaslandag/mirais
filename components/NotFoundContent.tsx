"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * 404 içeriği: next-intl mesajlarına bağlı değildir (404 bağlamında locale
 * çözülemez), bu yüzden dil yol öneki üzerinden belirlenir.
 */
export default function NotFoundContent() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en") ?? false;

  const copy = isEnglish
    ? {
        title: "The page you are looking for was not found",
        text: "The link may have changed or the page may have been removed. Browse our product categories to continue.",
        cta: "Browse products",
        products: "Products",
        home: "Home",
      }
    : {
        title: "Aradığınız sayfa bulunamadı",
        text: "Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Ürün kategorilerine göz atarak devam edebilirsiniz.",
        cta: "Ürünlere göz at",
        products: "Ürünler",
        home: "Ana Sayfa",
      };

  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <p className="eyebrow">404</p>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.text}</p>
        <div className="not-found__actions">
          <Link className="btn btn-sm btn-primary" href={isEnglish ? "/en/products" : "/urunler"}>
            {copy.cta}
          </Link>
          <Link className="text-link" href={isEnglish ? "/en" : "/"}>
            {copy.home}
          </Link>
        </div>
      </div>
    </section>
  );
}