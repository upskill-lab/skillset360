import { createClient } from '@supabase/supabase-js'
import type { Database } from '@skillset360/types'

// Service role client — NEVER expose to the browser, never use in Client Components.
// Only import this in Server Actions, Route Handlers, or server-only utilities.
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
