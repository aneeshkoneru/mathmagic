import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if we're in a build environment (no env vars available)
  const isBuildTime = !supabaseUrl || !supabaseAnonKey

  if (isBuildTime) {
    // During build, use placeholder values to allow build to complete
    // The actual values must be set in Vercel environment variables
    supabaseClient = createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    )
    return supabaseClient
  }

  // At runtime, use actual values
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Export a proxy that lazily creates the client (for backward compatibility)
// This only creates the client when actually used, not during module load
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = client[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})

