
'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const callbackUrlParam = searchParams.get('callbackUrl') || undefined

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Attempting login with:', { email, hasCallbackUrl: !!callbackUrlParam })
      
      // Always handle redirect manually to prevent race conditions
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Always handle redirect manually
      })

      console.log('🔐 Login result:', result)

      if (result?.error) {
        console.log('❌ Login error:', result.error)
        setError('Email ou senha inválidos. Por favor, tente novamente.')
        toast.error('Credenciais inválidas', {
          description: 'Verifique seu email e senha.',
        })
      } else if (result?.ok) {
        console.log('✅ Login successful, getting session...')
        toast.success('Login realizado com sucesso!')
        
        // Wait for session to be established with retries
        let session = null
        let retries = 0
        const maxRetries = 5
        
        while (!session && retries < maxRetries) {
          try {
            session = await getSession()
            if (!session) {
              console.log(`⏳ Session not ready, retry ${retries + 1}/${maxRetries}`)
              await new Promise(resolve => setTimeout(resolve, 300))
              retries++
            }
          } catch (sessionError) {
            console.error('❌ Error getting session:', sessionError)
            retries++
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }
        
        console.log('📋 Session data:', session)
        
        if (session?.user?.userType) {
          let redirectPath = callbackUrlParam || '/'
          
          // Use callbackUrl if provided, otherwise redirect based on user type
          if (!callbackUrlParam) {
            switch (session.user.userType) {
              case 'ADMIN':
                redirectPath = '/admin'
                break
              case 'COMPANY':
                redirectPath = '/empresa'
                break
              case 'EMPLOYEE':
                redirectPath = '/colaborador'
                break
              case 'CANDIDATE':
                redirectPath = '/candidato'
                break
              default:
                redirectPath = '/'
            }
          }
          
          console.log(`🔄 Redirecting ${session.user.userType} to:`, redirectPath)
          // Use window.location.href for better browser compatibility
          window.location.href = redirectPath
        } else {
          console.log('⚠️ No user type found after retries, redirecting to home')
          window.location.href = '/'
        }
      }
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
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">Entrar na Plataforma</CardTitle>
          <CardDescription className="text-center text-gray-600">
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


        </CardContent>
      </Card>
    </>
  )
}
