'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Calendar,
  BarChart3,
  Download,
  Eye,
  Archive,
  Database
} from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  id: string
  testName: string
  category: string
  status: 'completed' | 'in_progress' | 'pending'
  score?: number
  completedAt: string
  duration: number
  insights: string[]
  isArchived?: boolean
  archivedAt?: string
  filePath?: string
}

export default function ResultadosRecentesPage() {
  const { data: session } = useSession()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRecentResults = async () => {
    try {
      const response = await fetch('/api/colaborador/resultados-recentes')
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        toast.error('Erro ao carregar resultados recentes')
      }
    } catch (error) {
      console.error('Erro ao buscar resultados:', error)
      toast.error('Erro ao carregar resultados')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRecentResults()
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchRecentResults, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchRecentResults()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string, isArchived?: boolean) => {
    if (isArchived) {
      return (
        <div className="flex items-center space-x-1">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Archive className="h-3 w-3 mr-1" />
            Arquivado
          </Badge>
        </div>
      )
    }
    
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Database className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        )
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Andamento</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'perfil':
        return 'border-l-blue-500 bg-blue-50/30'
      case 'psicossociais':
        return 'border-l-green-500 bg-green-50/30'
      case 'corporativos':
        return 'border-l-purple-500 bg-purple-50/30'
      case 'grafológicos':
        return 'border-l-orange-500 bg-orange-50/30'
      default:
        return 'border-l-gray-500 bg-gray-50/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados Recentes
              </h1>
              <p className="text-gray-600">
                Acompanhe seus resultados mais recentes em tempo real
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Testes</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Concluídos</p>
                  <p className="text-2xl font-bold">
                    {results.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Em Andamento</p>
                  <p className="text-2xl font-bold">
                    {results.filter(r => r.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pontuação Média</p>
                  <p className="text-2xl font-bold">
                    {results.filter(r => r.score).length > 0 
                      ? Math.round(results.filter(r => r.score).reduce((acc, r) => acc + (r.score || 0), 0) / results.filter(r => r.score).length)
                      : 0
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Seus resultados mais recentes aparecerão aqui assim que você completar os testes.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Fazer um Teste
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Card 
                key={result.id} 
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getCategoryColor(result.category)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {result.testName}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                        {getStatusBadge(result.status, result.isArchived)}
                      </div>
                    </div>
                    {getStatusIcon(result.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {result.score && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pontuação:</span>
                        <span className="font-semibold text-purple-600">{result.score}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duração:</span>
                      <span className="text-sm font-medium">{formatDuration(result.duration)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Concluído em:</span>
                      <span className="text-sm font-medium">{formatDate(result.completedAt)}</span>
                    </div>
                    
                    {result.insights && result.insights.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Principais insights:</p>
                        <div className="space-y-1">
                          {result.insights.slice(0, 2).map((insight, index) => (
                            <p key={index} className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                              • {insight}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}