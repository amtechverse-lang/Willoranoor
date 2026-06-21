"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { TipTapEditor } from "@/components/admin/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface PostFormProps {
  postId?: string;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
    metaTitle: string;
    metaDescription: string;
    categoryId: string;
  };
}

export function PostForm({ postId, initial }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? "",
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      return res.json();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      coverImage,
      published,
      metaTitle,
      metaDescription,
      categoryId,
      tagIds: [] as string[],
    };

    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error ?? "Failed to save post");
      return;
    }

    toast.success(postId ? "Post updated" : "Post created");
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!postId && !slug) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <TipTapEditor content={content} onChange={setContent} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/uploads/image.webp"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">SEO Title</Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">SEO Description</Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-charcoal/20"
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : postId ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
