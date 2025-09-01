'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, BarChart3, Users, Shield, MessageSquare, Heart, Scale, BookOpen, Printer } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: string
}

interface DimensionResult {
  name: string
  score: number
  level: string
  description: string
  recommendations: string[]
}

interface TestResult {
  globalScore: number
  globalLevel: string
  dimensions: DimensionResult[]
  alerts: string[]
  recommendations: string[]
}

const questions: Question[] = [
  // Segurança Psicológica (12 perguntas)
  { id: 1, text: "Sinto-me à vontade para expressar minhas opiniões no trabalho sem medo de represálias.", dimension: "Segurança Psicológica" },
  { id: 2, text: "Quando cometo erros, sinto que minha equipe me apoia para aprender com eles.", dimension: "Segurança Psicológica" },
  { id: 3, text: "Posso compartilhar ideias novas sem receio de ser julgado negativamente.", dimension: "Segurança Psicológica" },
  { id: 4, text: "Me sinto seguro(a) para questionar decisões da liderança sem medo de consequências.", dimension: "Segurança Psicológica" },
  { id: 5, text: "Minhas preocupações são levadas a sério pela equipe e gestores.", dimension: "Segurança Psicológica" },
  { id: 6, text: "A cultura do meu local de trabalho incentiva o diálogo aberto.", dimension: "Segurança Psicológica" },
  { id: 7, text: "Sou encorajado(a) a falar sobre dificuldades emocionais ou psicológicas.", dimension: "Segurança Psicológica" },
  { id: 8, text: "A equipe aceita diferentes pontos de vista e opiniões divergentes.", dimension: "Segurança Psicológica" },
  { id: 9, text: "Sinto que posso pedir ajuda quando estou com problemas no trabalho.", dimension: "Segurança Psicológica" },
  { id: 10, text: "Erros são tratados como oportunidades para melhorar, não para punir.", dimension: "Segurança Psicológica" },
  { id: 11, text: "Sinto que minha saúde mental é respeitada e valorizada pela equipe.", dimension: "Segurança Psicológica" },
  { id: 12, text: "Posso falar abertamente sobre minhas limitações sem sofrer preconceito.", dimension: "Segurança Psicológica" },

  // Comunicação Interna (12 perguntas)
  { id: 13, text: "As informações importantes chegam até mim de forma clara e oportuna.", dimension: "Comunicação Interna" },
  { id: 14, text: "Sinto que posso comunicar meus problemas de saúde mental à liderança sem constrangimento.", dimension: "Comunicação Interna" },
  { id: 15, text: "Existe transparência na comunicação sobre decisões que impactam minha função.", dimension: "Comunicação Interna" },
  { id: 16, text: "Recebo feedbacks frequentes e construtivos sobre meu desempenho.", dimension: "Comunicação Interna" },
  { id: 17, text: "A comunicação entre diferentes departamentos é eficiente e colaborativa.", dimension: "Comunicação Interna" },
  { id: 18, text: "Tenho acesso a canais adequados para expressar minhas dúvidas e preocupações.", dimension: "Comunicação Interna" },
  { id: 19, text: "Sinto que as informações compartilhadas são confiáveis e coerentes.", dimension: "Comunicação Interna" },
  { id: 20, text: "A liderança se comunica de forma aberta e acessível.", dimension: "Comunicação Interna" },
  { id: 21, text: "Recebo suporte adequado quando informo sobre dificuldades relacionadas ao trabalho.", dimension: "Comunicação Interna" },
  { id: 22, text: "As reuniões são produtivas e ajudam a esclarecer questões importantes.", dimension: "Comunicação Interna" },
  { id: 23, text: "A empresa promove iniciativas que facilitam a comunicação entre colegas.", dimension: "Comunicação Interna" },
  { id: 24, text: "A comunicação interna contribui para um ambiente de trabalho positivo.", dimension: "Comunicação Interna" },

  // Pertencimento e Inclusão (12 perguntas)
  { id: 25, text: "Sinto que faço parte de uma equipe que valoriza minha contribuição.", dimension: "Pertencimento e Inclusão" },
  { id: 26, text: "Me sinto conectado(a) com os valores e a missão da empresa.", dimension: "Pertencimento e Inclusão" },
  { id: 27, text: "Minha equipe me inclui nas decisões que afetam nosso trabalho.", dimension: "Pertencimento e Inclusão" },
  { id: 28, text: "Tenho boas relações interpessoais com meus colegas de trabalho.", dimension: "Pertencimento e Inclusão" },
  { id: 29, text: "Sinto que sou aceito(a) como sou no ambiente de trabalho.", dimension: "Pertencimento e Inclusão" },
  { id: 30, text: "Posso contar com meus colegas em momentos de dificuldade.", dimension: "Pertencimento e Inclusão" },
  { id: 31, text: "Sinto orgulho de trabalhar nesta empresa.", dimension: "Pertencimento e Inclusão" },
  { id: 32, text: "A empresa valoriza a diversidade e respeita as diferenças individuais.", dimension: "Pertencimento e Inclusão" },
  { id: 33, text: "Participo ativamente das atividades e eventos da equipe ou empresa.", dimension: "Pertencimento e Inclusão" },
  { id: 34, text: "Sinto que faço parte de algo maior do que meu trabalho individual.", dimension: "Pertencimento e Inclusão" },
  { id: 35, text: "A cultura da empresa promove a colaboração e o apoio mútuo.", dimension: "Pertencimento e Inclusão" },
  { id: 36, text: "Sinto-me valorizado(a) como membro da equipe.", dimension: "Pertencimento e Inclusão" },

  // Justiça Organizacional (12 perguntas)
  { id: 37, text: "As políticas da empresa são aplicadas de forma justa para todos.", dimension: "Justiça Organizacional" },
  { id: 38, text: "Sinto que a liderança age com integridade e transparência.", dimension: "Justiça Organizacional" },
  { id: 39, text: "Recebo reconhecimento adequado pelo meu trabalho e esforço.", dimension: "Justiça Organizacional" },
  { id: 40, text: "As decisões da empresa são comunicadas de forma clara e honesta.", dimension: "Justiça Organizacional" },
  { id: 41, text: "A empresa oferece oportunidades iguais para crescimento e desenvolvimento.", dimension: "Justiça Organizacional" },
  { id: 42, text: "Os procedimentos para resolver conflitos são justos e eficazes.", dimension: "Justiça Organizacional" },
  { id: 43, text: "Sinto que minhas preocupações são tratadas de forma imparcial.", dimension: "Justiça Organizacional" },
  { id: 44, text: "A liderança promove um ambiente de trabalho ético e respeitável.", dimension: "Justiça Organizacional" },
  { id: 45, text: "A empresa mantém confidencialidade em relação a assuntos pessoais e delicados.", dimension: "Justiça Organizacional" },
  { id: 46, text: "Sinto que as regras e políticas internas são claras e bem aplicadas.", dimension: "Justiça Organizacional" },
  { id: 47, text: "Recebo feedback justo sobre meu desempenho.", dimension: "Justiça Organizacional" },
  { id: 48, text: "A empresa promove um ambiente de trabalho transparente em todos os níveis.", dimension: "Justiça Organizacional" }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniQInsightPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userName = user?.firstName || ''
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<TestResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const handleAnswer = (value: number) => {
    // Verificar se currentQuestion está dentro dos bounds
    if (currentQuestion >= questions.length) {
      console.error('currentQuestion fora dos bounds:', currentQuestion, 'total questions:', questions.length)
      return
    }
    
    const questionId = questions[currentQuestion].id
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    
    // Avanço automático após 800ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Se for a última pergunta, finalizar o teste
        completeTest()
      }
    }, 800)
  }

  const calculateResults = (): TestResult => {
    const dimensions = [
      "Segurança Psicológica",
      "Comunicação Interna", 
      "Pertencimento e Inclusão",
      "Justiça Organizacional"
    ]

    const dimensionResults: DimensionResult[] = dimensions.map(dimension => {
      const dimensionQuestions = questions.filter(q => q.dimension === dimension)
      const dimensionAnswers = dimensionQuestions.map(q => answers[q.id] || 0)
      const score = dimensionAnswers.reduce((sum, answer) => sum + answer, 0) / dimensionQuestions.length
      
      let level: string
      let description: string
      
      if (score >= 1.0 && score <= 2.5) {
        level = "Problemático"
        description = "Ambiente problemático que requer atenção imediata"
      } else if (score >= 2.6 && score <= 3.5) {
        level = "Neutro/Moderado"
        description = "Ambiente neutro com potencial de melhoria"
      } else {
        level = "Saudável"
        description = "Ambiente saudável e favorável"
      }

      return {
        name: dimension,
        score: Math.round(score * 100) / 100,
        level,
        description,
        recommendations: generateDimensionRecommendations(dimension, score)
      }
    })

    const globalScore = Object.values(answers).reduce((sum, answer) => sum + answer, 0) / questions.length
    let globalLevel: string
    
    if (globalScore >= 1.0 && globalScore <= 2.5) {
      globalLevel = "Clima Problemático"
    } else if (globalScore >= 2.6 && globalScore <= 3.5) {
      globalLevel = "Clima Moderado/Neutro"
    } else {
      globalLevel = "Clima Positivo e Saudável"
    }

    const alerts = dimensionResults
      .filter(dim => dim.score <= 2.5)
      .map(dim => `Atenção: ${dim.name} apresenta nível problemático (${dim.score.toFixed(1)})`)

    const recommendations = generateGlobalRecommendations(globalScore, dimensionResults)

    return {
      globalScore: Math.round(globalScore * 100) / 100,
      globalLevel,
      dimensions: dimensionResults,
      alerts,
      recommendations
    }
  }

  const generateDimensionRecommendations = (dimension: string, score: number): string[] => {
    const recommendations: Record<string, string[]> = {
      "Segurança Psicológica": [
        "Promover treinamentos sobre comunicação não-violenta",
        "Implementar políticas claras contra retaliação",
        "Criar espaços seguros para feedback e sugestões",
        "Desenvolver lideranças em escuta ativa e empatia"
      ],
      "Comunicação Interna": [
        "Melhorar canais de comunicação interna",
        "Implementar feedback 360° regular",
        "Criar newsletters e comunicados transparentes",
        "Treinar lideranças em comunicação eficaz"
      ],
      "Pertencimento e Inclusão": [
        "Desenvolver programas de integração e acolhimento",
        "Promover atividades de team building",
        "Implementar políticas de diversidade e inclusão",
        "Criar grupos de afinidade e mentoria"
      ],
      "Justiça Organizacional": [
        "Revisar políticas de reconhecimento e recompensa",
        "Implementar processos transparentes de avaliação",
        "Criar ouvidoria interna independente",
        "Desenvolver código de ética e conduta"
      ]
    }

    return recommendations[dimension] || []
  }

  const generateGlobalRecommendations = (globalScore: number, dimensions: DimensionResult[]): string[] => {
    const recs = []
    
    if (globalScore <= 2.5) {
      recs.push("Implementar plano de ação urgente para melhoria do clima organizacional")
      recs.push("Realizar pesquisa qualitativa para identificar causas específicas")
      recs.push("Estabelecer comitê de clima e bem-estar")
    } else if (globalScore <= 3.5) {
      recs.push("Desenvolver iniciativas de melhoria contínua do clima")
      recs.push("Implementar programa de escuta ativa")
      recs.push("Fortalecer canais de comunicação e feedback")
    } else {
      recs.push("Manter práticas atuais e buscar excelência")
      recs.push("Compartilhar boas práticas com outras áreas")
      recs.push("Implementar programa de reconhecimento")
    }

    return recs
  }

  const completeTest = async () => {
    setIsSubmitting(true)
    
    try {
      const testResults = calculateResults()
      setResults(testResults)
      
      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)
      
      // Primeiro, criar uma sessão de teste
      const sessionResponse = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: 'cme216bcl00018wg05iydpwsz'
        })
      })
      
      if (!sessionResponse.ok) {
        console.warn(`Falha ao criar sessão de teste. Código: ${sessionResponse.status}. Salvando resultados localmente.`)
        if (typeof window !== 'undefined') {
          localStorage.setItem('humaniqInsightResults', JSON.stringify(testResults))
        }
        setIsCompleted(true)
        // não interrompe o fluxo se a sessão não puder ser criada
        return
      }
      
      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.sessionId
      
      const submission = {
        testId: 'cme216bcl00018wg05iydpwsz', // ID do teste HumaniQ Insight no banco
        sessionId: sessionId,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId: questionId,
          value: value,
          metadata: {}
        })),
        duration: duration,
        metadata: {
          results: testResults
        }
      }

      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn(`Falha ao enviar resultados (status ${response.status}). Salvando localmente.`)
          if (typeof window !== 'undefined') {
            localStorage.setItem('humaniqInsightResults', JSON.stringify(testResults))
          }
          setIsCompleted(true)
          return
        }
        const errorData = await response.json()
        console.error('Erro na submissão:', errorData)
        throw new Error(errorData.error || 'Falha ao enviar o teste.')
      }

      const data = await response.json()
      console.log('Teste submetido com sucesso:', data)

      if (data && data.testResult && data.testResult.id) {
        // Disparar análise de IA em segundo plano (sem esperar)
        fetch('/api/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ testResultId: data.testResult.id })
        })
      }
      
      setIsCompleted(true)
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
      if (!isCompleted) {
        // Em caso de falha de rede ou outro erro não tratado, salvar resultados localmente
        if (typeof window !== 'undefined' && results) {
          localStorage.setItem('humaniqInsightResults', JSON.stringify(results))
        }
        console.warn('Falha ao submeter teste. Resultados salvos localmente.')
        setIsCompleted(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = currentQuestion < questions.length ? questions[currentQuestion] : null

  if (isCompleted && results) {
    const testDuration = Math.round((Date.now() - startTime) / 1000);
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Teste Concluído!</h1>
          </div>
          <p className="text-gray-600">Seus resultados do HumaniQ Insight estão prontos</p>
        </div>

        {/* Resultado Global */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="h-8 w-8 text-blue-600" />
              Índice Geral de Clima Psicossocial
            </CardTitle>
            <div className="text-4xl font-bold text-blue-600 mt-4">
              {results.globalScore.toFixed(1)}/5.0
            </div>
            <Badge className={`text-lg px-4 py-2 ${
              results.globalScore <= 2.5 ? 'bg-red-100 text-red-800' :
              results.globalScore <= 3.5 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {results.globalLevel}
            </Badge>
          </CardHeader>
        </Card>

        {/* Explicação Profunda dos Resultados */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
              Interpretação Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="text-gray-700 leading-relaxed mb-4 space-y-1">
                <p>Olá {user.firstName},</p>
                <p className="text-sm text-gray-600"><strong>Identificação do Avaliado:</strong></p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><span className="font-medium">Nome:</span> {user.firstName} {user.lastName ?? ''}</li>
                  <li><span className="font-medium">Email:</span> {user.email}</li>
                  {user.company?.name && (<li><span className="font-medium">Empresa:</span> {user.company.name}</li>)}
                  {user.company?.role && (<li><span className="font-medium">Função:</span> {user.company.role}</li>)}
                  <li><span className="font-medium">Tipo de Usuário:</span> {user.userType}</li>
                  <li><span className="font-medium">Duração do Teste:</span> {testDuration} segundos</li>
                </ul>
              </div>
            )}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {(() => {
                switch (results.globalLevel) {
                  case 'Clima Problemático':
                    return `Seu resultado revela um clima psicossocial crítico, caracterizado por níveis elevados de tensão, insegurança e possível desgaste emocional.\n\nIndicadores apontam para falhas sistêmicas na comunicação, sentimento de injustiça percebida e ausência de suporte adequado. Esses fatores podem culminar em absenteísmo, rotatividade e queda de produtividade.\n\n• Inicie uma escuta ativa estruturada — conduza entrevistas de clima e grupos focalizados para mapear fontes específicas de estresse.\n• Priorize ações corretivas rápidas: revisão de cargas de trabalho, políticas de assédio e equidade salarial.\n• Disponibilize canais confidenciais de apoio psicológico e implemente treinamentos de liderança empática para gestores.\n• Estabeleça um plano de ação de 90 dias com metas mensuráveis, comunicando progressos de forma transparente a toda equipe.`
                  case 'Clima Moderado/Neutro':
                    return `O ambiente apresenta estabilidade geral, mas evidencia oportunidades latentes para elevar o engajamento e a satisfação.\n\nOs colaboradores reconhecem práticas positivas de suporte, porém identificam inconstâncias em reconhecimento, crescimento de carreira e integração entre equipes.\n\n• Consolide os pontos fortes existentes por meio de rituais que celebrem conquistas e reforcem valores culturais.\n• Implante ciclos de feedback contínuo (one-on-ones, pesquisas pulse) para detectar mudanças de humor organizacional em tempo real.\n• Invista em desenvolvimento de competências sócio-emocionais, mentorias cruzadas e programas de mobilidade interna para estimular pertencimento.\n• Defina indicadores-chave de clima (eNPS, satisfação com liderança) e acompanhe trimestralmente a evolução dos resultados.`
                  case 'Clima Positivo e Saudável':
                  default:
                    return `Parabéns! Os indicadores refletem um ecossistema organizacional que favorece a segurança psicológica, a confiança mútua e o alto desempenho sustentável.\n\nEsse cenário é fruto de práticas sólidas de liderança inclusiva, transparência comunicacional e suporte ao desenvolvimento integral.\n\n• Continue promovendo espaços de diálogo aberto e reforçando políticas de bem-estar que integrem saúde física, mental e social.\n• Experimente programas de job crafting, voluntariado corporativo e aprendizagem contínua para manter a motivação intrínseca elevada.\n• Mensure periodicamente métricas de clima e burnout para detectar precocemente variações negativas e agir proativamente.\n• Compartilhe histórias de sucesso internas para fortalecer o senso de propósito e a cultura de cuidado genuíno.`
                }
              })()}
            </p>
          </CardContent>
        </Card>

        {/* Alertas */}
        {results.alerts.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alertas Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.alerts.map((alert, index) => (
                  <li key={index} className="text-red-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {alert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Resultados por Dimensão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.dimensions.map((dimension, index) => {
            const icons = [Shield, MessageSquare, Heart, Scale]
            const Icon = icons[index]
            
            return (
              <Card key={dimension.name} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {dimension.name}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {dimension.score.toFixed(1)}/5.0
                    </span>
                    <Badge className={`${
                      dimension.score <= 2.5 ? 'bg-red-100 text-red-800' :
                      dimension.score <= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dimension.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{dimension.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Recomendações:</h4>
                    <ul className="space-y-1">
                      {dimension.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recomendações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              Recomendações Estratégicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-800">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={() => router.push('/colaborador/psicossociais')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Testes
          </Button>
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Printer className="h-4 w-4" />
            Imprimir Resultado
          </Button>
          <Button 
            onClick={() => router.push('/colaborador/resultados?saved=1')}
            className="flex items-center gap-2"
          >
            Ver Todos os Resultados
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo exato da imagem */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white relative">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e título à esquerda */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">HumaniQ Insight</h1>
                <p className="text-sm text-purple-100">Avaliação do Clima Organizacional e Saúde Mental no Trabalho</p>
              </div>
            </div>
            
            {/* Contador de questões à direita */}
            <div className="text-right">
              <div className="text-sm text-purple-100">Questão</div>
              <div className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</div>
            </div>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="h-1 bg-purple-700">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Dimensão atual centralizada */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-purple-600 mb-6">
            {currentQ?.dimension}
          </h2>
        </div>

        {/* Pergunta centralizada */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-medium text-gray-800 leading-relaxed max-w-3xl mx-auto">
            {currentQ?.text}
          </h3>
        </div>

        {/* Labels da escala */}
        <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto px-4">
          <span className="text-sm font-medium text-red-500">Discordo</span>
          <span className="text-sm font-medium text-yellow-600">Neutro</span>
          <span className="text-sm font-medium text-green-600">Concordo</span>
        </div>

        {/* Barra de gradiente */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-400 rounded-full"></div>
        </div>

        {/* Escala Likert customizada */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between items-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => {
              const isSelected = answers[currentQ?.id || 0] === value
              const colors = {
                1: 'bg-red-300 hover:bg-red-400 border-red-400',
                2: 'bg-orange-300 hover:bg-orange-400 border-orange-400', 
                3: 'bg-yellow-300 hover:bg-yellow-400 border-yellow-400',
                4: 'bg-green-300 hover:bg-green-400 border-green-400',
                5: 'bg-green-400 hover:bg-green-500 border-green-500'
              }
              const labels = {
                1: 'Discordo totalmente',
                2: 'Discordo',
                3: 'Neutro', 
                4: 'Concordo',
                5: 'Concordo totalmente'
              }
              
              return (
                <div key={value} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleAnswer(value)}
                    className={`w-16 h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-xl font-bold text-gray-800 ${
                      colors[value as keyof typeof colors]
                    } ${
                      isSelected ? 'ring-4 ring-purple-300 scale-105' : ''
                    }`}
                  >
                    {value}
                  </button>
                  <span className="text-xs text-gray-600 text-center max-w-20 leading-tight">
                    {labels[value as keyof typeof labels]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">Selecione uma resposta para continuar</div>
          </div>
          
          <Button 
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                completeTest()
              }
            }}
            disabled={!currentQ?.id || !answers[currentQ.id]}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Próxima
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}