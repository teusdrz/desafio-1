'use client';

import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Package, FolderOpen, Users, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';
import { CustomLogoIcon } from '@/components/icons/CustomLogoIcon';
import Dashboard from '@/components/dashboard/Dashboard';

export default function HomePage() {
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    // Tech stack for display
    const techStack = [
        '.NET 9', 'Next.js 14', 'TypeScript', 'TailwindCSS',
        'Clean Architecture', 'DDD', 'CQRS', 'MediatR',
        'Entity Framework', 'xUnit', 'Docker'
    ];

    // Main features
    const features = [
        {
            icon: <Package className="w-6 h-6" />,
            title: "Product Management",
            description: "Complete CRUD operations for products with robust validations and stock control"
        },
        {
            icon: <FolderOpen className="w-6 h-6" />,
            title: "Categories",
            description: "Hierarchical product organization with flexible category system"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "User Control",
            description: "Authentication and authorization system with different access levels"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Security",
            description: "JWT, input validations and protection against vulnerabilities"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Performance",
            description: "Optimized with Redis cache and efficient queries"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Scalability",
            description: "Architecture prepared for growth and high availability"
        }
    ];

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.log('Auth check failed:', error);
            } finally {
                setIsLoading(false);
                setAuthChecked(true);
            }
        };

        verifyAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, show dashboard
    if (isAuthenticated && user) {
        return <Dashboard />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Header for Landing */}
            <header className="border-b border-gray-200 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <CustomLogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">ShopSense</h1>
                            <p className="text-xs text-gray-500">Management System</p>
                        </div>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <a href="/login">Sign In</a>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Management System
                            <br />
                            <span className="text-4xl md:text-6xl text-blue-600">ShopSense</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                            Complete platform for product and category management
                            <br />
                            <span className="text-lg md:text-xl">Built with modern technologies and robust architecture</span>
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            {techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                                onClick={() => router.push('/login')}
                            >
                                Access System
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
                                onClick={() => router.push('#features')}
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your products and business efficiently
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Try the Demo
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Experience the full functionality with our demo accounts
                        </p>

                        <div className="bg-gray-50 rounded-xl p-8 mb-8 text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Credentials:</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Admin:</strong> admin@hypesoft.com / admin123</p>
                                <p><strong>Manager:</strong> manager@hypesoft.com / manager123</p>
                                <p><strong>User:</strong> user@hypesoft.com / user123</p>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                            onClick={() => router.push('/login')}
                        >
                            Start Demo
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
