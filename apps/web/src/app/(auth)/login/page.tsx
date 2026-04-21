import { signIn, signInWithGoogle } from '@/lib/actions/auth'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { error, next } = await searchParams

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Iniciar sesión</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={signIn} className="space-y-4">
        <input type="hidden" name="next" value={next ?? '/dashboard'} />
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
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>

      <div className="my-4 flex items-center gap-2">
        <div className="flex-1 border-t" />
        <span className="text-sm text-gray-400">o</span>
        <div className="flex-1 border-t" />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next ?? '/dashboard'} />
        <button
          type="submit"
          className="w-full rounded-md border px-4 py-2 transition-colors hover:bg-gray-50"
        >
          Continuar con Google
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tenés cuenta?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Registrate
        </a>
      </p>
      <p className="mt-2 text-center text-sm">
        <a href="/forgot-password" className="text-xs text-gray-500 hover:underline">
          Olvidé mi contraseña
        </a>
      </p>
    </div>
  )
}
