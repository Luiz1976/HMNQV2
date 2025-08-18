'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  MessageCircle, 
  FolderOpen, 
  Heart, 
  Crown, 
  Zap,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkplaceTrend {
  score: number
  description: string
}

interface WorkplaceTrends {
  communication: WorkplaceTrend
  organization: WorkplaceTrend
  emotionalStability: WorkplaceTrend
  leadership: WorkplaceTrend
  adaptability: WorkplaceTrend
}

interface AdvancedBehavioralAnalysisProps {
  analysis: {
    detailedAnalysis?: {
      technicalObservations: {
        pressure: string;
        size: string;
        inclination: string;
        spacing: string;
        rhythm: string;
        regularity: string;
      };
      psychologicalInterpretation: string;
    };
    behavioralSummary: string | {
      personality: string;
      strengths: string[];
      challenges: string[];
      workStyle: string;
    };
    workplaceTrends: {
      [key: string]: {
        score: number;
        description: string;
        trend?: string;
      };
    };
    practicalSuggestions: string[];
    professionalInsights?: {
      strengths: string[];
      developmentAreas: string[];
      workStyle: string;
      communicationStyle: string;
    };
    scientificBasis?: string;

    visualHighlights?: Array<{
      type: string;
      coordinates?: { x: number; y: number; width: number; height: number };
      description?: string;
      significance?: string;
      interpretation?: string;

      technicalDetails?: string;
    }>;
  };
  className?: string;
}

const trendIcons = {
  communication: MessageCircle,
  organization: FolderOpen,
  emotionalStability: Heart,
  leadership: Crown,
  adaptability: Zap
}

const trendLabels = {
  communication: 'Comunicação',
  organization: 'Organização',
  emotionalStability: 'Estabilidade Emocional',
  leadership: 'Liderança',
  adaptability: 'Adaptabilidade'
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
  if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200'
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excelente'
  if (score >= 60) return 'Bom'
  if (score >= 40) return 'Moderado'
  return 'Necessita Atenção'
}

