'use client'

import React from 'react'

interface SubtypesRingProps {
  subtypes: Array<{
    type: number
    instinct: string
    name: string
  }>
  typeColors: Record<number, { primary: string; secondary: string; accent: string }>
  instinctData: Record<string, { color: { primary: string; secondary: string; accent: string } }>
  calculateCircularPosition: (index: number, total: number, radius: number) => { x: number; y: number }
  harmonicSpacing: (index: number, total: number) => number
}

/**
 * Componente responsável pelo círculo externo com os 27 subtipos
 * Renderiza cada subtipo com cores e posicionamento específicos
 */
const SubtypesRing: React.FC<SubtypesRingProps> = ({
  subtypes,
  typeColors,
  instinctData,
  calculateCircularPosition,
  harmonicSpacing
}) => {
  return (
    <g className="subtypes-ring">
      {/* Círculo externo elaborado com 27 subtipos */}
      {subtypes.map((subtype, index) => {
        const position = calculateCircularPosition(index, 27, 280)
        const spacing = harmonicSpacing(index, 27)
        const typeColor = typeColors[subtype.type as keyof typeof typeColors]
        const instinctColor = instinctData[subtype.instinct]?.color
        
        return (
          <g key={`subtype-${index}`} className="subtype-group">
            {/* Círculo decorativo externo */}
            <circle
              cx={position.x}
              cy={position.y}
              r={spacing * 0.8}
              fill={`url(#typeGradient${subtype.type})`}
              stroke={typeColor.accent}
              strokeWidth="2"
              filter="url(#outerGlow)"
              opacity="0.7"
            />
            
            {/* Círculo principal do subtipo */}
            <circle
              cx={position.x}
              cy={position.y}
              r={spacing * 0.6}
              fill={`url(#instinctGradient${subtype.instinct})`}
              stroke={instinctColor?.primary || '#ffffff'}
              strokeWidth="2.5"
              filter="url(#depth3D)"
              className="subtype-circle"
            />
            
            {/* Círculo interno com brilho */}
            <circle
              cx={position.x}
              cy={position.y}
              r={spacing * 0.35}
              fill={typeColor.primary}
              stroke="#ffffff"
              strokeWidth="1.5"
              filter="url(#glow)"
              opacity="0.9"
            />
            
            {/* Número do tipo */}
            <text
              x={position.x}
              y={position.y + 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={spacing * 0.4}
              fontWeight="bold"
              fill="#ffffff"
              filter="url(#textShadow)"
              className="subtype-number"
            >
              {subtype.type}
            </text>
            
            {/* Indicador do instinto */}
            <circle
              cx={position.x + spacing * 0.4}
              cy={position.y - spacing * 0.4}
              r={spacing * 0.15}
              fill={instinctColor?.accent || '#ffffff'}
              stroke={instinctColor?.primary || '#000000'}
              strokeWidth="1"
              filter="url(#dropShadow)"
            />
            
            {/* Letra do instinto */}
            <text
              x={position.x + spacing * 0.4}
              y={position.y - spacing * 0.4 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={spacing * 0.2}
              fontWeight="bold"
              fill="#ffffff"
              filter="url(#textShadow)"
            >
              {subtype.instinct.charAt(0).toUpperCase()}
            </text>
            
            {/* Linha decorativa conectora */}
            <line
              x1={position.x}
              y1={position.y}
              x2={position.x * 0.85}
              y2={position.y * 0.85}
              stroke={typeColor.secondary}
              strokeWidth="1"
              opacity="0.4"
              strokeDasharray="2,2"
            />
          </g>
        )
      })}
      
      {/* Círculos decorativos entre subtipos */}
      {Array.from({ length: 27 }, (_, i) => {
        const angle = (i * 360 / 27) + (360 / 54) // Offset para ficar entre os subtipos
        const x = 300 + 260 * Math.cos((angle - 90) * Math.PI / 180)
        const y = 300 + 260 * Math.sin((angle - 90) * Math.PI / 180)
        
        return (
          <circle
            key={`decorator-${i}`}
            cx={x}
            cy={y}
            r="3"
            fill="#ffffff"
            opacity="0.3"
            filter="url(#glow)"
          />
        )
      })}
    </g>
  )
}

export default SubtypesRing