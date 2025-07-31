'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Heart,
  Zap,
  Target,
  Users,
  Calendar,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CandidatosPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [selectedCandidato, setSelectedCandidato] = useState<string | null>(null)

  // Mock data - em produção, estes dados viriam da API
  const candidatos = [
    {
      id: '1',
      name: 'Pedro Almeida',
      email: 'pedro.almeida@email.com',
      phone: '(11) 99999-1234',
      position: 'Desenvolvedor Frontend',
      experience: '3 anos',
      status: 'completed', // completed, risk, pending
      avatar: '',
      appliedDate: '2024-01-20',
      lastTest: '2024-01-22',
      riskLevel: 'low',
      testsCompleted: 5,
      totalTests: 6,
      source: 'LinkedIn'
    },
    {
      id: '2',
      name: 'Fernanda Costa',
      email: 'fernanda.costa@email.com',
      phone: '(11) 88888-5678',
      position: 'Analista de Marketing',
      experience: '5 anos',
      status: 'risk',
      avatar: '',
      appliedDate: '2024-01-18',
      lastTest: '2024-01-21',
      riskLevel: 'high',
      testsCompleted: 4,
      totalTests: 6,
      source: 'Site da Empresa'
    },
    {
      id: '3',
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '(11) 77777-9012',
      position: 'Gerente de Projetos',
      experience: '8 anos',
      status: 'pending',
      avatar: '',
      appliedDate: '2024-01-25',
      lastTest: null,
      riskLevel: null,
      testsCompleted: 0,
      totalTests: 6,
      source: 'Indicação'
    },
    {
      id: '4',
      name: 'Juliana Santos',
      email: 'juliana.santos@email.com',
      phone: '(11) 66666-3456',
      position: 'UX Designer',
      experience: '4 anos',
      status: 'completed',
      avatar: '',
      appliedDate: '2024-01-19',
      lastTest: '2024-01-23',
      riskLevel: 'medium',
      testsCompleted: 6,
      totalTests: 6,
      source: 'Glassdoor'
    }
  ]

  const testResults = {
    '1': {
      stress: { completed: true, score: 78, status: 'good', date: '2024-01-22' },
      burnout: { completed: true, score: 85, status: 'excellent', date: '2024-01-22' },
      satisfaction: { completed: true, score: 82, status: 'good', date: '2024-01-22' },
      worklife: { completed: true, score: 75, status: 'good', date: '2024-01-22' },
      leadership: { completed: true, score: 70, status: 'good', date: '2024-01-22' },
      teamwork: { completed: false }
    },
    '2': {
      stress: { completed: true, score: 42, status: 'risk', date: '2024-01-21' },
      burnout: { completed: true, score: 38, status: 'high-risk', date: '2024-01-21' },
      satisfaction: { completed: true, score: 45, status: 'risk', date: '2024-01-21' },
      worklife: { completed: true, score: 50, status: 'warning', date: '2024-01-21' },
      leadership: { completed: false },
      teamwork: { completed: false }
    },
    '4': {
      stress: { completed: true, score: 68, status: 'warning', date: '2024-01-23' },
      burnout: { completed: true, score: 80, status: 'good', date: '2024-01-23' },
      satisfaction: { completed: true, score: 88, status: 'excellent', date: '2024-01-23' },
      worklife: { completed: true, score: 75, status: 'good', date: '2024-01-23' },
      leadership: { completed: true, score: 85, status: 'excellent', date: '2024-01-23' },
      teamwork: { completed: true, score: 90, status: 'excellent', date: '2024-01-23' }
    }
  }

  const testDefinitions = {
    stress: { name: 'Teste de Estresse', icon: AlertTriangle, color: 'text-red-500' },
    burnout: { name: 'Teste de Burnout', icon: Zap, color: 'text-orange-500' },
    satisfaction: { name: 'Satisfação no Trabalho', icon: Heart, color: 'text-pink-500' },
    worklife: { name: 'Work-life Balance', icon: Target, color: 'text-blue-500' },
    leadership: { name: 'Liderança', icon: Users, color: 'text-purple-500' },
    teamwork: { name: 'Trabalho em Equipe', icon: Brain, color: 'text-green-500' }
  }

  const positions = [...new Set(candidatos.map(c => c.position))]

  const filteredCandidatos = candidatos.filter(candidato => {
    const matchesSearch = candidato.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidato.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || candidato.status === statusFilter
    const matchesPosition = positionFilter === 'all' || candidato.position === positionFilter
    
    return matchesSearch && matchesStatus && matchesPosition
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'risk': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'risk': return <AlertTriangle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Testes Realizados'
      case 'risk': return 'Riscos Identificados'
      case 'pending': return 'Testes Pendentes'
      default: return 'Status Desconhecido'
    }
  }

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'warning': return 'bg-yellow-500'
      case 'risk': return 'bg-orange-500'
      case 'high-risk': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  const generateAIAnalysis = (candidatoId: string) => {
    const results = testResults[candidatoId as keyof typeof testResults]
    if (!results) return "Aguardando realização dos testes."

    const completedTests = Object.entries(results).filter(([_, test]) => test.completed)
    if (completedTests.length === 0) return "Aguardando realização dos testes."

    // Análise baseada nos resultados
    const riskTests = completedTests.filter(([_, test]) => test.status === 'risk' || test.status === 'high-risk')
    const goodTests = completedTests.filter(([_, test]) => test.status === 'good' || test.status === 'excellent')
    const candidato = candidatos.find(c => c.id === candidatoId)
    
    let analysis = "**Análise de Adequação ao Cargo por IA:**\n\n"
    
    analysis += `**Candidato:** ${candidato?.name}\n`
    analysis += `**Vaga:** ${candidato?.position}\n`
    analysis += `**Experiência:** ${candidato?.experience}\n\n`
    
    if (riskTests.length > 0) {
      analysis += "⚠️ **Pontos de Atenção:**\n"
      riskTests.forEach(([testKey, test]) => {
        const testName = testDefinitions[testKey as keyof typeof testDefinitions].name
        analysis += `• ${testName}: Score ${test.score}% - Pode impactar performance no cargo\n`
      })
      analysis += "\n"
    }
    
    if (goodTests.length > 0) {
      analysis += "✅ **Competências Adequadas:**\n"
      goodTests.forEach(([testKey, test]) => {
        const testName = testDefinitions[testKey as keyof typeof testDefinitions].name
        analysis += `• ${testName}: Score ${test.score}% - Alinhado com requisitos do cargo\n`
      })
      analysis += "\n"
    }
    
    // Recomendação final
    const riskPercentage = (riskTests.length / completedTests.length) * 100
    
    analysis += "**Recomendação Final:**\n"
    if (riskPercentage > 50) {
      analysis += "🔴 **NÃO RECOMENDADO** - Múltiplos riscos identificados\n"
      analysis += "• Considerar outros candidatos\n"
      analysis += "• Se contratado, implementar plano de acompanhamento intensivo\n"
    } else if (riskPercentage > 25) {
      analysis += "🟡 **RECOMENDADO COM RESSALVAS** - Alguns pontos de atenção\n"
      analysis += "• Contratação possível com acompanhamento\n"
      analysis += "• Implementar programa de integração reforçado\n"
      analysis += "• Monitoramento nos primeiros 90 dias\n"
    } else {
      analysis += "🟢 **ALTAMENTE RECOMENDADO** - Perfil adequado ao cargo\n"
      analysis += "• Candidato apresenta boa adequação psicossocial\n"
      analysis += "• Baixo risco de problemas futuros\n"
      analysis += "• Processo de integração padrão\n"
    }
    
    return analysis
  }

  if (selectedCandidato) {
    const candidato = candidatos.find(c => c.id === selectedCandidato)
    const results = testResults[selectedCandidato as keyof typeof testResults]
    
    return (
      <div className="space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCandidato(null)}>
            ← Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{candidato?.name}</h1>
            <p className="text-gray-600">{candidato?.position} - {candidato?.experience} de experiência</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {candidato?.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {candidato?.phone}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Aplicou em {new Date(candidato?.appliedDate || '').toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Testes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(testDefinitions).map(([testKey, testDef]) => {
            const testResult = results?.[testKey as keyof typeof results]
            const Icon = testDef.icon
            
            return (
              <Card key={testKey} className={testResult?.completed ? 'border-l-4 border-l-blue-500' : 'bg-gray-50'}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${testDef.color}`} />
                      <CardTitle className="text-sm">{testDef.name}</CardTitle>
                    </div>
                    {testResult?.completed ? (
                      <Badge className={getTestStatusColor(testResult.status)}>
                        {testResult.score}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Não realizado</Badge>
                    )}
                  </div>
                </CardHeader>
                
                {testResult?.completed && (
                  <CardContent>
                    <div className="space-y-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getTestStatusColor(testResult.status)}`}
                          style={{ width: `${testResult.score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Realizado em: {new Date(testResult.date).toLocaleDateString('pt-BR')}</span>
                        <span className="capitalize">{testResult.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Botão Download Relatório */}
        <Card>
          <CardContent className="pt-6">
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório Completo em PDF
            </Button>
          </CardContent>
        </Card>

        {/* Análise por IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Análise de Adequação ao Cargo por IA
            </CardTitle>
            <CardDescription>
              Análise automática da adequação do candidato baseada nos testes psicossociais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {generateAIAnalysis(selectedCandidato)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Candidatos</h1>
          <p className="text-gray-600">
            Gerencie candidatos e avalie adequação psicossocial para as vagas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Testes Realizados</SelectItem>
                <SelectItem value="risk">Riscos Identificados</SelectItem>
                <SelectItem value="pending">Testes Pendentes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cargos</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Candidatos */}
      <div className="grid gap-4">
        {filteredCandidatos.map((candidato) => (
          <Card 
            key={candidato.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCandidato(candidato.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidato.avatar} />
                    <AvatarFallback>
                      {candidato.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{candidato.name}</h3>
                    <p className="text-sm text-gray-600">{candidato.position}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{candidato.experience} de experiência</span>
                      <span>•</span>
                      <span>Fonte: {candidato.source}</span>
                      <span>•</span>
                      <span>Aplicou em {new Date(candidato.appliedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {candidato.testsCompleted}/{candidato.totalTests} testes
                    </div>
                    {candidato.lastTest && (
                      <div className="text-xs text-gray-500">
                        Último: {new Date(candidato.lastTest).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                  
                  <Badge className={getStatusColor(candidato.status)}>
                    {getStatusIcon(candidato.status)}
                    <span className="ml-1">{getStatusText(candidato.status)}</span>
                  </Badge>
                </div>
              </div>
              
              {/* Barra de Progresso */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso dos Testes</span>
                  <span>{Math.round((candidato.testsCompleted / candidato.totalTests) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      candidato.status === 'completed' ? 'bg-green-500' :
                      candidato.status === 'risk' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${(candidato.testsCompleted / candidato.totalTests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidatos.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum candidato encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}