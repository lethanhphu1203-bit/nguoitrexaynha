'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function BannerManager({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [adding, setAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [newBanner, setNewBanner] = useState({
    tieu_de: '', mo_ta: '', anh: '', duong_dan: '',
    vi_tri: 'trang-chu', kich_hoat: true,
  })

  async function handleAdd() {
    if (!newBanner.anh) return
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newBanner, thu_tu: items.length }),
    })
    const data = await res.json()
    setItems((prev) => [...prev, data])
    setNewBanner({ tieu_de: '', mo_ta: '', anh: '', duong_dan: '', vi_tri: 'trang-chu', kich_hoat: true })
    setAdding(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kich_hoat: !current }),
    })
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, kich_hoat: !current } : i)))
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/banners/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#003629] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4d3e]"
        >
          <Plus size={16} /> Thêm banner
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-medium text-gray-800">Banner mới</h3>
          <ImageUpload value={newBanner.anh} onChange={(url) => setNewBanner((p) => ({ ...p, anh: url }))} folder="banners" label="Ảnh banner *" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input value={newBanner.tieu_de} onChange={(e) => setNewBanner((p) => ({ ...p, tieu_de: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link (đường dẫn)</label>
              <input value={newBanner.duong_dan} onChange={(e) => setNewBanner((p) => ({ ...p, duong_dan: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="/du-an/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <select value={newBanner.vi_tri} onChange={(e) => setNewBanner((p) => ({ ...p, vi_tri: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="trang-chu">Trang chủ</option>
                <option value="bai-viet">Trang bài viết</option>
                <option value="du-an">Trang dự án</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Huỷ</button>
            <button onClick={handleAdd} disabled={!newBanner.anh}
              className="px-4 py-2 bg-[#003629] text-white rounded-lg text-sm hover:bg-[#1b4d3e] disabled:opacity-60">Thêm</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && !adding && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400 text-sm">
            Chưa có banner nào
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <GripVertical size={16} className="text-gray-300 shrink-0" />
            {item.anh && (
              <div className="w-24 h-14 rounded overflow-hidden shrink-0 bg-gray-100">
                <Image src={item.anh} alt="" width={96} height={56} className="object-cover w-full h-full" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">{item.tieu_de || 'Không có tiêu đề'}</p>
              <p className="text-gray-400 text-xs">{item.vi_tri} {item.duong_dan && `· ${item.duong_dan}`}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(item.id, item.kich_hoat)}
                className={item.kich_hoat ? 'text-green-500' : 'text-gray-300'}>
                {item.kich_hoat ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} title="Xoá banner?" message="Banner sẽ bị xoá vĩnh viễn."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
