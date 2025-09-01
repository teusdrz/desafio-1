'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Save, Package } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductFormProps {
    product?: Product | null
    onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
    onCancel: () => void
}

interface FormData {
    name: string
    description: string
    price: number
    stockQuantity: number
    categoryId: string
    categoryName: string
}

interface FormErrors {
    name?: string
    description?: string
    price?: string
    stockQuantity?: string
    categoryId?: string
    categoryName?: string
}

const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Furniture' },
    { id: '3', name: 'Appliances' },
    { id: '4', name: 'Clothing' },
    { id: '5', name: 'Books' },
    { id: '6', name: 'Sports' }
]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        categoryId: '',
        categoryName: ''
    })

    const [errors, setErrors] = useState<Partial<FormErrors>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stockQuantity: product.stockQuantity,
                categoryId: product.categoryId,
                categoryName: product.categoryName
            })
        }
    }, [product])

    const validateForm = (): boolean => {
        const newErrors: Partial<FormErrors> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0'
        }

        if (formData.stockQuantity < 0) {
            newErrors.stockQuantity = 'Stock quantity cannot be negative'
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const productData = {
                ...formData,
                isLowStock: formData.stockQuantity < 10
            }

            onSave(productData)
        } catch (error) {
            console.error('Error saving product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCategoryChange = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId)
        setFormData({
            ...formData,
            categoryId,
            categoryName: category?.name || ''
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-display font-semibold">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-8 w-8 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Product Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter product name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description *
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter product description"
                            rows={4}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">
                                Price ($) *
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stockQuantity" className="text-sm font-medium">
                                Stock Quantity *
                            </Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                min="0"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                                className={errors.stockQuantity ? 'border-red-500' : ''}
                            />
                            {errors.stockQuantity && (
                                <p className="text-sm text-red-500">{errors.stockQuantity}</p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                            Category *
                        </Label>
                        <select
                            id="category"
                            value={formData.categoryId}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md text-sm ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className="text-sm text-red-500">{errors.categoryId}</p>
                        )}
                    </div>

                    {/* Stock Warning */}
                    {formData.stockQuantity > 0 && formData.stockQuantity < 10 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                ⚠️ This product will be marked as "Low Stock" (less than 10 units)
                            </p>
                        </div>
                    )}

                    {formData.stockQuantity === 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                                🚫 This product will be marked as "Out of Stock"
                            </p>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {product ? 'Update Product' : 'Create Product'}
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
