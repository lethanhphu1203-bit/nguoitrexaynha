import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Maximize2, Layers, Calendar, Tag } from 'lucide-react'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabaseAdmin.from('du_an').select('ten, mo_ta').eq('slug', slug).single()
  if (!data) return { title: 'Không tìm thấy' }
  return { title: `${data.ten} | Nguoi Tre Xay Nha`, description: data.mo_ta }
}

export default async function DuAnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: item } = await supabaseAdmin
    .from('du_an')
    .select('*, danh_muc(ten, slug)')
    .eq('slug', slug)
    .single()

  if (!item) notFound()

  const specs = [
    { icon: MapPin, label: 'Địa chỉ', value: [item.dia_chi, item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ') },
    { icon: Maximize2, label: 'Diện tích', value: item.dien_tich },
    { icon: Layers, label: 'Số tầng', value: item.so_tang },
    { icon: Calendar, label: 'Năm hoàn thành', value: item.nam_hoan_thanh },
    { icon: Tag, label: 'Giá từ', value: item.gia_tu },
  ].filter(s => s.value)

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/du-an" className="text-sm text-gray-500 hover:text-[#003629] transition-colors mb-6 inline-block">
          ← Tất cả dự án
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {item.anh_dai_dien && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={item.anh_dai_dien}
                  alt={item.ten}
                  width={800}
                  height={450}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            )}

            {item.noi_dung && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: item.noi_dung }}
              />
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              {item.danh_muc && (
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#735a31] bg-[#fddba7] px-3 py-1 rounded-full">
                  {item.danh_muc.ten}
                </span>
              )}
              <h1 className="font-serif text-2xl font-medium text-[#003629] leading-snug">{item.ten}</h1>
              {item.mo_ta && <p className="text-gray-500 text-sm">{item.mo_ta}</p>}

              {specs.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm text-gray-800 font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
