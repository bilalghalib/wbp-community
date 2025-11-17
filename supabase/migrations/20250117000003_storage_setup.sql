-- Create storage bucket for research documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-documents', 'research-documents', false);

-- Storage policy: Network members can read network/public documents
CREATE POLICY "Network members can read network/public research"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'research-documents' AND (
    -- Public documents are readable by anyone
    EXISTS (
      SELECT 1 FROM research_documents rd
      WHERE rd.file_path = storage.objects.name
      AND rd.visibility_level = 'public'
    )
    OR
    -- Network/private documents require membership
    EXISTS (
      SELECT 1
      FROM research_documents rd
      JOIN organization_memberships om ON om.organization_id = rd.organization_id
      WHERE rd.file_path = storage.objects.name
      AND om.user_id = auth.uid()
      AND om.is_active = true
      AND (
        -- Network members can read network docs
        (rd.visibility_level = 'network')
        OR
        -- Org members can read their org's private docs
        (rd.visibility_level = 'private' AND om.organization_id = rd.organization_id)
      )
    )
  )
);

-- Storage policy: Contributors and admins can upload research
CREATE POLICY "Contributors can upload research"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'research-documents' AND
  EXISTS (
    SELECT 1
    FROM organization_memberships om
    WHERE om.user_id = auth.uid()
    AND om.is_active = true
    AND om.role IN ('contributor', 'primary_admin', 'backup_admin')
    -- File path starts with organization ID
    AND storage.objects.name LIKE om.organization_id || '/%'
  )
);

-- Storage policy: Users can update their own uploads
CREATE POLICY "Users can update their uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'research-documents' AND
  EXISTS (
    SELECT 1
    FROM research_documents rd
    WHERE rd.file_path = storage.objects.name
    AND rd.uploaded_by_user_id = auth.uid()
  )
);

-- Storage policy: Users can delete their own uploads or admins can delete org uploads
CREATE POLICY "Users can delete their uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'research-documents' AND (
    -- User uploaded it
    EXISTS (
      SELECT 1
      FROM research_documents rd
      WHERE rd.file_path = storage.objects.name
      AND rd.uploaded_by_user_id = auth.uid()
    )
    OR
    -- User is admin in the organization
    EXISTS (
      SELECT 1
      FROM research_documents rd
      JOIN organization_memberships om ON om.organization_id = rd.organization_id
      WHERE rd.file_path = storage.objects.name
      AND om.user_id = auth.uid()
      AND om.is_active = true
      AND om.role IN ('primary_admin', 'backup_admin')
    )
  )
);
