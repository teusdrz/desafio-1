'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    HelpCircle,
    Search,
    Book,
    MessageCircle,
    Mail,
    Phone,
    Video,
    FileText,
    ChevronDown,
    ChevronRight,
    ExternalLink
} from 'lucide-react'

const helpData = {
    faqs: [
        {
            category: 'Getting Started',
            questions: [
                { q: 'How do I add a new product?', a: 'Navigate to the Products section and click the "Add Product" button. Fill in the required information including name, description, price, and category.' },
                { q: 'How do I manage categories?', a: 'Go to the Categories section where you can create, edit, or delete product categories. You can also organize them hierarchically.' },
                { q: 'How do I view sales statistics?', a: 'Visit the Statistics page to see detailed analytics about your sales, top products, and business performance metrics.' }
            ]
        },
        {
            category: 'Account Management',
            questions: [
                { q: 'How do I change my password?', a: 'Go to Settings > Security and click on "Change Password". You will need to enter your current password and the new password.' },
                { q: 'How do I update my profile information?', a: 'Navigate to Settings > Profile where you can update your name, email, and other personal information.' },
                { q: 'How do I enable two-factor authentication?', a: 'In Settings > Security, find the Two-Factor Authentication section and click "Enable 2FA" to set it up.' }
            ]
        },
        {
            category: 'Products & Inventory',
            questions: [
                { q: 'How do I track inventory levels?', a: 'Each product has an inventory tracking feature. You can set stock levels, low stock alerts, and view inventory history.' },
                { q: 'Can I import products in bulk?', a: 'Yes, use the bulk import feature in the Products section. Download the CSV template and follow the import guidelines.' },
                { q: 'How do I set up product variants?', a: 'When creating or editing a product, you can add variants like size, color, or material with different prices and stock levels.' }
            ]
        }
    ],
    quickLinks: [
        { title: 'User Guide', description: 'Complete documentation for all features', icon: Book, link: '#' },
        { title: 'Video Tutorials', description: 'Step-by-step video guides', icon: Video, link: '#' },
        { title: 'API Documentation', description: 'Developer resources and API docs', icon: FileText, link: '#' },
        { title: 'Community Forum', description: 'Connect with other users', icon: MessageCircle, link: '#' }
    ],
    contactMethods: [
        {
            method: 'Live Chat',
            description: 'Get instant help from our support team',
            availability: 'Available 24/7',
            icon: MessageCircle,
            action: 'Start Chat'
        },
        {
            method: 'Email Support',
            description: 'Send us your questions and concerns',
            availability: 'Response within 24 hours',
            icon: Mail,
            action: 'Send Email'
        },
        {
            method: 'Phone Support',
            description: 'Speak directly with our support team',
            availability: 'Mon-Fri, 9AM-6PM',
            icon: Phone,
            action: 'Call Now'
        }
    ]
}

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

    const filteredFaqs = helpData.faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Help Center</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Find answers, guides, and get support</p>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search for help articles, guides, or FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 py-3 text-lg bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {helpData.quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                        <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{link.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{link.description}</p>
                                <Button variant="outline" size="sm" className="w-full bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Access
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* FAQs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Frequently Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {filteredFaqs.length === 0 && searchQuery ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 dark:text-gray-400">No FAQs found matching your search.</p>
                                    </div>
                                ) : (
                                    filteredFaqs.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="space-y-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                                                    {category.category}
                                                </Badge>
                                            </h3>
                                            <div className="space-y-2">
                                                {category.questions.map((faq, faqIndex) => {
                                                    const faqId = `${categoryIndex}-${faqIndex}`
                                                    const isExpanded = expandedFaq === faqId

                                                    return (
                                                        <div key={faqIndex} className="border border-gray-200 dark:border-gray-800 rounded-lg">
                                                            <button
                                                                onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                                                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                            >
                                                                <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                                                                {isExpanded ? (
                                                                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                                )}
                                                            </button>
                                                            {isExpanded && (
                                                                <div className="px-4 pb-3 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                                                                    <p className="pt-3">{faq.a}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Support */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Contact Support
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {helpData.contactMethods.map((contact, index) => {
                            const Icon = contact.icon
                            return (
                                <div key={index} className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{contact.method}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contact.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{contact.availability}</p>
                                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                                        {contact.action}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Status</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Check if all systems are operational</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">All systems operational</span>
                            </div>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Feature Requests</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Suggest new features or improvements</p>
                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
