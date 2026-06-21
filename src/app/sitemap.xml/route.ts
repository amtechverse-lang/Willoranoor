import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  const baseUrl = settings.siteUrl || "http://localhost:3000";

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = [
    "",
    "about",
    "contact",
    "privacy",
    "terms",
    "search",
    "editorial-policy",
    "disclaimer",
    "cookie-policy",
    "sitemap",
  ];

  const urls = [
    ...staticPages.map((path) => ({
      loc: `${baseUrl}/${path}`,
      lastmod: new Date().toISOString(),
    })),
    ...categories.map((cat) => ({
      loc: `${baseUrl}/category/${cat.slug}`,
      lastmod: cat.updatedAt.toISOString(),
    })),
    ...posts.map((post) => ({
      loc: `${baseUrl}/article/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
