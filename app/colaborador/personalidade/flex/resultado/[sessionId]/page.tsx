'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, CheckCircle, Brain, Zap, Target, Users, Award, Focus, TrendingUp, Shield, Printer } from 'lucide-react'

interface TestResults {
  overallScore: number
  classification: string
  dimensionScores: Record<string, number>
  testScores: Record<string, number>
}

interface TestSession {
  id: string
  testId: string
  results: TestResults
  duration: number
  completedAt: string
  totalQuestions: number
  answeredQuestions: number
}

export default function FlexResultsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string
  
  const [session, setSession] = useState<TestSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Análise profissional memorizada conforme classificação
  const professionalAnalysis = useMemo(() => {
    if (!session?.results) return ''
    const insights: Record<string, string> = {
      "Adaptabilidade excepcional": "Você demonstra uma capacidade notável de se adaptar rapidamente a novas situações e desafios. Essa habilidade o torna um colaborador valioso em ambientes de mudança constante, permitindo-lhe liderar transformações e servir de exemplo para sua equipe.",
      "Alta adaptabilidade": "Sua alta adaptabilidade indica que você lida bem com mudanças e é capaz de manter a produtividade diante de cenários incertos. Continue desenvolvendo essa competência para assumir papéis que exijam flexibilidade e pensamento estratégico.",
      "Adaptabilidade moderada": "Você possui um nível adequado de adaptabilidade, mas ainda pode fortalecer esta competência. Busque exposições controladas a novas experiências e feedbacks frequentes para evoluir.",
      "Baixa adaptabilidade": "É recomendável investir em técnicas de gestão de mudança e resiliência para aprimorar sua adaptabilidade. Comece com pequenos desafios fora da zona de conforto e pratique o aprendizado contínuo."
    }
    return insights[session.results.classification] || ''
  }, [session?.results])

  // Funções auxiliares
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Adaptabilidade excepcional":
        return "text-green-600 bg-green-50"
      case "Alta adaptabilidade":
        return "text-blue-600 bg-blue-50"
      case "Adaptabilidade moderada":
        return "text-yellow-600 bg-yellow-50"
      case "Baixa adaptabilidade":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getDimensionDescription = (dimension: string) => {
    const descriptions: Record<string, string> = {
      "Abertura à mudança": "Capacidade de aceitar e se adaptar positivamente a mudanças organizacionais e contextuais.",
      "Resiliência emocional": "Habilidade de manter o equilíbrio emocional e se recuperar rapidamente de adversidades.",
      "Aprendizagem contínua": "Disposição constante para adquirir novos conhecimentos e desenvolver competências.",
      "Flexibilidade comportamental": "Capacidade de ajustar comportamentos e estratégias conforme as demandas situacionais."
    }
    return descriptions[dimension] || ""
  }

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case "Abertura à mudança": return TrendingUp
      case "Resiliência emocional": return Shield
      case "Aprendizagem contínua": return Brain
      case "Flexibilidade comportamental": return Zap
      default: return Target
    }
  }

  // Funções de impressão e download de PDF
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (typeof window === 'undefined') return
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = document.getElementById('flex-results')
    if (!element) return

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('humaniq-flex-resultados.pdf')
  }

  // Carregar dados da sessão
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tests/sessions/${sessionId}`)
        
        if (!response.ok) {
          throw new Error('Sessão não encontrada')
        }
        
        const result = await response.json()
        
        if (!result.success || !result.data) {
          throw new Error('Dados da sessão não encontrados')
        }
        
        setSession(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar resultados')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      loadSession()
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar resultados</h1>
          <p className="text-gray-600 mb-4">{error || 'Sessão não encontrada'}</p>
          <Button onClick={() => router.push('/colaborador/personalidade')}>
            Voltar aos Testes
          </Button>
        </div>
      </div>
    )
  }

  const { results } = session

  return (
    <div id="flex-results" className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/colaborador/personalidade')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Testes
          </Button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Brain className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resultados do HumaniQ FLEX
            </h1>
            <p className="text-gray-600 mb-4">
              Avaliação de Adaptabilidade
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tempo: {formatTime(session.duration)}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {session.answeredQuestions}/{session.totalQuestions} questões
              </div>
            </div>
          </div>
        </div>

        {/* Pontuação Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Pontuação Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {results.overallScore.toFixed(1)}/5.0
              </div>
              <div className="text-xl font-semibold text-gray-700 mb-4">
                {results.classification}
              </div>
              <Progress 
                value={(results.overallScore / 5) * 100} 
                className="h-3 mb-4"
              />
              <Badge className={`px-3 py-1 ${getClassificationColor(results.classification)}`}>
                {results.classification}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resultados por Dimensão */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              Dimensões da Adaptabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results.dimensionScores).map(([dimension, score]) => {
                const Icon = getDimensionIcon(dimension)
                return (
                  <div key={dimension} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-orange-600" />
                        <div>
                          <span className="font-medium">{dimension}</span>
                          <p className="text-sm text-gray-600">
                            {getDimensionDescription(dimension)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-orange-600">
                        {score.toFixed(1)}/5.0
                      </span>
                    </div>
                    <Progress 
                      value={(score / 5) * 100} 
                      className="h-2"
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Análise Profissional Detalhada */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              Análise Profissional Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">
              {professionalAnalysis}
            </p>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-600">Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-800 text-sm mb-3">
                <strong>Importante:</strong> Este teste avalia a adaptabilidade baseada em modelos científicos de psicologia organizacional e comportamental. 
                Os resultados indicam sua capacidade de se adaptar a mudanças, aprender continuamente e ajustar comportamentos conforme as demandas.
              </p>
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-1">Base Científica:</p>
                <p>• Teorias de Adaptabilidade Individual e Organizacional (Pulakos et al., 2000; Martin et al., 2012)</p>
                <p>• Modelos de Resiliência (APA – American Psychological Association)</p>
                <p>• Conceitos de Mindset de Crescimento (Carol Dweck)</p>
                <p>• ISO 30414 – Gestão de Capital Humano (Adaptabilidade e Aprendizagem)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            variant="outline"
            onClick={() => router.push('/colaborador/personalidade')}
            size="lg"
          >
            Voltar aos Testes
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            size="lg"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>

          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Baixar PDF
          </Button>

          <Button
            onClick={() => router.push('/colaborador/personalidade/flex')}
            size="lg"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  )
}