'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole, Json } from '@skillset360/types'

const ALLOWED_ROLES: UserRole[] = ['coach', 'selector']

export async function completeOnboarding(formData: FormData): Promise<void> {
  const role = formData.get('role') as string

  if (!ALLOWED_ROLES.includes(role as UserRole)) {
    redirect('/onboarding?error=Seleccioná+un+rol+válido')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('profiles')
    .update({
      primary_role: role,
      metadata: { onboarding_completed: true } as Json,
    })
    .eq('id', user.id)

  redirect('/dashboard')
}
