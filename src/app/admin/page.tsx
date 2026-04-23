import { supabaseAdmin } from '@/lib/supabase'
import AdminHeader from '@/components/admin/Header'
import { FileText, Building2, Mail, Eye } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [baiViet, duAn, lienHe, lienHeChuaDoc] = await Promise.all([
    supabaseAdmin.from('bai_viet').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('du_an').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('lien_he').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('lien_he').select('id', { count: 'exact', head: true }).eq('da_doc', false),
  ])
  return {
    baiViet: baiViet.count || 0,
    duAn: duAn.count || 0,
    lienHe: lienHe.count || 0,
    lienHeChuaDoc: lienHeChuaDoc.count || 0,
  }
}

async function getRecentActivity() {
  const [baiViet, lienHe] = await Promise.all([
    supabaseAdmin
      .from('bai_viet')
      .select('id, tieu_de, trang_thai, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabaseAdmin
      .from('lien_he')
      .select('id, ho_ten, chu_de, da_doc, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])
  return { baiViet: baiViet.data || [], lienHe: lienHe.data || [] }
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  const statCards = [
    { label: 'Bài viết', value: stats.baiViet, icon: FileText, href: '/admin/bai-viet', color: 'bg-blue-50 text-blue-600' },
    { label: 'Dự án', value: stats.duAn, icon: Building2, href: '/admin/du-an', color: 'bg-green-50 text-green-600' },
    { label: 'Liên hệ', value: stats.lienHe, icon: Mail, href: '/admin/lien-he', color: 'bg-orange-50 text-orange-600' },
    { label: 'Chưa đọc', value: stats.lienHeChuaDoc, icon: Eye, href: '/admin/lien-he?da_doc=false', color: 'bg-red-50 text-red-600' },
  ]

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-gray-500 text-sm">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bài viết mới */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Bài viết gần đây</h2>
              <Link href="/admin/bai-viet" className="text-sm text-[#003629] hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-3">
              {activity.baiViet.length === 0 && (
                <p className="text-gray-400 text-sm">Chưa có bài viết nào</p>
              )}
              {activity.baiViet.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.tieu_de}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.trang_thai === 'xuat-ban'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {b.trang_thai === 'xuat-ban' ? 'Đã đăng' : 'Nháp'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Liên hệ mới */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Liên hệ gần đây</h2>
              <Link href="/admin/lien-he" className="text-sm text-[#003629] hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-3">
              {activity.lienHe.length === 0 && (
                <p className="text-gray-400 text-sm">Chưa có tin nhắn nào</p>
              )}
              {activity.lienHe.map((l: any) => (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                    {l.ho_ten?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{l.ho_ten}</p>
                    <p className="text-xs text-gray-400 truncate">{l.chu_de || 'Không có chủ đề'}</p>
                  </div>
                  {!l.da_doc && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
