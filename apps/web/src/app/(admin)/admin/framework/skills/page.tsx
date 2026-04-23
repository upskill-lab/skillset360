import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SkillsFilters } from './_components/skills-filters'
import { buttonVariants } from '@/components/ui/button'

const PAGE_SIZE = 20

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; dimension?: string; page?: string; error?: string }>
}) {
  const { q, dimension, page: pageStr, error } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('skills')
    .select('id, slug, name, is_archived, dimension_id, dimensions(name)', { count: 'exact' })
    .order('name')
    .range(from, to)

  if (q) query = query.ilike('name', `%${q}%`)
  if (dimension) query = query.eq('dimension_id', dimension)

  const { data: skills, count } = await query

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link href="/admin/framework/skills/new" className={buttonVariants()}>
          + Nueva skill
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <SkillsFilters dimensions={dimensions ?? []} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Dimensión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(skills ?? []).map((skill) => (
            <TableRow key={skill.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="font-medium">
                <Link href={`/admin/framework/skills/${skill.id}`} className="hover:underline">
                  {skill.name}
                </Link>
              </TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{skill.slug}</TableCell>
              <TableCell>
                {Array.isArray(skill.dimensions)
                  ? skill.dimensions[0]?.name
                  : ((skill.dimensions as { name: string } | null)?.name ?? '—')}
              </TableCell>
              <TableCell>
                <Badge variant={skill.is_archived ? 'secondary' : 'default'}>
                  {skill.is_archived ? 'Archivada' : 'Activa'}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/framework/skills/${skill.id}`}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Ver
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {from + 1}–{Math.min(to + 1, count ?? 0)} de {count}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?${new URLSearchParams({ ...(q ? { q } : {}), ...(dimension ? { dimension } : {}), page: String(page - 1) })}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                ← Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?${new URLSearchParams({ ...(q ? { q } : {}), ...(dimension ? { dimension } : {}), page: String(page + 1) })}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
