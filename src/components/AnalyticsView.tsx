import { useMemo } from 'react'
import type { ServiceRequest } from '../types'
import { SERVICE_CATEGORIES } from '../data/categories'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import {
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react'

interface AnalyticsViewProps {
  requests: ServiceRequest[]
}

const CATEGORY_COLORS: Record<string, string> = {
  water_sanitation: '#0284c7',
  roads_transport: '#ea580c',
  energy_lighting: '#eab308',
  waste_environment: '#16a34a',
  public_safety: '#dc2626',
  public_health: '#9333ea'
}

export function AnalyticsView({ requests }: AnalyticsViewProps) {
  const countyData = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      counts[r.county] = (counts[r.county] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({
      name,
      requests: count
    }))
  }, [requests])

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1
    })
    return Object.entries(counts).map(([catId, count]) => {
      const meta = SERVICE_CATEGORIES.find((c) => c.id === catId)
      return {
        name: meta ? meta.name : catId,
        value: count,
        color: CATEGORY_COLORS[catId] || '#64748b'
      }
    })
  }, [requests])

  const { slaMetRate, avgHours, resolvedTotal } = useMemo(() => {
    const resolved = requests.filter((r) => r.status === 'resolved')
    if (resolved.length === 0) {
      return { slaMetRate: 100, avgHours: 0, resolvedTotal: 0 }
    }

    let onTimeCount = 0
    let totalDurationMs = 0

    resolved.forEach((r) => {
      const created = new Date(r.createdAt).getTime()
      const resolvedDate = r.resolvedAt ? new Date(r.resolvedAt).getTime() : new Date(r.updatedAt).getTime()
      const deadline = new Date(r.slaDeadline).getTime()

      if (resolvedDate <= deadline) {
        onTimeCount++
      }
      totalDurationMs += Math.max(0, resolvedDate - created)
    })

    const rate = Math.round((onTimeCount / resolved.length) * 100)
    const avg = Math.round(totalDurationMs / (resolved.length * 1000 * 60 * 60))

    return { slaMetRate: rate, avgHours: avg, resolvedTotal: resolved.length }
  }, [requests])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Civic Operations & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time public service metrics and SLA compliance across Kenyan devolved county governments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Analytics Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SLA Compliance Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{slaMetRate}%</span>
            <span className="text-xs text-slate-500">within deadline</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all"
              style={{ width: `${slaMetRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Resolution Time
            </span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgHours}h</span>
            <span className="text-xs text-slate-500">from report to fix</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target SLA benchmark: 24h - 48h
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Resolved Cases
            </span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-800">{resolvedTotal}</span>
            <span className="text-xs text-slate-500">of {requests.length} requests</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {Math.round((resolvedTotal / (requests.length || 1)) * 100)}% overall completion rate
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Service Requests by County
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Total volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="requests" fill="#007a3d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Requests by Domain Category
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Sector share</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
