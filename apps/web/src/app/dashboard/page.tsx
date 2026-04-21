import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/session'
import { signOut } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile.full_name ?? profile.email} · {profile.primary_role}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="rounded-lg border bg-gray-50 p-8 text-center text-gray-400">
          Dashboard en construcción — E7
        </div>
      </div>
    </div>
  )
}
