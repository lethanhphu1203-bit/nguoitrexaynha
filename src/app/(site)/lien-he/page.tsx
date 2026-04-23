'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

export default function LienHeSitePage() {
  const [form, setForm] = useState({ ho_ten: '', email: '', so_dien_thoai: '', chu_de: '', noi_dung: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    const res = await fetch('/api/lien-he', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Gửi thất bại. Vui lòng thử lại.')
    }
    setSending(false)
  }

  return (
    <div className="pt-16">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-medium text-[#003629] mb-3">Liên hệ</h1>
        <p className="text-gray-500 mb-10">Để lại thông tin, chúng tôi sẽ liên hệ lại với bạn sớm nhất.</p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Gửi thành công!</h2>
            <p className="text-gray-500 text-sm">Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                <input
                  required
                  value={form.ho_ten}
                  onChange={e => set('ho_ten', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  value={form.so_dien_thoai}
                  onChange={e => set('so_dien_thoai', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
                  placeholder="0901 234 567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
              <input
                value={form.chu_de}
                onChange={e => set('chu_de', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20"
                placeholder="Tư vấn xây nhà, Hỏi về dự án..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
              <textarea
                required
                value={form.noi_dung}
                onChange={e => set('noi_dung', e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/20 resize-none"
                placeholder="Nội dung bạn muốn trao đổi..."
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#003629] text-white py-3.5 rounded-xl text-sm font-medium hover:bg-[#1b4d3e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending && <Loader2 size={16} className="animate-spin" />}
              {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
