import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postCount = await prisma.post.count({ where: { categoryId: id } });
  if (postCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with posts" },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
