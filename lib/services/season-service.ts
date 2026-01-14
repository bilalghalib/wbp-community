import { createClient } from '@/lib/supabase/client';

export interface ImpactStats {
  provider_views: number;
  resource_views: number;
  resource_downloads: number;
}

export async function getUserImpactStats(): Promise<ImpactStats> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { provider_views: 0, resource_views: 0, resource_downloads: 0 };

  const { data, error } = await supabase
    .rpc('get_user_impact_stats', { target_user_id: user.id });

  if (error) {
    console.error('Error fetching impact stats:', error);
    return { provider_views: 0, resource_views: 0, resource_downloads: 0 };
  }

  return data as ImpactStats;
}

export async function getActiveSeason() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('survey_seasons')
    .select('*')
    .eq('is_active', true)
    .single();
    
  if (error) return null;
  return data;
}
