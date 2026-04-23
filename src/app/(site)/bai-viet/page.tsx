import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60
export const metadata = { title: 'Bài viết | Nguoi Tre Xay Nha' }

export default async function BaiVietSitePage() {
  const { data: items } = await supabaseAdmin
    .from('bai_viet')
    .select('id, tieu_de, slug, mo_ta, anh_dai_dien, tac_gia, published_at, danh_muc(ten)')
    .eq('trang_thai', 'xuat-ban')
    .order('published_at', { ascending: false })

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-medium text-[#003629] mb-10">Bài viết</h1>

        {(!items || items.length === 0) && (
          <p className="text-gray-400">Chưa có bài viết nào được đăng.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items || []).map((item: any) => (
            <Link key={item.id} href={`/bai-viet/${item.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-sm transition-shadow">
              {item.anh_dai_dien && (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={item.anh_dai_dien}
                    alt={item.tieu_de}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{item.danh_muc?.ten}</p>
                <h2 className="font-serif text-xl font-medium text-gray-900 leading-snug group-hover:text-[#003629] transition-colors">
                  {item.tieu_de}
                </h2>
                {item.mo_ta && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.mo_ta}</p>
                )}
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                  <span>{item.tac_gia}</span>
                  {item.published_at && (
                    <><span>·</span><span>{new Date(item.published_at).toLocaleDateString('vi-VN')}</span></>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
