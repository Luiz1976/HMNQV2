'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, Users, CheckCircle, ArrowRight, Info, Crown, Brain, Zap, Eye, Heart, Shield, Lightbulb, Star, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function HumaniQTelaIntroducaoPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    // Criar partículas flutuantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)

    // Animação de progresso
    const timer = setInterval(() => {
      setProgress(prev => (prev + 1) % 101)
    }, 50)

    // Rotação automática de features
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(featureTimer)
    }
  }, [])

  const handleStartTest = async () => {
    setIsStarting(true)
    setTimeout(() => {
      router.push('/colaborador/psicossociais/humaniq-tela')
    }, 1500)
  }

  const dimensions = [
    {
      icon: Eye,
      title: "Autoconsciência",
      description: "Compreensão profunda de suas próprias emoções, valores e motivações",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Brain,
      title: "Processamento Balanceado",
      description: "Capacidade de analisar informações de forma objetiva e imparcial",
      color: "from-indigo-400 to-purple-400"
    },
    {
      icon: Shield,
      title: "Perspectiva Moral Internalizada",
      description: "Forte senso ético e moral que guia decisões e comportamentos",
      color: "from-violet-400 to-indigo-400"
    },
    {
      icon: Heart,
      title: "Transparência de Relacionamentos",
      description: "Comunicação aberta, honesta e autêntica com outros",
      color: "from-purple-400 to-violet-400"
    }
  ]

  const benefits = [
    {
      icon: Crown,
      title: "Liderança Autêntica",
      description: "Desenvolva um estilo de liderança genuíno e inspirador"
    },
    {
      icon: Lightbulb,
      title: "Autoconhecimento",
      description: "Compreenda profundamente seus valores e motivações"
    },
    {
      icon: Star,
      title: "Impacto Positivo",
      description: "Gere influência positiva e duradoura em sua equipe"
    },
    {
      icon: Zap,
      title: "Desenvolvimento Contínuo",
      description: "Identifique áreas de crescimento e melhoria"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0">
        {/* Partículas flutuantes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay
            }}
          />
        ))}
        
        {/* Círculos de fundo com blur */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, 50, -50]
          }}
          transition={{
            duration: 30,
            repeat: Infinity
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Header Hero Section */}
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Rotating TELA Crown */}
          <div className="relative flex items-center justify-center">
            {/* Anéis rotativos */}
            <motion.div
              className="absolute w-32 h-32 border-2 border-purple-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-24 h-24 border-2 border-indigo-400/40 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-16 h-16 border-2 border-violet-400/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Círculo central pulsante */}
            <motion.div
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                  "0 0 40px rgba(147, 51, 234, 0.8)",
                  "0 0 20px rgba(147, 51, 234, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="h-10 w-10 text-white" />
            </motion.div>
            
            {/* Partículas flutuantes ao redor */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                style={{
                  left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Título animado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
              HumaniQ TELA
            </h1>
            <p className="text-2xl text-purple-200 mb-6">
              Teste de Liderança Autêntica
            </p>
            <p className="text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed">
              Descubra e desenvolva seu potencial de liderança autêntica através de uma avaliação científica 
              que explora as quatro dimensões fundamentais da liderança genuína e inspiradora.
            </p>
          </motion.div>
          
          {/* Indicador de progresso animado */}
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-full p-1 border border-purple-500/30">
              <Progress 
                value={progress} 
                className="h-2 bg-purple-800/50"
              />
            </div>
            <p className="text-purple-300 text-sm mt-2">Preparando experiência personalizada...</p>
          </motion.div>
        </motion.div>

        {/* Barra de estatísticas aprimorada */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.div 
            className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">15 min</p>
                <p className="text-purple-300 text-sm">Duração</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">40</p>
                <p className="text-indigo-300 text-sm">Questões</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-violet-900/30 backdrop-blur-sm rounded-2xl p-6 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">95%</p>
                <p className="text-violet-300 text-sm">Precisão</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Grade de benefícios aprimorada */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05, y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div 
                    className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-purple-300 text-sm leading-relaxed group-hover:text-purple-200 transition-colors">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Seção de Dimensões Avaliadas */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center">
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Dimensões Avaliadas
            </motion.h2>
            <motion.p 
              className="text-purple-300 text-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Explore as quatro dimensões fundamentais que definem a liderança autêntica e transformadora
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon
              const isHovered = hoveredDimension === index
              
              return (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredDimension(index)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                >
                  <motion.div
                    className={`bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 ${
                      isHovered 
                        ? 'border-purple-400/60 shadow-2xl shadow-purple-500/20' 
                        : 'border-purple-500/30'
                    }`}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-start gap-6">
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${dimension.color} flex-shrink-0`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                          {dimension.title}
                        </h3>
                        <p className="text-purple-300 leading-relaxed group-hover:text-purple-200 transition-colors">
                          {dimension.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Efeito de brilho no hover */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Seção de Conteúdo Científico */}
        <motion.div 
          className="bg-purple-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Base Científica</h2>
            <p className="text-purple-300 max-w-4xl mx-auto leading-relaxed">
              O HumaniQ TELA é fundamentado em décadas de pesquisa em liderança autêntica, 
              incorporando os modelos teóricos mais robustos e validados cientificamente para 
              avaliar e desenvolver líderes genuínos e inspiradores.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-6 rounded-2xl bg-purple-800/30 border border-purple-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-purple-300 text-sm">Precisão Diagnóstica</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 rounded-2xl bg-indigo-800/30 border border-indigo-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-indigo-400 mb-2">15</div>
              <div className="text-indigo-300 text-sm">Minutos de Avaliação</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 rounded-2xl bg-violet-800/30 border border-violet-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-violet-400 mb-2">4</div>
              <div className="text-violet-300 text-sm">Dimensões Avaliadas</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Instruções e Botão de Início */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Instruções Importantes</h3>
                <p className="text-purple-300 leading-relaxed">
                  Leia cada afirmação cuidadosamente e indique o quanto ela descreve você como líder 
                  ou seu potencial de liderança. Use a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente). 
                  Seja honesto em suas respostas para obter resultados mais precisos e personalizados.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 border border-purple-500/50 transition-all duration-300"
                onClick={handleStartTest}
                disabled={isStarting}
              >
                {isStarting ? (
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Iniciando Avaliação...
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <Sparkles className="h-5 w-5" />
                    Iniciar Teste de Liderança
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}