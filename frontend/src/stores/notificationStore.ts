'use client'

import { create } from 'zustand'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: Date
    read: boolean
}

interface NotificationStore {
    notifications: Notification[]
    unreadCount: number
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    removeNotification: (id: string) => void
    clearAll: () => void
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Stock Alert',
        message: 'Low stock: Linen Shirt (5 units remaining)',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false
    },
    {
        id: '2',
        title: 'New Order',
        message: 'Order #12345 has been placed',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
    },
    {
        id: '3',
        title: 'Price Update',
        message: 'Ankle Pants price updated to $55.00',
        type: 'info',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true
    },
    {
        id: '4',
        title: 'Customer Review',
        message: 'New 5-star review for Linen Shirt',
        type: 'success',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false
    },
]

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.read).length,

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
        }

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }))
    },

    markAsRead: (id) => {
        set((state) => {
            const notifications = state.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
            const unreadCount = notifications.filter(n => !n.read).length

            return { notifications, unreadCount }
        })
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
        }))
    },

    removeNotification: (id) => {
        set((state) => {
            const notifications = state.notifications.filter(n => n.id !== id)
            const unreadCount = notifications.filter(n => !n.read).length

            return { notifications, unreadCount }
        })
    },

    clearAll: () => {
        set({ notifications: [], unreadCount: 0 })
    }
}))
