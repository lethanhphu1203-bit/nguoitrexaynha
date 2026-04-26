import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import Script from 'next/script'
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
  verification: {
    google: 'OyomvkyvUbzkob3Fr7wrTnPGaaW2O8gOVAim-s21W6o',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PF57F942');`}
        </Script>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#f9f9f9] text-[#1a1c1c] min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PF57F942"
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
