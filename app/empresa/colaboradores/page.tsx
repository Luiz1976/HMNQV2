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
  User, 
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
  Calendar
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ColaboradoresPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedColaborador, setSelectedColaborador] = useState<string | null>(null)

  // Mock data - em produção, estes dados viriam da API
  const colaboradores = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      department: 'Recursos Humanos',
      position: 'Analista de RH',
      status: 'completed', // completed, risk, pending
      avatar: '',
      lastTest: '2024-01-15',
      riskLevel: 'low',
      testsCompleted: 4,
      totalTests: 6
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@empresa.com',
      department: 'Tecnologia',
      position: 'Desenvolvedor Senior',
      status: 'risk',
      avatar: '',
      lastTest: '2024-01-10',
      riskLevel: 'high',
      testsCompleted: 3,
      totalTests: 6
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@empresa.com',
      department: 'Vendas',
      position: 'Gerente de Vendas',
      status: 'pending',
      avatar: '',
      lastTest: null,
      riskLevel: null,
      testsCompleted: 0,
      totalTests: 6
    },
    {
      id: '4',
      name: 'João Costa',
      email: 'joao.costa@empresa.com',
      department: 'Marketing',
      position: 'Coordenador de Marketing',
      status: 'completed',
      avatar: '',
      lastTest: '2024-01-12',
      riskLevel: 'medium',
      testsCompleted: 5,
      totalTests: 6
    }
  ]

  const testResults = {
    '1': {
      stress: { completed: true, score: 75, status: 'good', date: '2024-01-15' },
      burnout: { completed: true, score: 82, status: 'good', date: '2024-01-14' },
      satisfaction: { completed: true, score: 88, status: 'excellent', date: '2024-01-13' },
      worklife: { completed: true, score: 70, status: 'good', date: '2024-01-12' },
      leadership: { completed: false },
      teamwork: { completed: false }
    },
    '2': {
      stress: { completed: true, score: 45, status: 'risk', date: '2024-01-10' },
      burnout: { completed: true, score: 35, status: 'high-risk', date: '2024-01-09' },
      satisfaction: { completed: true, score: 40, status: 'risk', date: '2024-01-08' },
      worklife: { completed: false },
      leadership: { completed: false },
      teamwork: { completed: false }
    },
    '4': {
      stress: { completed: true, score: 65, status: 'warning', date: '2024-01-12' },
      burnout: { completed: true, score: 78, status: 'good', date: '2024-01-11' },
      satisfaction: { completed: true, score: 85, status: 'excellent', date: '2024-01-10' },
      worklife: { completed: true, score: 72, status: 'good', date: '2024-01-09' },
      leadership: { completed: true, score: 80, status: 'good', date: '2024-01-08' },
      teamwork: { completed: false }
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

  const filteredColaboradores = colaboradores.filter(colaborador => {
    const matchesSearch = colaborador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colaborador.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || colaborador.status === statusFilter
    
    return matchesSearch && matchesStatus
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

  const generateAIAnalysis = (colaboradorId: string) => {
    const results = testResults[colaboradorId as keyof typeof testResults]
    if (!results) return "Aguardando realização dos testes."

    const completedTests = Object.entries(results).filter(([_, test]) => test.completed)
    if (completedTests.length === 0) return "Aguardando realização dos testes."

    // Análise baseada nos resultados
    const riskTests = completedTests.filter(([_, test]) => test.status === 'risk' || test.status === 'high-risk')
    const goodTests = completedTests.filter(([_, test]) => test.status === 'good' || test.status === 'excellent')
    
    let analysis = "**Análise Consolidada por IA:**\n\n"
    
    if (riskTests.length > 0) {
      analysis += "🚨 **Áreas de Atenção:**\n"
      riskTests.forEach(([testKey, test]) => {
        const testName = testDefinitions[testKey as keyof typeof testDefinitions].name
        analysis += `• ${testName}: Score ${test.score}% - Requer intervenção imediata\n`
      })
      analysis += "\n"
    }
    
    if (goodTests.length > 0) {
      analysis += "✅ **Pontos Fortes:**\n"
      goodTests.forEach(([testKey, test]) => {
        const testName = testDefinitions[testKey as keyof typeof testDefinitions].name
        analysis += `• ${testName}: Score ${test.score}% - Desempenho satisfatório\n`
      })
      analysis += "\n"
    }
    
    analysis += "**Recomendações:**\n"
    if (riskTests.length > 0) {
      analysis += "• Agendar sessão individual com RH\n"
      analysis += "• Considerar ajustes na carga de trabalho\n"
      analysis += "• Implementar programa de apoio psicológico\n"
    } else {
      analysis += "• Manter acompanhamento regular\n"
      analysis += "• Continuar práticas atuais de gestão\n"
      analysis += "• Considerar como exemplo para outros colaboradores\n"
    }
    
    return analysis
  }

  if (selectedColaborador) {
    const colaborador = colaboradores.find(c => c.id === selectedColaborador)
    const results = testResults[selectedColaborador as keyof typeof testResults]
    
    return (
      <div className="space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedColaborador(null)}>
            ← Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{colaborador?.name}</h1>
            <p className="text-gray-600">{colaborador?.position} - {colaborador?.department}</p>
          </div>
        </div>

        {/* Layout Kanban dos Testes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna: Aguardando Realização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-700">Aguardando Realização</h3>
              <Badge variant="secondary" className="ml-auto">
                {Object.entries(testDefinitions).filter(([testKey]) => !results?.[testKey as keyof typeof results]?.completed).length}
              </Badge>
            </div>
            {Object.entries(testDefinitions)
              .filter(([testKey]) => !results?.[testKey as keyof typeof results]?.completed)
              .map(([testKey, testDef]) => {
                const Icon = testDef.icon
                return (
                  <Card key={testKey} className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={colaborador?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                            {colaborador?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`h-4 w-4 ${testDef.color}`} />
                            <h4 className="font-medium text-sm text-gray-900 truncate">{testDef.name}</h4>
                          </div>
                          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg mb-3">
                            <div className="text-center">
                              <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Aguardando</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Não realizado
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* Coluna: Resultados Críticos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Requer Atenção</h3>
              <Badge variant="destructive" className="ml-auto">
                {Object.entries(testDefinitions).filter(([testKey]) => {
                  const testResult = results?.[testKey as keyof typeof results]
                  return testResult?.completed && testResult.status === 'critico'
                }).length}
              </Badge>
            </div>
            {Object.entries(testDefinitions)
              .filter(([testKey]) => {
                const testResult = results?.[testKey as keyof typeof results]
                return testResult?.completed && testResult.status === 'critico'
              })
              .map(([testKey, testDef]) => {
                const testResult = results?.[testKey as keyof typeof results]
                const Icon = testDef.icon
                return (
                  <Card key={testKey} className="border-l-4 border-l-red-500 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={colaborador?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                              {colaborador?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`h-4 w-4 ${testDef.color}`} />
                            <h4 className="font-medium text-sm text-gray-900 truncate">{testDef.name}</h4>
                          </div>
                          <div className="bg-white rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl font-bold text-red-600">{testResult?.score}%</span>
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="h-2 bg-red-500 rounded-full" style={{ width: `${testResult?.score}%` }}></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="destructive" className="text-xs">
                              Crítico
                            </Badge>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(testResult?.date || '').toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* Coluna: Resultados Adequados */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-green-700">Resultados Adequados</h3>
              <Badge variant="default" className="ml-auto bg-green-100 text-green-800">
                {Object.entries(testDefinitions).filter(([testKey]) => {
                  const testResult = results?.[testKey as keyof typeof results]
                  return testResult?.completed && (testResult.status === 'adequado' || testResult.status === 'medio')
                }).length}
              </Badge>
            </div>
            {Object.entries(testDefinitions)
              .filter(([testKey]) => {
                const testResult = results?.[testKey as keyof typeof results]
                return testResult?.completed && (testResult.status === 'adequado' || testResult.status === 'medio')
              })
              .map(([testKey, testDef]) => {
                const testResult = results?.[testKey as keyof typeof results]
                const Icon = testDef.icon
                const isAdequado = testResult?.status === 'adequado'
                return (
                  <Card key={testKey} className={`border-l-4 ${isAdequado ? 'border-l-green-500 bg-green-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={colaborador?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                              {colaborador?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -top-1 -right-1 h-4 w-4 ${isAdequado ? 'bg-green-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center`}>
                            <CheckCircle className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`h-4 w-4 ${testDef.color}`} />
                            <h4 className="font-medium text-sm text-gray-900 truncate">{testDef.name}</h4>
                          </div>
                          <div className="bg-white rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-2xl font-bold ${isAdequado ? 'text-green-600' : 'text-yellow-600'}`}>{testResult?.score}%</span>
                              <TrendingUp className={`h-5 w-5 ${isAdequado ? 'text-green-500' : 'text-yellow-500'}`} />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${isAdequado ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${testResult?.score}%` }}></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant={isAdequado ? "default" : "secondary"} className={`text-xs ${isAdequado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {isAdequado ? 'Adequado' : 'Médio'}
                            </Badge>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(testResult?.date || '').toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
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
              Análise Consolidada por IA
            </CardTitle>
            <CardDescription>
              Análise automática baseada em todos os testes realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {generateAIAnalysis(selectedColaborador)}
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Colaboradores</h1>
          <p className="text-gray-600">
            Gerencie e monitore o bem-estar psicossocial de {session?.user?.company?.name || 'sua empresa'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Última atualização: hoje</span>
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
                  placeholder="Buscar por nome, cargo ou departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="rh">Recursos Humanos</SelectItem>
                <SelectItem value="tech">Tecnologia</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Layout Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna: Não Realizado */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                Não Realizado
              </h3>
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                {filteredColaboradores.filter(c => c.status === 'pending').length}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Colaboradores que ainda não iniciaram os testes</p>
          </div>
          <div className="space-y-3">
            {filteredColaboradores
              .filter(colaborador => colaborador.status === 'pending')
              .map((colaborador) => (
                <Card 
                  key={colaborador.id} 
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-gray-400 hover:border-l-gray-600"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold text-sm">
                            {colaborador.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600">{colaborador.position}</p>
                          <p className="text-xs text-gray-500">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{colaborador.testsCompleted}/{colaborador.totalTests}</span> testes
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                          Enviar
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>

        {/* Coluna: Resultado Crítico */}
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Resultado Crítico
              </h3>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {filteredColaboradores.filter(c => c.status === 'risk').length}
              </Badge>
            </div>
            <p className="text-xs text-red-700">Colaboradores com riscos psicossociais identificados</p>
          </div>
          <div className="space-y-3">
            {filteredColaboradores
              .filter(colaborador => colaborador.status === 'risk')
              .map((colaborador) => (
                <Card 
                  key={colaborador.id} 
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-red-500 hover:border-l-red-600 bg-red-50/30"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-sm">
                            {colaborador.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600">{colaborador.position}</p>
                          <p className="text-xs text-gray-500">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                        Alto Risco
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{colaborador.testsCompleted}/{colaborador.totalTests}</span> testes
                        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Atenção necessária
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50">
                          Relatório
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>

        {/* Coluna: Resultado Médio */}
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                Resultado Médio
              </h3>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {filteredColaboradores.filter(c => c.status === 'completed' && c.riskLevel === 'medium').length}
              </Badge>
            </div>
            <p className="text-xs text-yellow-700">Colaboradores com resultados dentro da média</p>
          </div>
          <div className="space-y-3">
            {filteredColaboradores
              .filter(colaborador => colaborador.status === 'completed' && colaborador.riskLevel === 'medium')
              .map((colaborador) => (
                <Card 
                  key={colaborador.id} 
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-yellow-500 hover:border-l-yellow-600 bg-yellow-50/30"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-semibold text-sm">
                            {colaborador.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600">{colaborador.position}</p>
                          <p className="text-xs text-gray-500">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        Médio
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{colaborador.testsCompleted}/{colaborador.totalTests}</span> testes
                        <div className="text-xs text-yellow-600 mt-1">
                          Última avaliação: {colaborador.lastTest ? new Date(colaborador.lastTest).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                          Relatório
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>

        {/* Coluna: Resultado Adequado */}
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resultado Adequado
              </h3>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {filteredColaboradores.filter(c => c.status === 'completed' && c.riskLevel === 'low').length}
              </Badge>
            </div>
            <p className="text-xs text-green-700">Colaboradores com excelente saúde psicossocial</p>
          </div>
          <div className="space-y-3">
            {filteredColaboradores
              .filter(colaborador => colaborador.status === 'completed' && colaborador.riskLevel === 'low')
              .map((colaborador) => (
                <Card 
                  key={colaborador.id} 
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-green-500 hover:border-l-green-600 bg-green-50/30"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-sm">
                            {colaborador.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600">{colaborador.position}</p>
                          <p className="text-xs text-gray-500">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        Excelente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{colaborador.testsCompleted}/{colaborador.totalTests}</span> testes
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Saúde em dia
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50">
                          Relatório
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </div>

      {filteredColaboradores.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum colaborador encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termo de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}