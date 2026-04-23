import { NextResponse } from 'next/server'
import { getRole } from '@/lib/session'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const role = await getRole()
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = await createClient()

  const [{ data: dimensions }, { data: skills }, { data: levels }] = await Promise.all([
    supabase.from('dimensions').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('name'),
    supabase.from('skill_levels').select('*').order('skill_id, level'),
  ])

  const payload = {
    exported_at: new Date().toISOString(),
    dimensions,
    skills,
    levels,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="framework.json"',
    },
  })
}
