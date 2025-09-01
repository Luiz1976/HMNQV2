'use client'

import React from 'react'

interface StaticHDMandalaProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
  className?: string
}

const StaticHDMandala: React.FC<StaticHDMandalaProps> = ({
  dominantType,
  dominantInstinct,
  className = ''
}) => {
  // Cores exatas baseadas na imagem de referência
  const typeColors = {
    1: '#E74C3C', // Vermelho
    2: '#E67E22', // Laranja
    3: '#F1C40F', // Amarelo
    4: '#9B59B6', // Roxo
    5: '#3498DB', // Azul
    6: '#1ABC9C', // Verde-azulado
    7: '#2ECC71', // Verde
    8: '#34495E', // Azul escuro
    9: '#95A5A6'  // Cinza
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

  // Nomes dos instintos em português brasileiro
  const instinctNames = {
    sp: 'AUTOPRESERVAÇÃO',
    so: 'SOCIAL',
    sx: 'SEXUAL'
  }

  // Cores dos instintos
  const instinctColors = {
    sp: '#E74C3C', // Self-Preservation - Vermelho
    so: '#3498DB', // Social - Azul
    sx: '#9B59B6'  // Sexual - Roxo
  }

  // Função para calcular posições dos 27 subtipos em 3 anéis concêntricos
  const getSubtypePosition = (index: number) => {
    const subtypeData = [
      // Anel externo (SP - Self-Preservation) - Raio maior
      { type: 1, instinct: 'sp', radius: 128 }, { type: 2, instinct: 'sp', radius: 128 }, { type: 3, instinct: 'sp', radius: 128 },
      { type: 4, instinct: 'sp', radius: 128 }, { type: 5, instinct: 'sp', radius: 128 }, { type: 6, instinct: 'sp', radius: 128 },
      { type: 7, instinct: 'sp', radius: 128 }, { type: 8, instinct: 'sp', radius: 128 }, { type: 9, instinct: 'sp', radius: 128 },
      
      // Anel médio (SO - Social) - Raio médio
      { type: 1, instinct: 'so', radius: 96 }, { type: 2, instinct: 'so', radius: 96 }, { type: 3, instinct: 'so', radius: 96 },
      { type: 4, instinct: 'so', radius: 96 }, { type: 5, instinct: 'so', radius: 96 }, { type: 6, instinct: 'so', radius: 96 },
      { type: 7, instinct: 'so', radius: 96 }, { type: 8, instinct: 'so', radius: 96 }, { type: 9, instinct: 'so', radius: 96 },
      
      // Anel interno (SX - Sexual/One-to-One) - Raio menor
      { type: 1, instinct: 'sx', radius: 64 }, { type: 2, instinct: 'sx', radius: 64 }, { type: 3, instinct: 'sx', radius: 64 },
      { type: 4, instinct: 'sx', radius: 64 }, { type: 5, instinct: 'sx', radius: 64 }, { type: 6, instinct: 'sx', radius: 64 },
      { type: 7, instinct: 'sx', radius: 64 }, { type: 8, instinct: 'sx', radius: 64 }, { type: 9, instinct: 'sx', radius: 64 }
    ];
    
    const subtype = subtypeData[index];
    const angleStep = 360 / 9; // 40 graus entre cada tipo
    const baseAngle = (subtype.type - 1) * angleStep;
    const offsetAngle = baseAngle - 90; // Começar do topo (12h)
    const radians = (offsetAngle * Math.PI) / 180;
    
    return {
      x: 140 + subtype.radius * Math.cos(radians),
      y: 140 + subtype.radius * Math.sin(radians),
      type: subtype.type,
      instinct: subtype.instinct,
      radius: subtype.radius
    };
  };

  // Função para calcular posições dos 9 tipos principais em círculo perfeito
  const getTypePosition = (index: number) => {
    const radius = 112; // Raio médio para tipos principais (reduzido 20%)
    // Distribuição matemática perfeita: 360° / 9 = 40°
    const angleStep = 360 / 9;
    const baseAngle = index * angleStep;
    const offsetAngle = baseAngle - 90; // Começar do topo (12h) - Tipo 1 no topo
    const radians = (offsetAngle * Math.PI) / 180;
    
    return {
      x: 140 + radius * Math.cos(radians), // Centro ajustado para 140
      y: 140 + radius * Math.sin(radians), // Centro ajustado para 140
      type: index + 1
    };
  };

  // Função para calcular posições circulares
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total - 90) * (Math.PI / 180)
    return {
      x: 400 + radius * Math.cos(angle),
      y: 400 + radius * Math.sin(angle),
      angle: angle * 180 / Math.PI
    }
  }

  // Gerar posições para os 27 subtipos
  // Calcular posições dos elementos com distribuição matemática perfeita
  const subtypePositions = Array.from({ length: 27 }, (_, i) => getSubtypePosition(i));
  const typePositions = Array.from({ length: 9 }, (_, i) => getTypePosition(i));

  return (
    <div className={`static-hd-mandala-container ${className}`}>
      <style jsx>{`
        .static-hd-mandala-container {
          width: 100%;
          height: 100vh;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          
        }
        
        .mandala-svg {
          width: 420px;
          height: 420px;
          filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.12));
        }
        
        /* Estilos para subtipos com alta definição */
        .subtype {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .subtype:hover {
          transform: scale(1.08);
          filter: brightness(1.15) saturate(1.2);
        }
        
        .subtype.highlighted {
          transform: none;
          filter: brightness(1.25) saturate(1.3) drop-shadow(0 0 8px currentColor);
        }
        
        .subtype-text {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 800;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
          font-feature-settings: 'kern' 1, 'liga' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .subtype-number {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 700;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
          font-feature-settings: 'tnum' 1;
        }
        
        .type-subtype-connections {
          pointer-events: none;
        }
        
        .connection-line {
          transition: all 0.3s ease;
        }
        
        .main-type:hover ~ .type-subtype-connections .connection-line {
          opacity: 0.6 !important;
          stroke-width: 2px;
        }
        
        /* Estilos para tipos principais com tipografia premium */
        .main-type {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .main-type:hover {
          transform: scale(1.06);
          filter: brightness(1.1) saturate(1.15);
        }
        
        .main-type.highlighted {
          transform: none;
          filter: brightness(1.2) saturate(1.25) drop-shadow(0 0 12px currentColor);
        }
        
        .type-number-main {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 900;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
          font-feature-settings: 'kern' 1, 'tnum' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .type-name-main {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 800;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
          font-feature-settings: 'kern' 1, 'liga' 1, 'smcp' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Estilos para linhas e geometria com alta definição */
        .enneagram-line {
          stroke-width: 2.5;
          fill: none;
          opacity: 0.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .connection-line {
          stroke-width: 1.8;
          fill: none;
          opacity: 0.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .center-circle {
          fill: #ffffff;
          stroke: #adb5bd;
          stroke-width: 2.5;
          filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15));
        }
        
        .center-text {
          font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
          font-weight: 900;
          font-size: 13px;
          fill: #2d3436;
          text-anchor: middle;
          dominant-baseline: central;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          letter-spacing: 1px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .outer-ring {
          fill: none;
          stroke: #e9ecef;
          stroke-width: 1.2;
          opacity: 0.6;
        }
        
        .middle-ring {
          fill: none;
          stroke: #dee2e6;
          stroke-width: 1.5;
          opacity: 0.7;
        }
        
        /* Melhorias globais de qualidade */
        * {
          shape-rendering: geometricPrecision;
          text-rendering: optimizeLegibility;
        }
        
        text {
          font-variant-numeric: tabular-nums;
          font-kerning: auto;
        }
      `}</style>
      
      <svg width="420" height="420" viewBox="0 0 280 280" className="mandala-svg">
        <defs>
          {/* Gradiente radial para o círculo base */}
          <radialGradient id="baseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#f8f9fa" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#e9ecef" stopOpacity="0.02" />
          </radialGradient>
          
          {/* Gradientes para os tipos principais */}
          {Object.entries(typeColors).map(([type, color]) => (
            <radialGradient key={`type-gradient-${type}`} id={`type-gradient-${type}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="60%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </radialGradient>
          ))}
          
          {Object.entries(instinctColors).map(([instinct, color]) => (
            <radialGradient key={`instinct-gradient-${instinct}`} id={`instinct-gradient-${instinct}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="70%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </radialGradient>
          ))}
          
          {/* Filtros para efeitos visuais */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0" dy="1"/>
            <feGaussianBlur stdDeviation="1" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.2"/>
            <feComposite operator="in" in2="inverse"/>
            <feComposite operator="over" in2="SourceGraphic"/>
          </filter>
        </defs>
        
        {/* Círculos de fundo concêntricos com geometria perfeita */}
        <defs>
          <radialGradient id="concentricGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#f8f9fa" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#e9ecef" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dee2e6" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        
        {/* Círculo base com gradiente */}
        <circle cx="140" cy="140" r="136" fill="url(#concentricGradient)" opacity="0.1" />
        
        {/* Círculos concêntricos com proporções áureas */}
        <circle cx="140" cy="140" r="128" fill="none" stroke="#e9ecef" strokeWidth="0.25" opacity="0.4" />
        <circle cx="140" cy="140" r="112" fill="none" stroke="#dee2e6" strokeWidth="0.4" opacity="0.5" />
        <circle cx="140" cy="140" r="96" fill="none" stroke="#ced4da" strokeWidth="0.5" opacity="0.6" />
        <circle cx="140" cy="140" r="80" fill="none" stroke="#adb5bd" strokeWidth="0.4" opacity="0.4" />
        <circle cx="140" cy="140" r="64" fill="none" stroke="#6c757d" strokeWidth="0.25" opacity="0.3" />
        <circle cx="140" cy="140" r="48" fill="none" stroke="#495057" strokeWidth="0.15" opacity="0.2" />
        
        {/* Linhas radiais para simetria perfeita */}
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 40) - 90;
          const radian = (angle * Math.PI) / 180;
          const x1 = 140 + 48 * Math.cos(radian);
          const y1 = 140 + 48 * Math.sin(radian);
          const x2 = 140 + 128 * Math.cos(radian);
          const y2 = 140 + 128 * Math.sin(radian);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e9ecef"
              strokeWidth="0.15"
              opacity="0.3"
            />
          );
        })}
        
        {/* Anéis de fundo */}
        <circle className="outer-ring" cx="140" cy="140" r="140" />
        <circle className="middle-ring" cx="140" cy="140" r="100" />
        
        {/* Linhas de conexão do Eneagrama com alta definição */}
        <g className="enneagram-connections">
          {/* Triângulo equilátero interno: 3-6-9 */}
          <path 
            className="enneagram-line" 
            d={`M ${typePositions[2].x} ${typePositions[2].y} L ${typePositions[5].x} ${typePositions[5].y} L ${typePositions[8].x} ${typePositions[8].y} Z`}
            stroke="#6c757d" 
            strokeWidth="1" 
            opacity="0.8"
          />
          
          {/* Hexágono irregular: 1-4-2-8-5-7-1 */}
          <path 
            className="enneagram-line" 
            d={`M ${typePositions[0].x} ${typePositions[0].y} L ${typePositions[3].x} ${typePositions[3].y} L ${typePositions[1].x} ${typePositions[1].y} L ${typePositions[7].x} ${typePositions[7].y} L ${typePositions[4].x} ${typePositions[4].y} L ${typePositions[6].x} ${typePositions[6].y} Z`}
            stroke="#6c757d" 
            strokeWidth="0.9" 
            opacity="0.8"
          />
          
          {/* Linhas de integração e desintegração */}
          {/* 1→7, 2→4, 3→6, 4→1, 5→8, 6→3, 7→5, 8→2, 9→3 */}
          <g stroke="#28a745" strokeWidth="0.5" opacity="0.5">
            <path d={`M ${typePositions[0].x} ${typePositions[0].y} L ${typePositions[6].x} ${typePositions[6].y}`} /> {/* 1→7 */}
            <path d={`M ${typePositions[1].x} ${typePositions[1].y} L ${typePositions[3].x} ${typePositions[3].y}`} /> {/* 2→4 */}
            <path d={`M ${typePositions[2].x} ${typePositions[2].y} L ${typePositions[5].x} ${typePositions[5].y}`} /> {/* 3→6 */}
            <path d={`M ${typePositions[3].x} ${typePositions[3].y} L ${typePositions[0].x} ${typePositions[0].y}`} /> {/* 4→1 */}
            <path d={`M ${typePositions[4].x} ${typePositions[4].y} L ${typePositions[7].x} ${typePositions[7].y}`} /> {/* 5→8 */}
            <path d={`M ${typePositions[5].x} ${typePositions[5].y} L ${typePositions[2].x} ${typePositions[2].y}`} /> {/* 6→3 */}
            <path d={`M ${typePositions[6].x} ${typePositions[6].y} L ${typePositions[4].x} ${typePositions[4].y}`} /> {/* 7→5 */}
            <path d={`M ${typePositions[7].x} ${typePositions[7].y} L ${typePositions[1].x} ${typePositions[1].y}`} /> {/* 8→2 */}
          </g>
        </g>
        
        {/* Linhas de conexão dos subtipos aos tipos */}
        {subtypePositions.map((subtype, index) => {
          const typePos = typePositions[subtype.type - 1]
          return (
            <line
              key={`connection-${index}`}
              className="connection-line"
              x1={subtype.x}
              y1={subtype.y}
              x2={typePos.x}
              y2={typePos.y}
            />
          )
        })}
        
        {/* Conexões visuais entre tipos principais e seus subtipos */}
        {typePositions.map((type, typeIndex) => {
          const typeColor = typeColors[type.type as keyof typeof typeColors];
          
          return (
            <g key={`connections-${typeIndex}`} className="type-subtype-connections">
              {/* Linhas conectando cada tipo aos seus 3 subtipos */}
              {[0, 1, 2].map(subtypeOffset => {
                const subtypeIndex = typeIndex * 3 + subtypeOffset;
                const subtype = subtypePositions[subtypeIndex];
                
                return (
                  <line
                    key={`connection-${typeIndex}-${subtypeOffset}`}
                    x1={type.x}
                    y1={type.y}
                    x2={subtype.x}
                    y2={subtype.y}
                    stroke={typeColor}
                    strokeWidth="0.6"
                    opacity="0.25"
                    strokeDasharray="1,1.5"
                    className="connection-line"
                  />
                );
              })}
            </g>
          );
        })}

        {/* 27 Subtipos (círculo externo) com alta definição e cores dos instintos */}
        {subtypePositions.map((subtype, index) => {
          const instinctColor = instinctColors[subtype.instinct as keyof typeof instinctColors];
          const isHighlighted = dominantType === subtype.type && dominantInstinct === subtype.instinct;
          const instinctName = instinctNames[subtype.instinct as keyof typeof instinctNames];
          
          return (
            <g key={`subtype-${index}`} className={`subtype ${isHighlighted ? 'highlighted' : ''}`}>
              {/* Círculo principal do subtipo */}
              <circle
                cx={subtype.x}
                cy={subtype.y}
                r="10"
                fill={instinctColor}
                stroke="#ffffff"
                strokeWidth="1.25"
                opacity={isHighlighted ? 1 : 0.9}
                filter="url(#dropShadow)"
              />
              
              {/* Círculo interno menor */}
              <circle
                cx={subtype.x}
                cy={subtype.y}
                r="7"
                fill={`url(#instinct-gradient-${subtype.instinct})`}
                opacity={isHighlighted ? 1 : 0.85}
              />
              
              <text
                x={subtype.x}
                y={subtype.y - 8}
                textAnchor="middle"
                className="subtype-instinct"
                fill="#ffffff"
                fontSize="4.2"
                fontWeight="900"
                fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.6px'
                }}
              >
                {instinctNames[subtype.instinct as keyof typeof instinctNames]}
              </text>
              
              {/* Número do tipo */}
              <text
                x={subtype.x}
                y={subtype.y + 4}
                textAnchor="middle"
                className="subtype-number"
                fill="#ffffff"
                fontSize="7.2"
                fontWeight="900"
                fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif"
                style={{
                  textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                  letterSpacing: '0.4px'
                }}
              >
                {subtype.type}
              </text>
              
              {/* Indicador de destaque */}
              {isHighlighted && (
                <>
                  <circle
                    cx={subtype.x}
                    cy={subtype.y}
                    r="13"
                    fill="none"
                    stroke={instinctColor}
                    strokeWidth="1.25"
                    strokeDasharray="2,1"
                    opacity="0.9"
                  />
                  <circle
                    cx={subtype.x}
                    cy={subtype.y}
                    r="15"
                    fill="none"
                    stroke={instinctColor}
                    strokeWidth="0.75"
                    strokeDasharray="1,1.5"
                    opacity="0.6"
                  />
                </>
              )}
            </g>
          );
        })}
        
        {/* 9 Tipos principais (círculo intermediário) com tipografia profissional */}
        {typePositions.map((type, index) => {
          const typeNumber = type.type;
          const isHighlighted = dominantType === typeNumber;
          
          return (
            <g key={`type-${index}`} className={`main-type ${isHighlighted ? 'highlighted' : ''}`}>
              {/* Círculo externo branco com borda colorida */}
              <circle
                cx={type.x}
                cy={type.y}
                r="19"
                fill="#ffffff"
                stroke={typeColors[typeNumber as keyof typeof typeColors]}
                strokeWidth="1.5"
                opacity="0.98"
                filter="url(#dropShadow)"
              />
              
              {/* Círculo interno colorido com gradiente */}
              <circle
                cx={type.x}
                cy={type.y}
                r="16"
                fill={`url(#type-gradient-${type.type})`}
                opacity={isHighlighted ? 1 : 0.85}
              />
              
              {/* Número do tipo com tipografia premium */}
              <text
                x={type.x}
                y={type.y - 1}
                textAnchor="middle"
                className="type-number-main"
                fill="#ffffff"
                fontSize="11.2"
                fontWeight="900"
                fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif"
                style={{
                  textShadow: '0 3px 10px rgba(0,0,0,0.8)',
                  letterSpacing: '0.8px',
                  paintOrder: 'stroke fill'
                }}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1"
              >
                {type.type}
              </text>
              
              {/* Nome do tipo com tipografia elegante */}
              <text
                x={type.x}
                y={type.y + 17}
                textAnchor="middle"
                className="type-name-main"
                fill="#ffffff"
                fontSize="4.8"
                fontWeight="900"
                fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif"
                style={{
                  textShadow: '0 3px 6px rgba(0,0,0,0.9)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase'
                }}
              >
                {typeNames[type.type as keyof typeof typeNames]}
              </text>
              
              {/* Indicador de destaque aprimorado */}
              {isHighlighted && (
                <>
                  <circle
                    cx={type.x}
                    cy={type.y}
                    r="21.5"
                    fill="none"
                    stroke={typeColors[typeNumber as keyof typeof typeColors]}
                    strokeWidth="1.5"
                    strokeDasharray="3,1"
                    opacity="0.95"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={type.x}
                    cy={type.y}
                    r="24"
                    fill="none"
                    stroke={typeColors[typeNumber as keyof typeof typeColors]}
                    strokeWidth="1"
                    strokeDasharray="2,1.5"
                    opacity="0.7"
                  />
                  <circle
                    cx={type.x}
                    cy={type.y}
                    r="26.5"
                    fill="none"
                    stroke={typeColors[typeNumber as keyof typeof typeColors]}
                    strokeWidth="0.5"
                    strokeDasharray="1,2"
                    opacity="0.4"
                  />
                </>
              )}
            </g>
          );
        })}
        
        {/* Centro da mandala */}
        <g className="center">
          <circle
            className="center-circle"
            cx="140"
            cy="140"
            r="24"
          />
          <text
            className="center-text"
            x="140"
            y="135"
            fontSize="6.4"
          >
            ENEAGRAMA
          </text>
          <text
            className="center-text"
            x="140"
            y="145"
            fontSize="6.4"
          >
            INTEGRATIVO
          </text>
        </g>
      </svg>
    </div>
  )
}

export default StaticHDMandala