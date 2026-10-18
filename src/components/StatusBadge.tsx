import type { RequestStatus } from '../types'
import { Clock, Eye, Wrench, CheckCircle2, XCircle } from 'lucide-react'

const STATUS_CONFIG: Record<RequestStatus, { label: string; bg: string; text: string; border: string; icon: typeof Clock }> = {
  pending: {
    label: 'Pending Review',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Clock
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: Eye
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: Wrench
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2
  },
  rejected: {
    label: 'Declined',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: XCircle
  }
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  )
}
