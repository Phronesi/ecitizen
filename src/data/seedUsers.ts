import { User } from '../types'

export const DEMO_CITIZEN_USER: User = {
  id: 'cit-001',
  name: 'Faith Wanjiku Mwangi',
  email: 'faith.wanjiku@gmail.com',
  phone: '+254712345678',
  nationalId: '29482910',
  role: 'citizen',
  county: 'Nairobi City',
  ward: 'Woodley/Kenyatta Golf Course',
  createdAt: '2026-01-15T08:00:00Z'
}

export const DEMO_ADMIN_USER: User = {
  id: 'adm-001',
  name: 'Eng. Kevin Ochieng',
  email: 'admin.desk@hudumatrack.go.ke',
  phone: '+254700000001',
  nationalId: '21098456',
  role: 'admin',
  county: 'Nairobi City',
  ward: 'Nairobi Central',
  createdAt: '2025-06-01T08:00:00Z'
}

export const SEED_USERS: User[] = [
  DEMO_CITIZEN_USER,
  DEMO_ADMIN_USER,
  {
    id: 'cit-002',
    name: 'Brian Kipkorir Sang',
    email: 'brian.sang@outlook.com',
    phone: '+254722998877',
    nationalId: '31284729',
    role: 'citizen',
    county: 'Uasin Gishu',
    ward: 'Huruma',
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'cit-003',
    name: 'Amina Ali Hassan',
    email: 'amina.hassan@coastmarket.ke',
    phone: '+254733445566',
    nationalId: '25481903',
    role: 'citizen',
    county: 'Mombasa',
    ward: 'Kongowea',
    createdAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'cit-004',
    name: 'David Njuguna Kamau',
    email: 'david.kamau@keinfra.co.ke',
    phone: '+254701239845',
    nationalId: '22839485',
    role: 'citizen',
    county: 'Machakos',
    ward: 'Athi River',
    createdAt: '2026-03-15T09:30:00Z'
  }
]
