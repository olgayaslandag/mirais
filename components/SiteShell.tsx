"use client";

import { useRevealRoot, useSmoothAnchors } from "@/hooks/useSiteEffects";
import type { ReactNode } from "react";

/**
 * Site kabuğu: header + içerik + footer.
 * Reveal (belirme) ve yumuşak anchor efektleri bu kök üzerinde çalışır;
 * içerik alt ağacı server component olarak kalır.
 */
export default function SiteShell({
  header,
  children,
  footer,
}: {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  const rootRef = useRevealRoot<HTMLDivElement>();
  useSmoothAnchors();

  return (
    <div ref={rootRef} className="site-shell">
      {header}
      {children}
      {footer}
    </div>
  );
}
