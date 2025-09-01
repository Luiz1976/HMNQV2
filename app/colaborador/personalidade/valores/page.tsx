'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Brain, Target, Users, Heart, Zap, AlertTriangle, Clock, Play, Trophy, TrendingUp, TrendingDown, Shield, Lightbulb } from 'lucide-react'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: 'universalismo' | 'benevolencia' | 'realizacao' | 'poder' | 'hedonismo' | 'estimulacao' | 'autodirecao' | 'seguranca' | 'conformidade' | 'tradicao'
}

interface Results {
  universalismo: number
  benevolencia: number
  realizacao: number
  poder: number
  hedonismo: number
  estimulacao: number
  autodirecao: number
  seguranca: number
  conformidade: number
  tradicao: number
}

const questions: Question[] = [
  // 1. Universalismo (valorização do bem comum, igualdade, sustentabilidade)
  { id: 1, text: "Acredito que todos devem ser tratados com igualdade e respeito.", dimension: 'universalismo' },
  { id: 2, text: "Me preocupo com problemas ambientais.", dimension: 'universalismo' },
  { id: 3, text: "Defendo a diversidade cultural e a inclusão.", dimension: 'universalismo' },
  { id: 4, text: "Sinto responsabilidade pelas gerações futuras.", dimension: 'universalismo' },
  { id: 5, text: "Tenho empatia com quem sofre, mesmo que esteja longe de mim.", dimension: 'universalismo' },

  // 2. Benevolência (ajuda e cuidado com quem está próximo)
  { id: 6, text: "Procuro ajudar pessoas próximas sempre que possível.", dimension: 'benevolencia' },
  { id: 7, text: "Me preocupo com o bem-estar da minha equipe.", dimension: 'benevolencia' },
  { id: 8, text: "Tenho prazer em apoiar colegas em dificuldades.", dimension: 'benevolencia' },
  { id: 9, text: "Prezo pela harmonia nos relacionamentos.", dimension: 'benevolencia' },
  { id: 10, text: "Evito atitudes que possam prejudicar pessoas ao meu redor.", dimension: 'benevolencia' },

  // 3. Realização (êxito pessoal e competência reconhecida)
  { id: 11, text: "Me esforço para alcançar meus objetivos com excelência.", dimension: 'realizacao' },
  { id: 12, text: "Busco ser reconhecido pelo meu desempenho.", dimension: 'realizacao' },
  { id: 13, text: "Sinto motivação quando supero desafios.", dimension: 'realizacao' },
  { id: 14, text: "Tenho ambição de crescer profissionalmente.", dimension: 'realizacao' },
  { id: 15, text: "O sucesso pessoal é uma prioridade para mim.", dimension: 'realizacao' },

  // 4. Poder (status, domínio, influência)
  { id: 16, text: "Gosto de estar em posições de liderança.", dimension: 'poder' },
  { id: 17, text: "Quero ser respeitado pela minha autoridade.", dimension: 'poder' },
  { id: 18, text: "Ter influência sobre decisões me realiza.", dimension: 'poder' },
  { id: 19, text: "Valorizo alcançar status elevado.", dimension: 'poder' },
  { id: 20, text: "Busco segurança através de poder financeiro ou social.", dimension: 'poder' },

  // 5. Hedonismo (prazer, bem-estar, gratificação)
  { id: 21, text: "Gosto de aproveitar a vida com conforto e prazer.", dimension: 'hedonismo' },
  { id: 22, text: "Busco momentos de lazer mesmo em dias de trabalho intenso.", dimension: 'hedonismo' },
  { id: 23, text: "Sinto que o trabalho deve proporcionar satisfação pessoal.", dimension: 'hedonismo' },
  { id: 24, text: "Gosto de recompensas que tragam prazer imediato.", dimension: 'hedonismo' },
  { id: 25, text: "Prezo pelo equilíbrio entre dever e prazer.", dimension: 'hedonismo' },

  // 6. Estimulação (novidade, desafios, variedade)
  { id: 26, text: "Me motivo com projetos diferentes e inovadores.", dimension: 'estimulacao' },
  { id: 27, text: "Rotinas muito fixas me desanimam.", dimension: 'estimulacao' },
  { id: 28, text: "Gosto de experimentar coisas novas.", dimension: 'estimulacao' },
  { id: 29, text: "Busco desafios que me tirem da zona de conforto.", dimension: 'estimulacao' },
  { id: 30, text: "Sinto prazer em correr riscos controlados.", dimension: 'estimulacao' },

  // 7. Autodireção (independência, autonomia de pensamento e ação)
  { id: 31, text: "Gosto de decidir como realizar meu trabalho.", dimension: 'autodirecao' },
  { id: 32, text: "Prefiro ter liberdade do que seguir ordens rígidas.", dimension: 'autodirecao' },
  { id: 33, text: "Penso com independência, mesmo que isso gere conflitos.", dimension: 'autodirecao' },
  { id: 34, text: "Me incomoda ter que seguir regras sem sentido.", dimension: 'autodirecao' },
  { id: 35, text: "Tenho preferência por tarefas que me permitam criar.", dimension: 'autodirecao' },

  // 8. Segurança (estabilidade pessoal e organizacional)
  { id: 36, text: "Busco estabilidade e previsibilidade no ambiente de trabalho.", dimension: 'seguranca' },
  { id: 37, text: "Me preocupo com riscos que afetem minha segurança ou a da equipe.", dimension: 'seguranca' },
  { id: 38, text: "Valorizo normas e políticas claras.", dimension: 'seguranca' },
  { id: 39, text: "A segurança financeira é essencial para mim.", dimension: 'seguranca' },
  { id: 40, text: "Me tranquiliza saber que estou em um ambiente protegido.", dimension: 'seguranca' },

  // 9. Conformidade (obediência a normas, autocontrole)
  { id: 41, text: "Cumpro regras, mesmo que não concorde totalmente com elas.", dimension: 'conformidade' },
  { id: 42, text: "Acredito que seguir processos é importante para a harmonia.", dimension: 'conformidade' },
  { id: 43, text: "Evito agir impulsivamente.", dimension: 'conformidade' },
  { id: 44, text: "Sinto desconforto quando os outros não respeitam regras.", dimension: 'conformidade' },
  { id: 45, text: "A disciplina é fundamental em qualquer organização.", dimension: 'conformidade' },

  // 10. Tradição (valores culturais e costumes estabelecidos)
  { id: 46, text: "Respeito valores e práticas tradicionais.", dimension: 'tradicao' },
  { id: 47, text: "Acredito que há sabedoria em costumes antigos.", dimension: 'tradicao' },
  { id: 48, text: "Mantenho rituais e rotinas que me conectam com minhas raízes.", dimension: 'tradicao' },
  { id: 49, text: "Valorizo a história e os princípios que moldaram quem sou.", dimension: 'tradicao' },
  { id: 50, text: "Acredito que tradições mantêm a coesão social.", dimension: 'tradicao' }
]

