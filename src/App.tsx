import { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'
import { CitizenDashboard } from './components/CitizenDashboard'
import { AdminPortal } from './components/AdminPortal'
import { AnalyticsView } from './components/AnalyticsView'
import { CreateRequestModal } from './components/CreateRequestModal'
import { RequestDetailModal } from './components/RequestDetailModal'
import { requestService } from './services/requestService'
import type { ServiceRequest, RequestStatus } from './types'
import { BarChart3, ListFilter } from 'lucide-react'

function DashboardShell() {
  const { user, role, demoLogin } = useAuth()
  const { showToast } = useToast()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [viewTab, setViewTab] = useState<'tickets' | 'analytics'>('tickets')

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
    setSelectedRequest(request)
  }

  const handleCreatedSuccess = (newReq: ServiceRequest) => {
    fetchRequests()
    showToast(`Service Request ${newReq.trackingNumber} lodged successfully!`, 'success')
  }

  const handleUpdateRequest = (updated: ServiceRequest) => {
    setSelectedRequest(updated)
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    showToast(`Status updated to ${updated.status.replace('_', ' ')}.`, 'info')
  }

  const handleQuickStatusUpdate = async (id: string, status: RequestStatus, officer?: string) => {
    const updated = await requestService.updateRequestStatus({
      id,
      status,
      notes: `Admin quick dispatch: Status changed to ${status.replace('_', ' ')}.`,
      updatedBy: user?.name || 'Administrative Officer',
      role: 'admin',
      assignedOfficer: officer
    })
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    if (selectedRequest?.id === id) {
      setSelectedRequest(updated)
    }
    showToast(`Ticket ${updated.trackingNumber} assigned to ${officer || 'Duty Officer'} (${status.replace('_', ' ')}).`, 'success')
  }

  const handleResetData = async () => {
    await fetchRequests()
    showToast('Demo data and pre-seeded service requests restored.', 'info')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-6">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <span>Republic of Kenya • eCitizen Civic Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              {role === 'admin' ? 'Administrative Operations & Dispatch Desk' : 'HudumaTrack Public Service Request Desk'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {role === 'admin'
                ? 'Manage service requests across all 47 devolved counties, assign public works field personnel, and oversee SLA compliance.'
                : 'Track infrastructure issues, report utility faults, and monitor municipal service resolution across all 47 counties in real time.'}
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
                  onClick={async () => {
                    await demoLogin('citizen')
                    showToast('Switched to Citizen Self-Service view.', 'info')
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    role === 'citizen'
                      ? 'bg-emerald-700/80 border-emerald-500 text-white font-bold'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  Citizen View
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await demoLogin('admin')
                    showToast('Switched to Admin Dispatch Desk.', 'info')
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    role === 'admin'
                      ? 'bg-slate-800 border-slate-600 text-white font-bold'
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
                {user ? `Signed in as ${user.name} (${role})` : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewTab('tickets')}
              className={`inline-flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                viewTab === 'tickets'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>{role === 'admin' ? 'Dispatch Grid' : 'Service Requests'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab('analytics')}
              className={`inline-flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                viewTab === 'analytics'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Civic Analytics & SLA Metrics</span>
            </button>
          </div>
        </div>

        {viewTab === 'analytics' ? (
          <AnalyticsView requests={requests} />
        ) : role === 'admin' ? (
          <AdminPortal
            requests={requests}
            loading={loading}
            onSelectRequest={handleSelectRequest}
            onQuickStatusUpdate={handleQuickStatusUpdate}
          />
        ) : (
          <CitizenDashboard
            requests={requests}
            loading={loading}
            onSelectRequest={handleSelectRequest}
            onNewRequest={() => setCreateModalOpen(true)}
          />
        )}
      </main>

      <Footer />

      <CreateRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreatedSuccess}
      />

      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdateRequest={handleUpdateRequest}
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
      <ToastProvider>
        <DashboardShell />
      </ToastProvider>
    </AuthProvider>
  )
}
