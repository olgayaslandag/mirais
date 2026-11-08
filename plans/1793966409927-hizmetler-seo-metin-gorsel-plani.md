# Hizmet Sayfaları SEO Uyumlu Özgün Metin ve Görsel Entegrasyon Planı

## Amaç
Her bir hizmet sayfası (`/hizmetler/[slug]` ve `/en/hizmetler/[slug]`) için arama motoru optimizasyonuna (SEO) uygun, zengin, özgün metinler (Türkçe ve İngilizce) ile ilgili yüksek kaliteli görsel öğelerin eklenmesi ve dinamik olarak render edilmesinin sağlanması.

## Kapsam ve Etkilenen Dosyalar
1. **İçerik Veri Katmanı (`data/content.ts`)**:
   - `services` dizisine her hizmet için özgün başlıklar, detaylı açıklamalar, SEO meta açıklamaları, özellik listeleri (features), faydalar (benefits) ve ilgili yüksek kaliteli görseller (alt metinleriyle birlikte) eklenmesi.
2. **Dil Çeviri Dosyaları (`messages/tr.json` ve `messages/en.json`)**:
   - Hizmet detayları, SSS (FAQ), adım açıklamaları ve SEO metinlerinin güncellenmesi / zenginleştirilmesi.
3. **Hizmet Detay Sayfası Şablonu (`app/[locale]/hizmetler/[slug]/page.tsx`)**:
   - Statik yapı yerine dinamik olarak her hizmetin kendi görselini, detaylı açıklamalarını, özelliklerini ve faydalarını gösterecek şekilde geliştirilmesi.
   - Doğru `generateMetadata` ile her hizmete özel meta title, description ve OpenGraph etiketlerinin eklenmesi.

## Tasarım ve İçerik Kararları
- **Görseller**: Her hizmet için `public/assets/img/services/` altında bulunan gerçek görseller (`toz-boya-1.jpg`, `profil-ebatlama.jpg`, `izomat-1.jpg`, `proje-hizmet-1.png`) veya uygun alternatifler bağlanacak.
- **SEO Uyumlu Metinler**: Her hizmet (Ürün Satışı, Teknik Destek, Risk Analizi, Eğitim ve Danışmanlık) için anahtar kelime optimizasyonlu, sektörel (Martor, Justrite, Röetzmeier) referansları içeren en az 3 paragraf özgün içerik ve maddelemeler eklenecek.
- **Mimari Uyumluluk**: Katmanlı mimari kurallarına ve Next.js App Router i18n yapısına tam uyum sağlanacak.

## Doğrulama Adımları
1. `npm run build` komutu ile statik rotaların hatasız derlendiğinin doğrulanması.
2. Hizmet sayfalarının (`/tr/hizmetler/urun-satisi`, `/en/hizmetler/product-sales`, vb.) tarayıcıda veya build çıktısında SEO meta etiketleri ve özgün içerikleriyle kontrol edilmesi.
