'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Brain, Target, Users, Heart, Zap, AlertTriangle, Clock, Play, Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: 'autonomia' | 'reconhecimento' | 'crescimento' | 'seguranca' | 'proposito' | 'recompensa' | 'relacionamentos' | 'desafios'
}

interface Results {
  autonomia: number
  reconhecimento: number
  crescimento: number
  seguranca: number
  proposito: number
  recompensa: number
  relacionamentos: number
  desafios: number
}

const questions: Question[] = [
  // 1. Autonomia e Liberdade de Decisão
  { id: 1, text: "Sinto-me mais motivado quando posso decidir como executar meu trabalho.", dimension: 'autonomia' },
  { id: 2, text: "Prefiro trabalhar com mínima supervisão.", dimension: 'autonomia' },
  { id: 3, text: "Desempenho melhor quando tenho liberdade para criar soluções.", dimension: 'autonomia' },
  { id: 4, text: "Gosto de organizar minha própria rotina de trabalho.", dimension: 'autonomia' },
  { id: 5, text: "Me incomoda quando controlam demais minhas atividades.", dimension: 'autonomia' },

  // 2. Reconhecimento e Validação Social
  { id: 6, text: "Preciso me sentir valorizado para dar o meu melhor.", dimension: 'reconhecimento' },
  { id: 7, text: "O reconhecimento público me impulsiona a buscar excelência.", dimension: 'reconhecimento' },
  { id: 8, text: "Um elogio sincero aumenta minha motivação.", dimension: 'reconhecimento' },
  { id: 9, text: "Gosto de ser lembrado pelas minhas contribuições.", dimension: 'reconhecimento' },
  { id: 10, text: "Me esforço mais quando percebo que meu trabalho é notado.", dimension: 'reconhecimento' },

  // 3. Crescimento e Desenvolvimento Pessoal
  { id: 11, text: "Aprender algo novo me traz grande satisfação.", dimension: 'crescimento' },
  { id: 12, text: "Sinto-me realizado ao superar desafios que exigem novos conhecimentos.", dimension: 'crescimento' },
  { id: 13, text: "Procuro por oportunidades que me ajudem a evoluir.", dimension: 'crescimento' },
  { id: 14, text: "Me frustro quando fico estagnado profissionalmente.", dimension: 'crescimento' },
  { id: 15, text: "Valorizo empresas que investem em treinamentos.", dimension: 'crescimento' },

  // 4. Segurança e Estabilidade
  { id: 16, text: "Prefiro ambientes com pouca mudança.", dimension: 'seguranca' },
  { id: 17, text: "Ter estabilidade financeira é fundamental para meu bem-estar.", dimension: 'seguranca' },
  { id: 18, text: "Me sinto inseguro quando há incertezas na empresa.", dimension: 'seguranca' },
  { id: 19, text: "Dou valor a contratos formais e garantias de longo prazo.", dimension: 'seguranca' },
  { id: 20, text: "Fico mais motivado quando sei que meu emprego está seguro.", dimension: 'seguranca' },

  // 5. Propósito e Contribuição Social
  { id: 21, text: "Sinto motivação ao saber que meu trabalho ajuda outras pessoas.", dimension: 'proposito' },
  { id: 22, text: "Quero trabalhar em algo que tenha significado real.", dimension: 'proposito' },
  { id: 23, text: "Preciso acreditar na missão da empresa para me engajar.", dimension: 'proposito' },
  { id: 24, text: "Meu trabalho tem que ter um impacto positivo no mundo.", dimension: 'proposito' },
  { id: 25, text: "Me realizo quando contribuo com algo maior que eu.", dimension: 'proposito' },

  // 6. Recompensa Financeira e Benefícios
  { id: 26, text: "O salário é um fator decisivo para minha motivação.", dimension: 'recompensa' },
  { id: 27, text: "Trabalharia mais se houvesse bônus ou premiações.", dimension: 'recompensa' },
  { id: 28, text: "Avalio constantemente se meu salário é justo.", dimension: 'recompensa' },
  { id: 29, text: "Benefícios sólidos aumentam minha fidelidade à empresa.", dimension: 'recompensa' },
  { id: 30, text: "Me dedico mais quando sinto que sou financeiramente valorizado.", dimension: 'recompensa' },

  // 7. Relacionamentos e Clima Social
  { id: 31, text: "Ter boas relações com colegas me mantém motivado.", dimension: 'relacionamentos' },
  { id: 32, text: "Me esforço mais quando há espírito de equipe.", dimension: 'relacionamentos' },
  { id: 33, text: "Um bom ambiente de trabalho é mais importante que o salário.", dimension: 'relacionamentos' },
  { id: 34, text: "Conflitos constantes reduzem minha produtividade.", dimension: 'relacionamentos' },
  { id: 35, text: "Trabalhar em equipe é uma fonte de energia para mim.", dimension: 'relacionamentos' },

  // 8. Desafios e Inovação Constante
  { id: 36, text: "Fico entediado com tarefas repetitivas.", dimension: 'desafios' },
  { id: 37, text: "Gosto de resolver problemas complexos.", dimension: 'desafios' },
  { id: 38, text: "Me motivo quando posso inovar e testar ideias.", dimension: 'desafios' },
  { id: 39, text: "Desafios constantes me mantêm engajado.", dimension: 'desafios' },
  { id: 40, text: "Adoro sair da zona de conforto no trabalho.", dimension: 'desafios' }
]

