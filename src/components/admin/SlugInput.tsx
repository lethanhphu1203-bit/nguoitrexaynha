'use client'

import { useEffect, useState } from 'react'

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface Props {
  sourceValue: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export default function SlugInput({ sourceValue, value, onChange, disabled }: Props) {
  const [locked, setLocked] = useState(!!value)

  useEffect(() => {
    if (!locked) onChange(toSlug(sourceValue))
  }, [sourceValue, locked])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Slug (URL)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setLocked(true); onChange(e.target.value) }}
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003629]/30 font-mono"
          placeholder="ten-bai-viet-cua-ban"
        />
        {!disabled && (
          <button
            type="button"
            onClick={() => { setLocked(false); onChange(toSlug(sourceValue)) }}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 whitespace-nowrap"
          >
            Tự động
          </button>
        )}
      </div>
      <p className="text-gray-400 text-xs mt-1">/bai-viet/<strong>{value || 'slug'}</strong></p>
    </div>
  )
}
