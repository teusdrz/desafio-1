'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Upload, FileText, Database, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface ExportImportProps {
    onExport?: (type: string) => void
    onImport?: (file: File, type: string) => void
}

interface ExportOption {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    formats: string[]
    estimatedSize: string
}

const exportOptions: ExportOption[] = [
    {
        id: 'products',
        name: 'Products Data',
        description: 'All product information including categories and inventory',
        icon: <Database className="w-5 h-5" />,
        formats: ['CSV', 'JSON', 'Excel'],
        estimatedSize: '~2.5 MB'
    },
    {
        id: 'customers',
        name: 'Customer Data',
        description: 'Customer profiles, contact information, and order history',
        icon: <FileText className="w-5 h-5" />,
        formats: ['CSV', 'JSON'],
        estimatedSize: '~850 KB'
    },
    {
        id: 'invoices',
        name: 'Invoice Records',
        description: 'All invoice data with payment status and line items',
        icon: <FileText className="w-5 h-5" />,
        formats: ['PDF', 'CSV', 'JSON'],
        estimatedSize: '~1.2 MB'
    },
    {
        id: 'analytics',
        name: 'Analytics Reports',
        description: 'Sales reports, trends, and performance metrics',
        icon: <Database className="w-5 h-5" />,
        formats: ['PDF', 'Excel', 'CSV'],
        estimatedSize: '~3.1 MB'
    }
]

export function ExportImportManager({ onExport, onImport }: ExportImportProps) {
    const [activeExports, setActiveExports] = useState<Set<string>>(new Set())
    const [completedExports, setCompletedExports] = useState<Set<string>>(new Set())

    const handleExport = async (optionId: string, format: string) => {
        setActiveExports(prev => new Set(prev).add(optionId))

        // Simulate export process
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Create mock file download
            const option = exportOptions.find(opt => opt.id === optionId)
            if (option) {
                const mockData = `# ${option.name} Export\n# Generated on ${new Date().toISOString()}\n# Format: ${format}\n\nSample data would be here...`
                const blob = new Blob([mockData], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${optionId}_export_${Date.now()}.${format.toLowerCase()}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }

            setCompletedExports(prev => new Set(prev).add(optionId))
            onExport?.(optionId)
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setActiveExports(prev => {
                const next = new Set(prev)
                next.delete(optionId)
                return next
            })
        }
    }

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0]
        if (file) {
            onImport?.(file, type)
            // Reset input
            event.target.value = ''
        }
    }

    const getExportStatus = (optionId: string) => {
        if (activeExports.has(optionId)) {
            return { icon: <Clock className="w-4 h-4" />, text: 'Exporting...', variant: 'secondary' as const }
        }
        if (completedExports.has(optionId)) {
            return { icon: <CheckCircle className="w-4 h-4" />, text: 'Completed', variant: 'default' as const }
        }
        return null
    }

    return (
        <div className="space-y-6">
            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Download className="w-5 h-5 text-purple-600" />
                        <span>Export Data</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {exportOptions.map((option) => {
                            const status = getExportStatus(option.id)
                            return (
                                <div key={option.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                {option.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{option.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {option.description}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <div className="flex items-center space-x-1">
                                                        {option.formats.map((format) => (
                                                            <Badge key={format} variant="outline" className="text-xs">
                                                                {format}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {option.estimatedSize}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {status && (
                                                <Badge variant={status.variant} className="flex items-center space-x-1">
                                                    {status.icon}
                                                    <span>{status.text}</span>
                                                </Badge>
                                            )}
                                            <div className="flex items-center space-x-1">
                                                {option.formats.map((format) => (
                                                    <Button
                                                        key={format}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleExport(option.id, format)}
                                                        disabled={activeExports.has(option.id)}
                                                        className="text-xs"
                                                    >
                                                        {format}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Import Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-purple-600" />
                        <span>Import Data</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                                        Important Notes Before Importing
                                    </h3>
                                    <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <li>• Make sure to backup your current data before importing</li>
                                        <li>• Imported data will merge with existing records</li>
                                        <li>• Duplicate entries will be automatically handled</li>
                                        <li>• Only CSV, JSON, and Excel formats are supported</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exportOptions.map((option) => (
                                <div key={option.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            {option.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">{option.name}</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Import {option.name.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".csv,.json,.xlsx,.xls"
                                            onChange={(e) => handleFileImport(e, option.id)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id={`import-${option.id}`}
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <label htmlFor={`import-${option.id}`} className="cursor-pointer">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Choose File
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Operations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        <span>Bulk Operations</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                exportOptions.forEach(option => {
                                    handleExport(option.id, 'JSON')
                                })
                            }}
                            className="flex items-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export All (JSON)</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm('This will create a complete backup of all your data. Continue?')) {
                                    // Simulate full backup
                                    const backupData = {
                                        timestamp: new Date().toISOString(),
                                        version: '1.0',
                                        data: {
                                            products: 'Product data would be here...',
                                            customers: 'Customer data would be here...',
                                            invoices: 'Invoice data would be here...',
                                            settings: 'Settings data would be here...'
                                        }
                                    }
                                    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `full_backup_${Date.now()}.json`
                                    document.body.appendChild(a)
                                    a.click()
                                    document.body.removeChild(a)
                                    URL.revokeObjectURL(url)
                                }
                            }}
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Create Full Backup
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
