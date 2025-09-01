import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services/product-service'
import {
    Product,
    ProductListResponse,
    CreateProductRequest,
    UpdateProductRequest,
    UpdateProductStockRequest,
    ProductFilters
} from '@/types/product'
import { useToast } from '@/hooks/use-toast'

export const useProducts = (filters: ProductFilters = {}) => {
    return useQuery<ProductListResponse>({
        queryKey: ['products', filters],
        queryFn: () => productService.getProducts(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    })
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (product: CreateProductRequest) => productService.createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Product created successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create product',
                variant: 'destructive',
            })
        },
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, product }: { id: string; product: UpdateProductRequest }) =>
            productService.updateProduct(id, product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.setQueryData(['product', data.id], data)
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Product updated successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update product',
                variant: 'destructive',
            })
        },
    })
}

export const useUpdateProductStock = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, stock }: { id: string; stock: UpdateProductStockRequest }) =>
            productService.updateProductStock(id, stock),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.setQueryData(['product', data.id], data)
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Stock updated successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update stock',
                variant: 'destructive',
            })
        },
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete product',
                variant: 'destructive',
            })
        },
    })
}

export const useLowStockProducts = (threshold: number = 10) => {
    return useQuery<Product[]>({
        queryKey: ['products', 'low-stock', threshold],
        queryFn: () => productService.getLowStockProducts(threshold),
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}
