import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const viTri = searchParams.get('vi_tri')

  let query = supabaseAdmin.from('banners').select('*').order('thu_tu')
  if (viTri) query = query.eq('vi_tri', viTri)

  const { data, error } = await query
  if (error) return err(error.message)
  return ok(data)
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('banners').insert(body).select().single()
  if (error) return err(error.message)
  return ok(data)
}
