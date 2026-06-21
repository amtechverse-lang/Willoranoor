"use client";

import type { TocItem } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="rounded-lg border border-charcoal/10 bg-white p-6 shadow-elegant">
      <h2 className="font-serif text-lg font-semibold text-charcoal">
        Table of Contents
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                "block w-full text-left text-sm text-charcoal/70 transition-colors hover:text-gold",
                item.level === 3 && "pl-4",
                item.level === 4 && "pl-8",
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
