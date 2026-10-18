import type { ServiceRequest, RequestStatus, Role, TimelineEvent } from '../types'
import { SEED_SERVICE_REQUESTS } from '../data/seedRequests'
import { SEED_USERS } from '../data/seedUsers'
import { SERVICE_CATEGORIES } from '../data/categories'
import { storage, STORAGE_KEYS, simulateLatency } from './storageService'

function initializeRequests(): ServiceRequest[] {
  const existing = storage.get<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, [])
  if (existing.length === 0) {
    storage.set(STORAGE_KEYS.REQUESTS, SEED_SERVICE_REQUESTS)
    return SEED_SERVICE_REQUESTS
  }
  return existing
}

function generateTrackingNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `REQ-2026-${randomSuffix}`
}

export const requestService = {
  async getRequests(): Promise<ServiceRequest[]> {
    await simulateLatency(200, 350)
    return initializeRequests()
  },

  async getRequestById(id: string): Promise<ServiceRequest | null> {
    await simulateLatency(150, 250)
    const requests = initializeRequests()
    return requests.find((r) => r.id === id) || null
  },

  async getRequestByTrackingNumber(trackingNumber: string): Promise<ServiceRequest | null> {
    await simulateLatency(200, 300)
    const requests = initializeRequests()
    const cleanNumber = trackingNumber.trim().toUpperCase()
    return requests.find((r) => r.trackingNumber.toUpperCase() === cleanNumber) || null
  },

  async createRequest(payload: {
    title: string
    description: string
    category: ServiceRequest['category']
    priority: ServiceRequest['priority']
    county: string
    subCounty: string
    ward: string
    landmark: string
    address: string
    citizenId: string
    citizenName: string
    citizenPhone: string
    citizenEmail: string
    nationalId: string
    attachments?: ServiceRequest['attachments']
  }): Promise<ServiceRequest> {
    await simulateLatency(300, 500)
    const requests = initializeRequests()

    const categoryMeta = SERVICE_CATEGORIES.find((c) => c.id === payload.category)
    const slaHours = categoryMeta ? categoryMeta.slaStandardHours : 24
    const now = new Date()
    const deadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000)

    const requestId = `req-${Date.now().toString(36)}`
    const trackingNumber = generateTrackingNumber()

    const initialTimeline: TimelineEvent = {
      id: `tl-${Date.now().toString(36)}`,
      requestId,
      status: 'pending',
      timestamp: now.toISOString(),
      updatedBy: payload.citizenName,
      role: 'citizen',
      notes: 'Service request registered via HudumaTrack eCitizen portal.',
      isPublic: true
    }

    const newRequest: ServiceRequest = {
      id: requestId,
      trackingNumber,
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category,
      priority: payload.priority,
      status: 'pending',
      county: payload.county,
      subCounty: payload.subCounty,
      ward: payload.ward,
      landmark: payload.landmark.trim(),
      address: payload.address.trim(),
      citizenId: payload.citizenId,
      citizenName: payload.citizenName,
      citizenPhone: payload.citizenPhone,
      citizenEmail: payload.citizenEmail,
      nationalId: payload.nationalId,
      assignedDepartment: categoryMeta ? categoryMeta.department : 'County Public Works Directorate',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaHours,
      slaDeadline: deadline.toISOString(),
      attachments: payload.attachments || [],
      timeline: [initialTimeline]
    }

    const updated = [newRequest, ...requests]
    storage.set(STORAGE_KEYS.REQUESTS, updated)
    return newRequest
  },

  async updateRequestStatus(params: {
    id: string
    status: RequestStatus
    notes: string
    updatedBy: string
    role: Role
    assignedOfficer?: string
    isPublic?: boolean
  }): Promise<ServiceRequest> {
    await simulateLatency(250, 400)
    const requests = initializeRequests()
    const index = requests.findIndex((r) => r.id === params.id)

    if (index === -1) {
      throw new Error('Service request not found.')
    }

    const current = requests[index]
    const now = new Date().toISOString()

    const newTimelineEvent: TimelineEvent = {
      id: `tl-${Date.now().toString(36)}`,
      requestId: current.id,
      status: params.status,
      timestamp: now,
      updatedBy: params.updatedBy,
      role: params.role,
      notes: params.notes.trim() || `Status updated to ${params.status}`,
      isPublic: params.isPublic ?? true
    }

    const updatedRequest: ServiceRequest = {
      ...current,
      status: params.status,
      updatedAt: now,
      assignedOfficer: params.assignedOfficer || current.assignedOfficer,
      resolvedAt: params.status === 'resolved' ? now : current.resolvedAt,
      timeline: [...current.timeline, newTimelineEvent]
    }

    requests[index] = updatedRequest
    storage.set(STORAGE_KEYS.REQUESTS, requests)
    return updatedRequest
  },

  async resetDemoData(): Promise<void> {
    await simulateLatency(200, 350)
    storage.set(STORAGE_KEYS.REQUESTS, SEED_SERVICE_REQUESTS)
    storage.set(STORAGE_KEYS.USERS, SEED_USERS)
  }
}
