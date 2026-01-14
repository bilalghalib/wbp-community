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
]

export async function updateSession(request: NextRequest) {
  // ... (rest of the setup code)
  
  // Check annual survey gate
  try {
    // We call a single RPC that handles all the logic (Season active? User completed? Org completed?)
    const { data: gateStatus, error: gateError } = await supabase
      .rpc('check_annual_survey_gate', { target_user_id: user.id })

    if (gateError) throw gateError;

    if (gateStatus?.is_blocked) {
      // Prevent infinite redirect if they are already on the survey page
      if (pathname === '/annual-survey') {
        return response
      }
      
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
