import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import LienHeList from './LienHeList'

export default async function LienHePage() {
  const { data } = await supabaseAdmin
    .from('lien_he')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <AdminHeader title="Liên hệ" />
      <main className="flex-1 p-6">
        <LienHeList initialData={data || []} />
      </main>
    </>
  )
}
