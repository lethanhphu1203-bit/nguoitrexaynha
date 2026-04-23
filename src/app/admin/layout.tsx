import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import SessionProvider from '@/components/admin/SessionProvider'

export const metadata = { title: 'Admin - Nguoi Tre Xay Nha' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
