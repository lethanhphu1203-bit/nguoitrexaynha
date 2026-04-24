import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabaseAdmin.from('du_an').select('ten, mo_ta').eq('slug', slug).single()
  if (!data) return { title: 'Không tìm thấy' }
  return { title: `${data.ten} | Nguoi Tre Xay Nha`, description: data.mo_ta }
}

function getBadge(trang_thai: string) {
  if (trang_thai === 'hoan-thanh') return { label: 'ĐÃ HOÀN THÀNH', bg: 'bg-[#1b4d3e]', text: 'text-[#8abda9]' }
  return { label: 'ĐANG MỞ BÁN', bg: 'bg-[#fddba7]', text: 'text-[#785f35]' }
}

export default async function DuAnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: item }, { data: _related }] = await Promise.all([
    supabaseAdmin
      .from('du_an')
      .select('*, danh_muc(ten, slug)')
      .eq('slug', slug)
      .single(),
    supabaseAdmin
      .from('du_an')
      .select('id, ten, slug, anh_dai_dien, quan_huyen, thanh_pho, gia_tu, trang_thai')
      .in('trang_thai', ['xuat-ban', 'hoan-thanh'])
      .neq('slug', slug)
      .order('thu_tu')
      .limit(4),
  ])

  if (!item) notFound()

  const related = (_related || []) as any[]
  const badge = getBadge(item.trang_thai)

  const specs = [
    { label: 'Địa chỉ', value: [item.dia_chi, item.quan_huyen, item.thanh_pho].filter(Boolean).join(', '), icon: 'location_on' },
    { label: 'Diện tích', value: item.dien_tich, icon: 'straighten' },
    { label: 'Số tầng', value: item.so_tang, icon: 'apartment' },
    { label: 'Năm hoàn thành', value: item.nam_hoan_thanh, icon: 'calendar_today' },
    { label: 'Danh mục', value: item.danh_muc?.ten, icon: 'category' },
  ].filter(s => s.value)

  return (
    <div className="pt-[88px] bg-[#f9f9f9]">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative w-full h-[55vh] min-h-[420px] max-h-[640px] overflow-hidden bg-[#1b4d3e]">
        {item.anh_dai_dien && (
          <Image
            src={item.anh_dai_dien}
            alt={item.ten}
            fill
            className="object-cover brightness-[0.65]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003629]/80 via-transparent to-transparent" />

        {/* Back link */}
        <div className="absolute top-8 left-8 lg:left-12">
          <Link href="/du-an" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-base leading-none">arrow_back</span>
            Tất cả dự án
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-12 pb-10 max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              {item.danh_muc && (
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#fddba7] mb-3">
                  {item.danh_muc.ten}
                </span>
              )}
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white italic leading-tight max-w-3xl">
                {item.ten}
              </h1>
              <p className="text-white/70 mt-3 text-base">
                {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
              </p>
            </div>
            <div className={`${badge.bg} ${badge.text} px-5 py-2 rounded-sm font-bold text-xs tracking-widest uppercase shrink-0`}>
              {badge.label}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR ── */}
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-16">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* Key stats glassmorphism box */}
            <div className="bg-white/70 backdrop-blur-xl border border-[#c0c9c3]/20 rounded-xl p-8 mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#003629]/5 rounded-full -mr-20 -mt-20 blur-3xl" />
              <h2 className="font-serif text-xl text-[#003629] mb-6">Thông tin dự án</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {item.gia_tu && (
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#735a31] font-bold">Giá từ</span>
                    <p className="text-[#003629] font-bold text-xl mt-1">{item.gia_tu}</p>
                  </div>
                )}
                {(item.quan_huyen || item.thanh_pho) && (
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#735a31] font-bold">Vị trí</span>
                    <p className="text-[#1a1c1c] font-medium mt-1">
                      {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {item.dien_tich && (
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#735a31] font-bold">Diện tích</span>
                    <p className="text-[#1a1c1c] font-medium mt-1">{item.dien_tich}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mo ta */}
            {item.mo_ta && (
              <p className="font-bold text-[#003629] text-xl leading-relaxed mb-10 font-serif italic">
                {item.mo_ta}
              </p>
            )}

            {/* Noi dung */}
            {item.noi_dung && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: item.noi_dung }}
              />
            )}

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#c0c9c3]/20">
                {item.tags.map((tag: string) => (
                  <span key={tag}
                    className="px-4 py-2 bg-[#f3f3f3] text-[#404945] text-xs rounded-full hover:bg-[#fddba7] transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">

              {/* CTA card */}
              <div className="bg-[#003629] rounded-xl p-7 text-white">
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Giá dự kiến</p>
                <p className="font-serif text-3xl font-bold text-[#D4B483] mb-1">
                  {item.gia_tu || 'Liên hệ'}
                </p>
                {(item.quan_huyen || item.thanh_pho) && (
                  <p className="text-white/70 text-sm mb-6">
                    {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                  </p>
                )}
                <Link href="/lien-he"
                  className="block w-full text-center bg-[#D4B483] text-[#003629] font-bold py-3 rounded-sm hover:bg-white transition-colors duration-300 text-sm">
                  Đăng ký tư vấn
                </Link>
              </div>

              {/* Specs list */}
              {specs.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-[#c0c9c3]/20">
                  <h3 className="text-sm font-bold text-[#1a1c1c] mb-4 uppercase tracking-wider">Chi tiết</h3>
                  <div className="space-y-4">
                    {specs.map(({ label, value, icon }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#735a31] text-lg leading-none mt-0.5 shrink-0">{icon}</span>
                        <div>
                          <p className="text-[10px] text-[#707974] uppercase tracking-wider font-bold">{label}</p>
                          <p className="text-sm text-[#1a1c1c] font-medium mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── DỰ ÁN LIÊN QUAN ── */}
      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-serif text-3xl text-[#003629]">Dự án khác</h2>
              <Link href="/du-an"
                className="text-[#735a31] font-bold text-xs uppercase tracking-widest border-b border-[#735a31]/30 pb-1 hover:border-[#735a31] transition-colors">
                Xem tất cả
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel: any) => {
                const rb = getBadge(rel.trang_thai)
                return (
                  <Link key={rel.id} href={`/du-an/${rel.slug}`}
                    className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1 block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e2e2e2] mb-4">
                      {rel.anh_dai_dien && (
                        <Image src={rel.anh_dai_dien} alt={rel.ten}
                          fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <div className={`absolute top-3 left-3 ${rb.bg} ${rb.text} px-3 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm`}>
                        {rb.label}
                      </div>
                    </div>
                    <h4 className="font-serif text-lg text-[#003629] font-bold leading-snug group-hover:text-[#735a31] transition-colors italic">
                      {rel.ten}
                    </h4>
                    <p className="text-xs text-[#404945] mt-1">
                      {[rel.quan_huyen, rel.thanh_pho].filter(Boolean).join(', ')}
                    </p>
                    {rel.gia_tu && (
                      <p className="text-[#003629] text-sm font-bold mt-1">Từ {rel.gia_tu}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
