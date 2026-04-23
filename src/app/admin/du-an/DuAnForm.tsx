'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import SlugInput from '@/components/admin/SlugInput'

interface Props {
  initial?: any
  danhMucs: any[]
}

const empty = {
  ten: '', slug: '', mo_ta: '', noi_dung: '', anh_dai_dien: '',
  dia_chi: '', quan_huyen: '', thanh_pho: '', dien_tich: '',
  so_tang: '', nam_hoan_thanh: '', gia_tu: '', danh_muc_id: '',
  tags: '', trang_thai: 'nhap', noi_bat: false,
}

export default function DuAnForm({ initial, danhMucs }: Props) {
  const router = useRouter()
  const isEdit = !!initial
  const [form, setForm] = useState({
    ...empty,
    ...initial,
    tags: initial?.tags?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }

    const url = isEdit ? `/api/du-an/${initial.id}` : '/api/du-an'
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
    router.push('/admin/du-an')
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
              <input
                value={form.ten}
                onChange={(e) => set('ten', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/30"
                placeholder="Biệt thự Thảo Điền..."
              />
            </div>
            <SlugInput sourceValue={form.ten} value={form.slug} onChange={(v) => set('slug', v)} disabled={isEdit} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea
                value={form.mo_ta}
                onChange={(e) => set('mo_ta', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-medium text-gray-800 text-sm">Thông tin dự án</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { field: 'dia_chi', label: 'Địa chỉ', full: true },
                { field: 'quan_huyen', label: 'Quận / Huyện' },
                { field: 'thanh_pho', label: 'Thành phố' },
                { field: 'dien_tich', label: 'Diện tích' },
                { field: 'so_tang', label: 'Số tầng' },
                { field: 'nam_hoan_thanh', label: 'Năm hoàn thành' },
                { field: 'gia_tu', label: 'Giá từ' },
              ].map(({ field, label, full }) => (
                <div key={field} className={full ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={(form as any)[field]}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</label>
            <textarea
              value={form.noi_dung}
              onChange={(e) => set('noi_dung', e.target.value)}
              rows={15}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono resize-y"
              placeholder="Nội dung mô tả dự án (hỗ trợ HTML)..."
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#003629] text-white py-2.5 rounded-lg text-sm hover:bg-[#1b4d3e] disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Đang lưu...' : 'Lưu dự án'}
            </button>

            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={form.trang_thai}
                  onChange={(e) => set('trang_thai', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="nhap">Nháp</option>
                  <option value="xuat-ban">Đang mở bán</option>
                  <option value="hoan-thanh">Hoàn thành</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.noi_bat}
                  onChange={(e) => set('noi_bat', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Đánh dấu nổi bật</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <ImageUpload
              value={form.anh_dai_dien}
              onChange={(url) => set('anh_dai_dien', url)}
              folder="du-an"
              label="Ảnh đại diện"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={form.danh_muc_id}
                onChange={(e) => set('danh_muc_id', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- Chọn danh mục --</option>
                {danhMucs.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.ten}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="tag1, tag2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
