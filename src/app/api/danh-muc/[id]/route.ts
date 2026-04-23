import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('danh_muc').update(body).eq('id', id).select().single()
  if (error) return err(error.message)
  return ok(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const { error } = await supabaseAdmin.from('danh_muc').delete().eq('id', id)
  if (error) return err(error.message)
  return ok({ success: true })
}
