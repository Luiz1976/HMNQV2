'use client'

import React, { useState } from 'react'
import { enneagramSubtypes, instinctColors, typeColors, EnneagramSubtype } from '@/data/enneagram-subtypes'

interface EnneagramMandalaProps {
  highlightedSubtype?: string // Código do subtipo a ser destacado (ex: '1sp')
  onSubtypeClick?: (subtypeCode: string) => void
  size?: 'small' | 'medium' | 'large'
  showLabels?: boolean
}

const EnneagramMandala: React.FC<EnneagramMandalaProps> = ({
  highlightedSubtype,
  onSubtypeClick,
  size = 'medium',
  showLabels = true
}) => {
  const [hoveredSubtype, setHoveredSubtype] = useState<string | null>(null)

  // Configurações de tamanho
  const sizeConfig = {
    small: { container: 300, center: 40, inner: 80, middle: 120, outer: 150 },
    medium: { container: 400, center: 50, inner: 100, middle: 150, outer: 190 },
    large: { container: 500, center: 60, inner: 120, middle: 180, outer: 230 }
  }

  const config = sizeConfig[size]
  const centerX = config.container / 2
  const centerY = config.container / 2

  // Organizar subtipos por instinto
  const subtypesByInstinct = {
    sp: enneagramSubtypes.filter(s => s.instinct === 'sp'),
    so: enneagramSubtypes.filter(s => s.instinct === 'so'),
    sx: enneagramSubtypes.filter(s => s.instinct === 'sx')
  }

  // Função para calcular posição no círculo
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2 // Começar do topo
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  }

  // Renderizar um subtipo
  const renderSubtype = (subtype: EnneagramSubtype, position: { x: number; y: number }, radius: number) => {
    const isHighlighted = highlightedSubtype === subtype.code
    const isHovered = hoveredSubtype === subtype.code
    const baseColor = typeColors[subtype.type]
    const instinctColor = instinctColors[subtype.instinct]

    return (
      <g key={subtype.code}>
        {/* Círculo do subtipo */}
        <circle
          cx={position.x}
          cy={position.y}
          r={radius}
          fill={isHighlighted ? instinctColor : baseColor}
          stroke={isHighlighted || isHovered ? '#000' : '#fff'}
          strokeWidth={isHighlighted ? 3 : isHovered ? 2 : 1}
          className="cursor-pointer transition-all duration-200"
          opacity={isHighlighted ? 1 : isHovered ? 0.9 : 0.8}
          onMouseEnter={() => setHoveredSubtype(subtype.code)}
          onMouseLeave={() => setHoveredSubtype(null)}
          onClick={() => onSubtypeClick?.(subtype.code)}
        />
        
        {/* Número do tipo */}
        <text
          x={position.x}
          y={position.y - 2}
          textAnchor="middle"
          className="text-white font-bold pointer-events-none"
          fontSize={radius * 0.6}
        >
          {subtype.type}
        </text>
        
        {/* Instinto */}
        <text
          x={position.x}
          y={position.y + radius * 0.4}
          textAnchor="middle"
          className="text-white font-medium pointer-events-none"
          fontSize={radius * 0.3}
        >
          {subtype.instinct}
        </text>
        
        {/* Label do nome (se habilitado) */}
        {showLabels && (isHighlighted || isHovered) && (
          <text
            x={position.x}
            y={position.y + radius + 20}
            textAnchor="middle"
            className="text-gray-800 font-medium pointer-events-none"
            fontSize="12"
          >
            {subtype.name}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg
        width={config.container}
        height={config.container}
        className="drop-shadow-lg"
      >
        {/* Fundo */}
        <circle
          cx={centerX}
          cy={centerY}
          r={config.container / 2 - 10}
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        
        {/* Círculos guia */}
        <circle
          cx={centerX}
          cy={centerY}
          r={config.inner}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={config.middle}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={config.outer}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Centro - Logo do Eneagrama */}
        <circle
          cx={centerX}
          cy={centerY}
          r={config.center}
          fill="#059669"
          stroke="#047857"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          className="text-white font-bold"
          fontSize={config.center * 0.4}
        >
          27
        </text>
        
        {/* Subtipos Self-Preservation (círculo interno) */}
        {subtypesByInstinct.sp.map((subtype, index) => {
          const position = getCirclePosition(index, 9, config.inner)
          return renderSubtype(subtype, position, 18)
        })}
        
        {/* Subtipos Social (círculo médio) */}
        {subtypesByInstinct.so.map((subtype, index) => {
          const position = getCirclePosition(index, 9, config.middle)
          return renderSubtype(subtype, position, 18)
        })}
        
        {/* Subtipos Sexual (círculo externo) */}
        {subtypesByInstinct.sx.map((subtype, index) => {
          const position = getCirclePosition(index, 9, config.outer)
          return renderSubtype(subtype, position, 18)
        })}
      </svg>
      
      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: instinctColors.sp }}></div>
          <span>Autopreservação (SP)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: instinctColors.so }}></div>
          <span>Social (SO)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: instinctColors.sx }}></div>
          <span>Sexual/Um-a-um (SX)</span>
        </div>
      </div>
      
      {/* Informações do subtipo em hover */}
      {hoveredSubtype && (
        <div className="bg-white p-4 rounded-lg shadow-lg border max-w-md">
          {(() => {
            const subtype = enneagramSubtypes.find(s => s.code === hoveredSubtype)
            if (!subtype) return null
            return (
              <div>
                <h4 className="font-bold text-lg mb-2">
                  {subtype.name} ({subtype.code.toUpperCase()})
                </h4>
                <p className="text-gray-600 text-sm mb-2">{subtype.description}</p>
                <div className="text-xs text-gray-500">
                  Tipo {subtype.type} • Instinto {subtype.instinct.toUpperCase()}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default EnneagramMandala