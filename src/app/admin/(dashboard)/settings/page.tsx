"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    ogImage: "",
    twitterHandle: "",
    googleAnalyticsId: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to save settings");
      return;
    }

    toast.success("Settings saved");
  }

  if (isLoading) return <p className="text-charcoal/60">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-3xl font-semibold">SEO Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={form.siteDescription}
            onChange={(e) =>
              setForm({ ...form, siteDescription: e.target.value })
            }
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteUrl">Site URL</Label>
          <Input
            id="siteUrl"
            value={form.siteUrl}
            onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogImage">Default OG Image</Label>
          <Input
            id="ogImage"
            value={form.ogImage}
            onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterHandle">Twitter Handle</Label>
          <Input
            id="twitterHandle"
            value={form.twitterHandle}
            onChange={(e) =>
              setForm({ ...form, twitterHandle: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            value={form.googleAnalyticsId}
            onChange={(e) =>
              setForm({ ...form, googleAnalyticsId: e.target.value })
            }
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
