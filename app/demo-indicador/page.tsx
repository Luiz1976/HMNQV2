'use client'

import React, { useState, useEffect } from 'react'
import IndicadorSaudePsicossocial from '@/components/indicador-saude-psicossocial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, 
  Download, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  Building
} from 'lucide-react'

// Simulação de dados reais da empresa
const empresaData = {
  nome: 'TechCorp Solutions',
  totalColaboradores: 247,
  testesRealizados: 189,
  scoreAtual: 405, // Score baseado na análise dos testes
  scorePrevio: 378,
  alertasCriticos: 3,
  ultimaAtualizacao: '15/01/2024 14:30',
  departamentos: [
    { name: 'Tecnologia', score: 420, employees: 85 },
    { name: 'Vendas', score: 385, employees: 45 },
    { name: 'Marketing', score: 445, employees: 32 },
    { name: 'RH', score: 410, employees: 18 },
    { name: 'Financeiro', score: 395, employees: 25 },
    { name: 'Operações', score: 375, employees: 42 }
  ],
  testesDetalhados: {
    humaniqRPO: 425,
    assedioMoral: 380,
    climaOrganizacional: 415,
    burnout: 390
  },
  historico: [
    { mes: 'Jan 2024', score: 405 },
    { mes: 'Dez 2023', score: 378 },
    { mes: 'Nov 2023', score: 365 },
    { mes: 'Out 2023', score: 342 },
    { mes: 'Set 2023', score: 358 },
    { mes: 'Ago 2023', score: 371 }
  ]
}

export default function DemoIndicadorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleExpandView = () => {
    setShowDetails(!showDetails)
  }

  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 701) return 'text-green-600'
    if (score >= 501) return 'text-lime-600'
    if (score >= 351) return 'text-yellow-600'
    if (score >= 301) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 701) return 'EXCELENTE'
    if (score >= 501) return 'BOM'
    if (score >= 351) return 'REGULAR'
    if (score >= 301) return 'INCERTO'
    return 'RUIM'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando dados da análise psicossocial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard de Saúde Psicossocial
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{empresaData.nome}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Última atualização: {empresaData.ultimaAtualizacao}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefreshData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurar
              </Button>
            </div>
          </div>
        </div>

        {/* Indicador Principal */}
        <IndicadorSaudePsicossocial
          score={empresaData.scoreAtual}
          totalEmployees={empresaData.totalColaboradores}
          evaluationsCompleted={empresaData.testesRealizados}
          onExpandView={handleExpandView}
          previousScore={empresaData.scorePrevio}
          lastUpdate={empresaData.ultimaAtualizacao}
          criticalAlerts={empresaData.alertasCriticos}
          departmentBreakdown={empresaData.departamentos}
          evaluationsData={empresaData.testesDetalhados}
        />

        {/* Detalhes Expandidos */}
        {showDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análise por Departamento */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análise por Departamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {empresaData.departamentos.map((dept, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDepartment === dept.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDepartment(
                        selectedDepartment === dept.name ? null : dept.name
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800">{dept.name}</h4>
                          <p className="text-sm text-gray-600">{dept.employees} colaboradores</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(dept.score)}`}>
                            {dept.score}
                          </div>
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: getScoreColor(dept.score).includes('green') ? '#22C55E' :
                                             getScoreColor(dept.score).includes('lime') ? '#84CC16' :
                                             getScoreColor(dept.score).includes('yellow') ? '#EAB308' :
                                             getScoreColor(dept.score).includes('orange') ? '#F97316' : '#EF4444',
                              color: 'white'
                            }}
                          >
                            {getScoreLabel(dept.score)}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedDepartment === dept.name && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Taxa de Participação:</span>
                              <div className="font-semibold">
                                {Math.round((dept.employees / empresaData.totalColaboradores) * 100)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Tendência:</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-semibold">+12</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Evolução */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução Histórica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {empresaData.historico.map((item, index) => {
                    const isLatest = index === 0
                    const prevScore = index < empresaData.historico.length - 1 
                      ? empresaData.historico[index + 1].score 
                      : item.score
                    const trend = item.score - prevScore
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${
                          isLatest ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.mes}</h4>
                            {isLatest && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                                Atual
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                              {item.score}
                            </div>
                            {trend !== 0 && (
                              <div className={`text-sm flex items-center gap-1 ${
                                trend > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {trend > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingUp className="h-3 w-3 rotate-180" />
                                )}
                                <span>{trend > 0 ? '+' : ''}{trend}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resumo Executivo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((empresaData.testesRealizados / empresaData.totalColaboradores) * 100)}%
                </div>
                <p className="text-gray-600">Taxa de Participação</p>
                <p className="text-sm text-gray-500 mt-1">
                  {empresaData.testesRealizados} de {empresaData.totalColaboradores} colaboradores
                </p>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(empresaData.scoreAtual)}`}>
                  {getScoreLabel(empresaData.scoreAtual)}
                </div>
                <p className="text-gray-600">Classificação Geral</p>
                <p className="text-sm text-gray-500 mt-1">
                  Score: {empresaData.scoreAtual}/800
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  +{empresaData.scoreAtual - empresaData.scorePrevio}
                </div>
                <p className="text-gray-600">Melhoria no Período</p>
                <p className="text-sm text-gray-500 mt-1">
                  Comparado ao mês anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}