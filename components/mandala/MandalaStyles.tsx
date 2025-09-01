'use client'

import React from 'react'

/**
 * Componente responsável pelos estilos CSS da mandala
 * Inclui animações, transições e estilos visuais organizados
 */
const MandalaStyles: React.FC = () => {
  return (
    <style jsx>{`
      /* Animações da mandala */
      @keyframes mandalaRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes mandalaGlow {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      @keyframes mandalaFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
      }
      
      @keyframes mandalaScale {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      @keyframes mandalaShimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.8; }
        100% { opacity: 0.3; }
      }
      
      /* Estilos dos grupos principais */
      .mandala-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .mandala-svg {
        width: 600px;
        height: 600px;
        filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        animation: mandalaFloat 6s ease-in-out infinite;
      }
      
      /* Estilos dos subtipos */
      .subtypes-ring {
        animation: mandalaRotate 120s linear infinite;
      }
      
      .subtype-group {
        transition: all 0.3s ease;
      }
      
      .subtype-group:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
      }
      
      .subtype-circle {
        animation: mandalaGlow 4s ease-in-out infinite;
        transition: all 0.3s ease;
      }
      
      .subtype-number {
        font-family: 'Playfair Display', serif;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
      
      /* Estilos dos tipos principais */
      .types-ring {
        animation: mandalaRotate -90s linear infinite;
      }
      
      .type-group {
        transition: all 0.4s ease;
      }
      
      .type-group:hover {
        transform: scale(1.15);
        filter: brightness(1.3) saturate(1.2);
      }
      
      .type-circle {
        animation: mandalaScale 8s ease-in-out infinite;
        transition: all 0.4s ease;
      }
      
      .type-number {
        font-family: 'Playfair Display', serif;
        font-weight: bold;
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
      }
      
      .type-name {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        letter-spacing: 1px;
      }
      
      .decorative-lines {
        animation: mandalaShimmer 3s ease-in-out infinite;
      }
      
      .corner-ornaments {
        animation: mandalaGlow 5s ease-in-out infinite;
      }
      
      /* Estilos do símbolo central */
      .center-symbol {
        animation: mandalaRotate 180s linear infinite reverse;
      }
      
      .central-section {
        transition: all 0.5s ease;
      }
      
      .central-section:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
      }
      
      .enneagram-symbol {
        animation: mandalaGlow 6s ease-in-out infinite;
      }
      
      .center-text {
        transition: all 0.3s ease;
      }
      
      .center-text:hover {
        filter: brightness(1.2);
      }
      
      /* Efeitos de hover globais */
      .mandala-svg:hover .subtypes-ring {
        animation-duration: 60s;
      }
      
      .mandala-svg:hover .types-ring {
        animation-duration: 45s;
      }
      
      .mandala-svg:hover .center-symbol {
        animation-duration: 90s;
      }
      
      /* Responsividade */
      @media (max-width: 768px) {
        .mandala-svg {
          width: 400px;
          height: 400px;
        }
      }
      
      @media (max-width: 480px) {
        .mandala-svg {
          width: 320px;
          height: 320px;
        }
      }
      
      /* Efeitos de acessibilidade */
      @media (prefers-reduced-motion: reduce) {
        .mandala-svg,
        .subtypes-ring,
        .types-ring,
        .center-symbol,
        .subtype-circle,
        .type-circle,
        .enneagram-symbol,
        .decorative-lines,
        .corner-ornaments {
          animation: none;
        }
      }
      
      /* Melhorias de performance */
      .mandala-svg * {
        will-change: transform, opacity;
      }
      
      /* Estilos para impressão */
      @media print {
        .mandala-svg {
          filter: none;
          animation: none;
        }
        
        .mandala-svg * {
          animation: none;
        }
      }
    `}</style>
  )
}

export default MandalaStyles