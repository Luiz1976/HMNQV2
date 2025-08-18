'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'ALL' && { testType: filterType }),
        ...(filterStatus !== 'ALL' && { status: filterStatus })
      })

      const response = await fetch(`/api/colaborador/resultados?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar resultados')
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
      fetchResults()
    }
  }, [session, currentPage, searchTerm, filterType, filterStatus])

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{data.statistics.totalTests}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{data.statistics.completedTests}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-yellow-600">{data.statistics.completionRate}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome do teste..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => handleFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="PSYCHOSOCIAL">Psicossociais</option>
              <option value="BEHAVIORAL">Perfil Comportamental</option>
              <option value="GRAPHOLOGY">Grafológicos</option>
              <option value="CORPORATE">Corporativos</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Todos os Resultados</option>
              <option value="WITH_SCORE">Com Pontuação</option>
              <option value="WITHOUT_SCORE">Sem Pontuação</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Erro ao Carregar</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchResults} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : !data?.results?.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não realizou nenhum teste.'}
            </p>
            <Link href="/colaborador">
              <Button>Realizar Primeiro Teste</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.results.map((result) => {
            const Icon = getTestIcon(result.test.testType)
            return (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{result.test.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {getTestTypeLabel(result.test.testType)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {result.completedAt && (
                            <span>Concluído em {format(new Date(result.completedAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          )}
                          {result.overallScore && (
                            <span>Pontuação: {result.overallScore}%</span>
                          )}
                        </div>
                        {result.interpretation && (
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {result.interpretation}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(result.statistics.status)}>
                        {getStatusLabel(result.statistics.status)}
                      </Badge>
                      {result.completedAt && (
                         <div className="flex space-x-2">
                           <Link href={`/colaborador/resultados/${result.id}`}>
                             <Button size="sm" variant="outline">
                               <Eye className="h-4 w-4 mr-1" />
                               Ver
                             </Button>
                           </Link>
                           <Button size="sm" variant="outline">
                             <Download className="h-4 w-4 mr-1" />
                             PDF
                           </Button>
                         </div>
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
            Mostrando {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} a {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)} de {data.pagination.totalCount} resultados
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