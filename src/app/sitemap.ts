import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

const BASE_URL = 'https://nguoitrexaynha.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/du-an`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/bai-viet`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let baiVietPages: MetadataRoute.Sitemap = []
  let duAnPages: MetadataRoute.Sitemap = []

  try {
    const { data: baiViet } = await supabaseAdmin
      .from('bai_viet')
      .select('slug, published_at')
      .eq('trang_thai', 'xuat-ban')
      .order('published_at', { ascending: false })

    baiVietPages = (baiViet || []).map((item) => ({
      url: `${BASE_URL}/bai-viet/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {}

  try {
    const { data: duAn } = await supabaseAdmin
      .from('du_an')
      .select('slug')
      .in('trang_thai', ['xuat-ban', 'hoan-thanh'])

    duAnPages = (duAn || []).map((item) => ({
      url: `${BASE_URL}/du-an/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {}

  return [...staticPages, ...baiVietPages, ...duAnPages]
}
