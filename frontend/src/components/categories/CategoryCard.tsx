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
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-foreground">
                                {category.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Category
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {category.description}
                </p>

                <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm font-medium text-foreground">
                            {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(category)}
                            className="flex-1"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
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
