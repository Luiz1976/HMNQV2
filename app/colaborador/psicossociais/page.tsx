'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTests } from '@/hooks/useTests'
import { 
  Brain, 
  Target, 
  Users, 
  Heart, 
  Compass, 
  Trophy, 
  Zap, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  Play,
  User,
  Smile,
  Activity,
  BarChart3,
  Puzzle,
  Gauge,
  Layers,
  Sparkles,
  Crown
} from 'lucide-react'
import { AdvancedParticleBackground } from '@/components/ui/advanced-particle-background'

interface Test {
  id: string
  name: string
  description: string
  category: string
  duration: string
  status: 'available' | 'in_progress' | 'completed'
  icon: any
  score?: number
  dimensions?: string[]
}

// Mapeamento de ícones para os testes psicossociais
const getPsicossocialIcon = (testId: string) => {
  const iconMap: Record<string, any> = {
    'humaniq-insight': Lightbulb,
    'humaniq-qvt': Heart,
    'humaniq-karasek-siegrist': Gauge,
    'humaniq-rpo': BarChart3,
    'humaniq-eo': Activity,
    'humaniq-pas': Users,
    'humaniq-mgrp': Layers,
    'humaniq-tipos': Target,
    'humaniq-bigfive': User,
    'humaniq-eneagrama': Compass,
    'humaniq-valores': Trophy,
    'humaniq-motiva': Zap,
    'humaniq-flex': Sparkles
  }
  return iconMap[testId] || Brain
}

// Mapeamento de categorias para os testes psicossociais
const getPsicossocialCategory = (testId: string) => {
  const categoryMap: Record<string, string> = {
    'humaniq-insight': 'Clima Organizacional',
    'humaniq-qvt': 'Qualidade de Vida',
    'humaniq-karasek-siegrist': 'Estresse Ocupacional',
    'humaniq-rpo': 'Riscos Psicossociais',
    'humaniq-eo': 'Estresse e Burnout',
    'humaniq-pas': 'Assédio e Violência',
    'humaniq-mgrp': 'Gestão de Riscos',
    'humaniq-tipos': 'Personalidade',
    'humaniq-bigfive': 'Personalidade',
    'humaniq-eneagrama': 'Personalidade',
    'humaniq-valores': 'Valores',
    'humaniq-motiva': 'Motivação',
    'humaniq-flex': 'Adaptabilidade'
  }
  return categoryMap[testId] || 'Psicossocial'
}

function getCategoryGradient(category: string): string {
  const gradients = {
    'Clima Organizacional': 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700',
    'Qualidade de Vida': 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700',
    'Estresse Ocupacional': 'bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800',
    'Riscos Psicossociais': 'bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700',
    'Estresse e Burnout': 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-700',
    'Assédio e Violência': 'bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700',
    'Gestão de Riscos': 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
    'Inteligência Emocional': 'bg-gradient-to-br from-pink-500 via-rose-600 to-red-700',
    'Liderança': 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700'
  }
  return gradients[category as keyof typeof gradients] || 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700'
}

// IDs dos testes psicossociais permitidos (IDs reais do banco de dados)
const ALLOWED_PSICO_TEST_IDS = [
  'cme216bcl00018wg05iydpwsz', // HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico
  'cme216bem00058wg0rqpxnh40', // HumaniQ QVT – Qualidade de Vida no Trabalho
  'cme216bgy00078wg0e0ethrmz', // HumaniQ Karasek-Siegrist – Teste Psicossocial Avançado
  'cme216bjq00098wg0yz7ly97k', // HumaniQ EO – Estresse Ocupacional, Burnout e Resiliência
  'cme216blq000b8wg0viq7ta6k', // HumaniQ PAS – Percepção de Assédio Moral e Sexual
  'cme216boc000d8wg02vj91skk', // HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais
  'cme7u1z2w00058w1w9k11srma', // HumaniQ RPO – Riscos Psicossociais Ocupacionais
  'humaniq-tipos' // HumaniQ Tipos
] as const

