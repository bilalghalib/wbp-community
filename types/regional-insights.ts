export interface RegionalInsight {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  region: string;
  sector: string | null;
  answers: Record<string, string>;
  analysis_status: 'pending' | 'processing' | 'completed';
  created_at: string;
}
