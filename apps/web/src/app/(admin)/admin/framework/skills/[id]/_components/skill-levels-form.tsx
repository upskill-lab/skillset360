'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSkillLevels } from '@/lib/actions/framework'

interface Level {
  level: number
  observable_behaviors: string | null
}

const LEVEL_LABELS = ['', 'Inicial', 'En desarrollo', 'Competente', 'Avanzado', 'Experto']

export function SkillLevelsForm({ skillId, levels }: { skillId: string; levels: Level[] }) {
  const sortedLevels = [...levels].sort((a, b) => a.level - b.level)

  return (
    <form action={updateSkillLevels} className="space-y-4">
      <input type="hidden" name="skill_id" value={skillId} />
      {sortedLevels.map((lvl) => (
        <Card key={lvl.level}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">
              Nivel {lvl.level} — {LEVEL_LABELS[lvl.level]}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Label htmlFor={`level_${lvl.level}`} className="sr-only">
              Comportamientos observables nivel {lvl.level}
            </Label>
            <Textarea
              id={`level_${lvl.level}`}
              name={`level_${lvl.level}`}
              defaultValue={lvl.observable_behaviors ?? ''}
              rows={4}
              placeholder="Describí los comportamientos observables para este nivel..."
            />
          </CardContent>
        </Card>
      ))}
      <Button type="submit">Guardar niveles</Button>
    </form>
  )
}
