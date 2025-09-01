import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const user = await response.json()
            set({ user, isAuthenticated: true })
          } else {
            get().logout()
          }
        } catch (error) {
          console.error('Auth check error:', error)
          get().logout()
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = useAuthStore.getState().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Mock users for demonstration
export const MOCK_USERS = [
  { email: 'admin@hypesoft.com', password: 'admin123', role: 'Admin' },
  { email: 'manager@hypesoft.com', password: 'manager123', role: 'Manager' },
  { email: 'product@hypesoft.com', password: 'product123', role: 'ProductManager' },
  { email: 'stock@hypesoft.com', password: 'stock123', role: 'StockManager' },
  { email: 'reporter@hypesoft.com', password: 'reporter123', role: 'Reporter' },
  { email: 'user@hypesoft.com', password: 'user123', role: 'User' },
]
