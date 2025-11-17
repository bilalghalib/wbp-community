import Link from 'next/link'

type Document = {
  id: string
  title: string
  description: string | null
  file_name: string
  file_size_bytes: number | null
  publication_year: number | null
  authors: string[]
  tags: string[]
  topics: string[]
  research_type: string | null
  visibility_level: string
  created_at: string
  organization: {
    name: string
    slug: string
  } | null
}

export default function ResearchGrid({ documents }: { documents: Document[] }) {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(0)} KB`
    }
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/research/${doc.id}`}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col"
        >
          {/* Document Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {doc.title}
              </h3>
              {doc.research_type && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {doc.research_type}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {doc.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {doc.description}
            </p>
          )}

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {doc.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {tag}
                </span>
              ))}
              {doc.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{doc.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
            {/* Organization */}
            {doc.organization && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{doc.organization.name}</span>
              </div>
            )}

            {/* Authors */}
            {doc.authors && doc.authors.length > 0 && (
              <div className="text-xs text-gray-500">
                By {doc.authors.join(', ')}
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{doc.publication_year}</span>
              <span>{formatFileSize(doc.file_size_bytes)}</span>
            </div>

            {/* Upload Date */}
            <div className="text-xs text-gray-400">
              Added {new Date(doc.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
