import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase admin client with secret key (elevated privileges)
 * 
 * Uses the new Supabase API key system (sb_secret_...) or legacy service_role key
 * 
 * Use this ONLY for server-side admin operations that require elevated privileges
 * NEVER expose this client to the browser - secret keys are forbidden in browsers
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Prefer new format (SUPABASE_SECRET_KEY) over legacy (SUPABASE_SERVICE_ROLE_KEY)
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }

  if (!secretKey) {
    throw new Error(
      'SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY for legacy) is not set. ' +
      'Please add it to your .env.local file. ' +
      'Get it from Supabase Dashboard → Settings → API → Secret key (sb_secret_...)'
    )
  }

  // Validate the key format
  if (!secretKey.startsWith('sb_secret_') && !secretKey.startsWith('eyJ')) {
    console.warn(
      'API key format looks unusual. ' +
      'New Supabase keys should start with "sb_secret_". ' +
      'Legacy keys start with "eyJ". ' +
      'Make sure you copied the Secret key, not the Publishable key.'
    )
  }

  return createClient<Database>(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

