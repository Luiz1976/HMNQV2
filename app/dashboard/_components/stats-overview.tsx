
'use client'

// HumaniQ AI - Visão Geral das Estatísticas
// Cards com métricas principais do sistema

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, FileText, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsOverviewProps {
  totalUsers: number
  totalCompanies: number
  totalTests: number
}

export function StatsOverview({ totalUsers, totalCompanies, totalTests }: StatsOverviewProps) {
  const stats = [
    {
      title: 'Usuários Ativos',
      value: totalUsers,
      description: 'Total de usuários cadastrados',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Empresas',
      value: totalCompanies,
      description: 'Organizações cadastradas',
      icon: Building2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Testes Realizados',
      value: totalTests,
      description: 'Avaliações psicossociais',
      icon: FileText,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Taxa de Crescimento',
      value: '15%',
      description: 'Crescimento mensal',
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs text-muted-foreground">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
