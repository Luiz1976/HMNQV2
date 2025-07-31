
'use client'

// HumaniQ AI - Conteúdo da Landing Page
// Replica exatamente o design de referência da plataforma

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Headphones, ArrowRight, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { AuthUser } from '@/lib/types'

interface LandingContentProps {
  totalUsers: number
  totalTests: number
  user: AuthUser
}

export function LandingContent({ totalUsers, totalTests, user }: LandingContentProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const handleStartJourney = () => {
    // Implementar navegação para a jornada inteligente
    console.log('Iniciando jornada inteligente...')
  }

  const metrics = [
    {
      icon: Users,
      value: `${totalUsers}+`,
      label: 'Usuários Ativos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      value: '98%',
      label: 'Taxa de Precisão',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Headphones,
      value: '24/7',
      label: 'Suporte IA',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header simples com logout */}
      <header className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </header>

      {/* Conteúdo principal centralizado */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Título principal com gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Plataforma Poderosa
              </span>
              {' '}
              <span className="text-gray-900">
                para atender a nova exigência da NR01 – Riscos Psicossociais
              </span>
            </h1>
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transforme a gestão de pessoas com IA comportamental de última geração. 
            A solução definitiva para análise psicossocial que sua empresa precisa.
          </motion.p>

          {/* Seção CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Button
              onClick={handleStartJourney}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Comece agora sua jornada inteligente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <span className="text-gray-700 font-medium text-lg">
              Desperte o potencial humano com IA
            </span>
          </motion.div>

          {/* Métricas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="flex flex-col items-center space-y-4 py-8 px-6">
                    <div className={`${metric.bgColor} p-4 rounded-full`}>
                      <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {metric.value}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {metric.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
    </div>
  )
}
