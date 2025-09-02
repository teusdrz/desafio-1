'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'

export default function UnauthorizedPage() {
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-red-200 shadow-lg">
                <CardHeader className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                        <ShieldX className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-red-700">
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        You don't have sufficient permissions to access this page.
                    </p>

                    {user && (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            <p><strong>User:</strong> {user.name}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button asChild className="bg-purple-600 hover:bg-purple-700">
                            <Link href="/products" className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Go to Products
                            </Link>
                        </Button>

                        <Button variant="outline" asChild>
                            <Link href="javascript:history.back()" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
