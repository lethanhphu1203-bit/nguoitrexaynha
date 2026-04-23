import Link from 'next/link'

interface Props {
  menu: any[]
  config: Record<string, string>
}

export default function SiteFooter({ menu, config }: Props) {
  const headerMenu = menu.filter(m => m.vi_tri === 'header')
  const footerMenu = menu.filter(m => m.vi_tri === 'footer')

  return (
    <footer className="w-full pt-24 pb-12 bg-emerald-50/50">
      <div className="grid grid-cols-4 gap-12 max-w-[1440px] mx-auto px-8 lg:px-12">
        {/* Brand */}
        <div className="col-span-4 lg:col-span-1">
          <h2 className="font-serif font-bold text-xl text-[#1B4D3E] mb-6">
            {config.ten_website || 'NGUOI TRE XAY NHA'}
          </h2>
          <p className="text-[#404945] text-sm leading-relaxed">
            {config.mo_ta_website || 'Đồng hành cùng người trẻ trên hành trình sở hữu ngôi nhà đầu tiên.'}
          </p>
          <div className="flex gap-3 mt-6">
            {config.facebook && (
              <a href={config.facebook} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white hover:bg-[#003629] transition-colors text-xs font-bold">
                F
              </a>
            )}
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white hover:bg-[#003629] transition-colors text-xs font-bold">
                IG
              </a>
            )}
            {config.zalo && (
              <a href={`https://zalo.me/${config.zalo}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white hover:bg-[#003629] transition-colors text-xs font-bold">
                Z
              </a>
            )}
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h4 className="text-[#1B4D3E] font-bold mb-6">Liên kết nhanh</h4>
          <ul className="space-y-3">
            {headerMenu.map((item: any) => (
              <li key={item.id}>
                <Link href={item.duong_dan}
                  className="text-[#404945] hover:text-[#1B4D3E] hover:underline underline-offset-4 transition-all text-sm">
                  {item.ten}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h4 className="text-[#1B4D3E] font-bold mb-6">Hỗ trợ</h4>
          <ul className="space-y-3">
            {footerMenu.map((item: any) => (
              <li key={item.id}>
                <Link href={item.duong_dan}
                  className="text-[#404945] hover:text-[#1B4D3E] hover:underline underline-offset-4 transition-all text-sm">
                  {item.ten}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h4 className="text-[#1B4D3E] font-bold mb-6">Liên hệ</h4>
          <div className="space-y-3 text-sm text-[#404945]">
            {config.email_lien_he && <p>{config.email_lien_he}</p>}
            {config.so_dien_thoai && <p>{config.so_dien_thoai}</p>}
            {config.dia_chi && <p className="leading-relaxed">{config.dia_chi}</p>}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="col-span-4 border-t border-[#c0c9c3]/30 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[#404945] text-xs">
            © {new Date().getFullYear()} {config.ten_website || 'Nguoi Tre Xay Nha'}. All rights reserved.
          </p>
          <p className="text-[#404945] text-xs">Built with Next.js & Vercel</p>
        </div>
      </div>
    </footer>
  )
}
