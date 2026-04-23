import { createDimension } from '@/lib/actions/framework'
import { DimensionForm } from '../_components/dimension-form'

export default async function NewDimensionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva dimensión</h1>
      <DimensionForm action={createDimension} submitLabel="Crear dimensión" error={error} />
    </div>
  )
}
