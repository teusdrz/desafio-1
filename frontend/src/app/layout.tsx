import type { Metadata } from 'next'
import { Inter, Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/layout/Navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'

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
    title: 'Hypesoft - Product Management System',
    description: 'A comprehensive product management system built with Clean Architecture and modern technologies',
    keywords: ['product management', 'inventory', 'dashboard', 'analytics', 'hypesoft'],
    authors: [{ name: 'Hypesoft Labs' }],
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
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#9333ea" />
            </head>
            <body className="font-sans antialiased">
                <Providers>
                    <AuthGuard>
                        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/50 to-purple-100/30 relative overflow-x-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239333ea' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                            }} />

                            <Navigation />
                            <main className="relative z-10">
                                {children}
                            </main>

                            {/* Footer */}
                            <footer className="relative z-10 mt-20 py-12 px-6 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white">
                                <div className="container mx-auto text-center">
                                    <div className="mb-6">
                                        <h3 className="font-display text-2xl font-bold mb-2">Hypesoft</h3>
                                        <p className="text-purple-200 max-w-md mx-auto">
                                            Advanced product management system with modern architecture and exceptional user experience.
                                        </p>
                                    </div>
                                    <div className="border-t border-purple-700 pt-6 text-purple-300 text-sm">
                                        © 2025 Hypesoft Labs. Built with Clean Architecture + DDD.
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </AuthGuard>
                </Providers>
            </body>
        </html>
    )
}
