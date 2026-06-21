import { auth } from "@/auth";
import { mkdir, readdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const files = await readdir(UPLOAD_DIR);
    const media = files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map((filename) => ({
        filename,
        url: `/uploads/${filename}`,
      }))
      .reverse();

    return NextResponse.json(media);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext === ".png" ? ".webp" : ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
    await sharp(buffer)
      .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath.replace(/\.[^.]+$/, ".webp"));
    const finalName = filename.replace(/\.[^.]+$/, ".webp");
    return NextResponse.json({
      url: `/uploads/${finalName}`,
      filename: finalName,
    });
  }

  await writeFile(filepath, buffer);
  return NextResponse.json({
    url: `/uploads/${filename}`,
    filename,
  });
}
