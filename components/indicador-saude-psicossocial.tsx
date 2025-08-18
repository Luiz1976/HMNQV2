'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  AlertTriangle, 
  Activity, 
  Target,
  Shield,
  Heart,
  Brain,
  BarChart3,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'

interface IndicadorSaudePsicossocialProps {
  score: number // Pontuação de 251-800
  totalEmployees: number
  evaluationsCompleted: number
  onExpandView: () => void
  previousScore?: number
  lastUpdate?: string
  criticalAlerts?: number
  departmentBreakdown?: { name: string; score: number; employees: number }[]
  evaluationsData?: {
    humaniqRPO: number
    assedioMoral: number
    climaOrganizacional: number
    burnout: number
  }
}

interface ScoreRange {
  min: number
  max: number
  label: string
  color: string
  bgColor: string
  description: string
  recommendations: string[]
}

// Definição das faixas baseadas na imagem (251-800)
const scoreRanges: ScoreRange[] = [
  {
    min: 251,
    max: 300,
    label: 'RUIM',
    color: '#EF4444',
    bgColor: 'bg-red-50',
    description: 'Ambiente organizacional com sérios problemas de saúde psicossocial',
    recommendations: [
      'Implementar plano de ação emergencial',
      'Realizar diagnóstico detalhado por setor',
      'Buscar apoio de especialistas externos',
      'Considerar reestruturação organizacional'
    ]
  },
  {
    min: 301,
    max: 350,
    label: 'INCERTO',
    color: '#F97316',
    bgColor: 'bg-orange-50',
    description: 'Situação incerta que requer monitoramento constante',
    recommendations: [
      'Intensificar monitoramento dos indicadores',
      'Implementar ações preventivas direcionadas',
      'Revisar políticas de gestão de pessoas',
      'Fortalecer canais de comunicação'
    ]
  },
  {
    min: 351,
    max: 500,
    label: 'REGULAR',
    color: '#EAB308',
    bgColor: 'bg-yellow-50',
    description: 'Ambiente com condições aceitáveis, mas com potencial de melhoria',
    recommendations: [
      'Manter práticas atuais de gestão',
      'Implementar melhorias graduais',
      'Promover atividades de bem-estar',
      'Capacitar lideranças em gestão de pessoas'
    ]
  },
  {
    min: 501,
    max: 700,
    label: 'BOM',
    color: '#84CC16',
    bgColor: 'bg-lime-50',
    description: 'Bom ambiente psicossocial com práticas saudáveis estabelecidas',
    recommendations: [
      'Manter excelência nas práticas atuais',
      'Expandir boas práticas para outras áreas',
      'Investir em inovação e desenvolvimento',
      'Reconhecer e celebrar conquistas'
    ]
  },
  {
    min: 701,
    max: 800,
    label: 'EXCELENTE',
    color: '#22C55E',
    bgColor: 'bg-green-50',
    description: 'Excelente ambiente psicossocial, referência em saúde mental corporativa',
    recommendations: [
      'Manter padrão de excelência absoluta',
      'Liderar iniciativas de mercado',
      'Servir como modelo para outras organizações',
      'Certificar-se como referência em bem-estar'
    ]
  }
]

