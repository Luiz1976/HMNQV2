'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Database, 
  Download, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Settings
} from 'lucide-react'
import BackupManager from './components/BackupManager'
import AdvancedAnalytics from './components/AdvancedAnalytics'

interface TestData {
  id: string
  name: string
  description: string
  testType: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    sessions: number
    results: number
  }
}

interface TestResult {
  id: string
  overallScore: number | null
  completedAt: string
  duration: number
  test: {
    name: string
    testType: string
  }
  user: {
    firstName: string
    lastName: string
  }
}

interface TestSession {
  id: string
  status: string
  startedAt: string
  completedAt: string | null
  currentQuestion: number
  totalQuestions: number
  test: {
    name: string
    testType: string
  }
  user: {
    firstName: string
    lastName: string
  }
}

interface Statistics {
  totalTests: number
  totalResults: number
  totalSessions: number
  completedSessions: number
  averageScore: number
  averageDuration: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function DataManagementPage() {
  const [tests, setTests] = useState<TestData[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [sessions, setSessions] = useState<TestSession[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Filtros
  const [dateFilter, setDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Carregar testes
      const testsResponse = await fetch('/api/tests')
      if (testsResponse.ok) {
        const testsData = await testsResponse.json()
        setTests(testsData.data || [])
      }

      // Carregar resultados
      const resultsResponse = await fetch('/api/test-results')
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json()
        setResults(resultsData.data || [])
      }

      // Carregar sessões
      const sessionsResponse = await fetch('/api/sessions')
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setSessions(sessionsData.data || [])
      }

      // Calcular estatísticas
      calculateStatistics()
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const calculateStatistics = () => {
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length
    const totalScore = results.reduce((sum, r) => sum + (r.overallScore || 0), 0)
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    setStatistics({
      totalTests: tests.length,
      totalResults: results.length,
      totalSessions: sessions.length,
      completedSessions,
      averageScore: results.length > 0 ? totalScore / results.length : 0,
      averageDuration: results.length > 0 ? totalDuration / results.length : 0
    })
  }

  const exportData = async (format: 'csv' | 'json', dataType: 'tests' | 'results' | 'sessions') => {
    try {
      let data: any[] = []
      let filename = ''

      switch (dataType) {
        case 'tests':
          data = tests
          filename = `tests_${new Date().toISOString().split('T')[0]}`
          break
        case 'results':
          data = results
          filename = `results_${new Date().toISOString().split('T')[0]}`
          break
        case 'sessions':
          data = sessions
          filename = `sessions_${new Date().toISOString().split('T')[0]}`
          break
      }

      if (format === 'csv') {
        const csv = convertToCSV(data)
        downloadFile(csv, `${filename}.csv`, 'text/csv')
      } else {
        const json = JSON.stringify(data, null, 2)
        downloadFile(json, `${filename}.json`, 'application/json')
      }

      toast.success(`Dados exportados em ${format.toUpperCase()} com sucesso!`)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      toast.error('Erro ao exportar dados')
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'object' ? JSON.stringify(value) : value
      ).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const getTestTypeData = () => {
    const typeCount = tests.reduce((acc, test) => {
      acc[test.testType] = (acc[test.testType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count
    }))
  }

  const getResultsOverTime = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return last30Days.map(date => {
      const dayResults = results.filter(r => 
        r.completedAt.split('T')[0] === date
      ).length
      
      return {
        date: date.split('-').slice(1).join('/'),
        results: dayResults
      }
    })
  }

  const filteredResults = results.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${result.user.firstName} ${result.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === '' || result.test.testType === typeFilter
    
    const matchesDate = dateFilter === '' || 
      result.completedAt.split('T')[0] >= dateFilter
    
    return matchesSearch && matchesType && matchesDate
  })

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${session.user.firstName} ${session.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === '' || session.test.testType === typeFilter
    const matchesStatus = statusFilter === '' || session.status === statusFilter
    
    const matchesDate = dateFilter === '' || 
      session.startedAt.split('T')[0] >= dateFilter
    
    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Dados</h1>
          <p className="text-muted-foreground">
            Dashboard completo para visualização e gerenciamento dos dados persistidos
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalTests}</div>
              <p className="text-xs text-muted-foreground">
                Testes disponíveis no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resultados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalResults}</div>
              <p className="text-xs text-muted-foreground">
                Testes completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.completedSessions} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.averageScore.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Duração média: {Math.round(statistics.averageDuration / 60)}min
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="Nome do teste ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data (a partir de)</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Teste</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="PSYCHOSOCIAL">Psicossocial</SelectItem>
                  <SelectItem value="PERSONALITY">Personalidade</SelectItem>
                  <SelectItem value="CORPORATE">Corporativo</SelectItem>
                  <SelectItem value="GRAPHOLOGY">Grafologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="STARTED">Iniciado</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="ABANDONED">Abandonado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de tipos de teste */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Distribuição por Tipo de Teste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getTestTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getTestTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de resultados ao longo do tempo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resultados nos Últimos 30 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getResultsOverTime()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="results" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lista de Testes ({tests.length})</h3>
            <div className="flex gap-2">
              <Button onClick={() => exportData('csv', 'tests')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => exportData('json', 'tests')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sessões</TableHead>
                    <TableHead>Resultados</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.testType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={test.isActive ? "default" : "secondary"}>
                          {test.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{test._count?.sessions || 0}</TableCell>
                      <TableCell>{test._count?.results || 0}</TableCell>
                      <TableCell>
                        {new Date(test.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Resultados ({filteredResults.length})</h3>
            <div className="flex gap-2">
              <Button onClick={() => exportData('csv', 'results')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => exportData('json', 'results')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Teste</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Completado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {result.user.firstName} {result.user.lastName}
                      </TableCell>
                      <TableCell className="font-medium">{result.test.name}</TableCell>
                      <TableCell>
                        {result.overallScore ? `${result.overallScore.toFixed(1)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>{Math.round(result.duration / 60)}min</TableCell>
                      <TableCell>
                        {new Date(result.completedAt).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sessões ({filteredSessions.length})</h3>
            <div className="flex gap-2">
              <Button onClick={() => exportData('csv', 'sessions')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => exportData('json', 'sessions')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Teste</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Iniciado em</TableHead>
                    <TableHead>Completado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        {session.user.firstName} {session.user.lastName}
                      </TableCell>
                      <TableCell className="font-medium">{session.test.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            session.status === 'COMPLETED' ? 'default' :
                            session.status === 'IN_PROGRESS' ? 'secondary' :
                            session.status === 'ABANDONED' ? 'destructive' : 'outline'
                          }
                        >
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.currentQuestion}/{session.totalQuestions}
                      </TableCell>
                      <TableCell>
                        {new Date(session.startedAt).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {session.completedAt 
                          ? new Date(session.completedAt).toLocaleString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalytics data={{ tests, results, sessions }} />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupManager onBackupComplete={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}