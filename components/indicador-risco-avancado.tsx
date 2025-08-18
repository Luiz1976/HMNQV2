'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, AlertTriangle, Users, Building, RefreshCw, Maximize2, Activity } from 'lucide-react'

interface IndicadorRiscoAvancadoProps {
  className?: string
  sharedData?: {
    value: number
    level: string
    color: string
    selectedArea: string
    selectedPeriod: string
    lastUpdate: string
  }
  onDataChange?: (data: any) => void
}

interface RiskData {
  value: number
  level: string
  color: string
  description: string
  trend: 'up' | 'down' | 'stable'
  affectedEmployees: number
  criticalAreas: string[]
  lastUpdate: string
}

interface AreaData {
  name: string
  value: number
  employees: number
  status: 'normal' | 'attention' | 'critical'
}

const IndicadorRiscoAvancado: React.FC<IndicadorRiscoAvancadoProps> = ({ className, sharedData, onDataChange }) => {
  const [selectedArea, setSelectedArea] = useState(sharedData?.selectedArea || 'todas')
  const [selectedPeriod, setSelectedPeriod] = useState(sharedData?.selectedPeriod || 'mes')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [riskData, setRiskData] = useState<RiskData>({
    value: 3.2,
    level: 'Moderado',
    color: '#f59e0b',
    description: 'Risco psicossocial dentro dos parâmetros aceitáveis',
    trend: 'down',
    affectedEmployees: 45,
    criticalAreas: ['Recursos Humanos', 'Vendas'],
    lastUpdate: new Date().toLocaleString('pt-BR')
  })
  const [areasData] = useState<AreaData[]>([
    { name: 'Recursos Humanos', value: 3.8, employees: 12, status: 'attention' },
    { name: 'Vendas', value: 4.2, employees: 18, status: 'critical' },
    { name: 'TI', value: 2.1, employees: 8, status: 'normal' },
    { name: 'Financeiro', value: 2.8, employees: 7, status: 'normal' }
  ])

  // Função para determinar nível e cor baseado no valor
  const getRiskLevel = (value: number) => {
    if (value <= 1.5) return { level: 'Muito Baixo', color: '#10b981', description: 'Ambiente psicossocial excelente' }
    if (value <= 2.5) return { level: 'Baixo', color: '#22c55e', description: 'Condições psicossociais favoráveis' }
    if (value <= 3.5) return { level: 'Moderado', color: '#f59e0b', description: 'Risco psicossocial dentro dos parâmetros aceitáveis' }
    if (value <= 4.5) return { level: 'Elevado', color: '#f97316', description: 'Atenção necessária para fatores de risco' }
    if (value <= 5.5) return { level: 'Alto', color: '#ef4444', description: 'Intervenção urgente recomendada' }
    return { level: 'Crítico', color: '#dc2626', description: 'Situação crítica - ação imediata necessária' }
  }

  // Atualização simples dos dados
  const handleRefresh = () => {
    const newValue = Math.random() * 6
    const riskLevel = getRiskLevel(newValue)
    
    const newRiskData = {
      value: newValue,
      level: riskLevel.level,
      color: riskLevel.color,
      description: riskLevel.description,
      trend: (newValue > riskData.value ? 'up' : newValue < riskData.value ? 'down' : 'stable') as 'up' | 'down' | 'stable',
      affectedEmployees: Math.floor(Math.random() * 100) + 20,
      lastUpdate: new Date().toLocaleString('pt-BR')
    }
    
    setRiskData(prev => ({ ...prev, ...newRiskData }))
    
    // Notificar mudanças para componentes conectados
    if (onDataChange) {
      onDataChange({
        value: newValue,
        level: riskLevel.level,
        color: riskLevel.color,
        selectedArea,
        selectedPeriod,
        lastUpdate: new Date().toLocaleString('pt-BR')
      })
    }
  }

  // Atualização automática a cada 45 segundos
  useEffect(() => {
    const interval = setInterval(handleRefresh, 45000)
    return () => clearInterval(interval)
  }, [])

  const createRiskIndicator = () => {
    const percentage = (riskData.value / 6) * 100
    
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Indicador Principal */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 p-2">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {riskData.value.toFixed(1)}
                </div>
                <Badge 
                  className="text-sm px-3 py-1" 
                  style={{ backgroundColor: riskData.color, color: 'white' }}
                >
                  {riskData.level}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Barra de Progresso Circular */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={riskData.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.83} 283`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
        
        {/* Descrição */}
        <div className="text-center max-w-md">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {riskData.description}
          </p>
          <div className="flex items-center justify-center gap-2">
            {riskData.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : riskData.trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-green-500" />
            ) : (
              <Activity className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-xs text-slate-500">
              {riskData.trend === 'up' ? 'Tendência de alta' : 
               riskData.trend === 'down' ? 'Tendência de baixa' : 'Estável'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''} bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Indicador de Risco Psicossocial
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filtros Simplificados */}
        <div className="flex justify-center gap-4 mt-4">
          <Select value={selectedArea} onValueChange={(value) => {
            setSelectedArea(value)
            if (onDataChange) {
              onDataChange({
                selectedArea: value,
                selectedPeriod,
                value: riskData.value,
                level: riskData.level,
                color: riskData.color,
                lastUpdate: new Date().toLocaleString('pt-BR')
              })
            }
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="rh">RH</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="ti">TI</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={(value) => {
            setSelectedPeriod(value)
            if (onDataChange) {
              onDataChange({
                selectedArea,
                selectedPeriod: value,
                value: riskData.value,
                level: riskData.level,
                color: riskData.color,
                lastUpdate: new Date().toLocaleString('pt-BR')
              })
            }
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Indicador Principal */}
        <div className="flex justify-center">
          {createRiskIndicator()}
        </div>
        
        {/* Métricas Resumidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {riskData.affectedEmployees}
            </div>
            <div className="text-sm text-slate-500">Colaboradores</div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Building className="h-5 w-5 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {riskData.criticalAreas.length}
            </div>
            <div className="text-sm text-slate-500">Áreas de Atenção</div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Activity className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {riskData.level}
            </div>
            <div className="text-sm text-slate-500">Nível de Risco</div>
          </div>
        </div>

        {/* Áreas Críticas */}
        {riskData.criticalAreas.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Áreas que Precisam de Atenção</h3>
            <div className="space-y-2">
              {areasData.filter(a => a.status !== 'normal').map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{area.name}</div>
                    <Badge variant="destructive">
                      Risco {area.value.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {area.employees} colaboradores
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default IndicadorRiscoAvancado