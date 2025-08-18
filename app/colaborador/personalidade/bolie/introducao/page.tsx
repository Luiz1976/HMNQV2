'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, Target, BookOpen, CheckCircle, Play, Brain, Heart, Shield, Zap, Smile, TrendingUp, Award, Timer } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BOLIEIntroducaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartTest = async () => {
    setIsLoading(true)
    
    try {
      // Marcar que o usuário viu a introdução
      localStorage.setItem('bolie_intro_viewed', 'true')
      
      // Redirecionar para o teste
      router.push('/colaborador/personalidade/bolie')
    } catch (error) {
      console.error('Erro ao iniciar teste:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/colaborador/personalidade')
  }

  const dimensions = [
    {
      name: 'Atenção Sustentada',
      description: 'Avaliação da capacidade de manter foco prolongado',
      icon: Target,
      color: 'bg-emerald-500',
      badge: 'Concentração'
    },
    {
      name: 'Velocidade de Processamento',
      description: 'Análise da rapidez de processamento cognitivo',
      icon: Zap,
      color: 'bg-blue-500',
      badge: 'Agilidade Mental'
    },
    {
      name: 'Controle Inibitório',
      description: 'Medição da capacidade de controle cognitivo inibitório',
      icon: Shield,
      color: 'bg-purple-500',
      badge: 'Autocontrole'
    },
    {
      name: 'Flexibilidade Cognitiva',
      description: 'Medição da adaptabilidade mental e flexibilidade de tarefas',
      icon: Brain,
      color: 'bg-orange-500',
      badge: 'Adaptabilidade'
    }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
      {/* Header */}
      <div className="bg-emerald-800/50 backdrop-blur-sm border-b border-emerald-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-emerald-100 hover:text-white hover:bg-emerald-700/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="text-emerald-100 text-sm">
              Testes de Personalidade
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-2xl mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            HumaniQ BOLIE
          </h1>
          <p className="text-xl text-emerald-100 mb-6 max-w-4xl mx-auto">
            Teste de Atenção e Raciocínio
          </p>
          <p className="text-emerald-200 mb-8 max-w-4xl mx-auto">
            Avaliação científica de última geração para mensurar capacidades cognitivas fundamentais com precisão excepcional e insights acionáveis.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-100 border-emerald-500/30 px-4 py-2">
              Ciência Sustentável
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-100 border-emerald-500/30 px-4 py-2">
              Avaliação Lógica
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-100 border-emerald-500/30 px-4 py-2">
              Metodologia de Processamento
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-100 border-emerald-500/30 px-4 py-2">
              Controle Individual
            </Badge>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">50.000+</div>
              <div className="text-sm text-emerald-200">Pessoas Avaliadas</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-emerald-200">Empresas Parceiras</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Award className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-emerald-200">Precisão Diagnóstica</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Timer className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">25 min</div>
              <div className="text-sm text-emerald-200">Duração</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimension Cards Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {dimensions.map((dimension, index) => {
            const IconComponent = dimension.icon
            return (
              <motion.div
                key={dimension.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${dimension.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{dimension.name}</h3>
                <div className="text-emerald-200 text-sm mb-2">{dimension.description}</div>
                <div className="text-emerald-300 text-xs font-medium">
                  α &gt; 0.85
                </div>
                <div className="text-emerald-400 text-xs">
                  100+ estudos
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Evaluated Dimensions Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Dimensões Avaliadas</h2>
            <p className="text-emerald-100 max-w-4xl mx-auto text-lg">
              Análise multidimensional das capacidades cognitivas com metodologia científica avançada
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {dimensions.map((dimension, index) => {
                const IconComponent = dimension.icon
                return (
                  <motion.div
                    key={dimension.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-emerald-800/20 border border-emerald-600/30 rounded-xl p-6 backdrop-blur-sm hover:bg-emerald-800/30 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${dimension.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{dimension.name}</h3>
                        <p className="text-emerald-200 mb-3">{dimension.description}</p>
                        <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 text-xs">
                          {dimension.badge}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-emerald-700/40 to-emerald-800/40 rounded-full flex items-center justify-center border-4 border-emerald-500/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
                <div className="text-center relative z-10">
                  <Brain className="h-20 w-20 text-emerald-300 mx-auto mb-6" />
                  <div className="text-4xl font-bold text-white mb-2">BOLIE</div>
                  <div className="w-20 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scientific Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="space-y-6">
            <Card className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Conteúdo Científico</h3>
                </div>
                <div className="space-y-4 text-emerald-100">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>O que é o HumaniQ BOLIE?</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Base Científica</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Dimensões Avaliadas</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Aplicações Práticas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">i</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">O que é o HumaniQ BOLIE?</h3>
                </div>
                <div className="space-y-4 text-emerald-100">
                  <p>
                    O Teste de Atenção e Raciocínio (BOLIE) é um instrumento psicométrico desenvolvido para 
                    avaliar as capacidades cognitivas fundamentais relacionadas à atenção sustentada e ao 
                    controle inibitório.
                  </p>
                  <p>
                    Baseado em décadas de pesquisa em psicologia cognitiva, o BOLIE mensura a capacidade de 
                    manter o foco atencional e processar informações de forma eficiente sob pressão temporal.
                  </p>
                  <p>
                    Este teste é amplamente utilizado em contextos organizacionais para identificar profissionais 
                    com alta capacidade de concentração e raciocínio analítico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Start Test Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={handleStartTest}
            disabled={isLoading}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Iniciando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Play className="h-6 w-6" />
                <span>Iniciar Teste</span>
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}