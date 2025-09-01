'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product-service'
import { categoryService } from '@/services/category-service'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductForm } from '@/components/forms/ProductForm'
import { Plus, Search, Filter } from 'lucide-react'

export default function ProductList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const { data: productsResponse, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
        queryKey: ['products', searchTerm, selectedCategory],
        queryFn: () => productService.getProducts({
            search: searchTerm,
            categoryId: selectedCategory,
            page: 1,
            pageSize: 50
        }),
    })

    const products = productsResponse?.products || []

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    })

    const handleCreateProduct = () => {
        setEditingProduct(null)
        setIsFormOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
        refetchProducts()
    }

    const handleDeleteProduct = async (productId: string) => {
        try {
            await productService.deleteProduct(productId)
            refetchProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    if (productsLoading || categoriesLoading) {
        return <LoadingSpinner size="lg" />
    }

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((category: Category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Add Product Button */}
                <Button onClick={handleCreateProduct} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: Product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No products found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {searchTerm || selectedCategory
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by adding your first product'}
                            </p>
                            <Button onClick={handleCreateProduct}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Product
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Product Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <ProductForm
                            product={editingProduct}
                            categories={categories || []}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
