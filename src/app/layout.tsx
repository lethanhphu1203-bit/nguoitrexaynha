import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Nguoi Tre Xay Nha',
  description: 'Nền tảng kết nối người trẻ với giải pháp nhà ở thông minh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased bg-[#f9f9f9] text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
