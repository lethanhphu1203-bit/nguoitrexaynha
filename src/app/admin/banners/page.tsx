import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import BannerManager from './BannerManager'

export default async function BannersPage() {
  const { data } = await supabaseAdmin.from('banners').select('*').order('thu_tu')

  return (
    <>
      <AdminHeader title="Banners" />
      <main className="flex-1 p-6">
        <BannerManager initialData={data || []} />
      </main>
    </>
  )
}
