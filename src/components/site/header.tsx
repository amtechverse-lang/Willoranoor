import { prisma } from "@/lib/prisma";
import { SiteHeaderNav } from "./site-header-nav";

export async function SiteHeader() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <SiteHeaderNav categories={categories} />;
}
