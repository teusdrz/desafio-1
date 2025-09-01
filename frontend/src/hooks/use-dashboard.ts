import { useQuery } from '@tanstack/react-query'
import { mockDashboardService, DashboardStats } from '@/services/mock-dashboard-service'

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => mockDashboardService.getDashboardStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
