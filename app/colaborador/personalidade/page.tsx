'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTests } from '@/hooks/useTests'
import { 
  Brain, 
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
  Heart
} from 'lucide-react'
import { AdvancedParticleBackground } from '@/components/ui/advanced-particle-background'

interface Test {
  id: string
  name: string
  description: string
  category: string
  duration: string
  questions: number
  status: 'available' | 'in_progress' | 'completed'
  icon: any
  score?: number
  dimensions?: string[]
}

// Mapeamento de ícones para os testes de personalidade
const getTestIcon = (testName: string) => {
  const iconMap: Record<string, any> = {
    'BOLIE': Heart,
    'Big Five': User,
    'Eneagrama': Compass,
    'Valores': Trophy,
    'Tipos': Brain,
    'DISC': Target
  }
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (testName.includes(key)) {
      return icon
    }
  }
  return Brain
}

// Mapeamento de categorias para os testes de personalidade
const getPersonalityCategory = (testName: string) => {
  if (testName.includes('BOLIE')) return 'Inteligência Emocional'
  if (testName.includes('Big Five')) return 'Traços de Personalidade'
  if (testName.includes('Eneagrama')) return 'Tipos de Personalidade'
  if (testName.includes('Valores')) return 'Valores Pessoais'
  if (testName.includes('Tipos')) return 'Perfil Cognitivo'
  if (testName.includes('DISC')) return 'Perfil Comportamental'
  return 'Personalidade'
}

function getCategoryGradient(category: string): string {
  const gradients = {
    'Inteligência Emocional': 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600',
    'Traços de Personalidade': 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500',
    'Tipos de Personalidade': 'bg-gradient-to-br from-green-600 via-teal-600 to-emerald-600',
    'Valores Pessoais': 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600',
    'Perfil Cognitivo': 'bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600',
    'Perfil Comportamental': 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
  }
  return gradients[category as keyof typeof gradients] || 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
}

