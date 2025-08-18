'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LikertScale } from '@/components/ui/likert-scale'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap, 
  TrendingDown,
  Users
} from 'lucide-react'

interface Question {
  id: number
  text: string
  dimension: 'D' | 'I' | 'S' | 'C'
}

interface Results {
  D: number // Dominância
  I: number // Influência
  S: number // Estabilidade
  C: number // Conformidade
}

const questions: Question[] = [
  { id: 1, text: "Gosto de assumir o controle em situações desafiadoras.", dimension: "D" },
  { id: 2, text: "Prefiro trabalhar em equipe e colaborar com outras pessoas.", dimension: "I" },
  { id: 3, text: "Sinto-me confortável em ambientes estáveis e previsíveis.", dimension: "S" },
  { id: 4, text: "Valorizo a precisão e a atenção aos detalhes em tudo que faço.", dimension: "C" },
  { id: 5, text: "Tenho facilidade para tomar decisões rápidas sob pressão.", dimension: "D" },
  { id: 6, text: "Gosto de conhecer pessoas novas e fazer networking.", dimension: "I" },
  { id: 7, text: "Prefiro rotinas bem estabelecidas a mudanças constantes.", dimension: "S" },
  { id: 8, text: "Sempre verifico os detalhes antes de finalizar uma tarefa.", dimension: "C" },
  { id: 9, text: "Sou competitivo e gosto de vencer desafios.", dimension: "D" },
  { id: 10, text: "Tenho facilidade para me expressar e comunicar ideias.", dimension: "I" },
  { id: 11, text: "Valorizo a harmonia e evito conflitos desnecessários.", dimension: "S" },
  { id: 12, text: "Gosto de seguir procedimentos e normas estabelecidas.", dimension: "C" },
  { id: 13, text: "Prefiro liderar a ser liderado.", dimension: "D" },
  { id: 14, text: "Sou otimista e consigo motivar outras pessoas.", dimension: "I" },
  { id: 15, text: "Trabalho melhor quando tenho tempo suficiente para completar as tarefas.", dimension: "S" },
  { id: 16, text: "Analiso cuidadosamente os prós e contras antes de decidir.", dimension: "C" },
  { id: 17, text: "Gosto de assumir riscos calculados para alcançar meus objetivos.", dimension: "D" },
  { id: 18, text: "Tenho facilidade para persuadir e influenciar outras pessoas.", dimension: "I" },
  { id: 19, text: "Prefiro ambientes de trabalho calmos e organizados.", dimension: "S" },
  { id: 20, text: "Sou meticuloso e raramente cometo erros por descuido.", dimension: "C" },
  { id: 21, text: "Tenho iniciativa e gosto de começar novos projetos.", dimension: "D" },
  { id: 22, text: "Sou sociável e me sinto energizado em grupos.", dimension: "I" },
  { id: 23, text: "Valorizo a lealdade e a confiança nos relacionamentos.", dimension: "S" },
  { id: 24, text: "Prefiro ter todas as informações antes de agir.", dimension: "C" },
  { id: 25, text: "Sou direto e objetivo ao comunicar minhas opiniões.", dimension: "D" },
  { id: 26, text: "Gosto de ser o centro das atenções em apresentações.", dimension: "I" },
  { id: 27, text: "Sou paciente e consigo esperar pelos resultados.", dimension: "S" },
  { id: 28, text: "Valorizo a qualidade mais do que a velocidade.", dimension: "C" },
  { id: 29, text: "Gosto de desafios que testam minha capacidade de liderança.", dimension: "D" },
  { id: 30, text: "Tenho facilidade para criar um ambiente descontraído.", dimension: "I" },
  { id: 31, text: "Prefiro trabalhar com pessoas conhecidas e confiáveis.", dimension: "S" },
  { id: 32, text: "Sou sistemático e organizado em minha abordagem.", dimension: "C" },
  { id: 33, text: "Não tenho medo de confrontar problemas difíceis.", dimension: "D" },
  { id: 34, text: "Gosto de compartilhar ideias e receber feedback.", dimension: "I" },
  { id: 35, text: "Valorizo a estabilidade no emprego e na carreira.", dimension: "S" },
  { id: 36, text: "Prefiro seguir métodos comprovados a improvisar.", dimension: "C" },
  { id: 37, text: "Sou determinado e persisto até alcançar meus objetivos.", dimension: "D" },
  { id: 38, text: "Tenho facilidade para trabalhar em equipes multidisciplinares.", dimension: "I" },
  { id: 39, text: "Gosto de ambientes onde posso ajudar outras pessoas.", dimension: "S" },
  { id: 40, text: "Sempre busco a excelência em tudo que faço.", dimension: "C" },
  { id: 41, text: "Prefiro tomar decisões independentes a consultar outros.", dimension: "D" },
  { id: 42, text: "Sou entusiasta e consigo contagiar outros com minha energia.", dimension: "I" },
  { id: 43, text: "Valorizo relacionamentos duradouros e estáveis.", dimension: "S" },
  { id: 44, text: "Gosto de trabalhar com dados e informações precisas.", dimension: "C" },
  { id: 45, text: "Sou assertivo ao defender minhas posições.", dimension: "D" },
  { id: 46, text: "Tenho facilidade para me adaptar a diferentes grupos sociais.", dimension: "I" },
  { id: 47, text: "Prefiro mudanças graduais a transformações bruscas.", dimension: "S" },
  { id: 48, text: "Sou cauteloso e evito decisões precipitadas.", dimension: "C" },
  { id: 49, text: "Gosto de estar no comando e dirigir equipes.", dimension: "D" },
  { id: 50, text: "Sou expressivo e demonstro facilmente minhas emoções.", dimension: "I" },
  { id: 51, text: "Valorizo a cooperação mais do que a competição.", dimension: "S" },
  { id: 52, text: "Prefiro ter tempo para planejar antes de executar.", dimension: "C" },
  { id: 53, text: "Sou impaciente com processos lentos e burocráticos.", dimension: "D" },
  { id: 54, text: "Gosto de variedade e mudanças em minha rotina.", dimension: "I" },
  { id: 55, text: "Sou confiável e as pessoas podem contar comigo.", dimension: "S" },
  { id: 56, text: "Valorizo a precisão mais do que a rapidez.", dimension: "C" },
  { id: 57, text: "Tenho facilidade para lidar com situações de crise.", dimension: "D" },
  { id: 58, text: "Sou comunicativo e gosto de interagir com pessoas.", dimension: "I" },
  { id: 59, text: "Prefiro ambientes harmoniosos a competitivos.", dimension: "S" },
  { id: 60, text: "Sou detalhista e não gosto de deixar nada ao acaso.", dimension: "C" },
  { id: 61, text: "Gosto de estabelecer metas ambiciosas e alcançá-las.", dimension: "D" },
  { id: 62, text: "Tenho facilidade para inspirar e motivar equipes.", dimension: "I" },
  { id: 63, text: "Valorizo a segurança e a previsibilidade.", dimension: "S" },
  { id: 64, text: "Sigo padrões estabelecidos mesmo quando ninguém está supervisionando.", dimension: "C" },
  { id: 65, text: "Tenho uma postura assertiva e gosto de tomar a frente de projetos.", dimension: "D" },
  { id: 66, text: "Uso meu carisma para envolver os outros em minhas ideias.", dimension: "I" },
  { id: 67, text: "Prezo por harmonia nos relacionamentos e evito confrontos.", dimension: "S" },
  { id: 68, text: "Tenho atenção especial aos detalhes, mesmo em tarefas rotineiras.", dimension: "C" },
  { id: 69, text: "Sou competitivo e gosto de vencer desafios.", dimension: "D" },
  { id: 70, text: "Gosto de ambientes onde posso ser espontâneo e criativo.", dimension: "I" },
  { id: 71, text: "Trabalho melhor quando sei exatamente o que se espera de mim.", dimension: "S" },
  { id: 72, text: "Sigo instruções com disciplina e responsabilidade.", dimension: "C" },
  { id: 73, text: "Tomo decisões rápidas quando necessário, sem hesitação.", dimension: "D" },
  { id: 74, text: "Sinto-me motivado em interações sociais e conversas descontraídas.", dimension: "I" },
  { id: 75, text: "Evito ambientes agitados ou excessivamente dinâmicos.", dimension: "S" },
  { id: 76, text: "Tenho facilidade para lidar com regras rígidas e sistemas complexos.", dimension: "C" },
  { id: 77, text: "Posso ser firme ao impor limites ou decisões importantes.", dimension: "D" },
  { id: 78, text: "Gosto de ser o centro das atenções em reuniões e apresentações.", dimension: "I" },
  { id: 79, text: "Sinto-me mais produtivo em um ambiente tranquilo e organizado.", dimension: "S" },
  { id: 80, text: "Evito improvisações e prefiro planejamentos bem definidos.", dimension: "C" },
  { id: 81, text: "Gosto de estar no controle e prefiro assumir a liderança.", dimension: "D" },
  { id: 82, text: "Prefiro estabelecer relacionamentos pessoais e aproximar-me de pessoas de diferentes áreas.", dimension: "I" },
  { id: 83, text: "Tenho facilidade para adaptar minhas estratégias conforme o contexto.", dimension: "S" },
  { id: 84, text: "Gosto de ambientes com forte estrutura e regras bem definidas.", dimension: "C" },
  { id: 85, text: "Consigo lidar bem com situações onde outras pessoas não estão cumprindo suas responsabilidades.", dimension: "D" },
  { id: 86, text: "Prefiro trabalhar em grupo do que de forma isolada.", dimension: "I" },
  { id: 87, text: "Costumo seguir meu instinto para tomar decisões rápidas.", dimension: "D" },
  { id: 88, text: "Sempre busco entender profundamente o contexto antes de agir.", dimension: "C" },
  { id: 89, text: "Tenho facilidade em ouvir diferentes opiniões e reunir consenso entre as pessoas.", dimension: "S" },
  { id: 90, text: "Sou altamente motivado por resultados e metas bem definidas.", dimension: "D" },
  { id: 91, text: "Prefiro uma abordagem estruturada, com todos os detalhes planejados com antecedência.", dimension: "C" },
  { id: 92, text: "Sinto-me confortável em ambientes de pressão onde decisões rápidas precisam ser tomadas.", dimension: "D" },
  { id: 93, text: "Em projetos, gosto de ter liberdade para testar novas abordagens e soluções criativas.", dimension: "I" },
  { id: 94, text: "Prefiro evitar conflitos e focar na colaboração harmoniosa com os outros.", dimension: "S" },
  { id: 95, text: "Gosto de ser desafiado em minhas tarefas e responsabilidades diárias.", dimension: "D" },
  { id: 96, text: "Sou detalhista e gosto de revisar minuciosamente o que foi feito.", dimension: "C" },
  { id: 97, text: "Sinto-me confortável com mudanças rápidas e imprevistas.", dimension: "I" },
  { id: 98, text: "Prezo pela eficiência e pela otimização de processos.", dimension: "C" },
  { id: 99, text: "Em situações difíceis, sou capaz de manter a calma e agir de maneira lógica.", dimension: "S" },
  { id: 100, text: "Gosto de receber feedback construtivo para melhorar meu desempenho.", dimension: "I" }
]

