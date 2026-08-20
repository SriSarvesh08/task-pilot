"use client"

import * as React from "react"
import { api } from "./api"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email?: string
  type: "guest" | "registered"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  loginGuest: () => Promise<void>
  login: (data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const checkAuth = React.useCallback(async () => {
    try {
      const data = await api.get<{ user: User }>("/auth/me")
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth()
  }, [checkAuth])

  const loginGuest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.post<{ user: User }>("/auth/guest")
      setUser(data.user)
      router.push("/workspace")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login as guest")
      setIsLoading(false)
    }
  }

  const login = async (credentials: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.post<{ user: User }>("/auth/login", credentials)
      setUser(data.user)
      router.push("/workspace")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login")
      setIsLoading(false)
      throw err
    }
  }

  const register = async (credentials: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.post<{ user: User }>("/auth/register", credentials)
      setUser(data.user)
      router.push("/workspace")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register")
      setIsLoading(false)
      throw err
    }
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      setUser(null)
      router.push("/login")
    } catch (err) {
      console.error("Failed to logout", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, loginGuest, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

