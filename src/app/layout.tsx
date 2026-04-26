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
  metadataBase: new URL('https://nguoitrexaynha.vercel.app'),
  title: {
    default: 'Người Trẻ Xây Nhà — Thông tin BDS Khu Đông TP.HCM',
    template: '%s | Người Trẻ Xây Nhà',
  },
  description: 'Thông tin dự án bất động sản, phân tích thị trường và kinh nghiệm mua nhà tại khu Đông TP.HCM — Thủ Thiêm, Thảo Điền, An Phú, Vinhomes Grand Park.',
  keywords: ['bất động sản khu Đông', 'căn hộ TP Thủ Đức', 'The Global City', 'Vinhomes Grand Park', 'mua nhà TP.HCM'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://nguoitrexaynha.vercel.app',
    siteName: 'Người Trẻ Xây Nhà',
    title: 'Người Trẻ Xây Nhà — Thông tin BDS Khu Đông TP.HCM',
    description: 'Thông tin dự án bất động sản, phân tích thị trường và kinh nghiệm mua nhà tại khu Đông TP.HCM.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#f9f9f9] text-[#1a1c1c] min-h-screen">
        {children}
      </body>
    </html>
  )
}