const dimensionConfig = {
  universalismo: {
    name: 'Universalismo',
    color: 'bg-emerald-500',
    icon: '🌍',
    description: 'Valorização do bem comum, igualdade e sustentabilidade',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    progress: 'bg-emerald-500'
  },
  benevolencia: {
    name: 'Benevolência',
    color: 'bg-green-500',
    icon: '🤲',
    description: 'Ajuda e cuidado com quem está próximo',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    progress: 'bg-green-500'
  },
  realizacao: {
    name: 'Realização',
    color: 'bg-yellow-500',
    icon: '🏆',
    description: 'Êxito pessoal e competência reconhecida',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    progress: 'bg-yellow-500'
  },
  poder: {
    name: 'Poder',
    color: 'bg-red-500',
    icon: '👑',
    description: 'Status, domínio e influência',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    progress: 'bg-red-500'
  },
  hedonismo: {
    name: 'Hedonismo',
    color: 'bg-pink-500',
    icon: '🎉',
    description: 'Prazer, bem-estar e gratificação',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-600',
    progress: 'bg-pink-500'
  },
  estimulacao: {
    name: 'Estimulação',
    color: 'bg-orange-500',
    icon: '⚡',
    description: 'Novidade, desafios e variedade',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    progress: 'bg-orange-500'
  },
  autodirecao: {
    name: 'Autodireção',
    color: 'bg-blue-500',
    icon: '🎯',
    description: 'Independência e autonomia de pensamento',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    progress: 'bg-blue-500'
  },
  seguranca: {
    name: 'Segurança',
    color: 'bg-indigo-500',
    icon: '🛡️',
    description: 'Estabilidade pessoal e organizacional',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
    progress: 'bg-indigo-500'
  },
  conformidade: {
    name: 'Conformidade',
    color: 'bg-purple-500',
    icon: '📋',
    description: 'Obediência a normas e autocontrole',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    progress: 'bg-purple-500'
  },
  tradicao: {
    name: 'Tradição',
    color: 'bg-amber-600',
    icon: '🏛️',
    description: 'Valores culturais e costumes estabelecidos',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    progress: 'bg-amber-600'
  }
}

