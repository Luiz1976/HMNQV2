'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface IndicadorRiscoSemicircularProps {
  riskValue: number // Valor de 0 a 15
  className?: string
  showTrend?: boolean
  lastUpdate?: string
}

export default function IndicadorRiscoSemicircular({ 
  riskValue, 
  className = '', 
  showTrend = true,
  lastUpdate = new Date().toLocaleString('pt-BR')
}: IndicadorRiscoSemicircularProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [previousValue, setPreviousValue] = useState(riskValue)
  
  // Garantir que o valor está no intervalo correto
  const normalizedValue = Math.max(0, Math.min(15, riskValue))
  
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
  
  // Detectar mudança de valor para mostrar tendência
  useEffect(() => {
    if (riskValue !== previousValue) {
      setPreviousValue(riskValue)
    }
  }, [riskValue, previousValue])
  
  // Calcular o ângulo do ponteiro (180 graus para semicírculo, compensando inversão vertical)
  // Com a escala invertida verticalmente, o ponteiro deve ir de 180° (esquerda/0) para 0° (direita/15)
  const angle = 180 - (animatedValue / 15) * 180
  
  // Função para obter a cor baseada no valor
  const getColorForValue = (value: number) => {
    if (value <= 3) return '#22c55e' // Verde escuro
    if (value <= 6) return '#eab308' // Amarelo
    if (value <= 10) return '#f97316' // Laranja
    return '#dc2626' // Vermelho
  }
  
  // Função para obter o nível de risco
  const getRiskLevel = (value: number) => {
    if (value <= 3) return 'Baixo'
    if (value <= 6) return 'Médio'
    if (value <= 10) return 'Alto'
    return 'Crítico'
  }
  
  // Função para calcular tendência
  const getTrend = () => {
    const diff = normalizedValue - previousValue
    if (Math.abs(diff) < 0.1) return { icon: Minus, text: 'Estável', color: 'text-gray-500' }
    if (diff > 0) return { icon: TrendingUp, text: 'Aumentando', color: 'text-red-500' }
    return { icon: TrendingDown, text: 'Diminuindo', color: 'text-green-500' }
  }
  
  // Criar segmentos da escala (orientação anti-horária)
  const createScaleSegments = () => {
    const segments = []
    const colors = [
      '#22c55e', '#22c55e', '#22c55e', '#22c55e', // 0-3: Verde (esquerda)
      '#eab308', '#eab308', '#eab308', // 4-6: Amarelo
      '#f97316', '#f97316', '#f97316', '#f97316', // 7-10: Laranja
      '#dc2626', '#dc2626', '#dc2626', '#dc2626', '#dc2626' // 11-15: Vermelho (direita)
    ]
    
    for (let i = 0; i < 15; i++) {
      // Sentido anti-horário: começar em 180° (esquerda) e ir até 0° (direita)
      const startAngle = 180 - (i / 15) * 180
      const endAngle = 180 - ((i + 1) / 15) * 180
      const color = colors[i]
      
      const x1 = 150 + 80 * Math.cos(startAngle * Math.PI / 180)
      const y1 = 150 + 80 * Math.sin(startAngle * Math.PI / 180)
      const x2 = 150 + 100 * Math.cos(startAngle * Math.PI / 180)
      const y2 = 150 + 100 * Math.sin(startAngle * Math.PI / 180)
      
      const x3 = 150 + 100 * Math.cos(endAngle * Math.PI / 180)
      const y3 = 150 + 100 * Math.sin(endAngle * Math.PI / 180)
      const x4 = 150 + 80 * Math.cos(endAngle * Math.PI / 180)
      const y4 = 150 + 80 * Math.sin(endAngle * Math.PI / 180)
      
      segments.push(
        <path
          key={i}
          d={`M ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} L ${x3} ${y3} A 100 100 0 0 0 ${x4} ${y4} Z`}
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      )
    }
    
    return segments
  }
  
  // Criar números da escala (orientação anti-horária)
  const createScaleNumbers = () => {
    const numbers = []
    for (let i = 0; i <= 15; i += 3) {
      // Sentido anti-horário: 0 na esquerda (180°), 15 na direita (0°)
      const angle = 180 - (i / 15) * 180
      const x = 150 + 110 * Math.cos(angle * Math.PI / 180)
      const y = 150 + 110 * Math.sin(angle * Math.PI / 180)
      
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          {i}
        </text>
      )
    }
    return numbers
  }
  
  const trend = getTrend()
  const TrendIcon = trend.icon
  
  return (
    <Card className={`w-full ${className} transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            Atualizado: {lastUpdate}
          </Badge>
          {showTrend && (
            <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
              <TrendIcon className="w-3 h-3" />
              <span>{trend.text}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Indicador de Risco Psicossocial
        </CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge 
            variant={normalizedValue <= 3 ? 'default' : normalizedValue <= 6 ? 'secondary' : normalizedValue <= 10 ? 'destructive' : 'destructive'}
            className="text-sm font-medium"
          >
            {getRiskLevel(normalizedValue)}
          </Badge>
          <span className="text-2xl font-bold" style={{ color: getColorForValue(normalizedValue) }}>
            {normalizedValue.toFixed(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {/* Gráfico Semicircular */}
        <div className="relative">
          <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible" style={{transform: 'scaleY(-1)'}}>
            {/* Segmentos coloridos da escala */}
            {createScaleSegments()}
            
            {/* Marcações numéricas */}
            {createScaleNumbers()}
            
            {/* Ponteiro */}
            <g 
              transform={`translate(150, 150) rotate(${angle}) scaleY(-1)`}
              className={`transition-transform duration-300 ease-out ${
                normalizedValue > 10 ? 'animate-pulse' : ''
              }`}
            >
              <polygon
                points="0,-2 80,-1 80,1 0,2"
                fill="#000000"
                stroke="#000000"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="#000000"
                stroke="white"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#fff"
              />
            </g>
            
            {/* Valor atual */}
            <text
              x="150"
              y="180"
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-800"
              style={{transform: 'scaleY(-1)'}}
            >
              {normalizedValue.toFixed(1)}
            </text>
          </svg>
        </div>
        
        {/* Legenda */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-medium w-full max-w-md">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 border border-green-200">
            <div className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></div>
            <div>
              <div className="font-semibold text-green-800">Baixo</div>
              <div className="text-xs text-green-600">0-3</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
            <div>
              <div className="font-semibold text-yellow-800">Médio</div>
              <div className="text-xs text-yellow-600">4-6</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-orange-50 border border-orange-200">
            <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
            <div>
              <div className="font-semibold text-orange-800">Alto</div>
              <div className="text-xs text-orange-600">7-10</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 border border-red-200">
            <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></div>
            <div>
              <div className="font-semibold text-red-800">Crítico</div>
              <div className="text-xs text-red-600">11-15</div>
            </div>
          </div>
        </div>
        
        {/* Nível atual */}
        <div className="mt-3 text-center">
          <span className="text-lg font-semibold" style={{ color: getColorForValue(normalizedValue) }}>
            Nível: {getRiskLevel(normalizedValue)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}