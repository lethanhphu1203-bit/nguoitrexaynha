import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import BaiVietList from './BaiVietList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function BaiVietPage() {
  const { data } = await supabaseAdmin
    .from('bai_viet')
    .select('*, danh_muc(ten)')
    .order('created_at', { ascending: false })

  return (
    <>
      <AdminHeader
        title="Bài viết"
        actions={
          <Link
            href="/admin/bai-viet/new"
            className="flex items-center gap-2 bg-[#003629] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4d3e] transition-colors"
          >
            <Plus size={16} />
            Tạo bài viết
          </Link>
        }
      />
      <main className="flex-1 p-6">
        <BaiVietList initialData={data || []} />
      </main>
    </>
  )
}
