'use client'

import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'

interface Props {
  title: string
  actions?: React.ReactNode
}

export default function AdminHeader({ title, actions }: Props) {
  const { data: session } = useSession()

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        {actions}
        <div className="flex items-center gap-3">
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#003629] flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <span className="text-sm text-gray-700">{session?.user?.name || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
