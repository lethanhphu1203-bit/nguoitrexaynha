import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const trangThai = searchParams.get('trang_thai')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('du_an')
    .select('*, danh_muc(ten, slug)', { count: 'exact' })
    .order('thu_tu', { ascending: true })
    .range(offset, offset + limit - 1)

  if (trangThai) query = query.eq('trang_thai', trangThai)

  const { data, error, count } = await query
  if (error) return err(error.message)
  return ok({ data, total: count, page, limit })
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('du_an').insert(body).select().single()
  if (error) return err(error.message)
  return ok(data)
}
