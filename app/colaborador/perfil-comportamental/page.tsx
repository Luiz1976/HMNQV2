'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTests } from '@/hooks/useTests'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TestCard } from '@/components/ui/test-card'
import { Clock, Brain, Play, CheckCircle, AlertCircle, Info, Sparkles, Target, Zap, Users } from 'lucide-react'

interface ProfileTest {
  id: string
  code: string
  name: string
  description: string
  category: string
  estimatedTime: number
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  dimensions: string[]
  score?: number
  completedAt?: string
}

export default function TestesPerfilPage() {
  const { data: session } = useSession()
  const { tests: apiTests, loading, error } = useTests()
  const [tests, setTests] = useState<ProfileTest[]>([])
  const router = useRouter()

  useEffect(() => {
    if (apiTests.length > 0) {
      // Mapear os dados da API para o formato esperado pela página
      const profileTests: ProfileTest[] = apiTests.map(test => ({
        id: test.id,
        code: test.id.toUpperCase().replace('-', '-'),
        name: test.title,
        description: test.description,
        category: test.category,
        estimatedTime: test.estimatedDuration,
        status: 'available' as const,
        dimensions: getDimensionsForTest(test.id)
      }))
      
      // Adicionar alguns status mockados para demonstração
      profileTests.forEach((test, index) => {
        if (test.id === 'humaniq-tipos') {
          test.status = 'completed'
          test.score = 85
          test.completedAt = '2024-01-15'
        } else if (test.id === 'humaniq-eneagrama') {
          test.status = 'in_progress'
        }
      })
      
      setTests(profileTests)
    }
  }, [apiTests])

  // Função para mapear dimensões baseadas no ID do teste
  const getDimensionsForTest = (testId: string): string[] => {
    const dimensionsMap: Record<string, string[]> = {
      'cme216bqg000f8wg08lorykq7': ['Raciocínio Lógico', 'Raciocínio Verbal', 'Raciocínio Numérico', 'Raciocínio Espacial'], // HumaniQ QI
      'cme216bwu000j8wg09ldbmhsa': ['Extroversão/Introversão', 'Sensação/Intuição', 'Pensamento/Sentimento', 'Julgamento/Percepção'], // HumaniQ TIPOS
      'cme216by0000l8wg0mtzzy9mn': ['Abertura', 'Conscienciosidade', 'Extroversão', 'Amabilidade', 'Neuroticismo'], // HumaniQ Big Five
      'cme216byv000n8wg0u0i180sm': ['Tipo de Personalidade', 'Motivações Centrais', 'Medos Básicos', 'Padrões Comportamentais'], // HumaniQ Eneagrama
      'cme1ykog2000o8wwgrbx5u7lt': ['Valores Pessoais', 'Valores Profissionais', 'Prioridades de Vida', 'Alinhamento Organizacional'], // HumaniQ Valores
      'cme216c0g000p8wg0z1rzzbcc': ['Motivação Intrínseca', 'Motivação Extrínseca', 'Fatores de Engajamento', 'Drivers de Performance'], // HumaniQ MOTIVA
      // Removido: 'cme216c1v000t8wg0xbvk5khk': ['Flexibilidade Cognitiva', 'Adaptação a Mudanças', 'Resiliência', 'Abertura a Experiências'], // HumaniQ FLEX
      'cme216btc000h8wg0i19nvghc': ['Atenção Sustentada', 'Raciocínio Lógico', 'Processamento Visual', 'Velocidade Cognitiva'], // HumaniQ TAR
      'cme216c12000r8wg0kx6hmfjw': ['Autoconsciência', 'Autorregulação', 'Empatia', 'Habilidades Sociais'] // HumaniQ BOLIE
    }
    return dimensionsMap[testId] || ['Dimensão Geral']
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'available':
        return 'bg-gray-100 text-gray-800'
      case 'locked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'in_progress':
        return 'Em Andamento'
      case 'available':
        return 'Disponível'
      case 'locked':
        return 'Bloqueado'
      default:
        return 'Disponível'
    }
  }

  const handleStartTest = (testId: string) => {
    const test = tests.find(t => t.id === testId)
    if (test) {
      // Verificar se existe página de introdução
      const hasIntroduction = [
        'cme216bqg000f8wg08lorykq7', // HumaniQ QI
        'cme216bwu000j8wg09ldbmhsa', // HumaniQ TIPOS
        'cme216by0000l8wg0mtzzy9mn', // HumaniQ Big Five
        'cme216byv000n8wg0u0i180sm', // HumaniQ Eneagrama
        'cme1ykog2000o8wwgrbx5u7lt', // HumaniQ Valores
        'cme216c0g000p8wg0z1rzzbcc', // HumaniQ MOTIVA
        'cme216c12000r8wg0kx6hmfjw', // HumaniQ BOLIE
        // Removido: 'cme216c1v000t8wg0xbvk5khk'  // HumaniQ FLEX
      ].includes(testId)

      if (hasIntroduction) {
        router.push(`/colaborador/perfil/${testId}/introducao`)
      } else {
        router.push(`/colaborador/perfil/${testId}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full animate-bounce"></div>
            <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Content */}
          <div className="relative px-8 py-16 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Icon and Title */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  <Users className="h-16 w-16 mr-4 relative z-10 drop-shadow-lg" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Testes de Perfil
                </h1>
              </div>
              
              {/* User Greeting */}
              {session?.user?.firstName && (
                <div className="mb-4">
                  <p className="text-xl text-white/95 font-medium">
                    Olá, {session.user.firstName}! 👋
                  </p>
                </div>
              )}
              
              {/* Main Description */}
              <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed mb-4 font-light">
                Descubra seu perfil comportamental, cognitivo e emocional através de avaliações científicas
              </p>
              
              {/* Subtitle */}
              <div className="inline-block">
                <h2 className="text-lg md:text-xl font-semibold mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  ✨ Conheça suas características únicas e potencialize seu desenvolvimento
                </h2>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                  <div className="text-2xl font-bold">{tests.length}</div>
                  <div className="text-sm opacity-80">Testes Disponíveis</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                  <div className="text-2xl font-bold">20-45</div>
                  <div className="text-sm opacity-80">Minutos por Teste</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-80">Científico</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tests.map((test) => (
          <div key={test.id} className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            
            <TestCard
              id={test.id}
              title={test.name}
              description={test.description}
              estimatedTime={test.estimatedTime}
              status={test.status}
              dimensions={test.dimensions}
              category={test.category}
              score={test.score}
              completedAt={test.completedAt}
              onStartTest={handleStartTest}
              onContinueTest={handleStartTest}
              onViewResults={(id) => {
                const test = tests.find(t => t.id === id)
                if (test) {
                  router.push(`/colaborador/perfil/${id}/resultados`)
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Sequência Recomendada</h4>
              <p className="text-sm text-gray-600">
                Inicie com o teste de QI para avaliar capacidades cognitivas,
                depois explore os testes de personalidade e motivação.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Desenvolvimento Contínuo</h4>
              <p className="text-sm text-gray-600">
                Use os resultados para criar um plano de desenvolvimento pessoal
                e profissional baseado em evidências científicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}