const dimensionNames = {
  autonomia: 'Autonomia e Liberdade de Decisão',
  reconhecimento: 'Reconhecimento e Validação Social',
  crescimento: 'Crescimento e Desenvolvimento Pessoal',
  seguranca: 'Segurança e Estabilidade',
  proposito: 'Propósito e Contribuição Social',
  recompensa: 'Recompensa Financeira e Benefícios',
  relacionamentos: 'Relacionamentos e Clima Social',
  desafios: 'Desafios e Inovação Constante'
}

const dimensionDescriptions = {
  autonomia: 'Necessidade de independência e controle sobre o próprio trabalho',
  reconhecimento: 'Busca por valorização e validação do trabalho realizado',
  crescimento: 'Desejo de aprendizado contínuo e desenvolvimento profissional',
  seguranca: 'Valorização de estabilidade e previsibilidade no ambiente de trabalho',
  proposito: 'Necessidade de contribuir para algo significativo e com impacto social',
  recompensa: 'Motivação por compensação financeira e benefícios tangíveis',
  relacionamentos: 'Valorização de conexões sociais e ambiente colaborativo',
  desafios: 'Busca por inovação, complexidade e superação de limites'
}

const dimensionColors = {
  autonomia: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', progress: 'bg-blue-500' },
  reconhecimento: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', progress: 'bg-yellow-500' },
  crescimento: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', progress: 'bg-green-500' },
  seguranca: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', progress: 'bg-gray-500' },
  proposito: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', progress: 'bg-purple-500' },
  recompensa: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', progress: 'bg-emerald-500' },
  relacionamentos: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', progress: 'bg-orange-500' },
  desafios: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', progress: 'bg-red-500' }
}

