'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRole?: string
  fallbackPath?: string
}

export function AuthGuard({ 
  children, 
  requiredPermissions = [], 
  requiredRole,
  fallbackPath = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, user, checkAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication on mount
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/login') {
      return
    }

    if (!isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    // Check role-based access
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
      return
    }

    // Check permission-based access
    if (requiredPermissions.length > 0 && user) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        user.permissions.includes(permission)
      )
      
      if (!hasAllPermissions) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, user, requiredPermissions, requiredRole, router, pathname, fallbackPath])

  // Show loading or nothing while checking auth
  if (pathname !== '/login' && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredPermissions?: string[]
    requiredRole?: string
    fallbackPath?: string
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
