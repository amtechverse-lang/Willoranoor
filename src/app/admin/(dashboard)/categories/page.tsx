"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      return res.json();
    },
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || slugify(name),
        description,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to create category");
      return;
    }

    toast.success("Category created");
    setOpen(false);
    setName("");
    setSlug("");
    setDescription("");
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error ?? "Failed to delete");
      return;
    }
    toast.success("Category deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(slugify(e.target.value));
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
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-charcoal/60">Loading…</p>
      ) : (
        <div className="rounded-lg border border-charcoal/10 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>{cat._count.posts}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                      disabled={cat._count.posts > 0}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