export default function HumaniqValoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [isValidated, setIsValidated] = useState(false)

  // Validação do parâmetro start=true
  useEffect(() => {
    const startParam = searchParams.get('start')
    if (startParam === 'true') {
      setIsValidated(true)
      setTestStarted(true)
    } else {
      // Redirecionar para página de introdução se não tiver parâmetro start=true
      router.push('/colaborador/personalidade/valores/introducao')
    }
  }, [searchParams, router])

  // Timer automático
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [testStarted, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateResults = (): Results => {
    const dimensionScores = {
      universalismo: 0,
      benevolencia: 0,
      realizacao: 0,
      poder: 0,
      hedonismo: 0,
      estimulacao: 0,
      autodirecao: 0,
      seguranca: 0,
      conformidade: 0,
      tradicao: 0
    }

    // Calcular pontuação por dimensão (5 questões por dimensão)
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        dimensionScores[question.dimension] += answer
      }
    })

    // Normalizar scores (0-100) - 5 questões por dimensão, máximo 25 pontos
    const normalizedScores = {
      universalismo: Math.round((dimensionScores.universalismo / 25) * 100),
      benevolencia: Math.round((dimensionScores.benevolencia / 25) * 100),
      realizacao: Math.round((dimensionScores.realizacao / 25) * 100),
      poder: Math.round((dimensionScores.poder / 25) * 100),
      hedonismo: Math.round((dimensionScores.hedonismo / 25) * 100),
      estimulacao: Math.round((dimensionScores.estimulacao / 25) * 100),
      autodirecao: Math.round((dimensionScores.autodirecao / 25) * 100),
      seguranca: Math.round((dimensionScores.seguranca / 25) * 100),
      conformidade: Math.round((dimensionScores.conformidade / 25) * 100),
      tradicao: Math.round((dimensionScores.tradicao / 25) * 100)
    }

    return normalizedScores
  }

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
    
    // Avanço automático após 500ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }, 500)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const calculatedResults = calculateResults()
      
      // Primeiro salvar resultados na API
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: `valores_${Date.now()}`,
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          testType: 'valores',
          results: calculatedResults,
          answers,
          duration: timeElapsed,
          timeElapsed,
          completedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar resultados')
      }

      // Após salvar com sucesso, definir resultados
      setResults(calculatedResults)
      setShowResults(true)
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
      // Ainda assim mostrar resultados localmente
      const calculatedResults = calculateResults()
      setResults(calculatedResults)
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentAnswer = answers[questions[currentQuestion]?.id]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = currentAnswer !== undefined

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acesso...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    // Determinar dimensões mais e menos pronunciadas para análise personalizada
    const sortedDimensions = Object.entries(results).sort(([, a], [, b]) => b - a)
    const [topDimensionKey, topDimensionScore] = sortedDimensions[0]
    const [bottomDimensionKey, bottomDimensionScore] = sortedDimensions[sortedDimensions.length - 1]
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">HumaniQ VALORES</h1>
                  <p className="text-emerald-100">Perfil de Valores Organizacionais</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-emerald-100">Tempo Total</div>
                <div className="text-xl font-bold">{formatTime(timeElapsed)}</div>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="bg-white p-6 rounded-b-lg shadow-lg">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Teste Concluído!</h2>
              <p className="text-gray-600">Aqui estão seus resultados de valores organizacionais</p>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {Object.entries(results).map(([dimension, score]) => {
                const config = dimensionConfig[dimension as keyof typeof dimensionConfig]
                
                return (
                  <Card key={dimension} className={`${config.border} border-2`}>
                    <CardHeader className={config.bg}>
                      <CardTitle className={`${config.text} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{config.icon}</span>
                          <span>{config.name}</span>
                        </div>
                        <Badge variant="secondary" className={`${config.text} font-bold`}>
                          {score}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-3">
                        <Progress value={score} className="h-3" />
                      </div>
                      <p className="text-sm text-gray-600">{config.description}</p>
                      <div className="mt-3">
                        {score >= 80 && (
                          <div className="flex items-center text-green-600 text-sm">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Muito Alto</span>
                          </div>
                        )}
                        {score >= 60 && score < 80 && (
                          <div className="flex items-center text-blue-600 text-sm">
                            <Target className="w-4 h-4 mr-1" />
                            <span>Alto</span>
                          </div>
                        )}
                        {score >= 40 && score < 60 && (
                          <div className="flex items-center text-yellow-600 text-sm">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>Moderado</span>
                          </div>
                        )}
                        {score < 40 && (
                          <div className="flex items-center text-red-600 text-sm">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span>Baixo</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Análise Personalizada */}
            <div className="mb-8 bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Análise Profunda dos Seus Valores</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Seu valor mais proeminente é{" "}
                <span className="font-semibold text-emerald-700">
                  {dimensionConfig[topDimensionKey as keyof typeof dimensionConfig].name}
                </span>{" "}
                com <span className="font-semibold">{topDimensionScore}%</span> de alinhamento. Isso indica que você tem
                uma forte tendência a priorizar esse aspecto no seu dia a dia, guiando decisões e comportamentos.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                Por outro lado, o valor menos ativado foi{" "}
                <span className="font-semibold text-red-700">
                  {dimensionConfig[bottomDimensionKey as keyof typeof dimensionConfig].name}
                </span>{" "}
                ({bottomDimensionScore}%). Isso não significa que você desconsidere esse valor, mas que ele exerce menor
                influência nas suas escolhas atuais.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Reflita sobre como esses resultados se alinham com suas metas pessoais e profissionais. Ao reconhecer
                seus valores centrais, você poderá tomar decisões mais congruentes e buscar ambientes que respeitem e
                potencializem aquilo que é realmente importante para você.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/colaborador/testes')}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Testes
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Imprimir Resultados
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HumaniQ VALORES</h1>
              <p className="text-emerald-100 text-sm">Perfil de Valores Organizacionais</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-100">Questão</div>
            <div className="text-xl font-bold">{currentQuestion + 1}/{questions.length}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-emerald-600">
                {dimensionConfig[questions[currentQuestion].dimension]?.name}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeElapsed)}
              </div>
            </div>
            <CardTitle className="text-xl text-gray-800 leading-relaxed">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <LikertScale
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <div className="text-center text-gray-500 text-sm">
                Selecione uma resposta para continuar
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    {isLastQuestion ? 'Finalizar' : 'Próxima'}
                    {!isLastQuestion && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}