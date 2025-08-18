'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Users, Shield, CheckCircle2, ArrowRight, Clock, Target, BarChart3, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Dimension {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
}

const dimensions: Dimension[] = [
  {
    id: 'dominancia',
    name: 'Dominância',
    description: 'Orientação para resultados, controle e tomada de decisões',
    icon: Zap,
    color: 'bg-red-500'
  },
  {
    id: 'influencia',
    name: 'Influência', 
    description: 'Foco em relacionamentos, comunicação e persuasão',
    icon: Users,
    color: 'bg-yellow-500'
  },
  {
    id: 'estabilidade',
    name: 'Estabilidade',
    description: 'Busca por harmonia, cooperação e consistência',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    id: 'conformidade',
    name: 'Conformidade',
    description: 'Atenção aos detalhes, precisão e qualidade',
    icon: CheckCircle2,
    color: 'bg-blue-500'
  }
]

const badges = [
  'Perfil Comportamental',
  'Teoria DISC', 
  'Ambiente Profissional',
  'Comunicação Eficaz'
]

const stats = [
  {
    icon: Target,
    value: '100.000+',
    label: 'Pessoas Avaliadas'
  },
  {
    icon: BarChart3,
    value: '1.000+',
    label: 'Empresas Parceiras'
  },
  {
    icon: CheckCircle,
    value: '98%',
    label: 'Precisão Diagnóstica'
  },
  {
    icon: Clock,
    value: '20 min',
    label: 'Duração'
  }
]

export default function DiscIntroducao() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStartTest = () => {
    router.push('/colaborador/personalidade/disc?start=true')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            ← Voltar
          </Button>
          <div className="text-white text-sm">
            Testes de Personalidade
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              HumaniQ DISC
            </h1>
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-600/20">
              <div className="bg-emerald-600/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-8 h-8 text-emerald-300" />
              </div>
              <p className="text-xl text-emerald-100 mb-6">
                Perfil Comportamental Profissional
              </p>
              <p className="text-lg text-emerald-200 max-w-3xl mx-auto leading-relaxed">
                Avaliação científica baseada na Teoria DISC de William Moulton Marston para 
                identificar padrões comportamentais e estilos de comunicação no ambiente de trabalho
              </p>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {badges.map((badge, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="inline-block bg-emerald-600/20 text-emerald-200 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {badge}
              </Badge>
            ))}
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-emerald-800/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-600/20">
                <div className="text-center">
                  <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-emerald-300 text-sm mb-1">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Dimensions Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {dimensions.map((dimension, index) => {
            const Icon = dimension.icon
            return (
              <div key={index} className="bg-emerald-800/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-600/20 hover:bg-emerald-700/30 transition-all duration-300">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${dimension.color} rounded-full mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {dimension.name}
                  </h3>
                  <p className="text-sm text-emerald-200 leading-relaxed">
                    {dimension.description}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Dimensions Section */}
        <div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-600/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Dimensões Avaliadas
            </h2>
            <p className="text-lg text-emerald-200 max-w-2xl mx-auto">
              Análise comportamental baseada nas quatro dimensões fundamentais da Teoria DISC
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {dimensions.map((dimension, index) => {
                const Icon = dimension.icon
                return (
                  <motion.div
                    key={dimension.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 ${dimension.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {dimension.name}
                      </h3>
                      <p className="text-emerald-200 text-sm leading-relaxed">
                        {dimension.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-center"
              >
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                  <Zap className="w-24 h-24 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  DISC
                </div>
              </motion.div>
            </div>
          </div>
          </motion.div>
        </div>

        {/* Scientific Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-emerald-300" />
              Conteúdo Científico
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-emerald-200 text-sm leading-relaxed">
                  O que é o HumaniQ DISC?
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-emerald-200 text-sm leading-relaxed">
                  Base Científica
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-emerald-200 text-sm leading-relaxed">
                  Dimensões Comportamentais
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-emerald-300" />
              O que é o HumaniQ DISC?
            </h3>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4">
              O HumaniQ DISC é um instrumento psicométrico baseado na Teoria DISC 
              de William Moulton Marston (1928), desenvolvido para identificar 
              padrões comportamentais e estilos de comunicação no ambiente profissional.
            </p>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4">
              O teste avalia quatro dimensões comportamentais fundamentais: 
              Dominância, Influência, Estabilidade e Conformidade, oferecendo 
              insights sobre como você interage, comunica e toma decisões.
            </p>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Esta avaliação é amplamente utilizada para desenvolvimento de liderança, 
              formação de equipes, melhoria da comunicação e otimização do 
              desempenho organizacional.
            </p>
          </div>
        </motion.div>

        {/* Start Test Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center"
        >
          <Button
            onClick={handleStartTest}
            size="lg"
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Teste
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}