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
    name: "Bedroom",
    slug: "bedroom",
    description: "Serene retreats and bedroom styling ideas.",
  },
  {
    name: "Living Room",
    slug: "living-room",
    description: "Elegant living spaces and lounge design inspiration.",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    description: "Refined dining spaces for memorable gatherings.",
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
    description: "Patios, terraces, and alfresco living.",
  },
  {
    name: "Garden",
    slug: "garden",
    description: "Landscaping and garden design inspiration.",
  },
];

const posts = [
  {
    title: "The Art of the Serene Master Bedroom",
    slug: "serene-master-bedroom-retreat",
    categorySlug: "bedroom",
    excerpt:
      "Transform your bedroom into a calming sanctuary with layered linens, soft lighting, and a palette that invites restful sleep.",
    coverImage:
      "https://images.unsplash.com/photo-1616594039914-ae801adba904?w=1200&q=80",
    content: `<h2>Start With Calm Foundations</h2><p>A master bedroom should feel like a exhale at the end of the day. Begin with a restrained palette—warm whites, oatmeal, and soft taupe—and build depth through texture rather than bold color.</p><h2>Layered Bedding</h2><p>Invest in quality cotton or linen sheets, add a lightweight quilt, and finish with a textured throw. Pillows in varying sizes create that boutique-hotel look without clutter.</p><h3>Lighting Matters</h3><p>Pair dimmable overhead lighting with bedside sconces or table lamps. Warm bulbs (2700K) flatter skin tones and encourage relaxation.</p><blockquote>Sleep is the ultimate luxury—design for it deliberately.</blockquote>`,
    focusKeyword: "master bedroom design",
  },
  {
    title: "Luxury Living Rooms: Texture, Light & Timeless Style",
    slug: "luxury-living-rooms-texture-light",
    categorySlug: "living-room",
    excerpt:
      "Discover how neutral palettes, natural materials, and sculptural accents create living rooms that feel both refined and deeply inviting.",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    content: `<h2>The Art of Restraint</h2><p>Neutral living spaces are canvases for texture, light, and form. Layer linen upholstery, warm oak, brushed brass, and wool rugs for depth without visual noise.</p><h2>Choosing Your Palette</h2><p>Foundation tones of warm white, greige, and sand pair beautifully with charcoal accents and deep green botanicals.</p><h3>Texture Is Everything</h3><p>Mix matte and sheen, rough and smooth—a plaster wall behind velvet, marble atop jute—to elevate the ordinary.</p><blockquote>True luxury whispers; it never shouts.</blockquote>`,
    focusKeyword: "luxury living room",
  },
  {
    title: "Dining Rooms Made for Memorable Evenings",
    slug: "dining-rooms-memorable-evenings",
    categorySlug: "dining-room",
    excerpt:
      "From statement lighting to tablescape styling, create a dining room that turns every meal into an occasion worth savoring.",
    coverImage:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
    content: `<h2>Anchor With a Statement Light</h2><p>A sculptural chandelier or oversized pendant defines the room and casts a flattering glow over your table. Dimmer switches are non-negotiable for ambiance.</p><h2>The Table as Centerpiece</h2><p>Solid wood tables age beautifully. Pair with upholstered chairs for comfort during long dinners, or mix chair styles for an collected look.</p><h3>Styling the Sideboard</h3><p>A curated sideboard with art, candles, and a vase creates a visual backdrop and practical storage for linens and serveware.</p>`,
    focusKeyword: "dining room design",
  },
  {
    title: "Modern Kitchens: Where Form Meets Function",
    slug: "modern-kitchens-form-function",
    categorySlug: "kitchen",
    excerpt:
      "Clean lines, thoughtful storage, and warm materials combine in kitchens that are as beautiful as they are practical for everyday life.",
    coverImage:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=80",
    content: `<h2>The Work Triangle Reimagined</h2><p>Modern kitchens prioritize flow. Keep the sink, stove, and refrigerator within easy reach while allowing generous counter space for prep and gathering.</p><h2>Materials That Age Well</h2><p>Quartz countertops, shaker cabinetry in soft green or warm white, and brass hardware create a timeless palette that withstands trends.</p><h3>Open Shelving With Intention</h3><p>Display only what you love— ceramic bowls, cookbooks, a single plant—and keep everyday clutter behind closed doors.</p>`,
    focusKeyword: "modern kitchen design",
  },
  {
    title: "Spa-Inspired Bathrooms You Won't Want to Leave",
    slug: "spa-inspired-bathroom-sanctuaries",
    categorySlug: "bathroom",
    excerpt:
      "Bring hotel-level calm home with stone surfaces, rainfall showers, and the small rituals that make a bathroom feel like a private spa.",
    coverImage:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
    content: `<h2>Stone and Steam</h2><p>Large-format tiles in honed marble or limestone create seamless, spa-like surfaces. A walk-in shower with a frameless glass panel opens the room visually.</p><h2>Sensory Details</h2><p>Heated floors, plush towels, and a bench for grooming rituals elevate daily routines into moments of care.</p><h3>Soft, Layered Light</h3><p>Combine recessed lighting with backlit mirrors and a single decorative sconce for flattering, adjustable illumination.</p>`,
    focusKeyword: "spa bathroom design",
  },
  {
    title: "Outdoor Living Rooms Under Open Skies",
    slug: "outdoor-living-rooms-open-skies",
    categorySlug: "outdoor",
    excerpt:
      "Extend your home's comfort outdoors with weather-resistant furnishings, ambient lighting, and spaces designed for long evenings with friends.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    content: `<h2>Define Zones</h2><p>Create distinct areas for dining, lounging, and conversation using rugs, planters, and low walls—even in open patios.</p><h2>All-Weather Comfort</h2><p>Choose performance fabrics and teak or powder-coated aluminum frames. Deep cushions and throws make outdoor seating as inviting as indoors.</p><h3>Evening Ambience</h3><p>String lights, lanterns, and a fire pit extend usability well past sunset and through cooler months.</p>`,
    focusKeyword: "outdoor living room",
  },
  {
    title: "English Garden Terraces & Romantic Landscaping",
    slug: "english-garden-terrace-inspiration",
    categorySlug: "garden",
    excerpt:
      "Cottage-garden charm meets structured design in terraces filled with roses, clipped boxwood, and stone paths that invite slow strolls.",
    coverImage:
      "https://images.unsplash.com/photo-1585320806297-9794b1733abb?w=1200&q=80",
    content: `<h2>Structure First</h2><p>Begin with evergreens and clipped hedges to establish year-round form. Fill seasonal gaps with roses, lavender, and ornamental grasses.</p><h2>Stone Underfoot</h2><p>Weathered flagstone or gravel paths add texture and guide movement through the garden. Allow soft planting to spill slightly over edges for romance.</p><h3>Seating Nooks</h3><p>A wrought-iron bench or stone ledge tucked among blooms creates a destination—not just a view—to enjoy your work.</p>`,
    focusKeyword: "garden terrace design",
  },
  {
    title: "Cozy Reading Nooks in Every Corner",
    slug: "cozy-reading-nooks-home",
    categorySlug: "living-room",
    excerpt:
      "Carve out intimate corners with the perfect chair, good light, and shelves that make losing yourself in a book the best part of the day.",
    coverImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
    content: `<h2>Find the Right Seat</h2><p>A wingback chair or deep armchair with ottoman supports hours of reading. Add a lumbar pillow for lower-back comfort.</p><h2>Light to Read By</h2><p>Position a floor lamp with an adjustable arm behind or beside the chair. Aim for focused light that won't glare on pages or screens.</p><h3>Personal Touches</h3><p>Stack favorite books within reach, drape a soft throw, and place a small side table for tea—a nook should feel unmistakably yours.</p>`,
    focusKeyword: "reading nook ideas",
  },
  {
    title: "Minimalist Bedrooms: Less Clutter, More Peace",
    slug: "minimalist-bedroom-styling",
    categorySlug: "bedroom",
    excerpt:
      "Strip back to essentials without losing warmth—minimalist bedrooms prove that empty space can feel rich when every piece is chosen with care.",
    coverImage:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80",
    content: `<h2>Edit Ruthlessly</h2><p>Keep surfaces clear. Store items in closed cabinetry or under-bed drawers. A platform bed with clean lines anchors the room without bulk.</p><h2>One Focal Point</h2><p>Let a single element shine—a textured headboard, an oversized artwork, or a view-framing window treatment.</p><h3>Quality Over Quantity</h3><p>Fewer, better pieces last longer and create calm. Choose natural materials that patina gracefully over time.</p>`,
    focusKeyword: "minimalist bedroom",
  },
  {
    title: "Tablescapes That Elevate Every Gathering",
    slug: "dining-tablescape-styling",
    categorySlug: "dining-room",
    excerpt:
      "Master the art of table styling with layered linens, mixed ceramics, and centerpieces that celebrate the season without overwhelming the meal.",
    coverImage:
      "https://images.unsplash.com/photo-1615874959473-dbf969475f78?w=1200&q=80",
    content: `<h2>Build From the Center</h2><p>Start with a runner or bare wood, then add a low centerpiece— branches, candles, or a bowl of fruit—that stays below eye level for conversation.</p><h2>Mix Your Place Settings</h2><p>Combine vintage and new plates, varied glassware, and linen napkins with different folds. Imperfection reads as hospitality.</p><h3>Seasonal Touches</h3><p>Swap accents with the calendar: spring blossoms, summer citrus, autumn gourds, winter greenery. Small changes keep traditions fresh.</p>`,
    focusKeyword: "tablescape styling",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@willoranoor.com" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: "admin@willoranoor.com",
      name: "WilloraNoor Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (
      await prisma.category.findMany({
        where: { slug: { in: categories.map((c) => c.slug) } },
      })
    ).map((c) => [c.slug, c.id]),
  );

  const baseDate = new Date();
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const categoryId = categoryMap[post.categorySlug];
    if (!categoryId) continue;

    const publishedAt = new Date(baseDate);
    publishedAt.setDate(publishedAt.getDate() - i);

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        focusKeyword: post.focusKeyword,
        published: true,
        publishedAt,
        metaTitle: `${post.title} | WilloraNoor`,
        metaDescription: post.excerpt,
        categoryId,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        focusKeyword: post.focusKeyword,
        published: true,
        publishedAt,
        metaTitle: `${post.title} | WilloraNoor`,
        metaDescription: post.excerpt,
        authorId: admin.id,
        categoryId,
      },
    });
  }

  const settings = [
    { key: "siteName", value: "WilloraNoor" },
    {
      key: "siteDescription",
      value:
        "Premium home décor inspiration—elegant interiors, timeless design, and ideas for beautiful living.",
    },
    {
      key: "siteUrl",
      value: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("\n========================================");
  console.log("  WilloraNoor seed completed!");
  console.log("========================================");
  console.log(`  Posts created/updated: ${posts.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log("\n  ADMIN LOGIN:");
  console.log("  Email:    admin@willoranoor.com");
  console.log("  Password: admin123");
  console.log("\n  LOCAL URLS:");
  console.log("  Site:  http://localhost:3000");
  console.log("  Admin: http://localhost:3000/admin/login");
  console.log("========================================\n");
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
