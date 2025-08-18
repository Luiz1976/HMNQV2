'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  ArrowLeft,
  Eye,
  FileText,
  Download,
  Loader2
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface Colaborador {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  userType: string
  department: string
  position: string
  matricula?: string
  createdAt: string
  lastLoginAt?: string
  status: 'pending' | 'in_progress' | 'completed' | 'risk'
  riskLevel?: 'low' | 'medium' | 'high'
  statistics: {
    totalTests: number
    totalCompleted: number
    totalInProgress: number
    completionRate: number
    averageScore: number
    lastTestDate?: string
    categoriesStats: { [key: string]: number }
  }
  lastEvaluation?: string
  avatar?: string
}

interface CompanyStatistics {
  total: number
  byStatus: {
    completed: number
    pending: number
    inProgress: number
    risk: number
  }
  byRiskLevel: {
    low: number
    medium: number
    high: number
  }
  overallAverageScore: number
  overallCompletionRate: number
  departmentStats: { [key: string]: number }
  lastUpdated: string
}

interface ApiResponse {
  success: boolean
  data: {
    colaboradores: Colaborador[]
    statistics: CompanyStatistics
    pagination: {
      currentPage: number
      totalPages: number
      totalCount: number
      hasNextPage: boolean
      hasPreviousPage: boolean
      limit: number
    }
  }
}

