'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle, Target, Zap } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: string
}

interface TestResult {
  dimensionResults: {
    [key: string]: {
      score: number
      percentage: number
      level: string
      color: string
    }
  }
  topMotivators: string[]
  weakMotivators: string[]
  motivationalProfile: string
}

const questions: Question[] = [
  // 1. Autonomia e Liberdade de Decisão
  { id: 1, text: "Sinto-me mais motivado quando posso decidir como executar meu trabalho.", dimension: "Autonomia e Liberdade" },
  { id: 2, text: "Prefiro trabalhar com mínima supervisão.", dimension: "Autonomia e Liberdade" },
  { id: 3, text: "Desempenho melhor quando tenho liberdade para criar soluções.", dimension: "Autonomia e Liberdade" },
  { id: 4, text: "Gosto de organizar minha própria rotina de trabalho.", dimension: "Autonomia e Liberdade" },
  { id: 5, text: "Me incomoda quando controlam demais minhas atividades.", dimension: "Autonomia e Liberdade" },

  // 2. Reconhecimento e Validação Social
  { id: 6, text: "Preciso me sentir valorizado para dar o meu melhor.", dimension: "Reconhecimento e Validação" },
  { id: 7, text: "O reconhecimento público me impulsiona a buscar excelência.", dimension: "Reconhecimento e Validação" },
  { id: 8, text: "Um elogio sincero aumenta minha motivação.", dimension: "Reconhecimento e Validação" },
  { id: 9, text: "Gosto de ser lembrado pelas minhas contribuições.", dimension: "Reconhecimento e Validação" },
  { id: 10, text: "Me esforço mais quando percebo que meu trabalho é notado.", dimension: "Reconhecimento e Validação" },

  // 3. Crescimento e Desenvolvimento Pessoal
  { id: 11, text: "Aprender algo novo me traz grande satisfação.", dimension: "Crescimento e Desenvolvimento" },
  { id: 12, text: "Sinto-me realizado ao superar desafios que exigem novos conhecimentos.", dimension: "Crescimento e Desenvolvimento" },
  { id: 13, text: "Procuro por oportunidades que me ajudem a evoluir.", dimension: "Crescimento e Desenvolvimento" },
  { id: 14, text: "Me frustro quando fico estagnado profissionalmente.", dimension: "Crescimento e Desenvolvimento" },
  { id: 15, text: "Valorizo empresas que investem em treinamentos.", dimension: "Crescimento e Desenvolvimento" },

  // 4. Segurança e Estabilidade
  { id: 16, text: "Prefiro ambientes com pouca mudança.", dimension: "Segurança e Estabilidade" },
  { id: 17, text: "Ter estabilidade financeira é fundamental para meu bem-estar.", dimension: "Segurança e Estabilidade" },
  { id: 18, text: "Me sinto inseguro quando há incertezas na empresa.", dimension: "Segurança e Estabilidade" },
  { id: 19, text: "Dou valor a contratos formais e garantias de longo prazo.", dimension: "Segurança e Estabilidade" },
  { id: 20, text: "Fico mais motivado quando sei que meu emprego está seguro.", dimension: "Segurança e Estabilidade" },

  // 5. Propósito e Contribuição Social
  { id: 21, text: "Sinto motivação ao saber que meu trabalho ajuda outras pessoas.", dimension: "Propósito e Contribuição" },
  { id: 22, text: "Quero trabalhar em algo que tenha significado real.", dimension: "Propósito e Contribuição" },
  { id: 23, text: "Preciso acreditar na missão da empresa para me engajar.", dimension: "Propósito e Contribuição" },
  { id: 24, text: "Meu trabalho tem que ter um impacto positivo no mundo.", dimension: "Propósito e Contribuição" },
  { id: 25, text: "Me realizo quando contribuo com algo maior que eu.", dimension: "Propósito e Contribuição" },

  // 6. Recompensa Financeira e Benefícios
  { id: 26, text: "O salário é um fator decisivo para minha motivação.", dimension: "Recompensa Financeira" },
  { id: 27, text: "Trabalharia mais se houvesse bônus ou premiações.", dimension: "Recompensa Financeira" },
  { id: 28, text: "Avalio constantemente se meu salário é justo.", dimension: "Recompensa Financeira" },
  { id: 29, text: "Benefícios sólidos aumentam minha fidelidade à empresa.", dimension: "Recompensa Financeira" },
  { id: 30, text: "Me dedico mais quando sinto que sou financeiramente valorizado.", dimension: "Recompensa Financeira" },

  // 7. Relacionamentos e Clima Social
  { id: 31, text: "Ter boas relações com colegas me mantém motivado.", dimension: "Relacionamentos e Clima" },
  { id: 32, text: "Me esforço mais quando há espírito de equipe.", dimension: "Relacionamentos e Clima" },
  { id: 33, text: "Um bom ambiente de trabalho é mais importante que o salário.", dimension: "Relacionamentos e Clima" },
  { id: 34, text: "Conflitos constantes reduzem minha produtividade.", dimension: "Relacionamentos e Clima" },
  { id: 35, text: "Trabalhar em equipe é uma fonte de energia para mim.", dimension: "Relacionamentos e Clima" },

  // 8. Desafios e Inovação Constante
  { id: 36, text: "Fico entediado com tarefas repetitivas.", dimension: "Desafios e Inovação" },
  { id: 37, text: "Gosto de resolver problemas complexos.", dimension: "Desafios e Inovação" },
  { id: 38, text: "Me motivo quando posso inovar e testar ideias.", dimension: "Desafios e Inovação" },
  { id: 39, text: "Desafios constantes me mantêm engajado.", dimension: "Desafios e Inovação" },
  { id: 40, text: "Adoro sair da zona de conforto no trabalho.", dimension: "Desafios e Inovação" }
]

// Removido responseOptions - agora usando LikertScale component

const motivationalProfiles = {
  "Autonomia + Desafios + Inovação": "Profissional empreendedor, ideal para projetos e inovação.",
  "Segurança + Relacionamentos + Reconhecimento": "Estável, busca pertencer e ser valorizado, ideal para áreas de suporte.",
  "Crescimento + Propósito + Autonomia": "Alta performance com foco em evolução e impacto social.",
  "Recompensa + Reconhecimento + Segurança": "Perfil orientado a metas e recompensas, ideal para vendas.",
  "Propósito + Crescimento + Relacionamentos": "Orientado ao desenvolvimento humano e social.",
  "Desafios + Autonomia + Crescimento": "Inovador e autodidata, busca constante evolução.",
  "Reconhecimento + Recompensa + Relacionamentos": "Motivado por valorização social e financeira.",
  "Segurança + Propósito + Relacionamentos": "Busca estabilidade com significado e conexão humana."
}

export default function HumaniQMotivaPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<TestResult | null>(null)
  const [showTransition, setShowTransition] = useState(false)

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const completeTest = async (finalAnswers: { [key: number]: number }) => {
    // Calcular resultados por dimensão
    const dimensionResults: { [key: string]: { score: number; percentage: number; level: string; color: string } } = {}
    
    const dimensions = [
      'Autonomia e Liberdade',
      'Reconhecimento e Validação',
      'Crescimento e Desenvolvimento',
      'Segurança e Estabilidade',
      'Propósito e Contribuição',
      'Recompensa Financeira',
      'Relacionamentos e Clima',
      'Desafios e Inovação'
    ]

    const dimensionScores: { [key: string]: number } = {}

    dimensions.forEach(dimension => {
      const dimensionQuestions = questions.filter(q => q.dimension === dimension)
      let sum = 0
      
      dimensionQuestions.forEach(q => {
        sum += finalAnswers[q.id] || 1
      })
      
      const score = sum
      const percentage = (score / 25) * 100
      let level = ''
      let color = ''
      
      if (percentage >= 80) {
        level = 'Muito Alto'
        color = 'text-green-600'
      } else if (percentage >= 65) {
        level = 'Alto'
        color = 'text-blue-600'
      } else if (percentage >= 50) {
        level = 'Moderado'
        color = 'text-yellow-600'
      } else if (percentage >= 35) {
        level = 'Baixo'
        color = 'text-orange-600'
      } else {
        level = 'Muito Baixo'
        color = 'text-red-600'
      }
      
      dimensionResults[dimension] = { score, percentage, level, color }
      dimensionScores[dimension] = percentage
    })

    // Identificar top 3 motivadores e 2 mais fracos
    const sortedDimensions = Object.entries(dimensionScores)
      .sort(([,a], [,b]) => b - a)
    
    const topMotivators = sortedDimensions.slice(0, 3).map(([dim]) => dim)
    const weakMotivators = sortedDimensions.slice(-2).map(([dim]) => dim)

    // Determinar perfil motivacional
    const topThree = topMotivators.join(' + ').replace(/e /g, '').replace(/ e/g, '')
    let motivationalProfile = 'Perfil Personalizado'
    
    // Buscar perfil correspondente
    for (const [profile, description] of Object.entries(motivationalProfiles)) {
      const profileWords = profile.toLowerCase().split(' + ')
      const topWords = topThree.toLowerCase()
      
      if (profileWords.every(word => topWords.includes(word.split(' ')[0]))) {
        motivationalProfile = `${profile}: ${description}`
        break
      }
    }

    const testResults: TestResult = {
      dimensionResults,
      topMotivators,
      weakMotivators,
      motivationalProfile
    }

    setResults(testResults)
    setIsCompleted(true)

    // Submeter resultados para API
    try {
      await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'HUMANIQ_MOTIVA',
          answers: finalAnswers,
          results: testResults
        })
      })
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const goToNext = () => {
    if (currentQuestion < questions.length - 1 && answers[questions[currentQuestion].id]) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]
  const currentAnswer = answers[currentQ?.id]

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-12 w-12 mr-3" />
                <div>
                  <CardTitle className="text-2xl font-bold">HumaniQ MOTIVA</CardTitle>
                  <CardDescription className="text-purple-100">
                    Perfil de Motivação Profissional - Resultados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Seu Perfil Motivacional</h3>
                <Alert className="mb-6 border-purple-200 bg-purple-50">
                  <Target className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>{results.motivationalProfile}</strong>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-green-700 mb-4">🎯 Principais Motivadores</h4>
                  <div className="space-y-3">
                    {results.topMotivators.map((motivator, index) => (
                      <div key={motivator} className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-green-800">{motivator}</div>
                          <div className="text-sm text-green-600">
                            {results.dimensionResults[motivator].percentage.toFixed(0)}% - {results.dimensionResults[motivator].level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-orange-700 mb-4">📉 Motivadores Menos Ativos</h4>
                  <div className="space-y-3">
                    {results.weakMotivators.map((motivator, index) => (
                      <div key={motivator} className="flex items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-orange-800">{motivator}</div>
                          <div className="text-sm text-orange-600">
                            {results.dimensionResults[motivator].percentage.toFixed(0)}% - {results.dimensionResults[motivator].level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">📊 Detalhamento por Dimensão</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(results.dimensionResults).map(([dimension, result]) => (
                    <Card key={dimension} className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{dimension}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className={`text-2xl font-bold ${result.color}`}>
                              {result.percentage.toFixed(0)}%
                            </div>
                            <div className={`text-sm font-medium ${result.color}`}>
                              {result.level}
                            </div>
                          </div>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.color.includes('green') ? 'bg-green-100' : result.color.includes('blue') ? 'bg-blue-100' : result.color.includes('yellow') ? 'bg-yellow-100' : result.color.includes('orange') ? 'bg-orange-100' : 'bg-red-100'}`}>
                            <Target className="h-8 w-8" />
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${result.color.includes('green') ? 'bg-green-500' : result.color.includes('blue') ? 'bg-blue-500' : result.color.includes('yellow') ? 'bg-yellow-500' : result.color.includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  onClick={() => router.push('/colaborador/psicossociais')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  Voltar aos Testes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className={`shadow-xl border-0 transition-all duration-300 ${showTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-8 w-8 mr-3" />
                <div>
                  <CardTitle className="text-xl font-bold">HumaniQ MOTIVA</CardTitle>
                  <CardDescription className="text-purple-100">
                    Perfil de Motivação Profissional
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-100">Questão</div>
                <div className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2 bg-purple-200" />
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="text-sm text-purple-600 font-medium mb-2">
                {currentQ?.dimension}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {currentQ?.text}
              </h2>
            </div>

            <div className="mb-8">
              <LikertScale
                value={currentAnswer}
                onChange={handleAnswer}
                hideQuestion={true}
            autoAdvance={true}
            onAutoAdvance={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                completeTest(answers)
              }
            }}
            autoAdvanceDelay={600}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <div className="text-sm text-gray-500">
                {currentAnswer ? 'Continuando automaticamente...' : 'Selecione uma resposta para continuar'}
              </div>
              
              <Button
                onClick={goToNext}
                disabled={!currentAnswer || currentQuestion === questions.length - 1}
                className="flex items-center bg-purple-600 hover:bg-purple-700"
              >
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}