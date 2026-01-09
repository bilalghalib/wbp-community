import Link from 'next/link'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Community Guidelines & FAQ</h1>
          <p className="mt-4 text-lg text-gray-500">
            Welcome to the Springboard community. We are here to support your journey.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Community Expectations</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">A Shared Responsibility</h3>
              <p className="mt-2 text-gray-600">
                Springboard is a platform designed to connect you with peers, coaches, and resources. 
                While we facilitate these connections, the journey you take together is yours to navigate. 
                We encourage you to trust your instincts and ensure that any practitioner or peer you engage with 
                is the right fit for your personal needs.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Disclaimer of Liability</h3>
              <p className="mt-2 text-gray-600">
                The Wellbeing Project (TWP) provides this directory and platform as a resource for connection. 
                We do not directly oversee, monitor, or supervise individual sessions, coaching interactions, or peer dialogues. 
                Any outcomes, agreements, or experiences resulting from these connections are the sole responsibility of the participants. 
                TWP is not liable for any negative or unhelpful experiences that may arise from these interactions.
              </p>
            </div>

             <div>
              <h3 className="text-lg font-medium text-gray-900">Safe Spaces</h3>
              <p className="mt-2 text-gray-600">
                We are committed to maintaining a safe, respectful, and supportive environment. 
                If you encounter behavior that violates our core values of respect and integrity, 
                please let us know immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">How do I verify a practitioner's credentials?</h3>
              <p className="mt-2 text-gray-600">
                 Many practitioners listed on Springboard are vetted members of our network. However, we always recommend asking about their specific qualifications, certifications, and experience during your initial conversation to ensure they align with what you are looking for.
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">What if I have a conflict with another member?</h3>
              <p className="mt-2 text-gray-600">
                We encourage open and respectful communication to resolve conflicts. If a resolution cannot be reached or if you feel unsafe, please contact our support team for guidance.
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Who can see my data?</h3>
              <p className="mt-2 text-gray-600">
                Your privacy is paramount. Only information you explicitly choose to share on your profile is visible to other network members. We do not sell your data to third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
