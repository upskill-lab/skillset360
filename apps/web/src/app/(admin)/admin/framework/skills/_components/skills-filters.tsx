'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback } from 'react'

interface Dimension {
  id: string
  name: string
}

export function SkillsFilters({ dimensions }: { dimensions: Dimension[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="mb-4 flex gap-3">
      <Input
        placeholder="Buscar skill..."
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => update('q', e.target.value)}
        className="max-w-xs"
      />
      <Select
        defaultValue={searchParams.get('dimension') ?? undefined}
        onValueChange={(v) => update('dimension', !v || v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Todas las dimensiones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las dimensiones</SelectItem>
          {dimensions.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
