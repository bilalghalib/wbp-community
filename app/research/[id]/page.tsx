import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

type PageProps = {
  params: { id: string }
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch document with organization info
  const { data: document, error } = await supabase
    .from('research_documents')
    .select(`
      *,
      organization:organizations(id, name, slug),
      uploaded_by:users(id, full_name, email)
    `)
    .eq('id', params.id)
    .single()

  if (error || !document) {
    notFound()
  }

  // Check visibility permissions
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('id, role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  // Private documents only visible to org members
  if (document.visibility_level === 'private') {
    const { data: orgMembership } = await supabase
      .from('organization_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', document.organization_id)
      .eq('is_active', true)
      .single()

    if (!orgMembership) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
            <p className="mt-2 text-gray-600">
              This document is private to {document.organization.name}.
            </p>
            <Link href="/research" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
              Return to Research Library
            </Link>
          </div>
        </div>
      )
    }
  }

  // Network documents require network membership
  if (document.visibility_level === 'network' && !membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You must be a network member to view this document.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Check if user can edit/delete (uploaded by them or admin in org)
  let canEdit = false
  if (document.uploaded_by_user_id === user.id) {
    canEdit = true
  } else {
    const { data: adminMembership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', document.organization_id)
      .eq('is_active', true)
      .in('role', ['primary_admin', 'backup_admin'])
      .single()
    if (adminMembership) {
      canEdit = true
    }
  }

  // Get download URL
  const { data: { signedUrl } } = await supabase.storage
    .from('research-documents')
    .createSignedUrl(document.file_path, 3600) // 1 hour expiry

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(0)} KB`
    }
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/research" className="text-sm text-gray-700 hover:text-gray-900">
              ← Research Library
            </Link>
            {signedUrl && (
              <a
                href={signedUrl}
                download={document.file_name}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {document.title}
              </h1>
              {document.research_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {document.research_type}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {document.description}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
            {/* Organization */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Organization
              </h3>
              <Link
                href={`/organizations/${document.organization.slug}`}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {document.organization.name}
              </Link>
            </div>

            {/* Authors */}
            {document.authors && document.authors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Authors
                </h3>
                <p className="text-gray-900">
                  {document.authors.join(', ')}
                </p>
              </div>
            )}

            {/* Publication Year */}
            {document.publication_year && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Publication Year
                </h3>
                <p className="text-gray-900">{document.publication_year}</p>
              </div>
            )}

            {/* File Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                File Information
              </h3>
              <p className="text-gray-900">
                {document.file_name}
                <span className="text-gray-500 ml-2">
                  ({formatFileSize(document.file_size_bytes)})
                </span>
              </p>
            </div>

            {/* Visibility */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Visibility
              </h3>
              <p className="text-gray-900 capitalize">{document.visibility_level}</p>
            </div>

            {/* Uploaded */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Uploaded
              </h3>
              <p className="text-gray-900">
                {new Date(document.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {document.uploaded_by && (
                <p className="text-sm text-gray-500">
                  by {document.uploaded_by.full_name}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/research?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {document.topics && document.topics.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.topics.map((topic: string) => (
                  <Link
                    key={topic}
                    href={`/research?topic=${encodeURIComponent(topic)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Edit/Delete Actions */}
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Related Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            More from {document.organization.name}
          </h2>
          <Link
            href={`/organizations/${document.organization.slug}/research`}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            View all research from this organization →
          </Link>
        </div>
      </main>
    </div>
  )
}
