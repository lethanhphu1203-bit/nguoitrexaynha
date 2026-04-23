import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, ok, err } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return err('Không có file')

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const folder = (formData.get('folder') as string) || 'misc'
  const path = `${folder}/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabaseAdmin.storage
    .from('media')
    .upload(path, buffer, { contentType: file.type })

  if (error) return err(error.message)

  const { data: { publicUrl } } = supabaseAdmin.storage.from('media').getPublicUrl(path)
  return ok({ url: publicUrl, path })
}
