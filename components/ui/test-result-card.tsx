'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MiniChart } from '@/components/ui/mini-chart'
import { Eye, Download, Brain, Users, Palette, Building2, FileText, TrendingUp, Award, Clock, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TestResultCardProps {
  id: string
  title: string
  category: string
  testType: string
  completedAt: string
  overallScore: number | null
  status: string
  chartData: any[]
  collaboratorName?: string
  percentile?: number
  isLoadingPDF?: boolean
  aiAnalysis?: {
    id: string
    analysis: string
    confidence: number
    analysisType: string
    metadata: any
    createdAt: string
    professionalReport?: string
    hasAnalysis: boolean
  } | null
  onView: () => void
  onDownloadPDF: () => void
}

export function TestResultCard({
  id,
  title,
  category,
  testType,
  completedAt,
  overallScore,
  status,
  chartData,
  collaboratorName,
  percentile,
  isLoadingPDF = false,
  aiAnalysis,
  onView,
  onDownloadPDF
}: TestResultCardProps) {
  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'PSYCHOSOCIAL': return Brain
      case 'PERSONALITY': return Users
      case 'GRAPHOLOGY': return Palette
      case 'CORPORATE': return Building2
      default: return FileText
    }
  }

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'PSYCHOSOCIAL': return {
        primary: 'bg-blue-500',
        light: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100'
      }
      case 'PERSONALITY': return {
        primary: 'bg-green-500',
        light: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:bg-green-100'
      }
      case 'GRAPHOLOGY': return {
        primary: 'bg-purple-500',
        light: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100'
      }
      case 'CORPORATE': return {
        primary: 'bg-orange-500',
        light: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100'
      }
      default: return {
        primary: 'bg-gray-500',
        light: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100'
      }
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIndicator = (score: number | null, testType: string) => {
    if (score === null) return 'Aguardando Análise'
    
    switch (testType) {
      case 'PSYCHOSOCIAL':
        if (score >= 80) return 'Perfil Estável'
        if (score >= 60) return 'Perfil Moderado'
        return 'Risco Elevado'
      case 'PERSONALITY':
        if (score >= 80) return 'Alta Compatibilidade'
        if (score >= 60) return 'Boa Compatibilidade'
        return 'Baixa Compatibilidade'
      case 'CORPORATE':
        if (score >= 80) return 'Alta Satisfação'
        if (score >= 60) return 'Satisfação Moderada'
        return 'Baixa Satisfação'
      default:
        if (score >= 80) return 'Excelente'
        if (score >= 60) return 'Bom'
        return 'Necessita Atenção'
    }
  }



  const getAIAnalysisStatus = (aiAnalysis: any) => {
    if (!aiAnalysis || !aiAnalysis.hasAnalysis) {
      return {
        status: 'Pendente',
        description: 'Análise IA em processamento',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock
      }
    }
    
    return {
      status: 'Análise Completa',
      description: 'Análise de IA disponível',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: CheckCircle
    }
  }

  const Icon = getTestTypeIcon(testType)
  const colors = getTestTypeColor(testType)
  const scoreColor = getScoreColor(overallScore)
  const statusIndicator = getStatusIndicator(overallScore, testType)

  return (
    <Card className={`bg-white border-2 ${colors.border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden`}>
      {/* Header com cor temática */}
      <div className={`h-2 ${colors.primary}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${colors.light} ${colors.hover} transition-colors`}>
              <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 leading-tight">{title}</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {category}
              </CardDescription>
              {collaboratorName && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {collaboratorName}
                </p>
              )}
            </div>
          </div>
          
          <Badge 
            variant={status === 'CONCLUIDO' ? 'default' : 'secondary'}
            className={`${status === 'CONCLUIDO' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} font-medium`}
          >
            {status === 'CONCLUIDO' ? 'Concluído' : 'Em Andamento'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mini Gráfico */}
        <div className="h-40 bg-gray-50 rounded-lg p-3">
          <MiniChart 
            type={testType === 'PERSONALITY' ? 'radar' : testType === 'PSYCHOSOCIAL' ? 'bar' : 'pie'}
            data={chartData} 
            color={colors.text.replace('text-', '').replace('-600', '')}
          />
        </div>
        
        {/* Informações do Resultado */}
        <div className="space-y-3">
          {/* Pontuação e Indicador */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {overallScore !== null && (
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${scoreColor}`}>
                      {overallScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Pontuação</div>
                  </div>
                )}
                
                {percentile && (
                  <div className="text-center">
                    <div className="text-xl font-semibold text-blue-600 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1" />
                      {percentile}º
                    </div>
                    <div className="text-xs text-gray-500">Percentil</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Badge variant="outline" className={`${colors.text} ${colors.border} font-medium px-3 py-1`}>
                {statusIndicator}
              </Badge>
            </div>
          </div>
          
          {/* Confiança da Análise IA */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Confiança da Análise IA</span>
              </div>
              {aiAnalysis?.hasAnalysis && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Análise IA
                </Badge>
              )}
            </div>
            
            {(() => {
              const aiStatus = getAIAnalysisStatus(aiAnalysis)
              const StatusIcon = aiStatus.icon
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{aiStatus.status}</p>
                      <p className="text-xs text-gray-600">{aiStatus.description}</p>
                    </div>
                  </div>
                  
                  {aiAnalysis?.hasAnalysis && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {format(new Date(aiAnalysis.createdAt), 'dd/MM/yy', { locale: ptBR })}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        {aiAnalysis.analysisType === 'COMPREHENSIVE' ? 'Completa' : 
                         aiAnalysis.analysisType === 'BASIC' ? 'Básica' : 'Padrão'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })()
            }
          </div>
          
          {/* Data e Tempo */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(completedAt), 'dd/MM/yyyy \\à\\s HH:mm', { locale: ptBR })}</span>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex space-x-3 pt-3">
            <Button
              variant="outline"
              size="default"
              onClick={onView}
              className={`flex-1 ${colors.hover} ${colors.border} ${colors.text} font-medium transition-all hover:shadow-md py-2.5`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            
            <Button
               variant="outline"
               size="default"
               onClick={onDownloadPDF}
               disabled={isLoadingPDF}
               className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 font-medium transition-all hover:shadow-md disabled:opacity-50 px-4 py-2.5"
             >
               {isLoadingPDF ? (
                 <RefreshCw className="h-4 w-4 animate-spin" />
               ) : (
                 <Download className="h-4 w-4" />
               )}
               <span>PDF</span>
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}