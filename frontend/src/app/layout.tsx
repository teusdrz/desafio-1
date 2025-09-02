import type { Metadata } from 'next'
import { Inter, Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const lexend = Lexend({
    subsets: ['latin'],
    variable: '--font-lexend',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'HyperSense - Management System',
    description: 'A comprehensive management system built with Clean Architecture and modern technologies',
    keywords: ['product management', 'inventory', 'dashboard', 'analytics', 'hypersense'],
    authors: [{ name: 'HyperSense Team' }],
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#9333ea',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lexend.variable} ${jetbrainsMono.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#9333ea" />
            </head>
            <body className="font-sans antialiased">
                <ThemeProvider>
                    <Providers>
                        <DashboardLayout>
                            {children}
                        </DashboardLayout>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    )
}
