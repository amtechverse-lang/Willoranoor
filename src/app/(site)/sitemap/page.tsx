import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HtmlSitemapPage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const staticPages = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/search", label: "Search" },
    { href: "/editorial-policy", label: "Editorial Policy" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">Sitemap</h1>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-gold">Pages</h2>
        <ul className="mt-4 space-y-2">
          {staticPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="text-charcoal/70 hover:text-gold">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-gold">Categories</h2>
        <ul className="mt-4 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className="text-charcoal/70 hover:text-gold"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-gold">Articles</h2>
        <ul className="mt-4 space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/article/${post.slug}`}
                className="text-charcoal/70 hover:text-gold"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
