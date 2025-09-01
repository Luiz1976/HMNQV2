'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Heart, Zap, Users, Clock, Award, Target, Calculator, Eye, Lightbulb, Shield, Printer, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: string
  text: string
  test: string
  dimension: string
  questionNumber?: number
  type?: string
}

interface TestResults {
  overallScore: number
  classification: string
  dimensionScores: Record<string, number>
  testScores: Record<string, number>
}

// Questões serão carregadas dinamicamente do banco de dados

// Removido responseOptions - agora usando LikertScale component

export default function HumaniqBOLIETest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Carregar questões do banco de dados
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tests/questions?testId=cmehdpsox000o8wc0yuai0swa')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar questões')
        }
        
        const data = await response.json()
        
        if (data.success && data.questions) {
          setQuestions(data.questions)
          setLoadError(null)
        } else {
          throw new Error(data.error || 'Erro ao carregar questões')
        }
      } catch (error) {
        console.error('Erro ao carregar questões:', error)
        setLoadError(error instanceof Error ? error.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQuestions()
  }, [])

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  const [isTransitioning, setIsTransitioning] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion]
    setAnswers(prev => ({ ...prev, [question.id]: value }))
    
    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      // Test completed
      setTimeout(() => {
        const testResults = calculateResults({ ...answers, [question.id]: value })
        completeTest(testResults)
      }, 300)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
     if (currentQuestion > 0) {
       setCurrentQuestion(prev => prev - 1)
     }
   }

   // Funções de ação no resultado
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.open('/api/tests/report-pdf?test=bolie', '_blank')
    }
  }

  const calculateResults = (answersToUse = answers): TestResults => {
    const dimensionGroups: Record<string, number[]> = {}
    const testGroups: Record<string, number[]> = {}
    
    questions.forEach(question => {
      const answer = answersToUse[question.id] || 0
      
      if (!dimensionGroups[question.dimension]) {
        dimensionGroups[question.dimension] = []
      }
      dimensionGroups[question.dimension].push(answer)
      
      if (!testGroups[question.test]) {
        testGroups[question.test] = []
      }
      testGroups[question.test].push(answer)
    })

    const dimensionScores: Record<string, number> = {}
    Object.entries(dimensionGroups).forEach(([dimension, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      dimensionScores[dimension] = Math.round(average * 100) / 100
    })

    const testScores: Record<string, number> = {}
    Object.entries(testGroups).forEach(([test, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      testScores[test] = Math.round(average * 100) / 100
    })

    const totalAnswers = Object.values(answersToUse)
    const overallScore = totalAnswers.reduce((sum, score) => sum + score, 0) / totalAnswers.length
    const roundedOverallScore = Math.round(overallScore * 100) / 100

    let classification = ""
    if (roundedOverallScore >= 4.5) {
      classification = "Inteligência emocional excepcional"
    } else if (roundedOverallScore >= 4.0) {
      classification = "Inteligência emocional desenvolvida"
    } else if (roundedOverallScore >= 3.0) {
      classification = "Inteligência emocional moderada"
    } else if (roundedOverallScore >= 2.0) {
      classification = "Inteligência emocional baixa"
    } else {
      classification = "Dificuldades emocionais severas"
    }

    return {
      overallScore: roundedOverallScore,
      classification,
      dimensionScores,
      testScores
    }
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Inteligência emocional excepcional":
        return "text-green-600 bg-green-50"
      case "Inteligência emocional desenvolvida":
        return "text-blue-600 bg-blue-50"
      case "Inteligência emocional moderada":
        return "text-yellow-600 bg-yellow-50"
      case "Inteligência emocional baixa":
        return "text-orange-600 bg-orange-50"
      case "Dificuldades emocionais severas":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getDimensionDescription = (dimension: string) => {
    const descriptions: Record<string, string> = {
      "Reconhecimento Emocional": "Capacidade de perceber e identificar emoções em si mesmo e nos outros através de sinais verbais e não-verbais.",
      "Compreensão de Causas": "Habilidade de entender as origens e motivações por trás das emoções, conectando eventos a sentimentos.",
      "Tomada de Perspectiva": "Capacidade de se colocar no lugar do outro e compreender diferentes pontos de vista emocionais.",
      "Reação Rápida": "Habilidade de responder de forma adequada e equilibrada em situações emocionalmente desafiadoras.",
      "Tomada de Decisão Emocional": "Capacidade de tomar decisões apropriadas considerando o contexto emocional das situações.",
      "Autorregulação": "Habilidade de controlar e gerenciar as próprias emoções de forma construtiva.",
      "Redirecionamento Positivo": "Capacidade de transformar emoções negativas em oportunidades de crescimento e aprendizado.",
      "Empatia Cognitiva": "Habilidade de compreender intelectualmente as emoções e perspectivas dos outros.",
      "Empatia Emocional": "Capacidade de sentir e compartilhar emocionalmente as experiências dos outros."
    }
    return descriptions[dimension] || ""
  }

  const getTestIcon = (test: string) => {
    switch (test) {
      case "TOHE": return Brain
      case "VE": return Zap
      case "QORE": return Heart
      case "QOE": return Users
      default: return Brain
    }
  }

  const completeTest = async (testResults: TestResults) => {
    setIsSubmitting(true)
    
    try {
      // 1. Criar sessão de teste
      const sessionResponse = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: 'cmehdpsox000o8wc0yuai0swa' // ID específico do teste BOLIE
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Falha ao criar sessão de teste')
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.sessionId

      // 2. Preparar dados para submissão
      const submissionData = {
        testId: 'cmehdpsox000o8wc0yuai0swa',
        sessionId: sessionId,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId)
          return {
            questionId: questionId,
            selectedOption: answer.toString(),
            dimension: question?.dimension || '',
            test: question?.test || ''
          }
        }),
        results: {
          overallScore: testResults.overallScore,
          classification: testResults.classification,
          dimensionScores: testResults.dimensionScores,
          testScores: testResults.testScores
        },
        duration: timeElapsed,
        metadata: {
          testName: 'HumaniQ BOLIE – Bateria de Orientação e Liderança para Inteligência Emocional',
          totalQuestions: questions.length,
          completedAt: new Date().toISOString()
        }
      }

      // 3. Submeter resultados
      const submitResponse = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!submitResponse.ok) {
        throw new Error('Falha ao submeter resultados')
      }

      const submitData = await submitResponse.json()
      
      // 4. Exibir resultados localmente
      setResults(testResults)
      setShowResults(true)
      
      // 5. Redirecionar para página individual do resultado após um delay
      if (submitData.success && submitData.testResult?.id) {
        setTimeout(() => {
          router.push(`/colaborador/resultados/${submitData.testResult.id}?saved=1`)
        }, 3000)
      } else {
        // Fallback para página de resultados se não conseguir o ID
        setTimeout(() => {
          router.push('/colaborador/resultados')
        }, 3000)
      }
      
    } catch (error) {
      console.error('Erro ao completar teste:', error)
      // Em caso de erro, ainda mostra os resultados localmente
      setResults(testResults)
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showResults && results) {
    const answeredQuestions = Object.keys(answers).length
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/colaborador/psicossociais')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Testes
            </Button>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados do HumaniQ BOLIE
              </h1>
              <p className="text-gray-600 mb-4">
                Bateria de Orientação e Liderança para Inteligência Emocional
              </p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tempo: {formatTime(timeElapsed)}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {answeredQuestions}/{questions.length} questões
                </div>
              </div>
            </div>
          </div>

          {/* Pontuação Geral */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Pontuação Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {results.overallScore.toFixed(1)}/5.0
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-4">
                  Inteligência Emocional: {results.classification}
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

          {/* Resultados por Teste */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Resultados por Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.testScores).map(([test, score]) => {
                  const Icon = getTestIcon(test)
                  return (
                    <div key={test} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">{test}</span>
                        </div>
                        <span className="font-bold text-purple-600">
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

          {/* Resultados por Dimensão */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Dimensões da Inteligência Emocional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.dimensionScores).map(([dimension, score]) => (
                  <div key={dimension} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{dimension}</span>
                        <p className="text-sm text-gray-600">
                          {getDimensionDescription(dimension)}
                        </p>
                      </div>
                      <span className="font-bold text-purple-600">
                        {score.toFixed(1)}/5.0
                      </span>
                    </div>
                    <Progress 
                      value={(score / 5) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-amber-600">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Importante:</strong> Este teste oferece uma avaliação da inteligência emocional baseada nos modelos científicos de Goleman, Bar-On e Salovey & Mayer. 
                  Os resultados devem ser interpretados considerando o contexto profissional e pessoal. 
                  Para desenvolvimento contínuo, recomenda-se acompanhamento especializado em coaching ou psicologia organizacional.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/colaborador/psicossociais')}
              size="lg"
            >
              Voltar aos Testes
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Refazer Teste
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Interface de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões do teste...</p>
        </div>
      </div>
    )
  }

  // Interface de erro
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar Teste</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <div className="space-y-2">
            <Button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Tentar Novamente
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/colaborador/psicossociais')}
            >
              Voltar aos Testes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Verificar se as questões foram carregadas
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Nenhuma questão encontrada para este teste.</p>
          <Button
            variant="outline"
            onClick={() => router.push('/colaborador/psicossociais')}
            className="mt-4"
          >
            Voltar aos Testes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                HumaniQ BOLIE
              </h1>
              <p className="text-gray-600">Bateria de Orientação e Liderança para Inteligência Emocional</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {formatTime(timeElapsed)}
              </div>
              
              <Badge variant="outline">
                {answeredQuestions}/{questions.length} respondidas
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Questão {currentQuestion + 1} de {questions.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {questions[currentQuestion].test}
              </Badge>
              <Badge variant="outline">
                {questions[currentQuestion].dimension}
              </Badge>
              <span className="text-sm text-gray-500">
                Questão {currentQuestion + 1}
              </span>
            </div>
            <CardTitle className="text-lg">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              question={questions[currentQuestion].text}
              value={answers[questions[currentQuestion].id]}
              onChange={handleAnswer}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-sm text-gray-500">
            {questions[currentQuestion].test} - {currentQuestion + 1}/{questions.length}
          </div>
          
          {currentQuestion === questions.length - 1 ? (
            <div className="text-center text-sm text-gray-600 px-4 py-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600" />
              Teste finaliza automaticamente
            </div>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!answers[questions[currentQuestion].id]}
            >
              Próxima
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}