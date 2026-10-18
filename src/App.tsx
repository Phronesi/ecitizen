import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { AuthModal } from './components/AuthModal'
import { FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

function DashboardShell() {
  const { user, role, demoLogin } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)} 
        onResetData={() => window.location.reload()}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <span>eCitizen Kenya Public Service Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              HudumaTrack Service Request Desk
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Track, submit, and oversee citizen municipal and public utility service requests across all 47 counties with transparent SLA accountability.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <span>Switch / Sign In Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => demoLogin('citizen')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                >
                  Citizen View
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin('admin')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                >
                  Admin View
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Current Mode
              </p>
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {role === 'admin' ? 'Admin Officer Desk' : 'Citizen Self-Service'}
              </h2>
              <p className="text-xs text-slate-500">
                {user?.name || 'Guest Citizen'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                County Ward
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                {user?.county || 'Nairobi City'}
              </h2>
              <p className="text-xs text-slate-500">
                {user?.ward || 'Central'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Security & SSO
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                National ID Verified
              </h2>
              <p className="text-xs text-slate-500">
                ID: {user?.nationalId || '29482910'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Authentication & Civic Navigation Active
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Logged in as <span className="font-semibold text-slate-900">{user?.name}</span> ({role}). Ready for Phase 5 Citizen Dashboard & Request Tracker.
            </p>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardShell />
    </AuthProvider>
  )
}
