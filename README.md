# WilloraNoor

A premium home décor publication built with Next.js 15, featuring a full admin CMS and elegant public-facing magazine site.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI:** shadcn/ui components with custom beige/charcoal/gold theme
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **Auth:** NextAuth.js v5 (Auth.js) with Credentials provider and JWT sessions
- **Editor:** TipTap rich text editor
- **Search:** PostgreSQL full-text search (tsvector + GIN index)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets
```

### Database Setup

```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed admin user, categories, sample post
```

Default admin credentials:
- **Email:** admin@willoranoor.com
- **Password:** admin123

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub and import the project in Vercel
2. Set environment variables:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `AUTH_SECRET` / `NEXTAUTH_SECRET` — Random 32+ char string
   - `NEXTAUTH_URL` — Your production URL (e.g. `https://willoranoor.com`)
3. Build command: `npm run build`
4. Run migrations against production DB:
   ```bash
   npm run db:deploy
   npm run db:seed
   ```

### Neon Database

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Use the pooled connection string for serverless deployments

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth session encryption secret |
| `NEXTAUTH_SECRET` | Same as AUTH_SECRET (legacy compat) |
| `NEXTAUTH_URL` | Canonical site URL |

## Project Structure

```
src/
├── app/
│   ├── (site)/          # Public pages
│   ├── admin/           # Admin CMS
│   └── api/             # API routes
├── components/
│   ├── admin/           # Admin components (TipTap editor, sidebar)
│   ├── site/            # Public site components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities, Prisma, auth helpers
└── generated/prisma/    # Generated Prisma client
```

## Features

- **Public Site:** Homepage, article pages with TOC, category browsing with infinite scroll, full-text search, static pages, sitemap.xml, robots.txt
- **Admin CMS:** Dashboard, posts CRUD with TipTap, categories, media library with sharp optimization, SEO settings
- **Security:** Server-side HTML sanitization (sanitize-html + DOMPurify patterns), protected admin routes via middleware

## License

Private — All rights reserved.
