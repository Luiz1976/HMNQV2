'use client'

import React from 'react'

interface MandalaDefinitionsProps {
  typeColors: Record<number, { primary: string; secondary: string; accent: string }>
  instinctData: Record<string, { color: { primary: string; secondary: string; accent: string } }>
}

/**
 * Componente responsável por todas as definições SVG da mandala
 * Inclui gradientes, filtros e efeitos visuais
 */
const MandalaDefinitions: React.FC<MandalaDefinitionsProps> = ({ typeColors, instinctData }) => {
  return (
    <defs>
      {/* Gradiente central com efeito 3D */}
      <radialGradient id="enneagramCenterGradient" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="50%" stopColor="#f8f9fa" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#e9ecef" stopOpacity="0.9" />
      </radialGradient>
      
      {/* Gradientes sofisticados para os tipos */}
      {[1,2,3,4,5,6,7,8,9].map((type) => {
        const colors = typeColors[type as keyof typeof typeColors]
        return (
          <g key={`gradients-${type}`}>
            <radialGradient id={`typeGradient${type}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="20%" stopColor={colors.primary} stopOpacity="0.95" />
              <stop offset="60%" stopColor={colors.secondary} stopOpacity="0.85" />
              <stop offset="100%" stopColor={colors.accent} stopOpacity="0.75" />
            </radialGradient>
            <linearGradient id={`typeLinear${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="30%" stopColor={colors.secondary} stopOpacity="0.6" />
              <stop offset="70%" stopColor={colors.accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={colors.primary} stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id={`typeGlow${type}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </g>
        )
      })}
      
      {/* Gradientes sofisticados para instintos */}
      {Object.entries(instinctData).map(([key, data]) => (
        <g key={`instinct-gradients-${key}`}>
          <radialGradient id={`instinctGradient${key}`} cx="40%" cy="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="25%" stopColor={data.color.primary} stopOpacity="0.95" />
            <stop offset="65%" stopColor={data.color.secondary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={data.color.accent} stopOpacity="0.6" />
          </radialGradient>
          <linearGradient id={`instinctLinear${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={data.color.primary} stopOpacity="0.9" />
            <stop offset="50%" stopColor={data.color.secondary} stopOpacity="0.7" />
            <stop offset="100%" stopColor={data.color.accent} stopOpacity="0.5" />
          </linearGradient>
        </g>
      ))}
      
      {/* Filtros avançados para contornos e sombras */}
      <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
        <feOffset dx="3" dy="3" result="offset"/>
        <feFlood floodColor="#000000" floodOpacity="0.4"/>
        <feComposite in2="offset" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feFlood floodColor="#ffffff" floodOpacity="0.4"/>
        <feComposite in2="coloredBlur" operator="in"/>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
      
      {/* Filtro de brilho intenso 3D */}
      <filter id="intense3DGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="6" result="glow1"/>
        <feGaussianBlur stdDeviation="12" result="glow2"/>
        <feGaussianBlur stdDeviation="20" result="glow3"/>
        <feMerge>
          <feMergeNode in="glow3"/>
          <feMergeNode in="glow2"/>
          <feMergeNode in="glow1"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      {/* Filtro de profundidade 3D */}
      <filter id="depth3D" x="-50%" y="-50%" width="200%" height="200%">
        <feOffset in="SourceGraphic" dx="3" dy="3" result="offset"/>
        <feGaussianBlur in="offset" stdDeviation="3" result="blur"/>
        <feFlood floodColor="#000000" floodOpacity="0.4" result="shadow"/>
        <feComposite in="shadow" in2="blur" operator="in" result="shadowBlur"/>
        <feMerge>
          <feMergeNode in="shadowBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      {/* Filtro de relevo metálico */}
      <filter id="metallicRelief" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
        <feSpecularLighting in="blur" result="specOut" lightingColor="#ffffff" specularConstant="2" specularExponent="20">
          <fePointLight x="-50" y="-50" z="200"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
        <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
      
      <filter id="emboss" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feSpecularLighting result="specOut" in="blur" specularConstant="2" specularExponent="25" lightingColor="#ffffff">
          <fePointLight x="-8000" y="-12000" z="25000"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
        <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1.2" k4="0"/>
      </filter>
      
      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="4" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.3"/>
      </filter>
      
      <filter id="bevelEffect" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
        <feSpecularLighting result="specOut" in="blur" specularConstant="1.8" specularExponent="20" lightingColor="#ffffff">
          <fePointLight x="-5000" y="-8000" z="15000"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
        <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur2"/>
        <feDiffuseLighting result="diffOut" in="blur2" diffuseConstant="1">
          <fePointLight x="5000" y="8000" z="15000"/>
        </feDiffuseLighting>
        <feComposite in="diffOut" in2="SourceAlpha" operator="in" result="diffOut2"/>
        <feComposite in="litPaint" in2="diffOut2" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/>
      </filter>
      
      <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.5"/>
      </filter>
      
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feFlood floodColor="#ffffff" floodOpacity="0.6"/>
        <feComposite in2="coloredBlur" operator="in"/>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
  )
}

export default MandalaDefinitions