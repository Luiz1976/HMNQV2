'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Brain, Users, Target, Clock, CheckCircle, Zap, Shield, Lightbulb, Award, TrendingUp, Heart, DollarSign } from 'lucide-react'

export default function MotivacaoIntroducao() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartTest = async () => {
    setIsStarting(true)
    // Simular carregamento
    setTimeout(() => {
      router.push('/colaborador/personalidade/motiva?start=true')
    }, 1000)
  }

  const handleBack = () => {
    router.push('/colaborador/personalidade')
  }

  const stats = [
    { icon: Users, value: '50.000+', label: 'Pessoas Avaliadas' },
    { icon: Target, value: '500+', label: 'Empresas Parceiras' },
    { icon: CheckCircle, value: '95%', label: 'Precisão Diagnóstica' },
    { icon: Clock, value: '15 min', label: 'Duração' }
  ]

  const dimensions = [
    {
      icon: Brain,
      title: 'Autonomia e Liberdade',
      description: 'Avaliação da necessidade de independência e controle sobre o próprio trabalho.',
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      icon: Award,
      title: 'Reconhecimento e Validação',
      description: 'Análise da importância do reconhecimento público e valorização social.',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      icon: TrendingUp,
      title: 'Crescimento e Desenvolvimento',
      description: 'Medição da orientação para aprendizado contínuo e evolução profissional.',
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'Segurança e Estabilidade',
      description: 'Avaliação da necessidade de previsibilidade e estabilidade no trabalho.',
      color: 'bg-gray-500',
      textColor: 'text-gray-500'
    },
    {
      icon: Heart,
      title: 'Propósito e Contribuição',
      description: 'Análise da importância do significado e impacto social do trabalho.',
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      icon: DollarSign,
      title: 'Recompensa Financeira',
      description: 'Medição da importância de benefícios financeiros e recompensas materiais.',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500'
    },
    {
      icon: Users,
      title: 'Relacionamentos e Clima',
      description: 'Avaliação da importância das relações interpessoais no ambiente de trabalho.',
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Desafios e Inovação',
      description: 'Análise da necessidade de novidade, desafios e oportunidades de inovação.',
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-2">Voltar</span>
          </Button>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            Teste de Personalidade
          </Badge>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HumaniQ MOTIVA
          </h1>
          
          <p className="text-xl text-green-100 mb-2">
            Perfil de Motivação Profissional
          </p>
          
          <p className="text-green-200 max-w-2xl mx-auto mb-8">
            Avaliação científica do sistema gerencial com foco fundamental em processos empresariais e insights
            avançados.
          </p>

          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
              Ciência Comportamental
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
              Avaliação Cognitiva
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
              Metodologia de Desenvolvimento
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
              Controle Individual
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-green-200">{stat.label}</div>
              </div>
            )
          })}        </div>

        {/* Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {dimensions.map((dimension, index) => {
            const IconComponent = dimension.icon
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${dimension.color} rounded-lg flex-shrink-0`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${dimension.textColor} mb-2`}>
                    {dimension.title}
                  </h3>
                  <p className="text-green-200 text-sm leading-relaxed">
                    {dimension.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dimensions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Dimensões Avaliadas
          </h2>
          <p className="text-green-200 text-center mb-12 max-w-3xl mx-auto">
            Análise multidimensional das capacidades motivacionais com metodologia científica avançada
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon
              return (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${dimension.color} rounded-lg mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-2 text-sm">
                        {dimension.title}
                      </h3>
                      <p className="text-green-200 text-xs leading-relaxed mb-3">
                        {dimension.description}
                      </p>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        Científico
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* MOTIVA Logo */}
          <div className="flex justify-center mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">
                MOTIVA
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              Conteúdo Científico
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-200 text-sm">
                  O que é o HumaniQ MOTIVA?
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-200 text-sm">
                  Base Científica
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-200 text-sm">
                  Dimensões Avaliadas
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Brain className="h-4 w-4 text-white" />
              </div>
              O que é o HumaniQ MOTIVA?
            </h3>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              O HumaniQ MOTIVA é um instrumento psicométrico desenvolvido para
              avaliar os principais fatores motivacionais de colaboradores e candidatos,
              identificando os elementos que mais impactam desempenho, engajamento
              e satisfação no ambiente de trabalho.
            </p>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              <strong>Base Científica:</strong> Teoria da Autodeterminação (Deci & Ryan, 1985),
              Modelo dos 6 Fatores Motivacionais de Reiss (2000), Teoria de Herzberg (1959),
              Modelo DISC aplicado à motivação, Gallup Q12 adaptado e estudos contemporâneos
              de Employee Experience (EX) e People Analytics.
            </p>
            <p className="text-green-200 text-sm leading-relaxed">
              O teste avalia 8 dimensões motivacionais através de 40 questões (5 por dimensão)
              em escala Likert de 5 pontos, proporcionando insights precisos para
              desenvolvimento profissional e estratégias organizacionais personalizadas.
            </p>
          </div>
        </div>

        {/* Start Test Button */}
        <div className="text-center">
          <Button
            onClick={handleStartTest}
            disabled={isStarting}
            size="lg"
            className="bg-white text-green-800 hover:bg-green-50 px-12 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            {isStarting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-green-800 border-t-transparent rounded-full animate-spin"></div>
                <span>Iniciando...</span>
              </div>
            ) : (
              'Iniciar Teste'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}