'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Eye, Edit, Trash2, Users } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface Customer {
    id: string
    name: string
    email: string
    phone: string
    company: string
    status: 'active' | 'inactive'
    totalOrders: number
    totalSpent: number
    joinedDate: string
}

export default function CustomersPage() {
    const { theme } = useTheme()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Mock data
    useEffect(() => {
        const mockCustomers: Customer[] = [
            {
                id: '1',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '+1 (555) 123-4567',
                company: 'Fashion Corp',
                status: 'active',
                totalOrders: 15,
                totalSpent: 2456.78,
                joinedDate: '2024-01-15'
            },
            {
                id: '2',
                name: 'Bob Smith',
                email: 'bob@techcorp.com',
                phone: '+1 (555) 987-6543',
                company: 'Tech Corp',
                status: 'active',
                totalOrders: 8,
                totalSpent: 1890.50,
                joinedDate: '2024-02-20'
            },
            {
                id: '3',
                name: 'Carol Williams',
                email: 'carol@office.com',
                phone: '+1 (555) 456-7890',
                company: 'Office Supplies Inc',
                status: 'inactive',
                totalOrders: 3,
                totalSpent: 567.32,
                joinedDate: '2024-03-10'
            }
        ]
        setCustomers(mockCustomers)
    }, [])

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    const iconColor = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${titleColor}`}>Customers</h1>
                    <p className={textColor}>Manage your customer relationships</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${textColor}`}>Total Customers</CardTitle>
                        <Users className={`h-4 w-4 ${iconColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${titleColor}`}>{customers.length}</div>
                        <p className="text-xs text-green-600">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${textColor}`}>Active Customers</CardTitle>
                        <Users className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${titleColor}`}>
                            {customers.filter(c => c.status === 'active').length}
                        </div>
                        <p className="text-xs text-green-600">+5% from last month</p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${textColor}`}>Total Orders</CardTitle>
                        <Users className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${titleColor}`}>
                            {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                        </div>
                        <p className="text-xs text-blue-600">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium ${textColor}`}>Total Revenue</CardTitle>
                        <Users className={`h-4 w-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                            }`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${titleColor}`}>
                            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                        </div>
                        <p className="text-xs text-yellow-600">+15% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className={cardBg}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
                        <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                            }`} />
                        Customer List
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-3 h-4 w-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`} />
                            <Input
                                placeholder="Search customers by name, email, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Customer List */}
                    <div className="space-y-4">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className={`p-4 rounded-lg border transition-colors ${theme === 'dark'
                                        ? 'border-gray-700 bg-gray-900/50 hover:bg-gray-900'
                                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${theme === 'dark'
                                                ? 'bg-purple-900/50 border border-purple-700'
                                                : 'bg-purple-100'
                                            }`}>
                                            <Users className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${titleColor}`}>{customer.name}</h3>
                                            <p className={`text-sm ${textColor}`}>{customer.email}</p>
                                            <p className={`text-sm ${textColor}`}>{customer.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${titleColor}`}>
                                                {customer.totalOrders} orders
                                            </p>
                                            <p className={`text-sm ${textColor}`}>
                                                ${customer.totalSpent.toFixed(2)} spent
                                            </p>
                                        </div>
                                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                                            {customer.status}
                                        </Badge>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`${theme === 'dark'
                                                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                                                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`${theme === 'dark'
                                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                                                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                                    }`}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`${theme === 'dark'
                                                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                    }`}
                                            >
                                                <Trash2 className="h-4 w-4" />
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
