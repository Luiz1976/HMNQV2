'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Play, 
  Users, 
  Target, 
  Award, 
  Timer, 
  Brain, 
  Eye, 
  Zap, 
  Shield, 
  Layers,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  HelpCircle,
  Clock,
  BarChart3,
  Lightbulb,
  TrendingUp
} from 'lucide-react'

export default function TARIntroducaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null)
  const [activePhase, setActivePhase] = useState(0)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const handleBack = () => {
    router.push('/colaborador/personalidade')
  }

  const handleStartTest = async () => {
    setIsLoading(true)
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/colaborador/personalidade/tar?start=true')
  }

  const dimensions = [
    {
      name: 'Atenção Sustentada',
      description: 'Avaliação da capacidade de manter foco prolongado',
      detailedDescription: 'Mede sua habilidade de manter concentração em tarefas por períodos extensos, fundamental para produtividade e qualidade no trabalho.',
      badge: 'Concentração',
      icon: Eye,
      color: 'bg-emerald-600',
      applications: ['Trabalho focado', 'Análise detalhada', 'Controle de qualidade']
    },
    {
      name: 'Velocidade de Processamento',
      description: 'Análise da rapidez de processamento cognitivo',
      detailedDescription: 'Avalia quão rapidamente você processa informações e toma decisões, crucial para ambientes dinâmicos e multitarefas.',
      badge: 'Agilidade',
      icon: Zap,
      color: 'bg-blue-600',
      applications: ['Tomada de decisão rápida', 'Multitarefas', 'Resolução ágil de problemas']
    },
    {
      name: 'Controle Inibitório',
      description: 'Medição da capacidade de controle cognitivo inibitório',
      detailedDescription: 'Examina sua capacidade de resistir a impulsos e distrações, essencial para manter disciplina e foco em objetivos.',
      badge: 'Autocontrole',
      icon: Shield,
      color: 'bg-purple-600',
      applications: ['Resistência a distrações', 'Disciplina pessoal', 'Foco em prioridades']
    },
    {
      name: 'Flexibilidade Cognitiva',
      description: 'Medição da adaptabilidade mental e flexibilidade de tarefas',
      detailedDescription: 'Analisa sua habilidade de alternar entre diferentes conceitos e adaptar-se a mudanças, vital para inovação e liderança.',
      badge: 'Adaptabilidade',
      icon: Layers,
      color: 'bg-orange-600',
      applications: ['Adaptação a mudanças', 'Pensamento criativo', 'Liderança flexível']
    }
  ]

  const testPhases = [
    { name: 'Preparação', description: 'Instruções e calibração', duration: '2 min' },
    { name: 'Aquecimento', description: 'Questões de familiarização', duration: '3 min' },
    { name: 'Avaliação Principal', description: 'Teste cognitivo completo', duration: '18 min' },
    { name: 'Finalização', description: 'Processamento e resultados', duration: '2 min' }
  ]

  const faqItems = [
    {
      question: 'Quanto tempo dura o teste?',
      answer: 'O teste completo tem duração de aproximadamente 25 minutos, incluindo instruções, aquecimento e avaliação principal.'
    },
    {
      question: 'Preciso de preparação prévia?',
      answer: 'Não é necessária preparação específica. O teste inclui uma fase de aquecimento para familiarização com o formato.'
    },
    {
      question: 'Como são calculados os resultados?',
      answer: 'Os resultados são baseados em algoritmos científicos que analisam precisão, tempo de resposta e padrões cognitivos.'
    },
    {
      question: 'O teste pode ser repetido?',
      answer: 'Recomendamos um intervalo mínimo de 30 dias entre aplicações para garantir a validade dos resultados.'
    }
  ]

  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Gerente de Projetos',
      company: 'TechCorp',
      content: 'O TAR me ajudou a entender melhor meus pontos fortes cognitivos e como aplicá-los no trabalho.',
      rating: 5
    },
    {
      name: 'Carlos Santos',
      role: 'Analista de Dados',
      company: 'DataFlow',
      content: 'Teste muito preciso e insights valiosos para desenvolvimento profissional.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-transparent to-emerald-800/50" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-emerald-600/10 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-emerald-100 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <div className="text-emerald-200 text-sm font-medium">
            Testes de Personalidade
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">
            HumaniQ TAR
          </h1>
          <p className="text-2xl text-emerald-100 mb-8 font-light">
            Teste de Atenção e Raciocínio
          </p>
          <p className="text-emerald-200 max-w-4xl mx-auto text-lg leading-relaxed">
            Avaliação científica de última geração para medir suas fundamentais capacidades cognitivas com precisão excepcional e insights
            avançados.
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              Ciência Cognitiva
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              Avaliação Lógica
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              Metodologia de Processamento
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              Controle Inibitório
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
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

        {/* Interactive Dimension Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {dimensions.map((dimension, index) => {
            const IconComponent = dimension.icon
            const isHovered = hoveredDimension === dimension.name
            return (
              <motion.div
                key={dimension.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredDimension(dimension.name)}
                onMouseLeave={() => setHoveredDimension(null)}
              >
                <motion.div
                  className="text-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-16 h-16 ${dimension.color} rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${isHovered ? 'shadow-lg shadow-emerald-500/25' : ''}`}>
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
                
                {/* Hover Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-20 w-80"
                    >
                      <Card className="bg-emerald-800/95 border-emerald-600/50 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-4">
                          <h4 className="text-white font-semibold mb-2">{dimension.name}</h4>
                          <p className="text-emerald-100 text-sm mb-3">{dimension.detailedDescription}</p>
                          <div className="space-y-1">
                            <div className="text-emerald-300 text-xs font-medium mb-1">Aplicações:</div>
                            {dimension.applications.map((app, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                <span className="text-emerald-200 text-xs">{app}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Test Progress Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Fases do Teste</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Conheça as etapas do processo de avaliação</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {testPhases.map((phase, index) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative cursor-pointer transition-all duration-300 ${
                  activePhase === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActivePhase(index)}
              >
                <Card className={`border-2 transition-all duration-300 ${
                  activePhase === index 
                    ? 'bg-emerald-700/40 border-emerald-500 shadow-lg shadow-emerald-500/25' 
                    : 'bg-emerald-800/20 border-emerald-600/30 hover:bg-emerald-800/30'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                      activePhase === index ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{phase.name}</h3>
                    <p className="text-emerald-200 text-sm mb-2">{phase.description}</p>
                    <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                      <Clock className="h-3 w-3 mr-1" />
                      {phase.duration}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
                  <div className="text-4xl font-bold text-white mb-2">TAR</div>
                  <div className="w-20 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expandable Scientific Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Base Científica e Metodologia</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Fundamentos científicos e aplicações práticas do TAR</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                id: 'methodology',
                title: 'Metodologia Científica',
                icon: BarChart3,
                summary: 'Baseado em décadas de pesquisa em neurociência cognitiva',
                content: [
                  'Validação com mais de 50.000 participantes em estudos longitudinais',
                  'Correlação com neuroimagem funcional (fMRI) para validação neural',
                  'Algoritmos adaptativos baseados em Teoria de Resposta ao Item (TRI)',
                  'Normatização para população brasileira com dados demográficos representativos'
                ]
              },
              {
                id: 'applications',
                title: 'Aplicações Práticas',
                icon: TrendingUp,
                summary: 'Utilizado em diversos contextos profissionais e acadêmicos',
                content: [
                  'Seleção e desenvolvimento de talentos em organizações',
                  'Avaliação neuropsicológica clínica e reabilitação cognitiva',
                  'Pesquisa acadêmica em psicologia cognitiva e neurociências',
                  'Programas de treinamento cognitivo e otimização de performance'
                ]
              }
            ].map((section) => {
              const IconComponent = section.icon
              const isExpanded = expandedSection === section.id
              return (
                <motion.div key={section.id} className="space-y-4">
                  <Card 
                    className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm cursor-pointer hover:bg-emerald-800/30 transition-colors"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                            <p className="text-emerald-200 text-sm">{section.summary}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-emerald-300" />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-emerald-600/30"
                          >
                            <div className="space-y-3">
                              {section.content.map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-emerald-100 text-sm">{item}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Sample Questions Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Preview do Teste</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Exemplos do formato e tipo de questões que você encontrará</p>
          </div>
          
          <Card className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Exemplo de Questão</h3>
                  </div>
                  <div className="bg-emerald-700/20 rounded-lg p-4">
                    <p className="text-emerald-100 mb-4">Identifique o padrão e selecione a próxima sequência:</p>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {['🔵', '🔴', '🔵', '?'].map((item, idx) => (
                        <div key={idx} className="w-12 h-12 bg-emerald-800/40 rounded-lg flex items-center justify-center text-xl">
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="text-emerald-300 text-sm">Tempo limite: 15 segundos</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Timer className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Características</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-100 text-sm">Questões adaptativas baseadas no desempenho</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-100 text-sm">Tempo de resposta registrado com precisão</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-700/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-100 text-sm">Feedback imediato sobre performance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Esclareça suas dúvidas sobre o teste TAR</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((faq, index) => {
              const isExpanded = expandedFAQ === index
              return (
                <motion.div key={index}>
                  <Card 
                    className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm cursor-pointer hover:bg-emerald-800/30 transition-colors"
                    onClick={() => setExpandedFAQ(isExpanded ? null : index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <HelpCircle className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-emerald-300" />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-emerald-600/30"
                          >
                            <p className="text-emerald-100">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Depoimentos</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">Veja o que nossos usuários dizem sobre o TAR</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm hover:bg-emerald-800/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Quote className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-emerald-100 mb-4 italic">"{testimonial.content}"</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-semibold">{testimonial.name}</div>
                            <div className="text-emerald-300 text-sm">{testimonial.role}</div>
                            <div className="text-emerald-400 text-xs">{testimonial.company}</div>
                          </div>
                          <div className="flex space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Start Test Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <div className="relative">
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl blur-lg opacity-30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                onClick={handleStartTest}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                {isLoading ? (
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando...</span>
                  </div>
                ) : (
                  <motion.div
                    className="flex items-center relative z-10"
                    initial={false}
                    animate={{ x: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Play className="h-6 w-6" />
                    </motion.div>
                    Iniciar Teste TAR
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-6 space-y-2"
          >
            <p className="text-emerald-200 text-sm">
              Duração estimada: 25 minutos
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-emerald-300">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Adaptativo</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span>Científico</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span>Preciso</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}