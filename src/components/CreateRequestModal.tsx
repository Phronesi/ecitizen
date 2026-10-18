import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import type { ServiceRequest, RequestCategory, RequestPriority, Attachment } from '../types'
import { SERVICE_CATEGORIES } from '../data/categories'
import { KENYAN_COUNTIES } from '../data/counties'
import { useAuth } from '../context/AuthContext'
import { requestService } from '../services/requestService'
import {
  X,
  CheckCircle2,
  MapPin,
  FileText,
  Upload,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone
} from 'lucide-react'

interface CreateRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newRequest: ServiceRequest) => void
}

export function CreateRequestModal({
  isOpen,
  onClose,
  onSuccess
}: CreateRequestModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [submitting, setSubmitting] = useState(false)
  const [createdRequest, setCreatedRequest] = useState<ServiceRequest | null>(null)
  const [copied, setCopied] = useState(false)

  const [category, setCategory] = useState<RequestCategory>('water_sanitation')
  const [priority, setPriority] = useState<RequestPriority>('medium')
  const [county, setCounty] = useState(user?.county || KENYAN_COUNTIES[0].name)
  const [subCounty, setSubCounty] = useState(KENYAN_COUNTIES[0].subCounties[0].name)
  const [ward, setWard] = useState(user?.ward || KENYAN_COUNTIES[0].subCounties[0].wards[0])
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  if (!isOpen) return null

  const currentCountyData = KENYAN_COUNTIES.find((c) => c.name === county) || KENYAN_COUNTIES[0]
  const currentSubCountyData =
    currentCountyData.subCounties.find((s) => s.name === subCounty) || currentCountyData.subCounties[0]
  const availableWards = currentSubCountyData.wards

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty)
    const cData = KENYAN_COUNTIES.find((c) => c.name === newCounty)
    if (cData && cData.subCounties[0]) {
      setSubCounty(cData.subCounties[0].name)
      setWard(cData.subCounties[0].wards[0] || '')
    }
  }

  const handleSubCountyChange = (newSub: string) => {
    setSubCounty(newSub)
    const sData = currentCountyData.subCounties.find((s) => s.name === newSub)
    if (sData && sData.wards[0]) {
      setWard(sData.wards[0])
    }
  }

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments: Attachment[] = Array.from(files).map((f, i) => ({
      id: `att-${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type,
      size: f.size
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !landmark.trim()) {
      alert('Please fill in all required issue details.')
      return
    }

    setSubmitting(true)
    try {
      const newReq = await requestService.createRequest({
        title,
        description,
        category,
        priority,
        county,
        subCounty,
        ward,
        landmark,
        address: address || `${landmark}, ${ward}, ${county}`,
        citizenId: user?.id || 'guest-cit',
        citizenName: user?.name || 'Faith Wanjiku Mwangi',
        citizenPhone: user?.phone || '+254712345678',
        citizenEmail: user?.email || 'faith.wanjiku@gmail.com',
        nationalId: user?.nationalId || '29482910',
        attachments
      })

      setCreatedRequest(newReq)
      setStep(4)
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })
      onSuccess(newReq)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const selectedCategoryMeta = SERVICE_CATEGORIES.find((c) => c.id === category)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        <div className="flag-ribbon w-full" />

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img src="/ecitizen-logo.jpg" alt="eCitizen" className="h-6 w-auto" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {step === 4 ? 'Request Lodged Successfully' : 'Submit Public Service Request'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step < 4 && (
            <div className="flex items-center justify-between my-4 px-2">
              {[
                { s: 1, label: 'Category' },
                { s: 2, label: 'Location' },
                { s: 3, label: 'Issue Details' }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === item.s
                        ? 'bg-emerald-700 text-white'
                        : step > item.s
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline ${
                      step === item.s ? 'font-bold text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Select the municipal or public works domain that corresponds to your request:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SERVICE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      category === cat.id
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        {cat.slaStandardHours}h SLA
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Republic of Kenya Devolved Administrative Routing</p>
                  <p className="text-[11px] text-emerald-700">
                    Requests are routed directly to the sub-county public works dispatch desk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    County
                  </label>
                  <select
                    value={county}
                    onChange={(e) => handleCountyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
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
                    Sub-County / Constituency
                  </label>
                  <select
                    value={subCounty}
                    onChange={(e) => handleSubCountyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    {currentCountyData.subCounties.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    {availableWards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notable Landmark / Street Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Nyayo House, near stage 4, or 100m past petrol station"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exact Physical Address or Road Name (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Kenyatta Avenue, CBD, Nairobi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!landmark.trim()) {
                      alert('Please specify a landmark or street location.')
                      return
                    }
                    setStep(3)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  <span>Continue to Issue Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency / Priority Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'low', label: 'Low', color: 'border-slate-300' },
                    { id: 'medium', label: 'Medium', color: 'border-blue-400' },
                    { id: 'high', label: 'High', color: 'border-orange-400' },
                    { id: 'critical', label: 'Critical', color: 'border-rose-400' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id as RequestPriority)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border capitalize transition-all ${
                        priority === p.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 hover:bg-slate-50 ' + p.color
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Summary / Issue Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Burst water main flooding road outside market"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comprehensive Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context: when it started, extent of damage, safety impact on pedestrians or traffic..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photos or Evidence (Optional)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-600">
                    Click to attach incident photo or document
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 5MB</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSimulatedFileUpload}
                    className="hidden"
                  />
                </label>

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[140px]">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-400 hover:text-rose-600 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-800">Lodging Citizen:</p>
                <p className="text-slate-600">
                  {user?.name || 'Faith Wanjiku Mwangi'} • National ID: {user?.nationalId || '29482910'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Official status SMS updates will be routed to {user?.phone || '+254712345678'}.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
                >
                  {submitting ? 'Submitting to eCitizen Desk...' : 'Confirm & Submit Request'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && createdRequest && (
            <div className="space-y-5 py-2">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Service Request Registered
                </h3>
                <p className="text-xs text-slate-500">
                  Your issue has been logged into the national civic dispatch grid.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 font-mono text-xs space-y-3 print:border-black">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">
                      Tracking Number
                    </span>
                    <span className="text-lg font-black text-emerald-800">
                      {createdRequest.trackingNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(createdRequest.trackingNumber)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-300 font-sans text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700 font-sans text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Assigned Directorate</span>
                    <span className="font-bold text-slate-900">{createdRequest.assignedDepartment}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Location</span>
                    <span className="font-bold text-slate-900">{createdRequest.ward}, {createdRequest.county}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Target SLA Deadline</span>
                    <span className="font-bold text-amber-700">
                      {new Date(createdRequest.slaDeadline).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Status</span>
                    <span className="font-bold text-emerald-700 uppercase">Pending Review</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 font-sans">
                  <p className="font-bold">Simulated SMS Dispatch Notification</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    "GOK-eCitizen: Your request {createdRequest.trackingNumber} has been received and routed to {selectedCategoryMeta?.name}. Target resolution within {selectedCategoryMeta?.slaStandardHours}h."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Done & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
