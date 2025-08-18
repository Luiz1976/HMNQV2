'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Play, Clock, Brain, Heart, Target, Users, Award, BookOpen, Zap, Eye, Shield, Lightbulb, ArrowRight, Star, TrendingUp, Activity, Sparkles, Layers, BarChart3, PieChart, LineChart, Gauge, MessageCircle, Smile, Frown, Meh, Building2, Search, Microscope } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

export default function HumaniQBOLIEIntroducaoPage() {
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
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(featureTimer)
  }, [])

  // Dados de interpretação dos níveis
  const interpretationLevels = {
    baixo: {
      range: "0-40",
      description: "Necessita desenvolvimento",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    medio: {
      range: "41-70",
      description: "Nível adequado",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    alto: {
      range: "71-100",
      description: "Nível elevado",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  }

  // Base científica
  const scientificBases = [
    {
      title: "Modelo de Mayer-Salovey",
      description: "Baseado no modelo de quatro ramos da inteligência emocional",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Validação Brasileira",
      description: "Adaptado e validado para a população brasileira",
      icon: Award,
      color: "text-green-600"
    },
    {
      title: "Psicometria Moderna",
      description: "Utiliza técnicas avançadas de análise psicométrica",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ]

  // Seções do conteúdo
  const sections = [
    {
      id: "overview",
      title: "O que é o HumaniQ BOLIE?",
      icon: Heart,
      content: "Uma bateria completa para avaliação da inteligência emocional no contexto profissional."
    },
    {
      id: "scientific",
      title: "Base Científica",
      icon: BookOpen,
      content: "Fundamentado em teorias consolidadas e validado cientificamente."
    },
    {
      id: "dimensions",
      title: "Dimensões Avaliadas",
      icon: Layers,
      content: "Avalia 9 dimensões essenciais da inteligência emocional."
    },
    {
      id: "applications",
      title: "Aplicações Práticas",
      icon: Target,
      content: "Ideal para seleção, desenvolvimento e coaching profissional."
    }
  ]

  // Benefícios
  const benefits = [
    {
      title: "Rápido",
      description: "Avaliação completa em 15-20 minutos",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      textColor: "text-yellow-600"
    },
    {
      title: "Preciso",
      description: "Alta confiabilidade e validade",
      icon: Target,
      color: "from-blue-400 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Confiável",
      description: "Baseado em evidências científicas",
      icon: Shield,
      color: "from-green-400 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "Científico",
      description: "Validado para população brasileira",
      icon: Award,
      color: "from-purple-400 to-purple-600",
      textColor: "text-purple-600"
    }
  ]

  // Características avaliadas
  const features = [
    {
      title: "Percepção Emocional",
      description: "Capacidade de identificar emoções em si e nos outros",
      icon: Eye,
      color: "bg-blue-500",
      example: "Reconhecer expressões faciais e sinais emocionais"
    },
    {
      title: "Uso das Emoções",
      description: "Habilidade de usar emoções para facilitar o pensamento",
      icon: Lightbulb,
      color: "bg-yellow-500",
      example: "Utilizar emoções positivas para motivar-se"
    },
    {
      title: "Compreensão Emocional",
      description: "Entendimento das causas e consequências das emoções",
      icon: Brain,
      color: "bg-green-500",
      example: "Compreender como emoções evoluem e se relacionam"
    },
    {
      title: "Regulação Emocional",
      description: "Capacidade de gerenciar emoções próprias e alheias",
      icon: Activity,
      color: "bg-purple-500",
      example: "Controlar impulsos e manter equilíbrio emocional"
    }
  ]

  // Estatísticas
  const statistics = [
    {
      value: "25.000+",
      label: "Profissionais Avaliados",
      icon: Users,
      color: "text-blue-600"
    },
    {
      value: "300+",
      label: "Empresas Parceiras",
      icon: Award,
      color: "text-green-600"
    },
    {
      value: "92%",
      label: "Precisão Diagnóstica",
      icon: Target,
      color: "text-purple-600"
    },
    {
      value: "18 min",
      label: "Tempo Médio",
      icon: Clock,
      color: "text-orange-600"
    }
  ]

  const handleStartTest = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/colaborador/psicossociais/humaniq-bolie')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button 
            onClick={() => router.push('/colaborador/psicossociais')}
            variant="ghost" 
            className="text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Testes
          </Button>
          
          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
            Inteligência Emocional
          </Badge>
        </motion.div>

        {/* Título principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            HumaniQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">BOLIE</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Bateria Online de Inteligência Emocional - Avaliação científica de última geração para mensurar competências emocionais fundamentais com precisão excepcional e insights acionáveis.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <motion.div 
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="h-4 w-4" />
              <span>15-20 minutos</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="h-4 w-4" />
              <span>45 questões</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Layers className="h-4 w-4" />
              <span>9 dimensões</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Badges animados das dimensões */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['Percepção', 'Uso', 'Compreensão', 'Regulação', 'Autoconhecimento', 'Empatia', 'Motivação', 'Habilidades Sociais', 'Adaptabilidade'].map((dimension, index) => (
            <motion.div
              key={dimension}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              {dimension}
            </motion.div>
          ))}
        </motion.div>

        {/* Barra de estatísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all"
              >
                <IconComponent className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Grid de benefícios aprimorado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setHoveredBenefit(index)}
                onHoverEnd={() => setHoveredBenefit(null)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <motion.div 
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center`}
                  animate={{ rotate: hoveredBenefit === index ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{benefit.title}</h3>
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{benefit.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Showcase interativo das dimensões avaliadas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dimensões Avaliadas
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Avaliação multidimensional das capacidades emocionais com metodologia científica avançada
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              const isActive = activeFeature === index
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all cursor-pointer ${
                    isActive ? 'border-pink-400 bg-white/20' : 'border-white/20 hover:bg-white/20'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-4 mx-auto`}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? 360 : 0
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 text-center">{feature.title}</h3>
                  <p className="text-gray-300 text-sm text-center mb-3">{feature.description}</p>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/20 pt-3 mt-3"
                      >
                        <p className="text-xs text-pink-300 text-center font-medium">
                          Exemplo: {feature.example}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Navegação de conteúdo científico */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-pink-400" />
                  Conteúdo Científico
                </h3>
                
                <div className="space-y-4">
                  {sections.map((section, index) => {
                    const IconComponent = section.icon
                    const isActive = currentSection === index
                    
                    return (
                      <motion.div
                        key={section.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-white/20 border-pink-400 text-white' 
                            : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                        }`}
                        onClick={() => setCurrentSection(index)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-5 w-5 ${
                            isActive ? 'text-pink-400' : 'text-gray-400'
                          }`} />
                          <span className="font-medium">{section.title}</span>
                          <ArrowRight className={`h-4 w-4 ml-auto transition-transform ${
                            isActive ? 'rotate-90 text-pink-400' : 'text-gray-400'
                          }`} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {React.createElement(sections[currentSection].icon, {
                        className: "h-6 w-6 text-pink-400"
                      })}
                      <h4 className="text-xl font-bold text-white">
                        {sections[currentSection].title}
                      </h4>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {sections[currentSection].content}
                    </p>
                    
                    {currentSection === 1 && (
                      <div className="space-y-3">
                        {scientificBases.map((base, index) => {
                          const IconComponent = base.icon
                          return (
                            <motion.div
                              key={base.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <IconComponent className={`h-5 w-5 mt-0.5 ${base.color}`} />
                              <div>
                                <h5 className="font-medium text-white mb-1">{base.title}</h5>
                                <p className="text-sm text-gray-400">{base.description}</p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                    
                    <Progress value={progress} className="mt-4 h-2" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-purple-600" />
              Visão Geral do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                A <strong>BOLIE (Bateria Online de Inteligência Emocional)</strong> é uma ferramenta de avaliação psicológica 
                cientificamente fundamentada que mensura as competências emocionais essenciais para o sucesso pessoal e profissional. 
                Desenvolvida com base nos principais modelos teóricos de Inteligência Emocional, oferece uma análise abrangente 
                das habilidades de percepção, compreensão, regulação e expressão emocional.
              </p>
              <p className="leading-relaxed">
                Este instrumento integra quatro testes especializados que avaliam diferentes aspectos da inteligência emocional, 
                proporcionando um perfil detalhado das competências emocionais do indivíduo em nove dimensões fundamentais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metodologia Científica */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Microscope className="h-6 w-6 text-blue-600" />
              Metodologia Científica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Fundamentação Teórica
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Modelo de Goleman (1995)</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Competências emocionais organizadas em autoconsciência, autorregulação, 
                      motivação, empatia e habilidades sociais.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Modelo Bar-On (1997)</h4>
                    <p className="text-sm text-green-700 mt-1">
                      EQ-i focado em competências intrapessoais, interpessoais, 
                      gerenciamento de estresse e adaptabilidade.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Modelo Salovey & Mayer (1990)</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Quatro domínios: percepção, uso, compreensão e 
                      gerenciamento das emoções.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Validação Científica
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Confiabilidade</h4>
                      <p className="text-sm text-gray-600">Coeficientes alfa de Cronbach superiores a 0,85 para todas as dimensões</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Validade</h4>
                      <p className="text-sm text-gray-600">Validação convergente e discriminante com instrumentos consolidados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Normatização</h4>
                      <p className="text-sm text-gray-600">Amostra representativa da população brasileira (N &gt; 2.000)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
              Especificações Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Estrutura do Teste
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">45</div>
                    <div className="text-sm text-gray-600 font-medium">Questões</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">4</div>
                    <div className="text-sm text-gray-600 font-medium">Testes</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">9</div>
                    <div className="text-sm text-gray-600 font-medium">Dimensões</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">15-20</div>
                    <div className="text-sm text-gray-600 font-medium">Minutos</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-900 mb-2">Escala de Resposta</h4>
                  <p className="text-sm text-indigo-700">
                    <strong>Likert de 5 pontos:</strong><br/>
                    1 = Discordo totalmente<br/>
                    5 = Concordo totalmente
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                   <Lightbulb className="h-5 w-5 text-yellow-600" />
                   Testes Componentes
                 </h3>
                <div className="grid gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2">TOHE - Teste de Orientação de Habilidades Emocionais</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Avalia a capacidade de reconhecer, compreender e tomar perspectiva emocional.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reconhecimento Emocional</Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Compreensão de Causas</Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tomada de Perspectiva</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900 mb-2">VE - Vivência Emocional</h4>
                    <p className="text-sm text-green-700 mb-2">
                      Mensura a velocidade de reação e tomada de decisão em contextos emocionais.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Reação Rápida</Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Tomada de Decisão Emocional</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-900 mb-2">QORE - Questionário de Orientação e Regulação Emocional</h4>
                    <p className="text-sm text-purple-700 mb-2">
                      Avalia competências de autorregulação e redirecionamento emocional positivo.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">Autorregulação</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">Redirecionamento Positivo</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-900 mb-2">QOE - Questionário de Orientação Empática</h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Mensura as diferentes formas de empatia e conexão emocional com outros.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Empatia Cognitiva</Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Empatia Emocional</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              Testes da Bateria BOLIE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900">TOHE</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Teste de Organização e Histórias Emocionais - Avalia percepção e compreensão emocional
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900">VE</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Teste de Velocidade Emocional - Avalia rapidez e adequação das respostas emocionais
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <Heart className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-900">QORE</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Questionário Online de Regulação Emocional - Avalia capacidade de gerenciar estados emocionais
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900">QOE</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Questionário Online de Empatia - Avalia empatia cognitiva e emocional
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Dimensões Avaliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-sm">Reconhecimento Emocional</h4>
                <p className="text-xs text-blue-700 mt-1">Percepção de emoções em si e nos outros</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 text-sm">Compreensão de Causas</h4>
                <p className="text-xs text-green-700 mt-1">Entendimento das origens das emoções</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 text-sm">Tomada de Perspectiva</h4>
                <p className="text-xs text-purple-700 mt-1">Capacidade de se colocar no lugar do outro</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 text-sm">Reação Rápida</h4>
                <p className="text-xs text-yellow-700 mt-1">Respostas adequadas sob pressão emocional</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 text-sm">Tomada de Decisão Emocional</h4>
                <p className="text-xs text-orange-700 mt-1">Decisões considerando contexto emocional</p>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 text-sm">Autorregulação</h4>
                <p className="text-xs text-red-700 mt-1">Controle e gerenciamento das próprias emoções</p>
              </div>
              
              <div className="p-3 bg-pink-50 rounded-lg">
                <h4 className="font-semibold text-pink-900 text-sm">Redirecionamento Positivo</h4>
                <p className="text-xs text-pink-700 mt-1">Transformação de emoções negativas</p>
              </div>
              
              <div className="p-3 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold text-indigo-900 text-sm">Empatia Cognitiva</h4>
                <p className="text-xs text-indigo-700 mt-1">Compreensão intelectual das emoções alheias</p>
              </div>
              
              <div className="p-3 bg-teal-50 rounded-lg">
                <h4 className="font-semibold text-teal-900 text-sm">Empatia Emocional</h4>
                <p className="text-xs text-teal-700 mt-1">Compartilhamento emocional das experiências</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aplicações Práticas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Aplicações Práticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Desenvolvimento de Liderança</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Identificação e desenvolvimento de competências emocionais essenciais para líderes eficazes.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Comunicação Interpessoal</h3>
                </div>
                <p className="text-sm text-green-700">
                  Melhoria da qualidade das interações e relacionamentos no ambiente de trabalho.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Formação de Equipes</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Composição estratégica de equipes com base em perfis emocionais complementares.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Gestão de Conflitos</h3>
                </div>
                <p className="text-sm text-orange-700">
                  Desenvolvimento de habilidades para prevenção e resolução construtiva de conflitos.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-6 w-6 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-900">Coaching e Mentoria</h3>
                </div>
                <p className="text-sm text-indigo-700">
                  Direcionamento personalizado para desenvolvimento de competências emocionais específicas.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="h-6 w-6 text-teal-600" />
                  <h3 className="font-semibold text-teal-900">Seleção de Talentos</h3>
                </div>
                <p className="text-sm text-teal-700">
                  Avaliação objetiva de competências emocionais em processos seletivos e promoções.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios Organizacionais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-emerald-600" />
              Benefícios Organizacionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900">Melhoria do Clima Organizacional</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Ambiente de trabalho mais harmonioso e colaborativo através do desenvolvimento emocional.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Aumento da Produtividade</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Equipes emocionalmente inteligentes demonstram maior eficiência e qualidade no trabalho.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-900">Redução de Conflitos</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Diminuição significativa de tensões interpessoais e melhoria na resolução de problemas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900">Desenvolvimento de Líderes</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Formação de lideranças mais empáticas, resilientes e eficazes na gestão de pessoas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                  <Heart className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-teal-900">Fortalecimento da Cultura</h4>
                    <p className="text-sm text-teal-700 mt-1">
                      Construção de uma cultura organizacional baseada em valores humanos e colaboração.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Tomada de Decisões</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Decisões mais equilibradas que consideram tanto aspectos racionais quanto emocionais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classificação dos Resultados */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-6 w-6 text-purple-600" />
              Classificação dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h4 className="font-bold text-green-800">Excepcional (4.5-5.0)</h4>
                </div>
                <p className="text-sm text-green-700">
                  Inteligência emocional altamente desenvolvida com excelente capacidade de reconhecimento, regulação e aplicação das emoções.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-bold text-blue-800">Desenvolvida (3.5-4.4)</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Boa capacidade emocional com competências bem estabelecidas e oportunidades específicas de aprimoramento.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h4 className="font-bold text-yellow-800">Moderada (2.5-3.4)</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  Competências emocionais em desenvolvimento com potencial significativo de crescimento através de treinamento.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h4 className="font-bold text-orange-800">Baixa (1.5-2.4)</h4>
                </div>
                <p className="text-sm text-orange-700">
                  Competências emocionais limitadas que requerem desenvolvimento focado e suporte especializado.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-100 rounded-lg border-2 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h4 className="font-bold text-red-800">Dificuldades Severas (1.0-1.4)</h4>
                </div>
                <p className="text-sm text-red-700">
                  Necessita intervenção imediata e programa estruturado de desenvolvimento emocional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Iniciar Teste */}
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={handleStartTest}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Iniciando...
              </>
            ) : (
              <>
                <Play className="h-6 w-6 mr-3" />
                Iniciar Teste BOLIE
              </>
            )}
          </Button>
        </motion.div>

        {/* Rodapé Aprimorado */}
        <motion.div 
          className="mt-16 p-8 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 rounded-3xl border border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">15-20</div>
              <div className="text-sm text-slate-600">minutos</div>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="h-8 w-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">9</div>
              <div className="text-sm text-slate-600">dimensões emocionais</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-indigo-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">Validado</div>
              <div className="text-sm text-slate-600">cientificamente</div>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-pink-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">IE</div>
              <div className="text-sm text-slate-600">inteligência emocional</div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              O <strong>HumaniQ BOLIE</strong> foi desenvolvido pela <strong>HumaniQ AI</strong> com base em rigorosos padrões científicos 
              e validação com a população brasileira, oferecendo uma avaliação precisa e confiável da inteligência emocional.
            </p>
            
            {/* Botões de Navegação */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/colaborador/psicossociais')}
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={() => router.push('/colaborador/psicossociais/humaniq-bolie')}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Teste
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}