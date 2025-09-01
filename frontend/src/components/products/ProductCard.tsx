import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, Package, DollarSign } from 'lucide-react'
import { Product } from '@/types/product'
import { cn } from '@/lib/utils'

interface ProductCardProps {
    product: Product
    viewMode?: 'grid' | 'list'
    onEdit?: (product: Product) => void
    onDelete?: (productId: string) => void
    onView?: (product: Product) => void
    className?: string
}

export function ProductCard({
    product,
    viewMode = 'grid',
    onEdit,
    onDelete,
    onView,
    className
}: ProductCardProps) {
    const handleDelete = () => {
        if (onDelete && confirm(`Are you sure you want to delete "${product.name}"?`)) {
            onDelete(product.id)
        }
    }

    const getStockStatus = () => {
        if (product.stockQuantity === 0) {
            return { status: 'Out of Stock', variant: 'destructive' as const }
        }
        if (product.isLowStock) {
            return { status: 'Low Stock', variant: 'warning' as const }
        }
        return { status: 'In Stock', variant: 'success' as const }
    }

    const stockStatus = getStockStatus()

    if (viewMode === 'list') {
        return (
            <Card className={cn("glass-card hover:shadow-lg transition-shadow", className)}>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-display font-semibold text-gray-900 truncate">
                                    {product.name}
                                </h3>
                                <Badge variant={stockStatus.variant} className="ml-2 flex-shrink-0">
                                    {stockStatus.status}
                                </Badge>
                            </div>
                            <p className="text-gray-600 font-body mb-3 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    {product.stockQuantity} units
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>{product.categoryName}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                ${product.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total: ${(product.price * product.stockQuantity).toLocaleString()}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {onView && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onView(product)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            )}
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(product)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn(
            "glass-card group hover:shadow-xl transition-all duration-300 overflow-hidden",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-display font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                    </CardTitle>
                    <Badge variant={stockStatus.variant} className="ml-2 flex-shrink-0">
                        {stockStatus.status}
                    </Badge>
                </div>
                <p className="text-sm text-gray-600 font-body line-clamp-3 leading-relaxed">
                    {product.description}
                </p>
            </CardHeader>

            <CardContent className="relative space-y-4">
                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Stock */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Stock</span>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm font-medium ${product.isLowStock ? 'text-red-600' : 'text-gray-900'
                            }`}>
                            {product.stockQuantity} units
                        </span>
                    </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium text-gray-900">
                        {product.categoryName}
                    </span>
                </div>

                {/* Total Value */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total Value</span>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                            ${(product.price * product.stockQuantity).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    {onView && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(product)}
                            className="flex-1 text-xs"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="flex-1 text-xs"
                        >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="flex-1 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
