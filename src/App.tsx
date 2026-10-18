import { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { AuthModal } from './components/AuthModal'
import { CitizenDashboard } from './components/CitizenDashboard'
import { CreateRequestModal } from './components/CreateRequestModal'
import { requestService } from './services/requestService'
import type { ServiceRequest } from './types'

function DashboardShell() {
  const { user, role, demoLogin } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await requestService.getRequests()
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleSelectRequest = (request: ServiceRequest) => {
    alert(`Selected Request: ${request.trackingNumber}\nTitle: ${request.title}\nStatus: ${request.status}`)
  }

  const handleCreatedSuccess = () => {
    fetchRequests()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onResetData={fetchRequests}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <span>Republic of Kenya • eCitizen Civic Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              HudumaTrack Public Service Request Desk
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Track infrastructure issues, report utility faults, and monitor municipal service resolution across all 47 counties in real time.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-98"
              >
                + Submit Service Request
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => demoLogin('citizen')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    role === 'citizen'
                      ? 'bg-emerald-700/80 border-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  Citizen View
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin('admin')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    role === 'admin'
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  Admin View
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-xs font-medium text-slate-300 hover:text-white underline ml-auto"
              >
                {user ? `Signed in as ${user.name}` : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        <CitizenDashboard
          requests={requests}
          loading={loading}
          onSelectRequest={handleSelectRequest}
          onNewRequest={() => setCreateModalOpen(true)}
        />
      </main>

      <CreateRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreatedSuccess}
      />

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
