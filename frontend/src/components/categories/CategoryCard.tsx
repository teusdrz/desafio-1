'use client'

import { Category } from '@/types/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Tag } from 'lucide-react'

interface CategoryCardProps {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (categoryId: string) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            onDelete(category.id)
        }
    }

    return (
        <Card className="h-full flex flex-col bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-purple-900/30 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-primary dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
                                {category.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                                Category
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                    {category.description}
                </p>

                <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground dark:text-gray-400">Created</span>
                        <span className="text-sm font-medium text-foreground dark:text-white">
                            {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(category)}
                            className="flex-1 bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="flex-1 bg-transparent dark:bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10 border-red-300 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
