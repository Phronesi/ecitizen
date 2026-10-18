import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, Role } from '../types'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  role: Role | null
  loading: boolean
  login: (identifier: string) => Promise<User>
  demoLogin: (role: Role) => Promise<User>
  register: (data: {
    name: string
    email: string
    phone: string
    nationalId: string
    county: string
    ward: string
  }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
  }, [])

  const login = async (identifier: string) => {
    setLoading(true)
    try {
      const u = await authService.login(identifier)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async (targetRole: Role) => {
    setLoading(true)
    try {
      const u = await authService.demoLogin(targetRole)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: {
    name: string
    email: string
    phone: string
    nationalId: string
    county: string
    ward: string
  }) => {
    setLoading(true)
    try {
      const u = await authService.register(data)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        demoLogin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
