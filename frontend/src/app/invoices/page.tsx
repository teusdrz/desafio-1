'use client'

import { useState } from 'react'
import { FileText, Search, Eye, Download, Send, Plus, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const mockInvoices = [
    {
        id: 'INV-001',
        customer: 'Alice Johnson',
        amount: '$1,250.00',
        status: 'paid',
        dueDate: '2024-08-15',
        issueDate: '2024-07-15',
        items: 5,
        description: 'Fashion items purchase'
    },
    {
        id: 'INV-002',
        customer: 'Bob Smith',
        amount: '$890.50',
        status: 'pending',
        dueDate: '2024-09-10',
        issueDate: '2024-08-10',
        items: 3,
        description: 'Electronics equipment'
    },
    {
        id: 'INV-003',
        customer: 'Carol Davis',
        amount: '$2,100.00',
        status: 'overdue',
        dueDate: '2024-08-01',
        issueDate: '2024-07-01',
        items: 8,
        description: 'Bulk order - various items'
    },
    {
        id: 'INV-004',
        customer: 'David Wilson',
        amount: '$675.25',
        status: 'draft',
        dueDate: '2024-09-20',
        issueDate: '2024-08-20',
        items: 4,
        description: 'Home & garden supplies'
    },
    {
        id: 'INV-005',
        customer: 'Emma Brown',
        amount: '$445.00',
        status: 'paid',
        dueDate: '2024-08-25',
        issueDate: '2024-07-25',
        items: 2,
        description: 'Sports equipment'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        case 'overdue':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        case 'draft':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default function InvoicesPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredInvoices = mockInvoices.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalAmount = mockInvoices.reduce((sum, invoice) => {
        return sum + parseFloat(invoice.amount.replace('$', '').replace(',', ''))
    }, 0)

    const paidAmount = mockInvoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => {
            return sum + parseFloat(invoice.amount.replace('$', '').replace(',', ''))
        }, 0)

    const pendingAmount = mockInvoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => {
            return sum + parseFloat(invoice.amount.replace('$', '').replace(',', ''))
        }, 0)

    const overdueAmount = mockInvoices
        .filter(invoice => invoice.status === 'overdue')
        .reduce((sum, invoice) => {
            return sum + parseFloat(invoice.amount.replace('$', '').replace(',', ''))
        }, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your invoices and track payments</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Amount</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">All invoices</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Paid</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${paidAmount.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Received payments</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Pending</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${pendingAmount.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting payment</p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Overdue</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${overdueAmount.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Past due date</p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-gray-900 dark:text-white">Invoice Management</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">View and manage all your invoices</CardDescription>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        {filteredInvoices.map((invoice) => (
                            <div key={invoice.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{invoice.id}</h3>
                                                <Badge className={getStatusColor(invoice.status)}>
                                                    {invoice.status}
                                                </Badge>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 font-medium">{invoice.customer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">{invoice.description}</p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Issued: {formatDate(invoice.issueDate)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Due: {formatDate(invoice.dueDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-2">
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoice.amount}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.items} items</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </Button>
                                            {invoice.status !== 'paid' && (
                                                <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Send
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