const dimensionConfig = {
  D: {
    name: 'Dominância',
    description: 'Orientação para resultados, assertividade e liderança',
    icon: '🎯',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    progress: 'bg-red-600'
  },
  I: {
    name: 'Influência',
    description: 'Sociabilidade, comunicação e persuasão',
    icon: '🌟',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    progress: 'bg-yellow-600'
  },
  S: {
    name: 'Estabilidade',
    description: 'Cooperação, paciência e confiabilidade',
    icon: '🤝',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    progress: 'bg-green-600'
  },
  C: {
    name: 'Conformidade',
    description: 'Precisão, qualidade e seguimento de padrões',
    icon: '📋',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    progress: 'bg-blue-600'
  }
}

export default function HumaniqDiscPage() {
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
      router.push('/colaborador/personalidade/disc/introducao')
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
      D: 0,
      I: 0,
      S: 0,
      C: 0
    }

    // Calcular pontuação por dimensão
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        dimensionScores[question.dimension] += answer
      }
    })

    // Contar quantas questões por dimensão
    const questionCounts = {
      D: questions.filter(q => q.dimension === 'D').length,
      I: questions.filter(q => q.dimension === 'I').length,
      S: questions.filter(q => q.dimension === 'S').length,
      C: questions.filter(q => q.dimension === 'C').length
    }

    // Normalizar scores (0-100)
    const normalizedScores = {
      D: Math.round((dimensionScores.D / (questionCounts.D * 5)) * 100),
      I: Math.round((dimensionScores.I / (questionCounts.I * 5)) * 100),
      S: Math.round((dimensionScores.S / (questionCounts.S * 5)) * 100),
      C: Math.round((dimensionScores.C / (questionCounts.C * 5)) * 100)
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
      setResults(calculatedResults)
      setShowResults(true)
      
      // Salvar resultados na API
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'disc',
          results: calculatedResults,
          answers,
          timeElapsed,
          completedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar resultados')
      }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acesso...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">HumaniQ DISC</h1>
                  <p className="text-purple-100">Perfil Comportamental Profissional</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-100">Tempo Total</div>
                <div className="text-xl font-bold">{formatTime(timeElapsed)}</div>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="bg-white p-6 rounded-b-lg shadow-lg">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Teste Concluído!</h2>
              <p className="text-gray-600">Aqui está seu perfil comportamental DISC</p>
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/colaborador/personalidade')}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Testes
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-purple-600 hover:bg-purple-700 flex items-center"
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
      <div className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HumaniQ DISC</h1>
              <p className="text-purple-100 text-sm">Perfil Comportamental Profissional</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100">Questão</div>
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
              <Badge variant="secondary" className="text-purple-600">
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
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Discordo</span>
                <span>Neutro</span>
                <span>Concordo</span>
              </div>
              
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
                className="bg-purple-600 hover:bg-purple-700 flex items-center"
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