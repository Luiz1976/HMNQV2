'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Shield, Printer } from 'lucide-react'
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
      level: string
      color: string
    }
  }
  overallIndex: number
  overallLevel: string
  overallColor: string
  criticalAlerts: string[]
}

const questions: Question[] = [
  // Bloco 1 – Assédio Moral Direto (12 perguntas)
  { id: 1, text: "Já fui exposto(a) a críticas constantes e desproporcionais sobre meu trabalho, com o intuito de humilhar.", dimension: "Assédio Moral Direto" },
  { id: 2, text: "Já fui gritado(a), ofendido(a) ou constrangido(a) por superiores ou colegas.", dimension: "Assédio Moral Direto" },
  { id: 3, text: "Me pedem tarefas humilhantes ou incompatíveis com minha função como forma de punição velada.", dimension: "Assédio Moral Direto" },
  { id: 4, text: "Me excluem propositalmente de reuniões ou informações importantes.", dimension: "Assédio Moral Direto" },
  { id: 5, text: "Já me senti ameaçado(a) ou coagido(a) a aceitar ordens abusivas para manter meu emprego.", dimension: "Assédio Moral Direto" },
  { id: 6, text: "Minhas falas ou ideias são constantemente ridicularizadas em público.", dimension: "Assédio Moral Direto" },
  { id: 7, text: "Recebo apelidos ou comentários maldosos sobre minha aparência ou personalidade no ambiente de trabalho.", dimension: "Assédio Moral Direto" },
  { id: 8, text: "Já fui isolado(a) socialmente ou impedido(a) de interagir com a equipe por decisão de um superior ou colega.", dimension: "Assédio Moral Direto" },
  { id: 9, text: "Sou alvo de fofocas maliciosas ou insinuações com o objetivo de prejudicar minha imagem.", dimension: "Assédio Moral Direto" },
  { id: 10, text: "Já tive metas inatingíveis impostas como forma de pressão ou punição.", dimension: "Assédio Moral Direto" },
  { id: 11, text: "Sinto que meu desempenho é sabotado ou boicotado de propósito por colegas ou gestores.", dimension: "Assédio Moral Direto" },
  { id: 12, text: "Já fui alvo de ameaças de demissão sem justificativa clara ou válida.", dimension: "Assédio Moral Direto" },

  // Bloco 2 – Assédio Moral Institucional/Velado (10 perguntas)
  { id: 13, text: "A cultura da empresa normaliza comportamentos abusivos sob a justificativa de 'pressão por resultados'.", dimension: "Assédio Moral Institucional" },
  { id: 14, text: "Sinto que há proteção ou conivência da liderança com atitudes humilhantes de certos gestores.", dimension: "Assédio Moral Institucional" },
  { id: 15, text: "Reclamações sobre condutas abusivas raramente são levadas a sério.", dimension: "Assédio Moral Institucional" },
  { id: 16, text: "Há tolerância com práticas como isolamento de funcionários ou desvalorização sistemática de alguns colaboradores.", dimension: "Assédio Moral Institucional" },
  { id: 17, text: "Muitos evitam relatar problemas por medo de retaliações ou perda de oportunidades.", dimension: "Assédio Moral Institucional" },
  { id: 18, text: "Existe uma percepção geral de que os abusadores são 'intocáveis' ou protegidos por cargos elevados.", dimension: "Assédio Moral Institucional" },
  { id: 19, text: "A comunicação interna não favorece a escuta ativa nem o acolhimento de queixas emocionais.", dimension: "Assédio Moral Institucional" },
  { id: 20, text: "Há discriminação velada relacionada à idade, gênero, aparência ou deficiência.", dimension: "Assédio Moral Institucional" },
  { id: 21, text: "A sobrecarga de trabalho é usada como forma de punição informal.", dimension: "Assédio Moral Institucional" },
  { id: 22, text: "A gestão por medo é uma prática comum na empresa.", dimension: "Assédio Moral Institucional" },

  // Bloco 3 – Assédio Sexual (12 perguntas)
  { id: 23, text: "Já recebi comentários de conotação sexual sem consentimento no ambiente de trabalho.", dimension: "Assédio Sexual" },
  { id: 24, text: "Já me senti constrangido(a) por olhares, gestos ou insinuações de cunho sexual.", dimension: "Assédio Sexual" },
  { id: 25, text: "Já recebi convites persistentes ou inapropriados para encontros com insinuação sexual.", dimension: "Assédio Sexual" },
  { id: 26, text: "Já fui tocado(a) sem consentimento por colegas ou superiores.", dimension: "Assédio Sexual" },
  { id: 27, text: "Mensagens de conteúdo impróprio já foram enviadas por colegas ou gestores.", dimension: "Assédio Sexual" },
  { id: 28, text: "Já sofri chantagens emocionais ou profissionais com conotação sexual.", dimension: "Assédio Sexual" },
  { id: 29, text: "Senti que minha aparência foi usada como critério de julgamento profissional.", dimension: "Assédio Sexual" },
  { id: 30, text: "A exposição de imagens, vídeos ou piadas sexuais ocorre de forma banalizada no ambiente de trabalho.", dimension: "Assédio Sexual" },
  { id: 31, text: "Já fui alvo de boatos sobre minha vida sexual dentro da empresa.", dimension: "Assédio Sexual" },
  { id: 32, text: "Já ouvi comentários sexistas ou misóginos em reuniões ou conversas informais.", dimension: "Assédio Sexual" },
  { id: 33, text: "Sinto que há tolerância institucional com o assédio sexual.", dimension: "Assédio Sexual" },
  { id: 34, text: "Já fui avaliado(a) profissionalmente com base em critérios relacionados ao meu corpo ou aparência.", dimension: "Assédio Sexual" },

  // Bloco 4 – Percepção de Ambiente e Denúncias (10 perguntas)
  { id: 35, text: "A empresa oferece canais seguros para denúncias de assédio.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 36, text: "Confio que, se eu denunciar, haverá acolhimento e proteção contra retaliações.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 37, text: "Já precisei denunciar uma situação de assédio e fui ouvido(a) com seriedade.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 38, text: "Conheço alguém que sofreu assédio na empresa e não recebeu apoio adequado.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 39, text: "O RH ou canal de ética atua com imparcialidade diante de denúncias.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 40, text: "A cultura organizacional valoriza o respeito e a integridade nas relações.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 41, text: "Já vi colegas sendo expostos(as) a situações constrangedoras sem que nada fosse feito.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 42, text: "Os gestores são preparados para lidar com casos de assédio.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 43, text: "Há treinamentos e campanhas internas sobre assédio moral e sexual.", dimension: "Percepção de Ambiente e Denúncias" },
  { id: 44, text: "A empresa reforça valores éticos de forma constante e clara.", dimension: "Percepção de Ambiente e Denúncias" },

  // Bloco 5 – Impactos Emocionais e Sensação de Segurança (4 perguntas)
  { id: 45, text: "Já considerei pedir demissão por conta do clima tóxico ou de situações abusivas.", dimension: "Impactos Emocionais e Segurança" },
  { id: 46, text: "Sinto medo ou ansiedade ao interagir com determinadas pessoas na empresa.", dimension: "Impactos Emocionais e Segurança" },
  { id: 47, text: "Já precisei buscar apoio psicológico por causa do ambiente de trabalho.", dimension: "Impactos Emocionais e Segurança" },
  { id: 48, text: "Sinto-me emocionalmente seguro(a) e respeitado(a) no ambiente de trabalho.", dimension: "Impactos Emocionais e Segurança" }
]

