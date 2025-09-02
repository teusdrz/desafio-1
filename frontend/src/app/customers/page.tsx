'use client'

import { useState } from 'react'
import { Users, Search, Mail, Phone, MapPin, Calendar, Star, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const mockCustomers = [
    {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        orders: 24,
        totalSpent: '$2,450',
        status: 'active',
        joinDate: '2023-06-15',
        lastOrder: '2024-08-15'
    },
    {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        phone: '+1 (555) 234-5678',
        location: 'Los Angeles, CA',
        orders: 18,
        totalSpent: '$1,890',
        status: 'active',
        joinDate: '2023-08-20',
        lastOrder: '2024-08-10'
    },
    {
        id: 3,
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Chicago, IL',
        orders: 31,
        totalSpent: '$3,120',
        status: 'vip',
        joinDate: '2023-03-10',
        lastOrder: '2024-08-20'
    },
    {
        id: 4,
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Houston, TX',
        orders: 7,
        totalSpent: '$680',
        status: 'inactive',
        joinDate: '2024-01-05',
        lastOrder: '2024-06-15'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'vip':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
        case 'inactive':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
}

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your customer relationships and view insights</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Users className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomers.length}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">All customers</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Active</CardTitle>
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomers.filter(c => c.status === 'active').length}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active customers</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">VIP</CardTitle>
                        <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomers.filter(c => c.status === 'vip').length}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">VIP customers</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">$45,231</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total customer value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Customer List */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-gray-900 dark:text-white">Customer Database</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">View and manage all customer information</CardDescription>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center">
                                            <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                                                {customer.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{customer.name}</h3>
                                                <Badge className={getStatusColor(customer.status)}>
                                                    {customer.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{customer.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{customer.phone}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{customer.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Joined {customer.joinDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-2">
                                        <div className="grid grid-cols-3 gap-6 text-center">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{customer.orders}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{customer.totalSpent}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{customer.lastOrder}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Last Order</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                View Profile
                                            </Button>
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <Mail className="w-4 h-4 mr-1" />
                                                Contact
                                            </Button>
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
