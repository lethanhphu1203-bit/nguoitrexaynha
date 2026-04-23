'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface Props {
  menu: any[]
  config: Record<string, string>
}

export default function SiteHeader({ menu, config }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9f9]/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-black text-xl text-[#003629] tracking-tight">
          {config.ten_website || 'NGUOITREXAYNHA'}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {menu.map((item: any) => (
            <Link
              key={item.id}
              href={item.duong_dan}
              className="text-sm text-gray-700 hover:text-[#003629] transition-colors"
            >
              {item.ten}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-[#003629]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {menu.map((item: any) => (
            <Link
              key={item.id}
              href={item.duong_dan}
              onClick={() => setOpen(false)}
              className="block text-sm text-gray-700 hover:text-[#003629] py-1"
            >
              {item.ten}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
