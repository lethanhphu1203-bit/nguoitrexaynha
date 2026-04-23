'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Star, Search } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import Image from 'next/image'

export default function DuAnList({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = items.filter((item) => {
    const matchSearch = item.ten?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || item.trang_thai === filter
    return matchSearch && matchFilter
  })

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/du-an/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  async function toggleNoiBat(id: string, current: boolean) {
    await fetch(`/api/du-an/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noi_bat: !current }),
    })
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, noi_bat: !current } : i)))
  }

  const statusMap: Record<string, { label: string; cls: string }> = {
    'nhap': { label: 'Nháp', cls: 'bg-gray-100 text-gray-500' },
    'xuat-ban': { label: 'Đang mở bán', cls: 'bg-green-100 text-green-700' },
    'hoan-thanh': { label: 'Hoàn thành', cls: 'bg-blue-100 text-blue-700' },
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm dự án..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="xuat-ban">Đang mở bán</option>
          <option value="hoan-thanh">Hoàn thành</option>
          <option value="nhap">Nháp</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            Chưa có dự án nào.{' '}
            <Link href="/admin/du-an/new" className="text-[#003629] hover:underline">Thêm ngay</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Dự án</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Địa chỉ</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const status = statusMap[item.trang_thai] || statusMap['nhap']
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.anh_dai_dien ? (
                          <div className="w-14 h-10 rounded overflow-hidden shrink-0">
                            <Image src={item.anh_dai_dien} alt="" width={56} height={40} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.ten}</p>
                          <p className="text-gray-400 text-xs">{item.danh_muc?.ten || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                      {[item.quan_huyen, item.thanh_pho].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleNoiBat(item.id, item.noi_bat)}
                          title="Nổi bật"
                          className={`p-1.5 rounded hover:bg-gray-100 ${item.noi_bat ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                          <Star size={15} fill={item.noi_bat ? 'currentColor' : 'none'} />
                        </button>
                        <Link href={`/admin/du-an/${item.id}`} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá dự án?"
        message="Dự án sẽ bị xoá vĩnh viễn."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
