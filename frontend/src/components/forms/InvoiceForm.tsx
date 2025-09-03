'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Save, FileText, Plus, Trash2 } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface InvoiceItem {
    id?: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
}

interface Invoice {
    id?: string
    customerName: string
    customerEmail: string
    description: string
    items: InvoiceItem[]
    subtotal: number
    tax: number
    total: number
    status: 'draft' | 'pending' | 'paid' | 'overdue'
    dueDate: string
    issueDate: string
    notes?: string
}

interface InvoiceFormProps {
    invoice?: Invoice | null
    isOpen: boolean
    onClose: () => void
    onSave: (invoice: Omit<Invoice, 'id'>) => void
}

interface FormData {
    customerName: string
    customerEmail: string
    description: string
    items: InvoiceItem[]
    status: string
    dueDate: string
    issueDate: string
    notes: string
    tax: number
}

interface FormErrors {
    customerName?: string
    customerEmail?: string
    description?: string
    items?: string
    dueDate?: string
    issueDate?: string
}

export function InvoiceForm({ invoice, isOpen, onClose, onSave }: InvoiceFormProps) {
    const { theme } = useTheme()
    const [formData, setFormData] = useState<FormData>({
        customerName: '',
        customerEmail: '',
        description: '',
        items: [{ productName: '', quantity: 1, unitPrice: 0, total: 0 }],
        status: 'draft',
        dueDate: '',
        issueDate: new Date().toISOString().split('T')[0],
        notes: '',
        tax: 0.08, // 8% tax rate
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Dynamic colors based on theme
    const modalBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

    useEffect(() => {
        if (invoice) {
            setFormData({
                customerName: invoice.customerName || '',
                customerEmail: invoice.customerEmail || '',
                description: invoice.description || '',
                items: invoice.items || [{ productName: '', quantity: 1, unitPrice: 0, total: 0 }],
                status: invoice.status || 'draft',
                dueDate: invoice.dueDate || '',
                issueDate: invoice.issueDate || new Date().toISOString().split('T')[0],
                notes: invoice.notes || '',
                tax: invoice.tax || 0.08,
            })
        } else {
            setFormData({
                customerName: '',
                customerEmail: '',
                description: '',
                items: [{ productName: '', quantity: 1, unitPrice: 0, total: 0 }],
                status: 'draft',
                dueDate: '',
                issueDate: new Date().toISOString().split('T')[0],
                notes: '',
                tax: 0.08,
            })
        }
        setErrors({})
    }, [invoice, isOpen])

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubtotal()
        return subtotal + (subtotal * formData.tax)
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Customer name is required'
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Customer email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Invalid email format'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required'
        }

        if (!formData.issueDate) {
            newErrors.issueDate = 'Issue date is required'
        }

        if (formData.items.length === 0 || !formData.items.some(item => item.productName.trim())) {
            newErrors.items = 'At least one item is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const subtotal = calculateSubtotal()
            const total = calculateTotal()

            const invoiceData: Omit<Invoice, 'id'> = {
                ...formData,
                subtotal,
                total,
                tax: formData.tax,
                status: formData.status as Invoice['status']
            }

            await onSave(invoiceData)
            onClose()
        } catch (error) {
            console.error('Error saving invoice:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0, total: 0 }]
        }))
    }

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }))
        }
    }

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        setFormData(prev => {
            const newItems = [...prev.items]
            newItems[index] = { ...newItems[index], [field]: value }

            // Calculate total for this item
            if (field === 'quantity' || field === 'unitPrice') {
                newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
            }

            return { ...prev, items: newItems }
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 ${cardBg}`}>
                <CardHeader className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <CardTitle className={`flex items-center space-x-2 ${titleColor}`}>
                            <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                            <span>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</span>
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName" className={titleColor}>Customer Name *</Label>
                                <Input
                                    id="customerName"
                                    value={formData.customerName}
                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    placeholder="Enter customer name"
                                    className={`${errors.customerName ? 'border-red-500' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                                />
                                {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customerEmail" className={titleColor}>Customer Email *</Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                    placeholder="customer@example.com"
                                    className={`${errors.customerEmail ? 'border-red-500' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                                />
                                {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail}</p>}
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issueDate" className={titleColor}>Issue Date *</Label>
                                <Input
                                    id="issueDate"
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                                    className={`${errors.issueDate ? 'border-red-500' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                                {errors.issueDate && <p className="text-sm text-red-500">{errors.issueDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className={titleColor}>Due Date *</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                    className={`${errors.dueDate ? 'border-red-500' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                                {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className={titleColor}>Status</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className={titleColor}>Description *</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Brief description of the invoice"
                                className={`${errors.description ? 'border-red-500' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Invoice Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className={titleColor}>Invoice Items *</Label>
                                <Button type="button" onClick={addItem} variant="outline" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>

                            {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

                            <div className="space-y-3">
                                {formData.items.map((item, index) => (
                                    <div key={index} className={`grid grid-cols-12 gap-2 items-center p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <div className="col-span-5">
                                            <Input
                                                placeholder="Product/Service name"
                                                value={item.productName}
                                                onChange={(e) => updateItem(index, 'productName', e.target.value)}
                                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                step="0.01"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <div className={`px-3 py-2 rounded text-sm font-medium ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
                                                ${(item.quantity * item.unitPrice).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            {formData.items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tax Rate */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tax" className={titleColor}>Tax Rate (%)</Label>
                                <Input
                                    id="tax"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={(formData.tax * 100).toFixed(2)}
                                    onChange={(e) => handleInputChange('tax', parseFloat(e.target.value) / 100 || 0)}
                                    placeholder="8.00"
                                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}
                                />
                            </div>
                        </div>

                        {/* Totals */}
                        <div className={`p-4 rounded-lg space-y-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                            }`}>
                            <div className={`flex justify-between ${textColor}`}>
                                <span>Subtotal:</span>
                                <span className={`font-medium ${titleColor}`}>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className={`flex justify-between ${textColor}`}>
                                <span>Tax ({(formData.tax * 100).toFixed(1)}%):</span>
                                <span className={`font-medium ${titleColor}`}>${(calculateSubtotal() * formData.tax).toFixed(2)}</span>
                            </div>
                            <div className={`flex justify-between text-lg font-bold border-t pt-2 ${titleColor} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className={titleColor}>Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Additional notes or payment terms..."
                                rows={3}
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
