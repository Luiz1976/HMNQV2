'use client'

import React from 'react'

/**
 * Componente responsável pelos estilos 3D avançados da mandala moderna
 * Inclui CSS 3D transforms, lighting, shadows e animações cinematográficas
 */
const Modern3DStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Reset e configurações base para 3D */
      * {
        box-sizing: border-box;
      }
      
      html, body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      
      /* Container principal com perspective 3D */
      .modern-3d-mandala-container {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, 
          #ffffff 0%, 
          #f8f9fa 25%, 
          #e9ecef 50%, 
          #f8f9fa 75%, 
          #ffffff 100%
        );
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 3000px;
        perspective-origin: center center;
        overflow: hidden;
        position: relative;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      /* Efeito de luz ambiente */
      .modern-3d-mandala-container::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          ellipse at center,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.1) 30%,
          transparent 70%
        );
        animation: ambientLight 20s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      /* Wrapper 3D com transform-style preserve-3d */
      .mandala-3d-wrapper {
        width: 1050px;
        height: 1050px;
        transform-style: preserve-3d;
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: grab;
        position: relative;
        z-index: 2;
        will-change: transform;
        backface-visibility: hidden;
      }
      
      .mandala-3d-wrapper:active {
        cursor: grabbing;
        transition: transform 0.1s ease-out;
      }
      
      /* SVG principal com filtros 3D */
      .mandala-3d-svg {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        filter: 
          drop-shadow(0 30px 80px rgba(0, 0, 0, 0.15))
          drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))
          drop-shadow(0 5px 15px rgba(0, 0, 0, 0.05));
        transition: filter 0.3s ease;
      }
      
      .mandala-3d-svg:hover {
        filter: 
          drop-shadow(0 40px 100px rgba(0, 0, 0, 0.2))
          drop-shadow(0 15px 40px rgba(0, 0, 0, 0.15))
          drop-shadow(0 8px 20px rgba(0, 0, 0, 0.1));
      }
      
      /* Elementos 3D dos subtipos */
      .subtype-3d {
        transform-style: preserve-3d;
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: center center;
        will-change: transform, filter;
      }
      
      .subtype-3d:hover {
        transform: translateZ(40px) scale(1.3) rotateY(15deg);
        filter: 
          brightness(1.4) 
          saturate(1.6) 
          drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3));
      }
      
      /* Elementos 3D dos tipos principais */
      .type-3d {
        transform-style: preserve-3d;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: center center;
        will-change: transform, filter;
      }
      
      .type-3d:hover {
        transform: translateZ(60px) scale(1.35) rotateX(10deg) rotateY(20deg);
        filter: 
          brightness(1.5) 
          saturate(1.7) 
          drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))
          drop-shadow(0 10px 20px rgba(255, 255, 255, 0.2));
      }
      
      /* Elemento central 3D */
      .center-3d {
        transform-style: preserve-3d;
        transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: center center;
        will-change: transform, filter;
      }
      
      .center-3d:hover {
        transform: translateZ(80px) scale(1.15) rotateX(5deg);
        filter: 
          brightness(1.3) 
          drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))
          drop-shadow(0 0 30px rgba(255, 255, 255, 0.4));
      }
      
      /* Animações 3D cinematográficas */
      .floating-animation {
        animation: float3d 8s ease-in-out infinite;
      }
      
      .rotating-animation {
        animation: rotate3d 30s linear infinite;
      }
      
      .pulsing-animation {
        animation: pulse3d 6s ease-in-out infinite;
      }
      
      .breathing-animation {
        animation: breathe3d 10s ease-in-out infinite;
      }
      
      /* Keyframes para animações 3D */
      @keyframes float3d {
        0%, 100% { 
          transform: translateZ(0px) rotateX(0deg) rotateY(0deg); 
        }
        25% { 
          transform: translateZ(15px) rotateX(2deg) rotateY(5deg); 
        }
        50% { 
          transform: translateZ(25px) rotateX(0deg) rotateY(0deg); 
        }
        75% { 
          transform: translateZ(15px) rotateX(-2deg) rotateY(-5deg); 
        }
      }
      
      @keyframes rotate3d {
        0% { transform: rotateZ(0deg) rotateY(0deg); }
        25% { transform: rotateZ(90deg) rotateY(5deg); }
        50% { transform: rotateZ(180deg) rotateY(0deg); }
        75% { transform: rotateZ(270deg) rotateY(-5deg); }
        100% { transform: rotateZ(360deg) rotateY(0deg); }
      }
      
      @keyframes pulse3d {
        0%, 100% { 
          transform: scale(1) translateZ(0px) rotateX(0deg); 
        }
        50% { 
          transform: scale(1.08) translateZ(20px) rotateX(3deg); 
        }
      }
      
      @keyframes breathe3d {
        0%, 100% { 
          transform: scale(1) rotateX(0deg) rotateY(0deg); 
          filter: brightness(1) saturate(1);
        }
        50% { 
          transform: scale(1.05) rotateX(2deg) rotateY(2deg); 
          filter: brightness(1.1) saturate(1.2);
        }
      }
      
      @keyframes ambientLight {
        0%, 100% { 
          opacity: 0.3;
          transform: rotate(0deg) scale(1);
        }
        50% { 
          opacity: 0.6;
          transform: rotate(180deg) scale(1.1);
        }
      }
      
      /* Efeitos de iluminação dinâmica */
      .dynamic-lighting {
        position: relative;
      }
      
      .dynamic-lighting::before {
        content: '';
        position: absolute;
        top: -20%;
        left: -20%;
        width: 140%;
        height: 140%;
        background: conic-gradient(
          from 0deg,
          rgba(255, 255, 255, 0.1) 0deg,
          rgba(255, 255, 255, 0.3) 90deg,
          rgba(255, 255, 255, 0.1) 180deg,
          rgba(255, 255, 255, 0.05) 270deg,
          rgba(255, 255, 255, 0.1) 360deg
        );
        border-radius: 50%;
        animation: lightRotation 15s linear infinite;
        pointer-events: none;
        z-index: -1;
      }
      
      @keyframes lightRotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Otimizações de performance */
      .performance-optimized {
        will-change: transform, filter, opacity;
        backface-visibility: hidden;
        transform-origin: center center;
        contain: layout style paint;
      }
      
      /* Efeitos de reflexão e refração */
      .glass-effect {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .metallic-effect {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(0, 0, 0, 0.1) 100%
        );
      }
      
      /* Responsividade 3D */
      @media (max-width: 1200px) {
        .mandala-3d-wrapper {
          width: 900px;
          height: 900px;
        }
        
        .modern-3d-mandala-container {
          perspective: 2500px;
        }
      }
      
      @media (max-width: 768px) {
        .mandala-3d-wrapper {
          width: 700px;
          height: 700px;
        }
        
        .modern-3d-mandala-container {
          perspective: 2000px;
        }
        
        .subtype-3d:hover {
          transform: translateZ(20px) scale(1.2);
        }
        
        .type-3d:hover {
          transform: translateZ(30px) scale(1.25);
        }
        
        .center-3d:hover {
          transform: translateZ(40px) scale(1.1);
        }
      }
      
      @media (max-width: 480px) {
        .mandala-3d-wrapper {
          width: 500px;
          height: 500px;
        }
        
        .modern-3d-mandala-container {
          perspective: 1500px;
        }
      }
      
      /* Acessibilidade - redução de movimento */
      @media (prefers-reduced-motion: reduce) {
        .floating-animation,
        .rotating-animation,
        .pulsing-animation,
        .breathing-animation,
        .modern-3d-mandala-container::before,
        .dynamic-lighting::before {
          animation: none;
        }
        
        .mandala-3d-wrapper {
          transition: none;
        }
        
        .subtype-3d,
        .type-3d,
        .center-3d {
          transition: transform 0.2s ease, filter 0.2s ease;
        }
      }
      
      /* Modo escuro (opcional) */
      @media (prefers-color-scheme: dark) {
        .modern-3d-mandala-container {
          background: linear-gradient(135deg, 
            #1a1a1a 0%, 
            #2d2d2d 25%, 
            #404040 50%, 
            #2d2d2d 75%, 
            #1a1a1a 100%
          );
        }
        
        .mandala-3d-svg {
          filter: 
            drop-shadow(0 30px 80px rgba(255, 255, 255, 0.1))
            drop-shadow(0 10px 30px rgba(255, 255, 255, 0.05))
            drop-shadow(0 5px 15px rgba(255, 255, 255, 0.02));
        }
      }
      
      /* Efeitos de partículas (opcional) */
      .particle-effect {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        animation: particleFloat 10s ease-in-out infinite;
        pointer-events: none;
      }
      
      @keyframes particleFloat {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(0.5);
          opacity: 0;
        }
        10%, 90% {
          opacity: 1;
        }
        50% {
          transform: translateY(-100px) translateX(50px) scale(1);
          opacity: 0.8;
        }
      }
      
      /* Cursor personalizado para interação 3D */
      .mandala-3d-wrapper {
        cursor: grab;
      }
      
      .mandala-3d-wrapper:active {
        cursor: grabbing;
      }
      
      .mandala-3d-wrapper:hover {
        cursor: grab;
      }
    `}</style>
  )
}

export default Modern3DStyles