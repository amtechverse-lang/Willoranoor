-- Add full-text search vector column to Post
-- Note: Uses trigger-based updates (strips HTML, weights title/excerpt/content)
-- which is more accurate than a plain GENERATED ALWAYS column on raw HTML content.
-- Prisma cannot manage generated/tsvector columns directly.
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION post_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(regexp_replace(NEW.content, '<[^>]+>', ' ', 'g'), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search vector
DROP TRIGGER IF EXISTS post_search_vector_trigger ON "Post";
CREATE TRIGGER post_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, excerpt, content ON "Post"
  FOR EACH ROW EXECUTE FUNCTION post_search_vector_update();

-- Backfill existing rows
UPDATE "Post" SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(regexp_replace(content, '<[^>]+>', ' ', 'g'), '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS post_search_vector_idx ON "Post" USING GIN (search_vector);
