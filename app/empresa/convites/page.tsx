'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Link as LinkIcon, 
  Copy, 
  Share2, 
  Mail, 
  MessageSquare, 
  Calendar,
  Users,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function ConvitesPage() {
  const { data: session } = useSession()
  const [selectedTests, setSelectedTests] = useState<string[]>(['stress', 'burnout'])
  const [frequency, setFrequency] = useState('trimestral')
  const [inviteLink, setInviteLink] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data - em produção, estes dados viriam da API
  const availableTests = [
    { id: 'stress', name: 'Teste de Estresse', description: 'Avalia níveis de estresse ocupacional' },
    { id: 'burnout', name: 'Teste de Burnout', description: 'Identifica sinais de esgotamento profissional' },
    { id: 'satisfaction', name: 'Satisfação no Trabalho', description: 'Mede satisfação e engajamento' },
    { id: 'worklife', name: 'Work-life Balance', description: 'Avalia equilíbrio vida-trabalho' },
    { id: 'leadership', name: 'Liderança', description: 'Avalia competências de liderança' },
    { id: 'teamwork', name: 'Trabalho em Equipe', description: 'Mede colaboração e dinâmica de equipe' }
  ]

  const sentInvites = [
    {
      id: '1',
      type: 'Colaboradores',
      createdAt: '2024-01-15',
      expiresAt: '2024-02-15',
      status: 'active',
      used: 45,
      total: 150,
      tests: ['Estresse', 'Burnout'],
      frequency: 'Trimestral'
    },
    {
      id: '2',
      type: 'Candidatos',
      createdAt: '2024-01-10',
      expiresAt: '2024-01-25',
      status: 'expired',
      used: 12,
      total: 20,
      tests: ['Satisfação', 'Work-life Balance'],
      frequency: 'Único'
    },
    {
      id: '3',
      type: 'Colaboradores',
      createdAt: '2024-01-20',
      expiresAt: '2024-02-20',
      status: 'pending',
      used: 0,
      total: 75,
      tests: ['Liderança'],
      frequency: 'Semestral'
    }
  ]

  const handleTestToggle = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    )
  }

  const generateInviteLink = async () => {
    setIsGenerating(true)
    // Simular geração de link
    setTimeout(() => {
      const token = Math.random().toString(36).substring(2, 15)
      const link = `${window.location.origin}/invite/${token}`
      setInviteLink(link)
      setIsGenerating(false)
      toast({
        title: "Link gerado com sucesso!",
        description: "O link de convite foi criado e está pronto para ser compartilhado."
      })
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência."
    })
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Convite para Testes Psicossociais - HumaniQ AI')
    const body = encodeURIComponent(`Olá!\n\nVocê foi convidado(a) para realizar testes psicossociais através da plataforma HumaniQ AI.\n\nClique no link abaixo para acessar:\n${inviteLink}\n\nAtenciosamente,\n${session?.user?.company?.name || 'Equipe RH'}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Você foi convidado(a) para realizar testes psicossociais através da HumaniQ AI. Acesse: ${inviteLink}`)
    window.open(`https://wa.me/?text=${message}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Ativo</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expirado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pendente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Convites</h1>
          <p className="text-gray-600">
            Gere e gerencie convites para colaboradores e candidatos realizarem testes psicossociais
          </p>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Criar Convite</TabsTrigger>
          <TabsTrigger value="manage">Gerenciar Convites</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Configuração do Convite */}
          <Card>
            <CardHeader>
              <CardTitle>Configurar Novo Convite</CardTitle>
              <CardDescription>
                Selecione os testes e configure a frequência de aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seleção de Testes */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Testes Disponíveis</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTests.map((test) => (
                    <div key={test.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={test.id}
                        checked={selectedTests.includes(test.id)}
                        onCheckedChange={() => handleTestToggle(test.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={test.id} className="font-medium cursor-pointer">
                          {test.name}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequência */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência de Repetição</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unico">Aplicação Única</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botão Gerar */}
              <Button 
                onClick={generateInviteLink} 
                disabled={selectedTests.length === 0 || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Gerando Link...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Gerar Link de Convite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Link Gerado */}
          {inviteLink && (
            <Card>
              <CardHeader>
                <CardTitle>Link de Convite Gerado</CardTitle>
                <CardDescription>
                  Compartilhe este link com colaboradores ou candidatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input value={inviteLink} readOnly className="flex-1" />
                  <Button variant="outline" onClick={() => copyToClipboard(inviteLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={shareViaEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Compartilhar por E-mail
                  </Button>
                  <Button variant="outline" onClick={shareViaWhatsApp}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Compartilhar no WhatsApp
                  </Button>
                  <Button variant="outline" onClick={() => copyToClipboard(inviteLink)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copiar Link
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Configurações do Convite:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Testes selecionados: {selectedTests.length}</li>
                    <li>• Frequência: {frequency}</li>
                    <li>• Válido por: 30 dias</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Lista de Convites */}
          <Card>
            <CardHeader>
              <CardTitle>Convites Enviados</CardTitle>
              <CardDescription>
                Gerencie todos os convites criados e acompanhe o status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentInvites.map((invite) => (
                  <div key={invite.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{invite.type}</h4>
                          {getStatusBadge(invite.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Criado em: {new Date(invite.createdAt).toLocaleDateString('pt-BR')}</p>
                          <p>Expira em: {new Date(invite.expiresAt).toLocaleDateString('pt-BR')}</p>
                          <p>Testes: {invite.tests.join(', ')}</p>
                          <p>Frequência: {invite.frequency}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {invite.used}/{invite.total} utilizados
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar Link
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de Progresso */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso de Utilização</span>
                        <span>{Math.round((invite.used / invite.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(invite.used / invite.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}