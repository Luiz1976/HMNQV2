'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Target, Users, TrendingUp, Heart, CheckCircle, Clock, Award, BookOpen, BarChart3, Zap, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function HumaniQTELAIntroducao() {
  const router = useRouter()
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const handleStartTest = async () => {
    setIsStarting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/colaborador/psicossociais/humaniq-tela')
  }

  const handleBackToTests = () => {
    router.push('/colaborador/corporativo')
  }

  const dimensions = [
    {
      icon: Target,
      title: 'Autoconsciência',
      description: 'Compreensão clara de suas próprias forças, limitações, valores e impacto nos outros.'
    },
    {
      icon: Users,
      title: 'Processamento Balanceado',
      description: 'Análise objetiva de informações relevantes antes de tomar decisões importantes.'
    },
    {
      icon: TrendingUp,
      title: 'Perspectiva Moral Internalizada',
      description: 'Autorregulação guiada por padrões morais internos e valores éticos.'
    },
    {
      icon: Heart,
      title: 'Transparência de Relacionamentos',
      description: 'Apresentação autêntica do self genuíno nas relações com outros.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            HumaniQ TELA
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Teste de Liderança Autêntica
          </p>
          <p className="text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed">
            Avaliação científica das capacidades de liderança autêntica fundamentais,
            com precisão comprovada e insights individuais.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="text-sm text-purple-200 mb-1">Avaliados</div>
            <div className="text-2xl font-bold">25.000+</div>
            <div className="text-xs text-purple-300">pessoas</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="text-sm text-purple-200 mb-1">Empresas</div>
            <div className="text-2xl font-bold">300+</div>
            <div className="text-xs text-purple-300">organizações</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="text-sm text-purple-200 mb-1">Precisão</div>
            <div className="text-2xl font-bold">92%</div>
            <div className="text-xs text-purple-300">confiabilidade</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </div>
            <div className="text-sm text-purple-200 mb-1">Duração</div>
            <div className="text-2xl font-bold">15 min</div>
            <div className="text-xs text-purple-300">aproximadamente</div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Dimensões Avaliadas</h2>
            <p className="text-purple-200 mb-8">Análise multidimensional das capacidades de liderança com metodologia científica avançada</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <Eye className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Liderança Visionária</h3>
                    <p className="text-sm text-purple-200">Capacidade de inspirar e direcionar equipes com visão estratégica</p>
                    <div className="text-xs text-purple-300 mt-1">Visão estratégica</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Liderança Coaching</h3>
                    <p className="text-sm text-purple-200">Desenvolvimento e mentoria de pessoas para crescimento</p>
                    <div className="text-xs text-purple-300 mt-1">Desenvolvimento de pessoas</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <TrendingUp className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Liderança Estratégica</h3>
                    <p className="text-sm text-purple-200">Pensamento estratégico e tomada de decisões organizacionais</p>
                    <div className="text-xs text-purple-300 mt-1">Visão sistêmica</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-pink-500/20">
                    <Heart className="h-6 w-6 text-pink-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Inteligência Emocional</h3>
                    <p className="text-sm text-purple-200">Autoconhecimento e gestão emocional para liderança eficaz</p>
                    <div className="text-xs text-purple-300 mt-1">Competência emocional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Circular Logo */}
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">TELA</div>
                <div className="text-sm opacity-90">Liderança Autêntica</div>
                <div className="text-xs opacity-75 mt-1">Teste Científico</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scientific Content Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Conteúdo Científico</h2>
        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-6">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
            onClick={handleStartTest}
            disabled={isStarting}
          >
            {isStarting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Iniciando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Iniciar Teste
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}