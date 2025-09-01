import { Product } from '@/types/product'
import { Category } from '@/types/category'

export const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Eletrônicos',
        description: 'Dispositivos eletrônicos em geral',
        isActive: true,
        productsCount: 25,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Roupas',
        description: 'Vestuário e acessórios',
        isActive: true,
        productsCount: 45,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        name: 'Livros',
        description: 'Livros e material educativo',
        isActive: true,
        productsCount: 15,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
]

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Smartphone XYZ',
        description: 'Smartphone com tela de 6.5 polegadas e 128GB de armazenamento',
        price: 1299.99,
        stockQuantity: 50,
        categoryId: '1',
        categoryName: 'Eletrônicos',
        isLowStock: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Camiseta Azul',
        description: 'Camiseta de algodão azul marinho tamanho M',
        price: 59.99,
        stockQuantity: 25,
        categoryId: '2',
        categoryName: 'Roupas',
        isLowStock: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        name: 'Livro de JavaScript',
        description: 'Guia completo para desenvolvimento JavaScript moderno',
        price: 89.99,
        stockQuantity: 3,
        categoryId: '3',
        categoryName: 'Livros',
        isLowStock: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '4',
        name: 'Notebook Gamer',
        description: 'Notebook para jogos com placa de vídeo dedicada',
        price: 4999.99,
        stockQuantity: 8,
        categoryId: '1',
        categoryName: 'Eletrônicos',
        isLowStock: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '5',
        name: 'Jaqueta de Couro',
        description: 'Jaqueta de couro sintético preta',
        price: 199.99,
        stockQuantity: 2,
        categoryId: '2',
        categoryName: 'Roupas',
        isLowStock: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
]

export const mockDashboardStats = {
    totalProducts: mockProducts.length,
    totalCategories: mockCategories.length,
    lowStockProducts: mockProducts.filter(p => p.isLowStock).length,
    totalValue: mockProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0),
    productsByCategory: mockCategories.map(cat => ({
        name: cat.name,
        value: mockProducts.filter(p => p.categoryId === cat.id).length
    }))
}
