import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArchiveDimensionButton } from './_components/archive-dimension-button'

export default async function DimensionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, slug, name, is_archived, sort_order')
    .order('sort_order')

  const { data: activeSkills } = await supabase
    .from('skills')
    .select('dimension_id')
    .eq('is_archived', false)

  const activeCountByDim = (activeSkills ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.dimension_id] = (acc[s.dimension_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dimensiones</h1>
        <Link href="/admin/framework/dimensions/new" className={buttonVariants()}>
          + Nueva dimensión
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Skills activas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(dimensions ?? []).map((dim) => (
            <TableRow key={dim.id}>
              <TableCell className="font-medium">{dim.name}</TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{dim.slug}</TableCell>
              <TableCell>{activeCountByDim[dim.id] ?? 0}</TableCell>
              <TableCell>
                <Badge variant={dim.is_archived ? 'secondary' : 'default'}>
                  {dim.is_archived ? 'Archivada' : 'Activa'}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Link
                  href={`/admin/framework/dimensions/${dim.id}/edit`}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Editar
                </Link>
                <ArchiveDimensionButton
                  id={dim.id}
                  hasActiveSkills={(activeCountByDim[dim.id] ?? 0) > 0}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
