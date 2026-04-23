'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import Image from 'next/image'

interface Props {
  initialData: any[]
}

export default function BaiVietList({ initialData }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'xuat-ban' | 'nhap'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = items.filter((item) => {
    const matchSearch = item.tieu_de?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || item.trang_thai === filter
    return matchSearch && matchFilter
  })

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/bai-viet/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === 'xuat-ban' ? 'nhap' : 'xuat-ban'
    const body: any = { trang_thai: next }
    if (next === 'xuat-ban') body.published_at = new Date().toISOString()

    await fetch(`/api/bai-viet/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, trang_thai: next } : i)))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">Tất cả ({items.length})</option>
          <option value="xuat-ban">Đã đăng ({items.filter((i) => i.trang_thai === 'xuat-ban').length})</option>
          <option value="nhap">Nháp ({items.filter((i) => i.trang_thai === 'nhap').length})</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p>Không có bài viết nào</p>
            <Link href="/admin/bai-viet/new" className="text-[#003629] text-sm hover:underline mt-2 inline-block">
              Tạo bài viết mới
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bài viết</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Ngày tạo</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.anh_dai_dien ? (
                        <div className="w-12 h-9 rounded overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={item.anh_dai_dien}
                            alt=""
                            width={48}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-9 rounded bg-gray-100 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-xs">{item.tieu_de}</p>
                        <p className="text-gray-400 text-xs truncate">{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                    {item.danh_muc?.ten || '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.trang_thai === 'xuat-ban'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.trang_thai === 'xuat-ban' ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleStatus(item.id, item.trang_thai)}
                        title={item.trang_thai === 'xuat-ban' ? 'Chuyển về nháp' : 'Đăng bài'}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        {item.trang_thai === 'xuat-ban' ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        href={`/admin/bai-viet/${item.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá bài viết?"
        message="Bài viết sẽ bị xoá vĩnh viễn. Bạn không thể hoàn tác hành động này."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
