import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 7,
  });

  return (
    <header className="border-b border-charcoal/10 bg-beige/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-tight text-charcoal">
            Willora<span className="text-gold">Noor</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-charcoal/70 transition-colors hover:text-gold"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-sm font-medium text-charcoal/70 transition-colors hover:text-gold"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-sm font-medium text-charcoal/70 transition-colors hover:text-gold"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-charcoal/70 transition-colors hover:text-gold"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
