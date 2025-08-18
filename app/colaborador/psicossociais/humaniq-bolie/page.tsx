'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Heart, Zap, Users, Clock, Award, Target, Calculator, Eye, Lightbulb, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  test: string
  dimension: string
}

interface TestResults {
  overallScore: number
  classification: string
  dimensionScores: Record<string, number>
  testScores: Record<string, number>
}

const questions: Question[] = [
  // TOHE - Teste de Organização e Histórias Emocionais
  // Reconhecimento Emocional (RE)
  { id: 1, text: "Eu consigo perceber com facilidade quando alguém está incomodado, mesmo que não diga nada.", test: "TOHE", dimension: "Reconhecimento Emocional" },
  { id: 2, text: "Se alguém está alegre, normalmente percebo isso no tom de voz ou expressão.", test: "TOHE", dimension: "Reconhecimento Emocional" },
  { id: 3, text: "Consigo perceber mudanças sutis nas expressões faciais das pessoas.", test: "TOHE", dimension: "Reconhecimento Emocional" },
  { id: 4, text: "Tenho facilidade em perceber quando alguém está desconfortável em uma conversa.", test: "TOHE", dimension: "Reconhecimento Emocional" },
  { id: 5, text: "Rapidamente noto quando o clima emocional de um ambiente muda.", test: "TOHE", dimension: "Reconhecimento Emocional" },
  
  // Compreensão de Causas (CC)
  { id: 6, text: "Quando algo me irrita, costumo entender exatamente o motivo.", test: "TOHE", dimension: "Compreensão de Causas" },
  { id: 7, text: "Entendo bem o que causou minhas emoções em situações passadas.", test: "TOHE", dimension: "Compreensão de Causas" },
  { id: 8, text: "Sou capaz de identificar as causas das emoções alheias com facilidade.", test: "TOHE", dimension: "Compreensão de Causas" },
  { id: 9, text: "Consigo relacionar eventos a sentimentos de forma lógica.", test: "TOHE", dimension: "Compreensão de Causas" },
  { id: 10, text: "Tenho clareza sobre como meu ambiente influencia meu estado emocional.", test: "TOHE", dimension: "Compreensão de Causas" },
  
  // Tomada de Perspectiva (TP)
  { id: 11, text: "Consigo imaginar como outra pessoa se sente em uma situação difícil.", test: "TOHE", dimension: "Tomada de Perspectiva" },
  { id: 12, text: "Costumo pensar em como as situações afetam os outros antes de agir.", test: "TOHE", dimension: "Tomada de Perspectiva" },
  { id: 13, text: "Tenho facilidade para entender pontos de vista diferentes do meu.", test: "TOHE", dimension: "Tomada de Perspectiva" },
  { id: 14, text: "Mesmo em conflitos, tento considerar as emoções das outras pessoas.", test: "TOHE", dimension: "Tomada de Perspectiva" },
  { id: 15, text: "Me coloco no lugar do outro para entender melhor seu comportamento.", test: "TOHE", dimension: "Tomada de Perspectiva" },
  
  // VE - Teste de Velocidade Emocional
  // Reação Rápida (RR)
  { id: 16, text: "Consigo reagir com calma mesmo em situações de pressão emocional.", test: "VE", dimension: "Reação Rápida" },
  { id: 17, text: "Tomo decisões equilibradas mesmo quando estou sob forte emoção.", test: "VE", dimension: "Reação Rápida" },
  { id: 18, text: "Identifico rapidamente emoções em mensagens de texto ou e-mail.", test: "VE", dimension: "Reação Rápida" },
  { id: 19, text: "Costumo agir de forma adequada emocionalmente, mesmo sob pressão.", test: "VE", dimension: "Reação Rápida" },
  { id: 20, text: "Percebo minhas emoções quase no mesmo momento em que surgem.", test: "VE", dimension: "Reação Rápida" },
  
  // Tomada de Decisão Emocional (TDE)
  { id: 21, text: "Penso rápido em como consolar alguém que está chorando.", test: "VE", dimension: "Tomada de Decisão Emocional" },
  { id: 22, text: "Tenho boas respostas emocionais imediatas em situações sociais.", test: "VE", dimension: "Tomada de Decisão Emocional" },
  { id: 23, text: "Rapidamente ajusto minha abordagem com base nas emoções dos outros.", test: "VE", dimension: "Tomada de Decisão Emocional" },
  { id: 24, text: "Tenho agilidade emocional em discussões difíceis.", test: "VE", dimension: "Tomada de Decisão Emocional" },
  { id: 25, text: "Reajo com empatia quase instintivamente quando vejo sofrimento.", test: "VE", dimension: "Tomada de Decisão Emocional" },
  
  // QORE - Questionário Online de Regulação Emocional
  // Autorregulação (AR)
  { id: 26, text: "Quando fico frustrado, consigo me acalmar rapidamente.", test: "QORE", dimension: "Autorregulação" },
  { id: 27, text: "Tenho estratégias eficazes para lidar com sentimentos negativos.", test: "QORE", dimension: "Autorregulação" },
  { id: 28, text: "Sou capaz de controlar minhas reações emocionais em público.", test: "QORE", dimension: "Autorregulação" },
  { id: 29, text: "Mesmo em situações estressantes, mantenho o autocontrole.", test: "QORE", dimension: "Autorregulação" },
  { id: 30, text: "Evito decisões impulsivas motivadas por emoção.", test: "QORE", dimension: "Autorregulação" },
  
  // Redirecionamento Positivo (RP)
  { id: 31, text: "Em situações difíceis, busco focar em algo positivo.", test: "QORE", dimension: "Redirecionamento Positivo" },
  { id: 32, text: "Consigo transformar emoções negativas em aprendizado.", test: "QORE", dimension: "Redirecionamento Positivo" },
  { id: 33, text: "Costumo ver um lado positivo mesmo em adversidades.", test: "QORE", dimension: "Redirecionamento Positivo" },
  { id: 34, text: "Busco soluções construtivas quando estou emocionalmente afetado.", test: "QORE", dimension: "Redirecionamento Positivo" },
  { id: 35, text: "Consigo manter uma atitude otimista mesmo em tempos difíceis.", test: "QORE", dimension: "Redirecionamento Positivo" },
  
  // QOE - Questionário Online de Empatia
  // Empatia Cognitiva (EC)
  { id: 36, text: "Consigo me colocar no lugar dos outros com facilidade.", test: "QOE", dimension: "Empatia Cognitiva" },
  { id: 37, text: "Entendo o ponto de vista de quem discorda de mim.", test: "QOE", dimension: "Empatia Cognitiva" },
  { id: 38, text: "Penso em como as pessoas se sentem antes de tomar decisões.", test: "QOE", dimension: "Empatia Cognitiva" },
  { id: 39, text: "Gosto de entender o que motiva os outros.", test: "QOE", dimension: "Empatia Cognitiva" },
  { id: 40, text: "Tenho interesse real pelas histórias e vivências das pessoas.", test: "QOE", dimension: "Empatia Cognitiva" },
  
  // Empatia Emocional (EE)
  { id: 41, text: "Sinto tristeza ao ver alguém chorando.", test: "QOE", dimension: "Empatia Emocional" },
  { id: 42, text: "Minha emoção muda quando percebo que alguém está muito feliz ou triste.", test: "QOE", dimension: "Empatia Emocional" },
  { id: 43, text: "Fico emocionado com relatos ou filmes comoventes.", test: "QOE", dimension: "Empatia Emocional" },
  { id: 44, text: "Me conecto emocionalmente com quem está passando por dificuldades.", test: "QOE", dimension: "Empatia Emocional" },
  { id: 45, text: "Minha empatia me faz sentir parte do sofrimento dos outros.", test: "QOE", dimension: "Empatia Emocional" }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniqBOLIETest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)
    
    // Auto-navegar para próxima questão ou finalizar teste
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Todas as questões respondidas, calcular e finalizar
        const finalResults = calculateResults(newAnswers)
        completeTest(finalResults)
      }
    }, 500)
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
          testId: 'bolie-test-id' // ID específico do teste BOLIE
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Falha ao criar sessão de teste')
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.sessionId

      // 2. Preparar dados para submissão
      const submissionData = {
        testId: 'bolie-test-id',
        sessionId: sessionId,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === parseInt(questionId))
          return {
            questionId: parseInt(questionId),
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
      
      // 5. Redirecionar para página de resultados após um delay
      setTimeout(() => {
        window.location.href = '/colaborador/resultados'
      }, 3000)
      
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