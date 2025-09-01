'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Package, BarChart3, Tag, Home, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: Tag },
]

export function Navigation() {
    const pathname = usePathname()
    const { user, logout, isAuthenticated } = useAuthStore()

    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    // Don't show navigation on login page
    if (pathname === '/login') {
        return null
    }

    return (
        <header className="border-b border-purple-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                Hypesoft
                            </span>
                            <span className="text-xs text-purple-400 font-medium -mt-1">
                                Product Management
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                                        isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                                            : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 hover:shadow-md'
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        isActive ? "scale-110" : ""
                                    )} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-inner hover:shadow-lg transition-all">
                                            <span className="text-sm font-bold text-purple-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                            <p className="text-xs leading-none text-purple-600 font-medium">
                                                {user.role}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configurações</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild className="bg-purple-600 hover:bg-purple-700">
                                <Link href="/login">
                                    Entrar
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
