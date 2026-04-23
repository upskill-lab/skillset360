'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface DimensionFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: { name?: string; slug?: string; description?: string }
  submitLabel?: string
  error?: string
}

export function DimensionForm({
  action,
  defaultValues,
  submitLabel = 'Guardar',
  error,
}: DimensionFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug)

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
        <a href="/admin/framework/dimensions" className={buttonVariants({ variant: 'ghost' })}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
