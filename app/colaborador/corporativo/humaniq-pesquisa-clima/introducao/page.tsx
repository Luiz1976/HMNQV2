'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Clock, 
  Shield, 
  Users, 
  Heart, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Award, 
  Star,
  Home,
  FileText,
  Settings,
  LogOut,
  Play,
  Download,
  Share2,
  Crown,
  MessageCircle,
  Gauge,
  HelpCircle,
  Lightbulb,
  Eye,
  Briefcase,
  Smile
} from 'lucide-react'

export default function HumaniqPesquisaClimaIntroducao() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [rotationAngle, setRotationAngle] = useState(0)
  const [pulseScale, setPulseScale] = useState(1)

  // Animações
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle(prev => prev + 0.5)
    }, 50)
    
    const pulseInterval = setInterval(() => {
      setPulseScale(prev => prev === 1 ? 1.05 : 1)
    }, 2000)
    
    return () => {
      clearInterval(rotationInterval)
      clearInterval(pulseInterval)
    }
  }, [])

  const infoCards = [
    {
      icon: Clock,
      title: "Duração",
      subtitle: "Tempo estimado",
      description: "12-15 min",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Users,
      title: "Participantes",
      subtitle: "Colaboradores avaliados",
      description: "25.000+",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Shield,
      title: "Confiabilidade",
      subtitle: "Validação científica",
      description: "92% precisão",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Dimensões",
      subtitle: "Aspectos avaliados",
      description: "4 dimensões",
      color: "from-orange-400 to-orange-600"
    }
  ]

  const dimensions = [
    {
      title: "Satisfação no Trabalho",
      description: "Avalia o nível de contentamento e realização dos colaboradores com suas funções e ambiente de trabalho.",
      icon: Smile,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Comunicação Organizacional",
      description: "Mede a eficácia dos canais de comunicação e transparência nas informações compartilhadas.",
      icon: MessageCircle,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Oportunidades de Desenvolvimento",
      description: "Analisa as possibilidades de crescimento profissional e capacitação oferecidas pela organização.",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Confiança na Gestão",
      description: "Avalia o nível de confiança dos colaboradores na liderança e nas decisões organizacionais.",
      icon: Shield,
      color: "from-purple-500 to-violet-500"
    }
  ]

  const scientificContent = {
    'overview': {
      title: 'O que é a Pesquisa de Clima Organizacional?',
      content: 'A Pesquisa de Clima Organizacional HumaniQ é um instrumento científico desenvolvido para avaliar sistematicamente a percepção dos colaboradores sobre o ambiente de trabalho. Baseada em metodologias validadas de psicologia organizacional, esta pesquisa mensura quatro dimensões fundamentais: satisfação no trabalho, comunicação organizacional, oportunidades de desenvolvimento e confiança na gestão. É uma ferramenta essencial para organizações que buscam compreender e melhorar o bem-estar, engajamento e produtividade de suas equipes.'
    },
    'scientific': {
      title: 'Base Científica',
      content: 'Fundamentado em décadas de pesquisa em psicologia organizacional e comportamento humano no trabalho, utilizando escalas psicométricas validadas e análise estatística avançada para garantir resultados precisos e confiáveis.'
    },
    'dimensions': {
      title: 'Dimensões Avaliadas',
      content: 'Análise multidimensional de quatro aspectos críticos: Satisfação no Trabalho, Comunicação Organizacional, Oportunidades de Desenvolvimento e Confiança na Gestão, proporcionando uma visão completa do clima organizacional.'
    },
    'application': {
      title: 'Aplicação Prática',
      content: 'Ferramenta estratégica para gestores, líderes e profissionais de RH que desejam identificar pontos de melhoria, desenvolver planos de ação eficazes e criar um ambiente de trabalho mais saudável e produtivo para todos os colaboradores.'
    }
  }

  const statistics = [
    {
      icon: Users,
      value: "25.000+",
      label: "pessoas"
    },
    {
      icon: Award,
      value: "300+",
      label: "empresas"
    },
    {
      icon: Star,
      value: "92%",
      label: "aprovação"
    },
    {
      icon: Clock,
      value: "20 min",
      label: "duração"
    }
  ]

  const scoreLevels = [
    {
      range: "80",
      level: "Clima Excepcional",
      description: "Ambiente organizacional altamente positivo com excelente engajamento e satisfação dos colaboradores.",
      icon: Award,
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    {
      range: "65",
      level: "Clima Forte",
      description: "Bom ambiente de trabalho com níveis satisfatórios de motivação e desenvolvimento profissional.",
      icon: Star,
      bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      range: "50",
      level: "Clima em Desenvolvimento",
      description: "Ambiente com potencial de melhoria, necessitando ações específicas para otimização.",
      icon: Gauge,
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-600"
    },
    {
      range: "35",
      level: "Potencial do Clima",
      description: "Oportunidades significativas de crescimento e desenvolvimento do ambiente organizacional.",
      icon: HelpCircle,
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-600"
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Satisfação",
      description: "Mede o nível de satisfação dos colaboradores",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Comunicação",
      description: "Avalia a qualidade da comunicação interna",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Desenvolvimento",
      description: "Analisa oportunidades de crescimento profissional",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Confiança",
      description: "Mede a confiança na gestão e liderança",
      color: "from-purple-500 to-violet-500"
    }
  ]

  const methodology = [
    {
      step: "1",
      title: "Coleta de Dados",
      description: "Questionário estruturado com perguntas validadas cientificamente",
      icon: FileText
    },
    {
      step: "2",
      title: "Análise IA",
      description: "Processamento inteligente dos dados coletados",
      icon: Brain
    },
    {
      step: "3",
      title: "Relatório",
      description: "Geração de insights e recomendações personalizadas",
      icon: BarChart3
    },
    {
      step: "4",
      title: "Ação",
      description: "Implementação de melhorias baseadas nos resultados",
      icon: Target
    }
  ]

  const [currentBenefit, setCurrentBenefit] = useState(0)
  const [activeSection, setActiveSection] = useState('overview')

  // Cycling through benefits
  useEffect(() => {
    const benefitInterval = setInterval(() => {
      setCurrentBenefit(prev => (prev + 1) % benefits.length)
    }, 3000)
    
    return () => clearInterval(benefitInterval)
  }, [])

  const handleStartTest = () => {
    router.push('/colaborador/corporativo/humaniq-pesquisa-clima')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden relative">
      {/* Header Simples */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-transparent p-6"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">HumaniQ Testes</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Conteúdo Principal */}
        <div className="text-center mb-16">
          {/* Ícone Central */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Smile className="w-10 h-10 text-white" />
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            HumaniQ CLIMA
          </motion.h1>

          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-white/90 mb-4"
          >
            Teste de Clima Organizacional
          </motion.p>

          {/* Descrição */}
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.8 }}
             className="text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed"
           >
             Avaliação científica do ambiente organizacional para identificar pontos de melhoria e desenvolver estratégias que promovam um ambiente de trabalho mais saudável e produtivo.
           </motion.p>

          {/* Badges Informativos */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
          >
            {infoCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-r ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                <p className="text-2xl font-bold text-white mb-1">{card.subtitle}</p>
                <p className="text-white/70 text-sm">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Estatísticas Principais */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20"
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Seção Dimensões Avaliadas */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Dimensões Avaliadas</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Análise multidimensional do ambiente organizacional para identificar oportunidades de melhoria e desenvolvimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {dimensions.map((dimension, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-r ${dimension.color}`}>
                    <dimension.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{dimension.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{dimension.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Elemento Central - Logo CLIMA */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.0, delay: 2.6 }}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: rotationAngle }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
              >
                <div className="text-center">
                  <Crown className="w-8 h-8 text-white mx-auto mb-1" />
                  <div className="text-white font-bold text-sm">CLIMA</div>
                  <div className="text-white/80 text-xs">Organizacional</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Seção Conteúdo Científico */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Conteúdo Científico</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Fundamentação teórica e metodológica do HumaniQ CLIMA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              className="space-y-6"
            >
              {Object.values(scientificContent).slice(0, 2).map((content, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold text-lg mb-3">{content.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{content.content}</p>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              className="space-y-6"
            >
              {Object.values(scientificContent).slice(2, 4).map((content, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold text-lg mb-3">{content.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{content.content}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Seção Sistema de Pontuação */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Sistema de Pontuação</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Interpretação detalhada dos resultados e níveis de clima organizacional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {scoreLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${level.bgColor}`}>
                  <level.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{level.range}</div>
                <h3 className="text-white font-semibold mb-2">{level.level}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{level.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seção Final - CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 4.0 }}
          className="text-center mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Pronto para Descobrir seu<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Potencial de Clima Organizacional?
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.4 }}
              className="text-white/80 text-lg mb-8 max-w-2xl mx-auto"
            >
              Inicie sua jornada de autoconhecimento e desenvolvimento do ambiente organizacional com o HumaniQ CLIMA. Descubra suas áreas de força e oportunidades de crescimento.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.6 }}
              className="mb-12"
            >
              <Button 
                onClick={() => router.push('/colaborador/corporativo/humaniq-pesquisa-clima/teste')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Teste CLIMA
              </Button>
            </motion.div>

            {/* Estatísticas Finais */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25.000+</div>
                <div className="text-white/70 text-sm">Avaliações realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">300+</div>
                <div className="text-white/70 text-sm">Empresas participantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-white/70 text-sm">Taxa de satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">20 min</div>
                <div className="text-white/70 text-sm">Tempo médio</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>
    </div>
  )
}