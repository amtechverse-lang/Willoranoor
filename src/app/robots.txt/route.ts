import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  const baseUrl = settings.siteUrl || "http://localhost:3000";

  const txt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(txt, {
    headers: { "Content-Type": "text/plain" },
  });
}
