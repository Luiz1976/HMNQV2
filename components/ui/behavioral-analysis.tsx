'use client'

// HumaniQ - Componente de Análise Comportamental Avançada
// Exibe análise comportamental gerada por IA de forma moderna e interativa

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  Star, 
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react'

// Interface para análise comportamental
interface BehavioralAnalysis {
  professionalSummary: string
  behavioralTrends: {
    communication: string
    organization: string
    emotionalStability: string
    leadership: string
    adaptability: string
  }
  organizationalSuggestions: string[]
  developmentAreas: string[]
  strengths: string[]
}

// Props do componente
interface BehavioralAnalysisProps {
  analysis: BehavioralAnalysis

  className?: string
  showDetailedView?: boolean
}

// Dados para visualização das tendências
const trendData = {
  communication: { icon: Users, color: 'bg-blue-500', score: 85 },
  organization: { icon: Target, color: 'bg-green-500', score: 78 },
  emotionalStability: { icon: Brain, color: 'bg-purple-500', score: 82 },
  leadership: { icon: TrendingUp, color: 'bg-orange-500', score: 75 },
  adaptability: { icon: Sparkles, color: 'bg-pink-500', score: 88 }
}

export function BehavioralAnalysisComponent({
  analysis,

  className = "",
  showDetailedView = true
}: BehavioralAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Função para calcular score baseado no texto
  const calculateScore = (text: string, trendKey: keyof typeof trendData): number => {
    // Simulação de score baseado no comprimento e palavras positivas
    const positiveWords = ['excelente', 'boa', 'forte', 'desenvolvida', 'adequada', 'positiva']
    const hasPositiveWords = positiveWords.some(word => text.toLowerCase().includes(word))
    const baseScore = trendData[trendKey].score
    return hasPositiveWords ? Math.min(baseScore + 10, 100) : baseScore
  }

  // Função para obter cor baseada no score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com frase de destaque */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Sua escrita revela quem você é
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Veja o que sua mente expressa além das palavras
          </p>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
          <Brain className="h-4 w-4 mr-1" />
          Análise Completa
        </Badge>
      </motion.div>

      {/* Tabs de navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
          <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Resumo Comportamental Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.professionalSummary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pontos Fortes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Principais Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tendências Comportamentais */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.behavioralTrends).map(([key, value], index) => {
              const trendInfo = trendData[key as keyof typeof trendData]
              const score = calculateScore(value, key as keyof typeof trendData)
              const IconComponent = trendInfo.icon
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${trendInfo.color} bg-opacity-20`}>
                            <IconComponent className={`h-4 w-4 text-white`} />
                          </div>
                          <h3 className="font-semibold capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                        </div>
                        <Badge variant="outline" className={getScoreColor(score)}>
                          {score}%
                        </Badge>
                      </div>
                      
                      <Progress value={score} className="mb-3" />
                      
                      <p className="text-sm text-gray-600">{value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Sugestões Organizacionais */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Sugestões para Aproveitamento Organizacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.organizationalSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Áreas de Desenvolvimento */}
        <TabsContent value="development" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Áreas de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.developmentAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                  >
                    <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-800">{area}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Estas áreas representam oportunidades de crescimento e não devem ser interpretadas como deficiências. O desenvolvimento contínuo é parte natural da evolução profissional.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BehavioralAnalysisComponent