export default function PsicossociaisPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { tests: apiTests, loading, error } = useTests()
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    if (apiTests.length > 0) {
      // Filtrar apenas os testes desejados para a página
      const psicossocialTests: Test[] = apiTests
        .filter(test => ALLOWED_PSICO_TEST_IDS.includes(test.id as any))
        .map(test => ({
        id: test.id,
        name: test.title,
        description: test.description,
        category: getPsicossocialCategory(test.id),
        duration: `${test.estimatedDuration} min`,
        status: 'available' as const,
        icon: getPsicossocialIcon(test.id),
        dimensions: getDimensionsForTest(test.id)
      }))
      
      // Ordenar de acordo com a lista definida
      psicossocialTests.sort((a, b) => ALLOWED_PSICO_TEST_IDS.indexOf(a.id as any) - ALLOWED_PSICO_TEST_IDS.indexOf(b.id as any))
      setTests(psicossocialTests)
    }
  }, [apiTests])

  // Função para mapear dimensões baseadas no ID do teste
  const getDimensionsForTest = (testId: string): string[] => {
    const dimensionsMap: Record<string, string[]> = {
      'cme216bcl00018wg05iydpwsz': ['Clima', 'Bem-estar', 'Ambiente', 'Satisfação'], // HumaniQ Insight
      'cme216bem00058wg0rqpxnh40': ['Qualidade de Vida', 'Satisfação', 'Equilíbrio', 'Bem-estar'], // HumaniQ QVT
      'cme216bgy00078wg0e0ethrmz': ['Demanda', 'Controle', 'Esforço', 'Recompensa'], // HumaniQ Karasek-Siegrist
      'cme7u1z2w00058w1w9k11srma': ['Riscos', 'Prevenção', 'Segurança', 'Saúde Ocupacional'], // HumaniQ RPO
      'cme216bjq00098wg0yz7ly97k': ['Estresse', 'Burnout', 'Resiliência', 'Recuperação'], // HumaniQ EO
      'cme216blq000b8wg0viq7ta6k': ['Assédio Moral', 'Assédio Sexual', 'Violência', 'Proteção'], // HumaniQ PAS
      'cme216boc000d8wg02vj91skk': ['Maturidade', 'Gestão', 'Prevenção', 'Políticas'], // HumaniQ MGRP
      'cme216bde00038wg0xkau0ea0': ['Clima', 'Bem-estar', 'Comportamento', 'Satisfação'] // HumaniQ Pesquisa de Clima
    }
    return dimensionsMap[testId] || ['Dimensão Geral']
  }

  const handleStartTest = (testId: string) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return

    // Mapeamento de IDs reais -> rotas de introdução por slug
      const routeMap: Record<string, string> = {
      // Rotas específicas para testes que possuem páginas de introdução customizadas
      'cme216bcl00018wg05iydpwsz': '/colaborador/psicossociais/humaniq-insight/introducao', // HumaniQ Insight
      'cme7u1z2w00058w1w9k11srma': '/colaborador/psicossociais/humaniq-rpo/introducao', // HumaniQ RPO
      'cme216bem00058wg0rqpxnh40': '/colaborador/psicossociais/humaniq-qvt/introducao', // HumaniQ QVT
      'cmdxqvgu4000p8wsg7l8brjee': '/colaborador/psicossociais/humaniq-tipos/introducao', // HumaniQ TIPOS
      'cmdxqvgu4000o8wsg7l8brjed': '/colaborador/psicossociais/humaniq-valores/introducao', // HumaniQ VALORES
      'cme216bgy00078wg0e0ethrmz': '/colaborador/psicossociais/humaniq-karasek-siegrist/introducao', // HumaniQ Karasek-Siegrist
      'cme216bjq00098wg0yz7ly97k': '/colaborador/psicossociais/humaniq-eo/introducao', // HumaniQ EO
      'cme216blq000b8wg0viq7ta6k': '/colaborador/psicossociais/humaniq-pas/introducao', // HumaniQ PAS
      'cme216boc000d8wg02vj91skk': '/colaborador/psicossociais/humaniq-mgrp/introducao', // HumaniQ MGRP
    }

    if (test.status === 'completed') {
      router.push(`/colaborador/resultados/${testId}`)
    } else {
      const route = routeMap[testId] || `/colaborador/psicossociais/${testId}/introducao`
      router.push(route)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando testes psicossociais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente azul e partículas */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Partículas flutuantes avançadas */}
        <AdvancedParticleBackground 
          color="#ffffff" 
          particleCount={25} 
          size="large" 
          animation="drift"
          className="opacity-30"
        />
        <AdvancedParticleBackground 
          color="#3b82f6" 
          particleCount={15} 
          size="medium" 
          animation="float"
          className="opacity-20"
        />
        
        <div className="relative max-w-7xl mx-auto px-6 py-8 z-10">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Brain className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Testes Psicossociais</h1>
            {session?.user?.firstName && (
              <div className="mb-3">
                <p className="text-xl text-white/95 font-medium">
                  Olá, {session.user.firstName}! 👋
                </p>
              </div>
            )}
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-3">
              Avalie aspectos psicológicos e sociais que impactam seu bem-estar e desempenho no trabalho
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="text-sm">Descubra insights sobre sua saúde mental e desenvolvimento profissional</span>
            </div>
          </div>
          
          {/* Stats no header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-7 text-center">
              <div className="text-4xl font-bold mb-1">{tests.length}</div>
              <div className="text-white/80 text-base">Testes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-7 text-center">
              <div className="text-4xl font-bold mb-1">15-45</div>
              <div className="text-white/80 text-base">Minutos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-7 text-center">
              <div className="text-4xl font-bold mb-1">100%</div>
              <div className="text-white/80 text-base">Personalizado</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Título da seção */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Testes Disponíveis</h2>
          <p className="text-lg text-gray-600">
            Escolha um teste para começar sua jornada de autoconhecimento
          </p>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const Icon = test.icon
            return (
              <div key={test.id} className="group relative">
                {/* Partículas avançadas do card */}
                <AdvancedParticleBackground 
                  color="#ffffff" 
                  particleCount={8} 
                  size="small" 
                  animation="float"
                  className="opacity-40 rounded-2xl"
                />
                <AdvancedParticleBackground 
                  color="#3b82f6" 
                  particleCount={5} 
                  size="medium" 
                  animation="pulse"
                  className="opacity-20 rounded-2xl"
                />
                
                <div className={`relative ${getCategoryGradient(test.category)} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm border border-white/10 min-h-[420px] flex flex-col`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {test.status === 'completed' ? (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Concluído
                      </div>
                    ) : test.status === 'in_progress' ? (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Em Andamento
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        Disponível
                      </div>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="mb-4 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">{test.name}</h3>
                    <p className="text-white/90 text-base mb-3 line-clamp-3 flex-grow">
                      {test.description}
                    </p>
                    
                    {/* Category and Duration */}
                    <div className="flex items-center justify-between text-base mt-auto">
                      <span className="bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm text-sm">
                        {test.category}
                      </span>
                      <span className="text-white/80 text-sm">{test.duration}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleStartTest(test.id)}
                    className="relative w-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group-hover:bg-white/40 text-base overflow-hidden border border-white/20 hover:border-white/40 hover:shadow-lg"
                  >
                    {/* Efeito de brilho no botão */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Play className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">{test.status === 'completed' ? 'Ver Resultado' : 'Iniciar Teste'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="relative mt-12 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl p-8 shadow-xl border border-blue-100/50 overflow-hidden">
          {/* Partículas avançadas de fundo */}
          <AdvancedParticleBackground 
            color="#3b82f6" 
            particleCount={12} 
            size="medium" 
            animation="drift"
            className="opacity-15 rounded-2xl"
          />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-3">Sobre os Testes Psicossociais</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Avaliações científicas desenvolvidas para identificar aspectos psicológicos e sociais que impactam seu bem-estar e performance profissional.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <AdvancedParticleBackground 
                  color="#3b82f6" 
                  particleCount={6} 
                  size="small" 
                  animation="pulse"
                  className="opacity-25 rounded-xl"
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3 shadow-sm">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Como Funciona</h3>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Cada teste utiliza metodologias científicas validadas para avaliar diferentes dimensões da personalidade, 
                    cognição e comportamento, fornecendo insights precisos e personalizados.
                  </p>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <AdvancedParticleBackground 
                  color="#6366f1" 
                  particleCount={6} 
                  size="small" 
                  animation="float"
                  className="opacity-25 rounded-xl"
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mr-3 shadow-sm">
                      <Trophy className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Benefícios</h3>
                  </div>
                  <ul className="text-gray-700 text-base space-y-2">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                      Autoconhecimento profundo e desenvolvimento pessoal
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                      Identificação de pontos fortes e oportunidades de crescimento
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                      Orientação estratégica para carreira e liderança
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                      Melhoria nas relações interpessoais e trabalho em equipe
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
