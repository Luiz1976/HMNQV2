'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  Edit,
  Save,
  X,
  UserCheck,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

export default function PerfilUsuario() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || ''
      })
    }
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await update()
        setIsEditing(false)
        toast.success('Perfil atualizado com sucesso!')
      } else {
        toast.error('Erro ao atualizar perfil')
      }
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || ''
      })
    }
    setIsEditing(false)
  }

  const getUserTypeLabel = () => {
    return session?.user?.userType === 'EMPLOYEE' ? 'Colaborador' : 'Candidato'
  }

  const getUserTypeColor = () => {
    return session?.user?.userType === 'EMPLOYEE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session?.user?.avatarUrl || ''} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                    {session?.user?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || 'Usuário'}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Badge className={getUserTypeColor()}>
                  <UserCheck className="h-3 w-3 mr-1" />
                  {getUserTypeLabel()}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{session?.user?.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {loading ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Digite seu nome"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{formData.firstName || 'Não informado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Digite seu sobrenome"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{formData.lastName || 'Não informado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Digite seu e-mail"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{formData.email || 'Não informado'}</p>
                  )}
                </div>


              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informações da Conta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Usuário</Label>
                    <p className="text-sm text-gray-900 py-2">{getUserTypeLabel()}</p>
                  </div>
                  <div>
                    <Label>Data de Cadastro</Label>
                    <p className="text-sm text-gray-900 py-2">
                      {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}