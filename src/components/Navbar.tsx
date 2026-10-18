import { useState } from 'react'
import { Shield, User as UserIcon, RefreshCw, LogOut, ArrowRightLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { requestService } from '../services/requestService'

interface NavbarProps {
  onOpenAuth: () => void
  onResetData?: () => void
}

export function Navbar({ onOpenAuth, onResetData }: NavbarProps) {
  const { user, role, demoLogin, logout } = useAuth()
  const [resetting, setResetting] = useState(false)

  const handleToggleRole = async () => {
    const nextRole = role === 'admin' ? 'citizen' : 'admin'
    await demoLogin(nextRole)
  }

  const handleResetData = async () => {
    if (window.confirm('Reset all demo service requests and users to default state?')) {
      setResetting(true)
      try {
        await requestService.resetDemoData()
        if (onResetData) {
          onResetData()
        }
      } finally {
        setResetting(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="flag-ribbon w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/ecitizen-logo.jpg"
              alt="eCitizen Kenya"
              className="h-9 w-auto object-contain"
            />
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  HudumaTrack
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  eCitizen
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Republic of Kenya Public Service Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleResetData}
              disabled={resetting}
              title="Reset Demo Data"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset Demo Data</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleToggleRole}
                  title={`Switch to ${role === 'admin' ? 'Citizen' : 'Admin'} mode`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    Switch to {role === 'admin' ? 'Citizen' : 'Admin'}
                  </span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                    {role === 'admin' ? (
                      <Shield className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 capitalize">
                      {role === 'admin' ? 'Administrative Officer' : `Citizen • ${user.county || 'Kenya'}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
