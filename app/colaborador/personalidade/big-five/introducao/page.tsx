'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Brain, 
  Users, 
  Timer, 
  Target, 
  Play,
  Lightbulb,
  Heart,
  Shield,
  Eye,
  CheckCircle
} from 'lucide-react'

export default function BigFiveIntroducaoPage() {
  const router = useRouter()

  const statistics = [
    {
      icon: Users,
      number: '50.000+',
      label: 'Pessoas Avaliadas'
    },
    {
      icon: Target,
      number: '500+',
      label: 'Empresas Parceiras'
    },
    {
      icon: CheckCircle,
      number: '95%',
      label: 'Precisão Diagnóstica'
    },
    {
      icon: Timer,
      number: '18 min',
      label: 'Duração'
    }
  ]

  const dimensions = [
    {
      icon: Eye,
      title: 'Abertura à Experiência',
      description: 'Avaliação da curiosidade, criatividade e abertura para novas experiências',
      color: 'bg-teal-500',
      textColor: 'text-teal-500'
    },
    {
      icon: Target,
      title: 'Conscienciosidade',
      description: 'Análise da organização, disciplina e orientação para objetivos',
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Extroversão',
      description: 'Medição da sociabilidade, energia e busca por estimulação',
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      icon: Heart,
      title: 'Amabilidade',
      description: 'Avaliação da cooperação, confiança e orientação prosocial',
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    {
      icon: Shield,
      title: 'Neuroticismo',
      description: 'Análise da estabilidade emocional e tendência ao estresse',
      color: 'bg-red-500',
      textColor: 'text-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="text-sm text-teal-200">
            Testes de Personalidade
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            HumaniQ Big Five
          </h1>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Teste de Personalidade
          </p>
          <p className="text-lg text-teal-200 max-w-3xl mx-auto leading-relaxed">
            Avaliação científica dos cinco grandes fatores de personalidade com precisão excepcional e insights comportamentais avançados.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="p-4 bg-white/10 rounded-full w-fit mx-auto mb-4 backdrop-blur-sm">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm text-teal-200">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Dimensions Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${dimension.color} rounded-xl`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-white">
                        {dimension.title}
                      </h3>
                      <p className="text-teal-200 text-sm leading-relaxed">
                        {dimension.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Dimensões Avaliadas</h2>
            <p className="text-teal-200 max-w-2xl mx-auto">
              Análise multidimensional dos traços de personalidade com metodologia científica avançada
            </p>
          </div>
        </div>

        {/* Scientific Content Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Conteúdo Científico</h3>
                  <p className="text-teal-200 text-sm">Base Científica</p>
                </div>
              </div>
              
              <div className="space-y-4 text-teal-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed">
                    O que é o HumaniQ Big Five?
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed">
                    Base Científica
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed">
                    Cinco Dimensões de Personalidade
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed">
                    Aplicações Práticas
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-16 h-16 text-teal-300" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">BIG FIVE</h4>
              <p className="text-teal-200 text-sm">
                O Teste de Personalidade Big Five é um instrumento
                desenvolvido especificamente para avaliar os cinco grandes fatores de personalidade,
                fornecendo insights profundos sobre padrões comportamentais e características individuais.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/colaborador/personalidade/big-five?start=true')}
            className="bg-white text-teal-700 hover:bg-gray-100 font-bold py-4 px-12 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar Teste
          </Button>
        </div>
      </div>
    </div>
  )
}