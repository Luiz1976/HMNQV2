'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  id: string
  completedAt: string
  overallScore: number | null
  status: string
  test: {
    id: string
    name: string
    description?: string
    testType: string
    estimatedDuration?: number
    category: {
      id: string
      name: string
      icon?: string
      color?: string
    }
  }
  aiAnalysis?: {
    id: string
    summary: string
    createdAt: string
  }
  dimensionScores?: {
    dimension: string
    score: number
    description?: string
  }[]
}

interface ColaboradorData {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  matricula?: string
  avatar?: string
}

interface Statistics {
  totalTests: number
  completedTests: number
  completionRate: number
  averageScore: number
  categoriesStats: { [key: string]: number }
  aiAnalysesCount: number
  recentTests: number
}

interface ApiResponse {
  success: boolean
  data: {
    colaborador: ColaboradorData
    results: TestResult[]
    statistics: Statistics
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

export default function ColaboradorResultadosPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const colaboradorId = params.id as string

  const [colaborador, setColaborador] = useState<ColaboradorData | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTestType, setSelectedTestType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [includeAI, setIncludeAI] = useState(true)
  const [sortBy, setSortBy] = useState('completedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Função para buscar dados da API
  const fetchResultados = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        testType: selectedTestType,
        category: selectedCategory,
        includeAI: includeAI.toString(),
        sortBy,
        sortOrder
      })
      
      const response = await fetch(`/api/empresa/colaboradores/${colaboradorId}/resultados?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar resultados do colaborador')
      }

      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setColaborador(data.data.colaborador)
        setResults(data.data.results)
        setStatistics(data.data.statistics)
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (err) {
      console.error('Erro ao carregar resultados:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados ao montar o componente e quando filtros mudarem
  useEffect(() => {
    fetchResultados()
  }, [colaboradorId, currentPage, searchTerm, selectedTestType, selectedCategory, includeAI, sortBy, sortOrder])

  // Função para obter cor do tipo de teste
  const getTestTypeColor = (testType: string) => {
    const colors = {
      'PERSONALITY': 'bg-purple-100 text-purple-800 border-purple-200',
      'PSYCHOSOCIAL': 'bg-blue-100 text-blue-800 border-blue-200',
      'CORPORATE': 'bg-green-100 text-green-800 border-green-200',
      'GRAPHOLOGY': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[testType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Função para obter cor da pontuação
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Função para formatar tipo de teste
  const formatTestType = (testType: string) => {
    const types = {
      'PERSONALITY': 'Personalidade',
      'PSYCHOSOCIAL': 'Psicossocial',
      'CORPORATE': 'Corporativo',
      'GRAPHOLOGY': 'Grafológico'
    }
    return types[testType as keyof typeof types] || testType
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando resultados...</span>
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
          <div className="flex gap-2 justify-center">
            <Button onClick={fetchResultados}>
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!colaborador) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Colaborador não encontrado</h3>
          <p className="text-muted-foreground mb-4">O colaborador solicitado não foi encontrado ou você não tem permissão para acessá-lo.</p>
          <Button onClick={() => router.back()}>
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={colaborador.avatar} />
              <AvatarFallback>
                {colaborador.firstName[0]}{colaborador.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{colaborador.name}</h1>
              <p className="text-muted-foreground">{colaborador.position} • {colaborador.department}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Testes Concluídos</p>
                  <p className="text-2xl font-bold">{statistics.completedTests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">{statistics.completionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pontuação Média</p>
                  <p className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          

        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome do teste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTestType} onValueChange={setSelectedTestType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de teste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="PERSONALITY">Personalidade</SelectItem>
                <SelectItem value="PSYCHOSOCIAL">Psicossocial</SelectItem>
                <SelectItem value="CORPORATE">Corporativo</SelectItem>
                <SelectItem value="GRAPHOLOGY">Grafológico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completedAt">Data de conclusão</SelectItem>
                <SelectItem value="overallScore">Pontuação</SelectItem>
                <SelectItem value="testName">Nome do teste</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Resultados */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedTestType !== 'all' || selectedCategory !== 'all'
                  ? 'Tente ajustar os filtros para encontrar resultados.'
                  : 'Este colaborador ainda não completou nenhum teste.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{result.test.name}</h3>
                      <Badge className={getTestTypeColor(result.test.testType)}>
                        {formatTestType(result.test.testType)}
                      </Badge>
                      {result.test.category && (
                        <Badge variant="outline">
                          {result.test.category.name}
                        </Badge>
                      )}
                    </div>
                    
                    {result.test.description && (
                      <p className="text-muted-foreground mb-3">{result.test.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Concluído em {new Date(result.completedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {result.test.estimatedDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{result.test.estimatedDuration} min</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Pontuação Geral */}
                    {result.overallScore !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Pontuação Geral</span>
                          <span className={`text-lg font-bold ${getScoreColor(result.overallScore)}`}>
                            {result.overallScore.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={result.overallScore} className="h-2" />
                      </div>
                    )}
                    
                    {/* Pontuações por Dimensão */}
                    {result.dimensionScores && result.dimensionScores.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Pontuações por Dimensão</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.dimensionScores.map((dimension, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">{dimension.dimension}</span>
                                <span className={`text-sm font-bold ${getScoreColor(dimension.score)}`}>
                                  {dimension.score.toFixed(1)}
                                </span>
                              </div>
                              <Progress value={dimension.score} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    

                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}