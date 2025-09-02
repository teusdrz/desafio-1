'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'hypersense-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage?.getItem(storageKey) as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [storageKey])

    useEffect(() => {
        if (mounted) {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(theme)
        }
    }, [theme, mounted])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            if (mounted) {
                localStorage?.setItem(storageKey, theme)
            }
            setTheme(theme)
        },
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
