"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { PostForm } from "@/components/admin/post-form";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: post, isLoading } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-charcoal/60">Loading…</p>;
  if (!post) return <p className="text-charcoal/60">Post not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">Edit Post</h1>
      <PostForm
        postId={id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          published: post.published,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          focusKeyword: post.focusKeyword ?? "",
          categoryId: post.categoryId,
          tags: (post.tags ?? [])
            .map((t: { tag: { name: string } }) => t.tag.name)
            .join(", "),
        }}
      />
    </div>
  );
}
