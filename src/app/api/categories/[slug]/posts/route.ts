import { prisma } from "@/lib/prisma";
import { searchPosts } from "@/lib/search";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  if (q.trim()) {
    const { results, total } = await searchPosts(q, limit, offset);
    return NextResponse.json({ posts: results, total });
  }

  const where = {
    published: true,
    category: { slug },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total });
}
