
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Send, CheckCircle, AlertTriangle, Mail, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ERPAutoConnect } from './erp-auto-connect'

interface ERPEmployee {
  id: string
  email: string
  firstName: string
  lastName: string
  cpf?: string
  department?: string
  position?: string
  matricula?: string
  status?: string
}

interface ERPConfig {
  id: string
  name: string
  erpType: string
  employeeCount: number
  employees: ERPEmployee[]
}

interface Test {
  id: string
  name: string
  description?: string
  category: {
    name: string
    color?: string
  }
}

interface BulkInviteContentProps {
  erpConfigs: ERPConfig[]
  tests: Test[]
  companyId: string
}

export function BulkInviteContent({ erpConfigs, tests, companyId }: BulkInviteContentProps) {
  const [selectedERPConfig, setSelectedERPConfig] = useState<string>('')
  const [selectedEvaluations, setSelectedEvaluations] = useState<string[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [inviteResult, setInviteResult] = useState<any>(null)
  const [autoImportedEmployees, setAutoImportedEmployees] = useState<ERPEmployee[]>([])

  const selectedConfig = erpConfigs.find(config => config.id === selectedERPConfig)
  const selectedTestsData = tests.filter(test => selectedEvaluations.includes(test.id))

  // Use auto-imported employees if available, otherwise use ERP config employees
  const availableEmployees = autoImportedEmployees.length > 0 ? autoImportedEmployees : (selectedConfig?.employees || [])

  // Filter employees based on filters
  const filteredEmployees = availableEmployees.filter(employee => {
    const matchesDepartment = !departmentFilter || 
      employee.department?.toLowerCase().includes(departmentFilter.toLowerCase())
    const matchesPosition = !positionFilter || 
      employee.position?.toLowerCase().includes(positionFilter.toLowerCase())
    return matchesDepartment && matchesPosition
  })

  // Get unique departments and positions for filters
  const departments = Array.from(new Set(
    availableEmployees.map(emp => emp.department).filter(dept => dept != null)
  )) as string[]
  const positions = Array.from(new Set(
    availableEmployees.map(emp => emp.position).filter(pos => pos != null)
  )) as string[]

  // Handle auto-imported employees
  const handleEmployeesImported = (employees: ERPEmployee[]) => {
    setAutoImportedEmployees(employees)
    setSelectedEmployees([]) // Reset selection when new employees are imported
    setDepartmentFilter('') // Reset filters
    setPositionFilter('')
    toast.success(`${employees.length} colaboradores importados com sucesso!`)
  }

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    }
  }

  const handleEvaluationToggle = (evaluationId: string) => {
    setSelectedEvaluations(prev => 
      prev.includes(evaluationId) 
        ? prev.filter(id => id !== evaluationId)
        : [...prev, evaluationId]
    )
  }

  const handleSelectAllEvaluations = () => {
    if (selectedEvaluations.length === tests.length) {
      setSelectedEvaluations([])
    } else {
      setSelectedEvaluations(tests.map(test => test.id))
    }
  }

  const handleSendInvites = async () => {
    if (selectedEvaluations.length === 0) {
      toast.error('Selecione pelo menos uma avaliação')
      return
    }

    if (selectedEmployees.length === 0) {
      toast.error('Selecione pelo menos um colaborador')
      return
    }

    // Check if we have auto-imported employees or ERP config
    if (autoImportedEmployees.length === 0 && !selectedERPConfig) {
      toast.error('Conecte um ERP ou selecione uma integração ERP existente')
      return
    }

    try {
      setIsLoading(true)
      
      // Get selected employees data
      const selectedEmployeesData = filteredEmployees.filter(emp => 
        selectedEmployees.includes(emp.id)
      )
      
      // Send invites for each selected evaluation
      const results = []
      let totalInvitations = 0
      let totalErrors = 0

      for (const evaluationId of selectedEvaluations) {
        const response = await fetch('/api/erp/bulk-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            erpConfigId: selectedERPConfig || null,
            evaluationId: evaluationId,
            employeeIds: selectedEmployees,
            employees: selectedEmployeesData, // Send full employee data for auto-imported
            message,
            expiresInDays,
            isAutoImported: autoImportedEmployees.length > 0
          })
        })

        const result = await response.json()
        results.push({ evaluationId, result, success: response.ok })
        
        if (response.ok) {
          totalInvitations += result.invitations
        } else {
          totalErrors++
        }
      }

       if (totalErrors === 0) {
        setInviteResult({ invitations: totalInvitations, results })
        toast.success(`${totalInvitations} convites enviados com sucesso para ${selectedEvaluations.length} avaliação${selectedEvaluations.length > 1 ? 'ões' : ''}!`)
        setSelectedEmployees([])
        setSelectedEvaluations([])
        setMessage('')
      } else if (totalErrors < selectedEvaluations.length) {
        setInviteResult({ invitations: totalInvitations, results })
        toast.success(`${totalInvitations} convites enviados com sucesso. ${totalErrors} avaliação${totalErrors > 1 ? 'ões' : ''} com erro.`)
      } else {
        toast.error('Erro ao enviar todos os convites')
      }
    } catch (error) {
      toast.error('Erro ao enviar convites')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ERP Auto Connect Section */}
      <ERPAutoConnect 
        onEmployeesImported={handleEmployeesImported}
        companyId={companyId}
      />

      {/* ERP Status Summary */}
      {(erpConfigs.length > 0 || autoImportedEmployees.length > 0) && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Status da Conexão ERP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status de Conexão ERP */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                {erpConfigs.length > 0 ? (
                  <>
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Status ERP</p>
                      <p className="text-sm text-green-600">Conectado</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Status ERP</p>
                      <p className="text-sm text-red-600">Não Conectado</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-blue-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Integrações Ativas</p>
                  <p className="text-sm text-blue-600">{erpConfigs.length} ERP(s) conectado(s)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Colaboradores Disponíveis</p>
                  <p className="text-sm text-blue-600">
                    {erpConfigs.reduce((total, config) => total + config.employeeCount, 0) + autoImportedEmployees.length} total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-800">Auto-importados</p>
                  <p className="text-sm text-purple-600">{autoImportedEmployees.length} colaborador(es)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração dos Convites</CardTitle>
          <CardDescription>
            Configure os parâmetros para envio dos convites em massa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ERP Selection */}
            <div className="space-y-2">
              <Label htmlFor="erpConfig">Integração ERP *</Label>
              <Select value={selectedERPConfig} onValueChange={setSelectedERPConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma integração ERP" />
                </SelectTrigger>
                <SelectContent>
                  {erpConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{config.name}</span>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {config.employeeCount} colaboradores
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erpConfigs.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">
                    Nenhuma integração ERP ativa encontrada. Configure uma integração primeiro.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-600">
                    {erpConfigs.length} integração(ões) ERP ativa(s) disponível(eis)
                  </p>
                </div>
              )}
            </div>

            {/* Evaluation Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Avaliações Psicossociais *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllEvaluations}
                  className="text-xs"
                >
                  {selectedEvaluations.length === tests.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={test.id}
                      checked={selectedEvaluations.includes(test.id)}
                      onCheckedChange={() => handleEvaluationToggle(test.id)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: test.category.color || '#3B82F6' }}
                      />
                      <Label htmlFor={test.id} className="cursor-pointer flex-1">
                        {test.name}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {test.category.name}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {selectedEvaluations.length > 0 && (
                <p className="text-sm text-gray-600">
                  {selectedEvaluations.length} avaliação{selectedEvaluations.length > 1 ? 'ões' : ''} selecionada{selectedEvaluations.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem Personalizada</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensagem opcional para incluir no convite..."
                rows={3}
              />
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <Label htmlFor="expires">Prazo de Validade (dias)</Label>
              <Select value={expiresInDays.toString()} onValueChange={(value) => setExpiresInDays(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Selection */}
      {(selectedConfig || autoImportedEmployees.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Seleção de Colaboradores</span>
              <Badge variant="outline">
                {selectedEmployees.length} / {filteredEmployees.length} selecionados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Lista de Colaboradores</TabsTrigger>
                <TabsTrigger value="filters">Filtros</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filtrar por Departamento</Label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os departamentos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os departamentos</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filtrar por Cargo</Label>
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os cargos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os cargos</SelectItem>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Filter className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {filteredEmployees.length} colaboradores encontrados com os filtros aplicados
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="list" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleSelectAll}
                    size="sm"
                  >
                    {selectedEmployees.length === filteredEmployees.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    {filteredEmployees.length} colaboradores disponíveis
                  </div>
                </div>

                <ScrollArea className="h-[400px] w-full border rounded-lg">
                  <div className="p-4 space-y-2">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg border"
                      >
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleEmployeeToggle(employee.id)}
                        />
                        
                        <div className="flex-1">
                          <div className="font-medium">
                            {employee.firstName} {employee.lastName}
                            {employee.matricula && (
                              <span className="ml-2 text-xs text-gray-500">({employee.matricula})</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{employee.email}</span>
                            </span>
                            {employee.cpf && (
                              <span className="text-xs text-gray-500">
                                CPF: {employee.cpf}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {/* Indicador de origem */}
                            {autoImportedEmployees.some(emp => emp.id === employee.id) ? (
                              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Auto-importado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                ERP Conectado
                              </Badge>
                            )}
                            {employee.department && (
                              <Badge variant="outline" className="text-xs">
                                {employee.department}
                              </Badge>
                            )}
                            {employee.position && (
                              <Badge variant="secondary" className="text-xs">
                                {employee.position}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredEmployees.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum colaborador encontrado com os filtros aplicados
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Send Button */}
      {(selectedConfig || autoImportedEmployees.length > 0) && selectedEvaluations.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pronto para enviar convites</h3>
                <p className="text-sm text-gray-600">
                  {selectedEmployees.length} colaboradores receberão convites para {selectedEvaluations.length} avaliação{selectedEvaluations.length > 1 ? 'ões' : ''}
                </p>
                {selectedEvaluations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Avaliações selecionadas:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTestsData.map((test) => (
                        <Badge key={test.id} variant="secondary" className="text-xs">
                          {test.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleSendInvites}
                disabled={isLoading || selectedEmployees.length === 0 || selectedEvaluations.length === 0}
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? 'Enviando...' : 'Enviar Convites'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {inviteResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-green-800">Convites Enviados com Sucesso!</h3>
                <div className="mt-2 text-sm text-green-700 space-y-1">
                  <p>• {inviteResult.invitations} convites criados e enviados</p>
                  <p>• {inviteResult.totalEmployees} colaboradores processados</p>
                  {inviteResult.skipped > 0 && (
                    <p>• {inviteResult.skipped} colaboradores já tinham convites pendentes</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
