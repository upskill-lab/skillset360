'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { archiveDimension } from '@/lib/actions/framework'

interface Props {
  id: string
  hasActiveSkills: boolean
}

export function ArchiveDimensionButton({ id, hasActiveSkills }: Props) {
  if (hasActiveSkills) {
    return (
      <Button variant="ghost" size="sm" disabled title="Tiene skills activas — archivalas primero">
        Archivar
      </Button>
    )
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        Archivar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Archivar dimensión?</AlertDialogTitle>
          <AlertDialogDescription>
            La dimensión dejará de aparecer en el flujo activo. Se puede reactivar en cualquier
            momento editándola.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => archiveDimension(id)}>Archivar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
