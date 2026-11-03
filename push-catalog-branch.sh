#!/usr/bin/env bash
# Mirais — çok dilli katalog işini feat branch'ine 7 commit halinde toplar ve push eder.
# Kaynak plan: plans/1793060444983-push-catalog-branch.md
# Kullanım (repo kökünde): bash push-catalog-branch.sh
# main hiç hareket etmez; force push yok; .env stage edilirse betik durur.

set -euo pipefail

BRANCH="feat/multilingual-multipage-catalog"

# --- 0. Ön koşul kontrolü ---------------------------------------------------
[ -f middleware.ts ] || { echo "HATA: middleware.ts yok — workspace değişiklikleri bu clone'da bulunmuyor."; exit 1; }
[ -d data/catalog ] || { echo "HATA: data/catalog yok — workspace değişiklikleri bu clone'da bulunmuyor."; exit 1; }
[ -d "app/[locale]" ] || { echo "HATA: app/[locale] yok — workspace değişiklikleri bu clone'da bulunmuyor."; exit 1; }
if [ -f app/page.tsx ]; then
  echo "HATA: app/page.tsx hâlâ duruyor — eski tek sayfa silinmemiş."
  exit 1
fi
command -v git >/dev/null || { echo "HATA: git bulunamadı."; exit 1; }
[ -d .git ] || { echo "HATA: bu dizin bir git deposu değil."; exit 1; }

MAIN_SHA="$(git rev-parse main)"
ORIGIN_MAIN_SHA="$(git rev-parse origin/main 2>/dev/null || echo yok)"
if [ "$MAIN_SHA" != "$ORIGIN_MAIN_SHA" ]; then
  echo "UYARI: main ($MAIN_SHA) ile origin/main ($ORIGIN_MAIN_SHA) farklı; devam etmeden kontrol edin."
fi

# --- 1. Commit kimliği (yalnızca repo-local) ---------------------------------
if [ -z "${GIT_AUTHOR_EMAIL:-}" ] && command -v gh >/dev/null 2>&1; then
  GIT_AUTHOR_EMAIL="$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')"
fi
if [ -z "${GIT_AUTHOR_EMAIL:-}" ]; then
  echo "HATA: gh yok veya e-posta verilmedi. Şöyle çalıştırın:"
  echo "  GIT_AUTHOR_EMAIL='<id>+olgayaslandag@users.noreply.github.com' bash $0"
  exit 1
fi
git config --local user.name "${GIT_AUTHOR_NAME:-olgayaslandag}"
git config --local user.email "$GIT_AUTHOR_EMAIL"

# --- .gitignore sertleştirmesi (idempotent) ----------------------------------
grep -qx '.env' .gitignore || printf '\n# Ortam sırları repoya girmez; örnek dosya hariç\n.env\n.env.local\n.env*.local\n!.env.example\n' >> .gitignore

# --- 2. Branch'i commit'lerden ÖNCE aç (main sabit kalır) --------------------
git switch -c "$BRANCH" 2>/dev/null || git switch "$BRANCH"

# --- 3-9. Yedi mantıksal commit (tekrar çalıştırmaya dayanıklı) --------------
# Not: "app/[locale]" köşeli parantezleri git pathspec'inde glob'dur; bu yüzden
# tüm köşeli parantezli yollar ':(literal)' magic'i ile verilir.
commit_group() {
  local msg="$1"; shift
  if git log --format=%s "origin/main..HEAD" 2>/dev/null | grep -qxF "$msg"; then
    echo "atlandı (zaten commit'li): $msg"
    return 0
  fi
  git add -A -- "$@"
  git commit -m "$msg"
}

commit_group "chore: add next-intl, MDX and ESLint tooling; ignore .env" \
  .gitignore package.json package-lock.json .eslintrc.json

commit_group "feat(catalog): CSV->JSON build pipeline with sanitized HTML, specs and legacy redirects" \
  scripts/build-catalog.mjs data/catalog

