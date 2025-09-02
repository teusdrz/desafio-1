'use client'

import { useState } from 'react'
import { Store, Package, TrendingUp, Star, Calendar, Filter, Search, MoreHorizontal, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const mockShops = [
    {
        id: 1,
        name: 'Fashion Forward',
        owner: 'Sarah Johnson',
        category: 'Fashion',
        products: 156,
        revenue: '$12,450',
        rating: 4.8,
        status: 'active',
        image: '/api/placeholder/40/40',
        lastActive: '2 hours ago'
    },
    {
        id: 2,
        name: 'Tech Hub',
        owner: 'Mike Chen',
        category: 'Electronics',
        products: 89,
        revenue: '$28,900',
        rating: 4.9,
        status: 'active',
        image: '/api/placeholder/40/40',
        lastActive: '30 minutes ago'
    },
    {
        id: 3,
        name: 'Home & Garden',
        owner: 'Emily Davis',
        category: 'Home',
        products: 203,
        revenue: '$8,750',
        rating: 4.6,
        status: 'pending',
        image: '/api/placeholder/40/40',
        lastActive: '1 day ago'
    },
    {
        id: 4,
        name: 'Sports Central',
        owner: 'John Smith',
        category: 'Sports',
        products: 134,
        revenue: '$15,200',
        rating: 4.7,
        status: 'active',
        image: '/api/placeholder/40/40',
        lastActive: '4 hours ago'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        case 'inactive':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
}

export default function MyShopPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredShops = mockShops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.owner.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || shop.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Shop</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your shop and view performance metrics</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Store className="w-4 h-4 mr-2" />
                    Create New Shop
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Shops</CardTitle>
                        <Store className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockShops.length}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">All shops</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Active</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockShops.filter(s => s.status === 'active').length}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active shops</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">$12,545</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Products</CardTitle>
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">247</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total products</p>
                    </CardContent>
                </Card>
            </div>

            {/* Shop List */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-gray-900 dark:text-white">Shop Management</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">Monitor and manage all your shops</CardDescription>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search shops..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        {filteredShops.map((shop) => (
                            <div key={shop.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{shop.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Owner: {shop.owner}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">Category: {shop.category}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{shop.products}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{shop.revenue}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{shop.rating}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Badge className={getStatusColor(shop.status)}>
                                                {shop.status}
                                            </Badge>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{shop.lastActive}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