// Removido responseOptions - agora usando LikertScale component

// Questões que precisam ser invertidas (positivas)
const positiveQuestions = [35, 36, 37, 39, 40, 42, 43, 44, 48]

export default function HumaniQPASPage() {
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
    const dimensionResults: { [key: string]: { score: number; level: string; color: string } } = {}
    const criticalAlerts: string[] = []
    
    const dimensions = [
      'Assédio Moral Direto',
      'Assédio Moral Institucional', 
      'Assédio Sexual',
      'Percepção de Ambiente e Denúncias',
      'Impactos Emocionais e Segurança'
    ]

    dimensions.forEach(dimension => {
      const dimensionQuestions = questions.filter(q => q.dimension === dimension)
      let sum = 0
      
      dimensionQuestions.forEach(q => {
        let score = finalAnswers[q.id] || 1
        // Inverter questões positivas
        if (positiveQuestions.includes(q.id)) {
          score = 6 - score
        }
        sum += score
      })
      
      const average = sum / dimensionQuestions.length
      let level = ''
      let color = ''
      
      if (average >= 4.5) {
        level = 'Crítico'
        color = 'text-red-600'
        criticalAlerts.push(`${dimension}: Situação crítica detectada`)
      } else if (average >= 3.5) {
        level = 'Alto Risco'
        color = 'text-orange-600'
      } else if (average >= 2.5) {
        level = 'Risco Moderado'
        color = 'text-yellow-600'
      } else if (average >= 1.5) {
        level = 'Baixo Risco'
        color = 'text-blue-600'
      } else {
        level = 'Ambiente Seguro'
        color = 'text-green-600'
      }
      
      dimensionResults[dimension] = { score: average, level, color }
    })

    // Calcular índice geral
    const totalSum = Object.values(finalAnswers).reduce((sum, value, index) => {
      const questionId = questions[index].id
      let score = value
      if (positiveQuestions.includes(questionId)) {
        score = 6 - score
      }
      return sum + score
    }, 0)
    
    const overallIndex = totalSum / questions.length
    let overallLevel = ''
    let overallColor = ''
    
    if (overallIndex >= 4.5) {
      overallLevel = 'Crítico'
      overallColor = 'text-red-600'
    } else if (overallIndex >= 3.5) {
      overallLevel = 'Alto Risco'
      overallColor = 'text-orange-600'
    } else if (overallIndex >= 2.5) {
      overallLevel = 'Risco Moderado'
      overallColor = 'text-yellow-600'
    } else if (overallIndex >= 1.5) {
      overallLevel = 'Baixo Risco'
      overallColor = 'text-blue-600'
    } else {
      overallLevel = 'Ambiente Seguro'
      overallColor = 'text-green-600'
    }

    const testResults: TestResult = {
      dimensionResults,
      overallIndex,
      overallLevel,
      overallColor,
      criticalAlerts
    }

    setResults(testResults)
    setIsCompleted(true)

    // Submeter resultados para API
    try {
      await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'HUMANIQ_PAS',
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 mr-3" />
                <div>
                  <CardTitle className="text-2xl font-bold">HumaniQ PAS</CardTitle>
                  <CardDescription className="text-red-100">
                    Percepção de Assédio Moral e Sexual - Resultados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {results.criticalAlerts.length > 0 && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Alertas Críticos Detectados:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {results.criticalAlerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Índice Geral de Assédio</h3>
                <div className={`text-6xl font-bold ${results.overallColor} mb-2`}>
                  {results.overallIndex.toFixed(1)}
                </div>
                <div className={`text-xl font-semibold ${results.overallColor}`}>
                  {results.overallLevel}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(results.dimensionResults).map(([dimension, result]) => (
                  <Card key={dimension} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{dimension}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-2xl font-bold ${result.color}`}>
                            {result.score.toFixed(1)}
                          </div>
                          <div className={`text-sm font-medium ${result.color}`}>
                            {result.level}
                          </div>
                        </div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.color.includes('red') ? 'bg-red-100' : result.color.includes('orange') ? 'bg-orange-100' : result.color.includes('yellow') ? 'bg-yellow-100' : result.color.includes('blue') ? 'bg-blue-100' : 'bg-green-100'}`}>
                          <Shield className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Nova Seção: Análise Detalhada sobre Percepção de Assédio Moral e Sexual */}
              <Card className="mt-8 border-l-4 border-l-red-600">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="text-xl font-bold text-red-800 flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Análise Detalhada: Percepção de Assédio Moral e Sexual
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Introdução */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800 mb-2">Contextualização Científica</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      O assédio moral e sexual no ambiente de trabalho representa uma das principais causas de sofrimento psíquico ocupacional, 
                      impactando diretamente a saúde mental, produtividade e clima organizacional. Segundo estudos da Organização Internacional 
                      do Trabalho (OIT, 2019), aproximadamente 23% dos trabalhadores relatam ter sofrido algum tipo de assédio no trabalho, 
                      sendo que 60% dos casos não são reportados formalmente.
                    </p>
                  </div>

                  {/* Análise dos Resultados */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                      Análise dos Seus Resultados
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {results.overallIndex >= 4.0 ? (
                        <div className="text-red-700">
                          <p className="font-medium mb-2">Situação Crítica Identificada</p>
                          <p className="text-sm leading-relaxed">
                            Seus resultados indicam uma percepção elevada de assédio moral e/ou sexual no ambiente de trabalho 
                            (índice {results.overallIndex.toFixed(1)}/5.0). Esta situação demanda atenção imediata e intervenção 
                            profissional especializada. Estudos de Hirigoyen (2015) demonstram que a exposição prolongada a 
                            comportamentos hostis pode resultar em transtornos de ansiedade, depressão e síndrome de burnout.
                          </p>
                        </div>
                      ) : results.overallIndex >= 3.0 ? (
                        <div className="text-orange-700">
                          <p className="font-medium mb-2">Situação de Risco Moderado</p>
                          <p className="text-sm leading-relaxed">
                            Seus resultados sugerem a presença de fatores de risco para assédio no ambiente laboral 
                            (índice {results.overallIndex.toFixed(1)}/5.0). Embora não configure uma situação crítica, 
                            é importante implementar medidas preventivas e de monitoramento. Pesquisas de Einarsen et al. (2020) 
                            indicam que a intervenção precoce é fundamental para prevenir a escalada de comportamentos hostis.
                          </p>
                        </div>
                      ) : results.overallIndex >= 2.0 ? (
                        <div className="text-yellow-700">
                          <p className="font-medium mb-2">Ambiente com Potencial de Melhoria</p>
                          <p className="text-sm leading-relaxed">
                            Seus resultados indicam um ambiente com baixa percepção de assédio 
                            (índice {results.overallIndex.toFixed(1)}/5.0), mas ainda há espaço para fortalecimento das 
                            políticas de prevenção e promoção de um clima organizacional mais saudável. A literatura 
                            científica enfatiza a importância da prevenção primária (Zapf & Einarsen, 2011).
                          </p>
                        </div>
                      ) : (
                        <div className="text-green-700">
                          <p className="font-medium mb-2">Ambiente Seguro e Protegido</p>
                          <p className="text-sm leading-relaxed">
                            Seus resultados indicam uma percepção muito baixa de assédio no ambiente de trabalho 
                            (índice {results.overallIndex.toFixed(1)}/5.0), sugerindo um ambiente organizacional saudável 
                            e seguro. Mantenha as práticas preventivas e continue monitorando o clima organizacional 
                            para preservar este ambiente positivo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recomendações Profissionais */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Recomendações Profissionais Baseadas nos Resultados
                    </h4>
                    <div className="space-y-3">
                      {results.overallIndex >= 4.0 && (
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <h5 className="font-medium text-red-800 mb-2">Intervenção Imediata Necessária</h5>
                          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Busque apoio psicológico especializado imediatamente</li>
                            <li>Documente todos os incidentes com detalhes (data, hora, testemunhas)</li>
                            <li>Reporte formalmente à área de Recursos Humanos ou ouvidoria</li>
                            <li>Considere apoio jurídico especializado em direito trabalhista</li>
                            <li>Mantenha rede de apoio social e familiar ativa</li>
                          </ul>
                        </div>
                      )}
                      
                      {results.overallIndex >= 3.0 && results.overallIndex < 4.0 && (
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                          <h5 className="font-medium text-orange-800 mb-2">Medidas Preventivas e de Monitoramento</h5>
                          <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                            <li>Procure orientação psicológica para desenvolvimento de estratégias de enfrentamento</li>
                            <li>Mantenha registro de situações que causam desconforto</li>
                            <li>Fortaleça relacionamentos positivos no ambiente de trabalho</li>
                            <li>Participe de treinamentos sobre direitos trabalhistas</li>
                            <li>Estabeleça limites claros nas relações profissionais</li>
                          </ul>
                        </div>
                      )}
                      
                      {results.overallIndex >= 2.0 && results.overallIndex < 3.0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                          <h5 className="font-medium text-yellow-800 mb-2">Fortalecimento do Ambiente Organizacional</h5>
                          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Participe ativamente de programas de bem-estar organizacional</li>
                            <li>Contribua para a construção de um clima organizacional positivo</li>
                            <li>Mantenha-se informado sobre políticas de prevenção ao assédio</li>
                            <li>Desenvolva habilidades de comunicação assertiva</li>
                            <li>Promova práticas de respeito mútuo na equipe</li>
                          </ul>
                        </div>
                      )}
                      
                      {results.overallIndex < 2.0 && (
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h5 className="font-medium text-green-800 mb-2">Manutenção do Ambiente Saudável</h5>
                          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                            <li>Continue promovendo práticas de respeito e inclusão</li>
                            <li>Seja um agente multiplicador de boas práticas organizacionais</li>
                            <li>Mantenha-se vigilante para identificar situações de risco</li>
                            <li>Apoie colegas que possam estar em situação de vulnerabilidade</li>
                            <li>Participe de iniciativas de melhoria do clima organizacional</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Considerações Finais sobre Gestão do Estresse Ocupacional */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-purple-600" />
                      Considerações Finais: Gestão do Estresse Ocupacional
                    </h4>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        O assédio moral e sexual no trabalho está intrinsecamente relacionado ao desenvolvimento de estresse ocupacional 
                        crônico. Segundo o modelo de Karasek e Theorell (1990), a combinação de alta demanda psicológica com baixo 
                        controle sobre o trabalho, agravada por relações sociais hostis, constitui o cenário mais prejudicial à 
                        saúde mental do trabalhador.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Estratégias de Enfrentamento Individual</h5>
                          <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
                            <li>Técnicas de relaxamento e mindfulness</li>
                            <li>Atividade física regular</li>
                            <li>Manutenção de hobbies e atividades prazerosas</li>
                            <li>Sono adequado (7-9 horas por noite)</li>
                            <li>Alimentação equilibrada</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Intervenções Organizacionais Necessárias</h5>
                          <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
                            <li>Políticas claras de prevenção ao assédio</li>
                            <li>Canais seguros de denúncia</li>
                            <li>Treinamentos regulares sobre respeito no trabalho</li>
                            <li>Programas de apoio psicológico</li>
                            <li>Monitoramento do clima organizacional</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Referências Científicas */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Referências Científicas</h5>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Einarsen, S., Hoel, H., Zapf, D., & Cooper, C. L. (2020). <em>Bullying and harassment in the workplace</em>. CRC Press.</p>
                      <p>• Hirigoyen, M. F. (2015). <em>Assédio moral: a violência perversa no cotidiano</em>. Bertrand Brasil.</p>
                      <p>• Karasek, R., & Theorell, T. (1990). <em>Healthy work: stress, productivity, and the reconstruction of working life</em>. Basic Books.</p>
                      <p>• Organização Internacional do Trabalho. (2019). <em>Violence and harassment in the world of work</em>. ILO Publications.</p>
                      <p>• Zapf, D., & Einarsen, S. (2011). Individual antecedents of bullying. <em>Bullying and harassment in the workplace</em>, 177-200.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-center gap-4">
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Teste
                </Button>
                <Button 
                  onClick={() => router.push('/colaborador/resultados?saved=1')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ver Todos os Resultados
                </Button>
                <Button 
                  onClick={() => router.push('/colaborador/psicossociais')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo circular */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">HumaniQ PAS</h1>
              <p className="text-sm text-purple-100">Percepção de Assédio Moral e Sexual</p>
            </div>
          </div>
          
          {/* Contador de questões */}
          <div className="text-right">
            <div className="text-sm text-purple-100">Questão</div>
            <div className="text-2xl font-bold">
              {currentQuestion + 1}/{questions.length}
            </div>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Categoria da pergunta */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-600">
            {currentQ?.dimension}
          </h3>
        </div>

        {/* Pergunta */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
            {currentQ?.text}
          </h2>
        </div>
        
        {/* Labels da escala */}
        <div className="flex justify-between mb-4 px-2">
          <span className="text-sm font-medium text-red-500">Discordo</span>
          <span className="text-sm font-medium text-yellow-500">Neutro</span>
          <span className="text-sm font-medium text-green-500">Concordo</span>
        </div>
        
        {/* Barra colorida */}
        <div className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full mb-8"></div>
        
        {/* Escala Likert com botões quadrados coloridos */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((value) => {
            const colors = {
              1: 'bg-red-300 hover:bg-red-400 border-red-400',
              2: 'bg-orange-300 hover:bg-orange-400 border-orange-400', 
              3: 'bg-yellow-300 hover:bg-yellow-400 border-yellow-400',
              4: 'bg-green-300 hover:bg-green-400 border-green-400',
              5: 'bg-green-500 hover:bg-green-600 border-green-600'
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
                  onClick={() => {
                    handleAnswer(value)
                    setTimeout(() => {
                      if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1)
                      } else {
                        completeTest({...answers, [currentQ.id]: value})
                      }
                    }, 600)
                  }}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-white font-bold text-xl transition-all duration-200 transform hover:scale-105 ${
                    currentAnswer === value 
                      ? `${colors[value as keyof typeof colors]} ring-4 ring-purple-300 scale-105` 
                      : colors[value as keyof typeof colors]
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
        
        {/* Texto de instrução */}
        <div className="text-center mb-8">
          <p className="text-gray-500">
            {currentAnswer ? 'Continuando automaticamente...' : 'Selecione uma resposta para continuar'}
          </p>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 px-6 py-2 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={goToNext}
            disabled={!currentAnswer || currentQuestion === questions.length - 1}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 disabled:opacity-50"
          >
            Próxima
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}