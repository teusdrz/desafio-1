import { mockDashboardStats, mockProducts } from '@/lib/mock-data'
import { Product } from '@/types/product'

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface DashboardStats {
    totalProducts: number
    totalCategories: number
    lowStockProducts: Product[]
    totalValue: number
    productsByCategory: { name: string; value: number }[]
}

export const mockDashboardService = {
    async getDashboardStats(): Promise<DashboardStats> {
        await delay(400)
        return {
            ...mockDashboardStats,
            lowStockProducts: mockProducts.filter(p => p.isLowStock)
        }
    }
}
