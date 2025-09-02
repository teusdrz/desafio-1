'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertTriangle, Package, DollarSign, TrendingUp, Star, Filter, MoreHorizontal } from 'lucide-react'
import { ProductsByCategoryChart } from '@/components/charts/ProductsByCategoryChart'
import { LowStockProducts } from '@/components/dashboard/LowStockProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardService.getDashboardStats,
    })

    if (isLoading) {
        return <LoadingSpinner size="lg" />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Error loading dashboard
                    </h3>
                    <p className="text-muted-foreground">
                        Unable to load dashboard data. Please try again.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {dashboardData?.totalProducts || 0}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            +4 products <span className="text-gray-500 dark:text-gray-400">since last month</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            +0.2 star <span className="text-gray-500 dark:text-gray-400">since last month</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Trends</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${dashboardData?.totalValue?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            +8.2% <span className="text-gray-500 dark:text-gray-400">since last month</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {dashboardData?.lowStockProducts?.length || 0}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                            {dashboardData?.lowStockProducts?.length || 0} products <span className="text-gray-500 dark:text-gray-400">are under 10 items</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities Section */}
            <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest product updates and changes</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Show 50
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Activity Items */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">Linen Shirt</span>
                                    <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">Stock Adjustment</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Stock adjusted from 100 to 80 units after bulk order</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 29, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">Jeans Jacket</span>
                                    <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">New Product</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Price: $65.00, Stock: 70 units</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 29, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">Ankle Pants</span>
                                    <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">Customer Review</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">"Great quality and fit" Rating: 5 stars</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 28, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">Slim Fit Jeans</span>
                                    <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">Product Update</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Price updated to $50.00, Stock: 80 units</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 28, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">Black T-Shirt</span>
                                    <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">Promotion</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">10% off summer sale. Duration: June 27 - July 15, 2024</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 27, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">White T-Shirt</span>
                                    <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">Stock Adjustment</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Lightweight and breathable. Price: $45.00, Stock: 100 units</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">June 26, 2024</p>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
