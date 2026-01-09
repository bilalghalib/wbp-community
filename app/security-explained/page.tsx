import MermaidDiagram from '@/components/mermaid-diagram'
import Link from 'next/link'

export default function SecurityExplainedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">How We Keep You Safe</h1>
          <p className="text-xl text-gray-600">
            A simple guide to privacy, security, and trust on Springboard.
          </p>
        </div>

        {/* Section 1: The Core Promise */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Our Core Promise</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Your trust is our most valuable asset. We believe that for you to be truly open about your wellbeing, 
            you need to know exactly where your data goes—and where it doesn't.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-bold text-blue-900 mb-2">We Do</h3>
              <ul className="list-disc pl-5 text-blue-800 space-y-1">
                <li>Protect your privacy and dignity</li>
                <li>Be transparent about what we collect</li>
                <li>Use data <i>only</i> to strengthen the community</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <h3 className="font-bold text-red-900 mb-2">We Do Not</h3>
              <ul className="list-disc pl-5 text-red-800 space-y-1">
                <li>Collect information we don't need</li>
                <li>Track your individual clicks or search history</li>
                <li>Sell your data to anyone</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Surveys & The "Blender" */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Surveys: The "Blender" Approach</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            When you take a survey, your answers are confidential. Think of it like a blender: we take answers from many people 
            and mix them together. We only look at the "smoothie" (the trends), never the individual ingredients (your specific answers).
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
            <li>We <strong>never</strong> look at a single person's survey responses.</li>
            <li>We only create reports if there are <strong>at least 7 people</strong> in the group.</li>
            <li>If a group is too small, we don't show any data at all to protect your identity.</li>
          </ul>
          
          <div className="my-8">
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">How Anonymity Works</h3>
            <MermaidDiagram chart={`
              graph LR
                U1[You] -->|Secure| V[Secure Vault]
                U2[Peer] -->|Secure| V
                U3[Colleague] -->|Secure| V
                V -->|Mix & Anonymize| B{The Blender}
                B -->|Aggregate Trends| R[Group Report]
                R -->|View| A[Org Admin]
                
                style V fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
                style B fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
                style R fill:#fff7ed,stroke:#ea580c,stroke-width:2px
            `} />
          </div>
        </section>

        {/* Section 3: Visibility Levels */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Who Sees What?</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Different information has different levels of visibility. We strictly separate what is public, what is for your team, 
            and what is strictly for you.
          </p>
          
          <div className="my-8">
            <MermaidDiagram chart={`
              graph TD
                subgraph "Public Network"
                  P1[Practitioner Names]
                  P2[Practitioner Bios]
                end
                
                subgraph "Your Organization"
                  O1[Team Resources]
                  O2[Internal Research]
                  O3[Group Survey Trends]
                end
                
                subgraph "Strictly Private (NO ONE SEES)"
                  S1[Your Survey Answers]
                  S2[Your Search History]
                  S3[Your Drafts]
                end
                
                style S1 fill:#fecaca,stroke:#dc2626
                style S2 fill:#fecaca,stroke:#dc2626
                style S3 fill:#fecaca,stroke:#dc2626
                style O1 fill:#fef08a,stroke:#ca8a04
                style O2 fill:#fef08a,stroke:#ca8a04
                style O3 fill:#fef08a,stroke:#ca8a04
            `} />
          </div>
        </section>

        {/* Section 4: Roles & Permissions */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Roles & Permissions</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900">Community Users (You)</h3>
              <p className="text-gray-600">
                You can access resources, take surveys, and explore the network. Your email is stored separately from your 
                survey data, so they cannot be linked back to you.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900">Practitioners (Coaches/Therapists)</h3>
              <p className="text-gray-600">
                You have a public profile with your bio and contact info. You can share resources but cannot see 
                internal organization data.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900">TWP Admins</h3>
              <p className="text-gray-600">
                We manage the platform's health. We can see high-level stats (like "50 surveys taken today") but 
                <strong> never</strong> individual responses. We can help manage accounts but cannot snoop on your activity.
              </p>
            </div>
          </div>
        </section>
        
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Based on the "Springboard Confidentiality and Security Considerations" document.</p>
          <p className="mt-2">Questions? Contact security@wellbeingproject.org</p>
        </div>
      </div>
    </div>
  )
}
