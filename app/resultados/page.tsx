'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  LineChart,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  BarChart,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowLeft,
  Home
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts'
import { TestResultCard } from '@/components/ui/test-result-card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Cores para o gráfico de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

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
  completedAt: string | null
  duration: number
  overallScore: number | null
  dimensionScores: { [key: string]: number }
  interpretation: string | null
  recommendations: string | null
  metadata: any
  aiAnalysis: {
    id: string
    analysis: string
    confidence: number
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
  testsByType: any[]
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
  const router = useRouter()
  // BYPASS TEMPORÁRIO - Comentando useSession para debug
  // const { data: session } = useSession()
  const session = { user: { userType: 'EMPLOYEE' } } // Mock session para debug
  
  // Debug: log da sessão
  console.log('🔍 DEBUG - Sessão:', session)
  const [results, setResults] = useState<TestResult[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [professionalReport, setProfessionalReport] = useState<string>('')
  const [authError, setAuthError] = useState<string | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTestType, setSelectedTestType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState('completedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [includeAI, setIncludeAI] = useState(true)

  useEffect(() => {
    console.log('🔄 DEBUG - useEffect disparado, carregando resultados...')
    loadResults()
  }, [currentPage, selectedTestType, selectedStatus, sortBy, searchTerm])
  
  // Debug do estado dos resultados
  useEffect(() => {
    console.log('📊 DEBUG - Estado dos resultados mudou:', {
      totalResults: results.length,
      bolieCount: results.filter(r => r.test?.name?.includes('BOLIE')).length,
      completedCount: results.filter(r => r.completedAt !== null).length,
      results: results.map(r => ({
        id: r.id,
        name: r.test?.name,
        completed: r.completedAt !== null,
        isBOLIE: r.test?.name?.includes('BOLIE')
      }))
    })
    
    // Log específico para BOLIE
    const bolieTest = results.find(r => r.test?.name?.toLowerCase().includes('bolie'))
    if (bolieTest) {
      console.log('🎯 BOLIE Test Found in State:', {
        id: bolieTest.id,
        name: bolieTest.test.name,
        completedAt: bolieTest.completedAt,
        overallScore: bolieTest.overallScore,
        testType: bolieTest.test.testType,
        category: bolieTest.test.category?.name,
        willRenderInCompleted: bolieTest.completedAt !== null,
        willRenderInProgress: bolieTest.completedAt === null
      })
    } else {
      console.log('❌ BOLIE Test NOT found in results state')
    }
   }, [results])
  
    // Filtrar testes permitidos (IDs reais do banco de dados)
  const allowedTests = [
    // Testes Psicossociais
    'cme216bcl00018wg05iydpwsz', // HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico
    'cme216bde00038wg0xkau0ea0', // HumaniQ Pesquisa de Clima – Clima Organizacional e Bem-Estar Psicológico
    'cme216bem00058wg0rqpxnh40', // HumaniQ QVT – Qualidade de Vida no Trabalho
    'cme216bgy00078wg0e0ethrmz', // HumaniQ Karasek-Siegrist – Teste Psicossocial Avançado
    'cme7u1z2w00058w1w9k11srma', // HumaniQ RPO – Riscos Psicossociais Ocupacionais
    'cme216bjq00098wg0yz7ly97k', // HumaniQ EO – Estresse Ocupacional, Burnout e Resiliência
    'cme216blq000b8wg0viq7ta6k', // HumaniQ PAS – Percepção de Assédio Moral e Sexual
    'cme216boc000d8wg02vj91skk', // HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais
    // Testes de Perfil
    'cme216bpk000f8wg0qlm8xqzk'  // HumaniQ BOLIE – Inteligência Emocional
  ]

  const loadResults = async () => {
    try {
      console.log('🚀 DEBUG - Iniciando loadResults')
      setLoading(true)
      setAuthError('')
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        includeAI: includeAI.toString(),
        sortBy,
        sortOrder
      })
      
      if (selectedTestType !== 'all') {
        params.append('testType', selectedTestType)
      }
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      console.log('🌐 DEBUG - Fazendo requisição para:', `/api/colaborador/resultados?${params}`)
      const response = await fetch(`/api/colaborador/resultados?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      console.log('📡 DEBUG - Resposta recebida:', response.status, response.ok)
      
      if (response.status === 401) {
        setAuthError('Você precisa estar logado para ver seus resultados')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao carregar seus resultados')
      }
      
      const data = await response.json()
      console.log('📊 DEBUG - Dados JSON recebidos:', data)
      
      if (data.success) {
        console.log('✅ DEBUG - API retornou sucesso')
        // Removido filtro restritivo por IDs e nomes de categoria para não zerar os resultados
        const rawResults: TestResult[] = (data.data.results || [])
        console.log('🔍 DEBUG - Dados recebidos da API:', {
          totalResults: rawResults.length,
          results: rawResults.map(r => ({
            id: r.id,
            testName: r.test?.name,
            completedAt: r.completedAt,
            hasCompletedAt: r.completedAt !== null,
            testExists: !!r.test,
            categoryExists: !!r.test?.category,
            isBOLIE: r.test?.name?.includes('BOLIE') || false
          }))
        })
        
        // Debug específico para BOLIE
        const bolieResults = rawResults.filter(r => r.test?.name?.includes('BOLIE'))
        console.log('🎯 DEBUG - Resultados BOLIE encontrados:', bolieResults.length, bolieResults.map(r => ({
          id: r.id,
          name: r.test?.name,
          completedAt: r.completedAt
        })))
        console.log('🎯 DEBUG - Definindo resultados no estado:', rawResults.length, 'resultados')
        setResults(rawResults)
        
        // Debug após definir resultados
        console.log('🔄 DEBUG - Estado dos resultados após setResults:', rawResults.length)

        setStatistics(data.data.statistics || null)

        // Ajuste de mapeamento da paginação vinda da API
        const apiPag = data.data.pagination || null
        if (apiPag) {
          setPagination({
            page: apiPag.currentPage,
            limit: apiPag.limit,
            total: apiPag.totalCount,
            totalPages: apiPag.totalPages,
            hasNext: apiPag.hasNextPage,
            hasPrev: apiPag.hasPreviousPage,
          })
        } else {
          setPagination(null)
        }
        
        // Debug final
        console.log('✅ DEBUG - Carregamento concluído. Total de resultados no estado:', rawResults.length)
      } else {
        throw new Error(data.message || 'Erro na resposta da API')
      }
      
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
      setResults([])
      if (error instanceof Error && error.message.includes('401')) {
        setAuthError('Sessão expirada. Redirecionando para login...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const generateProfessionalReport = async (resultId: string) => {
    try {
      setLoadingReport(resultId)
      
      const response = await fetch(`/api/colaborador/resultados/${resultId}?includeReport=true`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha ao gerar relatório')
      }
      
      const data = await response.json()
      
      if (data.success && data.data.aiAnalysis?.professionalReport) {
        setProfessionalReport(data.data.aiAnalysis.professionalReport)
        setSelectedResult(data.data)
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

  const exportResults = async (format: 'csv' | 'xlsx' = 'xlsx') => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        format,
        includeMetadata: 'true'
      })
      
      if (selectedTestType !== 'all') {
        params.append('testType', selectedTestType)
      }
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      const response = await fetch(`/api/colaborador/export?${params}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao exportar dados')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resultados-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Mostrar mensagem de sucesso
      alert('Dados exportados com sucesso!')
      
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert(error instanceof Error ? error.message : 'Erro ao exportar dados')
    } finally {
      setLoading(false)
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

  const translateDimension = (dimension: string): string => {
    const translations: { [key: string]: string } = {
      'satisfaction': 'Satisfação',
      'resilience': 'Resiliência',
      'wellbeing': 'Bem-estar',
      'stress': 'Estresse',
      'burnout': 'Burnout',
      'leadership': 'Liderança',
      'teamwork': 'Trabalho em Equipe',
      'communication': 'Comunicação',
      'adaptability': 'Adaptabilidade',
      'creativity': 'Criatividade',
      // Big Five dimensions
      'openness': 'Abertura',
      'conscientiousness': 'Conscienciosidade',
      'extraversion': 'Extroversão',
      'agreeableness': 'Amabilidade',
      'neuroticism': 'Neuroticismo'
    }
    return translations[dimension] || dimension
  }

  // Mostrar erro de autenticação
  if (authError) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Loading state
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header com navegação */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                if (!session?.user) {
                  router.push('/auth/login')
                  return
                }

                const userType = session.user.userType
                
                switch (userType) {
                  case 'ADMIN':
                    router.push('/admin/convites')
                    break
                  case 'COMPANY':
                    router.push('/empresa/saude')
                    break
                  case 'EMPLOYEE':
                  case 'CANDIDATE':
                    router.push('/colaborador/psicossociais')
                    break
                  default:
                    router.push('/auth/login')
                    break
                }
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-8 w-8 text-blue-600" />
                Meus Resultados
              </h1>
              <p className="text-gray-600 mt-1">
                Acompanhe seus resultados de testes com análises profissionais de IA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => exportResults('xlsx')}
              variant="outline"
              size="sm"
              disabled={loading || results.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button
              onClick={() => exportResults('csv')}
              variant="outline"
              size="sm"
              disabled={loading || results.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
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

        {/* Estatísticas Gerais */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Testes Completados</p>
                    <p className="text-2xl font-bold">{statistics.completedTests}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold">{statistics.completionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Pontuação Média</p>
                    <p className="text-2xl font-bold">
                      {statistics.averageScore ? `${statistics.averageScore}%` : 'N/A'}
                    </p>
                  </div>
                  <BarChart className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Análises de IA</p>
                    <p className="text-2xl font-bold">{statistics.aiAnalysesCount}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gráfico de Distribuição */}
        {statistics && statistics.testsByType && Array.isArray(statistics.testsByType) && statistics.testsByType.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Distribuição dos Tipos de Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome do teste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                <SelectTrigger>
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
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="CONCLUIDO">Concluídos</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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

        {/* Lista de Resultados */}
        <div className="space-y-6">
          {/* console.log('🎯 DEBUG - Renderização:', {
            totalResults: results.length,
            completedResults: results.filter(r => r.completedAt !== null).length,
            inProgressResults: results.filter(r => r.completedAt === null).length,
            allResults: results.map(r => ({
              id: r.id,
              name: r.test.name,
              completedAt: r.completedAt,
              isCompleted: r.completedAt !== null
            }))
          })} */}
          {results.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedTestType !== 'all' || selectedStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Você ainda não completou nenhum teste'}
                </p>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  className="mt-4"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir para Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Debug para renderização */}
              {console.log('🎯 DEBUG - Renderização:', {
                totalResults: results.length,
                completedResults: results.filter(r => r.completedAt !== null).length,
                inProgressResults: results.filter(r => r.completedAt === null).length,
                bolieResults: results.filter(r => r.test?.name?.includes('BOLIE')).length,
                allResults: results.map(r => ({
                  id: r.id,
                  name: r.test?.name,
                  completedAt: r.completedAt,
                  isCompleted: r.completedAt !== null,
                  isBOLIE: r.test?.name?.includes('BOLIE') || false
                }))
              })}
              
              {/* Testes Concluídos */}
              {results.filter(r => r.completedAt !== null).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-1 w-8 bg-green-500 rounded"></div>
                    <h2 className="text-xl font-bold text-gray-900">Testes Concluídos</h2>
                    <Badge className="bg-green-100 text-green-800">
                      {results.filter(r => r.completedAt !== null).length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: 'grid', minHeight: '400px', width: '100%' }}>
                    {results.filter(r => r.completedAt !== null).map((result) => {
                      const chartData = result.dimensionScores ? Object.entries(result.dimensionScores).map(([key, value]) => ({
                        name: translateDimension(key),
                        value: value,
                        fullMark: 100
                      })) : []
                      
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
                          aiAnalysis={result.aiAnalysis}
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
              {results.filter(r => r.completedAt === null).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-1 w-8 bg-yellow-500 rounded"></div>
                    <h2 className="text-xl font-bold text-gray-900">Em Processamento</h2>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {results.filter(r => r.completedAt === null).length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: 'grid', minHeight: '400px', width: '100%' }}>
                    {results.filter(r => r.completedAt === null).map((result) => {
                      const chartData = result.dimensionScores ? Object.entries(result.dimensionScores).map(([key, value]) => ({
                        name: translateDimension(key),
                        value: value,
                        fullMark: 100
                      })) : []
                      
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
                          aiAnalysis={result.aiAnalysis}
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
          )}
        </div>

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
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
                  
                  <span className="text-sm text-gray-600 px-3">
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
            </CardContent>
          </Card>
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
    </div>
  )
}