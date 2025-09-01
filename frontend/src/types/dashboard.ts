import { Product } from './product';
import { CategoryStats } from './category';

export interface DashboardData {
    totalProducts: number;
    totalCategories: number;
    totalStockValue: number;
    lowStockProductsCount: number;
    lowStockProducts: Product[];
    categoryStats: CategoryStats[];
    productsByCategory: CategoryProductCount[];
}

export interface CategoryProductCount {
    categoryName: string;
    productCount: number;
    value: number;
}

export interface DashboardStats {
    label: string;
    value: number;
    icon: string;
    color: string;
}
