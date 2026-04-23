'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

function encodeError(msg: string) {
  return encodeURIComponent(msg)
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const DimensionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().optional(),
})

const SkillSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  dimension_id: z.string().uuid('Seleccioná una dimensión válida'),
  description: z.string().optional(),
})

// ─── Dimensions ─────────────────────────────────────────────────────────────

export async function createDimension(formData: FormData): Promise<void> {
  const result = DimensionSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(
      `/admin/framework/dimensions/new?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }
  const supabase = await createClient()
  const { error } = await supabase.from('dimensions').insert(result.data)
  if (error) {
    const msg = error.message.includes('unique')
      ? 'Ya existe una dimensión con ese slug.'
      : error.message
    redirect(`/admin/framework/dimensions/new?error=${encodeError(msg)}`)
  }
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

export async function updateDimension(id: string, formData: FormData): Promise<void> {
  const result = DimensionSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(
      `/admin/framework/dimensions/${id}/edit?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }
  const supabase = await createClient()
  const { error } = await supabase.from('dimensions').update(result.data).eq('id', id)
  if (error) {
    const msg = error.message.includes('unique')
      ? 'Ya existe una dimensión con ese slug.'
      : error.message
    redirect(`/admin/framework/dimensions/${id}/edit?error=${encodeError(msg)}`)
  }
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

export async function archiveDimension(id: string): Promise<void> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('dimension_id', id)
    .eq('is_archived', false)

  if (count && count > 0) {
    redirect(
      `/admin/framework/dimensions?error=${encodeError('No se puede archivar: la dimensión tiene skills activas.')}`,
    )
  }
  const { error } = await supabase.from('dimensions').update({ is_archived: true }).eq('id', id)
  if (error) redirect(`/admin/framework/dimensions?error=${encodeError(error.message)}`)
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export async function createSkill(formData: FormData): Promise<void> {
  const result = SkillSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    dimension_id: formData.get('dimension_id'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(
      `/admin/framework/skills/new?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }
  const supabase = await createClient()
  const { data: skill, error } = await supabase
    .from('skills')
    .insert(result.data)
    .select('id')
    .single()
  if (error) {
    const msg = error.message.includes('unique')
      ? 'Ya existe una skill con ese slug.'
      : error.message
    redirect(`/admin/framework/skills/new?error=${encodeError(msg)}`)
  }
  // Crear los 5 niveles vacíos
  const levels = ([1, 2, 3, 4, 5] as const).map((n) => ({
    skill_id: skill.id,
    level: n,
    observable_behaviors: '',
  }))
  const { error: levelsError } = await supabase.from('skill_levels').insert(levels)
  if (levelsError) {
    await supabase.from('skills').delete().eq('id', skill.id)
    redirect(
      `/admin/framework/skills/new?error=${encodeError('Error al crear niveles de la skill.')}`,
    )
  }
  revalidatePath('/admin/framework/skills')
  redirect(`/admin/framework/skills/${skill.id}`)
}

export async function updateSkill(id: string, formData: FormData): Promise<void> {
  const result = SkillSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    dimension_id: formData.get('dimension_id'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(
      `/admin/framework/skills/${id}?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }
  const supabase = await createClient()
  const { error } = await supabase.from('skills').update(result.data).eq('id', id)
  if (error) {
    const msg = error.message.includes('unique')
      ? 'Ya existe una skill con ese slug.'
      : error.message
    redirect(`/admin/framework/skills/${id}?error=${encodeError(msg)}`)
  }
  revalidatePath(`/admin/framework/skills/${id}`)
  redirect(`/admin/framework/skills/${id}`)
}

export async function archiveSkill(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').update({ is_archived: true }).eq('id', id)
  if (error) redirect(`/admin/framework/skills/${id}?error=${encodeError(error.message)}`)
  revalidatePath('/admin/framework/skills')
  redirect('/admin/framework/skills')
}

// ─── Skill Levels ────────────────────────────────────────────────────────────

export async function updateSkillLevels(formData: FormData): Promise<void> {
  const skillId = String(formData.get('skill_id') ?? '')
  if (!skillId || !z.string().uuid().safeParse(skillId).success) {
    redirect(`/admin/framework/skills?error=${encodeError('Skill inválida')}`)
  }

  const levels = ([1, 2, 3, 4, 5] as const).map((n) => ({
    skill_id: skillId,
    level: n,
    observable_behaviors: String(formData.get(`level_${n}`) ?? ''),
  }))

  const supabase = await createClient()
  const { error } = await supabase
    .from('skill_levels')
    .upsert(levels, { onConflict: 'skill_id,level' })

  if (error) redirect(`/admin/framework/skills/${skillId}?error=${encodeError(error.message)}`)
  revalidatePath(`/admin/framework/skills/${skillId}`)
  redirect(`/admin/framework/skills/${skillId}?success=1`)
}
