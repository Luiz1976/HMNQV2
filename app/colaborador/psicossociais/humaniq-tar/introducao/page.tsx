'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Play, Clock, Brain, Target, Calculator, Zap, Eye, BookOpen, Award, AlertTriangle, CheckCircle, Info, Focus, Timer, Shield, Lightbulb, ArrowRight, Users, Star, TrendingUp, Activity, Sparkles, Layers, BarChart3, PieChart, LineChart, Gauge } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

export default function HumaniqTARIntroducaoPage() {
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

  const testParts = [
    {
      name: 'Atenção Sustentada',
      icon: Focus,
      color: 'text-purple-600',
      description: 'Capacidade de manter o foco em estímulos específicos por períodos prolongados',
      questions: 4,
      examples: ['Detecção de alvos', 'Contagem de elementos', 'Identificação de padrões']
    },
    {
      name: 'Velocidade de Processamento',
      icon: Zap,
      color: 'text-blue-600',
      description: 'Rapidez e eficiência no processamento de informações cognitivas',
      questions: 4,
      examples: ['Sequências numéricas', 'Codificação rápida', 'Cálculos mentais']
    },
    {
      name: 'Controle Inibitório',
      icon: Shield,
      color: 'text-green-600',
      description: 'Habilidade de suprimir respostas automáticas inadequadas',
      questions: 4,
      examples: ['Resistência à interferência', 'Controle de impulsos', 'Seleção de respostas']
    },
    {
      name: 'Raciocínio Lógico',
      icon: Lightbulb,
      color: 'text-orange-600',
      description: 'Capacidade de pensar de forma lógica e resolver problemas complexos',
      questions: 4,
      examples: ['Silogismos', 'Inferências lógicas', 'Resolução de problemas']
    }
  ]

  const interpretationLevels = [
    {
      range: '14-16 pontos',
      level: 'Muito Acima da Média',
      description: 'Desempenho excepcional em atenção e raciocínio',
      color: 'bg-green-100 text-green-800',
      percentage: '≥ 95º percentil'
    },
    {
      range: '11-13 pontos',
      level: 'Acima da Média',
      description: 'Bom desempenho cognitivo e atencional',
      color: 'bg-blue-100 text-blue-800',
      percentage: '75º-94º percentil'
    },
    {
      range: '8-10 pontos',
      level: 'Dentro da Média',
      description: 'Desempenho adequado nas funções avaliadas',
      color: 'bg-yellow-100 text-yellow-800',
      percentage: '25º-74º percentil'
    },
    {
      range: '5-7 pontos',
      level: 'Abaixo da Média',
      description: 'Sugere-se investigação mais detalhada',
      color: 'bg-orange-100 text-orange-800',
      percentage: '10º-24º percentil'
    },
    {
      range: '0-4 pontos',
      level: 'Avaliação Necessária',
      description: 'Procure avaliação neuropsicológica especializada',
      color: 'bg-red-100 text-red-800',
      percentage: '< 10º percentil'
    }
  ]

  const scientificBases = [
    {
      test: 'Test of Everyday Attention (TEA)',
      description: 'Bateria padrão para avaliação da atenção em contextos ecológicos',
      contribution: 'Metodologia para atenção sustentada e seletiva'
    },
    {
      test: 'Continuous Performance Test (CPT)',
      description: 'Teste clássico para avaliação da atenção sustentada',
      contribution: 'Paradigmas de detecção de alvos e controle inibitório'
    },
    {
      test: 'Stroop Color-Word Test',
      description: 'Avaliação do controle inibitório e flexibilidade cognitiva',
      contribution: 'Metodologia para interferência e controle executivo'
    },
    {
      test: 'Trail Making Test (TMT)',
      description: 'Avaliação da velocidade de processamento e flexibilidade mental',
      contribution: 'Paradigmas de conexão sequencial e alternância'
    }
  ]

  const sections = [
    {
      title: "O que é o HumaniQ TAR?",
      icon: Brain,
      content: [
        "O Teste de Atenção e Raciocínio (TAR) é um instrumento psicométrico desenvolvido para avaliar as capacidades cognitivas fundamentais relacionadas à atenção sustentada e ao raciocínio lógico.",
        "Baseado em décadas de pesquisa em psicologia cognitiva, o TAR mensura a capacidade de manter o foco atencional e processar informações de forma eficiente sob pressão temporal.",
        "Este teste é amplamente utilizado em contextos organizacionais para identificar profissionais com alta capacidade de concentração e raciocínio analítico."
      ]
    },
    {
      title: "Base Científica",
      icon: BookOpen,
      content: [
        "O TAR fundamenta-se na teoria da atenção seletiva de Broadbent e nos modelos de processamento de informação de Sternberg.",
        "Estudos neuropsicológicos demonstram que as habilidades avaliadas pelo TAR correlacionam-se com a atividade do córtex pré-frontal dorsolateral.",
        "A validação do instrumento foi realizada com amostras representativas da população brasileira, apresentando índices de confiabilidade superiores a 0,85."
      ]
    },
    {
      title: "Dimensões Avaliadas",
      icon: Target,
      content: [
        "**Atenção Sustentada**: Capacidade de manter o foco em uma tarefa por períodos prolongados sem declínio significativo no desempenho.",
        "**Velocidade de Processamento**: Rapidez com que o indivíduo processa informações visuais e toma decisões.",
        "**Controle Inibitório**: Habilidade de suprimir respostas inadequadas e manter o comportamento direcionado ao objetivo.",
        "**Flexibilidade Cognitiva**: Capacidade de alternar entre diferentes conjuntos mentais e adaptar-se a mudanças nas demandas da tarefa."
      ]
    },
    {
      title: "Aplicações Práticas",
      icon: Users,
      content: [
        "**Seleção de Pessoal**: Identificação de candidatos com perfil cognitivo adequado para funções que exigem alta concentração.",
        "**Desenvolvimento Profissional**: Mapeamento de potenciais cognitivos para programas de capacitação e desenvolvimento.",
        "**Avaliação de Desempenho**: Compreensão dos fatores cognitivos que influenciam a produtividade e qualidade do trabalho.",
        "**Reabilitação Cognitiva**: Baseline para programas de treinamento cognitivo e monitoramento de progressos."
      ]
    }
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
      icon: Activity,
      title: "Atenção Sustentada",
      description: "Medição precisa da capacidade de manter foco prolongado",
      stats: "4 dimensões avaliadas"
    },
    {
      icon: Zap,
      title: "Velocidade de Processamento",
      description: "Análise da rapidez de processamento cognitivo",
      stats: "Tempo de reação < 500ms"
    },
    {
      icon: Shield,
      title: "Controle Inibitório",
      description: "Avaliação da capacidade de suprimir respostas inadequadas",
      stats: "Precisão > 90%"
    },
    {
      icon: Layers,
      title: "Flexibilidade Cognitiva",
      description: "Medição da adaptabilidade mental e alternância de tarefas",
      stats: "Múltiplos paradigmas"
    }
  ]

  const statistics = [
    { label: "Profissionais Avaliados", value: "50.000+", icon: Users },
    { label: "Empresas Parceiras", value: "500+", icon: Award },
    { label: "Precisão Diagnóstica", value: "95%", icon: Target },
    { label: "Tempo Médio", value: "18 min", icon: Clock }
  ]

  const handleStartTest = () => {
    setIsLoading(true)
    // Marcar que o usuário viu a introdução
    sessionStorage.setItem('humaniq-tar-introduction-seen', 'true')
    setTimeout(() => {
      router.push('/colaborador/psicossociais/humaniq-tar')
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                  <Brain className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-2">
                  HumaniQ TAR
                </h1>
                <p className="text-2xl text-blue-200 font-light">Teste de Atenção e Raciocínio</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <p className="text-xl text-blue-100 leading-relaxed mb-6">
                Avaliação científica de última geração para mensurar capacidades cognitivas fundamentais 
                com precisão excepcional e insights acionáveis.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Atenção Sustentada', 'Raciocínio Lógico', 'Velocidade de Processamento', 'Controle Inibitório'].map((tag, index) => (
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
                      <Icon className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-blue-200">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Enhanced Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const isHovered = hoveredBenefit === index
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  onHoverStart={() => setHoveredBenefit(index)}
                  onHoverEnd={() => setHoveredBenefit(null)}
                  className="group cursor-pointer"
                >
                  <Card className={`text-center transition-all duration-500 border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 hover:shadow-2xl ${isHovered ? 'ring-2 ring-white/30' : ''}`}>
                    <CardContent className="pt-8 pb-6">
                      <motion.div 
                        className={`p-4 bg-gradient-to-r ${benefit.color} rounded-2xl w-fit mx-auto mb-4 shadow-lg`}
                        animate={{ 
                          scale: isHovered ? 1.1 : 1,
                          rotate: isHovered ? 5 : 0
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-white mb-2 text-lg">{benefit.title}</h3>
                      <p className="text-blue-200 text-sm mb-3">{benefit.description}</p>
                      <motion.div 
                        className="text-2xl font-bold text-white"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                      >
                        {benefit.metric}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Interactive Features Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Dimensões Avaliadas</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Análise multidimensional das capacidades cognitivas com metodologia científica avançada
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const isActive = activeFeature === index
                  return (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                        isActive 
                          ? 'bg-white/20 border-white/30 shadow-2xl' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setActiveFeature(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${benefits[index]?.color || 'from-blue-500 to-indigo-600'}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-blue-200 text-sm mb-2">{feature.description}</p>
                          <Badge variant="outline" className="text-xs text-blue-300 border-blue-300">
                            {feature.stats}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              <div className="flex items-center justify-center">
                <motion.div 
                  className="relative w-80 h-80"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center">
                    <motion.div 
                      className="text-center"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-16 h-16 text-white mx-auto mb-4" />
                      <div className="text-2xl font-bold text-white mb-2">TAR</div>
                      <div className="text-sm text-blue-200">Análise Cognitiva</div>
                      <Progress value={progress} className="w-32 mt-4 mx-auto" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Enhanced Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-8 border-0 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Conteúdo Científico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sections.map((section, index) => {
                    const Icon = section.icon
                    const isActive = currentSection === index
                    return (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentSection(index)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl scale-105'
                            : 'hover:bg-white/10 text-blue-100 hover:text-white'
                        }`}
                        whileHover={{ x: isActive ? 0 : 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <Icon className="h-5 w-5 flex-shrink-0" />
                        </div>
                        <span className="font-medium text-sm flex-1">{section.title}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Content Display */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <motion.div 
                    className="flex items-center gap-4"
                    key={currentSection}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                      {React.createElement(sections[currentSection].icon, { 
                        className: "h-6 w-6 text-white" 
                      })}
                    </div>
                    <CardTitle className="text-2xl text-white">
                      {sections[currentSection].title}
                    </CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {sections[currentSection].content.map((paragraph, index) => (
                        <motion.p 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-blue-100 leading-relaxed text-lg"
                        >
                          {paragraph.split('**').map((part, i) => 
                            i % 2 === 1 ? 
                              <strong key={i} className="text-white font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                {part}
                              </strong> : part
                          )}
                        </motion.p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Scoring Interpretation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Sistema de Pontuação</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Interpretação científica baseada em normas populacionais brasileiras
              </p>
            </div>
            
            <Card className="border-0 bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  Interpretação de Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4 }}
                    className="text-blue-100 mb-6 text-lg leading-relaxed"
                  >
                    A pontuação do HumaniQ TAR varia de <span className="text-white font-bold">0 a 16 pontos</span>, 
                    distribuída igualmente entre os quatro domínios avaliados. Cada interpretação considera o 
                    desempenho global nas funções executivas com base em <span className="text-white font-bold">estudos normativos</span>:
                  </motion.p>
                  
                  <div className="grid gap-4">
                    {interpretationLevels.map((level, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.6 + index * 0.1 }}
                        className={`p-6 rounded-2xl border-l-4 ${level.color} bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-white text-lg">{level.level}</h4>
                          <Badge variant="outline" className="font-mono text-blue-300 border-blue-300 px-3 py-1">
                            {level.range}
                          </Badge>
                        </div>
                        <p className="text-blue-200 mb-2">{level.description}</p>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <p className="text-sm text-blue-300">{level.percentage}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Info className="w-5 h-5 text-white flex-shrink-0" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-3">Diretrizes Profissionais</p>
                        <ul className="text-blue-200 space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Interpretação por profissionais qualificados em psicologia
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Consideração do contexto clínico e organizacional
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Complemento à avaliação neuropsicológica abrangente
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
          >
            <Button
              variant="outline"
              onClick={() => router.push('/colaborador/psicossociais')}
              className="px-10 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-lg backdrop-blur-sm"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar aos Testes
            </Button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleStartTest}
                disabled={isLoading}
                className="px-12 py-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 text-lg font-semibold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    Preparando Teste...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Iniciar Teste TAR
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4 }}
            className="text-center mt-20 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">15-20 minutos</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <span className="text-white font-semibold">Tarefas cognitivas</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Validação científica</span>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>
            
            <p className="text-blue-200 mb-2 text-lg">
              Desenvolvido com <span className="text-red-400">♥</span> pela equipe HumaniQ AI
            </p>
            <p className="text-sm text-blue-300">
              Baseado em rigorosos padrões científicos e validado para a população brasileira.
              <br />
              Certificado pela Associação Brasileira de Psicologia Organizacional.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}