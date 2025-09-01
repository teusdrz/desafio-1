'use client'

import { Product } from '@/types/product'
import { AlertTriangle, Package } from 'lucide-react'

interface LowStockProductsProps {
    products: Product[]
}

export function LowStockProducts({ products }: LowStockProductsProps) {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    All Good!
                </h3>
                <p className="text-muted-foreground">
                    No products with low stock levels
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5"
                >
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <div>
                            <h4 className="font-medium text-foreground">
                                {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {product.categoryName}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-destructive">
                            {product.stockQuantity} units
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ${product.price}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
