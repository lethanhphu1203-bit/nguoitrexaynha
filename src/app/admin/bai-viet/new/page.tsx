import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import BaiVietForm from '../BaiVietForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewBaiVietPage() {
  const { data: danhMucs } = await supabaseAdmin
    .from('danh_muc')
    .select('id, ten')
    .in('loai', ['bai-viet', 'chung'])
    .order('thu_tu')

  return (
    <>
      <AdminHeader
        title="Tạo bài viết mới"
        actions={
          <Link href="/admin/bai-viet" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} /> Quay lại
          </Link>
        }
      />
      <BaiVietForm danhMucs={danhMucs || []} />
    </>
  )
}
