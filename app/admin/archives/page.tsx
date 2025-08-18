'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Download, Search, Archive, BarChart3, Users, FileText, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  id: string
  userId: string
  testType: 'personalidade' | 'psicossociais' | 'outros'
  testId: string
  completedAt: string
  score?: number
  status: 'completed' | 'incomplete'
  filePath: string
}

interface SearchCriteria {
  userId?: string
  testType?: string
  testId?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  limit?: number
  offset?: number
}

interface ArchiveStats {
  totalFiles: number
  totalSize: number
  byTestType: Record<string, number>
  byYear: Record<string, number>
}

interface ResultsStats {
  totalResults: number
  byTestType: Record<string, number>
  byStatus: Record<string, number>
  byMonth: Record<string, number>
  averageScores: Record<string, number>
}

export default function ArchivesManagementPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [archiveStats, setArchiveStats] = useState<ArchiveStats | null>(null)
  const [resultsStats, setResultsStats] = useState<ResultsStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    limit: 50,
    offset: 0
  })
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Carregar estatísticas iniciais
  useEffect(() => {
    loadArchiveStats()
    loadResultsStats()
    searchResults()
  }, [])

  const loadArchiveStats = async () => {
    try {
      const response = await fetch('/api/archives/stats')
      if (response.ok) {
        const stats = await response.json()
        setArchiveStats(stats)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas do arquivo:', error)
    }
  }

  const loadResultsStats = async () => {
    try {
      const response = await fetch('/api/archives/results-stats')
      if (response.ok) {
        const stats = await response.json()
        setResultsStats(stats)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas dos resultados:', error)
    }
  }

  const searchResults = async (criteria: SearchCriteria = searchCriteria) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/archives/search?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
        setTotalCount(data.totalCount)
        setHasMore(data.hasMore)
      } else {
        toast.error('Erro ao buscar resultados')
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      toast.error('Erro ao buscar resultados')
    } finally {
      setLoading(false)
    }
  }

  const exportResults = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(searchCriteria).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && key !== 'limit' && key !== 'offset') {
          queryParams.append(key, value.toString())
        }
      })
      queryParams.append('format', format)

      const response = await fetch(`/api/archives/export?${queryParams}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resultados_arquivados_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Exportação concluída')
      } else {
        toast.error('Erro na exportação')
      }
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast.error('Erro na exportação')
    }
  }

  const rebuildIndexes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/archives/rebuild-indexes', {
        method: 'POST'
      })
      if (response.ok) {
        toast.success('Índices reconstruídos com sucesso')
        loadArchiveStats()
        loadResultsStats()
      } else {
        toast.error('Erro ao reconstruir índices')
      }
    } catch (error) {
      console.error('Erro ao reconstruir índices:', error)
      toast.error('Erro ao reconstruir índices')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
        {status === 'completed' ? 'Concluído' : 'Incompleto'}
      </Badge>
    )
  }

  const getTestTypeName = (testType: string): string => {
    const names = {
      personalidade: 'Personalidade',
      psicossociais: 'Psicossociais',
      outros: 'Outros'
    }
    return names[testType as keyof typeof names] || testType
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Arquivos</h1>
          <p className="text-muted-foreground">
            Gerencie e consulte resultados de testes arquivados
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportResults('csv')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => exportResults('json')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar JSON
          </Button>
          <Button onClick={rebuildIndexes} disabled={loading}>
            <Archive className="w-4 h-4 mr-2" />
            Reconstruir Índices
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="search">Buscar Resultados</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {archiveStats?.totalFiles || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tamanho Total</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatFileSize(archiveStats?.totalSize || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Resultados</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resultsStats?.totalResults || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(resultsStats?.byTestType || {}).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(archiveStats?.byTestType || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{getTestTypeName(type)}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Ano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(archiveStats?.byYear || {}).map(([year, count]) => (
                    <div key={year} className="flex justify-between items-center">
                      <span>{year}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Busca</CardTitle>
              <CardDescription>
                Use os filtros abaixo para encontrar resultados específicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID do Usuário</label>
                  <Input
                    placeholder="Digite o ID do usuário"
                    value={searchCriteria.userId || ''}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, userId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Teste</label>
                  <Select
                    value={searchCriteria.testType || ''}
                    onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, testType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="personalidade">Personalidade</SelectItem>
                      <SelectItem value="psicossociais">Psicossociais</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={searchCriteria.status || ''}
                    onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="incomplete">Incompleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Inicial</label>
                  <Input
                    type="date"
                    value={searchCriteria.dateFrom || ''}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Final</label>
                  <Input
                    type="date"
                    value={searchCriteria.dateTo || ''}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ID do Teste</label>
                  <Input
                    placeholder="Digite o ID do teste"
                    value={searchCriteria.testId || ''}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, testId: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => searchResults()} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchCriteria({ limit: 50, offset: 0 })
                    searchResults({ limit: 50, offset: 0 })
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados da Busca</CardTitle>
              <CardDescription>
                {totalCount} resultado(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Carregando...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum resultado encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Usuário</th>
                          <th className="text-left p-2">Tipo</th>
                          <th className="text-left p-2">Teste</th>
                          <th className="text-left p-2">Data</th>
                          <th className="text-left p-2">Pontuação</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => (
                          <tr key={result.id} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-mono text-sm">{result.id.substring(0, 8)}...</td>
                            <td className="p-2">{result.userId}</td>
                            <td className="p-2">{getTestTypeName(result.testType)}</td>
                            <td className="p-2">{result.testId}</td>
                            <td className="p-2">{formatDate(result.completedAt)}</td>
                            <td className="p-2">{result.score || '-'}</td>
                            <td className="p-2">{getStatusBadge(result.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {hasMore && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newCriteria = {
                            ...searchCriteria,
                            offset: (searchCriteria.offset || 0) + (searchCriteria.limit || 50)
                          }
                          setSearchCriteria(newCriteria)
                          searchResults(newCriteria)
                        }}
                        disabled={loading}
                      >
                        Carregar Mais
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(resultsStats?.byStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="capitalize">
                        {status === 'completed' ? 'Concluído' : 'Incompleto'}
                      </span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pontuações Médias por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(resultsStats?.averageScores || {}).map(([type, avg]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{getTestTypeName(type)}</span>
                      <Badge variant="outline">{avg.toFixed(1)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(resultsStats?.byMonth || {}).map(([month, count]) => (
                    <div key={month} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{month}</span>
                      <Badge variant="outline" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}