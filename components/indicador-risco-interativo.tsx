'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, TrendingUp, TrendingDown, Minus, History, RefreshCw, Bell, Info, Target, Activity } from 'lucide-react'

interface IndicadorRiscoInterativoProps {
  riskValue: number // Valor de 0 a 100
  className?: string
  showTrend?: boolean
  lastUpdate?: string
  interactive?: boolean
  onValueChange?: (value: number) => void
  showHistory?: boolean
  showAlerts?: boolean
  targetValue?: number
  companyName?: string
}

export default function IndicadorRiscoInterativo({ 
  riskValue, 
  className = '', 
  showTrend = true,
  lastUpdate = new Date().toLocaleString('pt-BR'),
  interactive = false,
  onValueChange,
  showHistory = true,
  showAlerts = true,
  targetValue = 25,
  companyName = 'Sua Empresa'
}: IndicadorRiscoInterativoProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [previousValue, setPreviousValue] = useState(riskValue)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [history, setHistory] = useState<Array<{value: number, date: string}>>([{value: riskValue, date: lastUpdate}])
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  
  // Garantir que o valor está no intervalo correto
  const normalizedValue = Math.max(0, Math.min(100, riskValue))
  
  // Animação suave do ponteiro
  useEffect(() => {
    const duration = 1500 // 1.5 segundos
    const steps = 60
    const stepValue = (normalizedValue - animatedValue) / steps
    
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setAnimatedValue(prev => {
        const newValue = prev + stepValue
        if (currentStep >= steps) {
          clearInterval(interval)
          return normalizedValue
        }
        return newValue
      })
    }, duration / steps)
    
    return () => clearInterval(interval)
  }, [normalizedValue])
  
  // Detectar mudança de valor para mostrar tendência e atualizar histórico
  useEffect(() => {
    if (riskValue !== previousValue) {
      setPreviousValue(riskValue)
      setHistory(prev => [
        ...prev.slice(-9), // Manter apenas os últimos 10 registros
        { value: riskValue, date: lastUpdate }
      ])
    }
  }, [riskValue, previousValue, lastUpdate])
  
  // Função para calcular a média dos últimos valores
  const getAverageRisk = useCallback(() => {
    if (history.length === 0) return 0
    const sum = history.reduce((acc, item) => acc + item.value, 0)
    return Math.round(sum / history.length)
  }, [history])
  
  // Função para verificar se precisa de alerta
  const needsAlert = useCallback(() => {
    return normalizedValue > 70 || (targetValue && normalizedValue > targetValue + 10)
  }, [normalizedValue, targetValue])
  
  // Função para obter a cor baseada no valor
  const getColorForValue = (value: number) => {
    if (value <= 30) return '#22c55e' // Verde - Baixo Risco
    if (value <= 60) return '#eab308' // Amarelo - Moderado
    if (value <= 80) return '#f97316' // Laranja - Alto
    return '#dc2626' // Vermelho - Crítico
  }
  
  // Função para obter o nível de risco
  const getRiskLevel = (value: number) => {
    if (value <= 30) return 'Baixo Risco'
    if (value <= 60) return 'Moderado Risco'
    if (value <= 80) return 'Alto Risco'
    return 'Crítico'
  }
  
  // Função para obter o ícone baseado no valor
  const getRiskIcon = (value: number) => {
    if (value <= 30) return CheckCircle
    if (value <= 60) return AlertCircle
    if (value <= 80) return AlertTriangle
    return XCircle
  }
  
  // Função para obter recomendações
  const getRecommendation = (value: number) => {
    if (value <= 30) return 'Mantenha as práticas atuais de bem-estar. Continue monitorando regularmente.'
    if (value <= 60) return 'Recomenda-se acompanhamento mensal e workshops de gestão de estresse.'
    if (value <= 80) return 'Necessário acompanhamento semanal e intervenções específicas de suporte psicológico.'
    return 'Intervenção imediata necessária. Contate profissionais especializados em saúde mental.'
  }
  
  // Função para calcular tendência
  const getTrend = () => {
    const diff = normalizedValue - previousValue
    if (Math.abs(diff) < 1) return { icon: Minus, text: 'Estável', color: 'text-gray-500' }
    if (diff > 0) return { icon: TrendingUp, text: 'Aumentando', color: 'text-red-500' }
    return { icon: TrendingDown, text: 'Diminuindo', color: 'text-green-500' }
  }
  
  // Criar segmentos da escala horizontal
  const createScaleSegments = () => {
    const segments = []
    const segmentWidth = 600 / 100 // 600px total width, 100 segments
    
    for (let i = 0; i < 100; i++) {
      const x = i * segmentWidth
      const color = getColorForValue(i)
      
      segments.push(
        <rect
          key={i}
          x={x}
          y={0}
          width={segmentWidth}
          height={40}
          fill={color}
          opacity={0.8}
        />
      )
    }
    
    return segments
  }
  
  // Função para lidar com clique/arraste no medidor
  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !isDragging) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / 600) * 100))
    
    if (onValueChange) {
      onValueChange(Math.round(percentage))
    }
    
    // Atualizar posição do tooltip
    setTooltipPosition({ x: event.clientX, y: event.clientY })
    setShowTooltip(true)
  }
  
  // Função para animação suave do ponteiro
  const animateToValue = (targetValue: number) => {
    setIsAnimating(true)
    const startValue = normalizedValue
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentAnimValue = startValue + (targetValue - startValue) * easeOut
      
      setAnimatedValue(Math.round(currentAnimValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }
  
  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive) return
    setIsDragging(true)
    handlePointerMove(event)
  }
  
  const handlePointerUp = () => {
    setIsDragging(false)
    setShowTooltip(false)
  }
  
  const handlePointerLeave = () => {
    setIsDragging(false)
    setShowTooltip(false)
    setIsHovering(false)
  }
  
  const trend = getTrend()
  const TrendIcon = trend.icon
  const RiskIcon = getRiskIcon(normalizedValue)
  
  return (
    <Card className={`w-full ${className} transition-all duration-300 hover:shadow-lg ${needsAlert() ? 'ring-2 ring-red-200 shadow-red-100' : ''}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              {companyName}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Atualizado: {lastUpdate}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {showAlerts && needsAlert() && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                <Bell className="w-3 h-3 mr-1" />
                Alerta
              </Badge>
            )}
            {showTrend && (
              <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                <TrendIcon className="w-3 h-3" />
                <span>{trend.text}</span>
              </div>
            )}
            {showHistory && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className="text-xs h-6 px-2"
              >
                <History className="w-3 h-3 mr-1" />
                Histórico
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <RiskIcon className="w-6 h-6" style={{ color: getColorForValue(normalizedValue) }} />
          Indicador Interativo de Risco Psicossocial
        </CardTitle>
        <div className="flex items-center justify-center gap-3 mt-3">
          <Badge 
            variant={normalizedValue <= 30 ? 'default' : normalizedValue <= 60 ? 'secondary' : 'destructive'}
            className="text-lg font-medium px-4 py-2"
            style={{ backgroundColor: getColorForValue(normalizedValue), color: 'white' }}
          >
            {getRiskLevel(normalizedValue)}
          </Badge>
          <span className="text-6xl font-bold" style={{ color: getColorForValue(normalizedValue) }}>
            {normalizedValue.toFixed(0)}/100
          </span>
          {targetValue && (
            <div className="flex items-center gap-1 text-lg text-gray-600">
              <Target className="w-6 h-6" />
              <span>Meta: {targetValue}</span>
            </div>
          )}
        </div>
        
        {/* Painel de Histórico */}
        {showHistoryPanel && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <History className="w-6 h-6" />
                Histórico de Valores
              </h4>
              <Badge variant="outline" className="text-sm">
                Média: {getAverageRisk()}
              </Badge>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {history.slice(-5).reverse().map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.date}</span>
                  <Badge 
                    variant="outline" 
                    className="text-sm"
                    style={{ borderColor: getColorForValue(item.value), color: getColorForValue(item.value) }}
                  >
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Progresso da Meta */}
        {targetValue && (
          <div className="w-full max-w-md space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progresso da Meta</span>
              <span className={`font-medium ${normalizedValue <= targetValue ? 'text-green-600' : 'text-red-600'}`}>
                {normalizedValue <= targetValue ? '✓ Meta Atingida' : `${Math.abs(normalizedValue - targetValue)} acima da meta`}
              </span>
            </div>
            <Progress 
              value={Math.min(100, (targetValue / normalizedValue) * 100)} 
              className="h-2"
            />
          </div>
        )}
        
        {/* Medidor Horizontal Aprimorado */}
        <div className="relative w-full max-w-md">
          <svg 
            width="600" 
            height="160" 
            viewBox="0 0 600 160" 
            className={`overflow-visible ${interactive ? 'cursor-pointer' : ''} transition-all duration-300`}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Definições de gradientes e filtros */}
            <defs>
              <linearGradient id="scaleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="30%" stopColor="#22c55e" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
              </filter>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Fundo da escala com sombra */}
            <rect x="0" y="50" width="600" height="40" fill="#f8fafc" rx="20" filter="url(#shadow)" />
            
            {/* Escala com gradiente */}
            <rect x="0" y="50" width="600" height="40" fill="url(#scaleGradient)" rx="20" opacity="0.9" />
            
            {/* Meta visual */}
            {targetValue && (
              <g>
                <line 
                  x1={(targetValue / 100) * 600} 
                  y1="40" 
                  x2={(targetValue / 100) * 600} 
                  y2="100" 
                  stroke="#059669" 
                  strokeWidth="6" 
                  strokeDasharray="10,10"
                  className="animate-pulse"
                />
                <text 
                  x={(targetValue / 100) * 600} 
                  y="30" 
                  textAnchor="middle" 
                  className="text-sm font-bold fill-green-700"
                >
                  Meta
                </text>
              </g>
            )}
            
            {/* Bordas da escala */}
            <rect x="0" y="50" width="600" height="40" fill="none" stroke="#e2e8f0" strokeWidth="4" rx="20" />
            
            {/* Marcações principais com labels melhorados */}
            {[0, 30, 60, 80, 100].map(value => {
              const x = (value / 100) * 600
              const isActive = Math.abs(animatedValue - value) < 5
              return (
                <g key={value}>
                  <line 
                    x1={x} 
                    y1={isActive ? "36" : "40"} 
                    x2={x} 
                    y2={isActive ? "104" : "100"} 
                    stroke={isActive ? getColorForValue(value) : "#64748b"} 
                    strokeWidth={isActive ? "6" : "4"}
                    className="transition-all duration-300"
                  />
                  <text 
                    x={x} 
                    y="130" 
                    textAnchor="middle" 
                    className={`text-sm font-medium transition-all duration-300 ${
                      isActive ? 'fill-gray-800 font-bold' : 'fill-gray-600'
                    }`}
                  >
                    {value}
                  </text>
                  <text 
                    x={x} 
                    y="150" 
                    textAnchor="middle" 
                    className="text-sm fill-gray-500"
                  >
                    {value <= 30 ? 'Baixo' : value <= 60 ? 'Moderado' : value <= 80 ? 'Alto' : 'Crítico'}
                  </text>
                </g>
              )
            })}
            
            {/* Ponteiro aprimorado */}
            <g transform={`translate(${(animatedValue / 100) * 600}, 70)`}>
              {/* Sombra do ponteiro */}
              <polygon
                points="4,-26 -12,14 20,14"
                fill="rgba(0,0,0,0.2)"
                className="transition-all duration-300"
              />
              {/* Ponteiro principal */}
              <polygon
                points="0,-30 -16,10 16,10"
                fill={getColorForValue(animatedValue)}
                stroke="white"
                strokeWidth={isDragging ? "6" : "4"}
                filter={isHovering || isDragging || needsAlert() ? "url(#glow)" : "url(#shadow)"}
                className={`transition-all duration-300 ${
                  normalizedValue > 80 || needsAlert() ? 'animate-pulse' : ''
                } ${isHovering || isDragging ? 'scale-110' : ''} ${isAnimating ? 'animate-pulse' : ''}`}
              />
              {/* Centro do ponteiro */}
              <circle
                cx="0"
                cy="0"
                r={isHovering || isDragging ? "10" : "8"}
                fill={getColorForValue(animatedValue)}
                stroke="white"
                strokeWidth="4"
                filter={needsAlert() || isHovering || isDragging ? "url(#glow)" : "url(#shadow)"}
                className={`transition-all duration-300 ${needsAlert() ? 'animate-pulse' : ''}`}
              />
              {/* Valor atual no ponteiro */}
              <text
                x="0"
                y="-40"
                textAnchor="middle"
                className={`text-sm font-bold transition-all duration-300 ${
                  isHovering || isDragging ? 'opacity-100' : 'opacity-0'
                } animate-fade-in`}
                fill={getColorForValue(animatedValue)}
              >
                {Math.round(animatedValue)}
              </text>
              
              {/* Círculo de feedback visual */}
              {isDragging && (
                <circle 
                  cx="0" 
                  cy="0" 
                  r="30" 
                  fill="none" 
                  stroke={getColorForValue(animatedValue)} 
                  strokeWidth="4" 
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
            </g>
          </svg>
        </div>
        
        {/* Legenda */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-medium w-full max-w-2xl">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Baixo Risco</div>
              <div className="text-xs text-green-600">0-30</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-semibold text-yellow-800">Moderado</div>
              <div className="text-xs text-yellow-600">31-60</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-semibold text-orange-800">Alto Risco</div>
              <div className="text-xs text-orange-600">61-80</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-semibold text-red-800">Crítico</div>
              <div className="text-xs text-red-600">81-100</div>
            </div>
          </div>
        </div>
        
        {/* Estatísticas e Insights */}
        <div className="w-full max-w-2xl space-y-6">
          <Separator />
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-3">
              <Activity className="w-7 h-7" />
              Estatísticas e Insights
            </h3>
            
            {/* Resumo Estatístico */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-medium text-blue-800">Risco Atual</span>
                </div>
                <div className="text-4xl font-bold text-blue-900">{normalizedValue}</div>
                <div className="text-sm text-blue-600">{getRiskLevel(normalizedValue)}</div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <History className="w-6 h-6 text-purple-600" />
                  <span className="text-lg font-medium text-purple-800">Média Histórica</span>
                </div>
                <div className="text-4xl font-bold text-purple-900">{getAverageRisk()}</div>
                <div className="text-sm text-purple-600">Últimas {history.length} medições</div>
              </div>
              
              {targetValue && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-green-600" />
                    <span className="text-lg font-medium text-green-800">Meta Definida</span>
                  </div>
                  <div className="text-4xl font-bold text-green-900">{targetValue}</div>
                  <div className="text-sm text-green-600">
                    {normalizedValue <= targetValue ? 'Meta atingida!' : `Faltam ${(normalizedValue - targetValue).toFixed(1)} pontos`}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Nível atual e recomendação */}
          <div className="text-center space-y-3">
            <div className="text-lg font-semibold" style={{ color: getColorForValue(normalizedValue) }}>
              Nível Atual: {getRiskLevel(normalizedValue)}
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
              <strong>Recomendação:</strong> {getRecommendation(normalizedValue)}
            </div>
            
            {/* Insights Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Análise de Tendência</span>
                </div>
                <p className="text-yellow-700">
                  {normalizedValue > previousValue 
                    ? 'O risco aumentou desde a última medição. Monitore de perto.' 
                    : normalizedValue < previousValue 
                    ? 'Boa notícia! O risco diminuiu desde a última medição.' 
                    : 'O risco mantém-se estável desde a última medição.'}
                </p>
              </div>
              
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-800">Status da Meta</span>
                </div>
                <p className="text-indigo-700">
                  {targetValue 
                    ? normalizedValue <= targetValue 
                      ? `Parabéns! Você está ${targetValue - normalizedValue} pontos abaixo da meta.`
                      : `Atenção: ${normalizedValue - targetValue} pontos acima da meta estabelecida.`
                    : 'Defina uma meta para acompanhar o progresso.'}
                </p>
              </div>
            </div>
            
            {interactive && (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 italic bg-gray-100 p-2 rounded">
                  💡 Dica: Clique e arraste no medidor para simular diferentes níveis de risco
                </div>
                
                {/* Botões de Cenários Rápidos */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => animateToValue(15)}
                    className="px-6 py-3 text-lg bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors font-medium"
                    disabled={isAnimating}
                  >
                    🟢 Baixo Risco
                  </button>
                  <button
                    onClick={() => animateToValue(45)}
                    className="px-6 py-3 text-lg bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors font-medium"
                    disabled={isAnimating}
                  >
                    🟡 Moderado
                  </button>
                  <button
                    onClick={() => animateToValue(70)}
                    className="px-6 py-3 text-lg bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors font-medium"
                    disabled={isAnimating}
                  >
                    🟠 Alto Risco
                  </button>
                  <button
                    onClick={() => animateToValue(90)}
                    className="px-6 py-3 text-lg bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium"
                    disabled={isAnimating}
                  >
                    🔴 Crítico
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Tooltip Flutuante */}
      {showTooltip && interactive && (
        <div 
          className="fixed z-50 px-6 py-4 bg-black text-white text-lg rounded-lg shadow-lg pointer-events-none transition-opacity duration-200"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 80,
            opacity: showTooltip ? 1 : 0
          }}
        >
          <div className="font-semibold">{normalizedValue}/100</div>
          <div className="text-sm opacity-75">{getRiskLevel(normalizedValue)}</div>
          <div 
            className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black"
            style={{ transform: 'translateY(100%)' }}
          />
        </div>
      )}
    </Card>
  )
}