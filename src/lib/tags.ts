import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function resolveTagIds(tagNames: string[]): Promise<string[]> {
  const ids: string[] = [];

  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const slug = slugify(trimmed);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: trimmed, slug },
    });
    ids.push(tag.id);
  }

  return ids;
}
