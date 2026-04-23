'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

const viTriMap: Record<string, string> = { header: 'Header', footer: 'Footer' }

export default function MenuManager({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [adding, setAdding] = useState<'header' | 'footer' | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [newItem, setNewItem] = useState({ ten: '', duong_dan: '', vi_tri: 'header', kich_hoat: true })
  const [editData, setEditData] = useState<any>({})

  async function handleAdd() {
    if (!newItem.ten || !newItem.duong_dan) return
    const payload = { ...newItem, thu_tu: items.filter(i => i.vi_tri === newItem.vi_tri).length }
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setItems(prev => [...prev, data])
    setNewItem({ ten: '', duong_dan: '', vi_tri: 'header', kich_hoat: true })
    setAdding(null)
  }

  async function handleEdit(id: string) {
    await fetch(`/api/menu/${id}`, {
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
    await fetch(`/api/menu/${deleteId}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kich_hoat: !current }),
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, kich_hoat: !current } : i))
  }

  function startEdit(item: any) {
    setEditId(item.id)
    setEditData({ ten: item.ten, duong_dan: item.duong_dan })
  }

  const sections: Array<'header' | 'footer'> = ['header', 'footer']

  return (
    <div className="space-y-8 max-w-2xl">
      {sections.map(viTri => {
        const sectionItems = items.filter(i => i.vi_tri === viTri)
        return (
          <div key={viTri} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{viTriMap[viTri]}</h2>
              <button
                onClick={() => { setAdding(viTri); setNewItem(p => ({ ...p, vi_tri: viTri })) }}
                className="flex items-center gap-1.5 text-sm text-[#003629] hover:underline"
              >
                <Plus size={14} /> Thêm mục
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {sectionItems.length === 0 && (
                <p className="px-5 py-4 text-gray-400 text-sm">Chưa có mục nào</p>
              )}
              {sectionItems.map(item => (
                <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                  {editId === item.id ? (
                    <>
                      <input
                        value={editData.ten}
                        onChange={e => setEditData((p: any) => ({ ...p, ten: e.target.value }))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                        placeholder="Tên hiển thị"
                      />
                      <input
                        value={editData.duong_dan}
                        onChange={e => setEditData((p: any) => ({ ...p, duong_dan: e.target.value }))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32 font-mono"
                        placeholder="/duong-dan"
                      />
                      <button onClick={() => handleEdit(item.id)} className="p-1.5 rounded hover:bg-green-50 text-green-600"><Check size={14} /></button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${item.kich_hoat ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {item.ten}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 font-mono">{item.duong_dan}</span>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.kich_hoat}
                          onChange={() => toggleActive(item.id, item.kich_hoat)}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-500">Hiển thị</span>
                      </label>
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              ))}

              {adding === viTri && (
                <div className="px-5 py-3 flex items-center gap-3 bg-gray-50">
                  <input
                    value={newItem.ten}
                    onChange={e => setNewItem(p => ({ ...p, ten: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm flex-1"
                    placeholder="Tên hiển thị *"
                    autoFocus
                  />
                  <input
                    value={newItem.duong_dan}
                    onChange={e => setNewItem(p => ({ ...p, duong_dan: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm w-36 font-mono"
                    placeholder="/duong-dan *"
                  />
                  <button onClick={handleAdd} className="p-1.5 rounded hover:bg-green-50 text-green-600"><Check size={14} /></button>
                  <button onClick={() => setAdding(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><X size={14} /></button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá mục menu?"
        message="Mục này sẽ bị xoá khỏi menu."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
