'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertTriangle, Package, DollarSign, TrendingUp } from 'lucide-react'
import { ProductsByCategoryChart } from '@/components/charts/ProductsByCategoryChart'
import { LowStockProducts } from '@/components/dashboard/LowStockProducts'

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
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-full -mr-10 -mt-10" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-purple-700">Total Products</CardTitle>
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            {dashboardData?.totalProducts || 0}
                        </div>
                        <p className="text-sm text-purple-600/70 font-medium mt-1">
                            Products in inventory
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full -mr-10 -mt-10" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-700">Total Categories</CardTitle>
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            {dashboardData?.totalCategories || 0}
                        </div>
                        <p className="text-sm text-blue-600/70 font-medium mt-1">
                            Product categories
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/10 rounded-full -mr-10 -mt-10" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-green-700">Total Stock Value</CardTitle>
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                            R$ {dashboardData?.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </div>
                        <p className="text-sm text-green-600/70 font-medium mt-1">
                            Total inventory value
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/10 rounded-full -mr-10 -mt-10" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-red-700">Low Stock Items</CardTitle>
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            {dashboardData?.lowStockProducts?.length || 0}
                        </div>
                        <p className="text-sm text-red-600/70 font-medium mt-1">
                            Items with stock &lt; 10
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Products by Category Chart */}
                <Card className="bg-white border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="border-b border-purple-100">
                        <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            Products by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ProductsByCategoryChart data={dashboardData?.productsByCategory || []} />
                    </CardContent>
                </Card>

                {/* Low Stock Products */}
                <Card className="bg-white border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="border-b border-red-100">
                        <CardTitle className="text-xl font-bold text-red-800 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            Low Stock Alert
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <LowStockProducts products={dashboardData?.lowStockProducts || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
