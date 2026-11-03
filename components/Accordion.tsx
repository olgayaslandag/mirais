"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export type AccordionItem = {
  title: string;
  body: string;
};

/**
 * Erişilebilir akordeon: her panel DOM'da, aria-expanded/aria-controls eşleşmeli.
 */
export default function Accordion({
  items,
  idPrefix = "accordion",
}: {
  items: AccordionItem[];
  idPrefix?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${idPrefix}-button-${index + 1}`;
        const panelId = `${idPrefix}-panel-${index + 1}`;
        return (
          <div
            key={item.title}
            className={`accordion__item${open ? " is-open" : ""}`}
          >
            <h3 className="accordion__heading">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                {item.title}
                <Plus size={14} aria-hidden="true" />
              </button>
            </h3>
            <div
              className="accordion__panel"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
            >
              <div className="accordion__panel-inner">
                {item.body.split("\n\n").map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
