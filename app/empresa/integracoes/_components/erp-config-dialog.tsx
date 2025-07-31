
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestTube2, Save, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ERPConfig {
  id?: string
  name: string
  erpType: string
  apiUrl: string
  apiKey?: string
  username?: string
  password?: string
  clientId?: string
  clientSecret?: string
  autoSync: boolean
  syncFrequency: number
  isActive: boolean
}

interface ERPConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config?: ERPConfig | null
  onSaved: () => void
}

const ERP_TYPES = [
  { value: 'TOTVS_PROTHEUS', label: 'TOTVS Protheus', auth: 'API_KEY' },
  { value: 'TOTVS_RM', label: 'TOTVS RM', auth: 'API_KEY' },
  { value: 'TOTVS_DATASUL', label: 'TOTVS Datasul', auth: 'API_KEY' },
  { value: 'SAP_SUCCESSFACTORS', label: 'SAP SuccessFactors', auth: 'OAUTH' },
  { value: 'ORACLE_FUSION_HCM', label: 'Oracle Fusion HCM', auth: 'BASIC_AUTH' },
  { value: 'ORACLE_PEOPLESOFT', label: 'Oracle PeopleSoft', auth: 'BASIC_AUTH' },
  { value: 'ADP_GLOBALVIEW', label: 'ADP GlobalView', auth: 'OAUTH' },
  { value: 'ADP_VANTAGE_HCM', label: 'ADP Vantage HCM', auth: 'OAUTH' },
  { value: 'SENIOR_HCM', label: 'Senior HCM', auth: 'API_KEY' },
  { value: 'LG_LUGAR_DE_GENTE', label: 'LG Lugar de Gente', auth: 'API_KEY' },
  { value: 'SOLIDES_GESTAO', label: 'Sólides Gestão', auth: 'API_KEY' },
  { value: 'SOLIDES_RH', label: 'Sólides RH', auth: 'API_KEY' },
  { value: 'BENNER', label: 'Benner', auth: 'API_KEY' },
  { value: 'OTHER', label: 'Outros', auth: 'CUSTOM' }
]

export function ERPConfigDialog({ open, onOpenChange, config, onSaved }: ERPConfigDialogProps) {
  const [formData, setFormData] = useState<ERPConfig>({
    name: '',
    erpType: '',
    apiUrl: '',
    apiKey: '',
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    autoSync: false,
    syncFrequency: 24,
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    if (config) {
      setFormData({
        name: config.name || '',
        erpType: config.erpType || '',
        apiUrl: config.apiUrl || '',
        apiKey: config.apiKey || '',
        username: config.username || '',
        password: config.password || '',
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || '',
        autoSync: config.autoSync || false,
        syncFrequency: config.syncFrequency || 24,
        isActive: config.isActive !== undefined ? config.isActive : true
      })
    } else {
      setFormData({
        name: '',
        erpType: '',
        apiUrl: '',
        apiKey: '',
        username: '',
        password: '',
        clientId: '',
        clientSecret: '',
        autoSync: false,
        syncFrequency: 24,
        isActive: true
      })
    }
    setTestResult(null)
  }, [config])

  const selectedErpType = ERP_TYPES.find(type => type.value === formData.erpType)

  const handleInputChange = (field: keyof ERPConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTestResult(null) // Clear previous test results when config changes
  }

  const handleTestConnection = async () => {
    try {
      setIsTesting(true)
      setTestResult(null)

      const response = await fetch('/api/erp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testConfig: formData })
      })

      const result = await response.json()
      setTestResult(result)

      if (result.success) {
        toast.success('Conexão testada com sucesso!')
      } else {
        toast.error(result.error || 'Falha no teste de conexão')
      }
    } catch (error) {
      const errorResult = {
        success: false,
        error: 'Erro ao testar conexão',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
      setTestResult(errorResult)
      toast.error('Erro ao testar conexão')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      const url = config?.id ? `/api/erp/configs/${config.id}` : '/api/erp/configs'
      const method = config?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSaved()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao salvar configuração')
      }
    } catch (error) {
      toast.error('Erro ao salvar configuração')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.name && formData.erpType && formData.apiUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {config ? 'Editar Integração ERP' : 'Nova Integração ERP'}
          </DialogTitle>
          <DialogDescription>
            Configure a integração com seu sistema ERP para sincronização automática de colaboradores
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="auth">Autenticação</TabsTrigger>
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Integração *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: ERP Principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="erpType">Tipo de ERP *</Label>
                <Select 
                  value={formData.erpType} 
                  onValueChange={(value) => handleInputChange('erpType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ERP" />
                  </SelectTrigger>
                  <SelectContent>
                    {ERP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{type.label}</span>
                          <Badge variant="outline" className="ml-2">
                            {type.auth}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL da API *</Label>
              <Input
                id="apiUrl"
                type="url"
                value={formData.apiUrl}
                onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                placeholder="https://api.exemplo.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Integração ativa</Label>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            {selectedErpType && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Método de Autenticação</CardTitle>
                  <CardDescription>
                    {selectedErpType.label} utiliza autenticação do tipo: 
                    <Badge variant="outline" className="ml-2">
                      {selectedErpType.auth}
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {selectedErpType?.auth === 'API_KEY' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="Sua API Key"
                />
              </div>
            )}

            {selectedErpType?.auth === 'BASIC_AUTH' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Usuário"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Senha"
                  />
                </div>
              </div>
            )}

            {selectedErpType?.auth === 'OAUTH' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID *</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    placeholder="Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret *</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={formData.clientSecret}
                    onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                    placeholder="Client Secret"
                  />
                </div>
              </div>
            )}

            {/* Test Connection */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={!isFormValid || isTesting}
                className="w-full"
              >
                <TestTube2 className={`mr-2 h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testando...' : 'Testar Conexão'}
              </Button>

              {testResult && (
                <Card className={`${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-2">
                      {testResult.success ? (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                          {testResult.message}
                        </p>
                        {testResult.error && (
                          <p className="text-sm text-red-600 mt-1">
                            {testResult.error}
                          </p>
                        )}
                        {testResult.details && (
                          <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto">
                            {JSON.stringify(testResult.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoSync"
                checked={formData.autoSync}
                onCheckedChange={(checked) => handleInputChange('autoSync', checked)}
              />
              <Label htmlFor="autoSync">Sincronização automática</Label>
            </div>

            {formData.autoSync && (
              <div className="space-y-2">
                <Label htmlFor="syncFrequency">Frequência de sincronização (horas)</Label>
                <Select 
                  value={formData.syncFrequency.toString()} 
                  onValueChange={(value) => handleInputChange('syncFrequency', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">A cada hora</SelectItem>
                    <SelectItem value="6">A cada 6 horas</SelectItem>
                    <SelectItem value="12">A cada 12 horas</SelectItem>
                    <SelectItem value="24">Diariamente</SelectItem>
                    <SelectItem value="168">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações da Sincronização</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• A sincronização automática manterá os dados de colaboradores sempre atualizados</p>
                <p>• Apenas colaboradores ativos serão sincronizados</p>
                <p>• Os dados existentes serão preservados e atualizados conforme necessário</p>
                <p>• Você pode iniciar uma sincronização manual a qualquer momento</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
