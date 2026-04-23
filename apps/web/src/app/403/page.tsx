export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">403</h1>
        <p className="mt-2 text-gray-600">No tenés permisos para acceder a esta sección.</p>
        <a href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Ir al dashboard
        </a>
      </div>
    </div>
  )
}
