import { prisma } from "@/lib/prisma";
import { searchPosts } from "@/lib/search";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  if (q.trim()) {
    const { results, total } = await searchPosts(q, limit, offset);
    return NextResponse.json({ posts: results, total, query: q });
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
      include: { category: true },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  return NextResponse.json({ posts, total });
}
