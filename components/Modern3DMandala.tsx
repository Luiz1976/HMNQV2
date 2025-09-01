'use client'

import React, { useState, useRef, useEffect } from 'react'
import Modern3DStyles from './mandala/Modern3DStyles'
import WebGLEffects from './mandala/WebGLEffects'

interface Modern3DMandalaProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
  className?: string
}

const Modern3DMandala: React.FC<Modern3DMandalaProps> = ({
  dominantType,
  dominantInstinct,
  className = ''
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [zoom, setZoom] = useState(1)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)

  // Cores vibrantes e saturadas dos tipos com profundidade 3D
  const typeColors = {
    1: { 
      primary: '#FF4757', 
      secondary: '#FF3742', 
      accent: '#FF6B7A',
      shadow: '#CC2E3F',
      highlight: '#FF8A9B'
    },
    2: { 
      primary: '#FF6348', 
      secondary: '#FF4757', 
      accent: '#FF8A80',
      shadow: '#CC3E2E',
      highlight: '#FFA399'
    },
    3: { 
      primary: '#FFA502', 
      secondary: '#FF9500', 
      accent: '#FFD54F',
      shadow: '#CC7A00',
      highlight: '#FFEB3B'
    },
    4: { 
      primary: '#A55EEA', 
      secondary: '#9C27B0', 
      accent: '#E1BEE7',
      shadow: '#7B1FA2',
      highlight: '#F3E5F5'
    },
    5: { 
      primary: '#3742FA', 
      secondary: '#2F3542', 
      accent: '#7986CB',
      shadow: '#1A237E',
      highlight: '#C5CAE9'
    },
    6: { 
      primary: '#2ED573', 
      secondary: '#00D2D3', 
      accent: '#4DB6AC',
      shadow: '#00695C',
      highlight: '#B2DFDB'
    },
    7: { 
      primary: '#1DD1A1', 
      secondary: '#00A8FF', 
      accent: '#26C6DA',
      shadow: '#0097A7',
      highlight: '#B2EBF2'
    },
    8: { 
      primary: '#2C2C54', 
      secondary: '#40407A', 
      accent: '#706FD3',
      shadow: '#1A1A2E',
      highlight: '#9FA8DA'
    },
    9: { 
      primary: '#747D8C', 
      secondary: '#57606F', 
      accent: '#A4B0BE',
      shadow: '#37474F',
      highlight: '#CFD8DC'
    }
  }

  // Nomes dos tipos
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

  // Dados dos instintos com cores 3D
  const instinctData = {
    sp: { 
      color: { 
        primary: '#FF6B35', 
        secondary: '#F7931E', 
        accent: '#FFB347',
        shadow: '#E65100',
        highlight: '#FFE0B2'
      },
      symbol: '🏠',
      name: 'SELF-PRESERVATION'
    },
    so: { 
      color: { 
        primary: '#4ECDC4', 
        secondary: '#45B7B8', 
        accent: '#6C5CE7',
        shadow: '#00695C',
        highlight: '#E0F2F1'
      },
      symbol: '👥',
      name: 'SOCIAL'
    },
    sx: { 
      color: { 
        primary: '#FF3838', 
        secondary: '#FF6B6B', 
        accent: '#FF8E53',
        shadow: '#C62828',
        highlight: '#FFCDD2'
      },
      symbol: '⚡',
      name: 'SEXUAL/ONE-TO-ONE'
    }
  }

  // Advanced interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsInteracting(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
    setVelocity({ x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    setVelocity({ x: deltaX * 0.1, y: deltaY * 0.1 })
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.3,
      y: prev.y + deltaX * 0.3,
      z: prev.z + (deltaX - deltaY) * 0.1
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsInteracting(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsInteracting(false)
    setHoveredElement(null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05
    setZoom(prev => Math.max(0.3, Math.min(4, prev * zoomFactor)))
  }

  const handleElementHover = (elementId: string) => {
    setHoveredElement(elementId)
  }

  const handleElementLeave = () => {
    setHoveredElement(null)
  }

  // Momentum and smooth animations
  useEffect(() => {
    if (!isDragging && (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1)) {
      const animate = () => {
        setVelocity(prev => ({
          x: prev.x * 0.95,
          y: prev.y * 0.95
        }))
        
        setRotation(prev => ({
          x: prev.x + velocity.y * 0.1,
          y: prev.y + velocity.x * 0.1,
          z: prev.z + (velocity.x - velocity.y) * 0.05
        }))
        
        if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [velocity, isDragging])

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setIsInteracting(true)
      setLastMousePos({ x: touch.clientX, y: touch.clientY })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - lastMousePos.x
    const deltaY = touch.clientY - lastMousePos.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.3,
      y: prev.y + deltaX * 0.3,
      z: prev.z + (deltaX - deltaY) * 0.1
    }))
    
    setLastMousePos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsInteracting(false)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel as any, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel as any)
    }
  }, [])

  // Função para calcular posições circulares
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total - 90) * (Math.PI / 180)
    return {
      x: 525 + radius * Math.cos(angle),
      y: 525 + radius * Math.sin(angle),
      angle: angle * 180 / Math.PI
    }
  }

  // Gerar posições para os 27 subtipos
  const generateSubtypePositions = () => {
    const positions = []
    const radius = 420
    
    for (let i = 0; i < 27; i++) {
      const type = Math.floor(i / 3) + 1
      const instincts = ['sp', 'so', 'sx']
      const instinct = instincts[i % 3]
      const pos = getCirclePosition(i, 27, radius)
      
      positions.push({
        ...pos,
        type,
        instinct,
        instinctInfo: instinctData[instinct as keyof typeof instinctData]
      })
    }
    
    return positions
  }

  const subtypePositions = generateSubtypePositions()

  return (
    <div className={`modern-3d-mandala-container ${className}`}>
      <Modern3DStyles />
      <WebGLEffects />
      <style jsx>{`
        .modern-3d-mandala-container {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 2000px;
          overflow: hidden;
          position: relative;
        }
        
        .mandala-3d-wrapper {
          width: 1050px;
          height: 1050px;
          transform-style: preserve-3d;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: grab;
          position: relative;
        }
        
        .mandala-3d-wrapper:active {
          cursor: grabbing;
        }
        
        .mandala-3d-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.15));
          transform-style: preserve-3d;
        }
        
        .subtype-3d {
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .subtype-3d:hover {
          transform: translateZ(30px) scale(1.2);
          filter: brightness(1.3) saturate(1.4);
        }
        
        .type-3d {
          transform-style: preserve-3d;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .type-3d:hover {
          transform: translateZ(50px) scale(1.25);
          filter: brightness(1.4) saturate(1.5);
        }
        
        .center-3d {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .center-3d:hover {
          transform: translateZ(70px) scale(1.1);
          filter: brightness(1.2);
        }
        
        .floating-animation {
          animation: float3d 6s ease-in-out infinite;
        }
        
        .rotating-animation {
          animation: rotate3d 20s linear infinite;
        }
        
        .pulsing-animation {
          animation: pulse3d 4s ease-in-out infinite;
        }
        
        @keyframes float3d {
          0%, 100% { transform: translateZ(0px) rotateX(0deg); }
          50% { transform: translateZ(20px) rotateX(5deg); }
        }
        
        @keyframes rotate3d {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        
        @keyframes pulse3d {
          0%, 100% { transform: scale(1) translateZ(0px); }
          50% { transform: scale(1.05) translateZ(10px); }
        }
        
        .performance-optimized {
          will-change: transform;
          backface-visibility: hidden;
          transform-origin: center center;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .floating-animation,
          .rotating-animation,
          .pulsing-animation {
            animation: none;
          }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="mandala-3d-wrapper performance-optimized"
        style={{
          transform: `
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            rotateZ(${rotation.z}deg) 
            scale3d(${zoom}, ${zoom}, ${zoom})
          `
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <svg 
          viewBox="0 0 1050 1050" 
          className="mandala-3d-svg"
          style={{ background: 'transparent' }}
        >
          {/* Definições avançadas de gradientes e filtros 3D */}
          <defs>
            {/* Gradientes 3D para tipos */}
            {Object.entries(typeColors).map(([type, colors]) => (
              <g key={`gradients-${type}`}>
                <radialGradient id={`type3d-${type}`} cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.9" />
                  <stop offset="30%" stopColor={colors.primary} stopOpacity="1" />
                  <stop offset="70%" stopColor={colors.secondary} stopOpacity="1" />
                  <stop offset="100%" stopColor={colors.shadow} stopOpacity="0.8" />
                </radialGradient>
                <linearGradient id={`type3d-border-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.highlight} />
                  <stop offset="50%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor={colors.shadow} />
                </linearGradient>
              </g>
            ))}
            
            {/* Gradientes 3D para instintos */}
            {Object.entries(instinctData).map(([instinct, data]) => (
              <radialGradient key={`instinct3d-${instinct}`} id={`instinct3d-${instinct}`} cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor={data.color.highlight} stopOpacity="0.9" />
                <stop offset="40%" stopColor={data.color.primary} stopOpacity="1" />
                <stop offset="80%" stopColor={data.color.secondary} stopOpacity="1" />
                <stop offset="100%" stopColor={data.color.shadow} stopOpacity="0.7" />
              </radialGradient>
            ))}
            
            {/* Filtros 3D avançados */}
            <filter id="depth3d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset in="blur" dx="4" dy="8" result="offsetBlur" />
              <feFlood floodColor="#000000" floodOpacity="0.3" />
              <feComposite in2="offsetBlur" operator="in" result="shadow" />
              <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="dilated" />
              <feFlood floodColor="#ffffff" floodOpacity="0.6" />
              <feComposite in2="dilated" operator="in" result="highlight" />
              <feOffset in="highlight" dx="-2" dy="-4" result="offsetHighlight" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="offsetHighlight" />
              </feMerge>
            </filter>
            
            <filter id="glow3d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
            
            <filter id="metallic3d" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feSpecularLighting in="blur" result="specOut" lightingColor="white" specularConstant="2" specularExponent="20">
                <fePointLight x="-50" y="-100" z="200" />
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2" />
              <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
          
          {/* Círculo externo com 27 subtipos em 3D */}
          <g className="subtypes-ring-3d floating-animation">
            {subtypePositions.map((pos, index) => {
              const typeColor = typeColors[pos.type as keyof typeof typeColors]
              const instinctColor = pos.instinctInfo.color
              
              return (
                <g key={`subtype-${index}`} className="subtype-3d performance-optimized">
                  {/* Círculo principal com gradiente 3D */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={hoveredElement === `subtype-${index}` ? "27" : "22"}
                    fill={`url(#type3d-${pos.type})`}
                    stroke={`url(#type3d-border-${pos.type})`}
                    strokeWidth="3"
                    filter={hoveredElement === `subtype-${index}` 
                      ? "url(#metallicSurface) url(#realisticLighting) url(#caustics)" 
                      : "url(#metallicSurface) url(#realisticLighting)"}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => handleElementHover(`subtype-${index}`)}
                    onMouseLeave={handleElementLeave}
                  />
                  
                  {/* Círculo interno do instinto */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={`url(#instinct3d-${pos.instinct})`}
                    filter="url(#glow3d)"
                  />
                  
                  {/* Número do tipo */}
                  <text
                    x={pos.x}
                    y={pos.y + 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="white"
                    filter="url(#depth3d)"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    {pos.type}
                  </text>
                  
                  {/* Símbolo do instinto */}
                  <text
                    x={pos.x}
                    y={pos.y - 35}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    filter="url(#glow3d)"
                  >
                    {pos.instinctInfo.symbol}
                  </text>
                </g>
              )
            })}
          </g>
          
          {/* Círculo intermediário com 9 tipos principais em 3D */}
          <g className="types-ring-3d pulsing-animation">
            {Object.entries(typeNames).map(([typeNum, typeName], index) => {
              const pos = getCirclePosition(index, 9, 280)
              const typeColor = typeColors[parseInt(typeNum) as keyof typeof typeColors]
              
              return (
                <g key={`type-${typeNum}`} className="type-3d performance-optimized">
                  {/* Círculo principal maior */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={hoveredElement === `type-${typeNum}` ? "52" : "45"}
                    fill={`url(#type3d-${typeNum})`}
                    stroke={`url(#type3d-border-${typeNum})`}
                    strokeWidth="4"
                    filter={hoveredElement === `type-${typeNum}` 
                      ? "url(#crystalRefraction) url(#volumetricLight) url(#holographic)" 
                      : "url(#crystalRefraction) url(#volumetricLight)"}
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => handleElementHover(`type-${typeNum}`)}
                    onMouseLeave={handleElementLeave}
                  />
                  
                  {/* Círculo interno brilhante */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="35"
                    fill={typeColor.highlight}
                    opacity="0.3"
                    filter="url(#glow3d)"
                  />
                  
                  {/* Número do tipo */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="28"
                    fontWeight="bold"
                    fill="white"
                    filter="url(#depth3d)"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
                    }}
                  >
                    {typeNum}
                  </text>
                  
                  {/* Nome do tipo */}
                  <text
                    x={pos.x}
                    y={pos.y + 70}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={typeColor.primary}
                    filter="url(#depth3d)"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '1px'
                    }}
                  >
                    {typeName}
                  </text>
                </g>
              )
            })}
          </g>
          
          {/* Símbolo central do eneagrama em 3D */}
          <g 
            className="center-3d rotating-animation" 
            style={{ 
              filter: hoveredElement === 'center' 
                ? 'url(#holographic) url(#plasmaEnergy) url(#particleSystem)' 
                : 'url(#holographic) url(#plasmaEnergy)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={() => handleElementHover('center')}
            onMouseLeave={handleElementLeave}
          >
            {/* Círculo central principal */}
            <circle
              cx="525"
              cy="525"
              r="120"
              fill="url(#type3d-9)"
              stroke="url(#type3d-border-9)"
              strokeWidth="6"
              filter="url(#metallic3d)"
            />
            
            {/* Círculo interno brilhante */}
            <circle
              cx="525"
              cy="525"
              r="100"
              fill="rgba(255, 255, 255, 0.1)"
              filter="url(#glow3d)"
            />
            
            {/* Símbolo do eneagrama */}
            <g transform="translate(525, 525)">
              {/* Triângulo */}
              <path
                d="M 0,-80 L 69.28,40 L -69.28,40 Z"
                fill="none"
                stroke="#FF4757"
                strokeWidth="4"
                filter="url(#depth3d)"
              />
              
              {/* Hexágono */}
              <path
                d="M 0,-80 L 40,-69.28 L 69.28,-40 L 69.28,40 L 40,69.28 L 0,80 L -40,69.28 L -69.28,40 L -69.28,-40 L -40,-69.28 Z"
                fill="none"
                stroke="#3742FA"
                strokeWidth="3"
                filter="url(#depth3d)"
              />
            </g>
            
            {/* Texto central */}
            <text
              x="525"
              y="525"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="bold"
              fill="white"
              filter="url(#depth3d)"
              style={{
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '2px'
              }}
            >
              ENNEAGRAM
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default Modern3DMandala