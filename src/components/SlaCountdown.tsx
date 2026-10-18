import { useState, useEffect } from 'react'
import type { RequestStatus } from '../types'
import { Clock, AlertOctagon, CheckCircle2 } from 'lucide-react'

interface SlaCountdownProps {
  deadline: string
  status: RequestStatus
}

export function SlaCountdown({ deadline, status }: SlaCountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isBreached, setIsBreached] = useState(false)

  useEffect(() => {
    if (status === 'resolved' || status === 'rejected') return

    const updateTimer = () => {
      const now = new Date().getTime()
      const end = new Date(deadline).getTime()
      const diff = end - now

      if (diff <= 0) {
        setIsBreached(true)
        const overdueHours = Math.abs(Math.floor(diff / (1000 * 60 * 60)))
        setTimeLeft(`${overdueHours}h overdue`)
      } else {
        setIsBreached(false)
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m remaining`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 60000)
    return () => clearInterval(timer)
  }, [deadline, status])

  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" />
        SLA Met
      </span>
    )
  }

  if (status === 'rejected') {
    return null
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
        isBreached
          ? 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse'
          : 'text-amber-800 bg-amber-50 border-amber-200'
      }`}
    >
      {isBreached ? (
        <AlertOctagon className="w-3 h-3 text-rose-600" />
      ) : (
        <Clock className="w-3 h-3 text-amber-600" />
      )}
      <span>{timeLeft}</span>
    </span>
  )
}
