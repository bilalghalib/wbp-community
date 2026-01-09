import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Wellbeing Project. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900">
              Community Guidelines & FAQ
            </Link>
            <Link href="/security-explained" className="text-sm text-gray-500 hover:text-gray-900">
              Security & Privacy
            </Link>
            <Link href="https://wellbeing-project.org" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
              The Wellbeing Project
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
