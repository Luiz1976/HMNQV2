'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Users,
  Shield,
  Target,
  Brain,
  Smile,
  Frown,
  Zap,
  Coffee
} from 'lucide-react'
import { MatrizRiscoPsicossocial } from './_components/matriz-risco'
import { IndicadorRiscoPsicossocial } from './_components/indicador-risco'

export default function SaudeEmpresaPage() {
  // Dados mock para demonstração
  const healthStats = {
    overallScore: 78,
    satisfactionScore: 85,
    stressLevel: 32,
    burnoutRisk: 18,
    workLifeBalance: 72,
    teamClimate: 88,
    criticalAlerts: 3,
    totalEmployees: 156,
    assessedEmployees: 142
  }

  const departmentWellness = [
    { name: 'Tecnologia', satisfaction: 82, stress: 28, climate: 85, employees: 45, trend: 'up' },
    { name: 'Vendas', satisfaction: 75, stress: 45, climate: 70, employees: 32, trend: 'down' },
    { name: 'Marketing', satisfaction: 91, stress: 22, climate: 92, employees: 28, trend: 'up' },
    { name: 'RH', satisfaction: 88, stress: 25, climate: 90, employees: 15, trend: 'stable' },
    { name: 'Financeiro', satisfaction: 79, stress: 35, climate: 82, employees: 22, trend: 'up' }
  ]

  const criticalAlerts = [
    {
      id: 1,
      type: 'high_stress',
      department: 'Vendas',
      message: 'Nível de estresse elevado detectado',
      severity: 'high',
      time: '2 horas atrás'
    },
    {
      id: 2,
      type: 'burnout_risk',
      department: 'Tecnologia',
      message: 'Risco de burnout em 3 colaboradores',
      severity: 'medium',
      time: '1 dia atrás'
    },
    {
      id: 3,
      type: 'low_satisfaction',
      department: 'Financeiro',
      message: 'Queda na satisfação com o trabalho',
      severity: 'medium',
      time: '2 dias atrás'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'assessment_completed',
      message: '15 colaboradores completaram avaliação psicossocial',
      time: '30 min atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'improvement_detected',
      message: 'Melhoria no clima organizacional do Marketing',
      time: '2 horas atrás',
      status: 'success'
    },
    {
      id: 3,
      type: 'alert_resolved',
      message: 'Alerta crítico do RH foi resolvido',
      time: '1 dia atrás',
      status: 'info'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge className="bg-red-100 text-red-800 border-red-200">Alto</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Médio</Badge>
      case 'low': return <Badge className="bg-green-100 text-green-800 border-green-200">Baixo</Badge>
      default: return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Título Principal */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">
            Saúde Psicossocial da Empresa
          </h1>
          <p className="text-blue-100 text-lg">
            Dashboard completo de bem-estar e saúde mental organizacional
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">{healthStats.totalEmployees} colaboradores</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm">{healthStats.assessedEmployees} avaliações</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Geral da Saúde Psicossocial */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Resumo Geral da Saúde Psicossocial
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="p-2 bg-pink-500 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                Score Geral de Bem-estar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600 mb-3">{healthStats.overallScore}%</div>
              <Progress value={healthStats.overallScore} className="mt-2 h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Baseado em {healthStats.assessedEmployees} avaliações</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Smile className="h-5 w-5 text-white" />
                </div>
                Satisfação com o Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-3">{healthStats.satisfactionScore}%</div>
              <Progress value={healthStats.satisfactionScore} className="mt-2 h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Acima da média do setor</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Nível de Estresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-3">{healthStats.stressLevel}%</div>
              <Progress value={healthStats.stressLevel} className="mt-2 h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Dentro do limite aceitável</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Coffee className="h-5 w-5 text-white" />
                </div>
                Work-life Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-3">{healthStats.workLifeBalance}%</div>
              <Progress value={healthStats.workLifeBalance} className="mt-2 h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Equilíbrio moderado</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Indicador de Risco Psicossocial Geral e Matriz de Risco */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Análise de Riscos Psicossociais
        </h2>
        
        <div className="space-y-10 max-w-full mx-auto mb-12">
          <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <IndicadorRiscoPsicossocial />
          </div>
          <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <MatrizRiscoPsicossocial />
          </div>
        </div>
      </div>

      {/* Clima Organizacional por Departamento */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Clima Organizacional por Departamento
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Smile className="h-6 w-6 text-white" />
                </div>
                Satisfação por Departamento
              </CardTitle>
              <CardDescription className="text-base">Níveis de satisfação e bem-estar por área</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {departmentWellness.map((dept) => (
                <div key={dept.name} className="space-y-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(dept.trend)}
                      <span className="font-semibold text-lg">{dept.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {dept.employees} pessoas
                      </Badge>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">{dept.satisfaction}%</span>
                  </div>
                  <Progress value={dept.satisfaction} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                Níveis de Estresse
              </CardTitle>
              <CardDescription className="text-base">Monitoramento de estresse por departamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {departmentWellness.map((dept) => (
                <div key={dept.name} className="space-y-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{dept.name}</span>
                    <span className={`text-lg font-bold ${
                      dept.stress > 40 ? 'text-red-600' : 
                      dept.stress > 25 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {dept.stress}%
                    </span>
                  </div>
                  <Progress 
                    value={dept.stress} 
                    className={`h-3 ${
                      dept.stress > 40 ? '[&>div]:bg-red-500' : 
                      dept.stress > 25 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'
                    }`} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alertas Críticos */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Alertas Críticos
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                Situações que Requerem Atenção
              </CardTitle>
              <CardDescription className="text-base">
                {criticalAlerts.length} alertas ativos no momento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border-l-4 border-red-400 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-base">{alert.department}</span>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                Atividades Recentes
              </CardTitle>
              <CardDescription className="text-base">Últimas atualizações do sistema de saúde psicossocial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block mb-1">{activity.message}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}