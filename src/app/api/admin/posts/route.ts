import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resolveTagIds } from "@/lib/tags";
import { postSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const existing = await prisma.post.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const tagIds = [
    ...new Set([
      ...data.tagIds,
      ...(await resolveTagIds(data.tagNames)),
    ]),
  ];

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      published: data.published,
      publishedAt: data.published
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      focusKeyword: data.focusKeyword,
      authorId: session.user.id,
      categoryId: data.categoryId,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json(post, { status: 201 });
}
