'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  AlertTriangle, 
  Activity, 
  Clock,
  Target,
  Shield,
  Heart,
  Brain,
  Eye,
  Info
} from 'lucide-react'

interface IndicadorRiscoPsicossocialProps {
  riskScore: number
  totalEmployees: number
  evaluationsCompleted: number
  onExpandView: () => void
  previousScore?: number
  targetScore?: number
  lastUpdate?: string
  criticalAlerts?: number
  showTrend?: boolean
  showTargetLine?: boolean
  isLoading?: boolean
  departmentBreakdown?: { name: string; score: number; employees: number }[]
}

interface RiskRange {
  min: number
  max: number
  label: string
  color: string
  bgColor: string
  textColor: string
  description: string
  recommendations: string[]
  message: string
}

// Definição das faixas de risco ajustadas para escala 0-15
const riskRanges: RiskRange[] = [
  {
    min: 0,
    max: 2,
    label: 'Risco Crítico',
    color: '#DC2626',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Ambiente de trabalho apresenta exposição crítica a fatores psicossociais',
    message: 'Situação crítica detectada. Intervenção imediata necessária para proteção da saúde mental dos colaboradores.',
    recommendations: [
      'Implementar plano de ação emergencial',
      'Realizar diagnóstico detalhado por setor',
      'Considerar afastamentos preventivos se necessário',
      'Buscar apoio de especialistas externos em saúde mental'
    ]
  },
  {
    min: 3,
    max: 5,
    label: 'Risco Alto',
    color: '#EA580C',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Alto risco psicossocial detectado no ambiente organizacional',
    message: 'Ambiente apresenta alta exposição a fatores psicossociais. Recomenda-se plano de ação com foco em assédio, sobrecarga e relações interpessoais.',
    recommendations: [
      'Desenvolver programa de prevenção estruturado',
      'Intensificar acompanhamento psicológico',
      'Revisar políticas organizacionais e processos',
      'Implementar ações corretivas prioritárias'
    ]
  },
  {
    min: 6,
    max: 8,
    label: 'Risco Moderado',
    color: '#CA8A04',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Risco moderado identificado, requer atenção e monitoramento',
    message: 'Fatores de risco moderados identificados. Recomenda-se diagnóstico setorial e implementação de ações preventivas.',
    recommendations: [
      'Monitorar indicadores regularmente',
      'Implementar ações preventivas direcionadas',
      'Fortalecer canais de comunicação interna',
      'Promover atividades de bem-estar e qualidade de vida'
    ]
  },
  {
    min: 9,
    max: 11,
    label: 'Risco Baixo',
    color: '#16A34A',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    description: 'Ambiente com baixo risco psicossocial, situação favorável',
    message: 'Ambiente organizacional apresenta baixo risco psicossocial. Manter práticas atuais e continuar monitoramento preventivo.',
    recommendations: [
      'Manter práticas atuais de gestão',
      'Continuar monitoramento preventivo regular',
      'Reforçar aspectos positivos identificados',
      'Compartilhar boas práticas com outras áreas'
    ]
  },
  {
    min: 12,
    max: 13,
    label: 'Muito Saudável',
    color: '#0891B2',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    description: 'Excelente ambiente psicossocial, referência organizacional',
    message: 'Ambiente organizacional exemplar em saúde psicossocial. Manter excelência e servir como modelo para outras organizações.',
    recommendations: [
      'Manter excelência atual nas práticas',
      'Servir como modelo para outras áreas/empresas',
      'Investir em inovação e crescimento sustentável',
      'Reconhecer e celebrar conquistas da equipe'
    ]
  },
  {
    min: 14,
    max: 15,
    label: 'Excelente',
    color: '#6366F1',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    description: 'Ambiente psicossocial excepcional, padrão de excelência',
    message: 'Ambiente organizacional de excelência absoluta em saúde psicossocial. Modelo de referência para o mercado.',
    recommendations: [
      'Manter padrão de excelência absoluta',
      'Liderar iniciativas de mercado em bem-estar',
      'Expandir práticas para toda a organização',
      'Certificar-se como referência em saúde mental corporativa'
    ]
  }
]

