import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const loai = searchParams.get('loai')

  let query = supabaseAdmin.from('danh_muc').select('*').order('thu_tu')
  if (loai) query = query.or(`loai.eq.${loai},loai.eq.chung`)

  const { data, error } = await query
  if (error) return err(error.message)
  return ok(data)
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('danh_muc').insert(body).select().single()
  if (error) return err(error.message)
  return ok(data)
}
