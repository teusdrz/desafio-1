'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Activity } from 'lucide-react'
import { AuthGuard } from '@/components/auth/AuthGuard'

const statisticsData = {
    overview: [
        { title: 'Total Revenue', value: '$125,430', change: '+12.5%', trend: 'up', icon: DollarSign },
        { title: 'Total Orders', value: '1,247', change: '+8.2%', trend: 'up', icon: ShoppingCart },
        { title: 'Products Sold', value: '3,542', change: '-2.1%', trend: 'down', icon: Package },
        { title: 'Active Users', value: '892', change: '+15.3%', trend: 'up', icon: Users }
    ],
    topProducts: [
        { name: 'Wireless Headphones', sales: 234, revenue: '$4,680' },
        { name: 'Smart Watch', sales: 186, revenue: '$3,720' },
        { name: 'Laptop Stand', sales: 145, revenue: '$2,900' },
        { name: 'USB-C Cable', sales: 132, revenue: '$1,320' },
        { name: 'Phone Case', sales: 98, revenue: '$980' }
    ],
    recentActivity: [
        { action: 'New order received', time: '2 minutes ago', type: 'order' },
        { action: 'Product stock updated', time: '15 minutes ago', type: 'inventory' },
        { action: 'Customer registered', time: '1 hour ago', type: 'user' },
        { action: 'Payment processed', time: '2 hours ago', type: 'payment' },
        { action: 'Product review added', time: '3 hours ago', type: 'review' }
    ]
}

export default function StatisticsPage() {
    const [timeRange, setTimeRange] = useState('7days')

    return (
        <AuthGuard requiredPermissions={['statistics:read']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">View your business analytics and insights</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                        >
                            <option value="7days">Last 7 days</option>
                            <option value="30days">Last 30 days</option>
                            <option value="90days">Last 90 days</option>
                            <option value="1year">Last year</option>
                        </select>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statisticsData.overview.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <Card key={index} className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow bg-white dark:bg-gray-950">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                            <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {stat.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Top Selling Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statisticsData.topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} units sold</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-purple-600 dark:text-purple-400">{product.revenue}</p>
                                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statisticsData.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                        <div className={`w-2 h-2 rounded-full ${activity.type === 'order' ? 'bg-green-500' :
                                            activity.type === 'inventory' ? 'bg-blue-500' :
                                                activity.type === 'user' ? 'bg-purple-500' :
                                                    activity.type === 'payment' ? 'bg-yellow-500' :
                                                        'bg-gray-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Sales Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">Chart visualization would be displayed here</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Integration with Chart.js or similar library needed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}
