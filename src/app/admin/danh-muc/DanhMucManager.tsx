'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

const loaiMap: Record<string, string> = {
  'bai-viet': 'Bài viết',
  'du-an': 'Dự án',
  'chung': 'Chung',
}

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export default function DanhMucManager({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [newItem, setNewItem] = useState({ ten: '', slug: '', loai: 'bai-viet', mo_ta: '' })
  const [editData, setEditData] = useState<any>({})

  async function handleAdd() {
    if (!newItem.ten) return
    const payload = { ...newItem, slug: newItem.slug || toSlug(newItem.ten), thu_tu: items.length }
    const res = await fetch('/api/danh-muc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setItems(prev => [...prev, data])
    setNewItem({ ten: '', slug: '', loai: 'bai-viet', mo_ta: '' })
    setAdding(false)
  }

  async function handleEdit(id: string) {
    await fetch(`/api/danh-muc/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...editData } : i))
    setEditId(null)
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/danh-muc/${deleteId}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  const grouped = ['bai-viet', 'du-an', 'chung'].map(loai => ({
    loai,
    items: items.filter(i => i.loai === loai),
  }))

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-end">
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#003629] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4d3e]"
        >
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-medium text-gray-800 text-sm">Danh mục mới</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
              <input
                value={newItem.ten}
                onChange={e => setNewItem(p => ({ ...p, ten: e.target.value, slug: toSlug(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={newItem.slug}
                onChange={e => setNewItem(p => ({ ...p, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
              <select
                value={newItem.loai}
                onChange={e => setNewItem(p => ({ ...p, loai: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="bai-viet">Bài viết</option>
                <option value="du-an">Dự án</option>
                <option value="chung">Chung</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <input
                value={newItem.mo_ta}
                onChange={e => setNewItem(p => ({ ...p, mo_ta: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Huỷ</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-[#003629] text-white rounded-lg text-sm hover:bg-[#1b4d3e]">Thêm</button>
          </div>
        </div>
      )}

      {grouped.map(({ loai, items: groupItems }) => (
        <div key={loai} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="font-medium text-gray-700 text-sm">{loaiMap[loai]} ({groupItems.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {groupItems.length === 0 && (
              <p className="px-5 py-4 text-gray-400 text-sm">Chưa có danh mục</p>
            )}
            {groupItems.map(item => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                {editId === item.id ? (
                  <>
                    <input
                      value={editData.ten}
                      onChange={e => setEditData((p: any) => ({ ...p, ten: e.target.value }))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                    />
                    <button onClick={() => handleEdit(item.id)} className="p-1.5 rounded hover:bg-green-50 text-green-600"><Check size={14} /></button>
                    <button onClick={() => setEditId(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{item.ten}</span>
                      <span className="ml-2 text-xs text-gray-400 font-mono">{item.slug}</span>
                    </div>
                    <button
                      onClick={() => { setEditId(item.id); setEditData({ ten: item.ten }) }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá danh mục?"
        message="Danh mục sẽ bị xoá. Các bài viết/dự án thuộc danh mục này sẽ không còn danh mục."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
