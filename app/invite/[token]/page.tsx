'use client'

// HumaniQ AI - Invite Registration Page
// Handles company invite registration with pre-filled company name

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Building } from 'lucide-react'
import { isValidEmail, isValidPassword } from '@/lib/utils'

interface InviteData {
  id: string
  token: string
  companyName?: string
  isValid: boolean
  isExpired: boolean
}

export default function InviteRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [isLoadingInvite, setIsLoadingInvite] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    userType: 'EMPLOYEE' as const
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate invite token on component mount
  useEffect(() => {
    const validateInvite = async () => {
      try {
        const response = await fetch(`/api/invites/validate/${token}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setInviteData(data.invite)
          // Pre-fill company name and user type if available
          if (data.invite.companyName) {
            setFormData(prev => ({
              ...prev,
              companyName: data.invite.companyName,
              userType: data.invite.suggestedUserType || 'EMPLOYEE'
            }))
          }
        } else {
          toast.error('Convite inválido', {
            description: data.error?.message || 'Este convite não é válido ou expirou.'
          })
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Error validating invite:', error)
        toast.error('Erro ao validar convite', {
          description: 'Ocorreu um erro inesperado. Tente novamente.'
        })
        router.push('/auth/login')
      } finally {
        setIsLoadingInvite(false)
      }
    }

    if (token) {
      validateInvite()
    }
  }, [token, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nome da empresa é obrigatório'
    }

    const passwordValidation = isValidPassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0]
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          companyName: formData.companyName.trim(),
          password: formData.password,
          userType: formData.userType,
          inviteToken: token
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Conta criada com sucesso!', {
          description: 'Você pode fazer login agora.'
        })
        router.push('/auth/login?message=account-created')
      } else {
        toast.error('Erro ao criar conta', {
          description: data.error?.message || 'Tente novamente.'
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Erro interno', {
        description: 'Ocorreu um erro inesperado. Tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isLoadingInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Validando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inviteData || !inviteData.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-4">
              <Building className="h-12 w-12 mx-auto mb-2" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Convite Inválido</h2>
            <p className="text-muted-foreground mb-4">
              Este convite não é válido ou expirou.
            </p>
            <Button onClick={() => router.push('/auth/login')}>
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao HumaniQ AI
          </h1>
          <p className="text-gray-600">
            Complete seu cadastro para acessar a plataforma
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Você foi convidado para se cadastrar. Preencha os dados abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="João"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                      autoComplete="given-name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Sobrenome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Silva"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-10 ${errors.lastName ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                      autoComplete="family-name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Nome da sua empresa"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`pl-10 ${errors.companyName ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                    autoComplete="organization"
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completar Cadastro...
                  </>
                ) : (
                  'Completar Cadastro'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}