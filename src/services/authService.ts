import type { User, Role } from '../types'
import { SEED_USERS, DEMO_CITIZEN_USER, DEMO_ADMIN_USER } from '../data/seedUsers'
import { storage, STORAGE_KEYS, simulateLatency } from './storageService'

function initializeUsers(): User[] {
  const existing = storage.get<User[]>(STORAGE_KEYS.USERS, [])
  if (existing.length === 0) {
    storage.set(STORAGE_KEYS.USERS, SEED_USERS)
    return SEED_USERS
  }
  return existing
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await simulateLatency(100, 200)
    return storage.get<User | null>(STORAGE_KEYS.SESSION, DEMO_CITIZEN_USER)
  },

  async login(identifier: string): Promise<User> {
    await simulateLatency(250, 400)
    const users = initializeUsers()
    const cleanId = identifier.trim().toLowerCase()
    
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/\s+/g, '') === cleanId ||
        u.nationalId === cleanId
    )

    if (!user) {
      throw new Error('Account not found with provided Email, Phone, or National ID.')
    }

    storage.set(STORAGE_KEYS.SESSION, user)
    return user
  },

  async demoLogin(role: Role): Promise<User> {
    await simulateLatency(150, 300)
    initializeUsers()
    const targetUser = role === 'admin' ? DEMO_ADMIN_USER : DEMO_CITIZEN_USER
    storage.set(STORAGE_KEYS.SESSION, targetUser)
    return targetUser
  },

  async register(data: {
    name: string
    email: string
    phone: string
    nationalId: string
    county: string
    ward: string
  }): Promise<User> {
    await simulateLatency(300, 500)
    const users = initializeUsers()

    const exists = users.some(
      (u) =>
        u.email.toLowerCase() === data.email.trim().toLowerCase() ||
        u.nationalId === data.nationalId.trim()
    )

    if (exists) {
      throw new Error('A citizen account already exists with this Email or National ID.')
    }

    const newUser: User = {
      id: `cit-${Date.now().toString(36)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      nationalId: data.nationalId.trim(),
      role: 'citizen',
      county: data.county,
      ward: data.ward,
      createdAt: new Date().toISOString()
    }

    const updated = [newUser, ...users]
    storage.set(STORAGE_KEYS.USERS, updated)
    storage.set(STORAGE_KEYS.SESSION, newUser)
    return newUser
  },

  async logout(): Promise<void> {
    await simulateLatency(100, 200)
    storage.remove(STORAGE_KEYS.SESSION)
  },

  async getUsers(): Promise<User[]> {
    return initializeUsers()
  }
}
