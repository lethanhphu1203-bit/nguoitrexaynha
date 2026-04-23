import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60
export const metadata = { title: 'Dự án | Nguoi Tre Xay Nha' }

export default async function DuAnSitePage() {
  const { data: _items } = await supabaseAdmin
    .from('du_an')
    .select('id, ten, slug, mo_ta, anh_dai_dien, quan_huyen, thanh_pho, gia_tu, trang_thai, danh_muc(ten)')
    .in('trang_thai', ['xuat-ban', 'hoan-thanh'])
    .order('thu_tu')
  const items = _items as any[]

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-medium text-[#003629] mb-10">Dự án</h1>

        {(!items || items.length === 0) && (
          <p className="text-gray-400">Chưa có dự án nào.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items || []).map((item: any) => (
            <Link key={item.id} href={`/du-an/${item.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3">
                {item.anh_dai_dien ? (
                  <Image
                    src={item.anh_dai_dien}
                    alt={item.ten}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{item.danh_muc?.ten}</p>
                  <h2 className="font-serif text-xl font-medium text-[#003629] group-hover:underline leading-snug">
                    {item.ten}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                  </p>
                </div>
                {item.gia_tu && (
                  <span className="shrink-0 text-xs bg-[#fddba7] text-[#785f35] px-2 py-1 rounded-full whitespace-nowrap">
                    Từ {item.gia_tu}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
