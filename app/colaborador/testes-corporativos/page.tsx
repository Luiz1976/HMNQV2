'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Building2, Play, CheckCircle, AlertCircle, Info, BarChart3, Target, Users } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

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
}

export default function TestesCorporativosPage() {
  const [tests, setTests] = useState<CorporateTest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('/api/colaborador/resultados')
        const data = await response.json()
        
        if (response.ok && data.availableTests) {
          // Filtrar apenas testes corporativos
          const corporateTests = data.availableTests.filter((test: any) => 
            test.category?.name?.includes('Corporativo') || 
            test.category?.name?.includes('Liderança') ||
            test.category?.name?.includes('Gestão')
          ).map((test: any) => ({
            id: test.id,
            code: test.code || test.id,
            name: test.name,
            description: test.description || '',
            category: test.category?.name || 'Corporativo',
            estimatedTime: 25,
            questionsCount: 50,
            status: 'available',
            dimensions: []
          }))
          
          setTests(corporateTests)
        } else {
          console.error('Erro ao carregar testes:', data.error)
        }
      } catch (error) {
        console.error('Erro ao carregar testes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

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
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const getCategoryIcon = () => {
    return <Building2 className="h-8 w-8" />
  }

  const availableTests = tests.filter(test => test.status === 'available').length
  const completedTests = tests.filter(test => test.status === 'completed').length
  const totalTests = tests.length

  const handleStartTest = (testId: string) => {
    console.log('🎯 handleStartTest (Corporativos) chamado com testId:', testId)
    
    // Mapeamento de IDs para rotas de introdução
    const routeMap: { [key: string]: string } = {
      'humaniq-lidera': '/colaborador/psicossociais/humaniq-lidera/introducao',
      'humaniq-tela': '/colaborador/psicossociais/humaniq-tela/introducao',
      'clima-organizacional': '/colaborador/corporativos/clima-organizacional/introducao',
      'humaniq-qvt': '/colaborador/corporativos/humaniq-qvt/introducao',
      'humaniq-pas': '/colaborador/corporativos/humaniq-pas/introducao'
    }
    
    const route = routeMap[testId] || `/colaborador/corporativos/${testId}/introducao`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testes Corporativos</h1>
        <p className="text-gray-600">
          Avaliações organizacionais e clima empresarial
        </p>
      </div>



      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Progresso Geral</span>
          </CardTitle>
          <CardDescription>
            Acompanhe seu progresso nos testes corporativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{completedTests}/{totalTests} testes</span>
            </div>
            <Progress value={(completedTests / totalTests) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {test.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(test.status)}>
                  {getStatusText(test.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4">
                {/* Test Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{test.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <span>Teste completo</span>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Dimensões Avaliadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {test.dimensions.map((dimension, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dimension}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleStartTest(test.id)}
                  disabled={test.status === 'locked'}
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <span>
                      {test.status === 'completed' ? 'Ver Resultado' : 
                       test.status === 'in_progress' ? 'Continuar' : 
                       test.status === 'locked' ? 'Bloqueado' : 'Iniciar Teste'}
                    </span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Os testes corporativos avaliam competências de liderança, gestão e habilidades organizacionais. 
          Estes testes são essenciais para desenvolvimento profissional e identificação de potencial de liderança.
        </AlertDescription>
      </Alert>
    </div>
  )
}