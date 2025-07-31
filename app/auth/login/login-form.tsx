
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  // Pre-fill for faster testing
  const [email, setEmail] = useState('admin@humaniq.ai')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Let NextAuth handle the redirect by default.
      // It will only return if there's an error.
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true, // Explicitly set to true, though it's the default
        callbackUrl: '/', // Redirect to home page on success
      })

      if (result?.error) {
        // This part will now be reached only on error
        setError('Email ou senha inválidos. Por favor, tente novamente.')
        toast.error('Credenciais inválidas', {
          description: 'Verifique seu email e senha.',
        })
      }
      // No need for a success toast or router.push, as the page will redirect.
    } catch (error) {
      console.error('Login error:', error)
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
      toast.error('Erro no Login', {
        description: 'Não foi possível conectar ao servidor.',
      })
    } finally {
      setLoading(false)
    }
  }

  // The component now only returns the Card, not the whole page layout.
  return (
    <>
      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar na Plataforma</CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Contas de Demonstração</span>
              </div>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900">👑 Administrador</p>
                <p className="text-blue-700">admin@humaniq.ai • admin123</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-900">🏢 Empresa</p>
                <p className="text-green-700">empresa@demo.com • empresa123</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="font-medium text-purple-900">👤 Colaborador</p>
                <p className="text-purple-700">colaborador@demo.com • colaborador123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
