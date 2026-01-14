import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SeasonManager } from '@/components/admin/season-manager';

export default async function SeasonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if WBP Super Admin
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('organizations!inner(slug)')
    .eq('user_id', user.id)
    .single();

  // For prototype, only 'wellbeing-project' org members can access admin
  if (membership?.organizations?.slug !== 'wellbeing-project') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600">← Back</Link>
          <h1 className="text-3xl font-serif text-[#2C3E50]">Manage Gathering Seasons</h1>
        </div>

        <SeasonManager />
      </div>
    </div>
  );
}