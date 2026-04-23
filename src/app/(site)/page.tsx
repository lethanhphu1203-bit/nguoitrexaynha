import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

async function getData() {
  const [{ data: banners }, { data: duAnNoiBat }, { data: baiVietMoi }] = await Promise.all([
    supabaseAdmin.from('banners').select('*').eq('vi_tri', 'trang-chu').eq('kich_hoat', true).order('thu_tu').limit(5),
    supabaseAdmin.from('du_an').select('id, ten, slug, mo_ta, anh_dai_dien, quan_huyen, thanh_pho, gia_tu, danh_muc(ten)').eq('trang_thai', 'xuat-ban').eq('noi_bat', true).order('thu_tu').limit(6),
    supabaseAdmin.from('bai_viet').select('id, tieu_de, slug, mo_ta, anh_dai_dien, tac_gia, published_at, danh_muc(ten)').eq('trang_thai', 'xuat-ban').order('published_at', { ascending: false }).limit(6),
  ])
  return { banners: banners || [], duAnNoiBat: duAnNoiBat || [], baiVietMoi: baiVietMoi || [] }
}

export default async function HomePage() {
  const { banners, duAnNoiBat, baiVietMoi } = await getData()

  return (
    <div className="pt-16">
      {/* Hero / Banner */}
      {banners.length > 0 ? (
        <section className="relative h-[70vh] min-h-96 bg-[#003629] overflow-hidden">
          <Image
            src={banners[0].anh}
            alt={banners[0].tieu_de || ''}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              {banners[0].tieu_de && (
                <h1 className="font-serif text-4xl md:text-6xl font-medium text-white leading-tight mb-4">
                  {banners[0].tieu_de}
                </h1>
              )}
              {banners[0].mo_ta && (
                <p className="text-white/80 text-lg max-w-xl mx-auto">{banners[0].mo_ta}</p>
              )}
              {banners[0].duong_dan && (
                <Link
                  href={banners[0].duong_dan}
                  className="inline-block mt-6 bg-white text-[#003629] px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Khám phá ngay
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#003629] py-32 text-center px-6">
          <h1 className="font-serif text-5xl font-medium text-white mb-4">Người Trẻ Xây Nhà</h1>
          <p className="text-white/70 text-lg">Nền tảng kết nối người trẻ với giải pháp nhà ở thông minh</p>
        </section>
      )}

      {/* Dự án nổi bật */}
      {duAnNoiBat.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-medium text-[#003629]">Dự án nổi bật</h2>
            <Link href="/du-an" className="text-sm text-gray-500 hover:text-[#003629] transition-colors">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {duAnNoiBat.map((item: any) => (
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
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-1">{item.danh_muc?.ten}</p>
                <h3 className="font-serif text-lg font-medium text-[#003629] group-hover:underline">{item.ten}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ')}
                  {item.gia_tu && ` · Từ ${item.gia_tu}`}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bài viết mới */}
      {baiVietMoi.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-medium text-[#003629]">Bài viết mới nhất</h2>
              <Link href="/bai-viet" className="text-sm text-gray-500 hover:text-[#003629] transition-colors">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baiVietMoi.map((item: any) => (
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
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-2">{item.danh_muc?.ten}</p>
                    <h3 className="font-serif text-lg font-medium text-gray-900 leading-snug group-hover:text-[#003629] transition-colors">
                      {item.tieu_de}
                    </h3>
                    {item.mo_ta && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.mo_ta}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span>{item.tac_gia}</span>
                      {item.published_at && (
                        <>
                          <span>·</span>
                          <span>{new Date(item.published_at).toLocaleDateString('vi-VN')}</span>
                        </>
                      )}
                    </div>
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
