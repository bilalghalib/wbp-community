import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's profile and organizations
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold">Springboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {profile?.full_name || user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {profile?.full_name}
          </h2>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Organizations</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {memberships?.map((membership: any) => (
                <div
                  key={membership.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-lg font-medium text-gray-900">
                      {membership.organization.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Role: {membership.role.replace('_', ' ')}
                    </p>
                    <div className="mt-4">
                      <a
                        href={`/organizations/${membership.organization.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View organization →
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {(!memberships || memberships.length === 0) && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    You are not a member of any organizations yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Contact a WBP administrator to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href="/service-providers"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Service Providers</h3>
              <p className="mt-2 text-sm text-gray-500">
                Find trusted therapists, coaches, and facilitators
              </p>
            </a>

            <a
              href="/research"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Research Library</h3>
              <p className="mt-2 text-sm text-gray-500">
                Explore shared research and resources
              </p>
            </a>

            <a
              href="/surveys"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Surveys</h3>
              <p className="mt-2 text-sm text-gray-500">
                Deploy and view wellbeing assessments
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
