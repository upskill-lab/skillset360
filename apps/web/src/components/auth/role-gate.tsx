import { redirect } from 'next/navigation'
import { getSession, getRole } from '@/lib/session'
import type { UserRole } from '@skillset360/types'

interface RoleGateProps {
  role: UserRole | UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export async function RoleGate({ role, children, fallback }: RoleGateProps) {
  const user = await getSession()
  if (!user) redirect('/login')

  const userRole = await getRole()
  const allowed = Array.isArray(role) ? role : [role]
  const hasRole = userRole !== null && allowed.includes(userRole)

  if (!hasRole) {
    if (fallback) return <>{fallback}</>
    redirect('/403')
  }

  return <>{children}</>
}
