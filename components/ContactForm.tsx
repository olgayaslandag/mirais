"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  contactSubjects,
  emptyContactForm,
  isHoneypotTripped,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/validate";

/**
 * İletişim formu — YALNIZCA ARAYÜZ.
 * Backend/SMTP yoktur: gönderim `event.preventDefault()` ile durdurulur,
 * tarayıcı tarafında doğrulama yapılır ve kullanıcı e-posta/telefona yönlendirilir.
 * Kişisel veri sunucuya gönderilmez.
 */
export default function ContactForm() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "invalid" | "sent">("idle");

  const update = (field: keyof ContactFormValues, value: string | boolean) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Bot koruması: honeypot doluysa sessizce başarılı görünür, veri gönderilmez
    if (isHoneypotTripped(values)) {
      setStatus("sent");
      return;
    }

    const nextErrors = validateContactForm(values, {
      name: t("required"),
      email: t("required"),
      subject: t("required"),
      message: t("required"),
      kvkk: t("required"),
    });

    setErrors(nextErrors);
    setStatus(Object.keys(nextErrors).length === 0 ? "sent" : "invalid");
  };

  const fieldProps = (field: keyof ContactFormValues) => ({
    id: `contact-${field}`,
    name: field,
    "aria-invalid": errors[field] ? ("true" as const) : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h2 className="contact-form__title">{t("formTitle")}</h2>
      <p className="contact-form__note">{t("formNote")}</p>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="contact-name">
            {t("name")} <span aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name ? (
            <p className="field__error" id="contact-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="contact-company">{t("company")}</label>
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            maxLength={160}
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="contact-email">
            {t("email")} <span aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? (
            <p className="field__error" id="contact-email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="contact-phone">{t("phone")}</label>
          <input
            {...fieldProps("phone")}
            type="tel"
            autoComplete="tel"
            maxLength={25}
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
          {errors.phone ? (
            <p className="field__error" id="contact-phone-error">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="field field--full">
          <label htmlFor="contact-subject">
            {t("subject")} <span aria-hidden="true">*</span>
          </label>
          <select
            {...fieldProps("subject")}
            required
            value={values.subject}
            onChange={(event) => update("subject", event.target.value)}
          >
            <option value="">—</option>
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {t(`subjectOptions.${subject}`)}
              </option>
            ))}
          </select>
          {errors.subject ? (
            <p className="field__error" id="contact-subject-error">
              {errors.subject}
            </p>
          ) : null}
        </div>

        <div className="field field--full">
          <label htmlFor="contact-message">
            {t("message")} <span aria-hidden="true">*</span>
          </label>
          <textarea
            {...fieldProps("message")}
            rows={6}
            maxLength={2000}
            required
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
          {errors.message ? (
            <p className="field__error" id="contact-message-error">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot: ekran okuyucular ve botlar doldurur, insan görmez */}
        <div className="field field--hp" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </div>

        <div className="field field--full field--check">
          <label htmlFor="contact-kvkk">
            <input
              {...fieldProps("kvkk")}
              type="checkbox"
              required
              checked={values.kvkk}
              onChange={(event) => update("kvkk", event.target.checked)}
            />
            <span>
              {t("kvkkConsent")}{" "}
              <Link href="/kvkk" target="_blank" rel="noopener">
                {t("kvkkLink")}
              </Link>
            </span>
          </label>
          {errors.kvkk ? (
            <p className="field__error" id="contact-kvkk-error">
              {errors.kvkk}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-form__actions">
        <button className="btn btn-sm btn-primary" type="submit">
          {t("submit")}
        </button>
      </div>

      <div className="contact-form__status" aria-live="polite" role="status">
        {status === "invalid" ? (
          <p className="form-alert form-alert--error">
            <strong>{t("errorTitle")}</strong>
            <span>{t("errorText")}</span>
          </p>
        ) : null}
        {status === "sent" ? (
          <p className="form-alert form-alert--ok">
            <strong>{t("successTitle")}</strong>
            <span>{t("successText")}</span>
          </p>
        ) : null}
      </div>

      <p className="contact-form__footnote">
        {tCommon("contactUs")}:{" "}
        <a href="mailto:bilgi@mirais.com.tr">bilgi@mirais.com.tr</a>
      </p>
    </form>
  );
}
