import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateOrganizationForm } from '@/components/admin/create-organization-form';
import { isSuperAdmin } from '@/lib/utils/admin';

export default async function NewOrganizationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if WBP Admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single();

  if (!isSuperAdmin(userProfile?.email)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/organizations" className="text-gray-400 hover:text-gray-600">← Back</Link>
          <h1 className="text-3xl font-serif text-[#2C3E50]">Add New Organization</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-500 mb-6">
            Create a new organization and invite their primary admin. They'll receive access to set up their team.
          </p>

          <CreateOrganizationForm />
        </div>
      </div>
    </div>
  );
}
