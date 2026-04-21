import { createClient } from '@supabase/supabase-js'
import type { Database } from '@skillset360/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service-role admin client — bypasses RLS for test setup
const adminClient = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export type TestRole = 'admin' | 'coach' | 'selector' | 'professional_dev' | 'professional_sel'

interface TestUser {
  id: string
  email: string
  client: ReturnType<typeof createClient<Database>>
}

const createdUserIds: string[] = []

export async function createTestUser(role: TestRole): Promise<TestUser> {
  const email = `test-${role}-${Date.now()}@skillset360.test`
  const password = 'TestPassword1'

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !data.user) throw new Error(`Failed to create test user: ${error?.message}`)

  const userId = data.user.id
  createdUserIds.push(userId)

  // Set primary_role (trigger creates the profile with default role)
  await adminClient.from('profiles').update({ primary_role: role }).eq('id', userId)

  // Create a user-scoped client authenticated as this user
  const userClient = createClient<Database>(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  )
  await userClient.auth.signInWithPassword({ email, password })

  return { id: userId, email, client: userClient }
}

// Returns a service-role client scoped to a specific user via RLS bypass header
export function asUser(userId: string) {
  return createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { 'x-custom-user-id': userId },
    },
  })
}

// Deletes all test users created in this test run
export async function resetTestUsers() {
  for (const id of createdUserIds) {
    await adminClient.auth.admin.deleteUser(id)
  }
  createdUserIds.length = 0
}
