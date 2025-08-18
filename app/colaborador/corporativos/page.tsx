'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Users, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock,
  TrendingUp,
  Target,
  MessageSquare,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTests } from '@/hooks/useTests'
import { TestCard } from '@/components/ui/test-card'

interface CorporateTest {
  id: string
  code: string
  name: string
  description: string
  category: string
  estimatedTime: number
  questionsCount: number
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  score?: number
  completedAt?: string
  dimensions: string[]
  organizationalImpact: string
}

// IDs de testes corporativos permitidos e ordem desejada
const ALLOWED_CORPORATE_TEST_IDS = [
  'humaniq-lidera',
  'humaniq-tela',
  'humaniq-cobe'
]

export default function CorporativosPage() {
  const [tests, setTests] = useState<CorporateTest[]>([])
  const router = useRouter()
  const { tests: apiTests, loading, error } = useTests()

  const handleStartTest = (testId: string) => {
    console.log('🎯 handleStartTest (Corporativos) chamado com testId:', testId)
    
    // Mapeamento de IDs para rotas de introdução
    const routeMap: { [key: string]: string } = {
      'clima-organizacional': '/colaborador/corporativos/clima-organizacional',
      'humaniq-lidera': '/colaborador/psicossociais/humaniq-lidera/introducao',
      'humaniq-tela': '/colaborador/psicossociais/humaniq-tela/introducao',
      'humaniq-qvt': '/colaborador/psicossociais/humaniq-qvt/introducao',
      'humaniq-pas': '/colaborador/psicossociais/humaniq-pas/introducao'
    }
    
    const route = routeMap[testId] || `/colaborador/corporativos/${testId}`
    console.log('📍 Navegando para:', route)
    
    try {
      router.push(route)
      console.log('✅ Comando de navegação executado')
    } catch (error) {
      console.error('❌ Erro na navegação:', error)
      // Fallback para navegação direta
      window.location.href = route
    }
  }

  useEffect(() => {
    if (apiTests.length > 0) {
      const corporateTests = apiTests
        .filter(test => ALLOWED_CORPORATE_TEST_IDS.includes(test.id))
        .sort((a, b) => ALLOWED_CORPORATE_TEST_IDS.indexOf(a.id) - ALLOWED_CORPORATE_TEST_IDS.indexOf(b.id))
        .map(test => ({
          id: test.id,
          code: test.id, // Usar o ID como código
          name: test.title,
          description: test.description,
          category: 'Liderança',
          estimatedTime: test.estimatedDuration || 30,
          questionsCount: test.questionsCount || 0,
          status: 'available' as const,
          dimensions: [],
          organizationalImpact: 'Alto Impacto'
        }))
      setTests(corporateTests)
    }
  }, [apiTests])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-600" />
      case 'locked':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <Play className="h-5 w-5 text-purple-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'in_progress':
        return 'Em Andamento'
      case 'locked':
        return 'Bloqueado'
      default:
        return 'Disponível'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'locked':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Gestão de Riscos':
        return 'bg-red-100 text-red-800'
      case 'Clima e Cultura':
        return 'bg-blue-100 text-blue-800'
      case 'Engajamento':
        return 'bg-green-100 text-green-800'
      case 'Comunicação':
        return 'bg-yellow-100 text-yellow-800'
      case 'Diversidade':
        return 'bg-purple-100 text-purple-800'
      case 'Liderança':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gestão de Riscos':
        return <Shield className="h-4 w-4" />
      case 'Clima e Cultura':
        return <Building2 className="h-4 w-4" />
      case 'Engajamento':
        return <TrendingUp className="h-4 w-4" />
      case 'Comunicação':
        return <MessageSquare className="h-4 w-4" />
      case 'Diversidade':
        return <Users className="h-4 w-4" />
      case 'Liderança':
        return <Target className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    if (impact.includes('Alto')) return 'text-red-600'
    if (impact.includes('Médio')) return 'text-yellow-600'
    return 'text-green-600'
  }

  const availableTests = tests.filter(test => test.status === 'available').length
  const completedTests = tests.filter(test => test.status === 'completed').length
  const totalTests = tests.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-purple-600" />
            Testes Corporativos
          </h1>
          <p className="text-gray-600 mt-2">
            Avaliações organizacionais sobre clima, cultura, engajamento e outros aspectos estratégicos
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{availableTests} disponíveis</p>
          <p className="text-lg font-semibold text-purple-600">{completedTests}/{totalTests} concluídos</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
            <p className="text-sm text-gray-600 mt-1">Testes corporativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{availableTests}</div>
            <p className="text-sm text-gray-600 mt-1">Prontos para iniciar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{Math.round((completedTests / totalTests) * 100)}%</div>
            <Progress value={(completedTests / totalTests) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {tests.filter(t => t.organizationalImpact.includes('Alto')).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Alto impacto</p>
          </CardContent>
        </Card>
      </div>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Sobre os Testes Corporativos:</strong> Estas avaliações fornecem insights valiosos sobre 
          aspectos organizacionais estratégicos. Os resultados são utilizados para melhorar o ambiente 
          de trabalho e a efetividade organizacional.
        </AlertDescription>
      </Alert>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            id={test.id}
            title={test.name}
            description={test.description}
            estimatedTime={test.estimatedTime}
            status={test.status}
            dimensions={test.dimensions}
            score={test.score}
            completedAt={test.completedAt}
            onStartTest={handleStartTest}
            onViewResults={(id) => router.push(`/colaborador/corporativos/${id}/resultado`)}
            onContinueTest={(id) => router.push(`/colaborador/corporativos/${id}`)}
            category="Testes Corporativos"
          />
        ))}
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Categorias de Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Gestão de Riscos', icon: Shield, color: 'red', description: 'Avaliação de riscos psicossociais' },
              { name: 'Clima e Cultura', icon: Building2, color: 'blue', description: 'Ambiente e cultura organizacional' },
              { name: 'Engajamento', icon: TrendingUp, color: 'green', description: 'Motivação e comprometimento' },
              { name: 'Comunicação', icon: MessageSquare, color: 'yellow', description: 'Eficácia da comunicação interna' },
              { name: 'Diversidade', icon: Users, color: 'purple', description: 'Inclusão e equidade' },
              { name: 'Liderança', icon: Target, color: 'orange', description: 'Qualidade da liderança' }
            ].map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className={`bg-${category.color}-50 p-4 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-5 w-5 text-${category.color}-600`} />
                    <h4 className={`font-medium text-${category.color}-900`}>{category.name}</h4>
                  </div>
                  <p className={`text-sm text-${category.color}-700`}>{category.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Periodicidade</h4>
              <p className="text-sm text-blue-700">
                Testes corporativos são realizados periodicamente conforme cronograma da empresa, 
                geralmente a cada 6-12 meses.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Confidencialidade</h4>
              <p className="text-sm text-purple-700">
                Todas as respostas são anônimas e agregadas. Os resultados individuais são 
                confidenciais e utilizados apenas para análises organizacionais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}