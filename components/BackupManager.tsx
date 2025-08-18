'use client'

// HumaniQ AI - Componente de Gerenciamento de Backup
// Interface para administradores gerenciarem backups do sistema

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  FileText,
  Settings,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface BackupMetadata {
  id: string
  timestamp: string
  type: 'full' | 'incremental'
  size: number
  checksum: string
  tables: string[]
  recordCount: number
  status: 'success' | 'failed' | 'in_progress'
  duration: number
  error?: string
}

interface BackupStatistics {
  totalBackups: number
  successfulBackups: number
  failedBackups: number
  totalSize: string
  oldestBackup: string | null
  newestBackup: string | null
  averageSize: string
}

interface BackupSchedulerStatus {
  isRunning: boolean
  config: {
    incrementalInterval: string
    fullBackupInterval: string
    enabled: boolean
    maxRetries: number
    retryDelay: number
  }
  nextIncrementalRun?: string
  nextFullBackupRun?: string
}

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupMetadata[]>([])
  const [statistics, setStatistics] = useState<BackupStatistics | null>(null)
  const [schedulerStatus, setSchedulerStatus] = useState<BackupSchedulerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [exportTable, setExportTable] = useState<string>('')
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('json')

  const availableTables = [
    'tests',
    'testresults',
    'testsessions',
    'users'
  ]

  useEffect(() => {
    loadBackupData()
  }, [])

  const loadBackupData = async () => {
    try {
      setLoading(true)
      
      // Carregar lista de backups e estatísticas
      const response = await fetch('/api/backup')
      const data = await response.json()
      
      if (data.success) {
        setBackups(data.data.backups || [])
        setStatistics(data.data.statistics)
      } else {
        toast.error('Erro ao carregar dados de backup')
      }
      
      // Carregar status do agendador
      const schedulerResponse = await fetch('/api/backup?action=scheduler-status')
      if (schedulerResponse.ok) {
        const schedulerData = await schedulerResponse.json()
        if (schedulerData.success) {
          setSchedulerStatus(schedulerData.data)
        }
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados de backup')
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async (type: 'full' | 'incremental') => {
    try {
      setCreating(true)
      
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          type
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Backup ${type === 'full' ? 'completo' : 'incremental'} criado com sucesso`)
        await loadBackupData()
      } else {
        toast.error(data.error || 'Erro ao criar backup')
      }
      
    } catch (error) {
      console.error('Erro ao criar backup:', error)
      toast.error('Erro ao criar backup')
    } finally {
      setCreating(false)
    }
  }

  const restoreBackup = async (backupId: string) => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'restore',
          backupId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Backup restaurado com sucesso')
        await loadBackupData()
      } else {
        toast.error(data.error || 'Erro ao restaurar backup')
      }
      
    } catch (error) {
      console.error('Erro ao restaurar backup:', error)
      toast.error('Erro ao restaurar backup')
    }
  }

  const deleteBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/backup?backupId=${backupId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Backup deletado com sucesso')
        await loadBackupData()
      } else {
        toast.error(data.error || 'Erro ao deletar backup')
      }
      
    } catch (error) {
      console.error('Erro ao deletar backup:', error)
      toast.error('Erro ao deletar backup')
    }
  }

  const verifyBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/backup?action=verify&backupId=${backupId}`)
      const data = await response.json()
      
      if (data.success) {
        if (data.data.isValid) {
          toast.success('Backup verificado - íntegro')
        } else {
          toast.error('Backup corrompido ou inválido')
        }
      } else {
        toast.error('Erro ao verificar backup')
      }
      
    } catch (error) {
      console.error('Erro ao verificar backup:', error)
      toast.error('Erro ao verificar backup')
    }
  }

  const exportData = async () => {
    if (!exportTable) {
      toast.error('Selecione uma tabela para exportar')
      return
    }
    
    try {
      const url = `/api/backup?action=export&table=${exportTable}&format=${exportFormat}`
      
      if (exportFormat === 'csv') {
        // Download direto para CSV
        const link = document.createElement('a')
        link.href = url
        link.download = `${exportTable}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Exportação CSV iniciada')
      } else {
        // Fetch para JSON
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.success) {
          const blob = new Blob([JSON.stringify(data.data, null, 2)], {
            type: 'application/json'
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${exportTable}_${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          toast.success('Exportação JSON concluída')
        } else {
          toast.error('Erro na exportação')
        }
      }
      
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast.error('Erro na exportação')
    }
  }

  const toggleScheduler = async (action: 'start' | 'stop') => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: `${action}-auto`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Backup automático ${action === 'start' ? 'iniciado' : 'interrompido'}`)
        await loadBackupData()
      } else {
        toast.error(data.error || 'Erro ao alterar agendador')
      }
      
    } catch (error) {
      console.error('Erro ao alterar agendador:', error)
      toast.error('Erro ao alterar agendador')
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      failed: 'destructive',
      in_progress: 'secondary'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status === 'success' ? 'Sucesso' : status === 'failed' ? 'Falhou' : 'Em Progresso'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados de backup...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Backup</h1>
          <p className="text-muted-foreground">
            Gerencie backups automáticos e manuais do sistema HumaniQ AI
          </p>
        </div>
        <Button onClick={loadBackupData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Backups</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalBackups}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.successfulBackups} sucessos, {statistics.failedBackups} falhas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamanho Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalSize}</div>
              <p className="text-xs text-muted-foreground">
                Média: {statistics.averageSize}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {statistics.newestBackup ? formatDate(statistics.newestBackup) : 'Nenhum'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Agendador</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {schedulerStatus?.isRunning ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="scheduler">Agendador</TabsTrigger>
          <TabsTrigger value="export">Exportar Dados</TabsTrigger>
        </TabsList>

        {/* Lista de Backups */}
        <TabsContent value="backups" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => createBackup('full')}
              disabled={creating}
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              {creating ? 'Criando...' : 'Backup Completo'}
            </Button>
            
            <Button
              onClick={() => createBackup('incremental')}
              disabled={creating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              {creating ? 'Criando...' : 'Backup Incremental'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Backups</CardTitle>
              <CardDescription>
                Histórico de backups criados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum backup encontrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registros</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-mono text-xs">
                          {backup.id.substring(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={backup.type === 'full' ? 'default' : 'outline'}>
                            {backup.type === 'full' ? 'Completo' : 'Incremental'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(backup.timestamp)}</TableCell>
                        <TableCell>{formatBytes(backup.size)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(backup.status)}
                            {getStatusBadge(backup.status)}
                          </div>
                        </TableCell>
                        <TableCell>{backup.recordCount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyBackup(backup.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            
                            {backup.status === 'success' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Upload className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Restaurar Backup</DialogTitle>
                                    <DialogDescription>
                                      Tem certeza que deseja restaurar este backup? Esta ação substituirá todos os dados atuais.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => restoreBackup(backup.id)}
                                    >
                                      Restaurar
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Deletar Backup</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja deletar este backup? Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() => deleteBackup(backup.id)}
                                  >
                                    Deletar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agendador */}
        <TabsContent value="scheduler" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Agendador</CardTitle>
              <CardDescription>
                Gerencie o backup automático periódico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedulerStatus && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Status do Agendador</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedulerStatus.isRunning ? 'Executando backups automáticos' : 'Agendador parado'}
                      </p>
                    </div>
                    <Button
                      onClick={() => toggleScheduler(schedulerStatus.isRunning ? 'stop' : 'start')}
                      variant={schedulerStatus.isRunning ? 'destructive' : 'default'}
                    >
                      {schedulerStatus.isRunning ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Parar
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {schedulerStatus.isRunning && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Próximo Backup Incremental</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedulerStatus.nextIncrementalRun 
                            ? formatDate(schedulerStatus.nextIncrementalRun)
                            : 'Não agendado'
                          }
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Próximo Backup Completo</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedulerStatus.nextFullBackupRun 
                            ? formatDate(schedulerStatus.nextFullBackupRun)
                            : 'Não agendado'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exportar Dados */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados</CardTitle>
              <CardDescription>
                Exporte dados específicos em formato CSV ou JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tabela</label>
                  <Select value={exportTable} onValueChange={setExportTable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tabela" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table.charAt(0).toUpperCase() + table.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato</label>
                  <Select value={exportFormat} onValueChange={(value: 'csv' | 'json') => setExportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">&nbsp;</label>
                  <Button onClick={exportData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}