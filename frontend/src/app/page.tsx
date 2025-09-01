import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react'

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Hero Section with Sophisticated Design */}
            <section className="relative overflow-hidden py-20 px-6">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-white pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200/50 rounded-full text-purple-700 text-sm font-medium mb-8 backdrop-blur-sm shadow-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                            <span className="font-semibold">Hypesoft Product Management</span>
                            <div className="ml-3 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">v2.0</div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-responsive-3xl font-bold mb-6">
                            <span className="block gradient-text mb-2">Product Management</span>
                            <span className="block text-gray-800">System</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                            Comprehensive solution for managing products, categories, and inventory with
                            <span className="font-semibold text-purple-600"> modern architecture</span>,
                            <span className="font-semibold text-purple-600"> real-time analytics</span>, and
                            <span className="font-semibold text-purple-600"> exceptional user experience</span>.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            {[
                                { label: 'Clean Architecture', icon: '🏗️' },
                                { label: 'Real-time Analytics', icon: '📊' },
                                { label: 'Modern Design', icon: '✨' },
                                { label: 'Mobile First', icon: '📱' }
                            ].map((feature, index) => (
                                <div
                                    key={feature.label}
                                    className="glass-card px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50/80 transition-all duration-300 cursor-default"
                                >
                                    <span className="mr-2">{feature.icon}</span>
                                    {feature.label}
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button className="btn-primary">
                                    <Package className="w-4 h-4 mr-2" />
                                    Manage Products
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button variant="outline" className="btn-secondary">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Section */}
            <section className="relative py-12 px-6">
                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Stats Cards */}
                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900">5</p>
                                        <p className="text-xs text-gray-500 mt-1">Products in inventory</p>
                                    </div>
                                    <Package className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Categories</p>
                                        <p className="text-2xl font-bold text-gray-900">3</p>
                                        <p className="text-xs text-gray-500 mt-1">Product categories</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
                                        <p className="text-2xl font-bold text-gray-900">$</p>
                                        <p className="text-xs text-green-600 mt-1">R$ 107.169,12</p>
                                        <p className="text-xs text-gray-500">Total inventory value</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                                        <p className="text-2xl font-bold text-gray-900">24</p>
                                        <p className="text-xs text-gray-500 mt-1">Currently online</p>
                                    </div>
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-6 bg-gradient-to-br from-purple-50/50 to-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold gradient-text mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your products efficiently
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Package className="w-8 h-8 text-purple-600" />,
                                title: 'Product Management',
                                description: 'Complete CRUD operations for products with advanced filtering and search capabilities.'
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                                title: 'Analytics Dashboard',
                                description: 'Real-time insights and analytics to track your inventory performance.'
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                                title: 'Stock Management',
                                description: 'Monitor stock levels with low stock alerts and automated inventory tracking.'
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        {feature.icon}
                                        <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
