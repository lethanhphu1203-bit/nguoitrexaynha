'use client'

import { useState } from 'react'
import { Mail, Phone, Trash2, CheckCircle } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function LienHeList({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [selected, setSelected] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function markRead(id: string) {
    await fetch(`/api/lien-he/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ da_doc: true }),
    })
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, da_doc: true } : i)))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, da_doc: true }))
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await fetch(`/api/lien-he/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== deleteId))
    if (selected?.id === deleteId) setSelected(null)
    setDeleteId(null)
    setDeleting(false)
  }

  const unread = items.filter((i) => !i.da_doc).length

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-80 shrink-0 space-y-2">
        {unread > 0 && (
          <p className="text-sm text-gray-500 px-1">{unread} tin chưa đọc</p>
        )}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm px-1">Chưa có tin nhắn nào</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => { setSelected(item); if (!item.da_doc) markRead(item.id) }}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
              selected?.id === item.id ? 'border-[#003629] shadow-sm' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!item.da_doc && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  <p className="font-medium text-gray-900 text-sm truncate">{item.ho_ten}</p>
                </div>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{item.chu_de || 'Không có chủ đề'}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(item.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div className="flex-1">
        {!selected ? (
          <div className="bg-white rounded-xl border border-gray-100 h-64 flex items-center justify-center text-gray-400">
            Chọn một tin nhắn để xem
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selected.ho_ten}</h2>
                <p className="text-gray-500 text-sm">{selected.chu_de || 'Không có chủ đề'}</p>
              </div>
              {selected.da_doc && (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle size={14} /> Đã đọc
                </span>
              )}
            </div>

            <div className="flex gap-4 text-sm text-gray-500">
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-[#003629]">
                  <Mail size={14} /> {selected.email}
                </a>
              )}
              {selected.so_dien_thoai && (
                <a href={`tel:${selected.so_dien_thoai}`} className="flex items-center gap-1 hover:text-[#003629]">
                  <Phone size={14} /> {selected.so_dien_thoai}
                </a>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selected.noi_dung}</p>
            </div>

            <p className="text-gray-400 text-xs">
              Gửi lúc {new Date(selected.created_at).toLocaleString('vi-VN')}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Xoá tin nhắn?"
        message="Tin nhắn sẽ bị xoá vĩnh viễn."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
