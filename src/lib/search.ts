import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string };
  rank: number;
}

export async function searchPosts(
  query: string,
  limit = 20,
  offset = 0,
): Promise<{ results: SearchResult[]; total: number }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], total: 0 };
  }

  const tsQuery = trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => `${w}:*`)
    .join(" & ");

  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p."coverImage",
      p."publishedAt",
      json_build_object('name', c.name, 'slug', c.slug) AS category,
      ts_rank(p.search_vector, to_tsquery('english', ${tsQuery})) AS rank
    FROM "Post" p
    JOIN "Category" c ON c.id = p."categoryId"
    WHERE p.published = true
      AND p.search_vector @@ to_tsquery('english', ${tsQuery})
    ORDER BY rank DESC, p."publishedAt" DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*)::bigint AS count
    FROM "Post" p
    WHERE p.published = true
      AND p.search_vector @@ to_tsquery('english', ${tsQuery})
  `;

  return {
    results,
    total: Number(countResult[0]?.count ?? 0),
  };
}
