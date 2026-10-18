export const STORAGE_KEYS = {
  REQUESTS: 'hudumatrack_service_requests_v1',
  USERS: 'hudumatrack_users_v1',
  SESSION: 'hudumatrack_session_user_v1',
} as const

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {}
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch {}
  }
}

export function simulateLatency(min = 200, max = 350): Promise<void> {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, duration))
}
