import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./routing";

export function resolveLocale(locale: string): Locale {
  if (!isLocale(locale)) notFound();
  return locale;
}