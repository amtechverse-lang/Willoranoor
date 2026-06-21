"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { PostCard } from "@/components/site/post-card";
import { Skeleton } from "@/components/ui/skeleton";

interface InfinitePostsProps {
  categorySlug?: string;
  query?: string;
}

export function InfinitePosts({ categorySlug, query }: InfinitePostsProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["posts", categorySlug, query],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        limit: "12",
        offset: String(pageParam),
      });
      if (query) params.set("q", query);

      const url = categorySlug
        ? `/api/categories/${categorySlug}/posts?${params}`
        : `/api/posts?${params}`;

      const res = await fetch(url);
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (acc, page) => acc + page.posts.length,
        0,
      );
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-charcoal/60">No articles found.</p>
    );
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id ?? post.slug} post={post} />
        ))}
      </div>
      <div ref={ref} className="py-8 text-center">
        {isFetchingNextPage && (
          <p className="text-sm text-charcoal/50">Loading more…</p>
        )}
      </div>
    </>
  );
}
