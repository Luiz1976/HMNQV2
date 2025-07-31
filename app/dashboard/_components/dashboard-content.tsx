
'use client'

// HumaniQ AI - Dashboard Content
// Conteúdo principal do dashboard administrativo

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Mail,
  Brain
} from 'lucide-react'

interface DashboardContentProps {
  activeTab: string
  stats: {
    totalUsers: number
    totalCompanies: number
    totalTests: number
    totalResults: number
    activeUsers: number
    completedTests: number
    pendingInvitations: number
    recentActivity: number
  }
}

export function DashboardContent({ activeTab, stats }: DashboardContentProps) {
  const overviewCards = [
    {
      title: 'Usuários Totais',
      value: stats.totalUsers,
      description: `${stats.activeUsers} ativos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%'
    },
    {
      title: 'Empresas',
      value: stats.totalCompanies,
      description: 'Clientes cadastrados',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8%'
    },
    {
      title: 'Testes Criados',
      value: stats.totalTests,
      description: 'Templates disponíveis',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+5%'
    },
    {
      title: 'Resultados',
      value: stats.totalResults,
      description: `${stats.completedTests} concluídos`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+24%'
    }
  ]

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Visualizar e administrar contas de usuário',
      icon: UserCheck,
      action: () => console.log('Gerenciar usuários')
    },
    {
      title: 'Configurar Testes',
      description: 'Criar e editar templates de avaliação',
      icon: Settings,
      action: () => console.log('Configurar testes')
    },
    {
      title: 'Analytics Avançado',
      description: 'Relatórios detalhados e métricas',
      icon: Activity,
      action: () => console.log('Ver analytics')
    },
    {
      title: 'Convites Pendentes',
      description: `${stats.pendingInvitations} convites aguardando`,
      icon: Clock,
      action: () => console.log('Ver convites')
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Visão geral do sistema HumaniQ AI</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewCards.map((card, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {card.title}
                    </CardTitle>
                    <div className={`${card.bgColor} p-2 rounded-full`}>
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600">
                        {card.description}
                      </p>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {card.trend}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Acesso direto às principais funcionalidades administrativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50"
                      onClick={action.action}
                    >
                      <action.icon className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Servidor Principal</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Banco de Dados</span>
                    <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Externa</span>
                    <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup Automático</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    • {stats.recentActivity} ações nas últimas 24h
                  </div>
                  <div className="text-sm text-gray-600">
                    • {stats.completedTests} testes concluídos hoje
                  </div>
                  <div className="text-sm text-gray-600">
                    • {stats.pendingInvitations} convites pendentes
                  </div>
                  <div className="text-sm text-gray-600">
                    • Sistema operando em 99.9% de uptime
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
              <p className="text-gray-600">Gerenciamento de usuários da plataforma</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de gerenciamento de usuários será implementada aqui</p>
                  <p className="text-sm mt-2">Total: {stats.totalUsers} usuários cadastrados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'companies':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Empresas</h2>
              <p className="text-gray-600">Gerenciamento de empresas clientes</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Empresas</CardTitle>
                <CardDescription>
                  Administre as empresas clientes da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de gerenciamento de empresas será implementada aqui</p>
                  <p className="text-sm mt-2">Total: {stats.totalCompanies} empresas cadastradas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'tests':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Testes</h2>
              <p className="text-gray-600">Gerenciamento de testes psicossociais</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Testes</CardTitle>
                <CardDescription>
                  Configure e monitore os testes psicossociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de gerenciamento de testes será implementada aqui</p>
                  <p className="text-sm mt-2">Total: {stats.totalTests} templates de teste</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'invitations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Convites</h2>
              <p className="text-gray-600">Gerenciamento de convites pendentes</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Convites</CardTitle>
                <CardDescription>
                  Visualize e gerencie convites enviados para usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de gerenciamento de convites será implementada aqui</p>
                  <p className="text-sm mt-2">Total: {stats.pendingInvitations} convites pendentes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
              <p className="text-gray-600">Relatórios avançados e métricas detalhadas</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançado</CardTitle>
                <CardDescription>
                  Relatórios detalhados e análises de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de analytics avançado será implementada aqui</p>
                  <p className="text-sm mt-2">Análise de {stats.totalResults} resultados de testes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
              <p className="text-gray-600">Configurações gerais do sistema</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Funcionalidade de configurações será implementada aqui</p>
                  <p className="text-sm mt-2">Personalização e configurações avançadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  )
}
