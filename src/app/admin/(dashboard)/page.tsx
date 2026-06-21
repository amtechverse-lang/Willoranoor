import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { FileText, FolderOpen, Eye } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [postCount, publishedCount, categoryCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
    ]);

  const stats = [
    { label: "Total Posts", value: postCount, icon: FileText },
    { label: "Published", value: publishedCount, icon: Eye },
    { label: "Categories", value: categoryCount, icon: FolderOpen },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">
          Dashboard
        </h1>
        <p className="mt-1 text-charcoal/60">
          Welcome back, {session?.user?.name ?? session?.user?.email}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-charcoal/70">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-charcoal/60">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-charcoal/10">
              {recentPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-charcoal/60">
                      {post.category.name} ·{" "}
                      {post.published ? "Published" : "Draft"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
