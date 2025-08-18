'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Brain, Zap, Heart, Users, Award, Target } from 'lucide-react'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: string
  test: string
}

interface TestResults {
  overallScore: number
  classification: string
  dimensionScores: Record<string, number>
  testScores: Record<string, number>
}

const questions: Question[] = [
  // TOHE - Teste de Organização e Histórias Emocionais (15 questões)
  { id: 1, text: "Consigo identificar facilmente quando alguém está triste, mesmo que tente esconder.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 2, text: "Percebo rapidamente mudanças no humor das pessoas ao meu redor.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 3, text: "Entendo por que certas situações me deixam ansioso(a) ou estressado(a).", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 4, text: "Consigo explicar as razões por trás dos meus sentimentos.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 5, text: "Quando alguém está chateado, consigo entender o ponto de vista dessa pessoa.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 6, text: "Coloco-me facilmente no lugar dos outros para compreender seus sentimentos.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 7, text: "Reconheço quando estou começando a ficar irritado(a) antes que isso se torne um problema.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 8, text: "Identifico os sinais físicos que acompanham minhas emoções (tensão, respiração, etc.).", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 9, text: "Compreendo como eventos passados influenciam meus sentimentos atuais.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 10, text: "Entendo por que certas pessoas ou situações me afetam emocionalmente.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 11, text: "Consigo ver uma situação conflituosa sob diferentes perspectivas.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 12, text: "Quando há desentendimentos, procuro entender todos os lados envolvidos.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 13, text: "Noto quando minhas expressões faciais não condizem com o que estou sentindo.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 14, text: "Percebo quando meu tom de voz revela emoções que prefiro não mostrar.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 15, text: "Entendo como meu histórico pessoal influencia minhas reações emocionais.", dimension: "Compreensão de Causas", test: "TOHE" },

  // VE - Velocidade Emocional (15 questões)
  { id: 16, text: "Reajo rapidamente de forma adequada quando alguém precisa de apoio emocional.", dimension: "Reação Rápida", test: "VE" },
  { id: 17, text: "Tomo decisões equilibradas mesmo sob pressão emocional.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 18, text: "Consigo me acalmar rapidamente após situações estressantes.", dimension: "Autorregulação", test: "VE" },
  { id: 19, text: "Respondo de forma apropriada a críticas ou feedback negativo.", dimension: "Reação Rápida", test: "VE" },
  { id: 20, text: "Tomo decisões importantes considerando tanto a lógica quanto as emoções.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 21, text: "Controlo meus impulsos mesmo quando estou muito irritado(a).", dimension: "Autorregulação", test: "VE" },
  { id: 22, text: "Adapto-me rapidamente a mudanças inesperadas no ambiente de trabalho.", dimension: "Reação Rápida", test: "VE" },
  { id: 23, text: "Mantenho a calma em situações de conflito ou tensão.", dimension: "Reação Rápida", test: "VE" },
  { id: 24, text: "Escolho o momento certo para expressar meus sentimentos.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 25, text: "Evito tomar decisões importantes quando estou emocionalmente alterado(a).", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 26, text: "Uso técnicas de respiração ou relaxamento para me acalmar.", dimension: "Autorregulação", test: "VE" },
  { id: 27, text: "Consigo interromper pensamentos negativos antes que me afetem demais.", dimension: "Autorregulação", test: "VE" },
  { id: 28, text: "Respondo construtivamente quando recebo feedback sobre meu comportamento.", dimension: "Reação Rápida", test: "VE" },
  { id: 29, text: "Considero as consequências emocionais antes de tomar decisões importantes.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 30, text: "Mantenho o autocontrole mesmo em situações muito frustrantes.", dimension: "Autorregulação", test: "VE" },

  // QORE - Questionário Online de Regulação Emocional (15 questões)
  { id: 31, text: "Transformo experiências negativas em oportunidades de aprendizado.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 32, text: "Entendo intelectualmente por que as pessoas agem de determinada forma.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 33, text: "Sinto genuinamente as emoções das pessoas próximas a mim.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 34, text: "Encontro aspectos positivos mesmo em situações difíceis.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 35, text: "Analiso logicamente os motivos por trás das ações das pessoas.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 36, text: "Fico emocionalmente tocado(a) quando vejo alguém sofrendo.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 37, text: "Uso o humor para lidar com situações estressantes.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 38, text: "Reinterpreto situações negativas de forma mais positiva.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 39, text: "Compreendo racionalmente as motivações das pessoas, mesmo quando discordo.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 40, text: "Consigo me colocar mentalmente no lugar de outra pessoa.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 41, text: "Sinto-me afetado(a) emocionalmente pela alegria ou tristeza dos outros.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 42, text: "Compartilho naturalmente as emoções das pessoas ao meu redor.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 43, text: "Foco nos aspectos que posso controlar quando enfrento problemas.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 44, text: "Entendo as razões lógicas por trás dos comportamentos das pessoas.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 45, text: "Sinto fisicamente o desconforto emocional dos outros.", dimension: "Empatia Emocional", test: "QORE" }
]

export default function HumaniqBOLIETest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const answeredQuestions = Object.keys(answers).length
  const progress = ((currentQuestion + 1) / questions.length) * 100

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Finalizar automaticamente apenas quando a última pergunta for respondida
    if (currentQuestion === questions.length - 1 && 
        answers[questions[currentQuestion].id] && 
        !showResults && 
        !isSubmitting) {
      const testResults = calculateResults()
      setTimeout(() => {
        completeTest(testResults)
      }, 500) // Mesmo delay do avanço automático
    }
  }, [currentQuestion, answers, showResults, isSubmitting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
    
    // Avanço automático após 500ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      }
      // Se é a última pergunta, a finalização será tratada pelo useEffect
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
              onClick={() => router.push('/colaborador/personalidade')}
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
              onClick={() => router.push('/colaborador/personalidade')}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente verde */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  HumaniQ BOLIE
                </h1>
                <p className="text-green-100">Avaliação de Inteligência Emocional</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-green-100">Questão</div>
              <div className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-green-700" />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {questions[currentQuestion].dimension}
              </Badge>
            </div>
            <CardTitle className="text-xl text-gray-800 leading-relaxed">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Discordo</span>
                <span>Neutro</span>
                <span>Concordo</span>
              </div>
              
              <div className="bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 h-2 rounded-full mb-4"></div>
              
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-16 h-16 border-2 font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                      answers[questions[currentQuestion].id] === value
                        ? value === 1 ? 'bg-red-500 border-red-600 text-white shadow-xl scale-110 ring-2 ring-red-300 animate-pulse'
                        : value === 2 ? 'bg-orange-400 border-orange-500 text-white shadow-xl scale-110 ring-2 ring-orange-300 animate-pulse'
                        : value === 3 ? 'bg-yellow-400 border-yellow-500 text-white shadow-xl scale-110 ring-2 ring-yellow-300 animate-pulse'
                        : value === 4 ? 'bg-lime-400 border-lime-500 text-white shadow-xl scale-110 ring-2 ring-lime-300 animate-pulse'
                        : 'bg-green-500 border-green-600 text-white shadow-xl scale-110 ring-2 ring-green-300 animate-pulse'
                        : value === 1 ? 'bg-red-100 border-red-400 text-red-800 hover:bg-red-200 hover:border-red-500 hover:shadow-lg'
                        : value === 2 ? 'bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200 hover:border-orange-500 hover:shadow-lg'
                        : value === 3 ? 'bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200 hover:border-yellow-500 hover:shadow-lg'
                        : value === 4 ? 'bg-lime-100 border-lime-400 text-lime-800 hover:bg-lime-200 hover:border-lime-500 hover:shadow-lg'
                        : 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200 hover:border-green-500 hover:shadow-lg'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Discordo totalmente</span>
                <span>Discordo</span>
                <span>Neutro</span>
                <span>Concordo</span>
                <span>Concordo totalmente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              Selecione uma resposta para continuar
            </div>
          </div>
          
          {currentQuestion === questions.length - 1 ? (
            <div className="text-center text-sm text-gray-600 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600" />
              Teste finaliza automaticamente
            </div>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!answers[questions[currentQuestion].id]}
              className="bg-green-600 hover:bg-green-700 text-white"
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