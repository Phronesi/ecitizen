import { Phone, Mail, Globe, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/ecitizen-logo.jpg" alt="eCitizen Kenya" className="h-7 w-auto brightness-95 contrast-125" />
              <span className="text-white font-bold text-sm tracking-tight">HudumaTrack</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official public service tracking and municipal reporting portal built for the Republic of Kenya citizen engagement.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              Civic Helplines
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+254 (020) 222-7411</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">support@hudumatrack.ecitizen.go.ke</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nairobi, Kenya • 47 County Desks</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              Devolved Counties
            </h4>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos', 'Kilifi'].map((c) => (
                <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              eCitizen Standards
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px]">
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Compliant with Kenya Data Protection Act 2019 and eCitizen interoperability guidelines.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Republic of Kenya • HudumaTrack eCitizen Service Desk. All rights reserved.</p>
          <div className="flex items-center justify-center gap-1 text-slate-400">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-slate-300">by Rose Gichini</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
