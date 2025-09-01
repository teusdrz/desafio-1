import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({
    className,
    size = 'md'
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div
                className={cn(
                    "animate-spin rounded-full border-2 border-primary border-t-transparent",
                    sizeClasses[size],
                    className
                )}
            />
        </div>
    )
}
