import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export async function SiteFooter() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <footer className="mt-auto border-t border-charcoal/10 bg-beige-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-serif text-2xl font-semibold text-charcoal">
              Willora<span className="text-gold">Noor</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Premium home décor inspiration.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Categories
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-gold">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
              <li>
                <Link href="/about" className="hover:text-gold">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-gold">
                  Editorial Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
              <li>
                <Link href="/privacy" className="hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-gold">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-gold">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
              <li>
                <Link href="/search" className="hover:text-gold">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-gold">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-gold">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-charcoal/10 pt-6 text-center text-sm text-charcoal/50">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
