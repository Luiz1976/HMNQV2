
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, CheckCircle, AlertCircle, Clock, FileText, Download } from 'lucide-react'

interface ERPConfig {
  id: string
  name: string
  erpType: string
  syncLogs: any[]
}

interface ERPLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: ERPConfig | null
}

export function ERPLogsDialog({ open, onOpenChange, config }: ERPLogsDialogProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchLogs = async () => {
    if (!config) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/erp/configs/${config.id}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.syncLogs || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && config) {
      setLogs(config.syncLogs || [])
      fetchLogs()
    }
  }, [open, config])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'SYNCING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'PARTIAL_SUCCESS':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      SUCCESS: 'default',
      ERROR: 'destructive',
      SYNCING: 'secondary',
      PARTIAL_SUCCESS: 'secondary',
      IDLE: 'outline'
    }
    return variants[status] || 'outline'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const exportLogs = () => {
    const csvContent = [
      'Data,Tipo,Status,Duração,Total,Novos,Atualizados,Erros,Mensagem',
      ...logs.map(log => [
        formatDate(log.startedAt),
        log.syncType,
        log.status,
        formatDuration(log.duration),
        log.recordsTotal || 0,
        log.recordsNew || 0,
        log.recordsUpdated || 0,
        log.recordsErrors || 0,
        log.errorMessage || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `erp-logs-${config?.name}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!config) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Logs de Sincronização</DialogTitle>
          <DialogDescription>
            Histórico de sincronizações para {config.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="recent" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="recent">Recentes</TabsTrigger>
              <TabsTrigger value="detailed">Detalhado</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLogs}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <TabsContent value="recent">
            <ScrollArea className="h-[500px] w-full">
              <div className="space-y-4">
                {logs.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum log encontrado
                      </h3>
                      <p className="text-gray-500 text-center">
                        As sincronizações aparecerão aqui quando executadas.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  logs.map((log) => (
                    <Card key={log.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(log.status)}
                            <div>
                              <div className="font-medium">
                                Sincronização {log.syncType.toLowerCase()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(log.startedAt)}
                              </div>
                            </div>
                          </div>
                          <Badge variant={getStatusBadge(log.status)}>
                            {log.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-gray-600">Duração</div>
                            <div className="font-medium">{formatDuration(log.duration)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Total</div>
                            <div className="font-medium">{log.recordsTotal || 0}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Novos</div>
                            <div className="font-medium text-green-600">{log.recordsNew || 0}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Atualizados</div>
                            <div className="font-medium text-blue-600">{log.recordsUpdated || 0}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Erros</div>
                            <div className="font-medium text-red-600">{log.recordsErrors || 0}</div>
                          </div>
                        </div>

                        {log.errorMessage && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                            <strong>Erro:</strong> {log.errorMessage}
                          </div>
                        )}

                        {log.completedAt && (
                          <div className="text-xs text-gray-500 mt-2">
                            Finalizado em: {formatDate(log.completedAt)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="detailed">
            <ScrollArea className="h-[500px] w-full">
              <div className="space-y-4">
                {logs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">
                          Log ID: {log.id}
                        </h3>
                        <Badge variant={getStatusBadge(log.status)}>
                          {log.status}
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>Iniciado:</strong> {formatDate(log.startedAt)}
                          </div>
                          <div>
                            <strong>Finalizado:</strong> {log.completedAt ? formatDate(log.completedAt) : 'Em andamento'}
                          </div>
                          <div>
                            <strong>Duração:</strong> {formatDuration(log.duration)}
                          </div>
                          <div>
                            <strong>Tipo:</strong> {log.syncType}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                          <div>
                            <strong>Total:</strong> {log.recordsTotal || 0}
                          </div>
                          <div>
                            <strong>Novos:</strong> <span className="text-green-600">{log.recordsNew || 0}</span>
                          </div>
                          <div>
                            <strong>Atualizados:</strong> <span className="text-blue-600">{log.recordsUpdated || 0}</span>
                          </div>
                          <div>
                            <strong>Erros:</strong> <span className="text-red-600">{log.recordsErrors || 0}</span>
                          </div>
                        </div>

                        {log.errorMessage && (
                          <div className="bg-red-50 border border-red-200 p-3 rounded">
                            <strong className="text-red-800">Mensagem de Erro:</strong>
                            <div className="text-red-700 mt-1">{log.errorMessage}</div>
                          </div>
                        )}

                        {log.details && (
                          <details className="bg-gray-50 p-3 rounded">
                            <summary className="cursor-pointer font-medium">
                              Detalhes Técnicos
                            </summary>
                            <pre className="text-xs mt-2 overflow-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
