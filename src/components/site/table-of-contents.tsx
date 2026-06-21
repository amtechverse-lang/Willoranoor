import type { TocItem } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-lg border border-charcoal/10 bg-white p-6 shadow-elegant">
      <h2 className="font-serif text-lg font-semibold text-charcoal">
        Table of Contents
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm text-charcoal/70 transition-colors hover:text-gold",
                item.level === 3 && "pl-4",
                item.level === 4 && "pl-8",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
