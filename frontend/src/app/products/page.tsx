'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductForm } from '@/components/forms/ProductForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Grid3X3, List, Package, TrendingUp, AlertTriangle } from 'lucide-react'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useTheme } from '@/components/theme-provider'

// Mock data for demonstration
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation and premium sound quality.',
        price: 299.99,
        stockQuantity: 45,
        categoryId: '1',
        categoryName: 'Electronics',
        isLowStock: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-01T15:30:00Z'
    },
    {
        id: '2',
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
        price: 399.99,
        stockQuantity: 8,
        categoryId: '1',
        categoryName: 'Electronics',
        isLowStock: true,
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-03-10T12:00:00Z'
    },
    {
        id: '3',
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
        price: 599.99,
        stockQuantity: 0,
        categoryId: '2',
        categoryName: 'Furniture',
        isLowStock: true,
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-02-15T16:45:00Z'
    },
    {
        id: '4',
        name: 'Professional Coffee Machine',
        description: 'High-end espresso machine for professional coffee brewing with steam wand.',
        price: 1299.99,
        stockQuantity: 23,
        categoryId: '3',
        categoryName: 'Appliances',
        isLowStock: false,
        createdAt: '2024-02-10T11:30:00Z',
        updatedAt: '2024-03-05T13:20:00Z'
    },
    {
        id: '5',
        name: 'Gaming Laptop Ultra',
        description: 'High-performance gaming laptop with RTX graphics and fast SSD storage.',
        price: 2499.99,
        stockQuantity: 12,
        categoryId: '1',
        categoryName: 'Electronics',
        isLowStock: false,
        createdAt: '2024-03-01T08:00:00Z',
        updatedAt: '2024-03-15T10:15:00Z'
    },
    {
        id: '6',
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        price: 49.99,
        stockQuantity: 5,
        categoryId: '1',
        categoryName: 'Electronics',
        isLowStock: true,
        createdAt: '2024-02-20T16:00:00Z',
        updatedAt: '2024-03-12T14:30:00Z'
    }
]

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const { theme } = useTheme()

    // Dynamic theme-based styles
    const modalBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white'

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || product.categoryName === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(products.map(p => p.categoryName)))
    const categoriesData = categories.map((name, index) => ({
        id: (index + 1).toString(),
        name,
        description: `Categoria ${name}`,
        isActive: true,
        productsCount: products.filter(p => p.categoryName === name).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }))
    const lowStockCount = products.filter(p => p.isLowStock).length
    const outOfStockCount = products.filter(p => p.stockQuantity === 0).length
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    const handleDelete = (productId: string) => {
        setProducts(products.filter(p => p.id !== productId))
    }

    const handleView = (product: Product) => {
        alert(`Viewing product: ${product.name}`)
    }

    const handleSave = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingProduct) {
            setProducts(products.map(p =>
                p.id === editingProduct.id
                    ? { ...p, ...productData, updatedAt: new Date().toISOString() }
                    : p
            ))
        } else {
            const newProduct: Product = {
                ...productData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            setProducts([...products, newProduct])
        }
        setShowForm(false)
        setEditingProduct(null)
    }

    return (
        <AuthGuard requiredPermissions={['product:read']}>
            <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20 dark:from-gray-950 dark:via-gray-900/80 dark:to-gray-900/60 p-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <h1 className="text-responsive-3xl font-display font-bold gradient-text dark:text-white mb-2">
                                    Product Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-responsive">
                                    Manage your product inventory with comprehensive tools and analytics
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={() => {
                                        setEditingProduct(null)
                                        setShowForm(true)
                                    }}
                                    className="btn-primary"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="card-elegant bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-elegant bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-elegant bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-elegant bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{outOfStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="mb-8 glass-card bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                                        <Input
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            variant={selectedCategory === null ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(null)}
                                            className={selectedCategory !== null ? "bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                                        >
                                            All Categories
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category)}
                                                className={selectedCategory !== category ? "bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={viewMode !== 'grid' ? "bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={viewMode !== 'list' ? "bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid/List */}
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }>
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onView={handleView}
                                className={viewMode === 'list' ? "flex-row" : ""}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No products found</h3>
                            <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Product Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${modalBg} rounded-lg`}>
                                <ProductForm
                                    product={editingProduct}
                                    categories={categoriesData}
                                    onSuccess={() => {
                                        setShowForm(false)
                                        setEditingProduct(null)
                                    }}
                                    onCancel={() => {
                                        setShowForm(false)
                                        setEditingProduct(null)
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    )
}