export function AdvancedBehavioralAnalysis({
  analysis,
  className
}: AdvancedBehavioralAnalysisProps) {
  const {
    detailedAnalysis,
    behavioralSummary,
    workplaceTrends,
    practicalSuggestions,
    professionalInsights,
    scientificBasis,

  } = analysis
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null)
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)

  const averageScore = Math.round(
    Object.values(workplaceTrends).reduce((sum, trend) => sum + trend.score, 0) / 
    Object.keys(workplaceTrends).length
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* Cabeçalho com informações da análise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Análise Comportamental Avançada</h3>
            <p className="text-sm text-gray-600">Baseada em características grafológicas identificadas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className="text-sm px-3 py-1 font-medium border-green-500 text-green-700 bg-green-50"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Análise Completa
          </Badge>
        </div>
      </motion.div>

      {/* Resumo Comportamental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Resumo Comportamental Profissional
            </CardTitle>
            <CardDescription>
              Análise detalhada baseada nas características da sua escrita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {typeof behavioralSummary === 'string' ? behavioralSummary : behavioralSummary.personality}
            </p>
            
            {detailedAnalysis && (
              <div className="mt-6 space-y-4">
                <Separator />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Observações Técnicas da Escrita
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Pressão:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.pressure}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Tamanho:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.size}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Inclinação:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.inclination}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Espaçamento:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.spacing}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Ritmo:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.rhythm}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-600">Regularidade:</span>
                      <p className="text-gray-800">{detailedAnalysis.technicalObservations.regularity}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interpretação Psicológica</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {detailedAnalysis.psychologicalInterpretation}
                  </p>
                </div>
              </div>
            )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mapeamento de Tendências Comportamentais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Mapeamento de Tendências no Ambiente de Trabalho
            </CardTitle>
            <CardDescription>
              Avaliação de competências comportamentais para o contexto organizacional
            </CardDescription>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="text-center">
                <div className={cn(
                  'text-2xl font-bold',
                  getScoreColor(averageScore).split(' ')[0]
                )}>
                  {averageScore}
                </div>
                <div className="text-xs text-gray-500">Pontuação Geral</div>
              </div>
              
              <div className="flex-1">
                <Progress 
                  value={averageScore} 
                  className="h-2"
                />
              </div>
              
              <Badge className={getScoreColor(averageScore)}>
                {getScoreLabel(averageScore)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {Object.entries(workplaceTrends).map(([key, trend], index) => {
              const Icon = trendIcons[key as keyof typeof trendIcons]
              const isExpanded = expandedTrend === key
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md',
                      isExpanded ? 'ring-2 ring-purple-200 shadow-md' : ''
                    )}
                    onClick={() => setExpandedTrend(isExpanded ? null : key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn(
                            'p-2 rounded-lg',
                            getScoreColor(trend.score)
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {trendLabels[key as keyof typeof trendLabels]}
                              </h4>
                              
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'text-sm font-bold',
                                  getScoreColor(trend.score).split(' ')[0]
                                )}>
                                  {trend.score}
                                </span>
                                
                                <ArrowRight className={cn(
                                  'h-4 w-4 transition-transform duration-200',
                                  isExpanded ? 'rotate-90' : ''
                                )} />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Progress 
                                value={trend.score} 
                                className="h-1.5"
                              />
                              
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{getScoreLabel(trend.score)}</span>
                                <span>{trend.score}/100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {trend.description}
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Profissionais */}
      {professionalInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Insights Profissionais
              </CardTitle>
              <CardDescription>
                Análise específica para o ambiente corporativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pontos Fortes
                  </h4>
                  <ul className="space-y-2">
                    {professionalInsights.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Áreas de Desenvolvimento
                  </h4>
                  <ul className="space-y-2">
                    {professionalInsights.developmentAreas.map((area, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estilo de Trabalho</h4>
                  <p className="text-sm text-gray-700">{professionalInsights.workStyle}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estilo de Comunicação</h4>
                  <p className="text-sm text-gray-700">{professionalInsights.communicationStyle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sugestões Práticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 border-yellow-200/50">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-yellow-200/30">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg"
              >
                <Lightbulb className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
                  Sugestões Práticas para Aproveitamento Organizacional
                </h3>
                <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                  {practicalSuggestions.length} recomendações personalizadas
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Direcionamentos personalizados para maximizar seu potencial no ambiente de trabalho
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              {practicalSuggestions
                .slice(0, showAllSuggestions ? practicalSuggestions.length : 3)
                .map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                  }}
                  className="group relative flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 4 + index
                    }}
                    className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {suggestion}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="ml-3 text-xs bg-white/80 border-green-300 text-green-700 group-hover:bg-green-50 transition-colors duration-300"
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                </motion.div>
              ))}
              
              {practicalSuggestions.length > 3 && (
                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <motion.span
                      animate={{ scale: showAllSuggestions ? [1, 0.95, 1] : [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {showAllSuggestions 
                        ? 'Mostrar menos sugestões' 
                        : `Ver mais ${practicalSuggestions.length - 3} sugestões`
                      }
                    </motion.span>
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Profissionais */}
      {professionalInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Insights Profissionais
              </CardTitle>
              <CardDescription>
                Análise específica para o ambiente corporativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pontos Fortes
                  </h4>
                  <ul className="space-y-2">
                    {professionalInsights.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Áreas de Desenvolvimento
                  </h4>
                  <ul className="space-y-2">
                    {professionalInsights.developmentAreas.map((area, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estilo de Trabalho</h4>
                  <p className="text-sm text-gray-700">{professionalInsights.workStyle}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estilo de Comunicação</h4>
                  <p className="text-sm text-gray-700">{professionalInsights.communicationStyle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Base Científica */}
      {scientificBasis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <Brain className="h-5 w-5" />
                Fundamentação Científica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                {scientificBasis}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}