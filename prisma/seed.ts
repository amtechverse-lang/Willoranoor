import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Elegant living spaces and lounge design inspiration.",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Serene retreats and bedroom styling ideas.",
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    description: "Modern kitchens and culinary space design.",
  },
  {
    name: "Bathroom",
    slug: "bathroom",
    description: "Spa-like bathrooms and luxury fixtures.",
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    description: "Patios, gardens, and alfresco living.",
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Illumination that transforms every room.",
  },
  {
    name: "Seasonal",
    slug: "seasonal",
    description: "Holiday décor and seasonal styling guides.",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@willoranoor.com" },
    update: {},
    create: {
      email: "admin@willoranoor.com",
      name: "Admin",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const livingRoom = await prisma.category.findUnique({
    where: { slug: "living-room" },
  });

  if (livingRoom) {
    await prisma.post.upsert({
      where: { slug: "timeless-elegance-neutral-living-spaces" },
      update: {},
      create: {
        title: "Timeless Elegance: Creating Neutral Living Spaces",
        slug: "timeless-elegance-neutral-living-spaces",
        excerpt:
          "Discover how neutral palettes, natural textures, and thoughtful accents create living rooms that feel both luxurious and inviting.",
        content: `<h2>The Art of Restraint</h2><p>Neutral living spaces are far from boring—they are canvases for texture, light, and form. The key lies in layering materials: linen upholstery, warm oak, brushed brass, and soft wool rugs create depth without visual clutter.</p><h2>Choosing Your Palette</h2><p>Start with a foundation of warm whites, soft greiges, and sandy beiges. Introduce contrast through charcoal accents, aged bronze hardware, and deep green botanicals.</p><h3>Texture Is Everything</h3><p>Mix matte and sheen, rough and smooth. A plaster wall behind a velvet sofa, a marble coffee table atop a jute rug—these juxtapositions elevate the ordinary to the extraordinary.</p><blockquote>True luxury whispers; it never shouts.</blockquote><p>Finish with curated objects: a single sculptural vase, art books stacked with intention, and lighting that glows rather than glares.</p>`,
        coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
        published: true,
        publishedAt: new Date(),
        metaTitle: "Timeless Elegance: Neutral Living Spaces | WilloraNoor",
        metaDescription:
          "Learn to create sophisticated neutral living rooms with texture, warmth, and timeless design principles.",
        authorId: admin.id,
        categoryId: livingRoom.id,
      },
    });
  }

  const settings = [
    { key: "siteName", value: "WilloraNoor" },
    {
      key: "siteDescription",
      value:
        "A premium home décor publication celebrating elegant interiors, timeless design, and inspired living.",
    },
    { key: "siteUrl", value: "http://localhost:3000" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