const IndicadorSaudePsicossocial: React.FC<IndicadorSaudePsicossocialProps> = ({
  score,
  totalEmployees,
  evaluationsCompleted,
  onExpandView,
  previousScore = score,
  lastUpdate = new Date().toLocaleString('pt-BR'),
  criticalAlerts = 0,
  departmentBreakdown = [],
  evaluationsData = {
    humaniqRPO: 0,
    assedioMoral: 0,
    climaOrganizacional: 0,
    burnout: 0
  }
}) => {
  const [animatedScore, setAnimatedScore] = useState(251)
  const [isVisible, setIsVisible] = useState(false)

  // Animação do score
  useEffect(() => {
    setIsVisible(true)
    const duration = 2000
    const steps = 60
    const increment = (score - 251) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setAnimatedScore(251 + (increment * currentStep))
      
      if (currentStep >= steps) {
        setAnimatedScore(score)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  // Função para obter a faixa atual do score
  const getCurrentRange = useMemo(() => {
    return scoreRanges.find(range => score >= range.min && score <= range.max) || scoreRanges[0]
  }, [score])

  // Cálculos de tendência
  const trendDirection = useMemo(() => {
    const diff = score - previousScore
    if (Math.abs(diff) < 5) return 'stable'
    return diff > 0 ? 'improving' : 'declining'
  }, [score, previousScore])

  const completionRate = useMemo(() => {
    return totalEmployees > 0 ? (evaluationsCompleted / totalEmployees) * 100 : 0
  }, [evaluationsCompleted, totalEmployees])

  // Função para calcular a posição no medidor (0-100%)
  const getScorePosition = (scoreValue: number) => {
    const normalizedScore = Math.max(251, Math.min(800, scoreValue))
    return ((normalizedScore - 251) / (800 - 251)) * 100
  }

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'improving':
        return 'text-green-600'
      case 'declining':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          Índice de Saúde Psicossocial
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            Análise Corporativa
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Medidor Principal Horizontal */}
        <div className="relative">
          {/* Título do medidor */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold mb-1" style={{ color: getCurrentRange.color }}>
              {Math.round(animatedScore)}
            </div>
            <div className="text-base font-semibold" style={{ color: getCurrentRange.color }}>
              {getCurrentRange.label}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {getCurrentRange.description}
            </div>
          </div>

          {/* Medidor horizontal */}
          <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            {/* Segmentos de cores */}
            <div className="absolute inset-0 flex">
              {scoreRanges.map((range, index) => {
                const width = ((range.max - range.min + 1) / (800 - 251 + 1)) * 100
                return (
                  <div
                    key={index}
                    className="h-full transition-all duration-300 hover:brightness-110"
                    style={{
                      width: `${width}%`,
                      backgroundColor: range.color,
                      opacity: 0.85
                    }}
                  />
                )
              })}
            </div>

            {/* Indicador de posição melhorado */}
            <div 
              className="absolute top-0 h-full transition-all duration-1000 ease-out"
              style={{ left: `${getScorePosition(animatedScore)}%` }}
            >
              {/* Ponteiro principal */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  {/* Sombra do ponteiro */}
                  <div className="absolute w-4 h-4 bg-black opacity-20 rounded-full transform translate-x-0.5 translate-y-0.5"></div>
                  {/* Ponteiro principal */}
                  <div className="w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg relative z-10">
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Linha indicadora */}
              <div className="absolute top-0 left-0 w-0.5 h-full bg-gray-800 shadow-sm transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Labels da escala */}
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>251</span>
            <span>300</span>
            <span>350</span>
            <span>500</span>
            <span>700</span>
            <span>800</span>
          </div>

          {/* Labels das categorias */}
          <div className="flex justify-between mt-1 text-xs font-medium">
            {scoreRanges.map((range, index) => (
              <span key={index} style={{ color: range.color }}>
                {range.label}
              </span>
            ))}
          </div>
        </div>

        {/* Estatísticas em Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow h-24 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-700">{totalEmployees}</p>
              <p className="text-xs text-blue-600 font-medium">Colaboradores</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow h-24 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-700">{evaluationsCompleted}</p>
              <p className="text-xs text-green-600 font-medium">Avaliações Realizadas</p>
              <div className="mt-1">
                <Progress value={completionRate} className="h-1.5" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow h-24 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-700">{completionRate.toFixed(0)}%</p>
              <p className="text-xs text-purple-600 font-medium">Taxa de Conclusão</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow h-24 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-1">
              {getTrendIcon()}
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${getTrendColor()}`}>
                {trendDirection === 'improving' ? '+' : trendDirection === 'declining' ? '-' : ''}
                {Math.abs(score - previousScore)}
              </p>
              <p className={`text-xs font-medium ${getTrendColor()}`}>
                {trendDirection === 'improving' ? 'Melhorando' : 
                 trendDirection === 'declining' ? 'Atenção' : 'Estável'}
              </p>
            </div>
          </div>
        </div>

        {/* Análise por Avaliações */}
        {Object.values(evaluationsData).some(value => value > 0) && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="text-base font-semibold text-indigo-800 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análise por Dimensão
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(evaluationsData).map(([key, value]) => {
                const evaluationNames = {
                  humaniqRPO: 'HumaniQ RPO',
                  assedioMoral: 'Assédio Moral',
                  climaOrganizacional: 'Clima Organizacional',
                  burnout: 'Burnout Assessment'
                }
                
                if (value === 0) return null
                
                return (
                  <div key={key} className="bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {evaluationNames[key as keyof typeof evaluationNames]}
                      </span>
                      <span className="text-base font-bold text-indigo-600">
                        {value}
                      </span>
                    </div>
                    <Progress value={(value / 800) * 100} className="h-1.5" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Alertas Críticos */}
        {criticalAlerts > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-base font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              Alertas Críticos ({criticalAlerts})
            </h3>
            <div className="bg-white p-3 rounded-lg border border-red-100">
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-800">Ação Imediata Necessária</p>
                  <p className="text-xs text-red-600 mt-1">
                    Identificados {criticalAlerts} casos que requerem intervenção urgente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
          <h3 className="text-base font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Recomendações Prioritárias
            <Badge className="bg-amber-100 text-amber-700 text-xs">
              {getCurrentRange.label}
            </Badge>
          </h3>
          <div className="space-y-2">
            {getCurrentRange.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-100">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold text-xs">{index + 1}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            onClick={onExpandView}
          >
            <BarChart3 className="h-4 w-4" />
            Análise Detalhada
          </Button>
          
          {criticalAlerts > 0 && (
            <Button 
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg animate-pulse flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Ações Urgentes
            </Button>
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Última atualização: {lastUpdate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>Próxima avaliação em 30 dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default IndicadorSaudePsicossocial