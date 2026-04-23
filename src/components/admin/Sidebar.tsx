'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, Building2, Image, Menu, Mail,
  FolderOpen, Settings, LogOut, ChevronRight, Home
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/bai-viet', label: 'Bài viết', icon: FileText },
  { href: '/admin/du-an', label: 'Dự án', icon: Building2 },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/menu', label: 'Menu', icon: Menu },
  { href: '/admin/lien-he', label: 'Liên hệ', icon: Mail },
  { href: '/admin/danh-muc', label: 'Danh mục', icon: FolderOpen },
  { href: '/admin/cau-hinh', label: 'Cấu hình', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 min-h-screen bg-[#003629] text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="font-serif font-black text-lg tracking-tight">NGUOITREXAYNHA</span>
        <p className="text-white/50 text-xs mt-0.5">Quản trị nội dung</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Home size={18} />
          <span>Xem trang web</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
