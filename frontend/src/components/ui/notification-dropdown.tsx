'use client'

import { useState } from 'react'
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotificationStore } from '@/stores/notificationStore'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-4 h-4 text-green-500" />
        case 'warning':
            return <AlertTriangle className="w-4 h-4 text-yellow-500" />
        case 'error':
            return <XCircle className="w-4 h-4 text-red-500" />
        default:
            return <Info className="w-4 h-4 text-blue-500" />
    }
}

const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
}

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore()
    const [isOpen, setIsOpen] = useState(false)

    const handleMarkAsRead = (id: string, event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        markAsRead(id)
    }

    const handleRemove = (id: string, event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        removeNotification(id)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 max-h-96 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800" align="end" side="bottom">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllAsRead()}
                            className="text-xs h-7 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group",
                                    !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                                )}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {notification.message}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            {formatTimeAgo(notification.timestamp)}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                className="h-6 w-6 p-0"
                                                title="Mark as read"
                                            >
                                                <Check className="w-3 h-3" />
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleRemove(notification.id, e)}
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            title="Remove"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearAll()}
                            className="w-full text-xs h-8 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            Clear all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
