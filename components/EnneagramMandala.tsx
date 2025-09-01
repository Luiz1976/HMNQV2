'use client'

import React from 'react'
import MandalaDefinitions from './mandala/MandalaDefinitions'
import SubtypesRing from './mandala/SubtypesRing'
import TypesRing from './mandala/TypesRing'
import CenterSymbol from './mandala/CenterSymbol'
import MandalaStyles from './mandala/MandalaStyles'

interface EnneagramMandalaProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
  className?: string
}

const EnneagramMandala: React.FC<EnneagramMandalaProps> = ({
  dominantType,
  dominantInstinct,
  className = ''
}) => {
  // Cores vibrantes e saturadas dos tipos
  const typeColors = {
    1: { primary: '#FF4757', secondary: '#FF3742', accent: '#FF6B7A' }, // Vermelho vibrante
    2: { primary: '#FF6348', secondary: '#FF4757', accent: '#FF8A80' }, // Laranja coral
    3: { primary: '#FFA502', secondary: '#FF9500', accent: '#FFD54F' }, // Amarelo dourado
    4: { primary: '#A55EEA', secondary: '#9C27B0', accent: '#E1BEE7' }, // Roxo vibrante
    5: { primary: '#3742FA', secondary: '#2F3542', accent: '#7986CB' }, // Azul intenso
    6: { primary: '#2ED573', secondary: '#00D2D3', accent: '#4DB6AC' }, // Verde-azulado
    7: { primary: '#1DD1A1', secondary: '#00A8FF', accent: '#26C6DA' }, // Ciano vibrante
    8: { primary: '#2C2C54', secondary: '#40407A', accent: '#706FD3' }, // Azul escuro
    9: { primary: '#747D8C', secondary: '#57606F', accent: '#A4B0BE' }  // Cinza azulado
  }

  // Nomes dos tipos em inglês
  const typeNames = {
  1: 'PERFECCIONISTA RIGOROSO',
  2: 'PRESTATIVO ATENCIOSO',
  3: 'REALIZADOR COMPETITIVO',
  4: 'CRIATIVO INTENSO',
  5: 'ESPECIALISTA RESERVADO',
  6: 'LEAL QUESTIONADOR',
  7: 'VISIONÁRIO ENTUSIASTA',
  8: 'CONTROLADOR ATIVO',
  9: 'PACIFICADOR ADAPTATIVO'
}

  // Cores e símbolos elaborados dos instintos
  const instinctData = {
    sp: { 
      color: { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFB347' },
      symbol: '🏠', // Casa para self-preservation
      name: 'SELF-PRESERVATION'
    },
    so: { 
      color: { primary: '#4ECDC4', secondary: '#45B7B8', accent: '#6C5CE7' },
      symbol: '👥', // Pessoas para social
      name: 'SOCIAL'
    },
    sx: { 
      color: { primary: '#FF3838', secondary: '#FF6B6B', accent: '#FF8E53' },
      symbol: '⚡', // Raio para sexual/one-to-one
      name: 'SEXUAL/ONE-TO-ONE'
    }
  }

  // Função aprimorada para calcular posições no círculo com melhor espaçamento
  const getCirclePosition = (index: number, total: number, radius: number, startAngle = 0) => {
    const angle = (startAngle + (index * 360 / total)) * (Math.PI / 180)
    const x = 300 + radius * Math.cos(angle - Math.PI / 2)
    const y = 300 + radius * Math.sin(angle - Math.PI / 2)
    return { x, y, angle: angle * 180 / Math.PI }
  }
  
  // Função para calcular espaçamento harmônico
  const getHarmonicSpacing = (elementType: string) => {
    const spacings = {
      subtypes: { radius: 245, padding: 22 },
      types: { radius: 140, padding: 28 },
      center: { radius: 95, padding: 15 }
    }
    return spacings[elementType as keyof typeof spacings] || spacings.center
  }

  // Gerar posições harmoniosas para os 27 subtipos
  const generateSubtypePositions = () => {
    const positions = []
    const radius = 245 // Aumentado para melhor espaçamento
    const angleStep = 360 / 27 // 13.33 graus entre cada subtipo
    
    for (let i = 0; i < 27; i++) {
      const angle = (i * angleStep - 90) * (Math.PI / 180) // Começar do topo
      const type = Math.floor(i / 3) + 1
      const instincts = ['sp', 'so', 'sx']
      const instinct = instincts[i % 3]
      
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        type,
        instinct,
        instinctInfo: instinctData[instinct as keyof typeof instinctData]
      })
    }
    
    return positions
  }

  const subtypePositions = generateSubtypePositions()

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <MandalaStyles />
      <div className="flex justify-center">
        <svg viewBox="0 0 700 700" className="w-full h-auto max-w-3xl mandala-container">
          <MandalaDefinitions 
            typeColors={typeColors} 
            instinctData={instinctData} 
          />

          <SubtypesRing 
            subtypes={subtypePositions.map((pos, index) => ({
              type: pos.type,
              instinct: pos.instinct,
              name: `${pos.type}${pos.instinct}`
            }))}
            typeColors={typeColors}
            instinctData={instinctData}
            calculateCircularPosition={(index, total, radius) => {
              const angle = (index * 360 / total - 90) * (Math.PI / 180)
              return {
                x: 350 + radius * Math.cos(angle),
                y: 350 + radius * Math.sin(angle)
              }
            }}
            harmonicSpacing={(index, total) => 12}
          />

          <TypesRing 
            types={Object.entries(typeNames).map(([num, name]) => ({
              number: parseInt(num),
              name: name
            }))}
            typeColors={typeColors}
            calculateCircularPosition={(index, total, radius) => {
              const angle = (index * 360 / total - 90) * (Math.PI / 180)
              return {
                x: 350 + radius * Math.cos(angle),
                y: 350 + radius * Math.sin(angle)
              }
            }}
            harmonicSpacing={(index, total) => 25}
          />

          <CenterSymbol 
            typeColors={typeColors}
          />
        </svg>
      </div>
    </div>
  )
}

export default EnneagramMandala