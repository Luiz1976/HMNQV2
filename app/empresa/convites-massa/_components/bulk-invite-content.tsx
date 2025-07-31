
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

interface ERPEmployee {
  id: string
  email: string
  firstName: string
  lastName: string
  department?: string
  position?: string
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
  const [selectedTest, setSelectedTest] = useState<string>('')
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [inviteResult, setInviteResult] = useState<any>(null)

  const selectedConfig = erpConfigs.find(config => config.id === selectedERPConfig)
  const selectedTestData = tests.find(test => test.id === selectedTest)

  // Filter employees based on filters
  const filteredEmployees = selectedConfig?.employees?.filter(employee => {
    const matchesDepartment = !departmentFilter || 
      employee.department?.toLowerCase().includes(departmentFilter.toLowerCase())
    const matchesPosition = !positionFilter || 
      employee.position?.toLowerCase().includes(positionFilter.toLowerCase())
    return matchesDepartment && matchesPosition
  }) || []

  // Get unique departments and positions for filters
  const departments = Array.from(new Set(
    selectedConfig?.employees?.map(emp => emp.department).filter(dept => dept != null) || []
  )) as string[]
  const positions = Array.from(new Set(
    selectedConfig?.employees?.map(emp => emp.position).filter(pos => pos != null) || []
  )) as string[]

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

  const handleSendInvites = async () => {
    if (!selectedERPConfig || !selectedTest) {
      toast.error('Selecione uma integração ERP e um teste')
      return
    }

    if (selectedEmployees.length === 0) {
      toast.error('Selecione pelo menos um colaborador')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/erp/bulk-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          erpConfigId: selectedERPConfig,
          testId: selectedTest,
          employeeIds: selectedEmployees,
          message,
          expiresInDays
        })
      })

      const result = await response.json()

      if (response.ok) {
        setInviteResult(result)
        toast.success(`${result.invitations} convites enviados com sucesso!`)
        setSelectedEmployees([])
        setMessage('')
      } else {
        toast.error(result.error || 'Erro ao enviar convites')
      }
    } catch (error) {
      toast.error('Erro ao enviar convites')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
                        <span>{config.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {config.employeeCount} colaboradores
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erpConfigs.length === 0 && (
                <p className="text-sm text-red-600">
                  Nenhuma integração ERP ativa encontrada. Configure uma integração primeiro.
                </p>
              )}
            </div>

            {/* Test Selection */}
            <div className="space-y-2">
              <Label htmlFor="test">Teste Psicossocial *</Label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um teste" />
                </SelectTrigger>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.category.color || '#3B82F6' }}
                        />
                        <span>{test.name}</span>
                        <Badge variant="outline">{test.category.name}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      {selectedConfig && (
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
                          </div>
                          <div className="text-sm text-gray-600 flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{employee.email}</span>
                            </span>
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
      {selectedConfig && selectedTestData && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pronto para enviar convites</h3>
                <p className="text-sm text-gray-600">
                  {selectedEmployees.length} colaboradores receberão o convite para {selectedTestData.name}
                </p>
              </div>
              
              <Button
                onClick={handleSendInvites}
                disabled={isLoading || selectedEmployees.length === 0}
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
