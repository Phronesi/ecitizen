import React, { useState } from 'react'
import { X, Shield, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { KENYAN_COUNTIES } from '../data/counties'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, demoLogin, register } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [identifier, setIdentifier] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+2547')
  const [nationalId, setNationalId] = useState('')
  const [county, setCounty] = useState(KENYAN_COUNTIES[0].name)
  const [ward, setWard] = useState(KENYAN_COUNTIES[0].subCounties[0].wards[0])

  if (!isOpen) return null

  const selectedCountyData = KENYAN_COUNTIES.find((c) => c.name === county) || KENYAN_COUNTIES[0]
  const availableWards = selectedCountyData.subCounties.flatMap((s) => s.wards)

  const handleDemoLogin = async (role: 'citizen' | 'admin') => {
    setError(null)
    setLoading(true)
    try {
      await demoLogin(role)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setError('Please enter your National ID, Phone Number, or Email.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await login(identifier)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !nationalId.trim() || !phone.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await register({
        name,
        email,
        phone,
        nationalId,
        county,
        ward
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flag-ribbon w-full" />

        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img src="/ecitizen-logo.jpg" alt="eCitizen" className="h-7 w-auto" />
              <span className="text-sm font-bold text-slate-800">HudumaTrack Desk</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Reviewer Quick Access (1-Click)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('citizen')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all active:scale-98"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Demo Citizen
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-black text-white shadow-xs transition-all active:scale-98"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Demo Admin
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-200 mt-5">
            <button
              type="button"
              onClick={() => {
                setTab('login')
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${
                tab === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register')
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${
                tab === 'register'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Citizen Registration
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  National ID, Email, or Phone
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 29482910 or faith.wanjiku@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                {loading ? 'Authenticating...' : 'Sign In with eCitizen'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500">
                  Demo Citizen National ID:{' '}
                  <button
                    type="button"
                    onClick={() => setIdentifier('29482910')}
                    className="font-semibold text-emerald-700 underline"
                  >
                    29482910
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as on National ID)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grace Nyambura Kimani"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID Number
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 30129482"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone (+254)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2547XXXXXXXX"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="grace.kimani@gmail.com"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    County
                  </label>
                  <select
                    value={county}
                    onChange={(e) => {
                      const newCounty = e.target.value
                      setCounty(newCounty)
                      const cData = KENYAN_COUNTIES.find((c) => c.name === newCounty)
                      if (cData && cData.subCounties[0]?.wards[0]) {
                        setWard(cData.subCounties[0].wards[0])
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ward
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {availableWards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                {loading ? 'Creating Account...' : 'Register Citizen Account'}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured with Republic of Kenya eCitizen SSO Standards</span>
          </div>
        </div>
      </div>
    </div>
  )
}
