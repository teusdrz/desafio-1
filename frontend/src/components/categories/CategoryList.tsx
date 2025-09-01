'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/category-service'
import { Category } from '@/types/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { CategoryForm } from '@/components/forms/CategoryForm'
import { Plus, Search } from 'lucide-react'

export default function CategoryList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const { data: categories, isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    })

    const filteredCategories = categories?.filter((category: Category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const handleCreateCategory = () => {
        setEditingCategory(null)
        setIsFormOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsFormOpen(true)
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        setEditingCategory(null)
        refetch()
    }

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            await categoryService.deleteCategory(categoryId)
            refetch()
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    if (isLoading) {
        return <LoadingSpinner size="lg" />
    }

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Add Category Button */}
                <Button onClick={handleCreateCategory} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category: Category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
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
                                {searchTerm ? 'No categories found' : 'No categories yet'}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {searchTerm
                                    ? 'Try adjusting your search criteria'
                                    : 'Get started by creating your first category'}
                            </p>
                            <Button onClick={handleCreateCategory}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Category
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Category Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg max-w-md w-full">
                        <CategoryForm
                            category={editingCategory}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
