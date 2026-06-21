import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  siteName: "WilloraNoor",
  siteDescription:
    "A premium home décor publication celebrating elegant interiors, timeless design, and inspired living.",
  siteUrl: "http://localhost:3000",
  ogImage: "",
  twitterHandle: "",
  googleAnalyticsId: "",
};

export async function getSetting(key: string): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULTS };
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function setSettings(
  data: Record<string, string>,
): Promise<void> {
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
}
