export type Role = 'citizen' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  nationalId: string
  role: Role
  county?: string
  ward?: string
  createdAt: string
}

export type RequestCategory = 
  | 'water_sanitation'
  | 'roads_transport'
  | 'energy_lighting'
  | 'waste_environment'
  | 'public_safety'
  | 'public_health'

export type RequestStatus = 
  | 'pending'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected'

export type RequestPriority = 'low' | 'medium' | 'high' | 'critical'

export interface TimelineEvent {
  id: string
  requestId: string
  status: RequestStatus
  timestamp: string
  updatedBy: string
  role: Role
  notes: string
  isPublic: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface ServiceRequest {
  id: string
  trackingNumber: string
  title: string
  description: string
  category: RequestCategory
  priority: RequestPriority
  status: RequestStatus
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
  assignedDepartment: string
  assignedOfficer?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  slaHours: number
  slaDeadline: string
  attachments: Attachment[]
  timeline: TimelineEvent[]
}

export interface CountyInfo {
  code: string
  name: string
  subCounties: {
    name: string
    wards: string[]
  }[]
}

export interface CategoryMeta {
  id: RequestCategory
  name: string
  description: string
  icon: string
  slaStandardHours: number
  department: string
}
