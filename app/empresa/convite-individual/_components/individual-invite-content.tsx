'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Briefcase, 
  TestTube, 
  Link as LinkIcon, 
  Copy, 
  Share2, 
  MessageCircle, 
  QrCode,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Test {
  id: string
  name: string
  description?: string
  category: {
    name: string
    color?: string
  }
}

interface InviteData {
  name: string
  email: string
  cpf: string
  position: string
  department: string
  selectedTests: string[]
}

export function IndividualInviteContent() {
  const [inviteData, setInviteData] = useState<InviteData>({
    name: '',
    email: '',
    cpf: '',
    position: '',
    department: '',
    selectedTests: []
  })
  
  const [availableTests, setAvailableTests] = useState<Test[]>([])
  const [isLoadingTests, setIsLoadingTests] = useState(true)
  const [generatedLink, setGeneratedLink] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!inviteData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório'
    }
    
    if (!inviteData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    
    if (inviteData.selectedTests.length === 0) {
      newErrors.evaluations = 'Selecione pelo menos uma avaliação'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof InviteData, value: string) => {
    setInviteData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleEvaluationSelection = (evaluationId: string, checked: boolean) => {
    setInviteData(prev => ({
      ...prev,
      selectedTests: checked 
        ? [...prev.selectedTests, evaluationId]
        : prev.selectedTests.filter(id => id !== evaluationId)
    }))
    
    // Clear evaluations error when user selects an evaluation
    if (errors.evaluations) {
      setErrors(prev => ({ ...prev, evaluations: '' }))
    }
  }

  const handleSelectAllTests = (checked: boolean) => {
    setInviteData(prev => ({
      ...prev,
      selectedTests: checked ? availableTests.map(test => test.id) : []
    }))
    
    if (errors.evaluations) {
      setErrors(prev => ({ ...prev, evaluations: '' }))
    }
  }

  // Carregar testes disponíveis
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoadingTests(true)
        const response = await fetch('/api/empresa/tests')
        const data = await response.json()
        
        if (response.ok && data.tests) {
          setAvailableTests(data.tests)
        } else {
          toast.error('Erro ao carregar testes disponíveis')
        }
      } catch (error) {
        console.error('Erro ao carregar testes:', error)
        toast.error('Erro ao carregar testes disponíveis')
      } finally {
        setIsLoadingTests(false)
      }
    }

    fetchTests()
  }, [])

  const generateInviteLink = async () => {
    if (!validateForm()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/empresa/invites/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedTests: inviteData.selectedTests,
          frequency: 'once'
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success && data.token) {
        const link = data.inviteUrl || `${window.location.origin}/invite/${data.token}`
        setGeneratedLink(link)
        toast.success('Link de convite gerado com sucesso!')
      } else {
        throw new Error(data.error?.message || 'Erro ao gerar convite')
      }
    } catch (error) {
      console.error('Erro ao gerar convite:', error)
      toast.error('Erro ao gerar link de convite')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      toast.success('Link copiado com sucesso!')
    } catch (error) {
      console.error('Erro ao copiar:', error)
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = generatedLink
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        toast.success('Link copiado com sucesso!')
      } catch (fallbackError) {
        toast.error('Não foi possível copiar o link. Tente selecionar e copiar manualmente.')
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  const shareViaWhatsApp = () => {
    const message = `Olá! Segue seu convite para responder aos testes psicossociais via HumaniQ AI: ${generatedLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success('Convite compartilhado via WhatsApp!')
  }

  const shareViaEmail = () => {
    const subject = 'Convite para Testes Psicossociais - HumaniQ AI'
    const body = `Olá,\n\nSegue seu convite para responder aos testes psicossociais via HumaniQ AI:\n\n${generatedLink}\n\nAtenciosamente,\nEquipe HumaniQ AI`
    const mailtoUrl = `mailto:${inviteData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
    toast.success('Cliente de e-mail aberto!')
  }

  const selectedTestsData = availableTests.filter(test => inviteData.selectedTests.includes(test.id))
  const allTestsSelected = inviteData.selectedTests.length === availableTests.length

  return (
    <div className="space-y-6">
      {/* Informações do Colaborador/Candidato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Colaborador/Candidato
          </CardTitle>
          <CardDescription>
            Preencha os dados da pessoa que receberá o convite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={inviteData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite o e-mail"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF (opcional)</Label>
              <Input
                id="cpf"
                value={inviteData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Cargo ou Função (opcional)</Label>
              <Input
                id="position"
                value={inviteData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Digite o cargo ou função"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Setor de Trabalho (opcional)</Label>
              <Input
                id="department"
                value={inviteData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Digite o setor de trabalho"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Testes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Seleção de Testes
          </CardTitle>
          <CardDescription>
            Escolha quais testes psicossociais serão incluídos no convite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select All Option */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="select-all"
              checked={allTestsSelected}
              onCheckedChange={handleSelectAllTests}
            />
            <Label htmlFor="select-all" className="font-medium">
              Selecionar todos os testes
            </Label>
          </div>
          
          <Separator />
          
          {/* Individual Evaluations */}
          {isLoadingTests ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-2 text-gray-600">Carregando testes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableTests.map((test) => (
                <div key={test.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={test.id}
                    checked={inviteData.selectedTests.includes(test.id)}
                    onCheckedChange={(checked) => handleEvaluationSelection(test.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={test.id} className="font-medium cursor-pointer">
                      {test.name}
                    </Label>
                    {test.description && (
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    )}
                    <Badge variant="outline" className="mt-2">
                      {test.category.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {errors.evaluations && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.evaluations}
            </p>
          )}
          
          {/* Selected Evaluations Summary */}
          {inviteData.selectedTests.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">
                Avaliações selecionadas ({inviteData.selectedTests.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTestsData.map((test) => (
                  <Badge key={test.id} variant="secondary">
                    {test.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Invite Button */}
      <div className="flex justify-center">
        <Button
          onClick={generateInviteLink}
          disabled={isGenerating}
          size="lg"
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Gerando Convite...
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4 mr-2" />
              Gerar Convite
            </>
          )}
        </Button>
      </div>

      {/* Generated Link Section */}
      {generatedLink && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Convite Gerado com Sucesso!
            </CardTitle>
            <CardDescription className="text-green-700">
              Compartilhe o link abaixo com o colaborador/candidato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Generated Link Display */}
            <div className="space-y-2">
              <Label>Link do Convite</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="bg-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg">
                <QrCode className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">QR Code</p>
                <p className="text-sm text-gray-600">Escaneie para acessar rapidamente</p>
              </div>
            </div>
            
            {/* Share Options */}
            <div className="space-y-3">
              <Label>Opções de Compartilhamento</Label>
              <div className="flex gap-3">
                <Button
                  onClick={shareViaWhatsApp}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Via WhatsApp
                </Button>
                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Via E-mail
                </Button>
              </div>
            </div>
            
            {/* Invite Summary */}
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-3">Resumo do Convite</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinatário:</span>
                  <span className="font-medium">{inviteData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">E-mail:</span>
                  <span className="font-medium">{inviteData.email}</span>
                </div>
                {inviteData.position && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cargo:</span>
                    <span className="font-medium">{inviteData.position}</span>
                  </div>
                )}
                {inviteData.department && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setor:</span>
                    <span className="font-medium">{inviteData.department}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Testes:</span>
                  <span className="font-medium">{inviteData.selectedTests.length} selecionado(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validade:</span>
                  <span className="font-medium">15 dias</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}