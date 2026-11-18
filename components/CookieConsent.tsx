"use client";

import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mirais-cookie-consent");
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);
  
  const decide = (value: "accepted" | "rejected") => {
    localStorage.setItem("mirais-cookie-consent", value);
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <aside 
      role="dialog" 
      aria-label={t("ariaLabel")}
      className="cookie-consent"
    >
      <div className="cookie-consent-inner">
        <div className="cookie-consent-content">
          <span className="cookie-consent-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.5 12.5a8.5 8.5 0 1 1-9-9 3.5 3.5 0 0 0 9 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="13" r="1" fill="currentColor" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
              <circle cx="14" cy="9" r="1" fill="currentColor" />
            </svg>
          </span>
          <div>
            <strong>{t("title")}</strong>
            <p>
              {t.rich("text", {
                policyLink: (chunks: ReactNode) => (
                  <Link href="/gizlilik">{chunks}</Link>
                ),
              })}
            </p>
          </div>
        </div>
        <div className="cookie-consent-actions">
          <button 
            type="button"
            onClick={() => decide("rejected")}
            className="cookie-consent-reject"
          >
            {t("reject")}
          </button>
          <button 
            type="button"
            onClick={() => decide("accepted")}
            className="cookie-consent-accept"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </aside>
  );
}