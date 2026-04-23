import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

async function getData() {
  const [{ data: duAnNoiBat }, { data: baiVietMoi }] = await Promise.all([
    supabaseAdmin
      .from('du_an')
      .select('id, ten, slug, mo_ta, anh_dai_dien, quan_huyen, thanh_pho, gia_tu, danh_muc(ten)')
      .eq('trang_thai', 'xuat-ban')
      .eq('noi_bat', true)
      .order('thu_tu')
      .limit(8),
    supabaseAdmin
      .from('bai_viet')
      .select('id, tieu_de, slug, mo_ta, anh_dai_dien, tac_gia, published_at, danh_muc(ten)')
      .eq('trang_thai', 'xuat-ban')
      .order('published_at', { ascending: false })
      .limit(7),
  ])
  return {
    duAnNoiBat: duAnNoiBat || [],
    baiVietMoi: baiVietMoi || [],
  }
}

export default async function HomePage() {
  const { duAnNoiBat: _duAn, baiVietMoi: _baiViet } = await getData()
  const duAnNoiBat = _duAn as any[]
  const baiVietMoi = _baiViet as any[]

  const featured = baiVietMoi[0]
  const subNews = baiVietMoi.slice(1, 4)
  const latestNews = baiVietMoi.slice(0, 4)

  return (
    <div className="pt-[88px]">

      {/* ── HERO ── */}
      <section className="hero-gradient min-h-[600px] lg:min-h-[780px] flex items-center relative overflow-hidden px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-12 gap-8 lg:gap-12 items-center py-16">
          {/* Left */}
          <div className="col-span-12 lg:col-span-7">
            <h1 className="font-serif text-[42px] lg:text-[60px] leading-[1.1] text-white font-bold mb-6">
              Cập nhật dự án bất động sản TP.HCM nhanh, rõ và đáng tin cậy
            </h1>
            <p className="text-white/80 text-lg lg:text-xl max-w-xl font-light leading-relaxed mb-10">
              Nền tảng cung cấp thông tin quy hoạch, tiến độ thi công và phân tích pháp lý chuyên sâu cho người mua nhà trẻ.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/du-an"
                className="bg-[#D4B483] text-[#003629] px-8 py-4 rounded font-bold text-lg hover:bg-white transition-colors duration-300">
                Khám phá ngay
              </Link>
              <Link href="/bai-viet"
                className="border border-white/30 text-white px-8 py-4 rounded font-medium text-lg hover:bg-white/10 transition-colors duration-300">
                Đọc bài viết
              </Link>
            </div>
          </div>

          {/* Right — glass card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="glass-effect bg-white/10 p-6 lg:p-8 rounded-xl border border-white/10 shadow-2xl">
              <h3 className="font-serif italic text-2xl text-white mb-6">Dự án nổi bật</h3>

              {duAnNoiBat.length > 0 ? (
                <div className="space-y-4">
                  {duAnNoiBat.slice(0, 3).map((da: any) => (
                    <Link key={da.id} href={`/du-an/${da.slug}`}
                      className="block group p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <p className="text-white font-medium group-hover:text-[#D4B483] transition-colors leading-snug text-sm">
                        {da.ten}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {[da.quan_huyen, da.thanh_pho].filter(Boolean).join(', ')}
                        {da.gia_tu && ` · Từ ${da.gia_tu}`}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {['TP. Thủ Đức', 'Quận 7', 'Bình Dương'].map((kv) => (
                    <div key={kv} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm font-medium">{kv}</span>
                      <span className="text-[#D4B483] font-bold text-sm">Đang cập nhật</span>
                    </div>
                  ))}
                </div>
              )}

              {baiVietMoi.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4">Tin tiêu điểm</h4>
                  <div className="space-y-3">
                    {baiVietMoi.slice(0, 3).map((bv: any) => (
                      <Link key={bv.id} href={`/bai-viet/${bv.slug}`} className="block group">
                        <p className="text-white font-medium group-hover:text-[#D4B483] transition-colors leading-snug text-sm">
                          {bv.tieu_de}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#735a31]/10 rounded-full blur-[120px]" />
      </section>

      {/* ── TIÊU ĐIỂM DỰ ÁN (Bento) ── */}
      {baiVietMoi.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-8 lg:px-12 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[#735a31] font-bold tracking-[0.2em] text-xs uppercase block mb-2">TIN TỨC CHỌN LỌC</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1a1c1c]">Tiêu Điểm</h2>
            </div>
            <Link href="/bai-viet" className="text-[#003629] font-bold border-b border-[#003629]/20 pb-1 hover:border-[#003629] transition-all text-sm">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Featured left */}
            {featured && (
              <Link href={`/bai-viet/${featured.slug}`} className="col-span-12 lg:col-span-7 group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#eeeeee] mb-5">
                  {featured.anh_dai_dien ? (
                    <Image src={featured.anh_dai_dien} alt={featured.tieu_de}
                      fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-[#1b4d3e]/20" />
                  )}
                  {featured.danh_muc && (
                    <div className="absolute top-5 left-5 bg-[#735a31] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded">
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
                  <h3 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-3 group-hover:text-[#003629] transition-colors text-[#1a1c1c]">
                    {featured.tieu_de}
                  </h3>
                  {featured.mo_ta && (
                    <p className="text-[#404945] line-clamp-2">{featured.mo_ta}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Right column */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
              {subNews.map((item: any) => (
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
                    <h4 className="font-serif text-lg lg:text-xl font-bold group-hover:text-[#003629] transition-colors leading-snug text-[#1a1c1c]">
                      {item.tieu_de}
                    </h4>
                    {item.mo_ta && (
                      <p className="text-[#404945] text-sm mt-1 line-clamp-2">{item.mo_ta}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CẬP NHẬT MỚI NHẤT (4 cols) ── */}
      {latestNews.length > 0 && (
        <section className="bg-[#f3f3f3] py-20">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a1c1c] whitespace-nowrap">Cập nhật mới nhất</h2>
              <div className="h-px flex-grow bg-[#c0c9c3]/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {latestNews.map((item: any) => (
                <Link key={item.id} href={`/bai-viet/${item.slug}`} className="group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-[#eeeeee]">
                    {item.anh_dai_dien ? (
                      <Image src={item.anh_dai_dien} alt={item.tieu_de}
                        width={400} height={300}
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
                  <h5 className="font-serif text-lg font-bold mt-2 leading-snug group-hover:text-[#003629] transition-colors text-[#1a1c1c]">
                    {item.tieu_de}
                  </h5>
                  {item.mo_ta && (
                    <p className="text-[#404945] text-sm mt-2 line-clamp-2">{item.mo_ta}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DỰ ÁN NỔI BẬT ── */}
      {duAnNoiBat.length > 0 && (
        <section className="py-20 max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="text-[#735a31] font-bold tracking-[0.2em] text-xs uppercase block mb-2">DỰ ÁN</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-[#1a1c1c]">Dự Án Nổi Bật</h2>
            <p className="text-[#404945]">Khám phá các dự án bất động sản được chọn lọc kỹ càng dành cho người trẻ.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {duAnNoiBat.slice(0, 8).map((item: any) => (
              <Link key={item.id} href={`/du-an/${item.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#1b4d3e]">
                {item.anh_dai_dien ? (
                  <Image src={item.anh_dai_dien} alt={item.ten}
                    fill
                    className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-[#003629]/60" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h6 className="text-white font-serif text-xl font-bold">{item.ten}</h6>
                  <p className="text-white/70 text-xs mt-1">
                    {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                  </p>
                  {item.gia_tu && (
                    <p className="text-[#D4B483] text-xs font-bold mt-1">Từ {item.gia_tu}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/du-an"
              className="inline-block border border-[#003629] text-[#003629] px-8 py-3 rounded font-medium hover:bg-[#003629] hover:text-white transition-colors duration-300">
              Xem tất cả dự án
            </Link>
          </div>
        </section>
      )}

    </div>
  )
}
