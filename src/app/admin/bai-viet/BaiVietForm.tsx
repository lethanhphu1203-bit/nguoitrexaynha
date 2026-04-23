'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Eye } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import SlugInput from '@/components/admin/SlugInput'

interface Props {
  initial?: any
  danhMucs: any[]
}

const empty = {
  tieu_de: '',
  slug: '',
  mo_ta: '',
  noi_dung: '',
  anh_dai_dien: '',
  tac_gia: 'Admin',
  danh_muc_id: '',
  tags: '',
  trang_thai: 'nhap',
}

export default function BaiVietForm({ initial, danhMucs }: Props) {
  const router = useRouter()
  const isEdit = !!initial
  const [form, setForm] = useState({
    ...empty,
    ...initial,
    tags: initial?.tags?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  async function handleSave(publish = false) {
    setSaving(true)
    setError('')

    const payload: any = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }
    if (publish) {
      payload.trang_thai = 'xuat-ban'
      payload.published_at = new Date().toISOString()
    }

    const url = isEdit ? `/api/bai-viet/${initial.id}` : '/api/bai-viet'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Có lỗi xảy ra')
      setSaving(false)
      return
    }

    router.push('/admin/bai-viet')
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
              <input
                type="text"
                value={form.tieu_de}
                onChange={(e) => set('tieu_de', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/30"
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>

            <SlugInput
              sourceValue={form.tieu_de}
              value={form.slug}
              onChange={(v) => set('slug', v)}
              disabled={isEdit}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (SEO)</label>
              <textarea
                value={form.mo_ta}
                onChange={(e) => set('mo_ta', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/30 resize-none"
                placeholder="Mô tả ngắn hiển thị trên Google..."
              />
            </div>
          </div>

          {/* Nội dung */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
            <textarea
              value={form.noi_dung}
              onChange={(e) => set('noi_dung', e.target.value)}
              rows={20}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/30 font-mono resize-y"
              placeholder="Nội dung bài viết (hỗ trợ HTML)..."
            />
            <p className="text-gray-400 text-xs mt-1">Hỗ trợ HTML. Ví dụ: &lt;h2&gt;, &lt;p&gt;, &lt;img&gt;, &lt;ul&gt;...</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Đăng bài */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-medium text-gray-800 text-sm">Xuất bản</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Lưu nháp
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#003629] text-white rounded-lg py-2 text-sm hover:bg-[#1b4d3e] disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                Đăng bài
              </button>
            </div>
            {isEdit && (
              <p className="text-xs text-gray-400">
                Trạng thái: <strong>{form.trang_thai === 'xuat-ban' ? 'Đã đăng' : 'Nháp'}</strong>
              </p>
            )}
          </div>

          {/* Ảnh đại diện */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <ImageUpload
              value={form.anh_dai_dien}
              onChange={(url) => set('anh_dai_dien', url)}
              folder="bai-viet"
              label="Ảnh đại diện"
            />
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-medium text-gray-800 text-sm">Thông tin</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={form.danh_muc_id}
                onChange={(e) => set('danh_muc_id', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">-- Chọn danh mục --</option>
                {danhMucs.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.ten}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
              <input
                type="text"
                value={form.tac_gia}
                onChange={(e) => set('tac_gia', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-gray-400 text-xs mt-1">Phân cách bằng dấu phẩy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
