'use client'

import React from 'react'

interface AdvancedParticleBackgroundProps {
  color?: string
  particleCount?: number
  className?: string
  size?: 'small' | 'medium' | 'large'
  animation?: 'float' | 'pulse' | 'drift'
}

export function AdvancedParticleBackground({
  color = '#10b981',
  particleCount = 15,
  className = '',
  size = 'medium',
  animation = 'float'
}: AdvancedParticleBackgroundProps) {
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const sizeClasses = {
      small: ['w-1 h-1', 'w-2 h-2', 'w-3 h-3'],
      medium: ['w-2 h-2', 'w-4 h-4', 'w-6 h-6'],
      large: ['w-4 h-4', 'w-8 h-8', 'w-12 h-12']
    }
    
    const animationClasses = {
      float: 'animate-bounce',
      pulse: 'animate-pulse',
      drift: 'animate-spin'
    }
    
    const particleSize = sizeClasses[size][Math.floor(Math.random() * 3)]
    const animationClass = animationClasses[animation]
    const delay = Math.random() * 5
    const duration = 3 + Math.random() * 4
    const opacity = 0.1 + Math.random() * 0.3
    
    return {
      id: i,
      size: particleSize,
      animation: animationClass,
      delay,
      duration,
      opacity,
      left: Math.random() * 100,
      top: Math.random() * 100
    }
  })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.size} ${particle.animation}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: color,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
      
      {/* Partículas de brilho adicional */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full animate-pulse opacity-10"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: '4s'
        }}
      />
      <div 
        className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full animate-pulse opacity-20"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: '3s',
          animationDelay: '1s'
        }}
      />
      <div 
        className="absolute top-2/3 right-1/4 w-16 h-16 rounded-full animate-pulse opacity-25"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: '5s',
          animationDelay: '2s'
        }}
      />
    </div>
  )
}