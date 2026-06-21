"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  category: { name: string };
}

export default function AdminPostsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: posts = [], refetch, isLoading } = useQuery<PostRow[]>({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/posts/${deleteId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete post");
      return;
    }
    toast.success("Post deleted");
    setDeleteId(null);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-charcoal/60">Loading…</p>
      ) : (
        <div className="rounded-lg border border-charcoal/10 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category.name}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(post.publishedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/posts/${post.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
