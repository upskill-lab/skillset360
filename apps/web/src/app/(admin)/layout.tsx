import { RoleGate } from '@/components/auth/role-gate'
import { AdminSidebar } from './_components/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="admin" fallback={null}>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </RoleGate>
  )
}
