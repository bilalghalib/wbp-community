import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminResearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is WBP admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()

  const isWBPAdmin = userProfile?.email.endsWith('@wellbeingproject.org')

  if (!isWBPAdmin) {
    redirect('/admin')
  }

  // Get all research documents
  const { data: allResearch } = await supabase
    .from('research_documents')
    .select(`
      id,
      title,
      tags,
      topics,
      created_at,
      organization_id,
      visibility_level,
      uploaded_by_user_id,
      organization:organizations(name, slug),
      uploaded_by:users(full_name, email)
    `)
    .order('created_at', { ascending: false })

  const totalDocuments = allResearch?.length || 0

  // Count by visibility level
  const publicDocs = allResearch?.filter(d => d.visibility_level === 'public').length || 0
  const networkDocs = allResearch?.filter(d => d.visibility_level === 'network').length || 0
  const orgDocs = allResearch?.filter(d => d.visibility_level === 'organization').length || 0

  // Count contributing organizations
  const contributingOrgs = new Set(allResearch?.map(d => d.organization_id) || []).size

  // Get total active orgs for comparison
  const { count: totalActiveOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const researchAdoptionRate = totalActiveOrgs
    ? Math.round((contributingOrgs / totalActiveOrgs) * 100)
    : 0

  // Extract all tags and topics with counts
  const tagCounts: Record<string, number> = {}
  const topicCounts: Record<string, number> = {}

  allResearch?.forEach(doc => {
    doc.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
    doc.topics?.forEach((topic: string) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1
    })
  })

  // Sort by count descending
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Upload activity by month (last 6 months)
  const monthlyUploads: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    monthlyUploads[key] = 0
  }

  allResearch?.forEach(doc => {
    const date = new Date(doc.created_at)
    const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (monthlyUploads.hasOwnProperty(key)) {
      monthlyUploads[key]++
    }
  })

  // Top contributing organizations
  const orgContributions: Record<string, { name: string; count: number; slug: string }> = {}
  allResearch?.forEach(doc => {
    const orgId = doc.organization_id
    if (!orgContributions[orgId]) {
      const org = Array.isArray(doc.organization) ? doc.organization[0] : doc.organization
      orgContributions[orgId] = {
        name: org?.name || 'Unknown',
        slug: org?.slug || '',
        count: 0,
      }
    }
    orgContributions[orgId].count++
  })

  const topContributors = Object.values(orgContributions)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Recent uploads (last 10)
  const recentUploads = allResearch?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin" className="text-sm text-gray-700 hover:text-gray-900">
              ← Admin Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Research Analytics</h1>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Research Repository Analytics</h1>
          <p className="mt-2 text-gray-600">
            Insights into research sharing across the network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Documents</p>
            <p className="text-3xl font-bold text-gray-900">{totalDocuments}</p>
            <p className="text-xs text-gray-500 mt-1">
              {publicDocs} public, {networkDocs} network, {orgDocs} org-only
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Contributing Organizations</p>
            <p className="text-3xl font-bold text-blue-600">{contributingOrgs}</p>
            <p className="text-xs text-gray-500 mt-1">
              {researchAdoptionRate}% of active orgs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Unique Tags</p>
            <p className="text-3xl font-bold text-green-600">{Object.keys(tagCounts).length}</p>
            <p className="text-xs text-gray-500 mt-1">
              Across all documents
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Unique Topics</p>
            <p className="text-3xl font-bold text-purple-600">{Object.keys(topicCounts).length}</p>
            <p className="text-xs text-gray-500 mt-1">
              Across all documents
            </p>
          </div>
        </div>

        {/* Upload Trends */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Trends (Last 6 Months)</h2>
          <div className="space-y-3">
            {Object.entries(monthlyUploads).map(([month, count]) => {
              const maxCount = Math.max(...Object.values(monthlyUploads))
              const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
              return (
                <div key={month}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-900">{month}</span>
                    <span className="text-sm text-gray-600">{count} upload{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h2>
            <div className="space-y-3">
              {topTags.map(([tag, count]) => {
                const maxCount = topTags[0]?.[1] || 1
                const percentage = Math.round((count / maxCount) * 100)
                return (
                  <div key={tag}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {tag.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-gray-600">{count} doc{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {topTags.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No tags yet</p>
              )}
            </div>
          </div>

          {/* Popular Topics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h2>
            <div className="space-y-3">
              {topTopics.map(([topic, count]) => {
                const maxCount = topTopics[0]?.[1] || 1
                const percentage = Math.round((count / maxCount) * 100)
                return (
                  <div key={topic}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {topic.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-gray-600">{count} doc{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {topTopics.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No topics yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Contributing Organizations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {topContributors.map((org, index) => (
                <div key={org.slug} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-400 mr-3">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/organizations/${org.slug}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                        >
                          {org.name}
                        </Link>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-semibold text-gray-900">
                      {org.count} doc{org.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
              {topContributors.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No contributions yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentUploads.map((doc) => (
                <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(Array.isArray(doc.organization) ? doc.organization[0] : doc.organization)?.name || 'Unknown'}
                      </p>
                    </div>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        doc.visibility_level === 'public'
                          ? 'bg-green-100 text-green-800'
                          : doc.visibility_level === 'network'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {doc.visibility_level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags?.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {(doc.tags?.length || 0) > 3 && (
                        <span className="text-xs text-gray-500">
                          +{doc.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {new Date(doc.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {recentUploads.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No uploads yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insights Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Research Insights</h3>
              <p className="mt-1 text-sm text-blue-700">
                Use these insights to identify trending topics, encourage contributions from organizations
                that haven&apos;t shared research yet, and surface valuable resources to the network.
                Consider creating curated collections based on popular tags.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
