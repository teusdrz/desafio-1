'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Home,
    Package,
    FolderOpen,
    BarChart3,
    Settings,
    HelpCircle,
    Search,
    User,
    LogOut,
    ChevronDown,
    Store,
    Users,
    FileText
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const navigation = [
    {
        name: 'Overview',
        href: '/',
        icon: Home,
        section: 'general'
    },
    {
        name: 'Statistics',
        href: '/statistics',
        icon: BarChart3,
        section: 'general'
    },
]

const shopItems = [
    { name: 'My Shop', href: '/my-shop', icon: Store },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: FolderOpen },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Invoices', href: '/invoices', icon: FileText },
]

const supportItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const { user, logout, isAuthenticated } = useAuthStore()

    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    // Don't show dashboard layout on login page
    if (pathname === '/login' || pathname === '/unauthorized') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-950 shadow-lg border-r border-gray-200 dark:border-gray-800">
                {/* Logo */}
                <div className="flex items-center px-6 py-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">HyperSense</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-6">
                    {/* General Section */}
                    <div>
                        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            General
                        </h3>
                        <div className="space-y-1">
                            {navigation.filter(item => item.section === 'general').map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 mr-3",
                                            isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400"
                                        )} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Shop Section */}
                    <div>
                        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Shop
                        </h3>
                        <div className="space-y-1">
                            {shopItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 mr-3",
                                            isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400"
                                        )} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Support
                        </h3>
                        <div className="space-y-1">
                            {supportItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                                >
                                    <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User Profile at Bottom */}
                {isAuthenticated && user && (
                    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-purple-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user.role}
                                            </p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="pl-64">
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {pathname === '/' ? 'Overview' :
                                        pathname === '/my-shop' ? 'My Shop' :
                                            pathname === '/products' ? 'Product List' :
                                                pathname === '/categories' ? 'Categories' :
                                                    pathname === '/customers' ? 'Customers' :
                                                        pathname === '/invoices' ? 'Invoices' :
                                                            pathname === '/statistics' ? 'Statistics' :
                                                                pathname === '/settings' ? 'Settings' :
                                                                    pathname === '/help' ? 'Help Center' : 'Dashboard'}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {pathname === '/' ? 'Welcome back! Here\'s what\'s happening with your shop.' :
                                        pathname === '/my-shop' ? 'Manage your shop and view performance metrics' :
                                            pathname === '/products' ? 'Manage your product inventory' :
                                                pathname === '/categories' ? 'Organize your product categories' :
                                                    pathname === '/customers' ? 'Manage your customer relationships' :
                                                        pathname === '/invoices' ? 'Track payments and manage invoices' :
                                                            pathname === '/statistics' ? 'View your business analytics' :
                                                                pathname === '/settings' ? 'Configure your account and system settings' :
                                                                    pathname === '/help' ? 'Get help and support for your business' : 'Manage your business'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:bg-gray-900"
                                />
                            </div>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <NotificationDropdown />

                            {/* User Info */}
                            {isAuthenticated && user && (
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                    </div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-purple-700">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
