'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type ResearchFiltersProps = {
  allTags: string[]
  allTopics: string[]
}

export default function ResearchFilters({ allTags, allTopics }: ResearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTag = searchParams.get('tag') || ''
  const currentTopic = searchParams.get('topic') || ''
  const currentSearch = searchParams.get('search') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/research?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* Search */}
      <div className="flex-1 min-w-64">
        <form action="/research" method="get">
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search research..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div>
          <select
            value={currentTag}
            onChange={(e) => updateFilter('tag', e.target.value)}
            className="block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Topic Filter */}
      {allTopics.length > 0 && (
        <div>
          <select
            value={currentTopic}
            onChange={(e) => updateFilter('topic', e.target.value)}
            className="block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All topics</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
