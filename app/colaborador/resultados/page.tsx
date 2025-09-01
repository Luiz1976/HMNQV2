'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  Award,
  FileText,
  Eye,
  Brain,
  Users,
  Building2,
  Palette,
  Target,
  CheckCircle,
  Clock,
  Star,
  Activity,
  // PieChart, // Remover este!
  LineChart,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  BarChart,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts'

// Cores para o gráfico de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
import { TestResultCard } from '@/components/ui/test-result-card'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

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
    }
  }
  completedAt: string
  duration: number
  overallScore: number | null
  dimensionScores: { [key: string]: number }
  interpretation: string | null
  recommendations: string | null
  metadata: any
  aiAnalysis: {
    id: string
    analysis: string
  
    analysisType: string
    metadata: any
    createdAt: string
    professionalReport?: string
    hasAnalysis: boolean
  } | null
  statistics: {
    percentile: number | null
    status: string
  }
}

interface Statistics {
  totalTests: number
  completedTests: number
  completionRate: number
  averageScore: number | null
  aiAnalysesCount: number
  recentResults: any[]
  testsByType: number
  lastTestDate: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function ResultadosPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [professionalReport, setProfessionalReport] = useState<string>('')
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTestType, setSelectedTestType] = useState<string>('all')
  const [sortBy, setSortBy] = useState('completedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [includeAI, setIncludeAI] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const saved = searchParams.get('saved')
    if (saved === '1') {
      toast.success('Resultado salvo com sucesso!')
      const params = new URLSearchParams(searchParams.toString())
      params.delete('saved')
      const qs = params.toString()
      router.replace(`${window.location.pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    loadResults()
  }, [currentPage, selectedTestType, sortBy, sortOrder, searchTerm])

  const loadResults = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        includeAI: includeAI.toString(),
        sortBy,
        sortOrder
      })
      
      if (selectedTestType !== 'all') {
        params.append('testType', selectedTestType)
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      const response = await fetch(`/api/colaborador/resultados?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar seus resultados')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data.results || [])
        setStatistics(data.data.statistics)
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.message || 'Erro na resposta da API')
      }
      
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const generateProfessionalReport = async (resultId: string) => {
    try {
      setLoadingReport(resultId)
      
      const response = await fetch(`/api/colaborador/resultados/${resultId}?includeReport=true`)
      
      if (!response.ok) {
        throw new Error('Falha ao gerar relatório')
      }
      
      const data = await response.json()
      
      if (data.aiAnalysis?.professionalReport) {
        setProfessionalReport(data.aiAnalysis.professionalReport)
        setSelectedResult(data)
        setShowReportDialog(true)
      } else {
        throw new Error('Relatório não disponível')
      }
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório profissional')
    } finally {
      setLoadingReport(null)
    }
  }

  const regenerateAIAnalysis = async (resultId: string) => {
    try {
      const response = await fetch(`/api/colaborador/resultados/${resultId}?regenerateAnalysis=true`)
      
      if (!response.ok) {
        throw new Error('Falha ao regenerar análise')
      }
      
      // Recarregar resultados
      await loadResults()
      
    } catch (error) {
      console.error('Erro ao regenerar análise:', error)
      alert('Erro ao regenerar análise de IA')
    }
  }

  const downloadReport = () => {
    if (!professionalReport) return
    
    const blob = new Blob([professionalReport], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${selectedResult?.test.name || 'teste'}-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'PSYCHOSOCIAL': return Brain
      case 'PERSONALITY': return Users
      case 'GRAPHOLOGY': return Palette
      case 'CORPORATE': return Building2
      default: return FileText
    }
  }

  const getTestTypeColor = (testType: string) => {
    switch (testType) {
      case 'PSYCHOSOCIAL': return 'blue'
      case 'PERSONALITY': return 'green'
      case 'GRAPHOLOGY': return 'purple'
      case 'CORPORATE': return 'orange'
      default: return 'gray'
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'gray'
    if (score >= 80) return 'green'
    if (score >= 60) return 'blue'
    if (score >= 40) return 'yellow'
    return 'red'
  }

  if (loading && results.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando seus resultados...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Resultados</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe seus resultados de testes com análises profissionais de IA
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadResults()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais + KPIs + Gráfico de Distribuição */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Testes Completados</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.completedTests}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pontuação Média</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {statistics.averageScore ? `${statistics.averageScore}%` : 'N/A'}
                  </p>
                </div>
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Análises de IA</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.aiAnalysesCount}</p>
                </div>
                <Sparkles className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          {/* Gráfico de Distribuição de Tipos de Teste */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <h4 className="font-semibold text-gray-700 mb-2">Distribuição dos Tipos de Teste</h4>
            {statistics.testsByType && Array.isArray(statistics.testsByType) && statistics.testsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statistics.testsByType}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statistics.testsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-gray-400 text-sm">Sem dados suficientes para gráfico</span>
            )}
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome do teste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedTestType} onValueChange={setSelectedTestType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Tipo de teste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="PSYCHOSOCIAL">Psicossociais</SelectItem>
                <SelectItem value="PERSONALITY">Comportamentais</SelectItem>
                <SelectItem value="GRAPHOLOGY">Grafológicos</SelectItem>
                <SelectItem value="CORPORATE">Corporativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completedAt">Data de conclusão</SelectItem>
                <SelectItem value="overallScore">Pontuação</SelectItem>
                <SelectItem value="test.name">Nome do teste</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Resultados em Layout Kanban */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedTestType !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você ainda não completou nenhum teste'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Seção por Status */}
            <div className="space-y-6">
              {/* Função para traduzir dimensões */}
              {(() => {
                const translateDimension = (dimension: string): string => {
                  const translations: { [key: string]: string } = {
                    'satisfaction': 'Satisfação',
                    'resilience': 'Resiliência',
                    'wellbeing': 'Bem-estar',
                    'stress': 'Estresse',
                    'burnout': 'Burnout'
                  }
                  return translations[dimension] || dimension
                }
                
                return (
                  <>
                    {/* Testes Concluídos */}
                    {results.filter(r => r.statistics?.status === 'CONCLUIDO' || r.overallScore !== null).length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="h-1 w-8 bg-green-500 rounded"></div>
                          <h2 className="text-xl font-bold text-gray-900">Testes Concluídos</h2>
                          <Badge className="bg-green-100 text-green-800">
                            {results.filter(r => r.statistics?.status === 'CONCLUIDO' || r.overallScore !== null).length}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.filter(r => r.statistics?.status === 'CONCLUIDO' || r.overallScore !== null).map((result) => {
                      
                      // Preparar dados do gráfico baseado no tipo de teste
                      const chartData = Object.entries(result.dimensionScores).map(([key, value]) => ({
                        name: translateDimension(key),
                        value: value,
                        fullMark: 100
                      }))
                      
                      return (
                        <TestResultCard
                          key={result.id}
                          id={result.id}
                          title={result.test.name}
                          category={result.test.category.name}
                          testType={result.test.testType}
                          completedAt={result.completedAt}
                          overallScore={result.overallScore}
                          status="CONCLUIDO"
                          chartData={chartData}
                          percentile={result.statistics?.percentile ?? undefined}

                          onView={() => window.open(`/colaborador/resultados/${result.id}`, '_blank')}
                          onDownloadPDF={() => generateProfessionalReport(result.id)}
                          isLoadingPDF={loadingReport === result.id}
                        />
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Testes Em Processamento */}
                    {results.filter(r => r.overallScore === null && !r.statistics?.status).length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="h-1 w-8 bg-yellow-500 rounded"></div>
                          <h2 className="text-xl font-bold text-gray-900">Em Processamento</h2>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {results.filter(r => r.overallScore === null && !r.statistics?.status).length}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.filter(r => r.overallScore === null && !r.statistics?.status).map((result) => {
                      
                      const chartData = Object.entries(result.dimensionScores).map(([key, value]) => ({
                        name: translateDimension(key),
                        value: value,
                        fullMark: 100
                      }))
                      
                      return (
                        <TestResultCard
                          key={result.id}
                          id={result.id}
                          title={result.test.name}
                          category={result.test.category.name}
                          testType={result.test.testType}
                          completedAt={result.completedAt}
                          overallScore={result.overallScore}
                          status="IN_PROGRESS"
                          chartData={chartData}

                          onView={() => window.open(`/colaborador/resultados/${result.id}`, '_blank')}
                          onDownloadPDF={() => generateProfessionalReport(result.id)}
                          isLoadingPDF={loadingReport === result.id}
                        />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(pagination.page - 1)}
              disabled={!pagination.hasPrev || loading}
              variant="outline"
              size="sm"
            >
              Anterior
            </Button>
            
            <span className="text-sm text-gray-600">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            
            <Button
              onClick={() => setCurrentPage(pagination.page + 1)}
              disabled={!pagination.hasNext || loading}
              variant="outline"
              size="sm"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Dialog do Relatório Profissional */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Relatório Profissional - {selectedResult?.test.name}
            </DialogTitle>
            <DialogDescription>
              Análise detalhada gerada por Inteligência Artificial
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={downloadReport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
            

          </div>
          
          <ScrollArea className="h-[60vh] w-full">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {professionalReport}
              </pre>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}