export default function PersonalidadePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { tests: apiTests, loading, error } = useTests()
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    if (apiTests.length > 0) {
      // Filtrar apenas os testes de personalidade
      const personalityTests = apiTests.filter(test => 
        (test.type === 'PERSONALITY' || 
        test.category === 'Perfil' ||
        test.title.includes('BOLIE') ||
        test.title.includes('Big Five') ||
        test.title.includes('Eneagrama') ||
        test.title.includes('FLEX') ||
        test.title.includes('MOTIVA') ||
        test.title.includes('QI') ||
        test.title.includes('TAR') ||
        test.title.includes('TIPOS') ||
        test.title.includes('Valores') ||
        test.title.includes('DISC'))
      )

      // Filtrar para manter apenas um teste de Eneagrama (o do meio)
      const eneagramaTests = personalityTests.filter(test => test.title.includes('Eneagrama'))
      const otherTests = personalityTests.filter(test => !test.title.includes('Eneagrama'))
      
      // Se há múltiplos testes de Eneagrama, manter apenas o do meio
      let filteredEneagramaTests = eneagramaTests
      if (eneagramaTests.length > 1) {
        const middleIndex = Math.floor(eneagramaTests.length / 2)
        filteredEneagramaTests = [eneagramaTests[middleIndex]]
      }
      
      // Combinar os testes filtrados
      const finalTests = [...otherTests, ...filteredEneagramaTests]

      // Mapear os dados da API para o formato esperado pela página
      const mappedTests: Test[] = finalTests.map(test => ({
        id: test.id,
        name: test.title,
        description: test.description,
        category: getPersonalityCategory(test.title),
        duration: `${test.estimatedDuration} min`,
        questions: test.questionsCount || 30,
        status: 'available' as const,
        icon: getTestIcon(test.title),
        dimensions: getDimensionsForTest(test.title)
      }))
      
      setTests(mappedTests)
    }
  }, [apiTests])

  // Função para mapear dimensões baseadas no nome do teste
  const getDimensionsForTest = (testName: string): string[] => {
    if (testName.includes('BOLIE')) return ['Autoconsciência', 'Autorregulação', 'Motivação', 'Empatia', 'Habilidades Sociais']
    if (testName.includes('Big Five')) return ['Abertura', 'Conscienciosidade', 'Extroversão', 'Amabilidade', 'Neuroticismo']
    if (testName.includes('Eneagrama')) return ['Tipo de Personalidade', 'Motivações Centrais', 'Medos Básicos', 'Padrões Comportamentais']
    if (testName.includes('FLEX')) return ['Adaptabilidade', 'Flexibilidade Cognitiva', 'Resiliência', 'Abertura à Mudança']
    if (testName.includes('MOTIVA')) return ['Motivação Intrínseca', 'Motivação Extrínseca', 'Valores Profissionais', 'Direcionadores de Carreira']
    if (testName.includes('QI')) return ['Raciocínio Lógico', 'Compreensão Verbal', 'Memória de Trabalho', 'Velocidade de Processamento']
    if (testName.includes('TAR')) return ['Atenção Sustentada', 'Atenção Seletiva', 'Raciocínio Abstrato', 'Processamento Cognitivo']
    if (testName.includes('TIPOS')) return ['Preferências Cognitivas', 'Estilo de Processamento', 'Tomada de Decisão', 'Orientação Energética']
    if (testName.includes('Valores')) return ['Valores Pessoais', 'Valores Profissionais', 'Prioridades de Vida', 'Alinhamento Vocacional']
    if (testName.includes('DISC')) return ['Dominância', 'Influência', 'Estabilidade', 'Conformidade']
    return ['Dimensão Geral']
  }

  const handleStartTest = (testId: string, testName: string) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return

    if (test.status === 'completed') {
      router.push(`/colaborador/resultados/${testId}`)
    } else {
      // Redireciona para a página de introdução do teste específico
      if (testName.includes('BOLIE')) {
        router.push('/colaborador/personalidade/bolie/introducao')
      } else if (testName.includes('Big Five')) {
        router.push('/colaborador/personalidade/big-five/introducao')
      } else if (testName.includes('Eneagrama')) {
        router.push('/colaborador/personalidade/eneagrama/introducao')
      } else if (testName.includes('FLEX')) {
        router.push('/colaborador/personalidade/flex/introducao')
      } else if (testName.includes('MOTIVA')) {
        router.push('/colaborador/personalidade/motiva/introducao')
      } else if (testName.includes('QI')) {
        router.push('/colaborador/personalidade/qi/introducao')
      } else if (testName.includes('TAR')) {
        router.push('/colaborador/personalidade/tar/introducao')
      } else if (testName.includes('TIPOS')) {
        router.push('/colaborador/personalidade/tipos/introducao')
      } else if (testName.includes('Valores')) {
        router.push('/colaborador/personalidade/valores/introducao')
      } else if (testName.includes('DISC')) {
        router.push('/colaborador/personalidade/disc/introducao')
      } else {
        router.push(`/colaborador/personalidade/${testId}/introducao`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
             <p className="text-lg text-gray-600">Carregando testes de personalidade...</p>
           </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente e partículas */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white overflow-hidden">
        {/* Partículas flutuantes avançadas */}
        <AdvancedParticleBackground 
          color="#ffffff" 
          particleCount={25} 
          size="large" 
          animation="drift"
          className="opacity-30"
        />
        <AdvancedParticleBackground 
           color="#10b981" 
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
            <h1 className="text-4xl font-bold mb-2">Testes de Personalidade</h1>
            {session?.user?.firstName && (
              <div className="mb-3">
                <p className="text-xl text-white/95 font-medium">
                  Olá, {session.user.firstName}! 👋
                </p>
              </div>
            )}
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-3">
              Descubra aspectos únicos da sua personalidade através de avaliações científicas
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">Conheça melhor seu perfil comportamental e emocional</span>
            </div>
          </div>
         </div>
       </div>

       {/* Conteúdo Principal */}
       <div className="max-w-7xl mx-auto px-6 py-8">
         {error && (
           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
             <p className="text-red-600">Erro ao carregar testes: {error}</p>
           </div>
         )}

         {tests.length === 0 && !loading && (
           <div className="text-center py-12">
             <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
             <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum teste encontrado</h3>
             <p className="text-gray-500">Não há testes de personalidade disponíveis no momento.</p>
           </div>
         )}

         {/* Seção de Estatísticas */}
         <div className="mb-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
               <div className="text-3xl font-bold text-green-600 mb-2">10</div>
               <div className="text-sm text-gray-600">Testes</div>
             </div>
             <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
               <div className="text-3xl font-bold text-green-600 mb-2">15-45</div>
               <div className="text-sm text-gray-600">Minutos</div>
             </div>
             <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
               <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
               <div className="text-sm text-gray-600">Personalizado</div>
             </div>
           </div>
         </div>

         {/* Título da Seção */}
         <div className="mb-6">
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Testes Disponíveis</h2>
           <p className="text-gray-600">Escolha um teste para começar sua jornada de autoconhecimento.</p>
         </div>

         {/* Grid de Testes */}
         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
           {tests.map((test, index) => {
             const Icon = test.icon
             const gradientClass = getCategoryGradient(test.category)
             
             return (
               <div key={test.id} className="group" style={{minWidth: '280px', maxWidth: '360px', width: '100%'}}>
                 <div className={`${gradientClass} rounded-xl p-6 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[350px] flex flex-col`} style={{minHeight: '350px'}}>
                   {/* Elementos decorativos */}
                   <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                   
                   <div className="relative z-10 flex flex-col h-full">
                     {/* Header do Card */}
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                         <Icon className="h-5 w-5 text-white" />
                       </div>
                       {test.status === 'completed' && (
                         <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 backdrop-blur-sm">
                           <CheckCircle className="h-3 w-3" />
                           <span className="text-xs font-medium">Concluído</span>
                         </div>
                       )}
                       <div className="bg-white/20 rounded-full px-2 py-1 backdrop-blur-sm">
                         <span className="text-xs font-medium">Personalidade</span>
                       </div>
                     </div>
                     
                     {/* Título e Descrição */}
                     <div className="mb-4 flex-grow overflow-y-auto">
                       <h3 className="text-lg font-bold mb-2 leading-tight">{test.name}</h3>
                       <p className="text-white/90 text-sm leading-relaxed mb-3">
                         {test.description}
                       </p>
                     </div>

                     {/* Informações do Teste */}
                     <div className="mb-4">

                       
                       {/* Categoria */}
                       <div className="text-xs text-white/70">
                         {test.category}
                       </div>
                     </div>

                     {/* Botão de Ação */}
                     <div className="mt-auto">
                       <button
                         onClick={() => handleStartTest(test.id, test.name)}
                         className="w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm text-sm"
                       >
                         {test.status === 'completed' ? (
                           <>
                             <Trophy className="h-4 w-4" />
                             Iniciar Teste
                           </>
                         ) : test.status === 'in_progress' ? (
                           <>
                             <Play className="h-4 w-4" />
                             Iniciar Teste
                           </>
                         ) : (
                           <>
                             <Play className="h-4 w-4" />
                             Iniciar Teste
                           </>
                         )}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             )
           })}
         </div>

         {/* Informações Adicionais */}
         {tests.length > 0 && (
           <div className="mt-12 bg-green-50 rounded-xl p-6 border border-green-200">
             <div className="flex items-start gap-4">
               <div className="p-2 bg-green-100 rounded-lg">
                 <Lightbulb className="h-5 w-5 text-green-600" />
               </div>
               <div>
                 <h3 className="font-semibold text-green-900 mb-2">Dicas para os Testes</h3>
                 <ul className="text-green-800 text-sm space-y-1">
                   <li>• Responda com honestidade para obter resultados mais precisos</li>
                   <li>• Reserve um tempo adequado para completar cada teste</li>
                   <li>• Escolha um ambiente tranquilo e sem distrações</li>
                   <li>• Não há respostas certas ou erradas, apenas diferentes perspectivas</li>
                 </ul>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
    )
   }