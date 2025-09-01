export interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    productsCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
}

export interface CategoryStats {
    categoryId: string;
    categoryName: string;
    productsCount: number;
    totalValue: number;
}
