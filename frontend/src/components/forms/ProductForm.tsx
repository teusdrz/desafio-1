'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Product, CreateProductRequest } from '@/types/product'
import { Category } from '@/types/category'
import { productService } from '@/services/product-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { X, Save } from 'lucide-react'

const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    categoryId: z.string().min(1, 'Category is required'),
    stockQuantity: z.number().int().min(0, 'Stock quantity must be 0 or greater'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
    product?: Product | null
    categories: Category[]
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            categoryId: product?.categoryId || '',
            stockQuantity: product?.stockQuantity || 0,
        },
    })

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            if (product) {
                // Update existing product
                await productService.updateProduct(product.id, {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    categoryId: data.categoryId,
                })

                // Update stock separately if changed
                if (data.stockQuantity !== product.stockQuantity) {
                    await productService.updateProductStock(product.id, {
                        stockQuantity: data.stockQuantity,
                    })
                }
            } else {
                // Create new product
                await productService.createProduct(data)
            }

            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {product ? 'Edit Product' : 'Create New Product'}
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="Enter product name"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Category *</Label>
                            <select
                                id="categoryId"
                                {...register('categoryId')}
                                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.categoryId ? 'border-destructive' : 'border-input'
                                    }`}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    {...register('price', { valueAsNumber: true })}
                                    placeholder="0.00"
                                    className={`pl-8 ${errors.price ? 'border-destructive' : ''}`}
                                />
                            </div>
                            {errors.price && (
                                <p className="text-sm text-destructive">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Stock Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                {...register('stockQuantity', { valueAsNumber: true })}
                                placeholder="0"
                                className={errors.stockQuantity ? 'border-destructive' : ''}
                            />
                            {errors.stockQuantity && (
                                <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter product description"
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-vertical ${errors.description ? 'border-destructive' : 'border-input'
                                }`}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" className="mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {product ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
