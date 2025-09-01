'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  Brain,
  Heart,
  Users,
  PenTool,
  Building2,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  SortAsc,
  SortDesc,
  ExternalLink,
  X,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  Database
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { toast } from 'sonner'
import DiagnosticPanel from '@/components/DiagnosticPanel'

interface TestResult {
  id: string
  test: {
    id: string
    name: string
    description: string
    testType: string
    category: any
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
}

interface ApiResponse {
  results: TestResult[]
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

const getTestIcon = (testType: string) => {
  switch (testType) {
    case 'PSYCHOSOCIAL':
      return Heart
    case 'BEHAVIORAL':
      return Users
    case 'GRAPHOLOGY':
      return PenTool
    case 'CORPORATE':
      return Building2
    default:
      return FileText
  }
}

const getTestTypeLabel = (testType: string) => {
  switch (testType) {
    case 'PSYCHOSOCIAL':
      return 'Psicossocial'
    case 'BEHAVIORAL':
      return 'Perfil Comportamental'
    case 'GRAPHOLOGY':
      return 'Grafológico'
    case 'CORPORATE':
      return 'Corporativo'
    default:
      return testType
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Excelente':
      return 'bg-green-100 text-green-800'
    case 'Bom':
      return 'bg-blue-100 text-blue-800'
    case 'Regular':
      return 'bg-yellow-100 text-yellow-800'
    case 'Necessita Atenção':
      return 'bg-red-100 text-red-800'
    case 'Pendente':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  return status
}

export default function TodosResultadosPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const fetchResults = async (showRefreshing = false) => {
    console.log('🚀 fetchResults called with showRefreshing:', showRefreshing)
    
    if (!session?.user?.id) {
      console.log('❌ fetchResults: No session or user ID, returning early')
      return
    }
    
    try {
      if (showRefreshing) {
        console.log('⏳ fetchResults: Setting refreshing to true')
        setRefreshing(true)
      } else {
        console.log('⏳ fetchResults: Setting loading to true')
        setLoading(true)
      }
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'ALL' && { testType: filterType }),
        ...(filterStatus !== 'ALL' && { status: filterStatus }),
        ...(filterCategory !== 'ALL' && { category: filterCategory })
      })
      
      const apiUrl = `/api/test-results/advanced?${params}`
      console.log('📡 fetchResults: Making API call to:', apiUrl)
      
      const response = await fetch(apiUrl, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('📊 fetchResults: API response received:', {
        resultsCount: result.results?.length || 0,
        totalResults: result.pagination?.totalCount || 0,
        currentPage: result.pagination?.currentPage || 0
      })
      
      console.log('💾 fetchResults: Setting data state')
      setData(result)
      setTotalResults(result.pagination?.totalCount || 0)
      
      if (showRefreshing) {
        toast.success('Resultados atualizados com sucesso!')
      }
    } catch (err) {
      console.error('❌ fetchResults: Error occurred:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar resultados'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      console.log('✅ fetchResults: Setting loading and refreshing to false')
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Função para resetar filtros
  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setFilterStatus('all')
    setFilterCategory('all')
    setSortBy('created_at')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  // Função para alternar ordenação
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  // Função para refresh manual
  const handleRefresh = () => {
    fetchResults(true)
  }

  // Função para exportar resultados
  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      const params = new URLSearchParams({
        format,
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'all' && { type: filterType }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      })
      
      const response = await fetch(`/api/test-results/advanced/export?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao exportar dados')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resultados-testes.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Dados exportados em formato ${format.toUpperCase()}!`)
    } catch (err) {
      console.error('Erro ao exportar:', err)
      toast.error('Erro ao exportar dados')
    }
  }

