import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { updateSkill } from '@/lib/actions/framework'
import { SkillForm } from '../_components/skill-form'
import { SkillLevelsForm } from './_components/skill-levels-form'
import { ArchiveSkillButton } from './_components/archive-skill-button'
import { buttonVariants } from '@/components/ui/button'

export default async function SkillDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { id } = await params
  const { error, success } = await searchParams
  const supabase = await createClient()

  const { data: skill } = await supabase
    .from('skills')
    .select('id, name, slug, description, is_archived, dimension_id, dimensions(name)')
    .eq('id', id)
    .single()

  if (!skill) notFound()

  const { data: levels } = await supabase
    .from('skill_levels')
    .select('level, observable_behaviors')
    .eq('skill_id', id)
    .order('level')

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  const dimName = Array.isArray(skill.dimensions)
    ? skill.dimensions[0]?.name
    : (skill.dimensions as { name: string } | null)?.name

  const updateSkillWithId = updateSkill.bind(null, id)

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{skill.name}</h1>
            <Badge variant={skill.is_archived ? 'secondary' : 'default'}>
              {skill.is_archived ? 'Archivada' : 'Activa'}
            </Badge>
          </div>
          {dimName && <p className="mt-1 text-sm text-gray-500">{dimName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/framework/skills"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            ← Volver
          </Link>
          {!skill.is_archived && <ArchiveSkillButton id={id} />}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Niveles guardados correctamente.
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-medium">Datos generales</h2>
        <SkillForm
          action={updateSkillWithId}
          dimensions={dimensions ?? []}
          defaultValues={{
            name: skill.name,
            slug: skill.slug,
            description: skill.description ?? undefined,
            dimension_id: skill.dimension_id,
          }}
          submitLabel="Guardar cambios"
          error={undefined}
        />
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="mb-4 text-lg font-medium">Comportamientos observables por nivel</h2>
        <SkillLevelsForm skillId={id} levels={levels ?? []} />
      </section>
    </div>
  )
}
