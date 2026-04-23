'use client'

import { useState } from 'react'
import { Save, Loader2, Check } from 'lucide-react'

const nhomMap: Record<string, string> = {
  'chung': 'Thông tin chung',
  'lien-he': 'Liên hệ',
  'mang-xa-hoi': 'Mạng xã hội',
  'seo': 'SEO & Phân tích',
}

const fieldLabels: Record<string, string> = {
  ten_website: 'Tên website',
  mo_ta_website: 'Mô tả website',
  logo: 'URL Logo',
  favicon: 'URL Favicon',
  email_lien_he: 'Email liên hệ',
  so_dien_thoai: 'Số điện thoại',
  dia_chi: 'Địa chỉ',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  zalo: 'Zalo',
  google_analytics: 'Google Analytics ID',
  meta_keywords: 'Meta Keywords',
}

const textareaFields = ['mo_ta_website', 'dia_chi', 'meta_keywords']

export default function CauHinhForm({ initialData }: { initialData: any[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(initialData.map((r: any) => [r.khoa, r.gia_tri || '']))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const groups = Array.from(new Set(initialData.map((r: any) => r.nhom)))

  async function handleSave() {
    setSaving(true)
    const updates = Object.entries(values).map(([khoa, gia_tri]) => ({ khoa, gia_tri }))
    await fetch('/api/cau-hinh', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {groups.map(nhom => {
        const fields = initialData.filter((r: any) => r.nhom === nhom)
        return (
          <div key={nhom} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm">{nhomMap[nhom] || nhom}</h2>
            </div>
            <div className="p-5 space-y-4">
              {fields.map((field: any) => (
                <div key={field.khoa}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {fieldLabels[field.khoa] || field.khoa}
                    {field.mo_ta && (
                      <span className="ml-1 text-gray-400 font-normal text-xs">— {field.mo_ta}</span>
                    )}
                  </label>
                  {textareaFields.includes(field.khoa) ? (
                    <textarea
                      value={values[field.khoa] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.khoa]: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.khoa] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.khoa]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#003629] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#1b4d3e] disabled:opacity-60 transition-colors"
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Đang lưu...</>
          ) : saved ? (
            <><Check size={16} /> Đã lưu!</>
          ) : (
            <><Save size={16} /> Lưu cấu hình</>
          )}
        </button>
      </div>
    </div>
  )
}
