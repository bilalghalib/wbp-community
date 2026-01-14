import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Routes that are always accessible, even when the annual survey gate is active
const ALLOWED_WHILE_GATED = [
  '/annual-survey', // The survey itself
  '/logout',        // Allow logging out
  '/login',         // Auth routes
  '/signup',
  '/auth/',         // Sub-auth routes (callback, etc)
  '/support',       // Help/Support
  '/api/',          // API routes needed for the survey/app functionality
  '/admin/',        // WBP admins need to manage the platform
  '/_next/',        // Next.js internal files
  '/favicon.ico',
  '/accept-invite', // Allow accepting invitations
  '/welcome-admin', // Welcome page for new admins
]

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // If not logged in or on an allowed route, skip gate check
  if (!user || ALLOWED_WHILE_GATED.some(route => pathname.startsWith(route))) {
    return response
  }

  // Check annual survey gate
  try {
    // We call a single RPC that handles all the logic (Season active? User completed? Org completed?)
    const { data: gateStatus, error: gateError } = await supabase
      .rpc('check_annual_survey_gate', { target_user_id: user.id })

    if (gateError) throw gateError;

    if (gateStatus?.is_blocked) {
      // Redirect to annual survey
      const redirectUrl = new URL('/annual-survey', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    // FAIL OPEN STRATEGY:
    // If the gate check fails (e.g., database connection issue, RPC missing),
    // we prefer letting the user in rather than locking them out of the entire platform.
    console.error('Annual Survey Gate check error:', error)
  }

  return response
}
