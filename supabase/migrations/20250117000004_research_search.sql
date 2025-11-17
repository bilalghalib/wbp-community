-- Function to update research document search vector
CREATE OR REPLACE FUNCTION update_research_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), '') || ' ' ||
    coalesce(array_to_string(NEW.topics, ' '), '') || ' ' ||
    coalesce(array_to_string(NEW.authors, ' '), '') || ' ' ||
    coalesce(NEW.research_type, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tsv on insert/update
CREATE TRIGGER research_tsv_update
BEFORE INSERT OR UPDATE ON research_documents
FOR EACH ROW
EXECUTE FUNCTION update_research_tsv();

-- Create GIN index on tsv for fast full-text search
CREATE INDEX IF NOT EXISTS research_documents_tsv_idx ON research_documents USING GIN(tsv);

-- Create indexes for common filter queries
CREATE INDEX IF NOT EXISTS research_documents_tags_idx ON research_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS research_documents_topics_idx ON research_documents USING GIN(topics);
CREATE INDEX IF NOT EXISTS research_documents_type_idx ON research_documents(research_type);
CREATE INDEX IF NOT EXISTS research_documents_visibility_idx ON research_documents(visibility_level);
CREATE INDEX IF NOT EXISTS research_documents_org_idx ON research_documents(organization_id);
CREATE INDEX IF NOT EXISTS research_documents_created_idx ON research_documents(created_at DESC);
