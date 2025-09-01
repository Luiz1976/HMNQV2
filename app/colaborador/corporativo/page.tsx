'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTests } from '@/hooks/useTests'
import { 
  Building2, 
  Target, 
  Users, 
  Crown, 
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
  Award,
  TrendingUp,
  Brain
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

// Mapeamento de ícones para os testes corporativos
const getTestIcon = (testId: string) => {
  const iconMap: Record<string, any> = {
    'cme216c2h000v8wg0bwfqdy5z': Crown,     // HumaniQ LIDERA
    'cme216c33000x8wg08eauo7vk': Award,     // HumaniQ TELA
    'humaniq-pesquisa-clima': Users,        // HumaniQ Pesquisa de Clima
    'humaniq-qi': Brain,
    'humaniq-tipos': Users,
    'humaniq-bigfive': User,
    'humaniq-eneagrama': Target,
    'humaniq-valores': Compass,
    'humaniq-motiva': Zap,
    // Removido: 'humaniq-flex': Activity
  }
  return iconMap[testId] || Building2
}

// Mapeamento de categorias para os testes corporativos
const getCorporativeCategory = (testId: string) => {
  const categoryMap: Record<string, string> = {
    'cme216c2h000v8wg0bwfqdy5z': 'Estilos de Liderança', // HumaniQ LIDERA
    'cme216c33000x8wg08eauo7vk': 'Liderança Autêntica',  // HumaniQ TELA
    'humaniq-pesquisa-clima': 'Clima Organizacional'     // HumaniQ Pesquisa de Clima
  }
  return categoryMap[testId] || 'Corporativo'
}

function getCategoryGradient(category: string): string {
  const gradients = {
    'Estilos de Liderança': 'bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900',
    'Liderança Autêntica': 'bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900',
    'Clima Organizacional': 'bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900',
    'Competências Comportamentais': 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700'
  }
  return gradients[category as keyof typeof gradients] || 'bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900'
}

// Lista de testes corporativos permitidos e em ordem desejada (IDs reais do banco de dados)
const ALLOWED_CORPORATE_TEST_IDS = [
  'cme216c2h000v8wg0bwfqdy5z', // HumaniQ LIDERA – Estilos e Competências de Liderança
  'cme216c33000x8wg08eauo7vk', // HumaniQ TELA – Teste de Liderança Autêntica
  'humaniq-pesquisa-clima'      // HumaniQ Pesquisa de Clima
]

export default function CorporativoPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { tests: apiTests, loading, error } = useTests()
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    if (apiTests.length > 0) {
      // Filtrar apenas os testes corporativos permitidos e ordenar conforme a lista
      const filteredApiTests = apiTests.filter(test => ALLOWED_CORPORATE_TEST_IDS.includes(test.id))
        .sort((a, b) => ALLOWED_CORPORATE_TEST_IDS.indexOf(a.id) - ALLOWED_CORPORATE_TEST_IDS.indexOf(b.id))

      // Mapear os dados da API para o formato esperado pela página corporativa
      const corporativeTests: Test[] = filteredApiTests.map(test => ({
        id: test.id,
        name: test.title,
        description: test.description,
        category: getCorporativeCategory(test.id),
        duration: `${test.estimatedDuration} min`,
        status: 'available' as const,
        icon: getTestIcon(test.id),
        dimensions: getDimensionsForTest(test.id)
      }))
      
      // Adicionar testes mock ausentes conforme lista permitida
      const fallbackTests: Record<string, { name: string; description: string; duration: string }> = {
        'cme216c2h000v8wg0bwfqdy5z': {
          name: 'HumaniQ LIDERA – Estilos e Competências de Liderança',
          description: 'Avalia estilos e competências de liderança essenciais para o desenvolvimento e gestão de equipes.',
          duration: '20 min'
        },
        'cme216c33000x8wg08eauo7vk': {
          name: 'HumaniQ TELA – Teste de Liderança Autêntica',
          description: 'Mede o grau de autenticidade e integridade em comportamentos de liderança.',
          duration: '15 min'
        },
        'humaniq-pesquisa-clima': {
          name: 'HumaniQ Pesquisa de Clima',
          description: 'Avaliação abrangente do clima organizacional e bem-estar psicológico, medindo 12 dimensões críticas para o engajamento e performance das equipes.',
          duration: '15 min'
        }
      }

      ALLOWED_CORPORATE_TEST_IDS.forEach(id => {
        const alreadyExists = corporativeTests.some(test => test.id === id)
        if (!alreadyExists) {
          const fallback = fallbackTests[id]
          if (fallback) {
            corporativeTests.push({
              id,
              name: fallback.name,
              description: fallback.description,
              category: getCorporativeCategory(id),
              duration: fallback.duration,
              status: 'available' as const,
              icon: getTestIcon(id),
              dimensions: getDimensionsForTest(id)
            })
          }
        }
      })

      // Garantir ordem correta
      corporativeTests.sort((a, b) => ALLOWED_CORPORATE_TEST_IDS.indexOf(a.id) - ALLOWED_CORPORATE_TEST_IDS.indexOf(b.id))

      setTests(corporativeTests)
    }
  }, [apiTests])

  // Função para mapear dimensões baseadas no ID do teste
  const getDimensionsForTest = (testId: string): string[] => {
    const dimensionsMap: Record<string, string[]> = {
      'cme216c2h000v8wg0bwfqdy5z': ['Liderança', 'Competências', 'Estilos', 'Desenvolvimento'], // HumaniQ LIDERA
      'cme216c33000x8wg08eauo7vk': ['Autenticidade', 'Transparência', 'Valores', 'Integridade'], // HumaniQ TELA
      'humaniq-pesquisa-clima': ['Segurança Psicológica', 'Justiça & Ética', 'Comunicação', 'Reconhecimento'] // HumaniQ Pesquisa de Clima
    }
    return dimensionsMap[testId] || ['Dimensão Geral']
  }

  const handleStartTest = (testId: string) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return

    if (test.status === 'completed') {
      router.push(`/colaborador/resultados/${testId}`)
    } else {
      // Redireciona para a página de introdução do teste específico
      if (testId === 'cme216c2h000v8wg0bwfqdy5z') { // HumaniQ LIDERA
        router.push(`/colaborador/psicossociais/humaniq-lidera/introducao`)
      } else if (testId === 'cme216c33000x8wg08eauo7vk') { // HumaniQ TELA
        router.push(`/colaborador/psicossociais/humaniq-tela/introducao`)
      } else if (testId === 'humaniq-pesquisa-clima') { // HumaniQ Pesquisa de Clima
        router.push(`/colaborador/corporativo/humaniq-pesquisa-clima/introducao`)
      } else {
        router.push(`/colaborador/corporativos/${testId}/introducao`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando testes corporativos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente vinho e partículas */}
      <div className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 text-white overflow-hidden">
        {/* Partículas flutuantes avançadas */}
        <AdvancedParticleBackground 
          color="#ffffff" 
          particleCount={25} 
          size="large" 
          animation="drift"
          className="opacity-30"
        />
        <AdvancedParticleBackground 
           color="#7c3aed" 
           particleCount={15} 
           size="medium" 
           animation="float"
           className="opacity-20"
         />
        
        <div className="relative max-w-7xl mx-auto px-6 py-8 z-10">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Testes Corporativos</h1>
            {session?.user?.firstName && (
              <div className="mb-3">
                <p className="text-xl text-white/95 font-medium">
                  Olá, {session.user.firstName}! 👋
                </p>
              </div>
            )}
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-3">
              Avaliações de liderança e competências comportamentais para desenvolvimento profissional
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <Crown className="h-4 w-4 mr-2" />
              <span className="text-sm">Desenvolva suas competências de liderança e gestão</span>
            </div>
          </div>
          
          {/* Stats no header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-7 text-center">
              <div className="text-4xl font-bold mb-1">{tests.length}</div>
              <div className="text-white/80 text-base">Testes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-7 text-center">
              <div className="text-4xl font-bold mb-1">20-35</div>
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
            Escolha um teste para desenvolver suas competências de liderança
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
                   color="#7c3aed" 
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
        <div className="relative mt-12 bg-gradient-to-br from-white via-purple-50/30 to-purple-50/50 rounded-2xl p-8 shadow-xl border border-purple-100/50 overflow-hidden">
          {/* Partículas avançadas de fundo */}
          <AdvancedParticleBackground 
             color="#7c3aed" 
             particleCount={12} 
             size="medium" 
             animation="drift"
             className="opacity-15 rounded-2xl"
           />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-3">Sobre os Testes Corporativos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Avaliações especializadas em liderança e competências comportamentais para desenvolvimento profissional e organizacional.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl p-6 border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <AdvancedParticleBackground 
                   color="#7c3aed" 
                   particleCount={6} 
                   size="small" 
                   animation="pulse"
                   className="opacity-25 rounded-xl"
                 />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-100 rounded-lg mr-3 shadow-sm">
                       <Crown className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Como Funciona</h3>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Cada teste utiliza metodologias científicas validadas para avaliar competências de liderança, 
                    estilos de gestão e habilidades comportamentais essenciais para o sucesso corporativo.
                  </p>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl p-6 border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <AdvancedParticleBackground 
                   color="#7c3aed" 
                   particleCount={6} 
                   size="small" 
                   animation="float"
                   className="opacity-25 rounded-xl"
                 />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-100 rounded-lg mr-3 shadow-sm">
                       <Trophy className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Benefícios</h3>
                  </div>
                  <ul className="text-gray-700 text-base space-y-2">
                    <li className="flex items-start">
                       <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                       Desenvolvimento de competências de liderança
                     </li>
                     <li className="flex items-start">
                       <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                       Identificação de estilos de gestão mais eficazes
                     </li>
                     <li className="flex items-start">
                       <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                       Aprimoramento de habilidades comportamentais
                     </li>
                     <li className="flex items-start">
                       <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-800 to-purple-600 rounded-full mt-2 mr-2 flex-shrink-0 shadow-sm"></div>
                       Crescimento profissional e organizacional
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