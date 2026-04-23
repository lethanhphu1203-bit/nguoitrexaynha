import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const trangThai = searchParams.get('trang_thai')
  const danhMucId = searchParams.get('danh_muc_id')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('bai_viet')
    .select('*, danh_muc(ten, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (trangThai) query = query.eq('trang_thai', trangThai)
  if (danhMucId) query = query.eq('danh_muc_id', danhMucId)

  const { data, error, count } = await query
  if (error) return err(error.message)
  return ok({ data, total: count, page, limit })
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from('bai_viet')
    .insert(body)
    .select()
    .single()

  if (error) return err(error.message)
  return ok(data)
}
