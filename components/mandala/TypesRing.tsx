'use client'

import React from 'react'

interface TypesRingProps {
  types: Array<{
    number: number
    name: string
  }>
  typeColors: Record<number, { primary: string; secondary: string; accent: string }>
  calculateCircularPosition: (index: number, total: number, radius: number) => { x: number; y: number }
  harmonicSpacing: (index: number, total: number) => number
}

/**
 * Componente responsável pelo círculo intermediário com os 9 tipos principais
 * Renderiza cada tipo com números, nomes e decorações elegantes
 */
const TypesRing: React.FC<TypesRingProps> = ({
  types,
  typeColors,
  calculateCircularPosition,
  harmonicSpacing
}) => {
  return (
    <g className="types-ring">
      {/* Anel intermediário com 9 tipos principais */}
      {types.map((type, index) => {
        const position = calculateCircularPosition(index, 9, 180)
        const spacing = harmonicSpacing(index, 9)
        const colors = typeColors[type.number as keyof typeof typeColors]
        
        return (
          <g key={`type-${type.number}`} className="type-group">
            {/* Círculo principal do tipo */}
            <circle
              cx={position.x}
              cy={position.y}
              r={spacing * 0.8}
              fill={`url(#typeGradient${type.number})`}
              stroke={colors.accent}
              strokeWidth="3"
              filter="url(#metallicRelief)"
              className="type-circle"
            />
            
            {/* Círculo interno com brilho */}
            <circle
              cx={position.x}
              cy={position.y}
              r={spacing * 0.6}
              fill={colors.primary}
              stroke="#ffffff"
              strokeWidth="2"
              filter="url(#intense3DGlow)"
              opacity="0.9"
            />
            
            {/* Número do tipo com tipografia elegante */}
            <text
              x={position.x}
              y={position.y - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={spacing * 0.6}
              fontWeight="bold"
              fontFamily="'Playfair Display', serif"
              fill="#ffffff"
              filter="url(#textShadow)"
              className="type-number"
            >
              {type.number}
            </text>
            
            {/* Nome do tipo */}
            <text
              x={position.x}
              y={position.y + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={spacing * 0.25}
              fontWeight="600"
              fontFamily="'Inter', sans-serif"
              fill="#ffffff"
              filter="url(#textShadow)"
              className="type-name"
            >
              {type.name.toUpperCase()}
            </text>
            
            {/* Linhas decorativas */}
            <g className="decorative-lines">
              <line
                x1={position.x - spacing * 0.9}
                y1={position.y}
                x2={position.x - spacing * 0.7}
                y2={position.y}
                stroke={colors.secondary}
                strokeWidth="2"
                opacity="0.7"
              />
              <line
                x1={position.x + spacing * 0.7}
                y1={position.y}
                x2={position.x + spacing * 0.9}
                y2={position.y}
                stroke={colors.secondary}
                strokeWidth="2"
                opacity="0.7"
              />
            </g>
            
            {/* Ornamentos nos cantos */}
            <g className="corner-ornaments">
              <circle
                cx={position.x - spacing * 0.5}
                cy={position.y - spacing * 0.5}
                r="2"
                fill={colors.accent}
                filter="url(#glow)"
              />
              <circle
                cx={position.x + spacing * 0.5}
                cy={position.y - spacing * 0.5}
                r="2"
                fill={colors.accent}
                filter="url(#glow)"
              />
              <circle
                cx={position.x - spacing * 0.5}
                cy={position.y + spacing * 0.5}
                r="2"
                fill={colors.accent}
                filter="url(#glow)"
              />
              <circle
                cx={position.x + spacing * 0.5}
                cy={position.y + spacing * 0.5}
                r="2"
                fill={colors.accent}
                filter="url(#glow)"
              />
            </g>
          </g>
        )
      })}
      
      {/* Círculo decorativo intermediário */}
      <circle
        cx="300"
        cy="300"
        r="200"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray="5,5"
      />
      
      {/* Pontos decorativos no círculo intermediário */}
      {Array.from({ length: 18 }, (_, i) => {
        const angle = i * 20
        const x = 300 + 200 * Math.cos((angle - 90) * Math.PI / 180)
        const y = 300 + 200 * Math.sin((angle - 90) * Math.PI / 180)
        
        return (
          <circle
            key={`intermediate-dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="#ffffff"
            opacity="0.4"
            filter="url(#glow)"
          />
        )
      })}
    </g>
  )
}

export default TypesRing