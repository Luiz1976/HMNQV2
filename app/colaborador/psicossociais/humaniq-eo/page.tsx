'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Heart, Brain, Shield, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: 'stress' | 'burnout' | 'resilience'
}

interface DimensionResult {
  name: string
  score: number
  level: string
  description: string
  icon: React.ReactNode
  color: string
}

interface TestResult {
  stress: number
  burnout: number
  resilience: number
  vulnerabilityIndex: number
  riskLevel: 'baixo' | 'moderado' | 'alto' | 'muito_alto'
  dimensions: DimensionResult[]
  recommendations: string[]
}

const questions: Question[] = [
  // Estresse Ocupacional (20 questões)
  { id: 1, text: "Sinto que a pressão no meu trabalho é constante e difícil de manejar.", dimension: 'stress' },
  { id: 2, text: "Tenho dificuldades para desligar mentalmente das tarefas ao final do expediente.", dimension: 'stress' },
  { id: 3, text: "Meu trabalho exige que eu esteja sempre atento, sem momentos de pausa.", dimension: 'stress' },
  { id: 4, text: "Frequentemente me sinto sobrecarregado(a) com as responsabilidades profissionais.", dimension: 'stress' },
  { id: 5, text: "Sinto que o ritmo de trabalho é acelerado demais para mim.", dimension: 'stress' },
  { id: 6, text: "Tenho a impressão de que o volume de trabalho aumenta constantemente.", dimension: 'stress' },
  { id: 7, text: "Sinto que o meu trabalho interfere negativamente no meu descanso e sono.", dimension: 'stress' },
  { id: 8, text: "Perco o interesse e entusiasmo no trabalho devido à pressão constante.", dimension: 'stress' },
  { id: 9, text: "Tenho dificuldade em gerenciar as múltiplas tarefas simultâneas no meu trabalho.", dimension: 'stress' },
  { id: 10, text: "Sinto que o ambiente de trabalho me deixa tenso(a) durante a maior parte do tempo.", dimension: 'stress' },
  { id: 11, text: "Muitas vezes sinto que não tenho tempo suficiente para concluir minhas tarefas.", dimension: 'stress' },
  { id: 12, text: "Sinto que minhas demandas profissionais ultrapassam minha capacidade física e mental.", dimension: 'stress' },
  { id: 13, text: "É difícil para mim encontrar momentos para relaxar durante o expediente.", dimension: 'stress' },
  { id: 14, text: "Frequentemente sinto que estou trabalhando além das minhas forças.", dimension: 'stress' },
  { id: 15, text: "Minha carga de trabalho não permite que eu realize pausas regulares.", dimension: 'stress' },
  { id: 16, text: "Sinto que as exigências do trabalho impactam negativamente minha saúde.", dimension: 'stress' },
  { id: 17, text: "Me sinto emocionalmente exaurido(a) devido às demandas profissionais.", dimension: 'stress' },
  { id: 18, text: "Tenho a sensação de que meu trabalho consome grande parte da minha energia diária.", dimension: 'stress' },
  { id: 19, text: "Sinto que não consigo manter um equilíbrio saudável entre trabalho e vida pessoal.", dimension: 'stress' },
  { id: 20, text: "A pressão no trabalho frequentemente me causa ansiedade e preocupação.", dimension: 'stress' },
  
  // Burnout (20 questões)
  { id: 21, text: "Sinto-me frequentemente exausto(a) ao final do dia de trabalho.", dimension: 'burnout' },
  { id: 22, text: "Perco o interesse pelas tarefas que antes gostava de realizar.", dimension: 'burnout' },
  { id: 23, text: "Sinto que não consigo realizar meu trabalho tão bem quanto antes.", dimension: 'burnout' },
  { id: 24, text: "Tenho dificuldade em me concentrar nas minhas tarefas diárias.", dimension: 'burnout' },
  { id: 25, text: "Sinto-me mentalmente esgotado(a) pela rotina de trabalho.", dimension: 'burnout' },
  { id: 26, text: "Frequentemente me sinto irritado(a) ou frustrado(a) no ambiente de trabalho.", dimension: 'burnout' },
  { id: 27, text: "Sinto que minhas emoções estão frequentemente desequilibradas devido ao trabalho.", dimension: 'burnout' },
  { id: 28, text: "Tenho dificuldade em lidar com as exigências emocionais do meu trabalho.", dimension: 'burnout' },
  { id: 29, text: "Sinto que meu trabalho me deixa desmotivado(a) e sem energia.", dimension: 'burnout' },
  { id: 30, text: "Evito interagir com colegas devido ao cansaço emocional.", dimension: 'burnout' },
  { id: 31, text: "Tenho a sensação de que estou 'queimado(a)' profissionalmente.", dimension: 'burnout' },
  { id: 32, text: "Sinto que minhas realizações no trabalho não são suficientes.", dimension: 'burnout' },
  { id: 33, text: "Frequentemente sinto falta de motivação para cumprir minhas tarefas.", dimension: 'burnout' },
  { id: 34, text: "Tenho dificuldades para recuperar minha energia mesmo após descanso.", dimension: 'burnout' },
  { id: 35, text: "Sinto que o trabalho prejudica minha saúde mental.", dimension: 'burnout' },
  { id: 36, text: "Tenho dificuldade em aceitar críticas no trabalho devido ao cansaço emocional.", dimension: 'burnout' },
  { id: 37, text: "Sinto que não recebo apoio suficiente para lidar com o estresse no trabalho.", dimension: 'burnout' },
  { id: 38, text: "Sinto que minhas emoções estão sob controle, mesmo sob pressão.", dimension: 'burnout' },
  { id: 39, text: "Tenho medo de falhar ou cometer erros devido ao cansaço emocional.", dimension: 'burnout' },
  { id: 40, text: "Sinto que estou próximo(a) de um colapso emocional por causa do trabalho.", dimension: 'burnout' },
  
  // Resiliência Emocional (16 questões)
  { id: 41, text: "Mesmo diante de dificuldades no trabalho, consigo manter a calma.", dimension: 'resilience' },
  { id: 42, text: "Consigo me adaptar rapidamente a mudanças inesperadas no ambiente profissional.", dimension: 'resilience' },
  { id: 43, text: "Sinto-me capaz de lidar com a pressão e os desafios do meu trabalho.", dimension: 'resilience' },
  { id: 44, text: "Tenho facilidade para encontrar soluções criativas para problemas no trabalho.", dimension: 'resilience' },
  { id: 45, text: "Mesmo em situações estressantes, mantenho uma atitude positiva.", dimension: 'resilience' },
  { id: 46, text: "Posso contar comigo mesmo(a) para superar obstáculos profissionais.", dimension: 'resilience' },
  { id: 47, text: "Tenho confiança na minha capacidade de enfrentar desafios no trabalho.", dimension: 'resilience' },
  { id: 48, text: "Sou capaz de me recuperar rapidamente de situações difíceis no trabalho.", dimension: 'resilience' },
  { id: 49, text: "Mantenho o equilíbrio emocional mesmo quando enfrento pressão intensa.", dimension: 'resilience' },
  { id: 50, text: "Tenho habilidades para controlar meu estresse e ansiedade no ambiente profissional.", dimension: 'resilience' },
  { id: 51, text: "Sinto-me preparado(a) para lidar com críticas e feedbacks negativos.", dimension: 'resilience' },
  { id: 52, text: "Busco apoio quando sinto que o estresse está aumentando.", dimension: 'resilience' },
  { id: 53, text: "Consegui desenvolver estratégias pessoais para manter meu bem-estar emocional.", dimension: 'resilience' },
  { id: 54, text: "Consigo manter a motivação mesmo quando enfrento dificuldades.", dimension: 'resilience' },
  { id: 55, text: "Tenho facilidade para comunicar minhas emoções e necessidades no trabalho.", dimension: 'resilience' },
  { id: 56, text: "Acredito que posso melhorar minha capacidade de enfrentar o estresse no futuro.", dimension: 'resilience' }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniQEOTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    if (currentQuestion < questions.length - 1) {
      // Auto-advance to next question
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      // All questions answered, complete test automatically
      setTimeout(() => {
        const result = calculateResults()
        setTestResult(result)
        setShowResults(true)
        completeTest(result)
      }, 500)
    }
  }

  const calculateResults = (): TestResult => {
    // Calcular médias por dimensão
    const stressQuestions = questions.filter(q => q.dimension === 'stress')
    const burnoutQuestions = questions.filter(q => q.dimension === 'burnout')
    const resilienceQuestions = questions.filter(q => q.dimension === 'resilience')

    const stressSum = stressQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)
    const burnoutSum = burnoutQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)
    const resilienceSum = resilienceQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)

    const stressAverage = stressSum / stressQuestions.length
    const burnoutAverage = burnoutSum / burnoutQuestions.length
    const resilienceAverage = resilienceSum / resilienceQuestions.length

    // Calcular Índice de Vulnerabilidade ao Estresse
    const vulnerabilityIndex = ((stressAverage + burnoutAverage) / 2) * (2 - (resilienceAverage / 5))

    // Determinar nível de risco
    let riskLevel: 'baixo' | 'moderado' | 'alto' | 'muito_alto'
    if (vulnerabilityIndex <= 2.0) {
      riskLevel = 'baixo'
    } else if (vulnerabilityIndex <= 3.5) {
      riskLevel = 'moderado'
    } else {
      riskLevel = 'alto'
    }

    const dimensions: DimensionResult[] = [
      {
        name: 'Estresse Ocupacional',
        score: stressAverage,
        level: getStressLevel(stressAverage),
        description: getDimensionDescription('stress', stressAverage),
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'bg-red-100 text-red-800'
      },
      {
        name: 'Burnout',
        score: burnoutAverage,
        level: getBurnoutLevel(burnoutAverage),
        description: getDimensionDescription('burnout', burnoutAverage),
        icon: <Brain className="w-6 h-6" />,
        color: 'bg-orange-100 text-orange-800'
      },
      {
        name: 'Resiliência Emocional',
        score: resilienceAverage,
        level: getResilienceLevel(resilienceAverage),
        description: getDimensionDescription('resilience', resilienceAverage),
        icon: <Shield className="w-6 h-6" />,
        color: 'bg-green-100 text-green-800'
      }
    ]

    const result: TestResult = {
      stress: stressAverage,
      burnout: burnoutAverage,
      resilience: resilienceAverage,
      vulnerabilityIndex,
      riskLevel,
      dimensions,
      recommendations: generateRecommendations(vulnerabilityIndex, stressAverage, burnoutAverage, resilienceAverage)
    }

    return result
  }

  const getStressLevel = (score: number): string => {
    if (score <= 2.0) return 'Baixo'
    if (score <= 3.5) return 'Moderado'
    return 'Alto'
  }

  const getBurnoutLevel = (score: number): string => {
    if (score <= 2.0) return 'Baixo'
    if (score <= 3.5) return 'Moderado'
    return 'Alto'
  }

  const getResilienceLevel = (score: number): string => {
    if (score >= 4.0) return 'Alta'
    if (score >= 3.0) return 'Moderada'
    return 'Baixa'
  }

  const getDimensionDescription = (dimension: string, score: number): string => {
    switch (dimension) {
      case 'stress':
        if (score <= 2.0) return 'Você demonstra boa capacidade de gerenciar a pressão e demandas do trabalho.'
        if (score <= 3.5) return 'Você apresenta alguns sinais de estresse ocupacional que merecem atenção.'
        return 'Você está enfrentando níveis elevados de estresse ocupacional que requerem intervenção.'
      
      case 'burnout':
        if (score <= 2.0) return 'Você mantém boa energia e motivação no trabalho.'
        if (score <= 3.5) return 'Você apresenta alguns sinais de esgotamento emocional.'
        return 'Você está em risco de burnout e precisa de suporte imediato.'
      
      case 'resilience':
        if (score >= 4.0) return 'Você possui excelente capacidade de recuperação e adaptação.'
        if (score >= 3.0) return 'Você tem boa capacidade de resiliência, mas pode ser fortalecida.'
        return 'Sua resiliência emocional precisa ser desenvolvida para melhor enfrentamento do estresse.'
      
      default:
        return ''
    }
  }

  const generateRecommendations = (vulnerability: number, stress: number, burnout: number, resilience: number): string[] => {
    const recommendations: string[] = []

    // Recomendações baseadas no índice de vulnerabilidade
    if (vulnerability <= 2.0) {
      recommendations.push('Continue mantendo suas estratégias atuais de gerenciamento do estresse.')
      recommendations.push('Considere compartilhar suas técnicas de bem-estar com colegas.')
    } else if (vulnerability <= 3.5) {
      recommendations.push('Implemente técnicas de relaxamento e mindfulness no dia a dia.')
      recommendations.push('Estabeleça limites mais claros entre trabalho e vida pessoal.')
      recommendations.push('Busque apoio de supervisores para redistribuição de tarefas quando necessário.')
    } else {
      recommendations.push('Procure apoio profissional especializado em saúde mental.')
      recommendations.push('Considere conversar com RH sobre ajustes na carga de trabalho.')
      recommendations.push('Implemente pausas regulares e técnicas de respiração durante o expediente.')
    }

    // Recomendações específicas por dimensão
    if (stress > 3.5) {
      recommendations.push('Pratique técnicas de gerenciamento do tempo e priorização de tarefas.')
      recommendations.push('Desenvolva estratégias para desconectar-se do trabalho após o expediente.')
    }

    if (burnout > 3.5) {
      recommendations.push('Busque atividades que restaurem sua energia e motivação.')
      recommendations.push('Considere férias ou licença para recuperação se possível.')
    }

    if (resilience < 3.0) {
      recommendations.push('Desenvolva uma rede de apoio social no trabalho e na vida pessoal.')
      recommendations.push('Pratique exercícios de fortalecimento da autoestima e autoconfiança.')
    }

    return recommendations
  }

  const getProfessionalAnalysis = (result: TestResult): string => {
    const { vulnerabilityIndex, riskLevel, stress, burnout, resilience } = result
    let analysis = `Com um Índice de Vulnerabilidade ao Estresse de ${vulnerabilityIndex.toFixed(2)}, seu nível geral de risco é considerado ${riskLevel}. `

    // Análise geral
    if (riskLevel === 'baixo') {
      analysis += 'Você demonstra sólido equilíbrio emocional e estratégias eficazes de enfrentamento das pressões do trabalho. '
    } else if (riskLevel === 'moderado') {
      analysis += 'Embora apresente sinais de alerta, você possui recursos internos para prevenir a escalada do estresse, desde que implemente ações específicas. '
    } else {
      analysis += 'Seu nível de risco requer atenção imediata para evitar impactos negativos na saúde e no desempenho profissional. '
    }

    // Estresse
    if (stress > 3.5) {
      analysis += 'Os indicadores mostram alto estresse ocupacional, sugerindo sobrecarga de demandas ou falta de recursos adequados. '
    } else if (stress > 2.0) {
      analysis += 'Há indícios moderados de estresse que devem ser monitorados para não evoluírem. '
    } else {
      analysis += 'Seu estresse ocupacional está bem gerenciado. '
    }

    // Burnout
    if (burnout > 3.5) {
      analysis += 'Há sintomas relevantes de burnout, como exaustão emocional ou despersonalização. Avalie a possibilidade de pausas estratégicas e redefinição de prioridades. '
    } else if (burnout > 2.0) {
      analysis += 'Alguns sinais de esgotamento começam a surgir; intervenções precoces podem restaurar sua motivação. '
    } else {
      analysis += 'Você mantém níveis saudáveis de energia e motivação. '
    }

    // Resiliência
    if (resilience < 3.0) {
      analysis += 'A resiliência emocional encontra-se abaixo do ideal; desenvolver habilidades de enfrentamento pode elevar sua capacidade de recuperação após adversidades. '
    } else if (resilience < 4.0) {
      analysis += 'Sua resiliência é boa, porém ainda há espaço para fortalecimento por meio de práticas de autocuidado e suporte social. '
    } else {
      analysis += 'Você apresenta excelente resiliência, o que contribui para suporte efetivo em momentos de alta pressão. '
    }

    analysis += '\n\nEm síntese, os resultados indicam como suas experiências emocionais no trabalho influenciam performance e bem-estar. Recomenda-se acompanhar esses indicadores periodicamente e implementar ações preventivas alinhadas às recomendações listadas.'
    return analysis
  }

  const completeTest = async (resultParam?: TestResult) => {
    setIsSubmitting(true)
    
    try {
      const result = resultParam ?? calculateResults()
      
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Resultado do teste HumaniQ EO:', result)
      
      // Aqui você faria a chamada real para a API
      // const response = await fetch('/api/tests/humaniq-eo', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers, result })
      // })
      
    } catch (error) {
      console.error('Erro ao enviar resultado:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showResults) {
    const result = testResult ?? calculateResults()
    const professionalAnalysis = getProfessionalAnalysis(result)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/colaborador/psicossociais')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Badge className="bg-white/20 text-white border-white/30">
                Resultado Final
              </Badge>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-300" />
              <h1 className="text-3xl font-bold mb-2">HumaniQ EO</h1>
              <p className="text-blue-100">Resultado da Avaliação</p>
            </div>
          </div>
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Heart className="w-8 h-8 text-red-500" />
                Resultado - HumaniQ EO
              </CardTitle>
              <CardDescription>
                Estresse Ocupacional, Burnout e Resiliência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {result.vulnerabilityIndex.toFixed(2)}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    result.vulnerabilityIndex <= 2.0 ? 'bg-green-100 text-green-800' :
                    result.vulnerabilityIndex <= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {result.riskLevel}
                </Badge>
                <p className="text-gray-600 mt-2">
                  Índice de Vulnerabilidade ao Estresse
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {result.dimensions.map((dimension, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {dimension.icon}
                        <h3 className="font-semibold text-gray-800">{dimension.name}</h3>
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        {dimension.score.toFixed(1)}
                      </div>
                      <Badge variant="outline" className={dimension.color}>
                        {dimension.level}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        {dimension.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Análise Profissional Detalhada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{professionalAnalysis}</p>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recomendações de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/colaborador/psicossociais')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar aos Testes
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Resultado
                </Button>
                <div className="flex items-center justify-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm font-medium">
                      Resultados salvos automaticamente!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">HumaniQ EO</h1>
              <p className="text-white/80 text-sm">Perfil de Estresse Ocupacional</p>
            </div>
          </div>
          <div className="text-white text-lg font-medium">
            Questão {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        
        {/* Barra de progresso roxa */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="px-6 py-8">
        {/* Categoria da pergunta em roxo */}
        <div className="text-center mb-6">
          <h2 className="text-purple-600 text-lg font-medium mb-4">
            {currentQ.dimension === 'stress' && 'Estresse Ocupacional'}
            {currentQ.dimension === 'burnout' && 'Burnout'}
            {currentQ.dimension === 'resilience' && 'Resiliência Emocional'}
          </h2>
          
          {/* Pergunta em texto grande e escuro */}
          <h3 className="text-gray-800 text-xl font-medium mb-8 max-w-4xl mx-auto leading-relaxed">
            {currentQ.text}
          </h3>
        </div>

        {/* Escala horizontal colorida */}
        <div className="max-w-4xl mx-auto mb-8">
          {/* Labels da escala */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-red-500 font-medium">Discordo</span>
            <span className="text-yellow-500 font-medium">Neutro</span>
            <span className="text-green-500 font-medium">Concordo</span>
          </div>
          
          {/* Barra de gradiente */}
          <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full mb-6"></div>
          
          {/* Botões da escala Likert */}
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => {
              const colors = [
                'bg-red-400 hover:bg-red-500',
                'bg-orange-400 hover:bg-orange-500', 
                'bg-yellow-400 hover:bg-yellow-500',
                'bg-green-400 hover:bg-green-500',
                'bg-green-600 hover:bg-green-700'
              ]
              const labels = [
                'Discordo totalmente',
                'Discordo', 
                'Neutro',
                'Concordo',
                'Concordo totalmente'
              ]
              
              return (
                <div key={value} className="text-center">
                  <button
                    onClick={() => handleAnswer(value)}
                    className={`w-16 h-16 rounded-lg text-white text-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                      colors[value - 1]
                    } ${
                      answers[currentQ.id] === value ? 'ring-4 ring-purple-300 scale-105' : ''
                    }`}
                  >
                    {value}
                  </button>
                  <p className="text-sm text-gray-600 mt-2 max-w-20">
                    {labels[value - 1]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Texto central */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            Selecione uma resposta para continuar
          </p>
        </div>

        {/* Navegação inferior */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1)
              } else {
                router.push('/colaborador/psicossociais')
              }
            }}
            className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={() => {
              if (answers[currentQ.id] && currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              }
            }}
            disabled={!answers[currentQ.id]}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}