'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Crown, Target, Users, Brain, Command, Zap, TrendingUp, Heart, Clock, FileText, Shield, CheckCircle, Award, BarChart3, Timer, Percent, BookOpen, Focus, Lightbulb, Activity, Sparkles, Layers, Star, Eye, Play, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

export default function HumaniqLideraIntroduction() {
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

  const dimensions = [
    { name: "Liderança Visionária", icon: Target, description: "Capacidade de inspirar com visão de futuro e direcionamento estratégico", color: "bg-emerald-500" },
    { name: "Liderança Coaching", icon: Users, description: "Desenvolvimento de pessoas e maximização de talentos individuais", color: "bg-blue-500" },
    { name: "Liderança Estratégica", icon: TrendingUp, description: "Visão sistêmica e pensamento estratégico organizacional", color: "bg-purple-500" },
    { name: "Inteligência Emocional", icon: Heart, description: "Autoconhecimento e gestão emocional eficaz", color: "bg-orange-500" }
  ]

  const interpretationLevels = [
    {
      range: '80-100 pontos',
      level: 'Liderança Excepcional',
      description: 'Competências de liderança altamente desenvolvidas',
      color: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20'
    },
    {
      range: '65-79 pontos',
      level: 'Liderança Forte',
      description: 'Boas competências de liderança com potencial de crescimento',
      color: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
    },
    {
      range: '50-64 pontos',
      level: 'Liderança em Desenvolvimento',
      description: 'Competências básicas presentes, necessita desenvolvimento',
      color: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
    },
    {
      range: '35-49 pontos',
      level: 'Potencial de Liderança',
      description: 'Algumas competências identificadas, requer capacitação',
      color: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
    }
  ]

  const statistics = [
    { label: "Líderes Avaliados", value: "25.000+", icon: Users },
    { label: "Organizações Parceiras", value: "300+", icon: Award },
    { label: "Precisão Diagnóstica", value: "92%", icon: Target },
    { label: "Tempo Médio", value: "20 min", icon: Clock }
  ]

  const benefits = [
    { 
      icon: Clock, 
      title: "Rápido", 
      description: "Aplicação em 15-20 minutos",
      metric: "15-20 min",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    { 
      icon: Target, 
      title: "Preciso", 
      description: "Alta validade preditiva",
      metric: "95% precisão",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    { 
      icon: Award, 
      title: "Confiável", 
      description: "Índices psicométricos robustos",
      metric: "α > 0.85",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    { 
      icon: Brain, 
      title: "Científico", 
      description: "Base teórica sólida",
      metric: "100+ estudos",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ]

  const features = [
    {
      icon: Target,
      title: "Liderança Visionária",
      description: "Capacidade de inspirar e direcionar equipes com visão de futuro",
      stats: "Visão estratégica"
    },
    {
      icon: Users,
      title: "Liderança Coaching",
      description: "Desenvolvimento e maximização do potencial das pessoas",
      stats: "Desenvolvimento humano"
    },
    {
      icon: TrendingUp,
      title: "Liderança Estratégica",
      description: "Pensamento sistêmico e planejamento organizacional",
      stats: "Visão sistêmica"
    },
    {
      icon: Heart,
      title: "Inteligência Emocional",
      description: "Autoconhecimento e gestão emocional para liderança eficaz",
      stats: "Competência emocional"
    }
  ]

  const sections = [
    {
      title: "O que é o HumaniQ LIDERA?",
      icon: Brain,
      content: [
        "O Teste de Liderança e Competências (LIDERA) é um instrumento psicométrico desenvolvido para avaliar as capacidades fundamentais de liderança relacionadas à visão estratégica, desenvolvimento de pessoas e inteligência emocional.",
        "Baseado em décadas de pesquisa em psicologia organizacional e liderança, o LIDERA mensura a capacidade de inspirar, desenvolver e liderar equipes de forma eficaz em diferentes contextos organizacionais.",
        "Este teste é amplamente utilizado em contextos corporativos para identificar e desenvolver líderes com alto potencial de impacto organizacional."
      ]
    },
    {
      title: "Base Científica",
      icon: BookOpen,
      content: [
        "O LIDERA fundamenta-se nas teorias contemporâneas de liderança transformacional e nas competências de liderança do século XXI.",
        "Estudos neuropsicológicos demonstram que as habilidades avaliadas pelo LIDERA correlacionam-se com a atividade do córtex pré-frontal e áreas relacionadas à empatia e tomada de decisão.",
        "A validação do instrumento foi realizada com amostras representativas de líderes brasileiros, apresentando índices de confiabilidade superiores a 0,85."
      ]
    },
    {
      title: "Dimensões Avaliadas",
      icon: Target,
      content: [
        "**Liderança Visionária**: Capacidade de criar e comunicar uma visão inspiradora de futuro que mobiliza e direciona equipes.",
        "**Liderança Coaching**: Habilidade de desenvolver pessoas, identificar potenciais e maximizar o desempenho individual e coletivo.",
        "**Liderança Estratégica**: Competência para pensar sistemicamente, planejar a longo prazo e tomar decisões estratégicas eficazes.",
        "**Inteligência Emocional**: Capacidade de autoconhecimento, autorregulação emocional e gestão das emoções em contextos de liderança."
      ]
    },
    {
      title: "Aplicações Práticas",
      icon: Users,
      content: [
        "**Seleção de Líderes**: Identificação de candidatos com perfil de liderança adequado para posições estratégicas.",
        "**Desenvolvimento de Liderança**: Mapeamento de competências para programas de capacitação e desenvolvimento de líderes.",
        "**Avaliação de Potencial**: Compreensão dos fatores de liderança que influenciam o desempenho organizacional.",
        "**Sucessão Organizacional**: Baseline para programas de sucessão e identificação de talentos de alta performance."
      ]
    }
  ]

  const handleStartTest = () => {
    setIsLoading(true)
    // Marcar que o usuário viu a introdução
    sessionStorage.setItem('humaniq-lidera-introduction-seen', 'true')
    setTimeout(() => {
      router.push('/colaborador/psicossociais/humaniq-lidera')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 py-8"
      >
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/colaborador/psicossociais')}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Testes
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-8 shadow-2xl"
          >
            <Crown className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
          >
            HumaniQ LIDERA
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-purple-100 mb-4 font-medium"
          >
            Teste de Liderança e Competências
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed"
          >
            Avaliação científica de última geração para mensurar capacidades de liderança fundamentais com precisão excepcional e insights acionáveis.
          </motion.p>
        </div>

        {/* Enhanced Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setHoveredBenefit(index)}
                onHoverEnd={() => setHoveredBenefit(null)}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-300 blur-xl`} />
                <Card className="relative bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${benefit.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-purple-200 mb-3">{benefit.description}</p>
                    <div className="text-xl font-bold text-white">{benefit.metric}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Statistics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {statistics.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Dimensões Avaliadas */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="relative px-6 py-16 bg-gradient-to-b from-transparent to-black/20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Dimensões Avaliadas
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Análise multidimensional das capacidades de liderança com metodologia científica avançada
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isActive = activeFeature === index
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className={`relative group cursor-pointer transition-all duration-500 ${
                      isActive ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl transition-all duration-500 ${
                      isActive ? 'opacity-100 blur-xl' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                    
                    <Card className={`relative bg-white/5 border transition-all duration-500 rounded-2xl overflow-hidden ${
                      isActive 
                        ? 'border-purple-400/50 bg-white/10 shadow-2xl shadow-purple-500/20' 
                        : 'border-white/10 hover:border-white/20 hover:bg-white/8'
                    }`}>
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 rounded-2xl transition-all duration-500 ${
                            isActive 
                              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30' 
                              : 'bg-white/10 group-hover:bg-white/15'
                          }`}>
                            <Icon className={`h-8 w-8 transition-all duration-500 ${
                              isActive ? 'text-white' : 'text-purple-200'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-3 transition-all duration-500 ${
                              isActive ? 'text-white' : 'text-purple-100'
                            }`}>
                              {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed mb-4 transition-all duration-500 ${
                              isActive ? 'text-purple-100' : 'text-purple-300'
                            }`}>
                              {feature.description}
                            </p>
                            <div className={`text-xs font-medium transition-all duration-500 ${
                              isActive ? 'text-purple-200' : 'text-purple-400'
                            }`}>
                              {feature.stats}
                            </div>
                          </div>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Rotating LIDERA Brain */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-80 h-80 border-2 border-purple-500/30 rounded-full"
                />
                
                {/* Middle rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border border-indigo-500/40 rounded-full"
                />
                
                {/* Inner pulsing circle */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-80 h-80 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-600/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 relative overflow-hidden"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    animate={{ 
                      background: [
                        'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)'
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                  />
                  
                  <div className="text-center z-10">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Crown className="h-20 w-20 text-white mx-auto mb-6 drop-shadow-2xl" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                      className="text-5xl font-bold text-white tracking-wider mb-2 drop-shadow-lg"
                    >
                      LIDERA
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="text-purple-200 text-lg font-medium"
                    >
                      Liderança & Competências
                    </motion.div>
                    
                    {/* Progress indicator */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="mt-6"
                    >
                      <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-purple-300 mt-2">Processando análise...</div>
                    </motion.div>
                  </div>
                  
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-400/60 rounded-full"
                      animate={{
                        x: [0, Math.cos(i * 60 * Math.PI / 180) * 100, 0],
                        y: [0, Math.sin(i * 60 * Math.PI / 180) * 100, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative px-6 py-20 bg-gradient-to-b from-black/20 to-black/40"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Conteúdo Científico
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Fundamentação teórica e metodológica do HumaniQ LIDERA
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Navegação do Conteúdo</h3>
                  <div className="space-y-3">
                    {sections.map((section, index) => {
                      const Icon = section.icon
                      const isActive = currentSection === index
                      return (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentSection(index)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30' 
                              : 'hover:bg-white/5 border border-transparent'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${
                              isActive ? 'text-purple-300' : 'text-purple-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isActive ? 'text-white' : 'text-purple-200'
                            }`}>
                              {section.title}
                            </span>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="activeSection"
                              className="mt-2 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Display */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm min-h-[600px]">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl">
                          {React.createElement(sections[currentSection].icon, { 
                            className: "h-6 w-6 text-purple-300" 
                          })}
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {sections[currentSection].title}
                        </h3>
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        <div className="text-purple-100 leading-relaxed space-y-4">
                          {sections[currentSection].content.map((paragraph, index) => (
                            <p key={index} className="text-purple-100">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sistema de Pontuação */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="relative px-6 py-20 bg-gradient-to-b from-black/40 to-black/60"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sistema de Pontuação
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Interpretação detalhada dos resultados e níveis de competência
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interpretationLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${level.color} group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl font-bold text-white">
                        {level.range.split('-')[0]}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">
                      {level.level}
                    </h3>
                    
                    <div className="text-sm text-purple-300 mb-3">
                      {level.range}
                    </div>
                    
                    <p className="text-xs text-purple-200 leading-relaxed">
                      {level.description}
                    </p>
                    
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${level.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(index + 1) * 25}%` }}
                        transition={{ delay: 2.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Final CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="relative px-6 py-24 bg-gradient-to-b from-black/60 to-black/80 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Pronto para Descobrir seu
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Potencial de Liderança</span>?
            </h2>
            
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Inicie sua jornada de autoconhecimento e desenvolvimento de liderança com o HumaniQ LIDERA. 
              Descubra suas competências e áreas de crescimento em apenas alguns minutos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.7, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              onClick={handleStartTest}
              size="lg" 
              className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              <div className="relative flex items-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Iniciar Teste LIDERA
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </Button>
            
            <div className="text-center sm:text-left">
              <div className="text-sm text-purple-300 mb-1">Tempo estimado</div>
              <div className="text-lg font-semibold text-white">15-20 minutos</div>
            </div>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}