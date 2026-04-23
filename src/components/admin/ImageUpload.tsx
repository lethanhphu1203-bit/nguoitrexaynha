'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder = 'misc', label = 'Ảnh' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Upload thất bại')
    } else {
      onChange(data.url)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {value ? (
        <div className="relative w-full aspect-video max-w-sm rounded-lg overflow-hidden border bg-gray-50">
          <Image src={value} alt="preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Upload size={24} />
          )}
          <span className="text-sm">{uploading ? 'Đang upload...' : 'Chọn ảnh'}</span>
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
