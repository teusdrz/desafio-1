import {
    Product,
    ProductListResponse,
    CreateProductRequest,
    UpdateProductRequest,
    UpdateProductStockRequest,
    ProductFilters
} from '@/types/product'
import { mockProducts } from '@/lib/mock-data'

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockProductService = {
    async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
        await delay(300)

        let filteredProducts = [...mockProducts]

        if (filters.categoryId) {
            filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId)
        }

        if (filters.search || filters.searchTerm) {
            const searchLower = (filters.search || filters.searchTerm || '').toLowerCase()
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            )
        }

        const page = filters.page || 1
        const pageSize = filters.pageSize || 10
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize

        return {
            products: filteredProducts.slice(startIndex, endIndex),
            totalCount: filteredProducts.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredProducts.length / pageSize)
        }
    },

    async getProduct(id: string): Promise<Product> {
        await delay(200)
        const product = mockProducts.find(p => p.id === id)
        if (!product) {
            throw new Error('Product not found')
        }
        return product
    },

    async createProduct(product: CreateProductRequest): Promise<Product> {
        await delay(500)
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            ...product,
            categoryName: 'Mock Category',
            isLowStock: product.stockQuantity < 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return newProduct
    },

    async updateProduct(id: string, product: UpdateProductRequest): Promise<Product> {
        await delay(400)
        const existingProduct = mockProducts.find(p => p.id === id)
        if (!existingProduct) {
            throw new Error('Product not found')
        }

        return {
            ...existingProduct,
            ...product,
            updatedAt: new Date().toISOString()
        }
    },

    async updateProductStock(id: string, stock: UpdateProductStockRequest): Promise<Product> {
        await delay(400)
        const existingProduct = mockProducts.find(p => p.id === id)
        if (!existingProduct) {
            throw new Error('Product not found')
        }

        return {
            ...existingProduct,
            stockQuantity: stock.stockQuantity,
            isLowStock: stock.stockQuantity < 10,
            updatedAt: new Date().toISOString()
        }
    },

    async deleteProduct(id: string): Promise<void> {
        await delay(300)
        const index = mockProducts.findIndex(p => p.id === id)
        if (index === -1) {
            throw new Error('Product not found')
        }
        // Simula deletar o produto (não altera realmente o array mock)
    },

    async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
        await delay(250)
        return mockProducts.filter(p => p.isLowStock)
    }
}
