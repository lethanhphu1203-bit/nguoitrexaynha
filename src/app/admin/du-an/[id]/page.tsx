import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import DuAnForm from '../DuAnForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditDuAnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: duAn }, { data: danhMucs }] = await Promise.all([
    supabaseAdmin.from('du_an').select('*').eq('id', id).single(),
    supabaseAdmin.from('danh_muc').select('id, ten').in('loai', ['du-an', 'chung']).order('thu_tu'),
  ])

  if (!duAn) notFound()

  return (
    <>
      <AdminHeader
        title="Chỉnh sửa dự án"
        actions={
          <Link href="/admin/du-an" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} /> Quay lại
          </Link>
        }
      />
      <DuAnForm initial={duAn} danhMucs={danhMucs || []} />
    </>
  )
}
