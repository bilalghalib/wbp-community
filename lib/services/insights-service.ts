import { createClient } from '@/lib/supabase/client';
import { RegionalInsight } from '@/types/regional-insights';

export async function submitRegionalInsight(insight: Omit<RegionalInsight, 'id' | 'created_at' | 'analysis_status'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('regional_insights')
    .insert([{
      ...insight,
      analysis_status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting insight:', error);
    throw error;
  }

  return data;
}

export async function getMyInsights() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('regional_insights')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }

  return data as RegionalInsight[];
}
