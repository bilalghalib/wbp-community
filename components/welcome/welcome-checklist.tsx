'use client'

import Link from 'next/link'

type ChecklistProgress = {
  hasBackupAdmin: boolean
  hasInvitedTeam: boolean
  hasSharedPractitioner: boolean
  hasSharedResource: boolean
}

type Props = {
  organizationSlug: string
  progress: ChecklistProgress
}

export default function WelcomeChecklist({ organizationSlug, progress }: Props) {
  const items = [
    {
      id: 'backup_admin',
      label: 'Add a backup admin',
      description: 'In case you\'re unavailable',
      completed: progress.hasBackupAdmin,
      href: `/organizations/${organizationSlug}/members`,
    },
    {
      id: 'invite_team',
      label: 'Invite 2-3 team members',
      description: 'Build your organization\'s presence',
      completed: progress.hasInvitedTeam,
      href: `/organizations/${organizationSlug}/members`,
    },
    {
      id: 'share_practitioner',
      label: 'Share a practitioner you trust',
      description: 'Help others find support',
      completed: progress.hasSharedPractitioner,
      href: '/service-providers/new',
    },
    {
      id: 'share_resource',
      label: 'Upload a helpful resource',
      description: 'Toolkits, guides, or research',
      completed: progress.hasSharedResource,
      href: '/research/new',
    },
  ]

  const completedCount = items.filter(i => i.completed).length
  const totalCount = items.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-[#2C3E50]">First Steps Checklist</h2>
        <span className="text-sm text-gray-500">
          {completedCount} of {totalCount} complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              item.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                item.completed
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }`}
            >
              {item.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${item.completed ? 'text-green-700' : 'text-[#2C3E50]'}`}>
                {item.label}
              </p>
              <p className={`text-sm ${item.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {item.description}
              </p>
            </div>
            {!item.completed && (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        ))}
      </div>

      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl text-center">
          <p className="text-green-700 font-medium">
            Fantastic! You&apos;ve completed all the first steps.
          </p>
          <p className="text-sm text-green-600 mt-1">
            Your organization is off to a great start.
          </p>
        </div>
      )}
    </div>
  )
}
