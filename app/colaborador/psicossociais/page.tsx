
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  Brain,
  Shield,
  Flame,
  Download,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface PsychosocialTest {
  id: string
  name: string
  description: string
  estimatedDuration: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progress?: number
  lastAttempt?: string
  testType: 'stress' | 'burnout' | 'satisfaction' | 'worklife' | 'leadership' | 'teamwork'
  result?: {
    overallScore: number
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    detailedScores?: {
      [key: string]: number
    }
    categories?: {
      name: string
      score: number
      maxScore: number
    }[]
    trends?: {
      date: string
      score: number
    }[]
  }
}

export default function PsicossociaisPage() {
  const [tests, setTests] = useState<PsychosocialTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPsychosocialTests()
  }, [])

  const fetchPsychosocialTests = async () => {
    try {
      // Simulando dados para demonstração
      const mockData: PsychosocialTest[] = [
        {
          id: '1',
          name: 'Teste de Estresse',
          description: 'Avalia os níveis de estresse no ambiente de trabalho',
          estimatedDuration: 15,
          status: 'COMPLETED',
          testType: 'stress',
          lastAttempt: '2024-01-14',
          result: {
            overallScore: 75,
            riskLevel: 'MEDIUM',
            detailedScores: {
              workload: 80,
              timeManagement: 70,
              workEnvironment: 75
            }
          }
        },
        {
          id: '2',
          name: 'Teste de Burnout',
          description: 'Identifica sinais de esgotamento profissional',
          estimatedDuration: 20,
          status: 'COMPLETED',
          testType: 'burnout',
          lastAttempt: '2024-01-13',
          result: {
            overallScore: 82,
            riskLevel: 'LOW',
            detailedScores: {
              exhaustion: 65,
              depersonalization: 40,
              accomplishment: 75
            }
          }
        },
        {
          id: '3',
          name: 'Satisfação no Trabalho',
          description: 'Mede o nível de satisfação e engajamento',
          estimatedDuration: 12,
          status: 'COMPLETED',
          testType: 'satisfaction',
          lastAttempt: '2024-01-12',
          result: {
            overallScore: 88,
            riskLevel: 'LOW',
            trends: [
              { date: '2024-01-01', score: 70 },
              { date: '2024-01-02', score: 75 },
              { date: '2024-01-03', score: 72 },
              { date: '2024-01-04', score: 78 },
              { date: '2024-01-05', score: 82 },
              { date: '2024-01-06', score: 85 }
            ]
          }
        },
        {
          id: '4',
          name: 'Work-life Balance',
          description: 'Avalia o equilíbrio entre vida pessoal e profissional',
          estimatedDuration: 10,
          status: 'IN_PROGRESS',
          testType: 'worklife',
          progress: 60,
          lastAttempt: '2024-01-14'
        },
        {
          id: '5',
          name: 'Liderança',
          description: 'Avalia competências de liderança e gestão',
          estimatedDuration: 25,
          status: 'COMPLETED',
          testType: 'leadership',
          lastAttempt: '2024-01-11',
          result: {
            overallScore: 85,
            riskLevel: 'LOW'
          }
        },
        {
          id: '6',
          name: 'Trabalho em Equipe',
          description: 'Mede a capacidade de colaboração e trabalho em grupo',
          estimatedDuration: 18,
          status: 'NOT_STARTED',
          testType: 'teamwork'
        }
      ]
      
      setTests(mockData)
    } catch (error) {
      console.error('Erro ao carregar testes:', error)
      toast.error('Erro ao carregar testes psicossociais')
    } finally {
      setLoading(false)
    }
  }

  const startTest = (testId: string) => {
    toast.success('Redirecionando para o teste...')
    // Here would be the logic to start/resume test
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return <XCircle className="h-5 w-5 text-gray-400" />
      case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-500" />
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <XCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'Não iniciado'
      case 'IN_PROGRESS': return 'Em progresso'
      case 'COMPLETED': return 'Concluído'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-700'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700'
      case 'COMPLETED': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'HIGH': return 'text-orange-600'
      case 'CRITICAL': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <Shield className="h-4 w-4" />
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4" />
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />
      case 'CRITICAL': return <Flame className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const downloadPDF = async (testId: string, testName: string) => {
    try {
      const loadingToast = toast.loading('Gerando PDF...')
      const response = await fetch(`/api/colaborador/tests/${testId}/pdf`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Erro ao gerar PDF')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${testName.replace(/\s+/g, '_')}_resultado.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.dismiss(loadingToast)
      toast.success('PDF baixado com sucesso!')
    } catch (error) {
      toast.error('Erro ao baixar PDF')
      console.error('Erro ao baixar PDF:', error)
    }
  }

  const getChartForTest = (test: PsychosocialTest) => {
    if (!test.result) return null

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      }
    }

    switch (test.testType) {
      case 'stress':
        // Gráfico de rosca para níveis de estresse
        const stressData = {
          labels: ['Baixo Estresse', 'Estresse Moderado', 'Alto Estresse'],
          datasets: [{
            data: [30, 45, 25],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 0
          }]
        }
        return (
          <div className="h-32">
            <Doughnut data={stressData} options={chartOptions} />
          </div>
        )

      case 'burnout':
        // Gráfico de barras para dimensões do burnout
        const burnoutData = {
          labels: ['Exaustão', 'Despersonalização', 'Realização'],
          datasets: [{
            label: 'Pontuação',
            data: [test.result.detailedScores?.exhaustion || 65, 
                   test.result.detailedScores?.depersonalization || 40, 
                   test.result.detailedScores?.accomplishment || 75],
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
            borderRadius: 4
          }]
        }
        return (
          <div className="h-32">
            <Bar data={burnoutData} options={chartOptions} />
          </div>
        )

      case 'satisfaction':
        // Gráfico de linha para tendência de satisfação
        const satisfactionData = {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Satisfação',
            data: test.result.trends?.map(t => t.score) || [70, 75, 72, 78, 82, 85],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        }
        return (
          <div className="h-32">
            <Line data={satisfactionData} options={chartOptions} />
          </div>
        )

      case 'worklife':
        // Gráfico de rosca para equilíbrio vida-trabalho
        const worklifeData = {
          labels: ['Trabalho', 'Vida Pessoal', 'Flexibilidade'],
          datasets: [{
            data: [40, 35, 25],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
            borderWidth: 0
          }]
        }
        return (
          <div className="h-32">
            <Doughnut data={worklifeData} options={chartOptions} />
          </div>
        )

      case 'leadership':
        // Gráfico de barras para competências de liderança
        const leadershipData = {
          labels: ['Comunicação', 'Motivação', 'Decisão', 'Delegação'],
          datasets: [{
            label: 'Competência',
            data: [85, 78, 82, 75],
            backgroundColor: '#6366F1',
            borderRadius: 4
          }]
        }
        return (
          <div className="h-32">
            <Bar data={leadershipData} options={chartOptions} />
          </div>
        )

      case 'teamwork':
        // Gráfico de rosca para trabalho em equipe
        const teamworkData = {
          labels: ['Colaboração', 'Comunicação', 'Confiança', 'Conflitos'],
          datasets: [{
            data: [25, 30, 25, 20],
            backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
            borderWidth: 0
          }]
        }
        return (
          <div className="h-32">
            <Doughnut data={teamworkData} options={chartOptions} />
          </div>
        )

      default:
        return null
    }
  }

  const getChartIcon = (testType: string) => {
    switch (testType) {
      case 'stress':
      case 'worklife':
      case 'teamwork':
        return <PieChart className="h-4 w-4" />
      case 'burnout':
      case 'leadership':
        return <BarChart3 className="h-4 w-4" />
      case 'satisfaction':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testes Psicossociais</h1>
          <p className="text-gray-600 mt-2">
            Avalie sua saúde mental, bem-estar e riscos psicossociais no ambiente de trabalho
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-900">
                  {tests.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Em Progresso</p>
                <p className="text-2xl font-bold text-blue-900">
                  {tests.filter(t => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Iniciados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.filter(t => t.status === 'NOT_STARTED').length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Grid */}
      <div className="grid gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription className="mt-2">{test.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(test.status)}
                  <Badge className={getStatusColor(test.status)}>
                    {getStatusText(test.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Test Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{test.estimatedDuration} minutos</span>
                    </div>
                    {test.lastAttempt && (
                      <div>
                        <span>Última tentativa: {new Date(test.lastAttempt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress for in-progress tests */}
                {test.status === 'IN_PROGRESS' && test.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{test.progress}%</span>
                    </div>
                    <Progress value={test.progress} className="h-2" />
                  </div>
                )}

                {/* Results for completed tests */}
                {test.status === 'COMPLETED' && test.result && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resultado</p>
                        <p className="text-lg font-bold text-gray-900">{test.result.overallScore}/100</p>
                      </div>
                      <div className={`flex items-center space-x-2 ${getRiskColor(test.result.riskLevel)}`}>
                        {getRiskIcon(test.result.riskLevel)}
                        <span className="font-medium">Risco {test.result.riskLevel}</span>
                      </div>
                    </div>
                    
                    {/* Chart Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getChartIcon(test.testType)}
                          <span className="text-sm font-medium text-gray-700">Análise Detalhada</span>
                        </div>
                      </div>
                      {getChartForTest(test)}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  {test.status === 'COMPLETED' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadPDF(test.id, test.name)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Baixar PDF</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Resultados
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={() => startTest(test.id)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {test.status === 'NOT_STARTED' ? 'Iniciar Teste' : 
                     test.status === 'IN_PROGRESS' ? 'Continuar' : 'Refazer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
