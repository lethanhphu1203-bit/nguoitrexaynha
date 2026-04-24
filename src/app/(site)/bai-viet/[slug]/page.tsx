import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabaseAdmin
    .from('bai_viet')
    .select('tieu_de, mo_ta')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Không tìm thấy' }
  return { title: `${data.tieu_de} | Nguoi Tre Xay Nha`, description: data.mo_ta }
}

export default async function BaiVietDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: item }, { data: _related }] = await Promise.all([
    supabaseAdmin
      .from('bai_viet')
      .select('*, danh_muc(ten, slug)')
      .eq('slug', slug)
      .eq('trang_thai', 'xuat-ban')
      .single(),
    supabaseAdmin
      .from('bai_viet')
      .select('id, tieu_de, slug, anh_dai_dien, danh_muc(ten)')
      .eq('trang_thai', 'xuat-ban')
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(6),
  ])

  if (!item) notFound()

  const related = (_related || []) as any[]

  // Tăng lượt xem (fire & forget)
  supabaseAdmin.from('bai_viet').update({ luot_xem: (item.luot_xem || 0) + 1 }).eq('id', item.id)

  return (
    <div className="pt-[88px] bg-[#f9f9f9]">
      <main className="pb-20">
        <article className="max-w-4xl mx-auto px-6 pt-10">

          {/* Back link */}
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-2 text-[#003629] hover:opacity-70 transition-opacity mb-8"
          >
            <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
            <span className="font-sans text-sm font-medium">Tất cả bài viết</span>
          </Link>

          {/* Category */}
          {item.danh_muc && (
            <div className="mb-6">
              <Link
                href={`/bai-viet?danh-muc=${item.danh_muc.slug}`}
                className="inline-block bg-[#fddba7] text-[#59431c] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#ffdeac] transition-colors"
              >
                {item.danh_muc.ten}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-6xl font-medium text-[#003629] leading-tight mb-8">
            {item.tieu_de}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-[#c0c9c3]/20">
            <div className="w-12 h-12 rounded-full bg-[#1b4d3e]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#003629] text-xl">person</span>
            </div>
            <div>
              <p className="text-[#1a1c1c] font-semibold text-sm">{item.tac_gia || 'Ban biên tập'}</p>
              <p className="text-[#404945] text-xs font-light">
                {item.published_at
                  ? new Date(item.published_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Mới đăng'}
                {item.luot_xem > 0 && ` • ${item.luot_xem} lượt xem`}
              </p>
            </div>
          </div>

          {/* Cover image */}
          {item.anh_dai_dien && (
            <figure className="mb-12">
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#eeeeee]">
                <Image
                  src={item.anh_dai_dien}
                  alt={item.tieu_de}
                  width={896}
                  height={504}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          {/* Lead paragraph (mo_ta as summary) */}
          {item.mo_ta && (
            <p className="font-bold text-[#003629] text-xl leading-relaxed mb-10">
              {item.mo_ta}
            </p>
          )}

          {/* Content */}
          {item.noi_dung && (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: item.noi_dung }}
            />
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#c0c9c3]/20 flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#404945] text-xs rounded-full hover:bg-[#fddba7] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* ── RELATED ARTICLES ── */}
        {related.length > 0 && (
          <section className="mt-24 bg-white py-20">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex justify-between items-end mb-10">
                <h2 className="font-serif text-3xl text-[#003629]">Bài viết liên quan</h2>
                <Link
                  href="/bai-viet"
                  className="text-[#735a31] font-bold text-xs uppercase tracking-widest border-b border-[#735a31]/30 pb-1 hover:border-[#735a31] transition-colors"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x no-scrollbar">
                {related.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/bai-viet/${rel.slug}`}
                    className="min-w-[280px] md:min-w-[320px] snap-start group block shrink-0"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-[#eeeeee]">
                      {rel.anh_dai_dien ? (
                        <Image
                          src={rel.anh_dai_dien}
                          alt={rel.tieu_de}
                          width={320}
                          height={240}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1b4d3e]/10" />
                      )}
                    </div>
                    <h4 className="font-serif text-lg text-[#003629] leading-snug group-hover:text-[#735a31] transition-colors">
                      {rel.tieu_de}
                    </h4>
                    {rel.danh_muc?.ten && (
                      <p className="text-xs text-[#707974] mt-2 uppercase tracking-tighter">
                        {rel.danh_muc.ten}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