commit_group "feat(i18n): next-intl localized routes, middleware, messages and catalog/SEO libraries" \
  lib/i18n lib/catalog lib/seo.ts lib/validate.ts lib/legal.ts lib/mdx.ts middleware.ts messages next.config.mjs .env.example

commit_group "fix(content): replace aluminium-template leftovers, correct Izmir address, work-safety imagery" \
  data/content.ts lib/instagram.ts components/CorporateIntro.tsx components/Solutions.tsx components/Services.tsx

commit_group "feat(app): move to [locale] routes with localized shell, header/footer, sitemap/robots and vendored Rubik font" \
  ':(literal)app/[locale]' app/globals.css app/sitemap.ts app/robots.ts assets/fonts \
  components/SiteShell.tsx components/SiteHeader.tsx components/SiteFooter.tsx \
  components/LanguageSwitcher.tsx components/Preloader.tsx components/Hero.tsx components/PageHero.tsx \
  components/Breadcrumb.tsx components/NotFoundContent.tsx components/QuoteStrip.tsx components/Accordion.tsx \
  app/layout.tsx app/page.tsx

commit_group "feat(pages): catalog, product, corporate, brands, services, contact, legal, blog and careers routes" \
  ':(literal)app/[locale]/urunler' ':(literal)app/[locale]/urun' ':(literal)app/[locale]/kurumsal' ':(literal)app/[locale]/markalar' \
  ':(literal)app/[locale]/hizmetler' ':(literal)app/[locale]/iletisim' ':(literal)app/[locale]/blog' ':(literal)app/[locale]/kariyer' \
  ':(literal)app/[locale]/kvkk' ':(literal)app/[locale]/gizlilik' ':(literal)app/[locale]/kullanim-sartlari' ':(literal)app/[locale]/cerez-politikasi' \
  content/blog components/ProductCard.tsx components/ProductGrid.tsx components/ProductGallery.tsx \
  components/SpecTable.tsx components/RichContent.tsx components/YouTubeEmbed.tsx components/CategoryNav.tsx \
  components/ContactForm.tsx components/JobList.tsx components/BlogCard.tsx components/LegalDoc.tsx \
  components/LegalPage.tsx components/CatalogBand.tsx components/BrandsSection.tsx components/InstagramFeed.tsx

commit_group "build(docker): ship MDX content in standalone image, exclude CSV export from image" \
  Dockerfile .dockerignore

# --- 10. Güvenlik ve bütünlük kontrolü ---------------------------------------
LEAKS="$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -vE '(^|/)\.env\.example$' || true)"
if [ -n "$LEAKS" ]; then
  echo "DURDUR: izlenen dosyalar arasında .env benzeri dosya var — push EDİLMEDİ:"
  echo "$LEAKS"
  exit 1
fi

COMMITS="$(git rev-list --count "origin/main..HEAD")"
echo "origin/main..HEAD commit sayısı: $COMMITS"
git log --oneline "origin/main..HEAD"
[ "$(git rev-parse main)" = "$MAIN_SHA" ] || { echo "DURDUR: main taşınmış!"; exit 1; }
git status --short || true

# --- 11. Push ----------------------------------------------------------------
git push -u origin "$BRANCH"

REMOTE_SHA="$(git ls-remote origin "$BRANCH" | cut -f1)"
LOCAL_SHA="$(git rev-parse HEAD)"
if [ "$REMOTE_SHA" = "$LOCAL_SHA" ]; then
  echo "DOĞRULANDI: remote $BRANCH = $LOCAL_SHA"
else
  echo "UYARI: remote SHA ($REMOTE_SHA) yerel HEAD ($LOCAL_SHA) ile farklı."
fi

echo "Bitti. main korunmuş: $(git rev-parse main)"
echo "Bu betik kaldırılabilir: rm push-catalog-branch.sh"