export default function HumaniqMotivaPage() {
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
      router.push('/colaborador/personalidade/motiva/introducao')
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
      autonomia: 0,
      reconhecimento: 0,
      crescimento: 0,
      seguranca: 0,
      proposito: 0,
      recompensa: 0,
      relacionamentos: 0,
      desafios: 0
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
      autonomia: Math.round((dimensionScores.autonomia / 25) * 100),
      reconhecimento: Math.round((dimensionScores.reconhecimento / 25) * 100),
      crescimento: Math.round((dimensionScores.crescimento / 25) * 100),
      seguranca: Math.round((dimensionScores.seguranca / 25) * 100),
      proposito: Math.round((dimensionScores.proposito / 25) * 100),
      recompensa: Math.round((dimensionScores.recompensa / 25) * 100),
      relacionamentos: Math.round((dimensionScores.relacionamentos / 25) * 100),
      desafios: Math.round((dimensionScores.desafios / 25) * 100)
    }

    return normalizedScores
  }

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
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
    } catch (error) {
      console.error('Erro ao calcular resultados:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreInterpretation = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: 'Muito Alto', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 65) return { label: 'Alto', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 50) return { label: 'Moderado', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 35) return { label: 'Baixo', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'Muito Baixo', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  // Função para identificar os top 3 motivadores e 2 menos ativos
  const getMotivationalProfile = (results: Results) => {
    const dimensions = Object.entries(results)
      .map(([key, value]) => ({ 
        dimension: key as keyof Results, 
        name: dimensionNames[key as keyof Results],
        score: value 
      }))
      .sort((a, b) => b.score - a.score);
    
    return {
      topMotivators: dimensions.slice(0, 3),
      leastActive: dimensions.slice(-2)
    };
  };

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acesso ao teste...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header dos Resultados */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Seus Resultados MOTIVA
                </h1>
                <p className="text-sm text-gray-500 mt-1">Perfil de Motivação Profissional</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Tempo: {formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>40 questões respondidas</span>
              </div>
            </div>
          </div>

          {/* Perfil Motivacional Principal */}
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-blue-600" />
                Perfil Motivacional
              </h3>
              {(() => {
                const profile = getMotivationalProfile(results);
                return (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Top 3 Principais Motivadores:
                      </h4>
                      <div className="space-y-2">
                        {profile.topMotivators.map((item, index) => (
                          <div key={item.dimension} className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                            <span className="font-medium text-gray-800">{index + 1}. {item.name}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{item.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Motivadores Menos Ativos:
                      </h4>
                      <div className="space-y-2">
                        {profile.leastActive.map((item) => (
                          <div key={item.dimension} className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">{item.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Resultados das Dimensões */}
          <div className="grid gap-6 mb-8">
            {Object.entries(results).map(([dimension, score]) => {
              const dimensionKey = dimension as keyof typeof dimensionNames
              const interpretation = getScoreInterpretation(score)
              const colors = dimensionColors[dimensionKey]
              
              return (
                <Card key={dimension} className={`border-2`} style={{ borderColor: colors.border, backgroundColor: `${colors.bg}10` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                          {dimensionNames[dimensionKey]}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {dimensionDescriptions[dimensionKey]}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: colors.text }}>
                          {score}%
                        </div>
                        <Badge className={interpretation.color}>
                          {interpretation.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%`, backgroundColor: colors.progress }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/colaborador/personalidade')}
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Testes
            </Button>
            
            <Button
              onClick={() => window.print()}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Imprimir Resultados
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Verde */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HumaniQ MOTIVA</h1>
                <p className="text-sm text-green-100">Perfil de Motivação Profissional</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Questão</p>
              <p className="text-lg font-bold">{currentQuestion + 1}/40</p>
            </div>
          </div>
          
          {/* Progress Bar Verde */}
          <div className="w-full bg-green-800 rounded-full h-2">
            <div 
              className="bg-green-300 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/colaborador/personalidade/motiva/introducao')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Question Card */}
        <Card className="mb-8 bg-white border-0 shadow-sm">
          <CardContent className="p-8">
            {/* Badge da Categoria */}
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                {dimensionNames[currentQ.dimension]}
              </Badge>
            </div>
            
            {/* Pergunta */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
                {currentQ.text}
              </h2>
            </div>
            
            {/* Escala Likert */}
            <div className="mb-6">
              <LikertScale
                hideQuestion={true}
                value={currentAnswer}
                onChange={handleAnswerChange}
                autoAdvance={true}
                onAutoAdvance={handleNext}
                autoAdvanceDelay={800}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="lg"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentAnswer ? 'Selecione uma resposta para continuar' : 'Selecione uma resposta para continuar'}
            </p>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processando...
              </div>
            ) : currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              'Próxima'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}