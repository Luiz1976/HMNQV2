'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import StaticHDMandala from '../../../components/StaticHDMandala'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Share2, Download, RefreshCw } from 'lucide-react'

interface TestResult {
  id: string
  dominantType: {
    number: number
    title: string
    description: string
    color: string
  }
  scores: Record<number, number>
  createdAt: string
}

export default function ResultadoTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlightedType, setHighlightedType] = useState<number | null>(null)

  useEffect(() => {
    // Simular dados de teste para demonstração
    const mockResult: TestResult = {
      id: 'test-result-1',
      dominantType: {
        number: 1,
        title: 'O Perfeccionista',
        description: 'Pessoas do Tipo 1 são racionais, idealistas e têm princípios sólidos. São motivadas por um forte senso de certo e errado, e se esforçam para melhorar tudo ao seu redor.',
        color: '#E74C3C'
      },
      scores: {
        1: 85,
        2: 45,
        3: 60,
        4: 30,
        5: 55,
        6: 40,
        7: 25,
        8: 35,
        9: 50
      },
      createdAt: new Date().toISOString()
    }

    setTimeout(() => {
      setResult(mockResult)
      setHighlightedType(mockResult.dominantType.number)
      setLoading(false)
    }, 1000)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Resultado do Eneagrama',
        text: `Descobri que sou do tipo ${result?.dominantType.number} - ${result?.dominantType.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handleDownload = () => {
    // Implementar download do resultado em PDF
    alert('Funcionalidade de download será implementada em breve!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg text-gray-600">Carregando seu resultado...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || 'Resultado não encontrado'}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Seu Resultado do Eneagrama</h1>
                <p className="text-gray-600">Mandala Integrativa Personalizada</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mandala */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sua Mandala Integrativa</CardTitle>
                <p className="text-center text-gray-600">
                  Tipo dominante: <span className="font-semibold" style={{ color: result.dominantType.color }}>
                    {result.dominantType.number} - {result.dominantType.title}
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <StaticHDMandala 
                    dominantType={result.dominantType.number}
                    dominantInstinct="sp"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Details */}
          <div className="space-y-6">
            {/* Dominant Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: result.dominantType.color }}
                  />
                  <span>Tipo {result.dominantType.number} - {result.dominantType.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {result.dominantType.description}
                </p>
              </CardContent>
            </Card>

            {/* Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Pontuações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(result.scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, score]) => {
                      const typeNum = parseInt(type)
                      const isHighlighted = typeNum === highlightedType
                      return (
                        <div 
                          key={type}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            isHighlighted ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onMouseEnter={() => setHighlightedType(typeNum)}
                          onMouseLeave={() => setHighlightedType(result.dominantType.number)}
                        >
                          <span className="font-medium">Tipo {type}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{score}%</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Como Interpretar</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Passe o mouse sobre a mandala para explorar cada tipo</li>
                  <li>• Seu tipo dominante está destacado em cor</li>
                  <li>• As pontuações mostram sua afinidade com cada tipo</li>
                  <li>• Use este resultado para autoconhecimento e desenvolvimento</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}