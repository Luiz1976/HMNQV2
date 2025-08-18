import React from 'react'

interface ParticleBackgroundProps {
  color?: string
  count?: number
  className?: string
}

const random = (min: number, max: number) => Math.random() * (max - min) + min

export default function ParticleBackground({ color = '#22c55e', count = 12, className = '' }: ParticleBackgroundProps) {
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = random(8, 22)
    const left = random(0, 100)
    const top = random(0, 100)
    const duration = random(6, 16)
    const delay = random(0, 8)
    const opacity = random(0.18, 0.38)
    return (
      <svg
        key={i}
        width={size}
        height={size}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          opacity,
          zIndex: 1,
          pointerEvents: 'none',
          animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite alternate`
        }}
      >
        <circle cx={size/2} cy={size/2} r={size/2.2} fill={color} />
      </svg>
    )
  })

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} style={{zIndex:1}}>
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-18px) scale(1.12); }
        }
      `}</style>
      {particles}
    </div>
  )
}