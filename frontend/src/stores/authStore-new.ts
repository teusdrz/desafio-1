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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Mock users for demonstration
export const MOCK_USERS = [
    { email: 'admin@hypesoft.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@hypesoft.com', password: 'manager123', role: 'Manager' },
    { email: 'product@hypesoft.com', password: 'product123', role: 'ProductManager' },
    { email: 'stock@hypesoft.com', password: 'stock123', role: 'StockManager' },
    { email: 'reporter@hypesoft.com', password: 'reporter123', role: 'Reporter' },
    { email: 'user@hypesoft.com', password: 'user123', role: 'User' },
]

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
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    // Check mock users for demo
                    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)

                    if (mockUser) {
                        const user: User = {
                            id: mockUser.email,
                            email: mockUser.email,
                            name: mockUser.role,
                            role: mockUser.role,
                            permissions: mockUser.role === 'Admin' ? ['read', 'write', 'delete'] : ['read']
                        }

                        set({
                            user,
                            token: `mock-token-${Date.now()}`,
                            isAuthenticated: true,
                            isLoading: false
                        })
                        return true
                    }

                    // If not a mock user, try real API
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
                            isLoading: false
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

                // If it's a mock token, just keep the user logged in
                if (token.startsWith('mock-token-')) {
                    return
                }

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
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const { token } = useAuthStore.getState()
    return token ? { Authorization: `Bearer ${token}` } : {}
}
