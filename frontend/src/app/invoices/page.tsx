'use client'

import { useState } from 'react'
import { FileText, Search, Eye, Download, Send, Plus, Calendar, DollarSign, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { InvoiceForm } from '@/components/forms/InvoiceForm'
import { useTheme } from '@/components/theme-provider'

interface InvoiceItem {
    id?: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
}

interface Invoice {
    id: string
    customerName: string
    customerEmail: string
    amount: string
    status: 'draft' | 'pending' | 'paid' | 'overdue'
    dueDate: string
    issueDate: string
    items: InvoiceItem[]
    description: string
    subtotal: number
    tax: number
    total: number
    notes?: string
}

const mockInvoices: Invoice[] = [
    {
        id: 'INV-001',
        customerName: 'Alice Johnson',
        customerEmail: 'alice.johnson@email.com',
        amount: '$1,250.00',
        status: 'paid',
        dueDate: '2024-08-15',
        issueDate: '2024-07-15',
        items: [
            { productName: 'Summer Dress', quantity: 2, unitPrice: 89.99, total: 179.98 },
            { productName: 'Sandals', quantity: 1, unitPrice: 69.99, total: 69.99 },
            { productName: 'Hat', quantity: 3, unitPrice: 29.99, total: 89.97 }
        ],
        description: 'Fashion items purchase',
        subtotal: 1157.41,
        tax: 0.08,
        total: 1250.00
    },
    {
        id: 'INV-002',
        customerName: 'Bob Smith',
        customerEmail: 'bob.smith@email.com',
        amount: '$890.50',
        status: 'pending',
        dueDate: '2024-09-10',
        issueDate: '2024-08-10',
        items: [
            { productName: 'Laptop', quantity: 1, unitPrice: 599.99, total: 599.99 },
            { productName: 'Mouse', quantity: 2, unitPrice: 25.99, total: 51.98 }
        ],
        description: 'Electronics equipment',
        subtotal: 824.54,
        tax: 0.08,
        total: 890.50
    },
    {
        id: 'INV-003',
        customerName: 'Carol Williams',
        customerEmail: 'carol.williams@email.com',
        amount: '$2,150.75',
        status: 'overdue',
        dueDate: '2024-07-30',
        issueDate: '2024-07-01',
        items: [
            { productName: 'Office Chair', quantity: 4, unitPrice: 299.99, total: 1199.96 },
            { productName: 'Desk Lamp', quantity: 6, unitPrice: 49.99, total: 299.94 },
            { productName: 'Notebook', quantity: 10, unitPrice: 12.99, total: 129.90 }
        ],
        description: 'Office supplies',
        subtotal: 1991.44,
        tax: 0.08,
        total: 2150.75
    },
    {
        id: 'INV-004',
        customerName: 'David Brown',
        customerEmail: 'david.brown@email.com',
        amount: '$560.25',
        status: 'draft',
        dueDate: '2024-09-20',
        issueDate: '2024-08-20',
        items: [
            { productName: 'Consulting Hours', quantity: 8, unitPrice: 75.00, total: 600.00 }
        ],
        description: 'Consulting services',
        subtotal: 518.75,
        tax: 0.08,
        total: 560.25
    }
]

export default function InvoicesPage() {
    const { theme } = useTheme()
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

    // Dynamic colors based on theme
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'

    const filteredInvoices = invoices.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateInvoice = () => {
        setEditingInvoice(null)
        setIsFormOpen(true)
    }

    const handleEditInvoice = (invoice: Invoice) => {
        setEditingInvoice(invoice)
        setIsFormOpen(true)
    }

    const handleDeleteInvoice = (invoiceId: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId))
        }
    }

    const handleSaveInvoice = async (invoiceData: Omit<Invoice, 'id' | 'amount'>) => {
        try {
            if (editingInvoice) {
                // Update existing invoice
                setInvoices(prev => prev.map(invoice =>
                    invoice.id === editingInvoice.id
                        ? {
                            ...invoice,
                            ...invoiceData,
                            amount: `$${invoiceData.total.toFixed(2)}`
                        }
                        : invoice
                ))
            } else {
                // Create new invoice
                const newInvoice: Invoice = {
                    id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
                    ...invoiceData,
                    amount: `$${invoiceData.total.toFixed(2)}`
                }
                setInvoices(prev => [...prev, newInvoice])
            }
            setIsFormOpen(false)
            setEditingInvoice(null)
        } catch (error) {
            console.error('Error saving invoice:', error)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            paid: { variant: 'default' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            overdue: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
            draft: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

        return (
            <Badge variant={config.variant} className={config.className}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const paidInvoices = invoices.filter(inv => inv.status === 'paid')
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending')
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Create, manage, and track your invoices</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${totalRevenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            +18% <span className="text-gray-500 dark:text-gray-400">from last month</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {paidInvoices.length}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            ${paidInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} collected
                        </p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</CardTitle>
                        <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {pendingInvoices.length}
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-1">
                            ${pendingInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} pending
                        </p>
                    </CardContent>
                </Card>

                <Card className={cardBg}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</CardTitle>
                        <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {overdueInvoices.length}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                            ${overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} overdue
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            <Card className={cardBg}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Invoice List</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Manage and track all your invoices
                            </CardDescription>
                        </div>
                        <Button onClick={handleCreateInvoice} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Invoice
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search invoices by ID, customer, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Invoice Items */}
                        <div className="space-y-3">
                            {filteredInvoices.map((invoice) => (
                                <div key={invoice.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{invoice.id}</h3>
                                                    {getStatusBadge(invoice.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    {invoice.customerName} • {invoice.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>Issued: {invoice.issueDate}</span>
                                                    <span>Due: {invoice.dueDate}</span>
                                                    <span>{invoice.items.length} items</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {invoice.amount}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Tax: ${(invoice.subtotal * invoice.tax).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditInvoice(invoice)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteInvoice(invoice.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredInvoices.length === 0 && (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first invoice'}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Invoice Form Modal */}
            <InvoiceForm
                invoice={editingInvoice}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingInvoice(null)
                }}
                onSave={handleSaveInvoice}
            />
        </div>
    )
}
