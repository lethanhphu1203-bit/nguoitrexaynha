import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import MenuManager from './MenuManager'

export default async function MenuPage() {
  const { data } = await supabaseAdmin.from('menu_items').select('*').order('thu_tu')

  return (
    <>
      <AdminHeader title="Menu điều hướng" />
      <main className="flex-1 p-6">
        <MenuManager initialData={data || []} />
      </main>
    </>
  )
}
