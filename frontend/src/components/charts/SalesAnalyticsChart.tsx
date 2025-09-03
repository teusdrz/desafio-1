'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts'
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react'
import { dashboardService } from '@/services/dashboard-service'
import { useTheme } from '@/components/theme-provider'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16']

export function SalesAnalyticsChart() {
    const { theme } = useTheme()
    const isDarkMode = theme === 'dark'

    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            // Mock data for analytics - replace with real API call
            return {
                salesTrend: [
                    { month: 'Jan', sales: 4000, revenue: 2400 },
                    { month: 'Feb', sales: 3000, revenue: 1398 },
                    { month: 'Mar', sales: 2000, revenue: 9800 },
                    { month: 'Apr', sales: 2780, revenue: 3908 },
                    { month: 'May', sales: 1890, revenue: 4800 },
                    { month: 'Jun', sales: 2390, revenue: 3800 },
                ],
                categoryDistribution: [
                    { name: 'Electronics', value: 400, color: '#8b5cf6' },
                    { name: 'Clothing', value: 300, color: '#06b6d4' },
                    { name: 'Books', value: 200, color: '#10b981' },
                    { name: 'Home & Garden', value: 150, color: '#f59e0b' },
                ],
                topProducts: [
                    { name: 'Smart Watch', sales: 186, revenue: 3720 },
                    { name: 'Laptop Stand', sales: 145, revenue: 2900 },
                    { name: 'USB-C Cable', sales: 132, revenue: 1320 },
                    { name: 'Phone Case', sales: 98, revenue: 980 },
                    { name: 'Wireless Mouse', sales: 76, revenue: 1520 },
                ]
            }
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    // Dynamic colors based on theme
    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb'
    const textColor = theme === 'dark' ? '#d1d5db' : '#374151'
    const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff'
    const tooltipBorder = theme === 'dark' ? '#374151' : '#e5e7eb'
    const barColor = theme === 'dark' ? '#a855f7' : '#8b5cf6'
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    const iconColor = theme === 'dark' ? 'text-purple-400' : 'text-purple-600'    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <Card className={`lg:col-span-2 ${cardBg}`}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
                        <TrendingUp className={`h-5 w-5 ${iconColor}`} />
                        Sales Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData?.salesTrend}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <YAxis
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: tooltipBg,
                                        border: `1px solid ${tooltipBorder}`,
                                        borderRadius: '8px',
                                        color: textColor
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ color: textColor }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#8b5cf6"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name="Sales"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#06b6d4"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue ($)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className={cardBg}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
                        <Package className={`h-5 w-5 ${iconColor}`} />
                        Category Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData?.categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analyticsData?.categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: tooltipBg,
                                        border: `1px solid ${tooltipBorder}`,
                                        borderRadius: '8px',
                                        color: textColor
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Top Products */}
            <Card className={cardBg}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
                        <DollarSign className={`h-5 w-5 ${iconColor}`} />
                        Top Selling Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData?.topProducts} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    type="number"
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fill: textColor, fontSize: 11 }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: tooltipBg,
                                        border: `1px solid ${tooltipBorder}`,
                                        borderRadius: '8px',
                                        color: textColor
                                    }}
                                />
                                <Bar
                                    dataKey="sales"
                                    fill={barColor}
                                    stroke={theme === 'dark' ? '#e5e7eb' : '#8b5cf6'}
                                    strokeWidth={1}
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SalesAnalyticsChart
