import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import DanhMucManager from './DanhMucManager'

export default async function DanhMucPage() {
  const { data } = await supabaseAdmin.from('danh_muc').select('*').order('loai').order('thu_tu')

  return (
    <>
      <AdminHeader title="Danh mục" />
      <main className="flex-1 p-6">
        <DanhMucManager initialData={data || []} />
      </main>
    </>
  )
}
