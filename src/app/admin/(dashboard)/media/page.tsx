"use client";

import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MediaItem {
  filename: string;
  url: string;
}

export default function AdminMediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: media = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const res = await fetch("/api/admin/media");
      return res.json();
    },
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }

    toast.success("Image uploaded");
    queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    if (inputRef.current) inputRef.current.value = "";
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Media Library</h1>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload Image"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-charcoal/60">Loading…</p>
      ) : media.length === 0 ? (
        <p className="text-charcoal/60">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <Card key={item.filename} className="overflow-hidden">
              <div className="relative aspect-video bg-beige-dark">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <CardContent className="p-3">
                <p className="truncate text-xs text-charcoal/60">
                  {item.filename}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => copyUrl(item.url)}
                >
                  Copy URL
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
