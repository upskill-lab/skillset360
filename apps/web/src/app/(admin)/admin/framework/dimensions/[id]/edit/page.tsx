import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateDimension } from '@/lib/actions/framework'
import { DimensionForm } from '../../_components/dimension-form'

export default async function EditDimensionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimension } = await supabase
    .from('dimensions')
    .select('id, name, slug, description')
    .eq('id', id)
    .single()

  if (!dimension) notFound()

  const action = updateDimension.bind(null, id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar dimensión</h1>
      <DimensionForm
        action={action}
        defaultValues={{
          name: dimension.name,
          slug: dimension.slug,
          description: dimension.description ?? undefined,
        }}
        submitLabel="Guardar cambios"
        error={error}
      />
    </div>
  )
}
