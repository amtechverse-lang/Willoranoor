import { PostCard } from "@/components/site/post-card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const settings = await getSettings();

  const [featured, recent, categories] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 7,
      skip: 1,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, take: 7 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
          Home Décor & Design
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-charcoal md:text-5xl lg:text-6xl">
          {settings.siteName}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
          {settings.siteDescription}
        </p>
      </section>

      {featured && (
        <section className="mb-16">
          <PostCard post={featured} featured />
        </section>
      )}

      <Separator className="mb-12" />

      <section className="mb-16">
        <h2 className="mb-8 font-serif text-2xl font-semibold text-charcoal">
          Latest Stories
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-8 font-serif text-2xl font-semibold text-charcoal">
          Browse by Category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="rounded-lg border border-charcoal/10 bg-white p-6 shadow-elegant transition-shadow hover:shadow-lg"
            >
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="mt-2 text-sm text-charcoal/60 line-clamp-2">
                  {cat.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
