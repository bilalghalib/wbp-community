-- Add taxonomy fields to organizations for better aggregation in the Insights Hub
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS sector TEXT,
ADD COLUMN IF NOT EXISTS entity_type TEXT,
ADD COLUMN IF NOT EXISTS entity_size TEXT,
ADD COLUMN IF NOT EXISTS areas_of_work TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS focus_of_work TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_sector ON organizations(sector);
CREATE INDEX IF NOT EXISTS idx_organizations_region ON organizations(location_region);
