
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RefreshCw, CheckCircle, AlertCircle, Clock, Users, Database } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ERPConfig {
  id: string
  name: string
  erpType: string
  syncStatus: string
  lastSync: string | null
  employeeCount: number
}

interface ERPSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: ERPConfig | null
}

interface SyncStatus {
  syncStatus: string
  lastSync: string | null
  nextSync: string | null
  employeeCount: number
  lastError: string | null
  currentSync: any
}

export function ERPSyncDialog({ open, onOpenChange, config }: ERPSyncDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const fetchSyncStatus = async () => {
    if (!config) return

    try {
      const response = await fetch(`/api/erp/sync?erpConfigId=${config.id}`)
      if (response.ok) {
        const data = await response.json()
        setSyncStatus(data)
      }
    } catch (error) {
      console.error('Error fetching sync status:', error)
    }
  }

  const startSync = async () => {
    if (!config) return

    try {
      setIsLoading(true)

      const response = await fetch('/api/erp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ erpConfigId: config.id })
      })

      if (response.ok) {
        toast.success('Sincronização iniciada!')
        fetchSyncStatus()
        
        // Start polling for updates
        const interval = setInterval(fetchSyncStatus, 3000)
        setRefreshInterval(interval)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao iniciar sincronização')
      }
    } catch (error) {
      toast.error('Erro ao iniciar sincronização')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && config) {
      fetchSyncStatus()
      
      // Set up polling if sync is in progress
      if (config.syncStatus === 'SYNCING') {
        const interval = setInterval(fetchSyncStatus, 3000)
        setRefreshInterval(interval)
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    }
  }, [open, config])

  useEffect(() => {
    // Stop polling when sync completes
    if (syncStatus && syncStatus.syncStatus !== 'SYNCING' && refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
  }, [syncStatus])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'SYNCING':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      SUCCESS: 'default',
      ERROR: 'destructive',
      SYNCING: 'secondary',
      IDLE: 'outline'
    }
    return variants[status] || 'outline'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getSyncProgress = () => {
    if (!syncStatus?.currentSync) return 0
    
    const current = syncStatus.currentSync
    if (current.status === 'SYNCING') return 50
    if (current.status === 'SUCCESS') return 100
    return 0
  }

  if (!config) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sincronização ERP</DialogTitle>
          <DialogDescription>
            Status e controle de sincronização para {config.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Status Atual</h3>
                {syncStatus && getStatusIcon(syncStatus.syncStatus)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Status:</div>
                  <Badge variant={getStatusBadge(syncStatus?.syncStatus || config.syncStatus)}>
                    {syncStatus?.syncStatus || config.syncStatus}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Colaboradores:</div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{syncStatus?.employeeCount || config.employeeCount}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Última Sync:</div>
                  <div className="text-sm">{formatDate(syncStatus?.lastSync || config.lastSync)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Próxima Sync:</div>
                  <div className="text-sm">{formatDate(syncStatus?.nextSync || null)}</div>
                </div>
              </div>

              {syncStatus?.lastError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Último Erro</div>
                      <div className="text-sm text-red-700">{syncStatus.lastError}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sync Progress */}
          {syncStatus?.syncStatus === 'SYNCING' && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Progresso da Sincronização</h3>
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                </div>
                
                <Progress value={getSyncProgress()} className="mb-4" />
                
                <div className="text-sm text-gray-600 text-center">
                  Sincronizando dados do ERP...
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Sync Details */}
          {syncStatus?.currentSync && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-4">Detalhes da Sincronização Atual</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Tipo:</div>
                    <div className="font-medium">{syncStatus.currentSync.syncType}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Iniciado em:</div>
                    <div className="font-medium">
                      {formatDate(syncStatus.currentSync.startedAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Registros Total:</div>
                    <div className="font-medium">{syncStatus.currentSync.recordsTotal || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Novos:</div>
                    <div className="font-medium text-green-600">{syncStatus.currentSync.recordsNew || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Atualizados:</div>
                    <div className="font-medium text-blue-600">{syncStatus.currentSync.recordsUpdated || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Erros:</div>
                    <div className="font-medium text-red-600">{syncStatus.currentSync.recordsErrors || 0}</div>
                  </div>
                  
                  {syncStatus.currentSync.completedAt && (
                    <div className="col-span-2">
                      <div className="text-gray-600">Finalizado em:</div>
                      <div className="font-medium">
                        {formatDate(syncStatus.currentSync.completedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button
              onClick={startSync}
              disabled={isLoading || syncStatus?.syncStatus === 'SYNCING'}
            >
              <Database className="mr-2 h-4 w-4" />
              {isLoading ? 'Iniciando...' : 'Iniciar Sincronização'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
