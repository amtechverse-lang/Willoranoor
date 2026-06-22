import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function processAndUploadImage(
  buffer: Buffer,
): Promise<{ url: string; filename: string }> {
  const webpBuffer = await sharp(buffer)
    .resize(1200, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${randomUUID()}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, webpBuffer, {
      access: "public",
      contentType: "image/webp",
    });
    return { url: blob.url, filename };
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Image uploads on Vercel require Blob storage. Enable Vercel Blob and set BLOB_READ_WRITE_TOKEN.",
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), webpBuffer);
  return { url: `/uploads/${filename}`, filename };
}
