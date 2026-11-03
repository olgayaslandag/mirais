/**
 * İletişim formu doğrulaması — saf fonksiyonlar (sunucu/istemci ortak kullanılabilir).
 * Backend yoktur: form yalnızca arayüz amaçlıdır, veri gönderilmez.
 */

export type ContactFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  kvkk: boolean;
  /** Honeypot: botların doldurduğu gizli alan, insan tarafından doldurulmamalı */
  website: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const contactSubjects = [
  "product",
  "quote",
  "support",
  "other",
] as const;

export type ContactSubject = (typeof contactSubjects)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^[+0-9()\s.-]{7,25}$/;

export const LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 25,
  subject: 60,
  message: 2000,
} as const;

export function emptyContactForm(): ContactFormValues {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    kvkk: false,
    website: "",
  };
}

/**
 * Doğrulama. `messages` alanları hata mesajlarını içerir (UI dili).
 * Dönen hata sözlüğü boşsa form geçerlidir.
 */
export function validateContactForm(
  values: ContactFormValues,
  messages: {
    name: string;
    email: string;
    subject: string;
    message: string;
    kvkk: string;
  },
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) errors.name = messages.name;
  if (!values.email.trim()) {
    errors.email = messages.email;
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = messages.email;
  }
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
    errors.phone = messages.email;
  }
  if (!values.subject.trim()) {
    errors.subject = messages.subject;
  } else if (!contactSubjects.includes(values.subject as ContactSubject)) {
    errors.subject = messages.subject;
  }
  if (!values.message.trim()) {
    errors.message = messages.message;
  }
  if (!values.kvkk) errors.kvkk = messages.kvkk;

  return errors;
}

/** Bot koruması: honeypot doluysa form sessizce "başarılı" görünür */
export function isHoneypotTripped(values: ContactFormValues): boolean {
  return values.website.trim().length > 0;
}
