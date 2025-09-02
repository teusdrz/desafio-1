'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Settings, User, Bell, Shield, Database, Mail, Globe, Save } from 'lucide-react'
import { AuthGuard } from '@/components/auth/AuthGuard'

const settingsData = {
    profile: {
        name: 'ProductManager',
        email: 'product@hypesoft.com',
        role: 'Product Manager',
        joinDate: 'January 2024'
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: false,
        orderUpdates: true,
        securityAlerts: true
    },
    system: {
        language: 'English',
        timezone: 'UTC-3 (America/Sao_Paulo)',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
    },
    security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2 months ago',
        activeSessions: 3
    }
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [settings, setSettings] = useState(settingsData)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'system', label: 'System', icon: Database }
    ]

    return (
        <AuthGuard requiredPermissions={['settings:read']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-4">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        Profile Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={settings.profile.name}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    profile: { ...settings.profile, name: e.target.value }
                                                })}
                                                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={settings.profile.email}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    profile: { ...settings.profile, email: e.target.value }
                                                })}
                                                className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-gray-700 dark:text-gray-300">Role</Label>
                                            <div className="mt-1">
                                                <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                                                    {settings.profile.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 dark:text-gray-300">Member Since</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings.profile.joinDate}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        Notification Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {Object.entries(settings.notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {key === 'emailNotifications' && 'Receive notifications via email'}
                                                        {key === 'pushNotifications' && 'Receive push notifications in browser'}
                                                        {key === 'orderUpdates' && 'Get notified about order status changes'}
                                                        {key === 'securityAlerts' && 'Receive security-related alerts'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            [key]: !value
                                                        }
                                                    })}
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                >
                                                    <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                                        }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        Security Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                                <Badge variant={settings.security.twoFactorEnabled ? "default" : "secondary"} className="dark:bg-gray-700 dark:text-gray-300">
                                                    {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                Add an extra layer of security to your account
                                            </p>
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                                            </Button>
                                        </div>

                                        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Password</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                Last changed: {settings.security.lastPasswordChange}
                                            </p>
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                Change Password
                                            </Button>
                                        </div>

                                        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Active Sessions</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                You have {settings.security.activeSessions} active sessions
                                            </p>
                                            <Button variant="outline" size="sm" className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                Manage Sessions
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* System Tab */}
                        {activeTab === 'system' && (
                            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        System Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">Language</Label>
                                            <select
                                                id="language"
                                                value={settings.system.language}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    system: { ...settings.system, language: e.target.value }
                                                })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                            >
                                                <option value="English">English</option>
                                                <option value="Portuguese">Portuguese</option>
                                                <option value="Spanish">Spanish</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="timezone" className="text-gray-700 dark:text-gray-300">Timezone</Label>
                                            <select
                                                id="timezone"
                                                value={settings.system.timezone}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    system: { ...settings.system, timezone: e.target.value }
                                                })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                            >
                                                <option value="UTC-3 (America/Sao_Paulo)">UTC-3 (America/Sao_Paulo)</option>
                                                <option value="UTC-5 (America/New_York)">UTC-5 (America/New_York)</option>
                                                <option value="UTC+0 (Europe/London)">UTC+0 (Europe/London)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Currency</Label>
                                            <select
                                                id="currency"
                                                value={settings.system.currency}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    system: { ...settings.system, currency: e.target.value }
                                                })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="BRL">BRL</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="dateFormat" className="text-gray-700 dark:text-gray-300">Date Format</Label>
                                            <select
                                                id="dateFormat"
                                                value={settings.system.dateFormat}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    system: { ...settings.system, dateFormat: e.target.value }
                                                })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                            >
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}
