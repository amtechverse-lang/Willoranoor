import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ArticleBreadcrumb } from "@/components/site/article-breadcrumb";
import { RelatedPosts } from "@/components/site/related-posts";
import { ShareButtons } from "@/components/site/share-buttons";
import { TableOfContents } from "@/components/site/table-of-contents";
import { ViewCounter } from "@/components/site/view-counter";
import { Badge } from "@/components/ui/badge";
import { extractFaqFromHtml, getReadingTimeMinutes } from "@/lib/article";
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
  const { html: processedHtml, toc } = processArticleContent(post.content);
  const { html, faq } = extractFaqFromHtml(processedHtml);
  const readingTime = getReadingTimeMinutes(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "WilloraNoor Editorial Team",
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category.name,
        item: `${siteUrl}/category/${post.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/article/${post.slug}`,
      },
    ],
  };

  const faqJsonLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ViewCounter postId={post.id} />

      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ArticleBreadcrumb category={post.category} title={post.title} />

      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary">{post.category.name}</Badge>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-charcoal md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-charcoal/70">{post.excerpt}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-charcoal/50">
          <span>WilloraNoor Editorial Team</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          {post.updatedAt > (post.publishedAt ?? post.createdAt) && (
            <span>Updated {formatDate(post.updatedAt)}</span>
          )}
          <span>{readingTime} min read</span>
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
            className="prose-article mx-auto max-w-[65ch] text-lg leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mx-auto mt-10 max-w-[65ch] rounded-lg border border-charcoal/10 bg-white p-6 shadow-elegant">
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              WilloraNoor Editorial Team
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Our editorial team curates premium home décor inspiration, blending
              timeless design principles with practical guidance for beautiful
              living spaces.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-[65ch] border-t border-charcoal/10 pt-8">
            <ShareButtons
              url={`${siteUrl}/article/${post.slug}`}
              title={post.title}
            />
          </div>
        </div>
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>
        )}
      </div>

      <RelatedPosts categoryId={post.categoryId} excludePostId={post.id} />
    </article>
  );
}
