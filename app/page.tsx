import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Springboard</h1>
        <p className="text-lg mb-4">You&apos;re logged in as: {user.email}</p>
        <div className="mt-8 space-y-4">
          <a
            href="/dashboard"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
