import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ArticleBreadcrumbProps {
  category: { name: string; slug: string };
  title: string;
}

export function ArticleBreadcrumb({ category, title }: ArticleBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center gap-1 text-sm text-charcoal/60"
    >
      <Link href="/" className="hover:text-gold">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link href={`/category/${category.slug}`} className="hover:text-gold">
        {category.name}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="line-clamp-1 text-charcoal">{title}</span>
    </nav>
  );
}
