
'use client'

// HumaniQ AI - Status do Sistema
// Indicadores de saúde da plataforma

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertCircle, Server, Database, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

export function SystemStatus() {
  const systemStats = [
    {
      name: 'API',
      status: 'online',
      uptime: '99.9%',
      icon: Server,
    },
    {
      name: 'Banco de Dados',
      status: 'online',
      uptime: '100%',
      icon: Database,
    },
    {
      name: 'IA/ML Services',
      status: 'online',
      uptime: '98.5%',
      icon: Cpu,
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return CheckCircle
      case 'warning':
      case 'offline':
        return AlertCircle
      default:
        return CheckCircle
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
        <CardDescription>
          Monitoramento dos serviços da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {systemStats.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status)
          
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <service.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(service.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {service.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </motion.div>
          )
        })}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Performance Geral</span>
            <span>92%</span>
          </div>
          <Progress value={92} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            Sistema funcionando adequadamente
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
