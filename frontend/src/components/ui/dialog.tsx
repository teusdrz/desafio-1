'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

interface DialogContentProps {
    className?: string
    children: React.ReactNode
}

interface DialogHeaderProps {
    children: React.ReactNode
}

interface DialogTitleProps {
    children: React.ReactNode
    className?: string
}

interface DialogFooterProps {
    children: React.ReactNode
    className?: string
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false)
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [open, onOpenChange])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog content */}
            <div ref={dialogRef} className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export function DialogContent({ className = '', children }: DialogContentProps) {
    return (
        <div className={`
            bg-white dark:bg-gray-950 
            rounded-lg shadow-lg 
            w-full max-w-md 
            mx-4 
            border border-gray-200 dark:border-gray-800
            ${className}
        `}>
            {children}
        </div>
    )
}

export function DialogHeader({ children }: DialogHeaderProps) {
    return (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            {children}
        </div>
    )
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
    return (
        <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
            {children}
        </h2>
    )
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    )
}
