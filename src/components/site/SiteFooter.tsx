import Link from 'next/link'

interface Props {
  menu: any[]
  config: Record<string, string>
}

export default function SiteFooter({ menu, config }: Props) {
  return (
    <footer className="bg-[#003629] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-serif font-black text-xl tracking-tight mb-3">
              {config.ten_website || 'NGUOITREXAYNHA'}
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              {config.mo_ta_website || ''}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {config.facebook && (
                <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-xs transition-colors">Facebook</a>
              )}
              {config.instagram && (
                <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-xs transition-colors">Instagram</a>
              )}
              {config.youtube && (
                <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-xs transition-colors">YouTube</a>
              )}
              {config.zalo && (
                <a href={`https://zalo.me/${config.zalo}`} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-xs transition-colors">Zalo</a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">Điều hướng</h3>
            <nav className="space-y-2">
              {menu.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.duong_dan}
                  className="block text-white/60 hover:text-white text-sm transition-colors"
                >
                  {item.ten}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">Liên hệ</h3>
            <div className="space-y-2 text-sm text-white/60">
              {config.email_lien_he && <p>{config.email_lien_he}</p>}
              {config.so_dien_thoai && <p>{config.so_dien_thoai}</p>}
              {config.dia_chi && <p>{config.dia_chi}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {config.ten_website || 'Nguoi Tre Xay Nha'}. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Built with Next.js & Vercel</p>
        </div>
      </div>
    </footer>
  )
}
