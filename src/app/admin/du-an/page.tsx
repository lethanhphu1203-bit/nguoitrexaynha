import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import DuAnList from './DuAnList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DuAnPage() {
  const { data } = await supabaseAdmin
    .from('du_an')
    .select('*, danh_muc(ten)')
    .order('thu_tu', { ascending: true })

  return (
    <>
      <AdminHeader
        title="Dự án"
        actions={
          <Link
            href="/admin/du-an/new"
            className="flex items-center gap-2 bg-[#003629] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4d3e] transition-colors"
          >
            <Plus size={16} />
            Thêm dự án
          </Link>
        }
      />
      <main className="flex-1 p-6">
        <DuAnList initialData={data || []} />
      </main>
    </>
  )
}
