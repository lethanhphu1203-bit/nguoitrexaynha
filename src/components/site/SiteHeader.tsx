'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Props {
  menu: any[]
  config: Record<string, string>
}

export default function SiteHeader({ menu, config }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-emerald-900/5">
      <div className="flex justify-between items-center w-full px-8 lg:px-12 py-5 max-w-[1440px] mx-auto">
        {/* Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="font-serif font-bold italic text-2xl text-[#1B4D3E] tracking-tight"
          >
            {config.ten_website || 'NGUOI TRE XAY NHA'}
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {menu.map((item: any) => (
              <Link
                key={item.id}
                href={item.duong_dan}
                className="text-[#404945] font-medium hover:text-[#D4B483] transition-all duration-300 ease-out text-sm"
              >
                {item.ten}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-transparent border-b border-[#c0c9c3] focus:border-[#735a31] focus:outline-none text-sm w-44 transition-all duration-300"
              placeholder="Tìm kiếm..."
              type="text"
            />
          </div>
          <Link
            href="/lien-he"
            className="bg-[#003629] text-white px-5 py-2 rounded font-medium text-sm active:scale-95 transition-all duration-300 hover:bg-[#1b4d3e]"
          >
            Liên hệ
          </Link>
          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#1B4D3E]"
            onClick={() => setOpen(!open)}
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#c0c9c3]/30 px-8 py-4 space-y-3">
          {menu.map((item: any) => (
            <Link
              key={item.id}
              href={item.duong_dan}
              onClick={() => setOpen(false)}
              className="block text-sm text-[#404945] hover:text-[#D4B483] py-1 transition-colors"
            >
              {item.ten}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
