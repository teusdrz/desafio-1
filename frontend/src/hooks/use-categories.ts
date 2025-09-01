import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/services/category-service'
import {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest
} from '@/types/category'
import { useToast } from '@/hooks/use-toast'

export const useCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useCategory = (id: string) => {
    return useQuery<Category>({
        queryKey: ['category', id],
        queryFn: () => categoryService.getCategory(id),
        enabled: !!id,
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (category: CreateCategoryRequest) => categoryService.createCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Category created successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create category',
                variant: 'destructive',
            })
        },
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, category }: { id: string; category: UpdateCategoryRequest }) =>
            categoryService.updateCategory(id, category),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.setQueryData(['category', data.id], data)
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Category updated successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update category',
                variant: 'destructive',
            })
        },
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
            toast({
                title: 'Success',
                description: 'Category deleted successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete category',
                variant: 'destructive',
            })
        },
    })
}
