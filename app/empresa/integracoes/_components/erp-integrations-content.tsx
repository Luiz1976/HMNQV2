
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Settings, RefreshCw, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react'
import { ERPConfigDialog } from './erp-config-dialog'
import { ERPTestDialog } from './erp-test-dialog'
import { ERPSyncDialog } from './erp-sync-dialog'
import { ERPLogsDialog } from './erp-logs-dialog'
import { toast } from 'react-hot-toast'

interface ERPConfig {
  id: string
  name: string
  erpType: string
  isActive: boolean
  syncStatus: string
  lastSync: string | null
  employeeCount: number
  lastError: string | null
  syncLogs: any[]
  employees: any[]
}

interface ERPIntegrationsContentProps {
  initialConfigs: ERPConfig[]
  companyId: string
}

export function ERPIntegrationsContent({ initialConfigs, companyId }: ERPIntegrationsContentProps) {
  const [configs, setConfigs] = useState<ERPConfig[]>(initialConfigs)
  const [selectedConfig, setSelectedConfig] = useState<ERPConfig | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [showSyncDialog, setShowSyncDialog] = useState(false)
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const refreshConfigs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/erp/configs')
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigSaved = () => {
    refreshConfigs()
    setShowConfigDialog(false)
    setSelectedConfig(null)
    toast.success('Configuração salva com sucesso')
  }

  const handleSync = async (configId: string) => {
    try {
      const response = await fetch('/api/erp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ erpConfigId: configId })
      })

      if (response.ok) {
        toast.success('Sincronização iniciada')
        refreshConfigs()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao iniciar sincronização')
      }
    } catch (error) {
      toast.error('Erro ao iniciar sincronização')
    }
  }

  const handleDelete = async (configId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta integração?')) return

    try {
      const response = await fetch(`/api/erp/configs/${configId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Integração excluída')
        refreshConfigs()
      } else {
        toast.error('Erro ao excluir integração')
      }
    } catch (error) {
      toast.error('Erro ao excluir integração')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'SYNCING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
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

  const getERPDisplayName = (erpType: string) => {
    const names: Record<string, string> = {
      'TOTVS_PROTHEUS': 'TOTVS Protheus',
      'TOTVS_RM': 'TOTVS RM',
      'TOTVS_DATASUL': 'TOTVS Datasul',
      'SAP_SUCCESSFACTORS': 'SAP SuccessFactors',
      'ORACLE_FUSION_HCM': 'Oracle Fusion HCM',
      'ORACLE_PEOPLESOFT': 'Oracle PeopleSoft',
      'ADP_GLOBALVIEW': 'ADP GlobalView',
      'ADP_VANTAGE_HCM': 'ADP Vantage HCM',
      'SENIOR_HCM': 'Senior HCM',
      'LG_LUGAR_DE_GENTE': 'LG Lugar de Gente',
      'SOLIDES_GESTAO': 'Sólides Gestão',
      'SOLIDES_RH': 'Sólides RH',
      'BENNER': 'Benner',
      'OTHER': 'Outros'
    }
    return names[erpType] || erpType
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  return (
    <>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="configs">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Integrações</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{configs.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {configs.filter(c => c.isActive && c.syncStatus === 'SUCCESS').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Colaboradores Sincronizados</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {configs.reduce((total, config) => total + config.employeeCount, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {configs.filter(c => c.syncStatus === 'ERROR').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimas sincronizações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configs.slice(0, 5).map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(config.syncStatus)}
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className="text-sm text-gray-500">
                          {getERPDisplayName(config.erpType)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {formatDate(config.lastSync)}
                      </div>
                      <Badge variant={getStatusBadge(config.syncStatus)}>
                        {config.syncStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                {configs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma integração configurada ainda
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configs" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Configurações ERP</h3>
              <p className="text-sm text-gray-500">
                Gerencie suas integrações com sistemas ERP
              </p>
            </div>
            <Button 
              onClick={() => {
                setSelectedConfig(null)
                setShowConfigDialog(true)
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Integração</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configs.map((config) => (
              <Card key={config.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    {getStatusIcon(config.syncStatus)}
                  </div>
                  <CardDescription>
                    {getERPDisplayName(config.erpType)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={getStatusBadge(config.syncStatus)}>
                      {config.syncStatus}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Colaboradores:</span>
                    <span className="font-medium">{config.employeeCount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Última Sync:</span>
                    <span className="text-sm">{formatDate(config.lastSync)}</span>
                  </div>

                  {config.lastError && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {config.lastError}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConfig(config)
                        setShowConfigDialog(true)
                      }}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSync(config.id)}
                      disabled={config.syncStatus === 'SYNCING'}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${config.syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConfig(config)
                        setShowLogsDialog(true)
                      }}
                    >
                      Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {configs.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma integração configurada
                  </h3>
                  <p className="text-gray-500 text-center mb-6">
                    Configure sua primeira integração ERP para começar a sincronizar colaboradores automaticamente.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedConfig(null)
                      setShowConfigDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Integração
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ERPConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        config={selectedConfig as any}
        onSaved={handleConfigSaved}
      />

      <ERPTestDialog
        open={showTestDialog}
        onOpenChange={setShowTestDialog}
        config={selectedConfig as any}
      />

      <ERPSyncDialog
        open={showSyncDialog}
        onOpenChange={setShowSyncDialog}
        config={selectedConfig}
      />

      <ERPLogsDialog
        open={showLogsDialog}
        onOpenChange={setShowLogsDialog}
        config={selectedConfig}
      />
    </>
  )
}
