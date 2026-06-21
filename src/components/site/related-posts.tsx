import { PostCard } from "@/components/site/post-card";
import { prisma } from "@/lib/prisma";

interface RelatedPostsProps {
  categoryId: string;
  excludePostId: string;
}

export async function RelatedPosts({
  categoryId,
  excludePostId,
}: RelatedPostsProps) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categoryId,
      NOT: { id: excludePostId },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
    include: { category: true },
  });

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-charcoal/10 pt-12">
      <h2 className="mb-8 font-serif text-2xl font-semibold text-charcoal">
        Related Articles
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
