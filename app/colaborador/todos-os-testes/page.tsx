'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Eye, 
  Play,
  ChevronLeft,
  ChevronRight,
  Brain,
  Heart,
  Users,
  PenTool,
  Building2,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { getCategoryConfig, getButtonColor } from '@/lib/test-categories'

interface TestResult {
  id: string
  test: {
    id: string
    name: string
    description: string
    testType: string
    category: {
      id: string
      name: string
      icon?: string
      color?: string
    }
    estimatedDuration?: number
  }
  completedAt: string | null
  duration: number
  overallScore: number | null
  dimensionScores: any
  interpretation: string | null
  recommendations: string | null
  metadata: any
  aiAnalysis: {
    hasAnalysis: boolean
    id?: string
  
    analysisType?: string
    createdAt?: string
  }
  statistics: {
    percentile: number | null
    status: string
  }
  isCompleted: boolean
  status: 'available' | 'in_progress' | 'completed' | 'locked'
}

interface AvailableTest {
  id: string
  name: string
  description: string
  testType: string
  estimatedDuration: number
  category: {
    id: string
    name: string
    icon?: string
    color?: string
  } | null
  isCompleted: boolean
  lastAttempt: string | null
  status: 'available' | 'in_progress' | 'completed' | 'locked'
}

interface ApiResponse {
  results: TestResult[]
  availableTests: AvailableTest[]
  pagination: {
    currentPage: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  statistics: {
    totalTests: number
    completedTests: number
    completionRate: number
    averageScore: number | null
    aiAnalysesCount: number
    recentResults: any[]
    testsByType: number
    lastTestDate: string | null
  }
}

type CombinedTest = {
  id: string
  name: string
  description: string
  testType: string
  category: {
    id: string
    name: string
    icon?: string
    color?: string
  } | null
  estimatedDuration?: number
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  completedAt?: string | null
  overallScore?: number | null
  interpretation?: string | null
  aiAnalysis?: {
    hasAnalysis: boolean
    id?: string
  }
  statistics?: {
    status: string
  }
}

const getTestIcon = (categoryName: string) => {
  if (categoryName?.includes('Psicossocial')) return Heart
  if (categoryName?.includes('Perfil') || categoryName?.includes('Comportamental')) return Users
  if (categoryName?.includes('Grafológico')) return PenTool
  if (categoryName?.includes('Corporativo')) return Building2
  return Brain
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'in_progress':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'available':
      return <Play className="h-4 w-4 text-blue-600" />
    case 'locked':
      return <AlertCircle className="h-4 w-4 text-gray-400" />
    default:
      return <FileText className="h-4 w-4 text-gray-600" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Concluído'
    case 'in_progress':
      return 'Em Andamento'
    case 'available':
      return 'Disponível'
    case 'locked':
      return 'Bloqueado'
    default:
      return 'Desconhecido'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'available':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'locked':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function TodosOsTestesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/colaborador/resultados?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, currentPage])

  const handleStartTest = (testId: string) => {
    console.log('🚀 Iniciando teste:', testId)
    
    // Encontrar o teste para determinar a categoria
    const test = combineTests().find(t => t.id === testId)
    if (!test) {
      console.error('❌ Teste não encontrado:', testId)
      return
    }

    // Mapear categoria para rota base
    const categoryRouteMap: { [key: string]: string } = {
      'Psicossociais': '/colaborador/psicossociais',
      'Perfil': '/colaborador/perfil-comportamental',
      'Corporativos': '/colaborador/corporativos',
      'Grafológicos': '/colaborador/grafologico'
    }

    const categoryName = test.category?.name || 'Testes Psicossociais'
    const baseRoute = categoryRouteMap[categoryName] || '/colaborador/psicossociais'
    const route = `${baseRoute}/${testId}/introducao`
    
    console.log('📍 Navegando para:', route)
    router.push(route)
  }

  const handleViewResult = (resultId: string) => {
    console.log('👁️ Visualizando resultado:', resultId)
    router.push(`/colaborador/resultados/${resultId}`)
  }

  // Combinar testes completados e disponíveis
  const combineTests = (): CombinedTest[] => {
    if (!data) return []

    const completed: CombinedTest[] = data.results.map(result => ({
      id: result.test.id,
      name: result.test.name,
      description: result.test.description,
      testType: result.test.testType,
      category: result.test.category,
      estimatedDuration: result.test.estimatedDuration,
      status: 'completed' as const,
      completedAt: result.completedAt,
      overallScore: result.overallScore,
      interpretation: result.interpretation,
      aiAnalysis: result.aiAnalysis,
      statistics: result.statistics
    }))

    const available: CombinedTest[] = data.availableTests.map(test => ({
      id: test.id,
      name: test.name,
      description: test.description,
      testType: test.testType,
      category: test.category,
      estimatedDuration: test.estimatedDuration,
      status: test.status
    }))

    return [...completed, ...available]
  }

  // Filtrar testes (IDs reais do banco de dados)
  const allowedPsychosocialTests = [
    'cme216bcl00018wg05iydpwsz', // HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico
    'cme216bde00038wg0xkau0ea0', // HumaniQ Pesquisa de Clima – Clima Organizacional e Bem-Estar Psicológico
    'cme216bem00058wg0rqpxnh40', // HumaniQ QVT – Qualidade de Vida no Trabalho
    'cme216bgy00078wg0e0ethrmz', // HumaniQ Karasek-Siegrist – Teste Psicossocial Avançado
    'cme7u1z2w00058w1w9k11srma', // HumaniQ RPO – Riscos Psicossociais Ocupacionais
    'cme216bjq00098wg0yz7ly97k', // HumaniQ EO – Estresse Ocupacional, Burnout e Resiliência
    'cme216blq000b8wg0viq7ta6k', // HumaniQ PAS – Percepção de Assédio Moral e Sexual
    'cme216boc000d8wg02vj91skk'  // HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais
  ]
  const filteredTests = combineTests().filter(test => {
    const matchesSearch = !searchTerm || 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    // Exibir apenas os testes psicossociais reais
    const matchesAllowed = allowedPsychosocialTests.includes(test.id)
    const matchesCategory = test.category?.name === 'Psicossociais'
    const matchesStatus = filterStatus === 'ALL' || test.status === filterStatus
    return matchesSearch && matchesAllowed && matchesCategory && matchesStatus
  })

  // Obter categorias únicas
  const categories = Array.from(new Set(
    combineTests()
      .map(test => test.category?.name)
      .filter(Boolean)
  )) as string[]

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Você precisa estar logado para ver os testes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todos os Testes</h1>
            <p className="text-gray-600">Visualize todos os testes disponíveis e seus resultados</p>
          </div>
        </div>

        {/* Stats Cards */}
        {data?.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Testes</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredTests.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{data.statistics.completedTests}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Disponíveis</p>
                    <p className="text-2xl font-bold text-blue-600">{data.availableTests?.length || 0}</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pontuação Média</p>
                    <p className="text-2xl font-bold text-purple-600">{data.statistics.averageScore || 'N/A'}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome do teste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ALL">Todos os Status</option>
              <option value="available">Disponível</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="locked">Bloqueado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Dica:</strong> Use os filtros acima para encontrar testes específicos por categoria ou status. 
          Clique em "Iniciar Teste" para começar um novo teste ou "Ver Resultado" para revisar testes concluídos.
        </AlertDescription>
      </Alert>

      {/* Tests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Erro ao Carregar</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchData} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : !filteredTests.length ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum teste encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'ALL' || filterStatus !== 'ALL'
                ? 'Tente ajustar os filtros de busca.'
                : 'Nenhum teste disponível no momento.'}
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setFilterCategory('ALL')
              setFilterStatus('ALL')
            }} variant="outline">
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const categoryConfig = getCategoryConfig(test.category?.name || '')
            const Icon = getTestIcon(test.category?.name || '')
            
            return (
              <Card 
                key={test.id} 
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
              >
                {/* Linha lateral colorida */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: categoryConfig.color }}
                />
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header com ícone e categoria */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: categoryConfig.bgColor.replace('bg-', '').replace('-50', ''),
                            color: categoryConfig.color 
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <Badge 
                            variant="secondary" 
                            className="text-xs mb-1"
                            style={{
                              backgroundColor: categoryConfig.bgColor.replace('bg-', '').replace('-50', ''),
                              color: categoryConfig.color,
                              borderColor: categoryConfig.borderColor
                            }}
                          >
                            {test.category?.name || 'Sem categoria'}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getStatusColor(test.status)}>
                        {getStatusIcon(test.status)}
                        <span className="ml-1">{getStatusLabel(test.status)}</span>
                      </Badge>
                    </div>

                    {/* Título e descrição */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2 line-clamp-2"
                        style={{ color: categoryConfig.textColor }}
                      >
                        {test.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {test.description}
                      </p>
                    </div>

                    {/* Informações adicionais */}
                    <div className="space-y-2">
                      {test.estimatedDuration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{test.estimatedDuration} minutos</span>
                        </div>
                      )}
                      
                      {test.completedAt && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Concluído em {format(new Date(test.completedAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                      )}
                      
                      {test.overallScore && (
                        <div className="flex items-center text-sm text-gray-600">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span>Pontuação: {test.overallScore}%</span>
                        </div>
                      )}
                    </div>

                    {/* Botão de ação */}
                    <div className="pt-2">
                      {test.status === 'completed' ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleViewResult(test.id)}
                          style={{
                            backgroundColor: categoryConfig.color,
                            borderColor: categoryConfig.color,
                            color: 'white'
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Resultado
                        </Button>
                      ) : test.status === 'available' ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleStartTest(test.id)}
                          style={{
                            backgroundColor: categoryConfig.color,
                            borderColor: categoryConfig.color,
                            color: 'white'
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Teste
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          disabled
                          variant="outline"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {getStatusLabel(test.status)}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Mostrando {filteredTests.length} de {data.pagination.totalCount} testes
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!data.pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {data.pagination.currentPage} de {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
              disabled={!data.pagination.hasNextPage}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}