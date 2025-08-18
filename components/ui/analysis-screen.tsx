'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Loader2 } from 'lucide-react'

// Componente para exibir GIF de análise com fallbacks
function AnalysisGif() {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  if (imageError) {
    // Fallback: Animação CSS personalizada
    return (
      <div className="w-96 h-72 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
        {/* Animação de ondas */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-4 border-purple-300 rounded-2xl animate-ping"
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        
        {/* Ícone central animado */}
        <div className="relative z-10 text-center">
          <div className="animate-bounce mb-4">
            <Brain className="h-16 w-16 text-purple-600 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            <span className="text-purple-700 font-medium">Processando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 w-96 h-72 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}
      <img 
        src="https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif"
        alt="Analisando escrita"
        className="w-96 h-72 object-cover rounded-2xl shadow-lg"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          display: isLoading ? 'none' : 'block'
        }}
      />
    </div>
  )
}

interface AnalysisScreenProps {
  onComplete: () => void
  duration?: number // em segundos
  title?: string
  subtitle?: string
}

export function AnalysisScreen({ 
  onComplete, 
  duration = 10, 
  title = "Analisando sua escrita...",
  subtitle = "Nossa IA está processando sua amostra grafológica"
}: AnalysisScreenProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration * 10))
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500) // pequeno delay antes de completar
          return 100
        }
        return newProgress
      })
      
      setTimeLeft(prev => {
        const newTime = prev - 0.1
        return newTime <= 0 ? 0 : newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-float ${
              i % 2 === 0 ? 'bg-white' : 'bg-purple-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* GIF de análise em alta qualidade */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AnalysisGif />
          </div>
        </div>

        {/* Título e subtítulo */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {subtitle}
        </p>

        {/* Barra de progresso */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Processando...</span>
            <span>{Math.ceil(timeLeft)}s</span>
          </div>
        </div>

        {/* Ícone animado */}
        <div className="flex justify-center">
          <div className="animate-pulse">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Texto de status */}
        <div className="mt-6 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span>Analisando padrões grafológicos...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisScreen