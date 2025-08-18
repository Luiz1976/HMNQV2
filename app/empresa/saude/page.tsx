'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Coffee,
  Download,
  Filter,
  Calendar,
  Eye,
  Settings,
  RefreshCw,
  TrendingUp as TrendUp,
  AlertCircle,
  Info,
  ChevronRight,
  Building2,
  UserCheck,
  Gauge
} from 'lucide-react'
import MatrizRiscoAvancada from '@/components/matriz-risco-avancada'
import IndicadorSaudePsicossocial from '@/components/indicador-saude-psicossocial'
import { RelatorioPGR } from '@/components/relatorio-pgr'


export default function SaudeEmpresaPage() {
  const [activeTab, setActiveTab] = useState('risks')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  
  // Estado compartilhado para comunicação entre indicador e matriz
  const [sharedRiskData, setSharedRiskData] = useState({
    value: 3.2,
    level: 'Moderado',
    color: '#f59e0b',
    selectedArea: 'todas',
    selectedPeriod: 'mes',
    lastUpdate: new Date().toLocaleString('pt-BR')
  })
  
  // Função para atualizar dados compartilhados
  const updateSharedRiskData = (newData: any) => {
    setSharedRiskData(prev => ({ ...prev, ...newData }))
  }
  
  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  // Dados mock para demonstração
  const healthStats = {
    overallScore: 0,
    satisfactionScore: 0,
    stressLevel: 0,
    burnoutRisk: 0,
    workLifeBalance: 0,
    teamClimate: 0,
    criticalAlerts: 0,
    totalEmployees: 0,
    assessedEmployees: 0
  }

  const departmentWellness = [
    { name: 'Tecnologia', satisfaction: 0, stress: 0, climate: 0, employees: 0, trend: 'stable' },
    { name: 'Vendas', satisfaction: 0, stress: 0, climate: 0, employees: 0, trend: 'stable' },
    { name: 'Marketing', satisfaction: 0, stress: 0, climate: 0, employees: 0, trend: 'stable' },
    { name: 'RH', satisfaction: 0, stress: 0, climate: 0, employees: 0, trend: 'stable' },
    { name: 'Financeiro', satisfaction: 0, stress: 0, climate: 0, employees: 0, trend: 'stable' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Profissional */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Saúde Psicossocial
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Dashboard de Bem-estar Organizacional
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Colaboradores</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{healthStats.totalEmployees}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendUp className="h-3 w-3" />
                    +5% este mês
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avaliações</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{healthStats.assessedEmployees}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendUp className="h-3 w-3" />
                    +12% este mês
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Score Bem-estar</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{healthStats.overallScore}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    -2% este mês
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Gauge className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Alertas Ativos</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{criticalAlerts.length}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    Requer atenção
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sistema de Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="overview" className="gap-2">
              <Eye className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-2">
              <Shield className="h-4 w-4" />
              Análise de Riscos
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Resumo Geral da Saúde Psicossocial */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Resumo Geral da Saúde Psicossocial
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Últimos 30 dias
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                        +3.2%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Score Geral de Bem-estar
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {healthStats.overallScore}<span className="text-lg text-slate-500">%</span>
                      </p>
                      <Progress value={healthStats.overallScore} className="h-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Baseado em {healthStats.assessedEmployees} avaliações
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Smile className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                        +2.1%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Satisfação com o Trabalho
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {healthStats.satisfactionScore}<span className="text-lg text-slate-500">%</span>
                      </p>
                      <Progress value={healthStats.satisfactionScore} className="h-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Acima da média do setor
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                        -1.8%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Nível de Estresse
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {healthStats.stressLevel}<span className="text-lg text-slate-500">%</span>
                      </p>
                      <Progress value={healthStats.stressLevel} className="h-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Dentro do limite aceitável
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Coffee className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        +0.5%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Work-life Balance
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {healthStats.workLifeBalance}<span className="text-lg text-slate-500">%</span>
                      </p>
                      <Progress value={healthStats.workLifeBalance} className="h-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Equilíbrio moderado
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="risks" className="space-y-8 mt-8">
            {/* Análise de Riscos Psicossociais */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Análise de Riscos Psicossociais
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Relatório
                  </Button>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Indicador de Saúde Psicossocial */}
                <IndicadorSaudePsicossocial 
                  score={650}
                  totalEmployees={healthStats.totalEmployees}
                  evaluationsCompleted={healthStats.assessedEmployees}
                  onExpandView={() => setActiveTab('departments')}
                  previousScore={620}
                  lastUpdate={new Date().toLocaleString('pt-BR')}
                  criticalAlerts={healthStats.criticalAlerts}
                  departmentBreakdown={[
                    { name: 'Tecnologia', score: 680, employees: 45 },
                    { name: 'Vendas', score: 580, employees: 32 },
                    { name: 'Marketing', score: 720, employees: 28 },
                    { name: 'RH', score: 700, employees: 15 },
                    { name: 'Financeiro', score: 640, employees: 22 }
                  ]}
                  evaluationsData={{
                    humaniqRPO: 675,
                    assedioMoral: 720,
                    climaOrganizacional: 680,
                    burnout: 590
                  }}
                />
                
                {/* Matriz Quantitativa de Riscos Psicossociais */}
                <MatrizRiscoAvancada 
                  sharedData={sharedRiskData}
                  onDataChange={updateSharedRiskData}
                />
                
                {/* Relatório PGR - Conforme NR01 */}
                <RelatorioPGR 
                  nomeEmpresa="TechCorp Solutions"
                  cnpj="12.345.678/0001-90"
                  endereco="Av. Paulista, 1000 - São Paulo/SP - CEP: 01310-100"
                  dataAvaliacao={new Date().toLocaleDateString('pt-BR')}
                  versaoSistema="2.1"
                  totalParticipantes={156}
                  setoresAvaliados={["Administrativo", "Operacional", "Logística"]}
                  abrangencia="85% dos colaboradores por setor"
                />
              </div>
            </div>

          </TabsContent>

          <TabsContent value="departments" className="space-y-8 mt-8">
            {/* Clima Organizacional por Departamento */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Clima Organizacional por Departamento
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

          </TabsContent>

          <TabsContent value="alerts" className="space-y-8 mt-8">
            {/* Alertas Críticos */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Alertas Críticos
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
         </TabsContent>
         </Tabs>
       </div>
     </div>
   )
 }