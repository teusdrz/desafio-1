export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    categoryName: string;
    stockQuantity: number;
    isLowStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stockQuantity: number;
}

export interface UpdateProductRequest {
    name: string;
    description: string;
    price: number;
    categoryId: string;
}

export interface UpdateProductStockRequest {
    stockQuantity: number;
}

export interface ProductListResponse {
    products: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ProductFilters {
    search?: string;
    searchTerm?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
}