const IndicadorRiscoPsicossocial: React.FC<IndicadorRiscoPsicossocialProps> = ({
  riskScore,
  totalEmployees,
  evaluationsCompleted,
  onExpandView,
  previousScore = riskScore,
  targetScore = 12,
  lastUpdate = new Date().toLocaleString('pt-BR'),
  criticalAlerts = 0,
  showTrend = true,
  showTargetLine = true,
  isLoading = false,
  departmentBreakdown = []
}) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  // Configurações do medidor semicircular responsivo
  const width = 500
  const height = 320
  const centerX = width / 2
  const centerY = height - 80
  const outerRadius = 160
  const innerRadius = 100
  const strokeWidth = 2

  // Cálculos de tendência e progresso
  const trendDirection = useMemo(() => {
    const diff = riskScore - previousScore
    if (Math.abs(diff) < 0.1) return 'stable'
    return diff > 0 ? 'improving' : 'declining' // Maior score = melhor
  }, [riskScore, previousScore])

  const trendPercentage = useMemo(() => {
    const diff = Math.abs(riskScore - previousScore)
    return ((diff / 15) * 100).toFixed(1)
  }, [riskScore, previousScore])

  const progressToTarget = useMemo(() => {
    if (targetScore <= riskScore) return 100
    return Math.max(0, (riskScore / targetScore) * 100)
  }, [riskScore, targetScore])

  // Cores do gradiente de risco psicossocial (escala 0-15)
  const segmentColors = [
    '#DC2626', // 0: Vermelho crítico
    '#EF4444', // 1: Vermelho
    '#F87171', // 2: Vermelho claro
    '#FB923C', // 3: Laranja escuro
    '#F97316', // 4: Laranja
    '#FBBF24', // 5: Laranja claro
    '#FDE047', // 6: Amarelo
    '#FACC15', // 7: Amarelo claro
    '#A3E635', // 8: Amarelo-verde
    '#65A30D', // 9: Verde-amarelo
    '#16A34A', // 10: Verde
    '#059669', // 11: Verde escuro
    '#0891B2', // 12: Azul claro
    '#0284C7', // 13: Azul
    '#1D4ED8', // 14: Azul escuro
    '#6366F1'  // 15: Roxo
  ]

  // Função para converter coordenadas polares para cartesianas
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  // Criar segmentos do medidor (16 segmentos para escala 0-15)
  const segments = segmentColors.map((color, index) => {
    const segmentAngle = 180 / segmentColors.length // 11.25 graus por segmento
    const startAngle = 180 - (index * segmentAngle)
    const endAngle = 180 - ((index + 1) * segmentAngle)
    
    const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle)
    const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle)
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle)
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle)
    
    const largeArcFlag = segmentAngle <= 180 ? "0" : "1"
    
    const path = [
      "M", outerStart.x, outerStart.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
    
    return { 
      path, 
      color, 
      value: index,
      startAngle,
      endAngle
    }
  })

  // Calcular posição da agulha (ajustado para escala 0-15)
  const needleAngle = 180 - (animatedScore / 15) * 180
  const needleLength = outerRadius - 10
  const needleEnd = polarToCartesian(centerX, centerY, needleLength, needleAngle)

  // Animação suave do score com efeito de entrada
  useEffect(() => {
    setIsVisible(true)
    const duration = 1500 // 1.5 segundos
    const steps = 60
    const increment = riskScore / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setAnimatedScore(increment * currentStep)
      
      if (currentStep >= steps) {
        setAnimatedScore(riskScore)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [riskScore])

  // Função para obter a faixa de risco atual
  const getCurrentRiskRange = useCallback((score: number): RiskRange => {
    return riskRanges.find(range => score >= range.min && score <= range.max) || riskRanges[0]
  }, [])

  // Função para lidar com hover nos segmentos
  const handleSegmentHover = (event: React.MouseEvent, segmentIndex: number) => {
    const value = (segmentIndex + 0.5) // Valor médio do segmento
    setHoveredValue(value)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
    setHoveredValue(null)
  }

  const currentRange = useMemo(() => getCurrentRiskRange(riskScore), [riskScore, getCurrentRiskRange])
  const completionRate = useMemo(() => ((evaluationsCompleted / totalEmployees) * 100).toFixed(1), [evaluationsCompleted, totalEmployees])

  // Função para formatar tendência
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'improving': return 'text-green-600'
      case 'declining': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-700 ${
      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
    } ${isLoading ? 'animate-pulse' : ''}`}>
      <CardHeader className="text-center pb-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              Indicador de Risco Psicossocial
            </CardTitle>
          </div>
          {criticalAlerts > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {criticalAlerts} Alertas
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{evaluationsCompleted}/{totalEmployees} avaliados</span>
          </div>
          {showTrend && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">
                {trendDirection === 'stable' ? 'Estável' : 
                 trendDirection === 'improving' ? `+${trendPercentage}%` : `-${trendPercentage}%`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lastUpdate}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Medidor Semicircular - Réplica exata do pH */}
        <div className="relative flex justify-center mb-8">
          <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
            <svg width={width} height={height} className="drop-shadow-lg">
              {/* Definições de gradientes e filtros */}
              <defs>
                <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#e5e7eb" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
                <linearGradient id="targetLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#1d4ed8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Fundo do medidor com gradiente */}
              <path
                d={`M ${centerX - outerRadius} ${centerY} A ${outerRadius} ${outerRadius} 0 0 1 ${centerX + outerRadius} ${centerY}`}
                fill="none"
                stroke="url(#backgroundGradient)"
                strokeWidth="4"
              />
              
              {/* Linha de meta (target) */}
              {showTargetLine && (
                <g>
                  {(() => {
                    const targetAngle = 180 - (targetScore / 15) * 180
                    const targetStart = polarToCartesian(centerX, centerY, innerRadius - 10, targetAngle)
                    const targetEnd = polarToCartesian(centerX, centerY, outerRadius + 20, targetAngle)
                    return (
                      <>
                        <line
                          x1={targetStart.x}
                          y1={targetStart.y}
                          x2={targetEnd.x}
                          y2={targetEnd.y}
                          stroke="url(#targetLineGradient)"
                          strokeWidth="3"
                          strokeDasharray="5,3"
                          filter="url(#glow)"
                        />
                        <text
                          x={targetEnd.x}
                          y={targetEnd.y - 15}
                          textAnchor="middle"
                          className="text-xs font-bold fill-blue-600"
                        >
                          Meta: {targetScore}
                        </text>
                      </>
                    )
                  })()}
                </g>
              )}
              
              {/* Segmentos coloridos */}
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  stroke="#ffffff"
                  strokeWidth={strokeWidth}
                  className="transition-all duration-200 cursor-pointer hover:brightness-110"
                  onMouseMove={(e) => handleSegmentHover(e, index)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
              
              {/* Números da escala (0-15) */}
              {Array.from({ length: 16 }, (_, i) => {
                const angle = 180 - (i / 15) * 180
                const labelRadius = outerRadius + 45
                const labelPos = polarToCartesian(centerX, centerY, labelRadius, angle)
                
                return (
                  <text
                    key={i}
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-base font-bold fill-gray-700"
                    style={{ fontSize: '14px' }}
                  >
                    {i}
                  </text>
                )
              })}
              
              {/* Labels das extremidades para risco psicossocial */}
              <text
                x={centerX - outerRadius - 70}
                y={centerY + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold fill-red-600"
                transform={`rotate(-25, ${centerX - outerRadius - 70}, ${centerY + 15})`}
              >
                Risco Crítico
              </text>
              
              <text
                x={centerX}
                y={centerY - outerRadius - 50}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold fill-yellow-600"
              >
                Risco Moderado
              </text>
              
              <text
                x={centerX + outerRadius + 70}
                y={centerY + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold fill-indigo-600"
                transform={`rotate(25, ${centerX + outerRadius + 70}, ${centerY + 15})`}
              >
                Excelente
              </text>
              
              {/* Agulha aprimorada com efeitos visuais */}
              <g className="transition-transform duration-1000 ease-out" style={{ transform: `rotate(${needleAngle - 180}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}>
                {/* Sombra da agulha */}
                <polygon
                  points={`${centerX + 2},${centerY - 6} ${centerX - 2},${centerY - needleLength + 14} ${centerX + 6},${centerY - needleLength + 14}`}
                  fill="rgba(0,0,0,0.3)"
                  className="blur-sm"
                />
                
                {/* Agulha principal com gradiente */}
                <polygon
                  points={`${centerX},${centerY - 8} ${centerX - 4},${centerY - needleLength + 12} ${centerX + 4},${centerY - needleLength + 12}`}
                  fill={currentRange.color}
                  stroke="#1f2937"
                  strokeWidth="2"
                  filter="url(#glow)"
                  className="drop-shadow-lg"
                />
                
                {/* Centro da agulha com gradiente */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="12"
                  fill="url(#centerGradient)"
                  stroke="#1f2937"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                
                {/* Ponto central brilhante */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="4"
                  fill="white"
                  opacity="0.9"
                />
              </g>
              
              {/* Gradiente para o centro da agulha */}
              <radialGradient id="centerGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f9fafb" />
                <stop offset="70%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#374151" />
              </radialGradient>
            </svg>
            
            {/* Texto central - Título e valor */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xl font-bold text-gray-800 mb-1">Risco Psicossocial</div>
              <div 
                className="text-3xl font-bold mb-2" 
                style={{ color: currentRange.color }}
              >
                {animatedScore.toFixed(1)}
              </div>
              <div className="text-sm font-medium" style={{ color: currentRange.color }}>
                {currentRange.label}
              </div>
            </div>
          </div>
          
          {/* Tooltip interativo */}
          {showTooltip && hoveredValue !== null && (
            <div 
              className="fixed bg-gray-900 text-white p-3 rounded-lg shadow-xl z-50 max-w-xs pointer-events-none"
              style={{ 
                left: tooltipPosition.x + 10, 
                top: tooltipPosition.y - 60,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-sm font-medium">Valor: {hoveredValue.toFixed(1)}</div>
              <div className="text-xs text-gray-300 mt-1">
                {getCurrentRiskRange(hoveredValue).label}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getCurrentRiskRange(hoveredValue).message}
              </div>
            </div>
          )}
        </div>

        {/* Status e descrição atual */}
        <div className="text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: currentRange.bgColor }}>
          <Badge 
            className="px-4 py-2 text-sm font-semibold border-0 mb-3"
            style={{ 
              backgroundColor: currentRange.color,
              color: 'white'
            }}
          >
            {currentRange.label} - {riskScore.toFixed(1)}/15
          </Badge>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentRange.message}
          </p>
        </div>

        {/* Estatísticas aprimoradas em grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{totalEmployees}</p>
            <p className="text-sm text-blue-600 font-medium">Total de Colaboradores</p>
            {departmentBreakdown && (
              <p className="text-xs text-blue-500 mt-1">{departmentBreakdown.length} departamentos</p>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">{evaluationsCompleted}</p>
              <p className="text-sm text-green-600 font-medium">Avaliações Realizadas</p>
            <div className="mt-2">
              <Progress value={Number(completionRate)} className="h-2" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{Number(completionRate).toFixed(0)}%</p>
            <p className="text-sm text-purple-600 font-medium">Taxa de Conclusão</p>
            {showTargetLine && (
              <p className="text-xs text-purple-500 mt-1">Meta: {progressToTarget.toFixed(0)}%</p>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-700">{riskScore.toFixed(1)}</p>
            <p className="text-sm text-orange-600 font-medium">Score Geral</p>
            {showTrend && (
              <div className={`flex items-center justify-center gap-1 mt-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-xs font-medium">
                  {trendDirection === 'stable' ? 'Estável' : 
                   trendDirection === 'improving' ? 'Melhorando' : 'Atenção'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Alertas críticos */}
        {criticalAlerts > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Alertas Críticos ({criticalAlerts})
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-red-100 shadow-sm">
                <Heart className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Ação Imediata Necessária</p>
                  <p className="text-sm text-red-600 mt-1">
                    Identificados {criticalAlerts} casos que requerem intervenção urgente para bem-estar dos colaboradores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações prioritárias aprimoradas */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recomendações Prioritárias
            <Badge className="bg-amber-100 text-amber-700 text-xs">
              {currentRange.label}
            </Badge>
          </h3>
          <div className="space-y-3">
            {currentRange.recommendations.slice(0, 3).map((rec, index) => {
              const priorityIcons = [Brain, Heart, Shield]
              const PriorityIcon = priorityIcons[index] || Target
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <PriorityIcon className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                        Prioridade {index + 1}
                      </span>
                      <span className="text-xs text-amber-600">
                        {index === 0 ? 'Crítica' : index === 1 ? 'Alta' : 'Média'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Botões de ação aprimorados */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            onClick={onExpandView}
          >
            <BarChart3 className="h-5 w-5" />
            Análise Detalhada
          </Button>
          
          <Button 
            variant="outline"
            className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            onClick={() => console.log('Exportar relatório')}
          >
            <Eye className="h-5 w-5" />
            Exportar Relatório
          </Button>
          
          {criticalAlerts > 0 && (
            <Button 
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse flex items-center gap-2"
              onClick={() => console.log('Ações de emergência')}
            >
              <AlertTriangle className="h-5 w-5" />
              Ações Urgentes
            </Button>
          )}
        </div>
        
        {/* Informações adicionais */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Última atualização: {lastUpdate}</span>
            </div>
            {showTrend && (
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>Tendência: {trendDirection === 'improving' ? 'Melhorando' : trendDirection === 'declining' ? 'Atenção necessária' : 'Estável'}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Próxima avaliação em 30 dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default IndicadorRiscoPsicossocial