export default function ColaboradoresPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedColaborador, setSelectedColaborador] = useState<string | null>(null)
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [statistics, setStatistics] = useState<CompanyStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar dados da API
  const fetchColaboradores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/empresa/colaboradores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Tratar diferentes tipos de erro HTTP
        if (response.status === 403) {
          throw new Error('Acesso negado. Verifique se você está logado como empresa.')
        } else if (response.status === 404) {
          throw new Error('Empresa não encontrada ou inativa.')
        } else {
          throw new Error(`Erro ao carregar dados dos colaboradores (${response.status})`)
        }
      }

      const data: ApiResponse = await response.json()
      
      if (data.success) {
        // Verificar se há dados de colaboradores
        const colaboradoresList = data.data.colaboradores || []
        
        // Mapear os dados da API para o formato esperado (mesmo que seja lista vazia)
        const mappedColaboradores = colaboradoresList.map(colaborador => ({
          ...colaborador,
          status: determineStatus(colaborador),
          riskLevel: determineRiskLevel(colaborador),
          lastEvaluation: colaborador.statistics.lastTestDate
        }))
        
        setColaboradores(mappedColaboradores)
        setStatistics(data.data.statistics || {
          total: 0,
          byStatus: { completed: 0, pending: 0, inProgress: 0, risk: 0 },
          byRiskLevel: { low: 0, medium: 0, high: 0 },
          overallAverageScore: 0,
          overallCompletionRate: 0,
          departmentStats: {},
          lastUpdated: new Date().toISOString()
        })
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Função para determinar o status baseado nas estatísticas
  const determineStatus = (colaborador: Colaborador): 'pending' | 'in_progress' | 'completed' | 'risk' => {
    if (colaborador.statistics.totalTests === 0) {
      return 'pending'
    }
    
    if (colaborador.statistics.totalInProgress > 0) {
      return 'in_progress'
    }
    
    if (colaborador.statistics.averageScore < 40) {
      return 'risk'
    }
    
    return 'completed'
  }

  // Função para determinar o nível de risco
  const determineRiskLevel = (colaborador: Colaborador): 'low' | 'medium' | 'high' | undefined => {
    if (colaborador.statistics.totalCompleted === 0) {
      return undefined
    }
    
    const score = colaborador.statistics.averageScore
    
    if (score >= 70) return 'low'
    if (score >= 50) return 'medium'
    return 'high'
  }

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchColaboradores()
  }, [])





  const filteredColaboradores = colaboradores.filter(colaborador => {
    const matchesSearch = colaborador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colaborador.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || colaborador.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || colaborador.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Obter lista única de departamentos
  const departments = Array.from(new Set(colaboradores.map(c => c.department).filter(Boolean)))

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
      case 'completed': return 'Avaliações Concluídas'
    case 'risk': return 'Atenção Necessária'
    case 'pending': return 'Avaliações Pendentes'
      default: return 'Status Desconhecido'
    }
  }



  if (selectedColaborador) {
    const colaborador = colaboradores.find(c => c.id === selectedColaborador)
    if (!colaborador) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedColaborador(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{colaborador.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{colaborador.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departamento</p>
                <p className="font-medium">{colaborador.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cargo</p>
                <p className="font-medium">{colaborador.position}</p>
              </div>
              {colaborador.matricula && (
                <div>
                  <p className="text-sm text-muted-foreground">Matrícula</p>
                  <p className="font-medium">{colaborador.matricula}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(colaborador.status)}>
                  {getStatusIcon(colaborador.status)}
                  {getStatusText(colaborador.status)}
                </Badge>
              </div>
              {colaborador.riskLevel && (
                <div>
                  <p className="text-sm text-muted-foreground">Nível de Risco</p>
                  <Badge variant={colaborador.riskLevel === 'high' ? 'destructive' : colaborador.riskLevel === 'medium' ? 'secondary' : 'default'}>
                    {colaborador.riskLevel === 'high' ? 'Alto' : colaborador.riskLevel === 'medium' ? 'Médio' : 'Baixo'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Testes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Testes</p>
                <p className="text-2xl font-bold">{colaborador.statistics.totalTests}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Testes Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{colaborador.statistics.totalCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{colaborador.statistics.completionRate.toFixed(1)}%</p>
              </div>
              {colaborador.statistics.averageScore > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Pontuação Média</p>
                  <p className="text-2xl font-bold">{colaborador.statistics.averageScore.toFixed(1)}</p>
                </div>
              )}
              {colaborador.lastEvaluation && (
                <div>
                  <p className="text-sm text-muted-foreground">Última Avaliação</p>
                  <p className="font-medium">{new Date(colaborador.lastEvaluation).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/empresa/colaboradores/${colaborador.id}/resultados`}>
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Resultados Detalhados
                </Button>
              </Link>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar Dados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando colaboradores...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchColaboradores}>
            Tentar Novamente
          </Button>
        </div>
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
            Gerencie e monitore o bem-estar psicossocial de sua empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Última atualização: {statistics?.lastUpdated ? new Date(statistics.lastUpdated).toLocaleDateString('pt-BR') : 'hoje'}
          </span>
        </div>
      </div>

      {/* Estatísticas da Empresa */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Colaboradores</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overallCompletionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pontuação Média</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overallAverageScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alto Risco</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.byRiskLevel.high}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="risk">Em risco</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
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
            <p className="text-xs text-gray-600">Colaboradores que ainda não iniciaram as avaliações</p>
          </div>
          <div className="space-y-3">
            {filteredColaboradores
              .filter(colaborador => colaborador.status === 'pending')
              .map((colaborador) => (
                <Card 
                  key={colaborador.id} 
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-gray-400 hover:border-l-gray-600 h-[160px] flex flex-col"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold text-sm">
                            {colaborador.firstName[0]}{colaborador.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{colaborador.position}</p>
                          <p className="text-xs text-gray-500 truncate">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300 flex-shrink-0">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-xs text-gray-600 mb-2">
                        Testes disponíveis: {colaborador.statistics.totalTests}
                      </div>
                      <div className="text-xs text-gray-500">
                        Matrícula: {colaborador.matricula || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="text-xs text-gray-600">
                        Status: Pendente
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
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-red-500 hover:border-l-red-600 bg-red-50/30 h-[160px] flex flex-col"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-sm">
                            {colaborador.firstName[0]}{colaborador.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{colaborador.position}</p>
                          <p className="text-xs text-gray-500 truncate">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-red-100 text-red-800 border-red-200 flex-shrink-0">
                        Alto Risco
                      </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-xs text-red-600 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="truncate">Atenção necessária</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        Pontuação: {colaborador.statistics.averageScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Matrícula: {colaborador.matricula || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="text-xs text-gray-600">
                        Última avaliação: {colaborador.lastEvaluation ? new Date(colaborador.lastEvaluation).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
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
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-yellow-500 hover:border-l-yellow-600 bg-yellow-50/30 h-[160px] flex flex-col"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-semibold text-sm">
                            {colaborador.firstName[0]}{colaborador.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{colaborador.position}</p>
                          <p className="text-xs text-gray-500 truncate">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 flex-shrink-0">
                        Médio
                      </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-xs text-yellow-600 mb-2">
                        Resultado dentro da média
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        Pontuação: {colaborador.statistics.averageScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Matrícula: {colaborador.matricula || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="text-xs text-gray-600">
                        Última avaliação: {colaborador.lastEvaluation ? new Date(colaborador.lastEvaluation).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
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
                  className="transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 border-l-green-500 hover:border-l-green-600 bg-green-50/30 h-[160px] flex flex-col"
                  onClick={() => setSelectedColaborador(colaborador.id)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-sm">
                            {colaborador.firstName[0]}{colaborador.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{colaborador.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{colaborador.position}</p>
                          <p className="text-xs text-gray-500 truncate">{colaborador.department}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200 flex-shrink-0">
                        Excelente
                      </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-xs text-green-600 mb-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span className="truncate">Saúde em dia</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        Pontuação: {colaborador.statistics.averageScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Matrícula: {colaborador.matricula || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="text-xs text-gray-600">
                        Última avaliação: {colaborador.lastEvaluation ? new Date(colaborador.lastEvaluation).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
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