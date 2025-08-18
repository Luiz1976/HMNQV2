'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Users,
  Clock,
  Target
} from 'lucide-react'

interface AnalyticsData {
  tests: any[]
  results: any[]
  sessions: any[]
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30')
  const [selectedMetric, setSelectedMetric] = useState('completion_rate')

  // Análise de tendências temporais
  const getTemporalTrends = () => {
    const days = parseInt(timeRange)
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return date.toISOString().split('T')[0]
    })

    return dateRange.map(date => {
      const dayResults = data.results.filter(r => 
        r.completedAt?.split('T')[0] === date
      )
      const daySessions = data.sessions.filter(s => 
        s.startedAt?.split('T')[0] === date
      )
      const completedSessions = daySessions.filter(s => s.status === 'COMPLETED')

      return {
        date: date.split('-').slice(1).join('/'),
        results: dayResults.length,
        sessions: daySessions.length,
        completionRate: daySessions.length > 0 ? (completedSessions.length / daySessions.length) * 100 : 0,
        averageScore: dayResults.length > 0 ? 
          dayResults.reduce((sum, r) => sum + (r.overallScore || 0), 0) / dayResults.length : 0
      }
    })
  }

  // Análise de performance por tipo de teste
  const getTestTypePerformance = () => {
    const testTypes = [...new Set(data.tests.map(t => t.testType))]
    
    return testTypes.map(type => {
      const typeTests = data.tests.filter(t => t.testType === type)
      const typeResults = data.results.filter(r => 
        typeTests.some(t => t.id === r.testId)
      )
      const typeSessions = data.sessions.filter(s => 
        typeTests.some(t => t.id === s.testId)
      )
      
      const completedSessions = typeSessions.filter(s => s.status === 'COMPLETED')
      const averageScore = typeResults.length > 0 ? 
        typeResults.reduce((sum, r) => sum + (r.overallScore || 0), 0) / typeResults.length : 0
      const averageDuration = typeResults.length > 0 ? 
        typeResults.reduce((sum, r) => sum + (r.duration || 0), 0) / typeResults.length : 0

      return {
        type,
        tests: typeTests.length,
        results: typeResults.length,
        sessions: typeSessions.length,
        completionRate: typeSessions.length > 0 ? (completedSessions.length / typeSessions.length) * 100 : 0,
        averageScore,
        averageDuration: Math.round(averageDuration / 60) // em minutos
      }
    })
  }

  // Análise de distribuição de scores
  const getScoreDistribution = () => {
    const ranges = [
      { range: '0-20%', min: 0, max: 20 },
      { range: '21-40%', min: 21, max: 40 },
      { range: '41-60%', min: 41, max: 60 },
      { range: '61-80%', min: 61, max: 80 },
      { range: '81-100%', min: 81, max: 100 }
    ]

    return ranges.map(({ range, min, max }) => {
      const count = data.results.filter(r => 
        r.overallScore >= min && r.overallScore <= max
      ).length
      
      return {
        range,
        count,
        percentage: data.results.length > 0 ? (count / data.results.length) * 100 : 0
      }
    })
  }

  // Análise de padrões de uso por hora
  const getUsagePatterns = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return hours.map(hour => {
      const hourSessions = data.sessions.filter(s => {
        const sessionHour = new Date(s.startedAt).getHours()
        return sessionHour === hour
      })
      
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        sessions: hourSessions.length,
        completions: hourSessions.filter(s => s.status === 'COMPLETED').length
      }
    })
  }

  // Métricas de engajamento
  const getEngagementMetrics = () => {
    const totalSessions = data.sessions.length
    const completedSessions = data.sessions.filter(s => s.status === 'COMPLETED').length
    const abandonedSessions = data.sessions.filter(s => s.status === 'ABANDONED').length
    const inProgressSessions = data.sessions.filter(s => s.status === 'IN_PROGRESS').length

    const averageProgress = data.sessions.length > 0 ? 
      data.sessions.reduce((sum, s) => sum + (s.currentQuestion / s.totalQuestions * 100), 0) / data.sessions.length : 0

    return {
      totalSessions,
      completedSessions,
      abandonedSessions,
      inProgressSessions,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
      abandonmentRate: totalSessions > 0 ? (abandonedSessions / totalSessions) * 100 : 0,
      averageProgress
    }
  }

  // Top performers (testes com melhor performance)
  const getTopPerformers = () => {
    const testPerformance = data.tests.map(test => {
      const testResults = data.results.filter(r => r.testId === test.id)
      const testSessions = data.sessions.filter(s => s.testId === test.id)
      
      const averageScore = testResults.length > 0 ? 
        testResults.reduce((sum, r) => sum + (r.overallScore || 0), 0) / testResults.length : 0
      
      const completionRate = testSessions.length > 0 ? 
        (testSessions.filter(s => s.status === 'COMPLETED').length / testSessions.length) * 100 : 0

      return {
        name: test.name,
        type: test.testType,
        averageScore,
        completionRate,
        totalResults: testResults.length,
        totalSessions: testSessions.length
      }
    })

    return testPerformance.sort((a, b) => b.averageScore - a.averageScore).slice(0, 5)
  }

  const temporalData = getTemporalTrends()
  const testTypeData = getTestTypePerformance()
  const scoreDistribution = getScoreDistribution()
  const usagePatterns = getUsagePatterns()
  const engagementMetrics = getEngagementMetrics()
  const topPerformers = getTopPerformers()

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Período:</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
              <SelectItem value="90">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Métrica:</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completion_rate">Taxa de Conclusão</SelectItem>
              <SelectItem value="average_score">Score Médio</SelectItem>
              <SelectItem value="session_count">Número de Sessões</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas de Engajamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementMetrics.completedSessions} de {engagementMetrics.totalSessions} sessões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abandono</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.abandonmentRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementMetrics.abandonedSessions} sessões abandonadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.averageProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Progresso em todas as sessões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.inProgressSessions}
            </div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendências Temporais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendências Temporais
            </CardTitle>
            <CardDescription>
              {selectedMetric === 'completion_rate' ? 'Taxa de conclusão' : 
               selectedMetric === 'average_score' ? 'Score médio' : 'Número de sessões'} 
              nos últimos {timeRange} dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={temporalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={
                    selectedMetric === 'completion_rate' ? 'completionRate' :
                    selectedMetric === 'average_score' ? 'averageScore' : 'sessions'
                  }
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Tipo de Teste */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance por Tipo
            </CardTitle>
            <CardDescription>
              Comparação de performance entre tipos de teste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#8884d8" name="Score Médio" />
                <Bar dataKey="completionRate" fill="#82ca9d" name="Taxa de Conclusão" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Distribuição de Scores
            </CardTitle>
            <CardDescription>
              Como os scores estão distribuídos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Padrões de Uso por Hora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Padrões de Uso
            </CardTitle>
            <CardDescription>
              Atividade por hora do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usagePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} name="Sessões" />
                <Line type="monotone" dataKey="completions" stroke="#82ca9d" strokeWidth={2} name="Conclusões" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            Testes com melhor performance (por score médio)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {test.totalResults} resultados • {test.totalSessions} sessões
                    </div>
                  </div>
                  <Badge variant="outline">{test.type}</Badge>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold">{test.averageScore.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">
                    {test.completionRate.toFixed(1)}% conclusão
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}