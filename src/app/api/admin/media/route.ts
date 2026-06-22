import { auth } from "@/auth";
import { processAndUploadImage } from "@/lib/upload-image";
import { list } from "@vercel/blob";
import { mkdir, readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list({ prefix: "uploads/", limit: 100 });
      const media = blobs
        .map((blob) => ({
          filename: blob.pathname.replace("uploads/", ""),
          url: blob.url,
        }))
        .reverse();
      return NextResponse.json(media);
    }

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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, filename } = await processAndUploadImage(buffer);

    return NextResponse.json({ url, filename });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
