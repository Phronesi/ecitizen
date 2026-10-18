import { useState } from 'react'
import type { ServiceRequest, RequestCategory } from '../types'
import { SERVICE_CATEGORIES } from '../data/categories'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { SlaCountdown } from './SlaCountdown'
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Building, 
  Copy, 
  Check, 
  ArrowRight, 
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

interface CitizenDashboardProps {
  requests: ServiceRequest[]
  loading: boolean
  onSelectRequest: (request: ServiceRequest) => void
  onNewRequest: () => void
}

export function CitizenDashboard({
  requests,
  loading,
  onSelectRequest,
  onNewRequest
}: CitizenDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.landmark.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || req.category === selectedCategory

    const matchesStatus =
      statusFilter === 'all' || req.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalCount = requests.length
  const pendingCount = requests.filter((r) => r.status === 'pending' || r.status === 'under_review').length
  const inProgressCount = requests.filter((r) => r.status === 'in_progress').length
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length

  const getCategoryName = (catId: RequestCategory) => {
    return SERVICE_CATEGORIES.find((c) => c.id === catId)?.name || catId
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Requests
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </p>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-2xl font-black text-indigo-700 mt-1">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking number (e.g. REQ-2026-0842), title, county, or landmark..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            onClick={onNewRequest}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Request</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
          {['all', 'pending', 'under_review', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading civic service requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Service Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No requests matched your search criteria or category filter. Try clearing filters or submit a new report.
          </p>
          <button
            type="button"
            onClick={onNewRequest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit First Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                    {req.trackingNumber}
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, req.trackingNumber)}
                      title="Copy tracking number"
                      className="text-slate-400 hover:text-emerald-700 transition-colors"
                    >
                      {copiedId === req.trackingNumber ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {getCategoryName(req.category)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority={req.priority} />
                  <StatusBadge status={req.status} />
                  <SlaCountdown deadline={req.slaDeadline} status={req.status} />
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-1.5">
                {req.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {req.description}
              </p>

              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.ward}, {req.county}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[200px]">{req.assignedDepartment}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  <span>View Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
