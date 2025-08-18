'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Brain, Zap, Target, Users, Award, Focus, TrendingUp, Shield } from 'lucide-react'
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
  // Abertura à mudança (6 questões)
  { id: 1, text: "Sinto-me confortável com mudanças repentinas no trabalho.", dimension: "Abertura à mudança", test: "FLEX" },
  { id: 2, text: "Gosto de experimentar novas formas de realizar minhas tarefas.", dimension: "Abertura à mudança", test: "FLEX" },
  { id: 3, text: "Vejo a mudança como uma oportunidade, não como uma ameaça.", dimension: "Abertura à mudança", test: "FLEX" },
  { id: 4, text: "Adapto-me facilmente a novas regras ou políticas.", dimension: "Abertura à mudança", test: "FLEX" },
  { id: 5, text: "Aceito bem lideranças ou colegas diferentes do habitual.", dimension: "Abertura à mudança", test: "FLEX" },
  { id: 6, text: "Encaro transições com positividade e disposição.", dimension: "Abertura à mudança", test: "FLEX" },

  // Resiliência emocional (6 questões)
  { id: 7, text: "Mantenho o foco mesmo em situações de crise.", dimension: "Resiliência emocional", test: "FLEX" },
  { id: 8, text: "Costumo me recuperar rapidamente após frustrações.", dimension: "Resiliência emocional", test: "FLEX" },
  { id: 9, text: "Lido bem com pressões inesperadas.", dimension: "Resiliência emocional", test: "FLEX" },
  { id: 10, text: "Permaneço otimista diante de desafios.", dimension: "Resiliência emocional", test: "FLEX" },
  { id: 11, text: "Evito reagir impulsivamente a mudanças de planos.", dimension: "Resiliência emocional", test: "FLEX" },
  { id: 12, text: "Consigo manter a calma em ambientes instáveis.", dimension: "Resiliência emocional", test: "FLEX" },

  // Aprendizagem contínua (6 questões)
  { id: 13, text: "Tenho interesse constante em aprender coisas novas.", dimension: "Aprendizagem contínua", test: "FLEX" },
  { id: 14, text: "Busco feedbacks para melhorar meu desempenho.", dimension: "Aprendizagem contínua", test: "FLEX" },
  { id: 15, text: "Atualizo meus conhecimentos mesmo sem exigência da empresa.", dimension: "Aprendizagem contínua", test: "FLEX" },
  { id: 16, text: "Encaro erros como oportunidades de crescimento.", dimension: "Aprendizagem contínua", test: "FLEX" },
  { id: 17, text: "Busco entender novas tecnologias ou processos.", dimension: "Aprendizagem contínua", test: "FLEX" },
  { id: 18, text: "Tenho curiosidade em relação a novos contextos profissionais.", dimension: "Aprendizagem contínua", test: "FLEX" },

  // Flexibilidade comportamental (6 questões)
  { id: 19, text: "Modifico meu estilo de comunicação conforme o público.", dimension: "Flexibilidade comportamental", test: "FLEX" },
  { id: 20, text: "Ajusto minha rotina de trabalho diante de novas prioridades.", dimension: "Flexibilidade comportamental", test: "FLEX" },
  { id: 21, text: "Aceito mudanças em projetos mesmo que exijam recomeçar.", dimension: "Flexibilidade comportamental", test: "FLEX" },
  { id: 22, text: "Adapto minha forma de pensar quando recebo bons argumentos.", dimension: "Flexibilidade comportamental", test: "FLEX" },
  { id: 23, text: "Mudo de estratégia se os resultados não aparecem.", dimension: "Flexibilidade comportamental", test: "FLEX" },
  { id: 24, text: "Consigo equilibrar diferentes tarefas e demandas simultâneas.", dimension: "Flexibilidade comportamental", test: "FLEX" }
]

export default function HumaniqFLEXTest() {
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

  // Removido useEffect - finalização agora ocorre diretamente no handleAnswer

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (value: number) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: value
    }
    setAnswers(newAnswers)
    
    // Verificar se é a última pergunta e finalizar automaticamente
    if (currentQuestion === questions.length - 1) {
      // É a última pergunta - finalizar teste automaticamente
      setTimeout(() => {
        const testResults = calculateResults(newAnswers)
        completeTest(testResults)
      }, 500)
    } else {
      // Não é a última pergunta - avançar para próxima
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 500)
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

    // Calcular soma total por dimensão (máximo 30 por dimensão)
    const dimensionScores: Record<string, number> = {}
    Object.entries(dimensionGroups).forEach(([dimension, scores]) => {
      const total = scores.reduce((sum, score) => sum + score, 0)
      dimensionScores[dimension] = total
    })

    const testScores: Record<string, number> = {}
    Object.entries(testGroups).forEach(([test, scores]) => {
      const total = scores.reduce((sum, score) => sum + score, 0)
      testScores[test] = total
    })

    // Calcular pontuação total (máximo 120 pontos)
    const totalAnswers = Object.values(answersToUse)
    const overallScore = totalAnswers.reduce((sum, score) => sum + score, 0)

    // Classificação baseada na pontuação total
    let classification = ""
    if (overallScore >= 110) {
      classification = "Adaptabilidade excepcional"
    } else if (overallScore >= 90) {
      classification = "Alta adaptabilidade"
    } else if (overallScore >= 60) {
      classification = "Adaptabilidade moderada"
    } else {
      classification = "Baixa adaptabilidade"
    }

    return {
      overallScore,
      classification,
      dimensionScores,
      testScores
    }
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
      case "Baixa adaptabilidade":
        return "text-red-600 bg-red-50"
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
          testId: 'flex-test-id' // ID específico do teste FLEX
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Falha ao criar sessão de teste')
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.sessionId

      // 2. Preparar dados para submissão
      const submissionData = {
        testId: 'flex-test-id',
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
          testName: 'HumaniQ FLEX – Avaliação de Adaptabilidade',
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
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
              className="bg-orange-600 hover:bg-orange-700"
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
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  HumaniQ FLEX – Avaliação de Adaptabilidade
                </h1>
                <p className="text-green-50">Avaliação de Adaptabilidade</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-green-50">Questão</div>
              <div className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-green-800" />
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
                {questions[currentQuestion]?.dimension}
              </Badge>
            </div>
            <CardTitle className="text-xl text-gray-800 leading-relaxed">
              {questions[currentQuestion]?.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={answers[questions[currentQuestion]?.id]}
              onChange={handleAnswer}
              className="mb-8"
            />
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
              disabled={!answers[questions[currentQuestion]?.id]}
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