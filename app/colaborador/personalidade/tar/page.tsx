'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Clock, User } from 'lucide-react'

const questions = [
  { id: 1, text: "Consigo manter o foco em tarefas por longos períodos.", factor: "atencao_sustentada", facet: "concentracao", reverse: false },
  { id: 2, text: "Me distraio facilmente com ruídos ao redor.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 3, text: "Tenho dificuldade para prestar atenção em detalhes.", factor: "atencao_sustentada", facet: "detalhamento", reverse: true },
  { id: 4, text: "Posso trabalhar em uma tarefa sem me cansar mentalmente.", factor: "atencao_sustentada", facet: "resistencia", reverse: false },
  { id: 5, text: "Minha mente vaga frequentemente durante conversas.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 6, text: "Consigo ignorar distrações quando necessário.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 7, text: "Perco o interesse rapidamente em atividades monótonas.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 8, text: "Sou capaz de notar pequenos erros em textos.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 9, text: "Tenho dificuldade para manter atenção em reuniões longas.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 10, text: "Consigo me concentrar mesmo em ambientes barulhentos.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 11, text: "Frequentemente esqueço o que estava fazendo.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 12, text: "Sou meticuloso ao revisar meu trabalho.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 13, text: "Minha atenção diminui após algumas horas de trabalho.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 14, text: "Consigo filtrar informações irrelevantes.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 15, text: "Me perco facilmente em pensamentos durante tarefas.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 16, text: "Noto inconsistências em dados ou informações.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 17, text: "Preciso de pausas frequentes para manter o foco.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 18, text: "Consigo manter concentração mesmo quando cansado.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 19, text: "Tenho dificuldade para acompanhar instruções longas.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 20, text: "Sou cuidadoso ao verificar informações importantes.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 21, text: "Minha produtividade diminui ao longo do dia.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 22, text: "Consigo manter foco mesmo sob pressão.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 23, text: "Me distraio facilmente com pensamentos irrelevantes.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 24, text: "Presto atenção aos detalhes em documentos.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 25, text: "Canso mentalmente após períodos curtos de concentração.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 26, text: "Mantenho foco mesmo com múltiplas demandas.", factor: "atencao_sustentada", facet: "controle", reverse: false },
  { id: 27, text: "Frequentemente perco o fio da meada em conversas.", factor: "atencao_sustentada", facet: "concentracao", reverse: true },
  { id: 28, text: "Sou minucioso ao analisar informações.", factor: "atencao_sustentada", facet: "detalhamento", reverse: false },
  { id: 29, text: "Minha concentração varia muito durante o dia.", factor: "atencao_sustentada", facet: "resistencia", reverse: true },
  { id: 30, text: "Consigo manter atenção seletiva quando necessário.", factor: "atencao_sustentada", facet: "controle", reverse: false },


  { id: 31, text: "Processo informações rapidamente.", factor: "velocidade_processamento", facet: "rapidez", reverse: false },
  { id: 32, text: "Demoro para entender instruções complexas.", factor: "velocidade_processamento", facet: "compreensao", reverse: true },
  { id: 33, text: "Tomo decisões rapidamente quando necessário.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 34, text: "Preciso de tempo extra para processar informações.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 35, text: "Compreendo conceitos novos facilmente.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 36, text: "Respondo rapidamente a situações inesperadas.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 37, text: "Sou lento para fazer cálculos mentais.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 38, text: "Tenho dificuldade para acompanhar explicações rápidas.", factor: "velocidade_processamento", facet: "compreensao", reverse: true },
  { id: 39, text: "Adapto-me rapidamente a mudanças.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 40, text: "Preciso reler textos várias vezes para entender.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 41, text: "Capto rapidamente o sentido de conversas.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 42, text: "Reajo prontamente a emergências.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 43, text: "Demoro para processar informações visuais.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 44, text: "Tenho dificuldade para seguir raciocínios complexos.", factor: "velocidade_processamento", facet: "compreensao", reverse: true },
  { id: 45, text: "Penso rapidamente em soluções para problemas.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 46, text: "Sou lento para conectar ideias relacionadas.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 47, text: "Entendo rapidamente o que as pessoas querem dizer.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 48, text: "Respondo imediatamente quando questionado.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 49, text: "Preciso de mais tempo que outros para aprender.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 50, text: "Compreendo facilmente analogias e metáforas.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 51, text: "Tomo decisões instantâneas quando pressionado.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 52, text: "Demoro para organizar meus pensamentos.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 53, text: "Interpreto rapidamente gráficos e tabelas.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 54, text: "Ajo rapidamente em situações críticas.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 55, text: "Sou lento para fazer associações mentais.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 56, text: "Entendo imediatamente instruções escritas.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 57, text: "Respondo rapidamente a perguntas diretas.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },
  { id: 58, text: "Preciso de tempo para digerir informações novas.", factor: "velocidade_processamento", facet: "rapidez", reverse: true },
  { id: 59, text: "Compreendo rapidamente conceitos abstratos.", factor: "velocidade_processamento", facet: "compreensao", reverse: false },
  { id: 60, text: "Reajo instantaneamente a estímulos visuais.", factor: "velocidade_processamento", facet: "agilidade", reverse: false },


  { id: 61, text: "Consigo resistir a impulsos quando necessário.", factor: "controle_inibitorio", facet: "autocontrole", reverse: false },
  { id: 62, text: "Ajo sem pensar nas consequências.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 63, text: "Consigo parar uma ação já iniciada se necessário.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 64, text: "Tenho dificuldade para controlar meus impulsos.", factor: "controle_inibitorio", facet: "autocontrole", reverse: true },
  { id: 65, text: "Frequentemente interrompo outras pessoas.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 66, text: "Posso mudar minha resposta se percebo que está errada.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 67, text: "Mantenho autocontrole mesmo quando irritado.", factor: "controle_inibitorio", facet: "autocontrole", reverse: false },
  { id: 68, text: "Tomo decisões precipitadas frequentemente.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 69, text: "Consigo inibir respostas automáticas quando inadequadas.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 70, text: "Tenho dificuldade para me conter em situações tensas.", factor: "controle_inibitorio", facet: "autocontrole", reverse: true },
  { id: 71, text: "Falo sem pensar no que vou dizer.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 72, text: "Posso corrigir meu comportamento rapidamente.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 73, text: "Controlo bem meus impulsos emocionais.", factor: "controle_inibitorio", facet: "autocontrole", reverse: false },
  { id: 74, text: "Ajo primeiro e penso depois.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 75, text: "Consigo suprimir respostas inadequadas.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 76, text: "Perco o controle facilmente sob pressão.", factor: "controle_inibitorio", facet: "autocontrole", reverse: true },
  { id: 77, text: "Respondo impulsivamente a provocações.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 78, text: "Posso modificar minha estratégia quando necessário.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 79, text: "Mantenho compostura em situações difíceis.", factor: "controle_inibitorio", facet: "autocontrole", reverse: false },
  { id: 80, text: "Tenho dificuldade para esperar minha vez.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 81, text: "Consigo parar comportamentos inadequados.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 82, text: "Reajo exageradamente a situações estressantes.", factor: "controle_inibitorio", facet: "autocontrole", reverse: true },
  { id: 83, text: "Faço coisas sem considerar as consequências.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 84, text: "Posso ajustar meu comportamento conforme a situação.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 85, text: "Controlo bem meus impulsos destrutivos.", factor: "controle_inibitorio", facet: "autocontrole", reverse: false },
  { id: 86, text: "Ajo sem refletir sobre as implicações.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 87, text: "Consigo inibir respostas habituais quando necessário.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },
  { id: 88, text: "Tenho dificuldade para me controlar quando ansioso.", factor: "controle_inibitorio", facet: "autocontrole", reverse: true },
  { id: 89, text: "Respondo automaticamente sem pensar.", factor: "controle_inibitorio", facet: "impulsividade", reverse: true },
  { id: 90, text: "Posso alterar minha abordagem quando não funciona.", factor: "controle_inibitorio", facet: "flexibilidade", reverse: false },


  { id: 91, text: "Adapto-me facilmente a mudanças de planos.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: false },
  { id: 92, text: "Tenho dificuldade para mudar de perspectiva.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: true },
  { id: 93, text: "Consigo alternar entre diferentes tarefas facilmente.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: false },
  { id: 94, text: "Fico confuso quando preciso mudar de estratégia.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: true },
  { id: 95, text: "Vejo problemas de múltiplos ângulos.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: false },
  { id: 96, text: "Tenho dificuldade para fazer múltiplas tarefas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: true },
  { id: 97, text: "Ajusto minha abordagem conforme a situação.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: false },
  { id: 98, text: "Fico preso em uma única forma de pensar.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: true },
  { id: 99, text: "Mudo facilmente entre diferentes tipos de atividades.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: false },
  { id: 100, text: "Resisto a mudanças em rotinas estabelecidas.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: true },
  { id: 101, text: "Considero diferentes soluções para um problema.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: false },
  { id: 102, text: "Perco eficiência ao alternar entre tarefas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: true },
  { id: 103, text: "Modifico meus métodos quando não funcionam.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: false },
  { id: 104, text: "Tenho dificuldade para ver outros pontos de vista.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: true },
  { id: 105, text: "Gerencio bem múltiplas demandas simultâneas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: false },
  { id: 106, text: "Prefiro manter as mesmas estratégias sempre.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: true },
  { id: 107, text: "Analiso situações de diferentes perspectivas.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: false },
  { id: 108, text: "Tenho dificuldade para dividir atenção entre tarefas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: true },
  { id: 109, text: "Experimento novas abordagens quando necessário.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: false },
  { id: 110, text: "Fico fixado em uma única interpretação.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: true },
  { id: 111, text: "Transito suavemente entre diferentes contextos.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: false },
  { id: 112, text: "Tenho dificuldade para me adaptar a novos ambientes.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: true },
  { id: 113, text: "Compreendo diferentes pontos de vista facilmente.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: false },
  { id: 114, text: "Fico sobrecarregado com múltiplas tarefas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: true },
  { id: 115, text: "Mudo de estratégia quando a situação exige.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: false },
  { id: 116, text: "Tenho uma visão rígida sobre as coisas.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: true },
  { id: 117, text: "Consigo focar em diferentes aspectos simultaneamente.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: false },
  { id: 118, text: "Evito mudanças em meus métodos de trabalho.", factor: "flexibilidade_cognitiva", facet: "adaptabilidade", reverse: true },
  { id: 119, text: "Aceito facilmente perspectivas contrárias às minhas.", factor: "flexibilidade_cognitiva", facet: "perspectiva", reverse: false },
  { id: 120, text: "Tenho dificuldade para gerenciar prioridades múltiplas.", factor: "flexibilidade_cognitiva", facet: "alternancia", reverse: true }
]

type Question = {
  id: number
  text: string
  factor: string
  facet: string
  reverse: boolean
}

type Results = {
  atencao_sustentada: number
  velocidade_processamento: number
  controle_inibitorio: number
  flexibilidade_cognitiva: number
  facets: {
    [key: string]: number
  }
}

export default function TARTest() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [isValidated, setIsValidated] = useState(false)


  useEffect(() => {
    const startParam = searchParams.get('start')
    if (startParam === 'true') {
      setIsValidated(true)
      setTestStarted(true)
    } else {

      router.push('/colaborador/personalidade/tar/introducao')
    }
  }, [searchParams, router])


  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testStarted, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateResults = (): Results => {
    const factorScores: { [key: string]: number[] } = {
      atencao_sustentada: [],
      velocidade_processamento: [],
      controle_inibitorio: [],
      flexibilidade_cognitiva: []
    }

    const facetScores: { [key: string]: number[] } = {}

    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        const score = question.reverse ? 6 - answer : answer
        factorScores[question.factor].push(score)
        
        if (!facetScores[question.facet]) {
          facetScores[question.facet] = []
        }
        facetScores[question.facet].push(score)
      }
    })


    const results: Results = {
      atencao_sustentada: Math.round((factorScores.atencao_sustentada.reduce((a, b) => a + b, 0) / factorScores.atencao_sustentada.length - 1) * 25),
      velocidade_processamento: Math.round((factorScores.velocidade_processamento.reduce((a, b) => a + b, 0) / factorScores.velocidade_processamento.length - 1) * 25),
      controle_inibitorio: Math.round((factorScores.controle_inibitorio.reduce((a, b) => a + b, 0) / factorScores.controle_inibitorio.length - 1) * 25),
      flexibilidade_cognitiva: Math.round((factorScores.flexibilidade_cognitiva.reduce((a, b) => a + b, 0) / factorScores.flexibilidade_cognitiva.length - 1) * 25),
      facets: {}
    }


    Object.keys(facetScores).forEach(facet => {
      results.facets[facet] = Math.round((facetScores[facet].reduce((a, b) => a + b, 0) / facetScores[facet].length - 1) * 25)
    })

    return results
  }

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }))
    

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
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const calculatedResults = calculateResults()
    setResults(calculatedResults)
    

    const resultData = {
      testType: 'TAR',
      testName: 'Teste de Atenção e Raciocínio',
      completedAt: new Date().toISOString(),
      timeElapsed: timeElapsed,
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      results: calculatedResults,
      factors: {
        'Atenção Sustentada': calculatedResults.atencao_sustentada,
        'Velocidade de Processamento': calculatedResults.velocidade_processamento,
        'Controle Inibitório': calculatedResults.controle_inibitorio,
        'Flexibilidade Cognitiva': calculatedResults.flexibilidade_cognitiva
      }
    }
    
    localStorage.setItem('tarTestResults', JSON.stringify(resultData))
    
    setShowResults(true)
    setIsSubmitting(false)
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { level: 'Muito Alto', color: 'text-emerald-600' }
    if (score >= 60) return { level: 'Alto', color: 'text-emerald-500' }
    if (score >= 40) return { level: 'Médio', color: 'text-yellow-500' }
    if (score >= 20) return { level: 'Baixo', color: 'text-orange-500' }
    return { level: 'Muito Baixo', color: 'text-red-500' }
  }

  const getFactorName = (factor: string) => {
    const names: { [key: string]: string } = {
      atencao_sustentada: 'Atenção Sustentada',
      velocidade_processamento: 'Velocidade de Processamento',
      controle_inibitorio: 'Controle Inibitório',
      flexibilidade_cognitiva: 'Flexibilidade Cognitiva'
    }
    return names[factor] || factor
  }

  const getCurrentFactorName = () => {
    const currentFactor = questions[currentQuestion]?.factor
    return getFactorName(currentFactor)
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100
  const currentAnswer = answers[questions[currentQuestion]?.id]
  const canProceed = currentAnswer !== undefined

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acesso ao teste...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-emerald-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">HumaniQ TAR</h1>
                  <p className="text-emerald-100">Teste de Atenção e Raciocínio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-100">Tempo Total</p>
                <p className="text-xl font-semibold">{formatTime(timeElapsed)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resultados do Teste</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Questões Respondidas</p>
                <p className="text-2xl font-bold text-emerald-600">{answeredCount}/{questions.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-emerald-600">{Math.round((answeredCount / questions.length) * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(results).filter(([key]) => key !== 'facets').map(([factor, score]) => {
              const interpretation = getScoreInterpretation(score as number)
              return (
                <div key={factor} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">{getFactorName(factor)}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-600">{typeof score === 'number' ? score : 0}</span>
                      <span className={`ml-2 text-sm font-medium ${interpretation.color}`}>
                        {interpretation.level}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${typeof score === 'number' ? score : 0}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push('/colaborador/personalidade')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar aos Testes
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Imprimir Resultados
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-bold">HumaniQ TAR</h1>
                <p className="text-emerald-100 text-sm">Teste de Atenção e Raciocínio</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Questão</p>
              <p className="text-lg font-semibold">{currentQuestion + 1}/{questions.length}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-emerald-500 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/colaborador/personalidade/tar/introducao')}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Factor Badge */}
          <div className="mb-6">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              {getCurrentFactorName()}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {questions[currentQuestion]?.text}
            </h2>

            {/* Scale Labels */}
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Discordo</span>
              <span>Neutro</span>
              <span>Concordo</span>
            </div>

            {/* Likert Scale */}
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4, 5].map((value) => {
                const colors = {
                  1: 'bg-red-400 hover:bg-red-500',
                  2: 'bg-orange-400 hover:bg-orange-500', 
                  3: 'bg-yellow-400 hover:bg-yellow-500',
                  4: 'bg-green-400 hover:bg-green-500',
                  5: 'bg-emerald-500 hover:bg-emerald-600'
                }
                const labels = {
                  1: 'Discordo totalmente',
                  2: 'Discordo',
                  3: 'Neutro',
                  4: 'Concordo', 
                  5: 'Concordo totalmente'
                }
                
                return (
                  <div key={value} className="flex flex-col items-center">
                    <button
                      onClick={() => handleAnswerChange(value)}
                      className={`w-16 h-16 rounded-lg ${colors[value as keyof typeof colors]} text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                        currentAnswer === value ? 'ring-4 ring-emerald-300 scale-105' : ''
                      }`}
                    >
                      {value}
                    </button>
                    <span className="text-xs text-gray-600 mt-2 text-center max-w-20">
                      {labels[value as keyof typeof labels]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Instruction */}
            <p className="text-center text-gray-500 text-sm">
              {canProceed ? 'Resposta selecionada' : 'Selecione uma resposta para continuar'}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <div className="text-center text-sm text-gray-500">
              {canProceed ? 'Resposta selecionada' : 'Selecione uma resposta para continuar'}
            </div>

            {currentQuestion < questions.length && (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            )}
          </div>
        </div>

        {/* Progress Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Tempo: {formatTime(timeElapsed)}</span>
            </div>
            <span>•</span>
            <span>Respondidas: {answeredCount}/{questions.length}</span>
            <span>•</span>
            <span>Progresso: {Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}