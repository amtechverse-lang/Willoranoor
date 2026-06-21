-- Spec-compliant index name for full-text search (column managed in add_search_vector migration)
CREATE INDEX IF NOT EXISTS idx_post_search ON "Post" USING GIN (search_vector);
