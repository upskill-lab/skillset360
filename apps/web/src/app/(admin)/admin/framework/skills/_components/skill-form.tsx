'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface Dimension {
  id: string
  name: string
}

interface SkillFormProps {
  action: (formData: FormData) => Promise<void>
  dimensions: Dimension[]
  defaultValues?: { name?: string; slug?: string; dimension_id?: string; description?: string }
  submitLabel?: string
  error?: string
}

export function SkillForm({
  action,
  dimensions,
  defaultValues,
  submitLabel = 'Guardar',
  error,
}: SkillFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug)
  const [dimensionId, setDimensionId] = useState(defaultValues?.dimension_id ?? '')

  return (
    <form action={action} className="max-w-lg space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          onChange={(e) => {
            if (!slugManual) setSlug(slugify(e.target.value))
          }}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          required
          pattern="[a-z0-9-]+"
          onChange={(e) => {
            setSlugManual(true)
            setSlug(e.target.value)
          }}
        />
        <p className="text-xs text-gray-500">Solo letras minúsculas, números y guiones.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="dimension_id">Dimensión</Label>
        {/* Defensive hidden input ensures dimension_id is always submitted to FormData,
            regardless of Base UI Select implementation details. Controlled via state. */}
        <input type="hidden" name="dimension_id" value={dimensionId} />
        <Select value={dimensionId} onValueChange={(v) => setDimensionId(v ?? '')}>
          <SelectTrigger id="dimension_id" className="w-full">
            <SelectValue placeholder="Seleccioná una dimensión" />
          </SelectTrigger>
          <SelectContent>
            {dimensions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
        <a href="/admin/framework/skills" className={buttonVariants({ variant: 'ghost' })}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
