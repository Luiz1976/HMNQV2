'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: string
}

interface TestResult {
  globalScore: number
  globalLevel: string
  dimensions: {
    [key: string]: {
      score: number
      level: string
      color: string
    }
  }
  recommendations: string[]
}

const questions: Question[] = [
  { id: 1, text: "A empresa identifica riscos psicossociais de forma sistemática", dimension: "Identificação de Riscos" },
  { id: 2, text: "Existe um processo estruturado para avaliar riscos psicossociais", dimension: "Identificação de Riscos" },
  { id: 3, text: "Os colaboradores são consultados sobre riscos psicossociais", dimension: "Identificação de Riscos" },
  { id: 4, text: "A organização monitora indicadores de saúde mental", dimension: "Monitoramento" },
  { id: 5, text: "Há ferramentas para acompanhar o bem-estar dos colaboradores", dimension: "Monitoramento" },
  { id: 6, text: "Os dados de saúde mental são analisados regularmente", dimension: "Monitoramento" },
  { id: 7, text: "Existem políticas claras de prevenção de riscos psicossociais", dimension: "Prevenção" },
  { id: 8, text: "A empresa investe em programas de bem-estar", dimension: "Prevenção" },
  { id: 9, text: "Há treinamentos sobre saúde mental para lideranças", dimension: "Prevenção" },
  { id: 10, text: "A organização responde rapidamente a situações de risco", dimension: "Resposta" }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniqDemoTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<TestResult | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const canProceed = answers[questions[currentQuestion]?.id] !== undefined
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
  }

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const dimensionScores: { [key: string]: number[] } = {}
    
    questions.forEach(question => {
      const answer = finalAnswers[question.id] || 0
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = []
      }
      dimensionScores[question.dimension].push(answer)
    })

    const dimensionResults: { [key: string]: { score: number; level: string; color: string } } = {}
    let totalScore = 0

    Object.entries(dimensionScores).forEach(([dimension, scores]) => {
      const score = scores.reduce((sum, s) => sum + s, 0)
      const maxPossible = scores.length * 5
      const percentage = (score / maxPossible) * 100
      
      let level: string
      let color: string
      
      if (percentage >= 80) {
        level = 'Excelente'
        color = 'text-green-600'
      } else if (percentage >= 60) {
        level = 'Bom'
        color = 'text-blue-600'
      } else if (percentage >= 40) {
        level = 'Regular'
        color = 'text-yellow-600'
      } else {
        level = 'Crítico'
        color = 'text-red-600'
      }
      
      dimensionResults[dimension] = { score: percentage, level, color }
      totalScore += percentage
    })

    const globalScore = totalScore / Object.keys(dimensionResults).length
    let globalLevel: string
    
    if (globalScore >= 80) {
      globalLevel = 'Maturidade Avançada'
    } else if (globalScore >= 60) {
      globalLevel = 'Maturidade Intermediária'
    } else if (globalScore >= 40) {
      globalLevel = 'Maturidade Básica'
    } else {
      globalLevel = 'Maturidade Inicial'
    }

    const testResults: TestResult = {
      globalScore,
      globalLevel,
      dimensions: dimensionResults,
      recommendations: [
        'Implementar programa de monitoramento contínuo',
        'Capacitar lideranças em gestão de riscos psicossociais',
        'Desenvolver políticas de prevenção mais robustas'
      ]
    }

    setResults(testResults)
    setIsCompleted(true)
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const goToNext = () => {
    if (canProceed && !isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const completeTest = () => {
    calculateResults(answers)
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                Teste Demonstrativo Concluído
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Resultado Global: {results.globalLevel} ({results.globalScore.toFixed(1)}%)
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(results.dimensions).map(([dimension, data]) => (
              <Card key={dimension}>
                <CardHeader>
                  <CardTitle className="text-lg">{dimension}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${data.color}`}>{data.level}</span>
                    <span className="text-sm text-gray-600">{data.score.toFixed(1)}%</span>
                  </div>
                  <Progress value={data.score} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6">
            <Button onClick={() => router.push('/colaborador/psicossociais')}>
              Voltar aos Testes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/colaborador/psicossociais')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <CardTitle className="text-xl font-bold">Teste Demonstrativo</CardTitle>
                <p className="text-sm text-gray-600">Metodologia de Botões com Avanço Automático</p>
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>
          </CardHeader>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-gray-600">
                Questão {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className={`mb-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <CardHeader>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {questions[currentQuestion]?.dimension}
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {questions[currentQuestion]?.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={answers[questions[currentQuestion]?.id]}
              onChange={handleAnswer}
              hideQuestion={true}
            autoAdvance={true}
            onAutoAdvance={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                completeTest()
              }
            }}
            autoAdvanceDelay={600}
            />

            {/* Instrução */}
            <div className="text-center text-sm text-gray-500 mb-4">
              Clique em uma opção para continuar automaticamente
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button 
            onClick={goToNext}
            disabled={!canProceed || isLastQuestion}
            className={!canProceed ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Próxima
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Informação Confidencial */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 mt-0.5">
                ⚠️
              </div>
              <div className="text-sm">
                <span className="font-semibold">Confidencial:</span> Suas respostas são confidenciais e utilizadas apenas para demonstração da metodologia de avanço automático
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}