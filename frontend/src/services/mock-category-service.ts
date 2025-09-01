import {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest
} from '@/types/category'
import { mockCategories } from '@/lib/mock-data'

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockCategoryService = {
    async getCategories(): Promise<Category[]> {
        await delay(300)
        return mockCategories
    },

    async getCategory(id: string): Promise<Category> {
        await delay(200)
        const category = mockCategories.find(c => c.id === id)
        if (!category) {
            throw new Error('Category not found')
        }
        return category
    },

    async createCategory(category: CreateCategoryRequest): Promise<Category> {
        await delay(500)
        const newCategory: Category = {
            id: Math.random().toString(36).substr(2, 9),
            ...category,
            isActive: true,
            productsCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return newCategory
    },

    async updateCategory(id: string, category: UpdateCategoryRequest): Promise<Category> {
        await delay(400)
        const existingCategory = mockCategories.find(c => c.id === id)
        if (!existingCategory) {
            throw new Error('Category not found')
        }

        return {
            ...existingCategory,
            ...category,
            updatedAt: new Date().toISOString()
        }
    },

    async deleteCategory(id: string): Promise<void> {
        await delay(300)
        const index = mockCategories.findIndex(c => c.id === id)
        if (index === -1) {
            throw new Error('Category not found')
        }
        // Simula deletar a categoria (não altera realmente o array mock)
    }
}
