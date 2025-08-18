'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Shield, Award, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ConfidenceData {
  overall: number
  technical: number
  behavioral: number
  reliability: number
}

interface ConfidenceIndicatorProps {
  confidence: ConfidenceData
  scientificBasis?: string[]
  analysisQuality?: 'high' | 'medium' | 'low'
}

export default function ConfidenceIndicator({ 
  confidence, 
  scientificBasis = [], 
  analysisQuality = 'high' 
}: ConfidenceIndicatorProps) {
  const getConfidenceColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 border-green-200'
    if (value >= 60) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const getQualityIcon = () => {
    switch (analysisQuality) {
      case 'high':
        return <Award className="h-5 w-5 text-green-600" />
      case 'medium':
        return <Shield className="h-5 w-5 text-yellow-600" />
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getQualityLabel = () => {
    switch (analysisQuality) {
      case 'high':
        return 'Alta Qualidade'
      case 'medium':
        return 'Qualidade Média'
      case 'low':
        return 'Qualidade Baixa'
    }
  }

  const getQualityColor = () => {
    switch (analysisQuality) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const confidenceMetrics = [
    {
      label: 'Confiança Geral',
      value: confidence.overall,
      description: 'Índice geral de confiabilidade da análise'
    },
    {
      label: 'Análise Técnica',
      value: confidence.technical,
      description: 'Precisão dos aspectos técnicos identificados'
    },
    {
      label: 'Perfil Comportamental',
      value: confidence.behavioral,
      description: 'Confiabilidade das interpretações comportamentais'
    },
    {
      label: 'Confiabilidade',
      value: confidence.reliability,
      description: 'Consistência e reprodutibilidade dos resultados'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Confidence Card */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Índice de Confiança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Confidence Score */}
            <div className={`p-6 rounded-lg border-2 ${getConfidenceBgColor(confidence.overall)}`}>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className={`text-4xl font-bold ${getConfidenceColor(confidence.overall)} mb-2`}
                >
                  {confidence.overall}%
                </motion.div>
                <p className="text-sm text-gray-600">Confiança Geral da Análise</p>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {confidenceMetrics.slice(1).map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className={`text-sm font-bold ${getConfidenceColor(metric.value)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2 mb-2"
                  />
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Quality */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getQualityIcon()}
            Qualidade da Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${getQualityColor()}`}>
            <div className="flex items-center gap-3 mb-3">
              {getQualityIcon()}
              <span className="font-medium">{getQualityLabel()}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {analysisQuality === 'high' && 'Análise realizada com alta precisão e confiabilidade. Todos os parâmetros técnicos foram adequadamente avaliados.'}
              {analysisQuality === 'medium' && 'Análise com boa qualidade, mas alguns aspectos podem necessitar de verificação adicional.'}
              {analysisQuality === 'low' && 'Análise com limitações. Recomenda-se cautela na interpretação dos resultados.'}
            </p>
            
            {/* Quality Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {analysisQuality === 'high' ? '95%' : analysisQuality === 'medium' ? '75%' : '55%'}
                </div>
                <div className="text-xs text-gray-600">Precisão</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {analysisQuality === 'high' ? '92%' : analysisQuality === 'medium' ? '78%' : '60%'}
                </div>
                <div className="text-xs text-gray-600">Completude</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {analysisQuality === 'high' ? '88%' : analysisQuality === 'medium' ? '72%' : '58%'}
                </div>
                <div className="text-xs text-gray-600">Consistência</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scientific Basis */}
      {scientificBasis.length > 0 && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Base Científica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scientificBasis.map((basis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{basis}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Nota:</strong> Esta análise é baseada em princípios científicos estabelecidos da grafologia 
                e deve ser interpretada por profissionais qualificados.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}