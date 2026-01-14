'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function SeasonManager() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSeason, setNewSeason] = useState({
    name: '2026 Annual Gathering',
    start_at: '2025-12-15T00:00',
    end_at: '2026-01-15T23:59',
    grace_period_end_at: '2026-02-01T23:59',
  });

  useEffect(() => {
    loadSeasons();
  }, []);

  async function loadSeasons() {
    const supabase = createClient();
    const { data } = await supabase.from('survey_seasons').select('*').order('created_at', { ascending: false });
    setSeasons(data || []);
    setLoading(false);
  }

  async function createSeason() {
    const supabase = createClient();
    const { error } = await supabase.from('survey_seasons').insert([{
      ...newSeason,
      is_active: false
    }]);
    if (error) alert(error.message);
    else loadSeasons();
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const supabase = createClient();
    
    // Deactivate all first (since we have a unique index on is_active=true)
    if (!currentActive) {
      await supabase.from('survey_seasons').update({ is_active: false }).eq('is_active', true);
    }

    const { error } = await supabase
      .from('survey_seasons')
      .update({ is_active: !currentActive })
      .eq('id', id);
    
    if (error) alert(error.message);
    else loadSeasons();
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Season</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Season Name</Label>
            <Input value={newSeason.name} onChange={e => setNewSeason({...newSeason, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="datetime-local" value={newSeason.start_at} onChange={e => setNewSeason({...newSeason, start_at: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>End Date (Soft)</Label>
            <Input type="datetime-local" value={newSeason.end_at} onChange={e => setNewSeason({...newSeason, end_at: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Grace Period End (Hard)</Label>
            <Input type="datetime-local" value={newSeason.grace_period_end_at} onChange={e => setNewSeason({...newSeason, grace_period_end_at: e.target.value})} />
          </div>
        </div>
        <Button onClick={createSeason} className="mt-4">Create Season</Button>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Seasons</h3>
        {seasons.map(s => (
          <Card key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-bold">{s.name} {s.is_active && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>}</div>
              <div className="text-sm text-gray-500">
                {new Date(s.start_at).toLocaleDateString()} - {new Date(s.end_at).toLocaleDateString()} 
                (Grace: {new Date(s.grace_period_end_at).toLocaleDateString()})
              </div>
            </div>
            <Button variant={s.is_active ? "destructive" : "default"} onClick={() => toggleActive(s.id, s.is_active)}>
              {s.is_active ? 'Deactivate' : 'Activate'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}