'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Play, Clock, Brain, Target, Calculator, Zap, Eye, BookOpen, Award, AlertTriangle, CheckCircle, Info, Focus, Timer, Shield, Lightbulb, ArrowRight, Users, Star, TrendingUp, Activity, Sparkles, Layers, BarChart3, PieChart, LineChart, Gauge, Building, Heart, UserCheck, Briefcase, MessageSquare, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

export default function HumaniqInsightIntroducaoPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  const handleStartTest = () => {
    setIsLoading(true)
    router.push('/colaborador/psicossociais/humaniq-insight')
  }

  const dimensions = [
    {
      name: "Segurança Psicológica",
      icon: Shield,
      description: "Avalia o nível de conforto dos colaboradores para expressar opiniões, cometer erros e buscar ajuda sem medo de represálias.",
      examples: ["Liberdade para expressar opiniões", "Apoio em caso de erros", "Ambiente de diálogo aberto"]
    },
    {
      name: "Comunicação Interna",
      icon: MessageSquare,
      description: "Mede a eficácia dos canais de comunicação, transparência das informações e qualidade do feedback.",
      examples: ["Clareza nas informações", "Feedback construtivo", "Comunicação transparente"]
    },
    {
      name: "Pertencimento e Inclusão",
      icon: Heart,
      description: "Avalia o senso de pertencimento, conexão com valores organizacionais e inclusão nas decisões.",
      examples: ["Valorização da contribuição", "Conexão com valores", "Inclusão nas decisões"]
    },
    {
      name: "Justiça Organizacional",
      icon: Scale,
      description: "Mede a percepção de equidade, transparência nas políticas e justiça nos processos organizacionais.",
      examples: ["Aplicação justa de políticas", "Reconhecimento adequado", "Transparência nas decisões"]
    }
  ]

  const benefits = [
    {
      title: "Rápido",
      description: "Aplicação em até 20 minutos",
      metric: "15-20 min",
      icon: Zap,
      color: "from-green-400 to-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      textColor: "text-green-800"
    },
    {
      title: "Preciso",
      description: "Baseado em metodologia científica",
      metric: "95% precisão",
      icon: Target,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-800"
    },
    {
      title: "Confiável",
      description: "Validado cientificamente",
      metric: "α > 0.85",
      icon: Shield,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-800"
    },
    {
      title: "Científico",
      description: "Fundamentação teórica sólida",
      metric: "100+ estudos",
      icon: Award,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      textColor: "text-orange-800"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white mb-2">
                  HumaniQ Insight
                </h1>
                <p className="text-xl text-blue-200 font-medium">
                  Clima Organizacional e Bem-Estar Psicológico
                </p>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Avaliação científica do clima organizacional para mensurar capacidades psicossociais fundamentais com precisão psicométrica e insights acionáveis
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {dimensions.map((dimension, index) => (
                <Badge 
                  key={dimension.name}
                  variant="secondary" 
                  className="bg-white/10 text-white border-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                >
                  {dimension.name}
                </Badge>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="max-w-6xl mx-auto px-6 -mt-8 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Colaboradores", value: "50.000+", icon: Users },
            { label: "Empresas Atendidas", value: "500+", icon: Building },
            { label: "Precisão Diagnóstica", value: "95%", icon: Target },
            { label: "Tempo Médio", value: "18 min", icon: Clock }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 text-center p-6">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                onMouseEnter={() => setHoveredBenefit(index)}
                onMouseLeave={() => setHoveredBenefit(null)}
                className="relative group cursor-pointer h-full"
              >
                <div className={`${benefit.bgColor} h-full flex flex-col justify-between rounded-2xl p-6 border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg ${benefit.textColor} mb-2`}>{benefit.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                  <div className={`text-2xl font-bold ${benefit.textColor}`}>{benefit.metric}</div>
                </div>
                {hoveredBenefit === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl border-2 border-white/50 pointer-events-none"
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Dimensions Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Dimensões Avaliadas</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Análise multidimensional das capacidades cognitivas com metodologia científica avançada
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {dimensions.map((dimension, index) => {
            const Icon = dimension.icon
            return (
              <motion.div
                key={dimension.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + index * 0.2 }}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${index === 0 ? 'from-purple-500 to-violet-600' : index === 1 ? 'from-blue-500 to-indigo-600' : index === 2 ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-600'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-2 group-hover:text-blue-200 transition-colors">
                          {dimension.name}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Dimensão {index + 1}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-blue-100 mb-4 leading-relaxed">
                      {dimension.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-blue-200 font-medium">Exemplos avaliados:</p>
                      <div className="flex flex-wrap gap-2">
                        {dimension.examples.map((example, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs bg-white/5 text-blue-200 border-white/20"
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Circular Logo Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.0 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-sm">
                INSIGHT
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scientific Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">Base Científica</CardTitle>
                <p className="text-blue-200">Fundamentação teórica e metodológica</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Fundamentação Teórica</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  O HumaniQ Insight baseia-se em décadas de pesquisa em psicologia organizacional, incorporando os modelos mais reconhecidos de clima organizacional.
                </p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Fundamentado nas teorias de Segurança Psicológica (Amy Edmondson), Comunicação Organizacional e Justiça Organizacional.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Metodologia</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  Utiliza escala de concordância de 5 pontos para avaliar percepções sobre aspectos psicossociais do ambiente de trabalho.
                </p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Análise multidimensional que gera índice geral de clima organizacional e alertas para áreas críticas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Testes
          </Button>
          <Button 
            onClick={handleStartTest}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Carregando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Iniciar Teste Insight
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="max-w-6xl mx-auto px-6 pb-16"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-8 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>15-20 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Clima Organizacional</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Validação Científica</span>
            </div>
          </div>
          <p className="text-blue-300 text-xs">
            © 2024 HumaniQ AI - Todos os direitos reservados
          </p>
        </div>
      </motion.div>
    </div>
  )
}