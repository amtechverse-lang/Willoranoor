"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SiteHeaderNavProps {
  categories: Category[];
}

const staticLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeaderNav({ categories }: SiteHeaderNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-gold",
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "text-gold underline decoration-gold/40 underline-offset-4"
        : "text-charcoal/70",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-beige/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl"
        >
          Willora<span className="text-gold">Noor</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={navLinkClass(`/category/${cat.slug}`)}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/70 transition-colors hover:bg-beige-dark hover:text-gold"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-beige">
              <nav className="mt-8 flex flex-col gap-4">
                {staticLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn("font-serif text-lg", navLinkClass(link.href))}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-charcoal/10 pt-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-charcoal/50">
                    Categories
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block py-2 font-serif text-lg",
                        navLinkClass(`/category/${cat.slug}`),
                      )}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
