import Link from "next/link";
import { getSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="mt-auto border-t border-charcoal/10 bg-charcoal text-beige">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl font-semibold">
              Willora<span className="text-gold">Noor</span>
            </p>
            <p className="mt-3 text-sm text-beige/70">
              {settings.siteDescription}
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold">
              Explore
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-beige/70">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-gold">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold">
              Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-beige/70">
              <li>
                <Link href="/privacy" className="hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-beige/10 pt-6 text-center text-sm text-beige/50">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
