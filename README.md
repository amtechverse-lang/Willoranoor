# WilloraNoor

A premium home décor publication built with Next.js 15, featuring a full admin CMS and elegant public-facing magazine site.

## Quick Links (Local)

| Page | URL |
|------|-----|
| **Public homepage** | http://localhost:3000 |
| **Admin login** | http://localhost:3000/admin/login |
| **Admin dashboard** | http://localhost:3000/admin |

### Admin credentials (after seed)

- **Email:** `admin@willoranoor.com`
- **Password:** `admin123`

> Change the password after first login in production.

---

## Local development

```bash
cd willoranoor
npm install
cp .env.example .env
# Add your Neon DATABASE_URL and secrets to .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel (via GitHub)

### Step 1 — Push to GitHub

Repo: https://github.com/amtechverse-lang/Willoranoor.git

```bash
git push origin main
```

### Step 2 — Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **amtechverse-lang/Willoranoor**
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `willoranoor` if the repo root is `F:\ani`, or `.` if repo root is the project folder

### Step 3 — Environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string (use **pooled** URL for serverless) |
| `AUTH_SECRET` | Random 32+ character string ([generate](https://generate-secret.vercel.app/32)) |
| `NEXTAUTH_SECRET` | Same value as `AUTH_SECRET` |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://willoranoor.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Auto-added if you enable **Vercel Blob** storage (required for image uploads) |

### Step 4 — Enable Vercel Blob (for image uploads)

1. Vercel dashboard → your project → **Storage** → **Create Database** → **Blob**
2. Connect to project — this adds `BLOB_READ_WRITE_TOKEN` automatically
3. Redeploy after adding storage

Without Blob, the site works but admin image uploads fail on Vercel (local uploads to `public/uploads` work in dev only).

### Step 5 — Deploy

Vercel runs `vercel-build` which executes:

```
prisma migrate deploy && prisma generate && next build
```

Migrations apply automatically on each deploy.

### Step 6 — Seed production database (first time only)

From your machine with production `DATABASE_URL`:

```bash
# Pull env from Vercel (requires Vercel CLI)
npx vercel env pull .env.production.local
# Or paste DATABASE_URL manually into .env

npm run db:seed
```

This creates the admin user, 7 categories, and 10 sample articles with images.

---

## Using the admin CMS

1. Go to **https://your-domain.vercel.app/admin/login**
2. Sign in with `admin@willoranoor.com` / `admin123`
3. **Posts** — create, edit, publish articles with TipTap rich text editor
4. **Categories** — manage room categories (Bedroom, Kitchen, etc.)
5. **Media** — upload images (requires Vercel Blob on production)
6. **Settings** — site name, SEO, analytics ID

### Creating a post

1. Admin → **Posts** → **New Post**
2. Add title, excerpt, category, tags
3. Write content in the editor (bold, headings, images, tables)
4. Upload a featured image or paste an Unsplash URL
5. Click **Publish** or **Save as Draft**

---

## Tech stack

- Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- Prisma 7 + PostgreSQL (Neon)
- NextAuth.js v5 (Credentials + JWT)
- TipTap editor, PostgreSQL full-text search
- Vercel Blob for production image storage

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:deploy` | Run migrations (production) |
| `npm run db:seed` | Seed admin, categories, sample posts |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Vercel | Check `DATABASE_URL` is set; migrations run via `vercel-build` |
| Admin login fails | Run `npm run db:seed` against production DB |
| Images won't upload on Vercel | Enable Vercel Blob and set `BLOB_READ_WRITE_TOKEN` |
| Database connection errors | Use Neon's **pooled** connection string on Vercel |
| `NEXTAUTH_URL` mismatch | Must exactly match your production domain |

---

Private — All rights reserved.
