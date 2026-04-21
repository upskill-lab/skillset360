import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/session'
import { completeOnboarding } from '@/lib/actions/onboarding'

export default async function OnboardingPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  if ((profile.metadata as Record<string, unknown>)?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-semibold">Bienvenido/a a Skillset360°</h1>
      <p className="mb-8 text-sm text-gray-500">
        ¿Cuál es tu rol principal? Esto define cómo vas a usar la plataforma.
      </p>

      <form action={completeOnboarding} className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
          <input type="radio" name="role" value="coach" className="mt-1" required />
          <div>
            <p className="font-medium">Coach de desarrollo</p>
            <p className="text-sm text-gray-500">
              Acompaño a profesionales en su desarrollo de habilidades
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
          <input type="radio" name="role" value="selector" className="mt-1" />
          <div>
            <p className="font-medium">Seleccionador</p>
            <p className="text-sm text-gray-500">
              Evalúo candidatos y gestiono procesos de selección
            </p>
          </div>
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Comenzar
        </button>
      </form>
    </div>
  )
}
