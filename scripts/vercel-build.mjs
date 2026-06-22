import { execSync } from "node:child_process";

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  BUILD FAILED: DATABASE_URL is not set on Vercel                   ║
╠══════════════════════════════════════════════════════════════════╣
║  1. Open Vercel → Project → Settings → Environment Variables     ║
║  2. Add DATABASE_URL = your Neon PostgreSQL connection string    ║
║     (use the direct/unpooled URL for migrations)                 ║
║  3. Enable it for Production AND Preview                         ║
║  4. Redeploy                                                       ║
╚══════════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

run("npx prisma migrate deploy");
run("npx prisma generate");
run("npx next build");
