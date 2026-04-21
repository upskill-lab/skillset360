import { requestPasswordReset } from '@/lib/actions/auth'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-semibold">Recuperar contraseña</h1>
      <p className="mb-6 text-sm text-gray-500">
        Ingresá tu email y te enviamos un link para restablecer tu contraseña.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Si el email existe, te enviamos un link. Revisá tu bandeja de entrada.
        </div>
      )}

      <form action={requestPasswordReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Enviar link
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        <a href="/login" className="text-gray-500 hover:underline">
          Volver al login
        </a>
      </p>
    </div>
  )
}
