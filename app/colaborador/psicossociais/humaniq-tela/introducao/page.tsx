'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, Users, CheckCircle, ArrowRight, Info, Crown, Brain, Zap, Eye, Heart, Shield, Lightbulb, Star, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

export default function HumaniQTelaIntroducaoPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null)



  const handleStartTest = async () => {
    setIsStarting(true)
    router.push('/colaborador/psicossociais/humaniq-tela')
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
      {/* Elementos de fundo estáticos */}
      <div className="absolute inset-0">
        {/* Círculos de fundo com blur */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Header Hero Section */}
        <div className="text-center space-y-8">
          {/* TELA Crown */}
          <div className="relative flex items-center justify-center">
            {/* Anéis estáticos */}
            <div className="absolute w-32 h-32 border-2 border-purple-400/30 rounded-full" />
            <div className="absolute w-24 h-24 border-2 border-indigo-400/40 rounded-full" />
            <div className="absolute w-16 h-16 border-2 border-violet-400/50 rounded-full" />
            
            {/* Círculo central */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl">
              <Crown className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Título */}
          <div>
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
          </div>
        </div>

        {/* Barra de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">15 min</p>
                <p className="text-purple-300 text-sm">Duração</p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">40</p>
                <p className="text-indigo-300 text-sm">Questões</p>
              </div>
            </div>
          </div>
          
          <div className="bg-violet-900/30 backdrop-blur-sm rounded-2xl p-6 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">95%</p>
                <p className="text-violet-300 text-sm">Precisão</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grade de benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-purple-300 text-sm leading-relaxed group-hover:text-purple-200 transition-colors">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Seção de Dimensões Avaliadas */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Dimensões Avaliadas
            </h2>
            <p className="text-purple-300 text-lg max-w-3xl mx-auto">
              Explore as quatro dimensões fundamentais que definem a liderança autêntica e transformadora
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon
              const isHovered = hoveredDimension === index
              
              return (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredDimension(index)}
                  onMouseLeave={() => setHoveredDimension(null)}
                >
                  <div
                    className={`bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 ${
                      isHovered 
                        ? 'border-purple-400/60 shadow-2xl shadow-purple-500/20' 
                        : 'border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${dimension.color} flex-shrink-0`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
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
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Seção de Conteúdo Científico */}
        <div className="bg-purple-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Base Científica</h2>
            <p className="text-purple-300 max-w-4xl mx-auto leading-relaxed">
              O HumaniQ TELA é fundamentado em décadas de pesquisa em liderança autêntica, 
              incorporando os modelos teóricos mais robustos e validados cientificamente para 
              avaliar e desenvolver líderes genuínos e inspiradores.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-purple-800/30 border border-purple-500/20 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-purple-300 text-sm">Precisão Diagnóstica</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-indigo-800/30 border border-indigo-500/20 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-400 mb-2">15</div>
              <div className="text-indigo-300 text-sm">Minutos de Avaliação</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-violet-800/30 border border-violet-500/20 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-violet-400 mb-2">4</div>
              <div className="text-violet-300 text-sm">Dimensões Avaliadas</div>
            </div>
          </div>
        </div>

        {/* Instruções e Botão de Início */}
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:scale-102 transition-transform duration-300">
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
          </div>

          <div className="flex justify-center">
            <div className="hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 border border-purple-500/50 transition-all duration-300"
                onClick={handleStartTest}
                disabled={isStarting}
              >
                {isStarting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando Avaliação...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    Iniciar Teste de Liderança
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}