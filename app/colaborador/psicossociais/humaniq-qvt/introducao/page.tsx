'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Clock, Users, Target, TrendingUp, Heart, Shield, CheckCircle, Scale, Brain, Award, Activity, Zap, Sparkles, BarChart3, Star, Eye, BookOpen, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

export default function HumaniqQVTIntroduction() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(featureTimer)
  }, [])

  const qvtDimensions = [
    {
      name: 'Satisfação com a Função',
      icon: Target,
      color: 'text-emerald-600',
      description: 'Valorização, propósito, autonomia e reconhecimento no trabalho',
      questions: 10,
      examples: ['Propósito no trabalho', 'Autonomia nas decisões', 'Reconhecimento profissional']
    },
    {
      name: 'Relação com Liderança',
      icon: Users,
      color: 'text-blue-600',
      description: 'Comunicação, respeito, apoio e feedback da liderança',
      questions: 10,
      examples: ['Comunicação clara', 'Apoio da chefia', 'Feedback construtivo']
    },
    {
      name: 'Estrutura e Condições',
      icon: Shield,
      color: 'text-purple-600',
      description: 'Condições físicas, recursos e ambiente de trabalho',
      questions: 10,
      examples: ['Ambiente físico', 'Recursos adequados', 'Segurança no trabalho']
    },
    {
      name: 'Recompensas e Remuneração',
      icon: TrendingUp,
      color: 'text-orange-600',
      description: 'Remuneração justa, benefícios e reconhecimento financeiro',
      questions: 10,
      examples: ['Salário justo', 'Benefícios adequados', 'Plano de carreira']
    },
    {
      name: 'Equilíbrio Vida-Trabalho',
      icon: Heart,
      color: 'text-red-600',
      description: 'Harmonia entre demandas profissionais e vida pessoal',
      questions: 10,
      examples: ['Flexibilidade de horários', 'Tempo para família', 'Gestão do estresse']
    }
  ]

  const benefits = [
    { 
      icon: Clock, 
      title: "Rápido", 
      description: "Aplicação em 15-20 minutos",
      metric: "15-20 min",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      icon: Target, 
      title: "Preciso", 
      description: "Alta validade diagnóstica",
      metric: "95% precisão",
      color: "from-blue-500 to-indigo-600"
    },
    { 
      icon: Award, 
      title: "Confiável", 
      description: "Metodologia científica validada",
      metric: "α > 0.85",
      color: "from-purple-500 to-violet-600"
    },
    { 
      icon: BarChart3, 
      title: "Científico", 
      description: "Base teórica sólida",
      metric: "100+ estudos",
      color: "from-orange-500 to-red-600"
    }
  ]

  const statistics = [
    { label: "Colaboradores Avaliados", value: "25.000+", icon: Users },
    { label: "Empresas Parceiras", value: "300+", icon: Award },
    { label: "Precisão Diagnóstica", value: "95%", icon: Target },
    { label: "Tempo Médio", value: "18 min", icon: Clock }
  ]

  const handleStartTest = () => {
    setIsLoading(true)
    sessionStorage.setItem('humaniq-qvt-introduction-seen', 'true')
    setTimeout(() => {
      router.push('/colaborador/psicossociais/humaniq-qvt')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl">
                  <Heart className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent mb-2">
                  HumaniQ QVT
                </h1>
                <p className="text-2xl text-emerald-200 font-light">Qualidade de Vida no Trabalho</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <p className="text-xl text-blue-100 leading-relaxed mb-6">
                Avaliação científica multidimensional para mensurar a qualidade de vida no trabalho 
                com precisão excepcional e insights acionáveis para o bem-estar organizacional.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Satisfação Profissional', 'Liderança', 'Ambiente de Trabalho', 'Recompensas', 'Equilíbrio'].map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm backdrop-blur-sm"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Statistics Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              {statistics.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <Icon className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-blue-200">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  onMouseEnter={() => setHoveredBenefit(index)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-blue-200 text-sm mb-3">{benefit.description}</p>
                    <div className="text-2xl font-bold text-emerald-300">{benefit.metric}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Dimensions Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Dimensões Avaliadas</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Análise multidimensional das capacidades de qualidade de vida com metodologia científica avançada
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Column - Dimensions List */}
              <div className="space-y-4">
                {qvtDimensions.map((dimension, index) => {
                  const Icon = dimension.icon
                  const isActive = activeFeature === index
                  return (
                    <motion.div
                      key={dimension.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                        isActive 
                          ? 'bg-white/20 border-emerald-400/50 shadow-2xl' 
                          : 'bg-white/10 border-white/20 hover:bg-white/15'
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg' 
                            : 'bg-white/10'
                        }`}>
                          <Icon className={`w-6 h-6 transition-colors duration-300 ${
                            isActive ? 'text-white' : dimension.color
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                            isActive ? 'text-emerald-300' : 'text-white'
                          }`}>
                            {dimension.name}
                          </h3>
                          <p className="text-blue-200 text-sm mb-3">{dimension.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {dimension.examples.map((example) => (
                              <Badge 
                                key={example}
                                variant="outline" 
                                className={`text-xs transition-all duration-300 ${
                                  isActive 
                                    ? 'text-emerald-300 border-emerald-300/50 bg-emerald-500/10' 
                                    : 'text-blue-300 border-blue-300/30'
                                }`}
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className={`text-2xl font-bold transition-colors duration-300 ${
                          isActive ? 'text-emerald-300' : 'text-white/60'
                        }`}>
                          {dimension.questions}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-b-2xl"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Right Column - Visual Representation */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.3 }}
                className="flex items-center justify-center"
              >
                <div className="relative w-80 h-80">
                  {/* Central Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                      <div className="text-center">
                        <Heart className="w-8 h-8 text-white mx-auto mb-1" />
                        <div className="text-white font-bold text-sm">QVT</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.83} 283`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scientific Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Conteúdo Científico</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Fundamentação teórica sólida e validação psicométrica rigorosa
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.7 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">O que é HumaniQ QVT?</h3>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">
                  O Teste de Qualidade de Vida no Trabalho (QVT) é um instrumento psicométrico desenvolvido para 
                  avaliar múltiplas dimensões do bem-estar organizacional, fornecendo insights precisos sobre 
                  satisfação e engajamento profissional.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.9 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Base Científica</h3>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Fundamentado nos modelos clássicos de Walton (1973) e Hackman & Oldham (1976), 
                  incorporando diretrizes da ISO 45001 para saúde ocupacional e validado com 
                  rigorosos critérios psicométricos.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Dimensões Avaliadas</h3>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Avalia cinco dimensões críticas: Satisfação com a Função, Relação com Liderança, 
                  Estrutura e Condições de Trabalho, Recompensas e Remuneração, e Equilíbrio Vida-Trabalho.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Características Avaliadas</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Satisfação e propósito profissional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Qualidade das relações interpessoais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Condições e ambiente de trabalho</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Sistema de recompensas e reconhecimento</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Níveis de Interpretação</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Excelente</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Bom</span>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Regular</span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Atenção</span>
                    <div className="flex gap-1">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.7 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Aplicações Práticas</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-blue-200 text-sm">Diagnóstico organizacional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-blue-200 text-sm">Planejamento de intervenções</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-blue-200 text-sm">Monitoramento do bem-estar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-blue-200 text-sm">Desenvolvimento de políticas</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              onClick={() => router.back()}
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 px-8 py-3"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos Testes
            </Button>
            
            <Button 
              onClick={handleStartTest}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-2xl transition-all duration-300 px-8 py-3 relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative flex items-center">
                    Iniciar Avaliação
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
  }