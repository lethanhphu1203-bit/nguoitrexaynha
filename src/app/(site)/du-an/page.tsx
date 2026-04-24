import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60
export const metadata = { title: 'Dự án | Nguoi Tre Xay Nha' }

function getBadgeStyle(trang_thai: string) {
  if (trang_thai === 'hoan-thanh') {
    return { bg: 'bg-[#1b4d3e]/90', text: 'text-[#8abda9]', label: 'ĐÃ HOÀN THÀNH' }
  }
  return { bg: 'bg-[#fddba7]/90', text: 'text-[#785f35]', label: 'ĐANG MỞ BÁN' }
}

export default async function DuAnSitePage() {
  const { data: _items, count } = await supabaseAdmin
    .from('du_an')
    .select('id, ten, slug, mo_ta, anh_dai_dien, quan_huyen, thanh_pho, gia_tu, trang_thai, danh_muc(ten)', { count: 'exact' })
    .in('trang_thai', ['xuat-ban', 'hoan-thanh'])
    .order('thu_tu')
  const items = (_items || []) as any[]

  // Use first project's image for the banner
  const bannerImg = items.find((i) => i.anh_dai_dien)?.anh_dai_dien

  return (
    <div className="pt-[88px]">

      {/* ── CINEMATIC BANNER ── */}
      <section className="relative w-full h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {bannerImg ? (
            <Image
              src={bannerImg}
              alt="Dự án bất động sản"
              fill
              className="object-cover brightness-[0.7] grayscale-[20%]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#003629]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003629] via-[#003629]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-12 w-full flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-7xl md:text-8xl font-bold text-white tracking-tighter italic">
              Dự Án
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-md leading-relaxed">
              Khám phá các dự án bất động sản được chọn lọc kỹ càng, cập nhật tiến độ và pháp lý chuyên sâu.
            </p>
          </div>

          {/* Stats glass card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-xl flex flex-col gap-6 text-white min-w-[280px]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#e3c290]">Tổng quan</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-light">{count ?? items.length}</span>
                <span className="text-xl opacity-80 italic">Dự án</span>
              </div>
            </div>
            <div className="h-px bg-white/20" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#e3c290]">Khu vực</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl opacity-80">TP. Hồ Chí Minh & vùng lân cận</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="bg-[#f3f3f3] py-5 sticky top-[72px] z-40 border-b border-[#c0c9c3]/30">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-wrap items-center gap-8">
          {['Mức giá', 'Pháp lý', 'Bàn giao', 'Danh mục'].map((label) => (
            <div key={label} className="flex items-center gap-1 border-b border-[#c0c9c3]/40 pb-1 cursor-pointer hover:border-[#735a31] transition-colors group">
              <span className="text-[11px] uppercase text-[#404945] font-bold tracking-widest group-hover:text-[#735a31] transition-colors">{label}</span>
              <span className="material-symbols-outlined text-[#735a31] text-base leading-none">expand_more</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2 text-[#003629] font-medium text-sm">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span className="font-semibold">Sắp xếp: Mới nhất</span>
          </div>
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="max-w-[1440px] mx-auto px-8 lg:px-12 py-20">
        {items.length === 0 && (
          <p className="text-[#404945]">Chưa có dự án nào.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {items.map((item: any) => {
            const badge = getBadgeStyle(item.trang_thai)
            return (
              <Link
                key={item.id}
                href={`/du-an/${item.slug}`}
                className="group cursor-pointer transition-transform duration-500 hover:-translate-y-2 block"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#e2e2e2]">
                  {item.anh_dai_dien ? (
                    <Image
                      src={item.anh_dai_dien}
                      alt={item.ten}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1b4d3e]/20 flex items-center justify-center text-[#404945] text-sm">
                      Chưa có ảnh
                    </div>
                  )}
                  {/* Status badge */}
                  <div className={`absolute top-4 left-4 ${badge.bg} backdrop-blur-md px-4 py-1 rounded-sm`}>
                    <span className={`text-[10px] font-bold tracking-widest ${badge.text} uppercase`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-serif text-3xl text-[#003629] leading-tight group-hover:text-[#735a31] transition-colors italic font-semibold">
                    {item.ten}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {item.gia_tu && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#404945] uppercase tracking-tighter font-semibold opacity-70">Giá từ</span>
                        <span className="text-xl text-[#003629] font-bold">{item.gia_tu}</span>
                      </div>
                    )}
                    {(item.quan_huyen || item.thanh_pho) && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-[#404945]">Vị trí</span>
                        <span className="text-sm font-semibold">
                          {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {item.danh_muc?.ten && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm text-[#404945]">Danh mục</span>
                        <span className="text-sm font-semibold">{item.danh_muc.ten}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
