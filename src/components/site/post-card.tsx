import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | string | null;
    category: { name: string; slug: string };
  };
  featured?: boolean;
}

export function PostCard({ post, featured }: PostCardProps) {
  return (
    <article
      className={
        featured
          ? "group grid gap-6 md:grid-cols-2 md:items-center"
          : "group"
      }
    >
      <Link
        href={`/article/${post.slug}`}
        className={
          featured
            ? "relative aspect-[4/3] overflow-hidden rounded-lg shadow-elegant"
            : "relative mb-4 block aspect-[16/10] overflow-hidden rounded-lg shadow-elegant"
        }
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-beige-dark">
            <span className="font-serif text-2xl text-charcoal/30">WN</span>
          </div>
        )}
      </Link>
      <div className={featured ? "space-y-4" : "space-y-3"}>
        <Link href={`/category/${post.category.slug}`}>
          <Badge variant="secondary">{post.category.name}</Badge>
        </Link>
        <Link href={`/article/${post.slug}`}>
          <h2
            className={
              featured
                ? "font-serif text-3xl font-semibold leading-tight text-charcoal transition-colors group-hover:text-gold md:text-4xl"
                : "font-serif text-xl font-semibold leading-snug text-charcoal transition-colors group-hover:text-gold"
            }
          >
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="line-clamp-3 text-charcoal/70">{post.excerpt}</p>
        )}
        <time className="text-sm text-charcoal/50">
          {formatDate(post.publishedAt)}
        </time>
      </div>
    </article>
  );
}