  useEffect(() => {
    console.log('🔍 useEffect triggered with dependencies:', {
      session: !!session,
      currentPage,
      searchTerm,
      filterType,
      filterStatus,
      filterCategory,
      sortBy,
      sortOrder,
      pageSize
    })
    
    if (session) {
      console.log('📞 Calling fetchResults...')
      fetchResults()
    } else {
      console.log('❌ No session, skipping fetchResults')
    }
  }, [session, currentPage, searchTerm, filterType, filterStatus, filterCategory, sortBy, sortOrder, pageSize])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFilterType = (type: string) => {
    setFilterType(type)
    setCurrentPage(1)
  }

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status)
    setCurrentPage(1)
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Você precisa estar logado para ver seus resultados.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Diagnostic Panel - Temporary for debugging */}
      <div className="mb-8">
        <DiagnosticPanel />
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todos os Resultados</h1>
            <p className="text-gray-600">Histórico completo de todos os seus testes realizados</p>
          </div>
        </div>

        {/* Stats Cards */}
        {data?.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{data.statistics.totalTests}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{data.statistics.completedTests}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa</p>
                    <p className="text-2xl font-bold text-blue-600">{data.statistics.completionRate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média</p>
                    <p className="text-2xl font-bold text-purple-600">{data.statistics.averageScore || 'N/A'}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recentes</p>
                    <p className="text-2xl font-bold text-orange-600">{data.statistics.recentResults?.length || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Análises IA</p>
                    <p className="text-lg font-bold text-indigo-600">{data.statistics.aiAnalysesCount}</p>
                  </div>
                  <Brain className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Por Tipo</p>
                    <p className="text-2xl font-bold text-teal-600">{data.statistics.testsByType}</p>
                  </div>
                  <Zap className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome do teste, categoria ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de teste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="personality">Personalidade</SelectItem>
                  <SelectItem value="corporate">Corporativo</SelectItem>
                  <SelectItem value="psychosocial">Psicossocial</SelectItem>
                  <SelectItem value="graphology">Grafologia</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="behavioral">Comportamental</SelectItem>
                  <SelectItem value="cognitive">Cognitivo</SelectItem>
                  <SelectItem value="emotional">Emocional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Data de criação</SelectItem>
                  <SelectItem value="updated_at">Última atualização</SelectItem>
                  <SelectItem value="score">Pontuação</SelectItem>
                  <SelectItem value="test_name">Nome do teste</SelectItem>
                  <SelectItem value="completion_time">Tempo de conclusão</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Export Options */}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalResults)} de {totalResults} resultados
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('xlsx')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="space-y-6">
          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Loading skeleton for filters */}
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Loading skeleton for results */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex space-x-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-1">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar resultados</h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
            <Button onClick={() => fetchResults()} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : !data?.results?.length ? (
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                ? 'Tente ajustar os filtros para encontrar mais resultados.'
                : 'Você ainda não possui resultados de testes. Complete um teste para ver os resultados aqui.'}
            </p>
            {(searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL') && (
              <Button onClick={resetFilters} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {(() => {
            console.log('🎨 Rendering results:', {
              totalResults: data.results?.length || 0,
              resultsIds: data.results?.map(r => r.id.slice(-8)) || []
            })
            return data.results.map((result) => {
              const Icon = getTestIcon(result.test.testType)
              return (
              <Card key={result.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {result.test.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {getTestTypeLabel(result.test.testType)}
                              </Badge>
                              {result.test.category && (
                                <Badge variant="outline" className="text-xs">
                                  {result.test.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(result.statistics.status) + " ml-2"}>
                            {getStatusLabel(result.statistics.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          {result.completedAt && (
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{format(new Date(result.completedAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                            </div>
                          )}
                          
                          {result.overallScore && (
                            <div className="flex items-center text-gray-600">
                              <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium text-blue-600">{result.overallScore}%</span>
                            </div>
                          )}
                          
                          {result.duration && (
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{Math.round(result.duration / 60)}min</span>
                            </div>
                          )}
                          
                          {result.aiAnalysis?.hasAnalysis && (
                            <div className="flex items-center text-gray-600">
                              <Brain className="h-4 w-4 mr-2 text-purple-400" />
                              <span className="text-purple-600">IA Análise</span>
                            </div>
                          )}
                        </div>
                        
                        {result.interpretation && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {result.interpretation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-blue-50 hover:border-blue-200"
                        >
                          <Link href={`/colaborador/resultados/${result.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        
                        {result.completedAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 hover:border-green-200"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-purple-50 hover:border-purple-200"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
          })()}
        </div>
      )}

      {/* Enhanced Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium text-blue-600">{((data.pagination.currentPage - 1) * data.pagination.limit) + 1}</span> a{' '}
                  <span className="font-medium text-blue-600">
                    {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)}
                  </span>{' '}
                  de <span className="font-medium text-blue-600">{data.pagination.totalCount}</span> resultados
                </div>
                
                {/* Page size selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Mostrar:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">por página</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={data.pagination.currentPage === 1}
                  className="hidden sm:flex"
                >
                  Primeira
                </Button>
                
                {/* Previous page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!data.pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const totalPages = data.pagination.totalPages
                    const currentPage = data.pagination.currentPage
                    const pages = []
                    const maxVisible = 5
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
                    
                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1)
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={i === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i)}
                          className={`w-8 h-8 p-0 ${i === currentPage ? 'bg-blue-600 text-white' : ''}`}
                        >
                          {i}
                        </Button>
                      )
                    }
                    
                    return pages
                  })()
                  }
                </div>
                
                {/* Next page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                  disabled={!data.pagination.hasNextPage}
                >
                  <span className="hidden sm:inline mr-1">Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Last page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(data.pagination.totalPages)}
                  disabled={!data.pagination.hasNextPage}
                  className="hidden sm:flex"
                >
                  Última
                </Button>
              </div>
            </div>
            
            {/* Quick jump to page */}
            <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Ir para página:</span>
                <input
                  type="number"
                  min={1}
                  max={data.pagination.totalPages}
                  value={data.pagination.currentPage}
                  onChange={(e) => {
                    const page = Math.max(1, Math.min(data.pagination.totalPages, Number(e.target.value) || 1))
                    setCurrentPage(page)
                  }}
                  className="w-16 text-sm border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">de {data.pagination.totalPages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}