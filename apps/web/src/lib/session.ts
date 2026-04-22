import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile, UserRole } from '@skillset360/types'
import { createClient } from './supabase/server'

// Per-request cached — safe to call multiple times in a single RSC tree
export const getSession = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return data as Profile | null
})

// Reads the role from the JWT claims (injected by custom_access_token_hook).
// getUser() validates the token first; getSession() then reads the decoded claims.
// Role changes take effect on next token refresh (default: 1h).
export const getRole = cache(async (): Promise<UserRole | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (session?.user?.app_metadata?.role as UserRole) ?? null
})
