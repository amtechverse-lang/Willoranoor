"use server";

import { prisma } from "@/lib/prisma";

export async function incrementPostViews(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
}
