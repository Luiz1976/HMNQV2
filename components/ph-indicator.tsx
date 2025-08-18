'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PHIndicatorProps {
  value: number // Valor entre 0 e 14
  title?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const PHIndicator: React.FC<PHIndicatorProps> = ({ 
  value, 
  title = "pH Scale", 
  className = "",
  size = 'md'
}) => {
  // Garantir que o valor está entre 0 e 14
  const clampedValue = Math.max(0, Math.min(14, value))
  
  // Calcular o ângulo da agulha (180 graus total)
  const angle = (clampedValue / 14) * 180 - 90
  
  // Definir cores para cada segmento do pH
  const getSegmentColor = (segment: number) => {
    const colors = [
      '#dc2626', // 0 - Vermelho escuro
      '#ef4444', // 1 - Vermelho
      '#f97316', // 2 - Laranja
      '#f59e0b', // 3 - Amarelo escuro
      '#eab308', // 4 - Amarelo
      '#84cc16', // 5 - Verde claro
      '#22c55e', // 6 - Verde
      '#10b981', // 7 - Verde neutro
      '#06b6d4', // 8 - Ciano
      '#0ea5e9', // 9 - Azul claro
      '#3b82f6', // 10 - Azul
      '#6366f1', // 11 - Índigo
      '#8b5cf6', // 12 - Violeta
      '#a855f7', // 13 - Roxo
      '#9333ea'  // 14 - Roxo escuro
    ]
    return colors[segment] || '#6b7280'
  }
  
  // Obter rótulo do pH
  const getPHLabel = (value: number) => {
    if (value < 7) return 'Acidic'
    if (value === 7) return 'Neutral'
    return 'Alkaline'
  }
  
  // Definir tamanhos
  const sizes = {
    sm: { width: 200, height: 120, radius: 80, strokeWidth: 12 },
    md: { width: 300, height: 180, radius: 120, strokeWidth: 18 },
    lg: { width: 400, height: 240, radius: 160, strokeWidth: 24 }
  }
  
  const { width, height, radius, strokeWidth } = sizes[size]
  const centerX = width / 2
  const centerY = height - 20
  
  return (
    <Card className={`${className} bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height} className="overflow-visible">
            {/* Segmentos coloridos do medidor */}
            {Array.from({ length: 15 }, (_, i) => {
              const startAngle = (i / 14) * 180 - 90
              const endAngle = ((i + 1) / 14) * 180 - 90
              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180
              
              const x1 = centerX + (radius - strokeWidth / 2) * Math.cos(startAngleRad)
              const y1 = centerY + (radius - strokeWidth / 2) * Math.sin(startAngleRad)
              const x2 = centerX + (radius - strokeWidth / 2) * Math.cos(endAngleRad)
              const y2 = centerY + (radius - strokeWidth / 2) * Math.sin(endAngleRad)
              
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
              
              return (
                <path
                  key={i}
                  d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius - strokeWidth / 2} ${radius - strokeWidth / 2} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={getSegmentColor(i)}
                  stroke="white"
                  strokeWidth="1"
                />
              )
            })}
            
            {/* Números da escala */}
            {Array.from({ length: 15 }, (_, i) => {
              const angle = (i / 14) * 180 - 90
              const angleRad = (angle * Math.PI) / 180
              const textRadius = radius + 20
              const x = centerX + textRadius * Math.cos(angleRad)
              const y = centerY + textRadius * Math.sin(angleRad)
              
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold fill-slate-700 dark:fill-slate-300"
                >
                  {i}
                </text>
              )
            })}
            
            {/* Agulha indicadora */}
            <g transform={`rotate(${angle} ${centerX} ${centerY})`}>
              <polygon
                points={`${centerX},${centerY - 8} ${centerX + radius - 30},${centerY} ${centerX},${centerY + 8}`}
                fill="#1f2937"
                stroke="white"
                strokeWidth="2"
              />
            </g>
            
            {/* Centro da agulha */}
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="#1f2937"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Rótulos Acidic, Neutral, Alkaline */}
            <text
              x={centerX - radius + 40}
              y={centerY + 40}
              textAnchor="middle"
              className="text-sm font-bold fill-red-600"
            >
              Acidic
            </text>
            <text
              x={centerX}
              y={centerY + 50}
              textAnchor="middle"
              className="text-sm font-bold fill-green-600"
            >
              Neutral
            </text>
            <text
              x={centerX + radius - 40}
              y={centerY + 40}
              textAnchor="middle"
              className="text-sm font-bold fill-blue-600"
            >
              Alkaline
            </text>
          </svg>
        </div>
        
        {/* Valor atual e classificação */}
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {clampedValue.toFixed(1)}
          </div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {getPHLabel(clampedValue)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PHIndicator