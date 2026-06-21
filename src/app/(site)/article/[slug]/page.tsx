import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/site/share-buttons";
import { TableOfContents } from "@/components/site/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { processArticleContent } from "@/lib/sanitize";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { category: true },
  });

  if (!post) return { title: "Not Found" };

  const settings = await getSettings();
  const siteUrl = settings.siteUrl || "http://localhost:3000";

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : [],
      url: `${siteUrl}/article/${post.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  const settings = await getSettings();
  const siteUrl = settings.siteUrl || "http://localhost:3000";
  const { html, toc } = processArticleContent(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "WilloraNoor",
    },
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: {
        "@type": "ImageObject",
        url: settings.ogImage || `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: `${siteUrl}/article/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary">{post.category.name}</Badge>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-charcoal md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-charcoal/70">{post.excerpt}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-charcoal/50">
          {post.author.name && <span>By {post.author.name}</span>}
          <time>{formatDate(post.publishedAt)}</time>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mx-auto mt-10 aspect-[21/9] max-w-5xl overflow-hidden rounded-lg shadow-elegant">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[1fr_240px]">
        <div>
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-10 border-t border-charcoal/10 pt-8">
            <ShareButtons
              url={`${siteUrl}/article/${post.slug}`}
              title={post.title}
            />
          </div>
        </div>
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <TableOfContents items={toc} />
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
