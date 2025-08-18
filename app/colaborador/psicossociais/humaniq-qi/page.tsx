'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LikertScale } from '@/components/ui/likert-scale'

import { ArrowLeft, ArrowRight, Brain, Clock, CheckCircle, Award, Target, Calculator, Zap, Eye } from 'lucide-react'

interface Question {
  id: number
  part: string
  question: string
  options: { value: string; label: string }[]
  correctAnswer: string
}

interface TestResults {
  totalScore: number
  partScores: { [key: string]: number }
  interpretation: string
  level: string
  recommendations: string[]
}

export default function HumaniqQIPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar se deve redirecionar para introdução
  useEffect(() => {
    const startParam = searchParams.get('start')
    if (!startParam || startParam !== 'true') {
      router.push('/colaborador/psicossociais/humaniq-qi/introducao')
    }
  }, [searchParams, router])


  const questions: Question[] = [
    // Parte 1: Raciocínio Lógico
    {
      id: 1,
      part: 'Raciocínio Lógico',
      question: 'Se todos os pássaros voam e o papagaio é um pássaro, então:',
      options: [
        { value: 'a', label: 'O papagaio não voa' },
        { value: 'b', label: 'O papagaio voa' },
        { value: 'c', label: 'O papagaio nada' },
        { value: 'd', label: 'O papagaio corre' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 2,
      part: 'Raciocínio Lógico',
      question: 'Qual é o próximo número da sequência: 2, 4, 8, 16, ___',
      options: [
        { value: 'a', label: '18' },
        { value: 'b', label: '20' },
        { value: 'c', label: '24' },
        { value: 'd', label: '32' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 3,
      part: 'Raciocínio Lógico',
      question: 'Se Ana é mais velha que Beatriz, e Beatriz é mais velha que Carla, quem é a mais nova?',
      options: [
        { value: 'a', label: 'Ana' },
        { value: 'b', label: 'Beatriz' },
        { value: 'c', label: 'Carla' },
        { value: 'd', label: 'Não é possível saber' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 4,
      part: 'Raciocínio Lógico',
      question: 'Qual alternativa completa a sequência lógica: AB, CD, EF, GH, ___',
      options: [
        { value: 'a', label: 'IJ' },
        { value: 'b', label: 'HI' },
        { value: 'c', label: 'JK' },
        { value: 'd', label: 'KL' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 5,
      part: 'Raciocínio Lógico',
      question: 'Se todos os livros da estante são vermelhos e todos os vermelhos são grandes, então:',
      options: [
        { value: 'a', label: 'Todos os livros são grandes' },
        { value: 'b', label: 'Todos os livros são pequenos' },
        { value: 'c', label: 'Nenhum livro é grande' },
        { value: 'd', label: 'Nenhum livro é vermelho' }
      ],
      correctAnswer: 'a'
    },
    // Parte 2: Raciocínio Verbal
    {
      id: 6,
      part: 'Raciocínio Verbal',
      question: 'Complete a analogia: Médico é para hospital assim como professor é para:',
      options: [
        { value: 'a', label: 'Escola' },
        { value: 'b', label: 'Igreja' },
        { value: 'c', label: 'Mercado' },
        { value: 'd', label: 'Cinema' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 7,
      part: 'Raciocínio Verbal',
      question: 'Qual palavra não pertence ao grupo?',
      options: [
        { value: 'a', label: 'Maçã' },
        { value: 'b', label: 'Banana' },
        { value: 'c', label: 'Laranja' },
        { value: 'd', label: 'Tomate' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 8,
      part: 'Raciocínio Verbal',
      question: 'Assinale a alternativa que apresenta um sinônimo de "rápido":',
      options: [
        { value: 'a', label: 'Lento' },
        { value: 'b', label: 'Veloz' },
        { value: 'c', label: 'Fraco' },
        { value: 'd', label: 'Pequeno' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 9,
      part: 'Raciocínio Verbal',
      question: 'Complete a frase: O sol nasce no ___ e se põe no ___.',
      options: [
        { value: 'a', label: 'Norte/Sul' },
        { value: 'b', label: 'Leste/Oeste' },
        { value: 'c', label: 'Oeste/Leste' },
        { value: 'd', label: 'Sul/Norte' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 10,
      part: 'Raciocínio Verbal',
      question: 'Qual é o antônimo de "feliz"?',
      options: [
        { value: 'a', label: 'Alegre' },
        { value: 'b', label: 'Triste' },
        { value: 'c', label: 'Contente' },
        { value: 'd', label: 'Satisfeito' }
      ],
      correctAnswer: 'b'
    },
    // Parte 3: Raciocínio Numérico
    {
      id: 11,
      part: 'Raciocínio Numérico',
      question: 'Qual é a soma de 45 + 37?',
      options: [
        { value: 'a', label: '72' },
        { value: 'b', label: '82' },
        { value: 'c', label: '92' },
        { value: 'd', label: '102' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 12,
      part: 'Raciocínio Numérico',
      question: 'Se um produto custa R$ 120,00 e está com 25% de desconto, qual o valor final?',
      options: [
        { value: 'a', label: 'R$ 90,00' },
        { value: 'b', label: 'R$ 100,00' },
        { value: 'c', label: 'R$ 95,00' },
        { value: 'd', label: 'R$ 85,00' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 13,
      part: 'Raciocínio Numérico',
      question: 'Qual é o próximo número da sequência: 5, 10, 20, 40, ___',
      options: [
        { value: 'a', label: '45' },
        { value: 'b', label: '60' },
        { value: 'c', label: '80' },
        { value: 'd', label: '100' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 14,
      part: 'Raciocínio Numérico',
      question: 'Se um bolo é dividido igualmente entre 8 pessoas e custa R$ 48,00, quanto cada um paga?',
      options: [
        { value: 'a', label: 'R$ 5,00' },
        { value: 'b', label: 'R$ 6,00' },
        { value: 'c', label: 'R$ 7,00' },
        { value: 'd', label: 'R$ 8,00' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 15,
      part: 'Raciocínio Numérico',
      question: 'Qual é o resultado de 7 x 8?',
      options: [
        { value: 'a', label: '54' },
        { value: 'b', label: '56' },
        { value: 'c', label: '58' },
        { value: 'd', label: '64' }
      ],
      correctAnswer: 'b'
    },
    // Parte 4: Raciocínio Espacial
    {
      id: 16,
      part: 'Raciocínio Espacial',
      question: 'Se um cubo tem todas as faces pintadas e é cortado em 27 cubos menores iguais, quantos cubos menores terão exatamente 1 face pintada?',
      options: [
        { value: 'a', label: '6' },
        { value: 'b', label: '8' },
        { value: 'c', label: '12' },
        { value: 'd', label: '24' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 17,
      part: 'Raciocínio Espacial',
      question: 'Qual figura completa a sequência: círculo, quadrado, triângulo, círculo, quadrado, ___',
      options: [
        { value: 'a', label: 'Triângulo' },
        { value: 'b', label: 'Círculo' },
        { value: 'c', label: 'Quadrado' },
        { value: 'd', label: 'Retângulo' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 18,
      part: 'Raciocínio Espacial',
      question: 'Se você está olhando para o sul e gira 270° à direita, para que direção estará olhando?',
      options: [
        { value: 'a', label: 'Oeste' },
        { value: 'b', label: 'Norte' },
        { value: 'c', label: 'Leste' },
        { value: 'd', label: 'Sul' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 19,
      part: 'Raciocínio Espacial',
      question: 'Um retângulo tem 8 cm de largura e 5 cm de altura. Qual é a sua área?',
      options: [
        { value: 'a', label: '13 cm²' },
        { value: 'b', label: '20 cm²' },
        { value: 'c', label: '30 cm²' },
        { value: 'd', label: '40 cm²' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 20,
      part: 'Raciocínio Espacial',
      question: 'Se um relógio marca 3 horas, qual ângulo (em graus) há entre o ponteiro das horas e o dos minutos?',
      options: [
        { value: 'a', label: '90°' },
        { value: 'b', label: '60°' },
        { value: 'c', label: '120°' },
        { value: 'd', label: '180°' }
      ],
      correctAnswer: 'a'
    }
  ]

  // Timer effect
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

  const handleAnswer = (value: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: value
    }
    setAnswers(newAnswers)
    
    // Auto advance to next question or complete test
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Complete test automatically after last question
        completeTest()
      }
    }, 600)
  }

  const handleLikertAnswer = (numericValue: number) => {
    const letterValue = ['a', 'b', 'c', 'd'][numericValue - 1]
    handleAnswer(letterValue)
  }

  const getCurrentNumericValue = () => {
    const currentAnswer = answers[currentQuestion]
    if (!currentAnswer) return undefined
    return ['a', 'b', 'c', 'd'].indexOf(currentAnswer) + 1
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

  const calculateResults = (): TestResults => {
    let totalScore = 0
    const partScores: { [key: string]: number } = {
      'Raciocínio Lógico': 0,
      'Raciocínio Verbal': 0,
      'Raciocínio Numérico': 0,
      'Raciocínio Espacial': 0
    }

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        totalScore++
        partScores[question.part]++
      }
    })

    let interpretation = ''
    let level = ''
    let recommendations: string[] = []

    if (totalScore >= 18) {
      level = 'Muito Acima da Média'
      interpretation = 'QI muito acima da média. Excelente desempenho cognitivo.'
      recommendations = [
        'Continue desafiando-se com problemas complexos',
        'Considere atividades que estimulem ainda mais sua capacidade intelectual',
        'Explore áreas de conhecimento que despertem seu interesse'
      ]
    } else if (totalScore >= 15) {
      level = 'Acima da Média'
      interpretation = 'QI acima da média. Bom desempenho cognitivo.'
      recommendations = [
        'Mantenha atividades que estimulem o raciocínio',
        'Busque desafios intelectuais regulares',
        'Continue desenvolvendo suas habilidades cognitivas'
      ]
    } else if (totalScore >= 10) {
      level = 'Dentro da Média'
      interpretation = 'QI dentro da média. Desempenho cognitivo adequado.'
      recommendations = [
        'Pratique exercícios de raciocínio regularmente',
        'Leia livros e resolva problemas diversos',
        'Mantenha-se mentalmente ativo'
      ]
    } else if (totalScore >= 6) {
      level = 'Abaixo da Média'
      interpretation = 'QI abaixo da média. Sugere-se investigação mais detalhada.'
      recommendations = [
        'Considere buscar orientação profissional',
        'Pratique exercícios cognitivos específicos',
        'Avalie fatores que podem estar influenciando o desempenho'
      ]
    } else {
      level = 'Avaliação Necessária'
      interpretation = 'Procure avaliação especializada para investigação mais aprofundada.'
      recommendations = [
        'Busque avaliação neuropsicológica completa',
        'Consulte um profissional especializado',
        'Investigue possíveis fatores interferentes'
      ]
    }

    return {
      totalScore,
      partScores,
      interpretation,
      level,
      recommendations
    }
  }

  const completeTest = async () => {
    setIsSubmitting(true)
    
    try {
      // 1. Criar sessão de teste
      const sessionResponse = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: 'cme216bqg000f8wg08lorykq7'
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Falha ao criar sessão de teste')
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.sessionId

      // 2. Preparar dados para submissão
       const submissionData = {
         testId: 'cme216bqg000f8wg08lorykq7',
        sessionId: sessionId,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === parseInt(questionId))
          return {
            questionId: parseInt(questionId),
            selectedOption: answer,
            isCorrect: question ? answer === question.correctAnswer : false
          }
        }),
        duration: timeElapsed,
        metadata: {
          testName: 'HumaniQ QI – Quociente de Inteligência',
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
      
      // 4. Calcular e exibir resultados localmente
      const testResults = calculateResults()
      setResults(testResults)
      setShowResults(true)
      
      // 5. Redirecionar para página de resultados após um delay
      setTimeout(() => {
        window.location.href = '/colaborador/resultados'
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao completar teste:', error)
      // Em caso de erro, ainda mostra os resultados localmente
      const testResults = calculateResults()
      setResults(testResults)
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPartIcon = (part: string) => {
    switch (part) {
      case 'Raciocínio Lógico':
        return Brain
      case 'Raciocínio Verbal':
        return Zap
      case 'Raciocínio Numérico':
        return Calculator
      case 'Raciocínio Espacial':
        return Eye
      default:
        return Target
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Muito Acima da Média':
        return 'bg-green-100 text-green-800'
      case 'Acima da Média':
        return 'bg-blue-100 text-blue-800'
      case 'Dentro da Média':
        return 'bg-yellow-100 text-yellow-800'
      case 'Abaixo da Média':
        return 'bg-orange-100 text-orange-800'
      case 'Avaliação Necessária':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
            
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Teste Concluído!
              </h1>
              <p className="text-xl text-gray-600">
                HumaniQ QI - Resultados
              </p>
            </div>
          </div>

          {/* Resumo Geral */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Resumo Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {results.totalScore}/20
                  </div>
                  <div className="text-sm text-gray-600">Pontuação Total</div>
                </div>
                
                <div className="text-center">
                  <Badge className={getLevelColor(results.level)} variant="secondary">
                    {results.level}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-2">Classificação</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-sm text-gray-600">Tempo Total</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">{results.interpretation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Resultados por Parte */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Resultados por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.partScores).map(([part, score]) => {
                  const Icon = getPartIcon(part)
                  return (
                    <div key={part} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{part}</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(score, 5)}`}>
                          {score}/5
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

          {/* Recomendações */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
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
                  <strong>Importante:</strong> Este teste oferece uma avaliação inicial das capacidades cognitivas. 
                  Os resultados devem ser interpretados considerando fatores como idade, escolaridade, 
                  condições de saúde e contexto cultural. Para uma avaliação mais completa e precisa, 
                  consulte um profissional especializado em avaliação neuropsicológica.
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              Refazer Teste
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
                HumaniQ QI
              </h1>
              <p className="text-gray-600">Teste Completo de QI</p>
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentQ.part}
              </Badge>
              <span className="text-sm text-gray-500">
                Questão {currentQuestion + 1}
              </span>
            </div>
            <CardTitle className="text-lg">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Opções de Resposta com layout horizontal */}
            <div className="space-y-6">
              {/* Botões A, B, C, D lado a lado */}
              <div className="flex justify-center gap-4 flex-wrap">
                {currentQ.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option.value
                  const colors = [
                    'bg-red-200 hover:bg-red-300 border-red-300 text-red-800',
                    'bg-orange-200 hover:bg-orange-300 border-orange-300 text-orange-800', 
                    'bg-yellow-200 hover:bg-yellow-300 border-yellow-300 text-yellow-800',
                    'bg-green-200 hover:bg-green-300 border-green-300 text-green-800'
                  ]
                  const selectedColors = [
                    'bg-red-300 border-red-400 text-red-900',
                    'bg-orange-300 border-orange-400 text-orange-900',
                    'bg-yellow-300 border-yellow-400 text-yellow-900', 
                    'bg-green-300 border-green-400 text-green-900'
                  ]

                  return (
                    <div key={option.value} className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleAnswer(option.value)}
                        className={`
                          w-16 h-16 rounded-xl border-2 font-bold text-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${isSelected ? selectedColors[index] : colors[index]}
                        `}
                      >
                        {option.value.toUpperCase()}
                      </button>
                      <span className="text-sm text-gray-600 text-center font-medium max-w-24">{option.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
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
            {currentQ.part} - {currentQuestion + 1}/{questions.length}
          </div>
          
          {currentQuestion === questions.length - 1 ? (
            <div className="text-center text-sm text-gray-600 px-4 py-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600" />
              Teste finaliza automaticamente
            </div>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
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