
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  Heart, 
  Building2, 
  FileText, 
  TrendingUp,
  User,
  Trophy,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target,
  Sparkles,
  Calendar,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AdvancedParticleBackground } from '@/components/ui/advanced-particle-background'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  href: string
  gradient: string
  category: string
}

interface RecentResult {
  id: string
  testName: string
  completedAt: string
  score: number
  category: string
}

interface Statistic {
  label: string
  value: string
  icon: any
  color: string
}

export default function ColaboradorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: 'personalidade',
      title: 'Testes de Personalidade',
      description: 'Descubra seu perfil comportamental e características únicas',
      icon: User,
      href: '/colaborador/personalidade',
      gradient: 'from-purple-500 to-pink-600',
      category: 'Personalidade'
    },
    {
      id: 'psicossociais',
      title: 'Testes Psicossociais',
      description: 'Avalie seu bem-estar e saúde mental no trabalho',
      icon: Heart,
      href: '/colaborador/psicossociais',
      gradient: 'from-blue-500 to-indigo-600',
      category: 'Bem-estar'
    },
    {
      id: 'corporativo',
      title: 'Testes Corporativos',
      description: 'Desenvolva suas competências de liderança',
      icon: Building2,
      href: '/colaborador/corporativo',
      gradient: 'from-emerald-500 to-teal-600',
      category: 'Liderança'
    },
    {
      id: 'grafologia',
      title: 'Análise Grafológica',
      description: 'Análise de personalidade através da sua escrita',
      icon: FileText,
      href: '/colaborador/grafologia',
      gradient: 'from-orange-500 to-red-600',
      category: 'Grafologia'
    }
  ]

  const mockRecentResults: RecentResult[] = [
    {
      id: '1',
      testName: 'HumaniQ Big Five',
      completedAt: '2024-01-15',
      score: 85,
      category: 'Personalidade'
    },
    {
      id: '2',
      testName: 'HumaniQ DISC',
      completedAt: '2024-01-10',
      score: 92,
      category: 'Comportamental'
    },
    {
      id: '3',
      testName: 'Qualidade de Vida',
      completedAt: '2024-01-08',
      score: 78,
      category: 'Bem-estar'
    }
  ]

  const statistics: Statistic[] = [
    {
      label: 'Testes Realizados',
      value: '12',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Pontuação Média',
      value: '85%',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      label: 'Tempo Total',
      value: '4h 30m',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Último Teste',
      value: '5 dias',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ]

  const getUserGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getUserName = () => {
    if (session?.user?.firstName) {
      return `${session.user.firstName} ${session.user.lastName || ''}`.trim()
    }
    return session?.user?.userType === 'CANDIDATE' ? 'Candidato' : 'Colaborador'
  }

  const getUserType = () => {
    return session?.user?.userType === 'CANDIDATE' ? 'Candidato' : 'Colaborador'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <AdvancedParticleBackground 
          color="#ffffff" 
          particleCount={30} 
          size="large" 
          animation="drift"
          className="opacity-20"
        />
        <AdvancedParticleBackground 
          color="#8b5cf6" 
          particleCount={20} 
          size="medium" 
          animation="float"
          className="opacity-30"
        />
        
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 border-4 border-white/20">
                    <AvatarImage src={session?.user?.avatarUrl || ''} />
                    <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                      {session?.user?.firstName?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      {getUserGreeting()}, {getUserName()}!
                    </h1>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {getUserType()}
                      </span>
                      <span className="text-white/80">
                        {currentTime.toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-white/90 mb-6 max-w-2xl">
                  Bem-vindo ao seu painel pessoal. Explore seus testes, acompanhe seu progresso e descubra insights sobre sua personalidade e bem-estar.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                    onClick={() => router.push('/colaborador/psicossociais')}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Começar Novo Teste
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => router.push('/colaborador/resultados')}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Ver Resultados
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => router.push('/resultados')}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Meus Resultados
                  </Button>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-4 lg:ml-8">
                {statistics.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color.replace('text-', 'text-white')}`} />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-white/80">{stat.label}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Áreas de Avaliação</h2>
              <p className="text-lg text-gray-600">Escolha uma categoria para começar seus testes</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/colaborador/todos-os-testes')}
              className="hidden sm:flex"
            >
              Ver Todos os Testes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card 
                  key={action.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 mb-4">
                      {action.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {action.category}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Results and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Results */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                      Resultados Recentes
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Seus últimos testes realizados
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/colaborador/resultados')}
                  >
                    Ver Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/colaborador/resultados/${result.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.testName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{result.category}</span>
                            <span>•</span>
                            <span>{new Date(result.completedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{result.score}%</p>
                          <p className="text-xs text-gray-500">Pontuação</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {mockRecentResults.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Nenhum teste realizado ainda</p>
                    <Button 
                      onClick={() => router.push('/colaborador/psicossociais')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Fazer Primeiro Teste
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="space-y-6">
            {/* Personal Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Estatísticas Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                  Dica do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Complete testes regulares para obter insights mais precisos sobre seu desenvolvimento pessoal e profissional.
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => router.push('/colaborador/psicossociais')}
                >
                  Explorar Testes
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Explorador Iniciante</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Continue realizando testes para desbloquear novas conquistas!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">6/10 testes para próximo nível</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
