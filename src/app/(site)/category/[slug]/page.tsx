import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfinitePosts } from "@/components/site/infinite-posts";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found" };

  return {
    title: category.name,
    description: category.description || `Articles about ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
          Category
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal">
          {category.name}
        </h1>
        {category.description && (
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
            {category.description}
          </p>
        )}
      </header>
      <InfinitePosts categorySlug={slug} />
    </div>
  );
}
