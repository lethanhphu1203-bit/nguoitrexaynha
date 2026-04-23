import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import DuAnForm from '../DuAnForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewDuAnPage() {
  const { data: danhMucs } = await supabaseAdmin
    .from('danh_muc')
    .select('id, ten')
    .in('loai', ['du-an', 'chung'])
    .order('thu_tu')

  return (
    <>
      <AdminHeader
        title="Thêm dự án mới"
        actions={
          <Link href="/admin/du-an" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} /> Quay lại
          </Link>
        }
      />
      <DuAnForm danhMucs={danhMucs || []} />
    </>
  )
}
