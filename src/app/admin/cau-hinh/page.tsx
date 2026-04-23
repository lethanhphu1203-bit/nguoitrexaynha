import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import CauHinhForm from './CauHinhForm'

export default async function CauHinhPage() {
  const { data } = await supabaseAdmin.from('cau_hinh').select('*').order('nhom')

  return (
    <>
      <AdminHeader title="Cấu hình website" />
      <main className="flex-1 p-6">
        <CauHinhForm initialData={data || []} />
      </main>
    </>
  )
}
