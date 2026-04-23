import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

// Public: nhận form liên hệ
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { ho_ten, email, so_dien_thoai, chu_de, noi_dung } = body

  if (!ho_ten || !noi_dung) return err('Thiếu thông tin bắt buộc')

  const { data, error } = await supabaseAdmin
    .from('lien_he')
    .insert({ ho_ten, email, so_dien_thoai, chu_de, noi_dung })
    .select()
    .single()

  if (error) return err(error.message)
  return ok({ success: true, id: data.id })
}

// Admin: xem danh sách liên hệ
export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const daDoc = searchParams.get('da_doc')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('lien_he')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (daDoc !== null) query = query.eq('da_doc', daDoc === 'true')

  const { data, error, count } = await query
  if (error) return err(error.message)
  return ok({ data, total: count, page })
}
