import { createClient } from '@/lib/supabase/server'
import { createSkill } from '@/lib/actions/framework'
import { SkillForm } from '../_components/skill-form'

export default async function NewSkillPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva skill</h1>
      <SkillForm
        action={createSkill}
        dimensions={dimensions ?? []}
        submitLabel="Crear skill"
        error={error}
      />
    </div>
  )
}
