import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Routes that are always accessible, even when gated
const ALLOWED_WHILE_GATED = [
  '/annual-survey',
  '/logout',
  '/login',
  '/signup',
  '/support',
  '/api/',
  '/admin/', // WBP admins can always access admin
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

  const { data: { user } } = await supabase.auth.getUser()

  // No user = let normal auth flow handle it
  if (!user) {
    return response
  }

  // Check if route is in the always-allowed list
  const pathname = request.nextUrl.pathname
  const isAllowedRoute = ALLOWED_WHILE_GATED.some(route =>
    pathname.startsWith(route)
  )

  if (isAllowedRoute) {
    return response
  }

  // Check annual survey gate
  try {
    const { data: gateStatus } = await supabase
      .rpc('check_annual_survey_gate', { target_user_id: user.id })

    if (gateStatus?.is_blocked) {
      // Redirect to annual survey
      const redirectUrl = new URL('/annual-survey', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    // If function doesn't exist or errors, allow access (fail open)
    console.error('Gate check error:', error)
  }

  return response
}
