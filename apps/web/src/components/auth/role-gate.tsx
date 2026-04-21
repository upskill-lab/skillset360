import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/session'
import type { UserRole } from '@skillset360/types'

interface RoleGateProps {
  role: UserRole | UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export async function RoleGate({ role, children, fallback }: RoleGateProps) {
  const profile = await getProfile()

  if (!profile) redirect('/login')

  const allowed = Array.isArray(role) ? role : [role]
  const hasRole = allowed.includes(profile.primary_role as UserRole)

  if (!hasRole) {
    if (fallback) return <>{fallback}</>
    redirect('/403')
  }

  return <>{children}</>
}
