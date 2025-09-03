'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Category, CreateCategoryRequest } from '@/types/category'
import { categoryService } from '@/services/category-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { X, Save } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
    description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
    category?: Category | null
    onSuccess: () => void
    onCancel: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
    const { theme } = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Dynamic colors based on theme
    const modalBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || '',
            description: category?.description || '',
        },
    })

    const onSubmit = async (data: CategoryFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            if (category) {
                // Update existing category
                await categoryService.updateCategory(category.id, data)
            } else {
                // Create new category
                await categoryService.createCategory(data)
            }

            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={`w-full ${cardBg}`}>
            <CardHeader className={`flex flex-row items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <CardTitle className={titleColor}>
                    {category ? 'Edit Category' : 'Create New Category'}
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

                    {/* Category Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className={titleColor}>Category Name *</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Enter category name"
                            className={`${errors.name ? 'border-destructive' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className={titleColor}>Description *</Label>
                        <textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter category description"
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.description ? 'border-destructive' : ''
                                } ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
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
                            {category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
