import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isSuperAdmin } from '@/lib/utils/admin'
import BulkImportForm from '@/components/admin/bulk-import-form'

export default async function BulkImportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()

  if (!isSuperAdmin(userProfile?.email)) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/organizations" className="text-sm text-gray-700 hover:text-gray-900">
              ← Back to Organizations
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Bulk Import</h1>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Organizations</h1>
          <p className="mt-2 text-gray-600">
            Bulk import organizations and their primary admins from a CSV file.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-semibold text-blue-900 mb-3">CSV Format</h2>
          <p className="text-sm text-blue-700 mb-4">
            Your CSV file should have the following columns (headers required):
          </p>
          <div className="bg-white rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <p className="text-gray-600">org_name,org_slug,admin_email,admin_name,website</p>
            <p className="text-gray-800">Climate Justice Alliance,climate-justice,maria@cja.org,Maria Santos,https://cja.org</p>
            <p className="text-gray-800">Health Equity Now,health-equity,james@hen.org,James Wilson,https://healthequitynow.org</p>
          </div>
          <div className="mt-4 text-sm text-blue-700">
            <p className="font-medium mb-2">Column descriptions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>org_name</strong> (required): Organization display name</li>
              <li><strong>org_slug</strong> (optional): URL slug (auto-generated if empty)</li>
              <li><strong>admin_email</strong> (required): Primary admin email address</li>
              <li><strong>admin_name</strong> (required): Primary admin full name</li>
              <li><strong>website</strong> (optional): Organization website URL</li>
            </ul>
          </div>
        </div>

        <BulkImportForm />
      </main>
    </div>
  )
}
