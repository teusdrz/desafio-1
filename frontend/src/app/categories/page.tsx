import { Suspense } from 'react'
import CategoryList from '@/components/categories/CategoryList'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function CategoriesPage() {
    return (
        <AuthGuard requiredPermissions={['category:read']}>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Categories
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Organize your products into categories
                    </p>
                </div>

                <Suspense fallback={<LoadingSpinner />}>
                    <CategoryList />
                </Suspense>
            </div>
        </AuthGuard>
    )
}
