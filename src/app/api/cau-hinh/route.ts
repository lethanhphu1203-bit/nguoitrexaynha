import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('cau_hinh').select('*').order('nhom')
  if (error) return err(error.message)
  // Trả về dạng object { khoa: gia_tri }
  const config = Object.fromEntries(data.map((r: any) => [r.khoa, r.gia_tri]))
  return ok({ data, config })
}

export async function PUT(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { updates } = await req.json() // [{ khoa, gia_tri }]
  const promises = updates.map((u: any) =>
    supabaseAdmin.from('cau_hinh').update({ gia_tri: u.gia_tri }).eq('khoa', u.khoa)
  )
  await Promise.all(promises)
  return ok({ success: true })
}
