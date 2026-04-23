import { supabaseAdmin } from '@/lib/supabase'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ data: menuHeader }, { data: menuFooter }, { data: cauHinh }] = await Promise.all([
    supabaseAdmin.from('menu_items').select('*').eq('vi_tri', 'header').eq('kich_hoat', true).order('thu_tu'),
    supabaseAdmin.from('menu_items').select('*').eq('vi_tri', 'footer').eq('kich_hoat', true).order('thu_tu'),
    supabaseAdmin.from('cau_hinh').select('khoa, gia_tri'),
  ])

  const config = Object.fromEntries((cauHinh || []).map((r: any) => [r.khoa, r.gia_tri]))

  return (
    <>
      <SiteHeader menu={menuHeader || []} config={config} />
      <main>{children}</main>
      <SiteFooter menu={menuFooter || []} config={config} />
    </>
  )
}
