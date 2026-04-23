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
  const { data: item } = await supabaseAdmin
    .from('bai_viet')
    .select('*, danh_muc(ten, slug)')
    .eq('slug', slug)
    .eq('trang_thai', 'xuat-ban')
    .single()

  if (!item) notFound()

  // Tăng lượt xem (fire & forget)
  supabaseAdmin.from('bai_viet').update({ luot_xem: (item.luot_xem || 0) + 1 }).eq('id', item.id)

  return (
    <div className="pt-16">
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Category */}
        {item.danh_muc && (
          <Link
            href={`/bai-viet?danh-muc=${item.danh_muc.slug}`}
            className="inline-block text-xs font-bold tracking-widest uppercase text-[#735a31] bg-[#fddba7] px-3 py-1 rounded-full mb-6 hover:bg-[#ffdeac] transition-colors"
          >
            {item.danh_muc.ten}
          </Link>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#003629] leading-tight mb-6">
          {item.tieu_de}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{item.tac_gia}</span>
          {item.published_at && (
            <>
              <span>·</span>
              <span>{new Date(item.published_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </>
          )}
          {item.luot_xem > 0 && (
            <>
              <span>·</span>
              <span>{item.luot_xem} lượt xem</span>
            </>
          )}
        </div>

        {/* Cover image */}
        {item.anh_dai_dien && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image
              src={item.anh_dai_dien}
              alt={item.tieu_de}
              width={800}
              height={450}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}

        {/* Content */}
        {item.noi_dung && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: item.noi_dung }}
          />
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
            {item.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
