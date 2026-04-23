import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import BaiVietForm from '../BaiVietForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditBaiVietPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: baiViet }, { data: danhMucs }] = await Promise.all([
    supabaseAdmin.from('bai_viet').select('*').eq('id', id).single(),
    supabaseAdmin.from('danh_muc').select('id, ten').in('loai', ['bai-viet', 'chung']).order('thu_tu'),
  ])

  if (!baiViet) notFound()

  return (
    <>
      <AdminHeader
        title="Chỉnh sửa bài viết"
        actions={
          <Link href="/admin/bai-viet" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} /> Quay lại
          </Link>
        }
      />
      <BaiVietForm initial={baiViet} danhMucs={danhMucs || []} />
    </>
  )
}
