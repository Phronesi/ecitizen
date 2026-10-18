import type { RequestPriority } from '../types'
import { AlertTriangle, AlertCircle, ArrowUpRight, ArrowDown } from 'lucide-react'

const PRIORITY_CONFIG: Record<RequestPriority, { label: string; bg: string; text: string; icon: typeof AlertTriangle }> = {
  critical: {
    label: 'Critical',
    bg: 'bg-rose-100 text-rose-800 border-rose-200',
    text: 'text-rose-700',
    icon: AlertTriangle
  },
  high: {
    label: 'High Priority',
    bg: 'bg-orange-100 text-orange-800 border-orange-200',
    text: 'text-orange-700',
    icon: AlertCircle
  },
  medium: {
    label: 'Medium',
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    text: 'text-slate-600',
    icon: ArrowUpRight
  },
  low: {
    label: 'Low Priority',
    bg: 'bg-slate-50 text-slate-600 border-slate-200',
    text: 'text-slate-500',
    icon: ArrowDown
  }
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${config.bg}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  )
}
