'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Loader2, Users, Building2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ERPEmployee {
  id: string
  email: string
  firstName: string
  lastName: string
  cpf?: string
  department?: string
  position?: string
  matricula?: string
}

interface ERPAutoConnectProps {
  onEmployeesImported: (employees: ERPEmployee[]) => void
  companyId: string
}

const ERP_OPTIONS = [
  { value: 'TOTVS_PROTHEUS', label: 'TOTVS Protheus' },
  { value: 'TOTVS_RM', label: 'TOTVS RM' },
  { value: 'SAP_SUCCESSFACTORS', label: 'SAP SuccessFactors' },
  { value: 'PROTHEUS', label: 'Protheus' },
  { value: 'BLING', label: 'Bling' },
  { value: 'SENIOR_HCM', label: 'Senior HCM' },
  { value: 'OMIE', label: 'Omie' },
  { value: 'OTHER', label: 'Outros' }
]

export function ERPAutoConnect({ onEmployeesImported, companyId }: ERPAutoConnectProps) {
  const [selectedERP, setSelectedERP] = useState('')
  const [customERPName, setCustomERPName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [connectionMessage, setConnectionMessage] = useState('')
  const [importedEmployees, setImportedEmployees] = useState<ERPEmployee[]>([])

  // Auto-connect quando login e senha estão preenchidos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedERP && login && password && !isConnecting) {
        handleAutoConnect()
      }
    }, 1000) // Delay de 1 segundo após parar de digitar

    return () => clearTimeout(timer)
  }, [selectedERP, login, password])

  const handleAutoConnect = async () => {
    if (!selectedERP || !login || !password) return

    setIsConnecting(true)
    setConnectionStatus('idle')
    
    try {
      const response = await fetch('/api/erp/auto-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          erpType: selectedERP,
          customName: selectedERP === 'OTHER' ? customERPName : undefined,
          login,
          password,
          companyId
        }),
      })

      const result = await response.json()

      if (result.success) {
        setConnectionStatus('success')
        setConnectionMessage(`Conexão com ${getERPLabel()} realizada com sucesso! ${result.employeeCount} colaboradores importados.`)
        setImportedEmployees(result.employees || [])
        onEmployeesImported(result.employees || [])
        toast.success('ERP conectado e dados importados com sucesso!')
      } else {
        setConnectionStatus('error')
        setConnectionMessage(result.message || 'Erro ao conectar com o ERP. Verifique login e senha e tente novamente.')
        toast.error('Erro ao conectar com o ERP')
      }
    } catch (error) {
      setConnectionStatus('error')
      setConnectionMessage('Erro de conexão. Verifique sua internet e tente novamente.')
      toast.error('Erro de conexão')
    } finally {
      setIsConnecting(false)
    }
  }

  const getERPLabel = () => {
    if (selectedERP === 'OTHER') return customERPName
    return ERP_OPTIONS.find(erp => erp.value === selectedERP)?.label || selectedERP
  }

  const resetConnection = () => {
    setConnectionStatus('idle')
    setConnectionMessage('')
    setImportedEmployees([])
    setLogin('')
    setPassword('')
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Conexão Automática com ERP
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isConnecting ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Conectando...</span>
              </div>
            ) : connectionStatus === 'success' ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
            ) : connectionStatus === 'error' ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Não Conectado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Não Conectado</span>
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Conecte seu ERP automaticamente e importe os dados dos colaboradores para envio de convites em massa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ERP Selection */}
        <div className="space-y-2">
          <Label htmlFor="erp-select">Selecione o ERP da sua empresa *</Label>
          <Select value={selectedERP} onValueChange={setSelectedERP}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha seu ERP" />
            </SelectTrigger>
            <SelectContent>
              {ERP_OPTIONS.map((erp) => (
                <SelectItem key={erp.value} value={erp.value}>
                  {erp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom ERP Name */}
        {selectedERP === 'OTHER' && (
          <div className="space-y-2">
            <Label htmlFor="custom-erp">Nome do ERP</Label>
            <Input
              id="custom-erp"
              value={customERPName}
              onChange={(e) => setCustomERPName(e.target.value)}
              placeholder="Digite o nome do seu ERP"
            />
          </div>
        )}

        {/* Credentials */}
        {selectedERP && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="login">Login do ERP *</Label>
              <Input
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Seu usuário do ERP"
                disabled={isConnecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha do ERP *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha do ERP"
                disabled={isConnecting}
              />
            </div>
          </div>
        )}



        {/* Loading Indicator */}
        {isConnecting && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Conectando ao ERP e importando dados...</span>
          </div>
        )}

        {/* Connection Status */}
        {connectionStatus !== 'idle' && (
          <Card className={`${connectionStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                {connectionStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${connectionStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {connectionMessage}
                  </p>
                  {connectionStatus === 'success' && importedEmployees.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {importedEmployees.length} colaboradores importados
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.from(new Set(importedEmployees.map(emp => emp.department).filter(Boolean))).slice(0, 5).map((dept) => (
                          <Badge key={dept} variant="outline" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                        {Array.from(new Set(importedEmployees.map(emp => emp.department).filter(Boolean))).length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{Array.from(new Set(importedEmployees.map(emp => emp.department).filter(Boolean))).length - 5} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {connectionStatus === 'error' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetConnection}
                      className="mt-2"
                    >
                      Tentar Novamente
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Connect Button (fallback) */}
        {selectedERP && login && password && connectionStatus === 'idle' && !isConnecting && (
          <Button
            onClick={handleAutoConnect}
            className="w-full"
            variant="outline"
          >
            Conectar Manualmente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}