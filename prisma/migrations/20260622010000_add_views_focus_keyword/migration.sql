-- Add focusKeyword and views columns to Post
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "focusKeyword" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
