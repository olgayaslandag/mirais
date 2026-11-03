import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * İstek başına mesaj dosyası yüklenir.
 * İstekte tanımsız locale gelirse 404 (bilinmeyen yol bir sayfa değildir).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // Middleware geçerli locale'i garanti eder; savunma amaçlı varsayılan locale'e düşülür
  const locale =
    requested && routing.locales.includes(requested as (typeof routing.locales)[number])
      ? (requested as (typeof routing.locales)[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
