'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Brain, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react'

// Componente de Partículas Flutuantes
const FloatingParticles = ({ count = 15, containerClass = '' }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
    size: number;
    opacity: number;
    horizontalMovement: number;
  }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: 8 + Math.random() * 6,
      size: 2 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.3,
      horizontalMovement: Math.random() * 40 - 20
    }))
    setParticles(newParticles)
  }, [count])

  return (
    <>
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-10px) translateX(var(--horizontal-movement));
            opacity: 0;
          }
        }
        .particle-float {
          animation: floatUp linear infinite;
        }
      `}</style>
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${containerClass}`}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white/40 rounded-full particle-float"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              '--horizontal-movement': `${particle.horizontalMovement}px`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}

export default function GrafologiaPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleManuscriptAnalysis = () => {
    setIsLoading(true)
    router.push('/colaborador/grafologia/manuscrito')
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Cinza Grafite com Estatísticas */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white relative overflow-hidden">
        <FloatingParticles count={20} />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Testes Grafológicos</h1>
            <p className="text-gray-100 mb-2">Oi, José! 👋</p>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Avaliações de personalidade e competências comportamentais para desenvolvimento profissional
            </p>
            <div className="mt-6">
              <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm">
                📋 Desenvolva suas competências de liderança e gestão
              </button>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1</div>
              <div className="text-gray-200 text-sm">Teste</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10-15</div>
              <div className="text-gray-200 text-sm">Minutos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-gray-200 text-sm">Recomendação</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Seção Testes Disponíveis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Testes Disponíveis</h2>
          <p className="text-gray-600 mb-8">Escolha um teste para desenvolver suas competências de liderança</p>

          {/* Card único centralizado */}
          <div className="flex justify-center">
            {/* Análise de Manuscrito Card */}
            <Card className="bg-gradient-to-br from-gray-700 to-gray-800 text-white border-0 hover:shadow-xl transition-all duration-300 relative overflow-hidden max-w-md w-full">
              <FloatingParticles count={8} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Disponível</span>
                </div>
                <CardTitle className="text-xl font-bold mb-2">
                  Análise de Manuscrito
                </CardTitle>
                <CardDescription className="text-gray-100 text-sm">
                  Análise de estilos e competências de liderança
                </CardDescription>
                <CardDescription className="text-gray-200 text-xs mt-2">
                  Avaliação de personalidade, revelando 12 dimensões comportamentais através da análise da escrita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-200 mb-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Manuscrito</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>10 min</span>
                  </div>
                </div>
                <Button 
                  onClick={handleManuscriptAnalysis}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-700 hover:bg-gray-100 font-semibold py-2 rounded-lg transition-all duration-300"
                >
                  {isLoading ? 'Carregando...' : '▶ Iniciar Teste'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção Sobre os Testes Grafológicos */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
            Sobre os Testes Grafológicos
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Avaliações especializadas em personalidade e competências comportamentais para desenvolvimento profissional e organizacional
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Como Funciona */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <Brain className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Como Funciona</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cada teste utiliza metodologias científicas validadas para análise comportamental. 
                Através da análise da escrita e assinatura, identificamos padrões que revelam 
                competências de liderança, estilos de gestão e habilidades comportamentais 
                essenciais para o sucesso corporativo.
              </p>
            </div>
            
            {/* Benefícios */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Benefícios</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  Desenvolvimento de competências de liderança
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  Identificação de estilos de gestão e comunicação
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  Aprimoramento de habilidades comportamentais
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  Crescimento profissional e organizacional
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}