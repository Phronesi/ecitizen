import { useState } from 'react'
import type { ServiceRequest, RequestStatus, RequestCategory } from '../types'
import { SERVICE_CATEGORIES } from '../data/categories'
import { KENYAN_COUNTIES } from '../data/counties'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { SlaCountdown } from './SlaCountdown'
import {
  Search,
  Filter,
  UserCheck,
  Eye,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react'

interface AdminPortalProps {
  requests: ServiceRequest[]
  loading: boolean
  onSelectRequest: (request: ServiceRequest) => void
  onQuickStatusUpdate: (id: string, status: RequestStatus, officer?: string) => Promise<void>
}

export function AdminPortal({
  requests,
  loading,
  onSelectRequest,
  onQuickStatusUpdate
}: AdminPortalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [countyFilter, setCountyFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [quickOfficer, setQuickOfficer] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.citizenPhone.includes(searchQuery) ||
      req.landmark.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCounty = countyFilter === 'all' || req.county === countyFilter
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter

    return matchesSearch && matchesCounty && matchesCategory && matchesStatus && matchesPriority
  })

  const totalCount = requests.length
  const unassignedCount = requests.filter((r) => !r.assignedOfficer && r.status !== 'resolved').length
  const criticalCount = requests.filter((r) => r.priority === 'critical' && r.status !== 'resolved').length
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length

  const handleQuickAssign = async (reqId: string, newStatus: RequestStatus) => {
    setUpdatingId(reqId)
    try {
      await onQuickStatusUpdate(reqId, newStatus, quickOfficer.trim() || undefined)
      setSelectedRequestId(null)
      setQuickOfficer('')
    } finally {
      setUpdatingId(null)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Tracking Number',
      'Title',
      'Category',
      'Priority',
      'Status',
      'County',
      'Ward',
      'Citizen Name',
      'Phone',
      'Assigned Officer',
      'Created At',
      'Deadline'
    ]

    const rows = filteredRequests.map((r) => [
      r.trackingNumber,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.priority,
      r.status,
      r.county,
      r.ward,
      `"${r.citizenName.replace(/"/g, '""')}"`,
      r.citizenPhone,
      `"${(r.assignedOfficer || 'Unassigned').replace(/"/g, '""')}"`,
      r.createdAt,
      r.slaDeadline
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `HudumaTrack_Export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCategoryName = (catId: RequestCategory) => {
    return SERVICE_CATEGORIES.find((c) => c.id === catId)?.name || catId
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Inflow
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unassigned Field Tickets
            </p>
            <p className="text-2xl font-black text-amber-700 mt-1">{unassignedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critical Urgency
            </p>
            <p className="text-2xl font-black text-rose-700 mt-1">{criticalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Successfully Resolved
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking #, citizen name, phone, landmark..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Filtered (CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              County
            </label>
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All 47 Counties</option>
              {KENYAN_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Domains</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="font-semibold text-slate-700">Dispatch Grid</span>
          <span className="text-emerald-700 font-medium">Scroll table horizontally →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Tracking #</th>
                <th className="py-3 px-4">Issue Headline</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">County / Ward</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Target SLA</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading dispatch grid...</p>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No service requests match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onSelectRequest(req)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {req.trackingNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {req.title}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {getCategoryName(req.category)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{req.county}</span>
                      <span className="text-[10px] text-slate-400 block">{req.ward}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={req.priority} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SlaCountdown deadline={req.slaDeadline} status={req.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {req.assignedOfficer ? (
                        <span className="font-medium">{req.assignedOfficer}</span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>

                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRequestId(req.id)}
                          title="Quick Assign / Transition"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectRequest(req)}
                          title="View Full Ticket"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequestId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Quick Dispatch & Status Override
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Field Officer
              </label>
              <input
                type="text"
                value={quickOfficer}
                onChange={(e) => setQuickOfficer(e.target.value)}
                placeholder="e.g. Eng. Kevin Ochieng"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                Set New Stage:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['under_review', 'in_progress', 'resolved', 'rejected'] as RequestStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={updatingId === selectedRequestId}
                    onClick={() => handleQuickAssign(selectedRequestId, st)}
                    className="py-1.5 px-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 capitalize text-slate-700 text-left transition-colors"
                  >
                    → {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequestId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
