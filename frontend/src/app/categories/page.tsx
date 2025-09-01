import { Suspense } from 'react'
import CategoryList from '@/components/categories/CategoryList'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Categories
                </h1>
                <p className="text-muted-foreground">
                    Organize your products into categories
                </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
                <CategoryList />
            </Suspense>
        </div>
    )
}
