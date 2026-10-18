import { useState } from 'react'
import type { ServiceRequest, RequestStatus } from '../types'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { SlaCountdown } from './SlaCountdown'
import { useAuth } from '../context/AuthContext'
import { requestService } from '../services/requestService'
import {
  X,
  MapPin,
  Building,
  User as UserIcon,
  Printer,
  Copy,
  Check,
  Send,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'

interface RequestDetailModalProps {
  request: ServiceRequest | null
  isOpen: boolean
  onClose: () => void
  onUpdateRequest: (updated: ServiceRequest) => void
}

export function RequestDetailModal({
  request,
  isOpen,
  onClose,
  onUpdateRequest
}: RequestDetailModalProps) {
  const { user, role } = useAuth()
  const [copied, setCopied] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [submittingNote, setSubmittingNote] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(
    request?.status || 'pending'
  )
  const [assignedOfficerName, setAssignedOfficerName] = useState(
    request?.assignedOfficer || ''
  )
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'actions'>('timeline')

  if (!isOpen || !request) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(request.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleAddTimelineUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setSubmittingNote(true)
    try {
      const updated = await requestService.updateRequestStatus({
        id: request.id,
        status: selectedStatus,
        notes: newNote.trim(),
        updatedBy: user?.name || (role === 'admin' ? 'Duty Officer' : 'Citizen'),
        role: role || 'citizen',
        assignedOfficer: assignedOfficerName.trim() || request.assignedOfficer,
        isPublic: true
      })
      onUpdateRequest(updated)
      setNewNote('')
      alert('Timeline update recorded successfully.')
    } finally {
      setSubmittingNote(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        <div className="flag-ribbon w-full shrink-0" />

        <div className="p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {request.trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-emerald-700 p-1"
                    title="Copy tracking number"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {request.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SlaCountdown deadline={request.slaDeadline} status={request.status} />

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Ticket</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-200 mt-4 -mb-4 sm:-mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Audit Timeline ({request.timeline.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Issue & Geographic Details
            </button>
            {role === 'admin' && (
              <button
                type="button"
                onClick={() => setActiveTab('actions')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'actions'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Officer Dispatch Controls
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Public Service Request Lifecycle
                </h3>
                <p className="text-xs text-slate-500">
                  All officer field dispatches, status milestones, and notes are logged in accordance with eCitizen transparent governance standards.
                </p>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {request.timeline.map((event) => (
                  <div key={event.id} className="relative group">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                        event.status === 'resolved'
                          ? 'border-emerald-500 text-emerald-600'
                          : event.status === 'in_progress'
                          ? 'border-indigo-500 text-indigo-600'
                          : event.status === 'under_review'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-amber-500 text-amber-600'
                      }`}
                    >
                      {event.status === 'resolved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : event.status === 'in_progress' ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {event.updatedBy}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              event.role === 'admin'
                                ? 'bg-slate-900 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {event.role === 'admin' ? 'Officer' : 'Citizen'}
                          </span>
                          <StatusBadge status={event.status} />
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {new Date(event.timestamp).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {event.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTimelineUpdate} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">
                    Add Official Note or Progress Update
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Posting as: <strong className="text-slate-800">{user?.name || 'Citizen'}</strong> ({role})
                  </span>
                </div>

                <textarea
                  required
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={
                    role === 'admin'
                      ? 'Add field inspection note, materials dispatched, or progress update...'
                      : 'Add additional details or citizen observation...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />

                <div className="flex items-center justify-between">
                  {role === 'admin' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={submittingNote}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingNote ? 'Saving...' : 'Post Update'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Detailed Issue Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Geographic Administrative Location</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong className="text-slate-500">County:</strong> {request.county}</p>
                    <p><strong className="text-slate-500">Sub-County:</strong> {request.subCounty}</p>
                    <p><strong className="text-slate-500">Ward:</strong> {request.ward}</p>
                    <p><strong className="text-slate-500">Notable Landmark:</strong> {request.landmark}</p>
                    <p><strong className="text-slate-500">Address:</strong> {request.address}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Department & SLA Oversight</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong className="text-slate-500">Directorate:</strong> {request.assignedDepartment}</p>
                    <p><strong className="text-slate-500">Assigned Officer:</strong> {request.assignedOfficer || 'Unassigned / Dispatch Desk'}</p>
                    <p><strong className="text-slate-500">Standard SLA:</strong> {request.slaHours} Hours</p>
                    <p><strong className="text-slate-500">Target Deadline:</strong> {new Date(request.slaDeadline).toLocaleString('en-GB')}</p>
                    {request.resolvedAt && (
                      <p><strong className="text-slate-500">Resolved At:</strong> {new Date(request.resolvedAt).toLocaleString('en-GB')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-700" />
                  <span>Lodging Citizen Verification (Confidential)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Name</span>
                    <span className="font-bold text-slate-900">{request.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">National ID</span>
                    <span className="font-bold text-slate-900">{request.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Phone</span>
                    <span className="font-bold text-slate-900">{request.citizenPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Email</span>
                    <span className="font-bold text-slate-900 truncate block">{request.citizenEmail}</span>
                  </div>
                </div>
              </div>

              {request.attachments && request.attachments.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Attached Photos & Evidence</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {request.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-3 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{att.name}</p>
                            <span className="text-[10px] text-slate-400">
                              {(att.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg shrink-0"
                          title="View attachment"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && role === 'admin' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Officer Reassignment & Rapid Escalation
                </h3>
                <p className="text-xs text-slate-500">
                  Assign dedicated public works engineering personnel or update priority classification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Field Officer
                  </label>
                  <input
                    type="text"
                    value={assignedOfficerName}
                    onChange={(e) => setAssignedOfficerName(e.target.value)}
                    placeholder="e.g. Eng. Kevin Ochieng"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Status Override
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddTimelineUpdate}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow-sm"
                >
                  Save Dispatch Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
