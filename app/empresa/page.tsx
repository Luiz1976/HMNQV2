
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  Users, 
  UserPlus, 
  Heart, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Target,
  Shield,
  Activity,
  UserCheck,
  ClipboardList,
  Send
} from 'lucide-react'
import Link from 'next/link'

export default function EmpresaVisaoGeralPage() {
  // Dados mock para demonstração
  const stats = {
    totalColaboradores: 156,
    colaboradoresAtivos: 142,
    candidatosProcesso: 23,
    testesRealizados: 89,
    riscosIdentificados: 12,
    convitesEnviados: 45
  }

  // Estado para filtros e animações
  const [selectedDepartment, setSelectedDepartment] = useState('todos')
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [showDetails, setShowDetails] = useState(false)


  const recentActivities = [
    {
      id: 1,
      type: 'test_completed',
      message: 'João Silva completou teste psicossocial',
      time: '2 min atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'risk_detected',
      message: 'Risco alto detectado no departamento de TI',
      time: '15 min atrás',
      status: 'warning'
    },
    {
      id: 3,
      type: 'invite_sent',
      message: '5 novos convites enviados para candidatos',
      time: '1 hora atrás',
      status: 'info'
    },
    {
      id: 4,
      type: 'integration',
      message: 'Sincronização ERP concluída com sucesso',
      time: '2 horas atrás',
      status: 'success'
    }
  ]

  const departmentHealth = [
    { name: 'Tecnologia', score: 85, trend: 'up', employees: 45 },
    { name: 'Vendas', score: 72, trend: 'down', employees: 32 },
    { name: 'Marketing', score: 91, trend: 'up', employees: 28 },
    { name: 'RH', score: 88, trend: 'stable', employees: 15 },
    { name: 'Financeiro', score: 79, trend: 'up', employees: 22 }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
          <span className="text-gray-600 mt-2">
             Dashboard principal da empresa
           </span>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Building2 className="h-4 w-4 mr-1" />
          Módulo Empresa
        </Badge>
      </div>





      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              Total de Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">{stats.totalColaboradores}</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativos: <span className="font-medium text-green-600">{stats.colaboradoresAtivos}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Candidatos em Processo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">{stats.candidatosProcesso}</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Em <span className="font-medium text-orange-600">avaliação</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-semibold">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              Testes Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-3">{stats.testesRealizados}%</div>
            <Progress value={stats.testesRealizados} className="mt-2 h-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Taxa de <span className="font-medium text-purple-600">conclusão</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Saúde por Departamento
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Score de bem-estar por área</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentHealth.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    {getTrendIcon(dept.trend)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{dept.name}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dept.employees} pessoas
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-28">
                  <Progress value={dept.score} className="h-2.5" />
                  <span className="text-sm font-semibold w-10 text-gray-700 dark:text-gray-300">{dept.score}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Atividades Recentes
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Últimas atualizações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{activity.message}</span>
                  <span className="text-xs text-gray-500 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
