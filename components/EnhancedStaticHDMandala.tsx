'use client'

import React, { useState, useEffect, useRef } from 'react'

interface EnhancedStaticHDMandalaProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
  typeScores?: number[]
  percentageScores?: Record<string, number>
  className?: string
}

const EnhancedStaticHDMandala: React.FC<EnhancedStaticHDMandalaProps> = ({
  dominantType,
  dominantInstinct,
  typeScores = [],
  percentageScores = {},
  className = ''
}) => {
  const [hoveredType, setHoveredType] = useState<number | null>(null)
  const [hoveredSubtype, setHoveredSubtype] = useState<{type: number, instinct: string} | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)
  const [tooltip, setTooltip] = useState<{x: number, y: number, content: string} | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Flag to disable movement animations for highlighted result circles
  const disableMovement = true

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Cores aprimoradas com gradientes vibrantes
  const typeColors = {
    1: '#FF6B6B', // Vermelho vibrante
    2: '#FF8E53', // Laranja caloroso
    3: '#FFD93D', // Amarelo dourado
    4: '#A8E6CF', // Verde menta
    5: '#4ECDC4', // Turquesa
    6: '#45B7D1', // Azul oceano
    7: '#96CEB4', // Verde suave
    8: '#FFEAA7', // Amarelo pêssego
    9: '#DDA0DD'  // Lavanda
  }

  // Cores secundárias para gradientes
  const typeSecondaryColors = {
    1: '#FF5252',
    2: '#FF7043',
    3: '#FFC107',
    4: '#81C784',
    5: '#26A69A',
    6: '#42A5F5',
    7: '#66BB6A',
    8: '#FFB74D',
    9: '#BA68C8'
  }

  // Nomes dos tipos em português brasileiro
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

  // Descrições detalhadas dos tipos
  const typeDescriptions = {
    1: 'Busca perfeição e correção. Organizado, crítico e com altos padrões.',
    2: 'Focado em ajudar outros. Empático, generoso e orientado para relacionamentos.',
    3: 'Orientado para o sucesso. Adaptável, ambicioso e focado em imagem.',
    4: 'Busca autenticidade e significado. Criativo, emocional e individualista.',
    5: 'Investigativo e observador. Independente, inovador e reservado.',
    6: 'Leal e responsável. Ansioso, comprometido e orientado para segurança.',
    7: 'Entusiasta e versátil. Espontâneo, otimista e orientado para experiências.',
    8: 'Assertivo e poderoso. Direto, autoconfiante e protetor.',
    9: 'Pacificador e harmonioso. Receptivo, tranquilo e evita conflitos.'
  }

  // Nomes dos instintos em português brasileiro
  const instinctNames = {
    sp: 'AUTOPRESERVAÇÃO',
    so: 'SOCIAL',
    sx: 'SEXUAL'
  }

  // Cores dos instintos mais vibrantes
  const instinctColors = {
    sp: '#FF6B6B', // Self-Preservation - Vermelho vibrante
    so: '#4ECDC4', // Social - Turquesa
    sx: '#A8E6CF'  // Sexual - Verde menta
  }

  // Função para calcular posições dos 27 subtipos orbitando ao redor de seus tipos principais
  const getSubtypePosition = (index: number) => {
    const subtypeData = [
      // Anel externo (SP - Self-Preservation) - Raio maior
      { type: 1, instinct: 'sp', radius: 140 }, { type: 2, instinct: 'sp', radius: 140 }, { type: 3, instinct: 'sp', radius: 140 },
      { type: 4, instinct: 'sp', radius: 140 }, { type: 5, instinct: 'sp', radius: 140 }, { type: 6, instinct: 'sp', radius: 140 },
      { type: 7, instinct: 'sp', radius: 140 }, { type: 8, instinct: 'sp', radius: 140 }, { type: 9, instinct: 'sp', radius: 140 },
      
      // Anel médio (SO - Social) - Raio médio
      { type: 1, instinct: 'so', radius: 110 }, { type: 2, instinct: 'so', radius: 110 }, { type: 3, instinct: 'so', radius: 110 },
      { type: 4, instinct: 'so', radius: 110 }, { type: 5, instinct: 'so', radius: 110 }, { type: 6, instinct: 'so', radius: 110 },
      { type: 7, instinct: 'so', radius: 110 }, { type: 8, instinct: 'so', radius: 110 }, { type: 9, instinct: 'so', radius: 110 },
      
      // Anel interno (SX - Sexual/One-to-One) - Raio menor
      { type: 1, instinct: 'sx', radius: 80 }, { type: 2, instinct: 'sx', radius: 80 }, { type: 3, instinct: 'sx', radius: 80 },
      { type: 4, instinct: 'sx', radius: 80 }, { type: 5, instinct: 'sx', radius: 80 }, { type: 6, instinct: 'sx', radius: 80 },
      { type: 7, instinct: 'sx', radius: 80 }, { type: 8, instinct: 'sx', radius: 80 }, { type: 9, instinct: 'sx', radius: 80 }
    ];
    
    const subtype = subtypeData[index];
    
    // Posicionamento orbital para todos os tipos - cada tipo tem seus subtipos orbitando ao redor
    const typePosition = getTypePosition(subtype.type - 1); // Tipo está no índice (type-1) (0-based)
    
    // Calcular direção radial do centro para o tipo (para posicionar os subtipos na direção externa)
    const radialAngle = Math.atan2(typePosition.y - 200, typePosition.x - 200);
    
    // Raio orbital fixo para evitar sobreposições
    const orbitRadius = 45;
    
    // Ângulos bem espaçados para os 3 subtipos de cada tipo para evitar sobreposição
    const subtypeAngles = {
      'sp': radialAngle - 0.8, // Espaçamento angular aumentado
      'so': radialAngle,       // Direção radial direta
      'sx': radialAngle + 0.8  // Espaçamento angular aumentado
    };
    
    const angle = subtypeAngles[subtype.instinct as keyof typeof subtypeAngles];
    
    // Posicionar os subtipos em órbita ao redor do tipo principal
    const orbitCenter = {
      x: typePosition.x + 35 * Math.cos(radialAngle), // Deslocamento fixo na direção radial
      y: typePosition.y + 35 * Math.sin(radialAngle)
    };
    
    return {
      x: orbitCenter.x + orbitRadius * Math.cos(angle),
      y: orbitCenter.y + orbitRadius * Math.sin(angle),
      type: subtype.type,
      instinct: subtype.instinct,
      radius: subtype.radius
    };
  };

  // Função para calcular posições dos 9 tipos principais em círculo perfeito
  const getTypePosition = (index: number) => {
    const radius = 140; // Raio aumentado para tipos principais - maior distância entre círculos
    const angleStep = 360 / 9;
    const baseAngle = index * angleStep;
    const offsetAngle = baseAngle - 410; // Rotação anti-horária para tipo 9 no topo
    const radians = (offsetAngle * Math.PI) / 180;
    
    return {
      x: 200 + radius * Math.cos(radians),
      y: 200 + radius * Math.sin(radians),
      type: index + 1
    };
  };

  // Gerar posições para os 27 subtipos e 9 tipos
  const subtypePositions = Array.from({ length: 27 }, (_, i) => getSubtypePosition(i));
  const typePositions = Array.from({ length: 9 }, (_, i) => getTypePosition(i));

  // Função para obter a intensidade baseada na pontuação
  const getIntensity = (typeNum: number) => {
    if (typeScores.length > 0) {
      return typeScores[typeNum - 1] / 100;
    }
    if (percentageScores[`type${typeNum}`]) {
      return percentageScores[`type${typeNum}`] / 100;
    }
    return 0.5; // Valor padrão
  };

  // Função para obter a pontuação de um tipo
  const getTypeScore = (typeNum: number) => {
    if (typeScores.length > 0) {
      return typeScores[typeNum - 1];
    }
    if (percentageScores[`type${typeNum}`]) {
      return percentageScores[`type${typeNum}`];
    }
    return 0;
  };

  // Função para mostrar tooltip
  const showTooltip = (event: React.MouseEvent, content: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content
      });
    }
  };

  // Função para esconder tooltip
  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <div ref={containerRef} className={`enhanced-mandala-container ${className}`}>
      <style jsx>{`
        .enhanced-mandala-container {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
          position: relative;
          padding: 80px;
        }
        
        .mandala-svg {
          width: 700px;
          height: 700px;
          filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3));
          transition: all 0.3s ease;
        }
        
        .mandala-svg:hover {
          transform: scale(1.02);
        }
        
        /* Estilos para subtipos com animações */
        .subtype {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          transform-origin: center;
          filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.3));
        }
        
        .subtype:hover {
          transform: scale(1.15);
          filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 12px rgba(255,255,255,0.5));
        }
        
        .subtype.highlighted {
          transform: none;
          /* animation removed to keep highlighted subtype static */
          position: relative;
        }
        
        .subtype.highlighted::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(255, 255, 255, 0.4) 0%, 
            rgba(192, 192, 192, 0.4) 50%, 
            transparent 100%);
          animation: rotateGradient 4s linear infinite;
          transform-origin: 50% 50%;
          z-index: -1;
        }
        
        @keyframes subtypeElegantGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5)) 
                    drop-shadow(0 0 25px rgba(255, 255, 255, 0.2));
            transform: scale(1.25);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.7)) 
                    drop-shadow(0 0 35px rgba(255, 255, 255, 0.4));
            transform: scale(1.3);
          }
        }
        
        @keyframes subtypePulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1.2); }
          50% { transform: scale(1.25); }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animated {
          animation: fadeInScale 0.6s ease-out;
        }
        
        /* Estilos para tipos principais */
        .main-type {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          transform-origin: center;
        }
        
        .main-type:hover {
          transform: scale(1.1);
          filter: brightness(1.15) saturate(1.2);
        }
        
        .main-type.highlighted {
          transform: none;
          /* animation removed to keep highlighted circle static */
          position: relative;
        }
        
        .main-type.highlighted::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: 50%;
          background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.3), 
            rgba(192, 192, 192, 0.4), 
            rgba(255, 255, 255, 0.3));
          animation: rotateGradient 4s linear infinite;
          transform-origin: 50% 50%;
          z-index: -1;
        }
        
        @keyframes elegantGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)) 
                    drop-shadow(0 0 40px rgba(255, 255, 255, 0.3));
            transform: scale(1.15);
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)) 
                    drop-shadow(0 0 60px rgba(255, 255, 255, 0.5));
            transform: scale(1.2);
          }
        }
        
        @keyframes rotateGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Tipografia aprimorada */
        .type-text {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 900;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        
        /* Linhas de conexão animadas */
        .connection-line {
          transition: all 0.3s ease;
          stroke-dasharray: 2, 2;
          animation: dash 4s linear infinite;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
        
        /* Círculos concêntricos com gradientes */
        .concentric-ring {
          fill: none;
          stroke-width: 1;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        
        .concentric-ring:hover {
          opacity: 0.6;
          stroke-width: 2;
        }
        
        /* Centro da mandala aprimorado */
        .center-circle {
          fill: url(#centerGradient);
          stroke: #ffffff;
          stroke-width: 3;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }
        
        .center-text {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          dominant-baseline: central;
          text-rendering: optimizeLegibility;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        /* Tooltip */
        .tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.95);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          pointer-events: none;
          z-index: 1000;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          max-width: 280px;
          line-height: 1.4;
          transform: translate(-50%, -100%);
          margin-top: -15px;
          white-space: nowrap;
        }
        
        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.95);
        }
        
        /* Indicadores de pontuação */
        .score-indicator {
          font-size: 10px;
          font-weight: 700;
          fill: #ffffff;
          text-anchor: middle;
          dominant-baseline: central;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        
        .type-connections {
          transition: all 0.3s ease;
        }
        
        .type-connections line {
          transition: all 0.3s ease;
        }
        
        .main-type:hover ~ .type-connections line,
        .main-type.highlighted ~ .type-connections line {
          opacity: 0.8 !important;
          stroke-width: 2 !important;
        }
        
        .subtype {
          transition: all 0.3s ease;
        }
        
        .subtype:hover {
          transform: scale(1.1);
        }
        
        /* Barras de progresso circulares */
        .progress-ring {
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        .progress-ring:hover {
          transform: scale(1.05);
        }
      `}</style>
      
      <svg width="800" height="800" viewBox="-100 -100 600 600" className="mandala-svg">
        <defs>
          {/* Gradientes para o centro */}
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="1" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="1" />
          </radialGradient>
          
          {/* Gradientes para os tipos principais */}
          {Object.entries(typeColors).map(([type, color]) => (
            <radialGradient key={`enhanced-type-gradient-${type}`} id={`enhanced-type-gradient-${type}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="70%" stopColor={typeSecondaryColors[Number(type) as keyof typeof typeSecondaryColors]} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </radialGradient>
          ))}
          
          {/* Gradientes para os instintos */}
          {Object.entries(instinctColors).map(([instinct, color]) => (
            <radialGradient key={`enhanced-instinct-gradient-${instinct}`} id={`enhanced-instinct-gradient-${instinct}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="70%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </radialGradient>
          ))}
          
          {/* Filtros para efeitos visuais */}
          <filter id="enhancedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="enhancedShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="3" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Fundo com gradiente radial */}
        <circle cx="200" cy="200" r="190" fill="url(#centerGradient)" opacity="0.1" />
        
        {/* Círculos concêntricos com gradientes */}
        <circle className="concentric-ring" cx="200" cy="200" r="170" stroke="url(#centerGradient)" />
        <circle className="concentric-ring" cx="200" cy="200" r="140" stroke="url(#centerGradient)" />
        <circle className="concentric-ring" cx="200" cy="200" r="110" stroke="url(#centerGradient)" />
        <circle className="concentric-ring" cx="200" cy="200" r="80" stroke="url(#centerGradient)" />
        
        {/* Linhas radiais para simetria */}
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 40) - 90;
          const radian = (angle * Math.PI) / 180;
          const x1 = 200 + 50 * Math.cos(radian);
          const y1 = 200 + 50 * Math.sin(radian);
          const x2 = 200 + 170 * Math.cos(radian);
          const y2 = 200 + 170 * Math.sin(radian);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#centerGradient)"
              strokeWidth="0.5"
              opacity="0.4"
              className={isAnimated ? 'animated' : ''}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
        
        {/* Linhas de conexão do Eneagrama */}
        <g className="enneagram-connections">
          {/* Triângulo equilátero interno: 3-6-9 */}
          <path 
            d={`M ${typePositions[2].x} ${typePositions[2].y} L ${typePositions[5].x} ${typePositions[5].y} L ${typePositions[8].x} ${typePositions[8].y} Z`}
            stroke="#ffffff" 
            strokeWidth="2" 
            opacity="0.6"
            fill="none"
            className="connection-line"
          />
          
          {/* Hexágono irregular: 1-4-2-8-5-7-1 */}
          <path 
            d={`M ${typePositions[0].x} ${typePositions[0].y} L ${typePositions[3].x} ${typePositions[3].y} L ${typePositions[1].x} ${typePositions[1].y} L ${typePositions[7].x} ${typePositions[7].y} L ${typePositions[4].x} ${typePositions[4].y} L ${typePositions[6].x} ${typePositions[6].y} Z`}
            stroke="#ffffff" 
            strokeWidth="1.5" 
              opacity="0.5"
            fill="none"
            className="connection-line"
          />
        </g>
        
        {/* Linhas de conexão entre tipos principais e seus subtipos */}
        {Array.from({ length: 9 }, (_, typeIndex) => {
          const typeNumber = typeIndex + 1;
          const typePos = typePositions[typeIndex];
          
          // Encontrar os 3 subtipos deste tipo
          const typeSubtypes = subtypePositions.filter(subtype => subtype.type === typeNumber);
          
          return (
            <g key={`connections-${typeNumber}`} className="type-connections">
              {typeSubtypes.map((subtype, subtypeIndex) => {
                const isHighlighted = dominantType === typeNumber;
                
                // Linha especial para o círculo azul (instinto social) do tipo 4
                if (typeNumber === 4 && subtype.instinct === 'so') {
                  return (
                    <line
                      key={`connection-${typeNumber}-${subtypeIndex}`}
                      x1={typePos.x}
                      y1={typePos.y}
                      x2={subtype.x}
                      y2={subtype.y}
                      stroke="#4ECDC4" // Cor azul turquesa para destacar
                      strokeWidth={isHighlighted ? "4" : "3"}
                      opacity="1"
                      strokeDasharray="none"
                      filter="url(#enhancedShadow)"
                    />
                  );
                }
                
                return (
                  <line
                    key={`connection-${typeNumber}-${subtypeIndex}`}
                    x1={typePos.x}
                    y1={typePos.y}
                    x2={subtype.x}
                    y2={subtype.y}
                    stroke={typeColors[typeNumber as keyof typeof typeColors]}
                    strokeWidth={isHighlighted ? "3" : "2"}
                    opacity={isHighlighted ? "0.9" : "0.7"}
                    strokeDasharray="4,2"
                    filter="url(#enhancedShadow)"
                  />
                );
              })}
            </g>
          );
        })}
        
        {/* 27 Subtipos com cores vibrantes e animações */}
        {subtypePositions.map((subtype, index) => {
          const instinctColor = instinctColors[subtype.instinct as keyof typeof instinctColors];
          const isHighlighted = dominantType === subtype.type && dominantInstinct === subtype.instinct;
          const isHovered = hoveredSubtype?.type === subtype.type && hoveredSubtype?.instinct === subtype.instinct;
          const intensity = getIntensity(subtype.type);
          const baseRadius = 10 + intensity * 5;
          
          return (
            <g 
              key={`subtype-${index}`} 
              className={`subtype ${isHighlighted ? 'highlighted' : ''} ${isAnimated ? 'animated' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onMouseEnter={(e) => {
                setHoveredSubtype({type: subtype.type, instinct: subtype.instinct});
                const score = getTypeScore(subtype.type);
                const instinctName = instinctNames[subtype.instinct as keyof typeof instinctNames];
                showTooltip(e, `Tipo ${subtype.type} - ${typeNames[subtype.type as keyof typeof typeNames]}\n${instinctName}\nPontuação: ${Math.round(score)}%\n\n${typeDescriptions[subtype.type as keyof typeof typeDescriptions]}`);
              }}
              onMouseLeave={() => {
                setHoveredSubtype(null);
                hideTooltip();
              }}
            >
              {/* Círculo principal do subtipo */}
              <circle
                cx={subtype.x}
                cy={subtype.y}
                r={10 + intensity * 5}
                fill={`url(#enhanced-type-gradient-${subtype.type})`}
                stroke="#ffffff"
                strokeWidth="2.5"
                opacity={isHighlighted ? 1 : 0.95}
                filter="url(#enhancedShadow)"
              />
              
              {/* Código do instinto */}
              <text
                x={subtype.x}
                y={subtype.y}
                className="type-text"
                fill="#ffffff"
                fontSize="8"
                fontWeight="900"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                }}
              >
                {subtype.instinct.toUpperCase()}
              </text>
              
              {/* Anel e ponto de energia prateados para destaque */}
              {isHighlighted && (
                <g>
                  <circle
                    cx={subtype.x}
                    cy={subtype.y}
                    r={12 + intensity * 5}
                    fill="none"
                    stroke="rgba(192, 192, 192, 0.6)"
                    strokeWidth="4.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${subtype.x} ${subtype.y}; 360 ${subtype.x} ${subtype.y}`}
                      dur="6s"
                      repeatCount="indefinite"
                      calcMode="spline"
                      keySplines="0.42 0 0.58 1"
                    />
                  </circle>
                  {/* Ponto brilhante com rastro */ }
                  <circle
                    cx={subtype.x}
                    cy={subtype.y - (12 + intensity * 5)}
                    r="4"
                    fill="rgba(255,255,255,0.95)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${subtype.x} ${subtype.y}`}
                      to={`360 ${subtype.x} ${subtype.y}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Rastro de partículas menores */ }
                  {[1,2,3].map((trailIndex)=>{
                    const delay=trailIndex*0.15;
                    const size=4 - trailIndex;
                    const opacity=0.6 - trailIndex*0.15;
                    return (
                      <circle
                        key={`typetrail-${trailIndex}`}
                        cx={subtype.x}
                        cy={subtype.y - (baseRadius + 6)}
                        r={size}
                        fill={`rgba(255,255,255,${opacity})`}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values={`0 ${subtype.x} ${subtype.y}; 360 ${subtype.x} ${subtype.y}`}
                          dur="6s"
                          repeatCount="indefinite"
                          begin={`${delay}s`}
                        />
                      </circle>
                    );
                  })}
                  {/* Rastro de partículas menores */ }
                  {[1,2,3].map((trailIndex)=>{
                    const delay=trailIndex*0.15;
                    const size=4 - trailIndex;
                    const opacity=0.6 - trailIndex*0.15;
                    return (
                      <circle
                        key={`subtrail-${trailIndex}`}
                        cx={subtype.x}
                        cy={subtype.y - (12 + intensity * 5)}
                        r={size}
                        fill={`rgba(255,255,255,${opacity})`}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values={`0 ${subtype.x} ${subtype.y}; 360 ${subtype.x} ${subtype.y}`}
                          dur="6s"
                          repeatCount="indefinite"
                          begin={`${delay}s`}
                        />
                      </circle>
                    );
                  })}
                </g>
              )}
              
              {/* Indicador de destaque aprimorado */}
              {isHighlighted && !disableMovement && (
                <>
                  <circle
                    cx={subtype.x}
                    cy={subtype.y}
                    r={15}
                    fill="none"
                    stroke={instinctColor}
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    opacity="0.8"
                    filter="url(#enhancedGlow)"
                  />
                  <circle
                    cx={subtype.x}
                    cy={subtype.y}
                    r={18}
                    fill="none"
                    stroke={instinctColor}
                    strokeWidth="1"
                    strokeDasharray="2,3"
                    opacity="0.5"
                  />
                </>
              )}
            </g>
          );
        })}
        
        {/* 9 Tipos principais com design aprimorado */}
        {typePositions.map((type, index) => {
          const typeNumber = type.type;
          const isHighlighted = dominantType === typeNumber;
          const isHovered = hoveredType === typeNumber;
          const intensity = getIntensity(typeNumber);
          const baseRadius = 18 + intensity * 8;
          
          return (
            <g 
              key={`type-${index}`} 
              className={`main-type ${isHighlighted ? 'highlighted' : ''} ${isAnimated ? 'animated' : ''}`}
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              onMouseEnter={(e) => {
                setHoveredType(typeNumber);
                const score = getTypeScore(typeNumber);
                showTooltip(e, `Tipo ${typeNumber} - ${typeNames[typeNumber as keyof typeof typeNames]}\nPontuação: ${Math.round(score)}%\n\n${typeDescriptions[typeNumber as keyof typeof typeDescriptions]}`);
              }}
              onMouseLeave={() => {
                setHoveredType(null);
                hideTooltip();
              }}
            >
              {/* Círculo externo com gradiente */}
              <circle
                cx={type.x}
                cy={type.y}
                r={baseRadius + 3}
                fill="#ffffff"
                stroke={typeColors[typeNumber as keyof typeof typeColors]}
                strokeWidth="3"
                opacity="0.95"
                filter="url(#enhancedShadow)"
              />
              
              {/* Círculo interno colorido */}
              <circle
                cx={type.x}
                cy={type.y}
                r={baseRadius}
                fill={`url(#enhanced-type-gradient-${type.type})`}
                opacity={isHighlighted ? 1 : 0.8 + intensity * 0.2}
              />
              
              {/* Número do tipo */}
              <text
                x={type.x}
                y={type.y - 2}
                className="type-text"
                fill="#ffffff"
                fontSize="14"
                fontWeight="900"
                style={{
                  textShadow: '0 3px 6px rgba(0,0,0,0.8)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
              >
                {type.type}
              </text>
              
              {/* Nome do tipo */}
              <text
                x={type.x}
                y={type.y + baseRadius + 15}
                className="type-text"
                fill="#ffffff"
                fontSize="6"
                fontWeight="800"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {typeNames[type.type as keyof typeof typeNames]}
              </text>
              
              {/* Anel e ponto de energia prateados para destaque do tipo */}
              {isHighlighted && (
                <g>
                  <circle
                    cx={type.x}
                    cy={type.y}
                    r={baseRadius + 6}
                    fill="none"
                    stroke="rgba(192, 192, 192, 0.6)"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${type.x} ${type.y}; 360 ${type.x} ${type.y}`}
                      dur="6s"
                      repeatCount="indefinite"
                      calcMode="spline"
                      keySplines="0.42 0 0.58 1"
                    />
                  </circle>
                  <circle
                    cx={type.x}
                    cy={type.y - (baseRadius + 6)}
                    r="4"
                    fill="rgba(255,255,255,0.95)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${type.x} ${type.y}`}
                      to={`360 ${type.x} ${type.y}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )}
              
              {/* Porcentagem se disponível */}
              {(typeScores.length > 0 || Object.keys(percentageScores).length > 0) && (
                <text
                  x={type.x}
                  y={type.y + baseRadius + 25}
                  className="score-indicator"
                >
                  {Math.round(getTypeScore(typeNumber))}%
                </text>
              )}
              
              {/* Partículas flutuantes elegantes */}
              {isHighlighted && !disableMovement && (
                <>
                  {/* Partículas orbitais */}
                  {[0, 1, 2, 3, 4, 5].map((particleIndex) => {
                    const angle = (particleIndex * 60) * (Math.PI / 180);
                    const orbitRadius = baseRadius + 25;
                    const particleX = type.x + Math.cos(angle) * orbitRadius;
                    const particleY = type.y + Math.sin(angle) * orbitRadius;
                    
                    return (
                      <g key={`particle-${particleIndex}`}>
                        <circle
                          cx={particleX}
                          cy={particleY}
                          r="2"
                          fill="rgba(255, 215, 0, 0.8)"
                          opacity="0.9"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values={`0 ${type.x} ${type.y}; 360 ${type.x} ${type.y}`}
                            dur="4s"
                            repeatCount="indefinite"
                            begin={`${particleIndex * 0.5}s`}
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;1;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${particleIndex * 0.3}s`}
                          />
                        </circle>
                        <circle
                          cx={particleX}
                          cy={particleY}
                          r="1"
                          fill="rgba(255, 255, 255, 0.9)"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values={`0 ${type.x} ${type.y}; 360 ${type.x} ${type.y}`}
                            dur="4s"
                            repeatCount="indefinite"
                            begin={`${particleIndex * 0.5}s`}
                          />
                        </circle>
                      </g>
                    );
                  })}
                  
                  {/* Ondas concêntricas de energia */}
                  {[1, 2, 3].map((waveIndex) => (
                    <circle
                      key={`wave-${waveIndex}`}
                      cx={type.x}
                      cy={type.y}
                      r={baseRadius + (15 * waveIndex)}
                      fill="none"
                      stroke="rgba(255, 215, 0, 0.4)"
                      strokeWidth="1"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values={`${baseRadius + 10}; ${baseRadius + 35}; ${baseRadius + 10}`}
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${waveIndex * 0.8}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6; 0.2; 0.6"
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${waveIndex * 0.8}s`}
                      />
                    </circle>
                  ))}
                </>
              )}
            </g>
          );
        })}
        
        {/* Centro da mandala aprimorado */}
        <g className={`center ${isAnimated ? 'animated' : ''}`} style={{ animationDelay: '1s' }}>
          <circle
            className="center-circle"
            cx="200"
            cy="200"
            r="35"
          />
          <text
            className="center-text"
            x="200"
            y="195"
            fontSize="8"
            fontWeight="900"
          >
            ENEAGRAMA
          </text>
          <text
            className="center-text"
            x="200"
            y="205"
            fontSize="8"
            fontWeight="900"
          >
            INTEGRATIVO
          </text>
        </g>
      </svg>
      
      {/* Tooltip */}
      {tooltip && (
        <div 
          className="tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          {tooltip.content.split('\n').map((line, index) => (
            <div key={index} style={{ marginBottom: index === 0 ? '4px' : '0' }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnhancedStaticHDMandala