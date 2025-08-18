'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LikertScale } from '@/components/ui/likert-scale'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Target, Heart, Zap, Award, Brain, Printer } from 'lucide-react'

interface Question {
  id: number
  text: string
  dimension: string
}

interface DimensionResult {
  name: string
  score: number
  percentage: number
  risk: 'low' | 'moderate' | 'high'
  color: string
  icon: any
}

interface TestResult {
  dimensions: DimensionResult[]
  generalRisk: number
  generalRiskLevel: 'low' | 'moderate' | 'high'
  overcommitment: number
  overcommitmentLevel: 'low' | 'moderate' | 'high'
  analysis: string
  recommendations: string[]
}

export default function HumaniqKarasekSiegristPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [results, setResults] = useState<TestResult | null>(null)

  const questions: Question[] = [
    // A. Demanda Psicológica (10 perguntas) – Modelo Karasek
    { id: 1, text: "Tenho prazos curtos e frequentes.", dimension: "Demanda Psicológica" },
    { id: 2, text: "Sinto pressão constante para aumentar minha produtividade.", dimension: "Demanda Psicológica" },
    { id: 3, text: "Preciso realizar várias tarefas ao mesmo tempo.", dimension: "Demanda Psicológica" },
    { id: 4, text: "Meu trabalho exige esforço mental intenso.", dimension: "Demanda Psicológica" },
    { id: 5, text: "Costumo levar trabalho para casa ou pensar nele fora do expediente.", dimension: "Demanda Psicológica" },
    { id: 6, text: "As tarefas mudam rapidamente e sem aviso.", dimension: "Demanda Psicológica" },
    { id: 7, text: "Tenho muitas tarefas simultâneas que competem entre si.", dimension: "Demanda Psicológica" },
    { id: 8, text: "A complexidade das atividades me deixa mentalmente exausto(a).", dimension: "Demanda Psicológica" },
    { id: 9, text: "Sinto que não tenho tempo suficiente para cumprir minhas obrigações.", dimension: "Demanda Psicológica" },
    { id: 10, text: "Minhas tarefas são emocionalmente exigentes.", dimension: "Demanda Psicológica" },

    // B. Controle e Autonomia (10 perguntas) – Modelo Karasek
    { id: 11, text: "Tenho liberdade para decidir como executar meu trabalho.", dimension: "Controle e Autonomia" },
    { id: 12, text: "Posso organizar minhas tarefas conforme minha preferência.", dimension: "Controle e Autonomia" },
    { id: 13, text: "Participo das decisões que afetam meu trabalho.", dimension: "Controle e Autonomia" },
    { id: 14, text: "Tenho autonomia para resolver problemas.", dimension: "Controle e Autonomia" },
    { id: 15, text: "Posso fazer pausas ou ajustes quando necessário.", dimension: "Controle e Autonomia" },
    { id: 16, text: "Sinto que meu conhecimento é valorizado nas decisões.", dimension: "Controle e Autonomia" },
    { id: 17, text: "Tenho espaço para propor melhorias ou mudanças.", dimension: "Controle e Autonomia" },
    { id: 18, text: "Recebo treinamentos para aprimorar minhas habilidades.", dimension: "Controle e Autonomia" },
    { id: 19, text: "Meu trabalho permite desenvolvimento profissional.", dimension: "Controle e Autonomia" },
    { id: 20, text: "Tenho clareza sobre o que é esperado de mim.", dimension: "Controle e Autonomia" },

    // C. Apoio Social (10 perguntas) – Modelo Karasek – Extensão Johnson & Theorell
    { id: 21, text: "Meus colegas me apoiam quando preciso.", dimension: "Apoio Social" },
    { id: 22, text: "Minha liderança me orienta e dá suporte técnico.", dimension: "Apoio Social" },
    { id: 23, text: "Me sinto parte da equipe.", dimension: "Apoio Social" },
    { id: 24, text: "O clima no ambiente de trabalho é positivo.", dimension: "Apoio Social" },
    { id: 25, text: "Posso conversar abertamente com meus colegas.", dimension: "Apoio Social" },
    { id: 26, text: "Posso buscar ajuda da liderança sem medo.", dimension: "Apoio Social" },
    { id: 27, text: "Me sinto respeitado(a) no ambiente de trabalho.", dimension: "Apoio Social" },
    { id: 28, text: "Recebo reconhecimento pelo que faço bem.", dimension: "Apoio Social" },
    { id: 29, text: "A empresa promove cooperação entre setores.", dimension: "Apoio Social" },
    { id: 30, text: "Há canais claros para resolver conflitos ou problemas.", dimension: "Apoio Social" },

    // D. Esforço Exigido (10 perguntas) – Modelo Siegrist
    { id: 31, text: "Tenho que me esforçar ao máximo todos os dias.", dimension: "Esforço Exigido" },
    { id: 32, text: "Costumo fazer horas extras sem reconhecimento.", dimension: "Esforço Exigido" },
    { id: 33, text: "Me cobro demais por bons resultados.", dimension: "Esforço Exigido" },
    { id: 34, text: "Faço muito mais do que me foi atribuído.", dimension: "Esforço Exigido" },
    { id: 35, text: "Aceito demandas urgentes mesmo fora do horário.", dimension: "Esforço Exigido" },
    { id: 36, text: "O ritmo do trabalho é desgastante.", dimension: "Esforço Exigido" },
    { id: 37, text: "Estou sempre preocupado(a) com desempenho.", dimension: "Esforço Exigido" },
    { id: 38, text: "Sinto que estou sob constante avaliação.", dimension: "Esforço Exigido" },
    { id: 39, text: "Tenho dificuldade em equilibrar trabalho e vida pessoal.", dimension: "Esforço Exigido" },
    { id: 40, text: "Faço sacrifícios pessoais para atender às exigências do trabalho.", dimension: "Esforço Exigido" },

    // E. Recompensas Recebidas (10 perguntas) – Modelo Siegrist
    { id: 41, text: "Sinto que sou bem pago pelo meu trabalho.", dimension: "Recompensas Recebidas" },
    { id: 42, text: "Recebo reconhecimento quando atinjo metas.", dimension: "Recompensas Recebidas" },
    { id: 43, text: "Tenho estabilidade no emprego.", dimension: "Recompensas Recebidas" },
    { id: 44, text: "Tenho perspectivas reais de crescimento.", dimension: "Recompensas Recebidas" },
    { id: 45, text: "Me sinto valorizado(a) pela liderança.", dimension: "Recompensas Recebidas" },
    { id: 46, text: "As promoções são baseadas em mérito.", dimension: "Recompensas Recebidas" },
    { id: 47, text: "Tenho acesso a benefícios compatíveis com meu esforço.", dimension: "Recompensas Recebidas" },
    { id: 48, text: "Me sinto respeitado(a) independentemente da minha função.", dimension: "Recompensas Recebidas" },
    { id: 49, text: "Sinto que sou tratado(a) de forma justa.", dimension: "Recompensas Recebidas" },
    { id: 50, text: "Meus resultados são levados em consideração pela empresa.", dimension: "Recompensas Recebidas" },

    // F. Hipercomprometimento (10 perguntas) – Modelo Siegrist (traço de risco pessoal)
    { id: 51, text: "Me sinto culpado(a) quando não trabalho o suficiente.", dimension: "Hipercomprometimento" },
    { id: 52, text: "Mesmo cansado(a) ou doente, insisto em manter o desempenho.", dimension: "Hipercomprometimento" },
    { id: 53, text: "Não consigo recusar tarefas, mesmo já sobrecarregado(a).", dimension: "Hipercomprometimento" },
    { id: 54, text: "Trabalho é minha principal fonte de identidade.", dimension: "Hipercomprometimento" },
    { id: 55, text: "Não consigo relaxar fora do expediente.", dimension: "Hipercomprometimento" },
    { id: 56, text: "Me cobro além do razoável.", dimension: "Hipercomprometimento" },
    { id: 57, text: "Fico ansioso(a) quando não estou produzindo.", dimension: "Hipercomprometimento" },
    { id: 58, text: "Coloco as demandas profissionais acima da minha saúde.", dimension: "Hipercomprometimento" },
    { id: 59, text: "Tenho dificuldade de delegar tarefas.", dimension: "Hipercomprometimento" },
    { id: 60, text: "Me sinto angustiado(a) quando deixo algo pendente.", dimension: "Hipercomprometimento" }
  ]



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

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
    
    // Avanço automático após 500ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        calculateResults()
      }
    }, 500)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeTest = () => {
    calculateResults()
  }

  const calculateResults = () => {
    const dimensionGroups = {
      'Demanda Psicológica': questions.slice(0, 10),
      'Controle e Autonomia': questions.slice(10, 20),
      'Apoio Social': questions.slice(20, 30),
      'Esforço Exigido': questions.slice(30, 40),
      'Recompensas Recebidas': questions.slice(40, 50),
      'Hipercomprometimento': questions.slice(50, 60)
    }

    const dimensionIcons = {
      'Demanda Psicológica': TrendingUp,
      'Controle e Autonomia': Target,
      'Apoio Social': Users,
      'Esforço Exigido': Zap,
      'Recompensas Recebidas': Award,
      'Hipercomprometimento': Brain
    }

    const dimensionResults: DimensionResult[] = Object.entries(dimensionGroups).map(([dimension, dimQuestions]) => {
      let totalScore = 0
      dimQuestions.forEach(q => {
        const answer = answers[q.id] || 1
        // Para dimensões positivas (Controle, Apoio, Recompensas), inverter a pontuação
        if (dimension === 'Controle e Autonomia' || dimension === 'Apoio Social' || dimension === 'Recompensas Recebidas') {
          totalScore += (6 - answer) // Inverte a escala
        } else {
          totalScore += answer
        }
      })
      
      const percentage = (totalScore / 50) * 100
      let risk: 'low' | 'moderate' | 'high'
      let color: string
      
      if (percentage <= 39) {
        risk = 'low'
        color = 'text-green-600'
      } else if (percentage <= 69) {
        risk = 'moderate'
        color = 'text-yellow-600'
      } else {
        risk = 'high'
        color = 'text-red-600'
      }

      return {
        name: dimension,
        score: totalScore,
        percentage: Math.round(percentage),
        risk,
        color,
        icon: dimensionIcons[dimension as keyof typeof dimensionIcons]
      }
    })

    // Calcular risco geral (média dos 5 primeiros, excluindo hipercomprometimento)
    const generalDimensions = dimensionResults.slice(0, 5)
    const generalRisk = Math.round(generalDimensions.reduce((sum, dim) => sum + dim.percentage, 0) / 5)
    
    let generalRiskLevel: 'low' | 'moderate' | 'high'
    if (generalRisk <= 39) generalRiskLevel = 'low'
    else if (generalRisk <= 69) generalRiskLevel = 'moderate'
    else generalRiskLevel = 'high'

    // Hipercomprometimento separado
    const overcommitment = dimensionResults[5].percentage
    let overcommitmentLevel: 'low' | 'moderate' | 'high'
    if (overcommitment <= 39) overcommitmentLevel = 'low'
    else if (overcommitment <= 69) overcommitmentLevel = 'moderate'
    else overcommitmentLevel = 'high'

    // Análise e recomendações
    let analysis = ""
    let recommendations: string[] = []

    if (generalRiskLevel === 'high') {
      analysis = "Risco psicossocial elevado detectado. Há sinais claros de desgaste ocupacional e vulnerabilidade a burnout."
      recommendations.push("Intervenção urgente necessária")
      recommendations.push("Redistribuição de carga de trabalho")
      recommendations.push("Implementação de programas de bem-estar")
    } else if (generalRiskLevel === 'moderate') {
      analysis = "Risco psicossocial moderado. Algumas áreas requerem atenção para prevenir agravamento."
      recommendations.push("Monitoramento regular das condições de trabalho")
      recommendations.push("Fortalecimento do apoio social")
    } else {
      analysis = "Risco psicossocial baixo. Condições de trabalho adequadas."
      recommendations.push("Manutenção das boas práticas atuais")
    }

    if (overcommitmentLevel === 'high') {
      recommendations.push("Trabalhar autoconhecimento e limites pessoais")
      recommendations.push("Desenvolver estratégias de enfrentamento")
    }

    const testResult: TestResult = {
      dimensions: dimensionResults,
      generalRisk,
      generalRiskLevel,
      overcommitment,
      overcommitmentLevel,
      analysis,
      recommendations
    }

    setResults(testResult)
    setShowResults(true)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const currentAnswer = answers[questions[currentQuestion]?.id]

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados - HumaniQ Karasek-Siegrist
              </h1>
              <p className="text-gray-600">
                Teste Psicossocial Avançado - Análise Completa
              </p>
            </div>
          </div>

          {/* Resumo Geral */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Resumo Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Risco Psicossocial Geral</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">{results.generalRisk}%</span>
                    <Badge className={`${
                      results.generalRiskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      results.generalRiskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.generalRiskLevel === 'low' ? '🟢 BAIXO' :
                       results.generalRiskLevel === 'moderate' ? '🟡 MODERADO' :
                       '🔴 CRÍTICO'}
                    </Badge>
                  </div>
                  <Progress value={results.generalRisk} className="h-2" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Hipercomprometimento</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">{results.overcommitment}%</span>
                    <Badge className={`${
                      results.overcommitmentLevel === 'low' ? 'bg-green-100 text-green-800' :
                      results.overcommitmentLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.overcommitmentLevel === 'low' ? '🟢 BAIXO' :
                       results.overcommitmentLevel === 'moderate' ? '🟡 MODERADO' :
                       '🔴 CRÍTICO'}
                    </Badge>
                  </div>
                  <Progress value={results.overcommitment} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados por Dimensão */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Análise por Dimensão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.dimensions.map((dimension, index) => {
                  const Icon = dimension.icon
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${dimension.color}`} />
                          <h3 className="font-semibold">{dimension.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{dimension.percentage}%</span>
                          <Badge className={`${
                            dimension.risk === 'low' ? 'bg-green-100 text-green-800' :
                            dimension.risk === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dimension.risk === 'low' ? '🟢' :
                             dimension.risk === 'moderate' ? '🟡' : '🔴'}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={dimension.percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Análise e Recomendações */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Análise e Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Análise</h4>
                  <p className="text-blue-700">{results.analysis}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Recomendações</h4>
                  <ul className="text-green-700 space-y-1">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Teste */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações do Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Tempo: {formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Questões: {questions.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Dimensões: 6</span>
                </div>
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
              onClick={() => window.print()}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir Resultados
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul idêntico à imagem */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo circular branco no canto esquerdo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ KARASEK-SIEGRIST</h1>
                <p className="text-purple-100 text-sm">Teste de Estresse Ocupacional</p>
              </div>
            </div>
            
            {/* Contador de questões no canto direito */}
            <div className="text-right">
              <div className="text-sm text-purple-100">Questão</div>
              <div className="text-xl font-bold">{currentQuestion + 1}/60</div>
            </div>
          </div>
          
          {/* Barra de progresso branca na parte inferior */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal com fundo branco/cinza claro */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Categoria da pergunta em roxo */}
        <div className="text-center mb-8">
          <div className="text-purple-600 font-semibold text-lg mb-4">
            {questions[currentQuestion]?.dimension}
          </div>
          
          {/* Pergunta em texto grande e escuro */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-12 leading-relaxed max-w-3xl mx-auto">
            {questions[currentQuestion]?.text}
          </h2>
        </div>

        {/* Escala colorida horizontal */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <span>Discordo</span>
            <span>Neutro</span>
            <span>Concordo</span>
          </div>
          
          {/* 5 botões quadrados grandes com cantos arredondados */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((value) => {
              const colors: { [key: number]: string } = {
                1: 'bg-red-300 hover:bg-red-400 border-red-400',
                2: 'bg-orange-300 hover:bg-orange-400 border-orange-400', 
                3: 'bg-yellow-300 hover:bg-yellow-400 border-yellow-400',
                4: 'bg-green-300 hover:bg-green-400 border-green-400',
                5: 'bg-green-500 hover:bg-green-600 border-green-600'
              }
              
              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-16 h-16 rounded-xl border-2 transition-all duration-200 font-bold text-white text-xl ${
                    currentAnswer === value 
                      ? `${colors[value]} scale-110 shadow-lg` 
                      : `${colors[value]} hover:scale-105`
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
          
          {/* Labels abaixo de cada botão */}
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <div className="w-16 text-center">Discordo totalmente</div>
            <div className="w-16 text-center">Discordo</div>
            <div className="w-16 text-center">Neutro</div>
            <div className="w-16 text-center">Concordo</div>
            <div className="w-16 text-center">Concordo totalmente</div>
          </div>
        </div>

        {/* Navegação inferior */}
        <div className="flex items-center justify-between mt-12">
          {/* Botão Anterior à esquerda */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Anterior
          </button>
          
          {/* Texto central */}
          <div className="text-gray-600 text-sm">
            {currentAnswer ? 'Avançando automaticamente...' : 'Selecione uma resposta'}
          </div>
          
          {/* Espaço vazio à direita para manter o layout balanceado */}
          <div className="w-24"></div>
        </div>
      </div>
    </div>
  )
}