'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, LogIn, Users, Eye, EyeOff } from 'lucide-react'
import { useAuthStore, MOCK_USERS } from '@/stores/authStore'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [selectedMockUser, setSelectedMockUser] = useState<number | null>(null)
  
  const { login, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/products')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push('/products')
    } else {
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  const handleMockUserSelect = (index: number) => {
    const user = MOCK_USERS[index]
    setEmail(user.email)
    setPassword(user.password)
    setSelectedMockUser(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo ao Hypesoft
          </h1>
          <p className="text-gray-600">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {/* Mock Users Demo */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
              <Users className="w-4 h-4" />
              Usuários de Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {MOCK_USERS.map((user, index) => (
                <Button
                  key={index}
                  variant={selectedMockUser === index ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    selectedMockUser === index 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "border-purple-200 hover:bg-purple-50"
                  }`}
                  onClick={() => handleMockUserSelect(index)}
                >
                  {user.role}
                </Button>
              ))}
            </div>
            <p className="text-xs text-purple-600 mt-2">
              Clique em um perfil para preencher automaticamente
            </p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Entrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-blue-700">
              <p className="font-medium mb-1">Sistema de Demonstração</p>
              <p>Use os usuários de exemplo acima ou suas próprias credenciais</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
