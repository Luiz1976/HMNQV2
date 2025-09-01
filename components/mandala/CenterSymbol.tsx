'use client'

import React from 'react'

interface CenterSymbolProps {
  typeColors: Record<number, { primary: string; secondary: string; accent: string }>
}

/**
 * Componente responsável pelo símbolo central do eneagrama
 * Inclui o símbolo geométrico, texto e decorações centrais
 */
const CenterSymbol: React.FC<CenterSymbolProps> = ({ typeColors }) => {
  return (
    <g className="center-symbol">
      {/* Seção central elaborada */}
      <g className="central-section">
        {/* Círculos decorativos concêntricos */}
        <circle cx="300" cy="300" r="120" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3" strokeDasharray="3,3" />
        <circle cx="300" cy="300" r="110" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
        <circle cx="300" cy="300" r="100" fill="url(#enneagramCenterGradient)" stroke="#ffffff" strokeWidth="3" filter="url(#intense3DGlow)" />
        <circle cx="300" cy="300" r="90" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <circle cx="300" cy="300" r="80" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeDasharray="2,2" />
        
        {/* Símbolo do Eneagrama com linhas coloridas */}
        <g className="enneagram-symbol" filter="url(#dropShadow)">
          {/* Círculo externo do símbolo */}
          <circle cx="300" cy="300" r="70" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
          
          {/* Pontos do eneagrama */}
          {[1,2,3,4,5,6,7,8,9].map((point) => {
            const angle = ((point - 1) * 40) - 90
            const x = 300 + 70 * Math.cos(angle * Math.PI / 180)
            const y = 300 + 70 * Math.sin(angle * Math.PI / 180)
            const colors = typeColors[point as keyof typeof typeColors]
            
            return (
              <circle
                key={`enneagram-point-${point}`}
                cx={x}
                cy={y}
                r="6"
                fill={colors.primary}
                stroke="#ffffff"
                strokeWidth="2"
                filter="url(#glow)"
              />
            )
          })}
          
          {/* Linhas internas do eneagrama (triângulo) */}
          <g stroke="#ff6b6b" strokeWidth="2" opacity="0.8" filter="url(#glow)">
            <line x1={300 + 70 * Math.cos(0 * Math.PI / 180)} y1={300 + 70 * Math.sin(0 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(120 * Math.PI / 180)} y2={300 + 70 * Math.sin(120 * Math.PI / 180)} />
            <line x1={300 + 70 * Math.cos(120 * Math.PI / 180)} y1={300 + 70 * Math.sin(120 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(240 * Math.PI / 180)} y2={300 + 70 * Math.sin(240 * Math.PI / 180)} />
            <line x1={300 + 70 * Math.cos(240 * Math.PI / 180)} y1={300 + 70 * Math.sin(240 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(0 * Math.PI / 180)} y2={300 + 70 * Math.sin(0 * Math.PI / 180)} />
          </g>
          
          {/* Linhas internas do eneagrama (hexágono) */}
          <g stroke="#4ecdc4" strokeWidth="2" opacity="0.8" filter="url(#glow)">
            <line x1={300 + 70 * Math.cos(40 * Math.PI / 180)} y1={300 + 70 * Math.sin(40 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(200 * Math.PI / 180)} y2={300 + 70 * Math.sin(200 * Math.PI / 180)} />
            <line x1={300 + 70 * Math.cos(80 * Math.PI / 180)} y1={300 + 70 * Math.sin(80 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(280 * Math.PI / 180)} y2={300 + 70 * Math.sin(280 * Math.PI / 180)} />
            <line x1={300 + 70 * Math.cos(160 * Math.PI / 180)} y1={300 + 70 * Math.sin(160 * Math.PI / 180)} 
                  x2={300 + 70 * Math.cos(320 * Math.PI / 180)} y2={300 + 70 * Math.sin(320 * Math.PI / 180)} />
          </g>
        </g>
        
        {/* Texto central "integrative ENNEAGRAM" */}
        <g className="center-text">
          <text
            x="300"
            y="285"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="300"
            fontFamily="'Inter', sans-serif"
            fill="#333333"
            filter="url(#textShadow)"
            letterSpacing="2px"
          >
            integrative
          </text>
          <text
            x="300"
            y="305"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="bold"
            fontFamily="'Playfair Display', serif"
            fill="#333333"
            filter="url(#textShadow)"
            letterSpacing="3px"
          >
            ENNEAGRAM
          </text>
        </g>
        
        {/* Pequenos círculos ornamentais */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30
          const x = 300 + 50 * Math.cos((angle - 90) * Math.PI / 180)
          const y = 300 + 50 * Math.sin((angle - 90) * Math.PI / 180)
          
          return (
            <circle
              key={`ornamental-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="#ffffff"
              opacity="0.6"
              filter="url(#glow)"
            />
          )
        })}
        
        {/* Estrelas decorativas */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45
          const x = 300 + 35 * Math.cos((angle - 90) * Math.PI / 180)
          const y = 300 + 35 * Math.sin((angle - 90) * Math.PI / 180)
          
          return (
            <g key={`star-${i}`} transform={`translate(${x}, ${y})`}>
              <polygon
                points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1"
                fill="#ffffff"
                opacity="0.4"
                filter="url(#glow)"
              />
            </g>
          )
        })}
      </g>
    </g>
  )
}

export default CenterSymbol