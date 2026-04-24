import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60
export const metadata = { title: 'Bài viết | Nguoi Tre Xay Nha' }

export default async function BaiVietSitePage() {
  const { data: _items } = await supabaseAdmin
    .from('bai_viet')
    .select('id, tieu_de, slug, mo_ta, anh_dai_dien, tac_gia, published_at, danh_muc(ten)')
    .eq('trang_thai', 'xuat-ban')
    .order('published_at', { ascending: false })
  const items = (_items || []) as any[]

  const featured = items[0]
  const subFeatured = items.slice(1, 4)
  const rest = items.slice(4)

  if (items.length === 0) {
    return (
      <div className="pt-[88px] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-20">
          <p className="text-[#404945]">Chưa có bài viết nào được đăng.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[88px] bg-[#f9f9f9]">

      {/* ── TIÊU ĐIỂM (Bento Featured) ── */}
      <section className="max-w-[1440px] mx-auto px-8 lg:px-12 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#735a31] font-bold tracking-[0.2em] text-xs uppercase block mb-2">TIN TỨC CHỌN LỌC</span>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#1a1c1c]">Bài Viết</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Featured large */}
          {featured && (
            <Link href={`/bai-viet/${featured.slug}`} className="col-span-12 lg:col-span-7 group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#eeeeee] mb-5">
                {featured.anh_dai_dien ? (
                  <Image src={featured.anh_dai_dien} alt={featured.tieu_de}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-[#1b4d3e]/20" />
                )}
                {featured.danh_muc && (
                  <div className="absolute top-5 left-5 bg-[#735a31] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    {featured.danh_muc.ten}
                  </div>
                )}
              </div>
              <div className="max-w-2xl">
                <p className="text-[#735a31] font-bold text-sm mb-3 uppercase tracking-wider">
                  {featured.published_at
                    ? new Date(featured.published_at).toLocaleDateString('vi-VN')
                    : 'Mới nhất'}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-3 group-hover:text-[#003629] transition-colors text-[#1a1c1c]">
                  {featured.tieu_de}
                </h2>
                {featured.mo_ta && (
                  <p className="text-[#404945] line-clamp-2 text-base leading-relaxed">{featured.mo_ta}</p>
                )}
                <div className="flex items-center gap-2 mt-4 text-xs text-[#707974]">
                  <span className="font-medium">{featured.tac_gia}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Right sub-featured */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {subFeatured.map((item: any) => (
              <Link key={item.id} href={`/bai-viet/${item.slug}`} className="flex gap-5 group cursor-pointer">
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-[#eeeeee]">
                  {item.anh_dai_dien ? (
                    <Image src={item.anh_dai_dien} alt={item.tieu_de}
                      width={112} height={112}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[#1b4d3e]/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {item.danh_muc && (
                    <p className="text-[#735a31] font-bold text-[10px] uppercase tracking-widest mb-1">
                      {item.danh_muc.ten}
                    </p>
                  )}
                  <h3 className="font-serif text-lg font-bold group-hover:text-[#003629] transition-colors leading-snug text-[#1a1c1c]">
                    {item.tieu_de}
                  </h3>
                  {item.mo_ta && (
                    <p className="text-[#404945] text-sm mt-1 line-clamp-2">{item.mo_ta}</p>
                  )}
                  <p className="text-[#707974] text-xs mt-2">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('vi-VN') : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TẤT CẢ BÀI VIẾT ── */}
      {rest.length > 0 && (
        <section className="bg-[#f3f3f3] py-16">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="font-serif text-2xl font-bold text-[#1a1c1c] whitespace-nowrap">Tất cả bài viết</h2>
              <div className="h-px flex-grow bg-[#c0c9c3]/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((item: any) => (
                <Link key={item.id} href={`/bai-viet/${item.slug}`} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-[#eeeeee]">
                    {item.anh_dai_dien ? (
                      <Image src={item.anh_dai_dien} alt={item.tieu_de}
                        width={600} height={375}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#1b4d3e]/10" />
                    )}
                  </div>
                  {item.danh_muc && (
                    <span className="text-[#735a31] text-[10px] font-bold uppercase tracking-widest">
                      {item.danh_muc.ten}
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold mt-2 leading-snug group-hover:text-[#003629] transition-colors text-[#1a1c1c]">
                    {item.tieu_de}
                  </h3>
                  {item.mo_ta && (
                    <p className="text-[#404945] text-sm mt-2 line-clamp-2">{item.mo_ta}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-xs text-[#707974]">
                    <span>{item.tac_gia}</span>
                    {item.published_at && (
                      <><span>·</span><span>{new Date(item.published_at).toLocaleDateString('vi-VN')}</span></>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
