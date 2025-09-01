'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Shield, Printer, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  dimension: string
  isReversed?: boolean
}

interface Answer {
  questionId: number
  value: number
}

interface DimensionResult {
  dimension: string
  score: number
  level: string
  color: string
  description: string
}

const questions: Question[] = [
  // Satisfação com a Função (10 perguntas)
  { id: 1, text: "Sinto-me valorizado(a) pelo trabalho que realizo.", dimension: "Satisfação com a Função" },
  { id: 2, text: "Tenho clareza sobre minhas responsabilidades.", dimension: "Satisfação com a Função" },
  { id: 3, text: "Meu trabalho tem propósito e impacto claro.", dimension: "Satisfação com a Função" },
  { id: 4, text: "As atividades que desempenho estão alinhadas às minhas competências.", dimension: "Satisfação com a Função" },
  { id: 5, text: "Tenho autonomia suficiente para realizar meu trabalho.", dimension: "Satisfação com a Função" },
  { id: 6, text: "Meu trabalho me proporciona oportunidades de crescimento.", dimension: "Satisfação com a Função" },
  { id: 7, text: "Estou satisfeito(a) com o nível de desafio das minhas tarefas.", dimension: "Satisfação com a Função" },
  { id: 8, text: "Meus esforços são reconhecidos pela equipe.", dimension: "Satisfação com a Função" },
  { id: 9, text: "Tenho a chance de contribuir com ideias e melhorias.", dimension: "Satisfação com a Função" },
  { id: 10, text: "Sinto orgulho da função que exerço.", dimension: "Satisfação com a Função" },

  // Relação com Liderança (10 perguntas)
  { id: 11, text: "Minha liderança me trata com respeito e justiça.", dimension: "Relação com Liderança" },
  { id: 12, text: "Consigo dialogar abertamente com minha chefia.", dimension: "Relação com Liderança" },
  { id: 13, text: "A liderança demonstra interesse pelo bem-estar da equipe.", dimension: "Relação com Liderança" },
  { id: 14, text: "Recebo feedbacks construtivos com regularidade.", dimension: "Relação com Liderança" },
  { id: 15, text: "Minhas conquistas são reconhecidas pela chefia.", dimension: "Relação com Liderança" },
  { id: 16, text: "A liderança estimula o desenvolvimento dos colaboradores.", dimension: "Relação com Liderança" },
  { id: 17, text: "Sinto-me apoiado(a) quando tenho dificuldades.", dimension: "Relação com Liderança" },
  { id: 18, text: "A chefia é acessível e aberta a sugestões.", dimension: "Relação com Liderança" },
  { id: 19, text: "A liderança age com imparcialidade em conflitos.", dimension: "Relação com Liderança" },
  { id: 20, text: "Há coerência entre o discurso e as atitudes da chefia.", dimension: "Relação com Liderança" },

  // Estrutura e Condições de Trabalho (10 perguntas)
  { id: 21, text: "Tenho acesso aos recursos necessários para meu trabalho.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 22, text: "O ambiente físico de trabalho é adequado e seguro.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 23, text: "As ferramentas tecnológicas atendem às minhas necessidades.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 24, text: "Os processos internos são bem definidos e eficientes.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 25, text: "Recebo treinamentos suficientes para exercer minha função.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 26, text: "A empresa respeita as normas de ergonomia.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 27, text: "O ambiente é limpo, organizado e agradável.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 28, text: "As pausas são respeitadas ao longo da jornada.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 29, text: "A comunicação interna é clara e eficaz.", dimension: "Estrutura e Condições de Trabalho" },
  { id: 30, text: "A empresa investe na melhoria das condições de trabalho.", dimension: "Estrutura e Condições de Trabalho" },

  // Recompensas e Remuneração (10 perguntas)
  { id: 31, text: "Sinto-me justamente remunerado(a) pelo meu trabalho.", dimension: "Recompensas e Remuneração" },
  { id: 32, text: "Os benefícios oferecidos atendem minhas necessidades.", dimension: "Recompensas e Remuneração" },
  { id: 33, text: "A política de promoções é clara e justa.", dimension: "Recompensas e Remuneração" },
  { id: 34, text: "Existe reconhecimento não-financeiro (elogios, prêmios, etc).", dimension: "Recompensas e Remuneração" },
  { id: 35, text: "Tenho acesso a programas de desenvolvimento pessoal.", dimension: "Recompensas e Remuneração" },
  { id: 36, text: "A remuneração está alinhada com o mercado.", dimension: "Recompensas e Remuneração" },
  { id: 37, text: "Me sinto motivado(a) pelos incentivos que recebo.", dimension: "Recompensas e Remuneração" },
  { id: 38, text: "Há possibilidade de crescimento salarial ao longo do tempo.", dimension: "Recompensas e Remuneração" },
  { id: 39, text: "Sinto que sou recompensado(a) pelo meu desempenho.", dimension: "Recompensas e Remuneração" },
  { id: 40, text: "A empresa valoriza talentos internos.", dimension: "Recompensas e Remuneração" },

  // Equilíbrio Vida-Trabalho (10 perguntas)
  { id: 41, text: "Consigo conciliar bem trabalho e vida pessoal.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 42, text: "A carga de trabalho é compatível com minha capacidade.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 43, text: "Tenho tempo suficiente para atividades fora do trabalho.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 44, text: "A empresa respeita meu tempo pessoal.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 45, text: "Meus horários são respeitados pela liderança.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 46, text: "Tenho flexibilidade para lidar com questões pessoais urgentes.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 47, text: "Não levo preocupações de trabalho para casa com frequência.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 48, text: "Sinto que posso descansar adequadamente fora do expediente.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 49, text: "A empresa incentiva práticas de bem-estar.", dimension: "Equilíbrio Vida-Trabalho" },
  { id: 50, text: "Meu trabalho contribui para minha qualidade de vida.", dimension: "Equilíbrio Vida-Trabalho" }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniqQVTTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<DimensionResult[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // CSS para animações
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .question-transition {
        transition: all 0.3s ease-in-out;
      }
      .question-enter {
        opacity: 0;
        transform: translateX(20px);
      }
      .question-exit {
        opacity: 0;
        transform: translateX(-20px);
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  const handleAnswer = (value: number) => {
    const newAnswers = answers.filter(a => a.questionId !== questions[currentQuestion].id)
    newAnswers.push({ questionId: questions[currentQuestion].id, value })
    setAnswers(newAnswers)
  }

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === questions[currentQuestion].id)?.value
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completeTest = async (finalAnswers: Answer[]) => {
    // Calcular resultados por dimensão
    const dimensions = ['Satisfação com a Função', 'Relação com Liderança', 'Estrutura e Condições de Trabalho', 'Recompensas e Remuneração', 'Equilíbrio Vida-Trabalho']
    const dimensionResults: DimensionResult[] = []
    let totalScore = 0

    dimensions.forEach(dimension => {
      const dimensionQuestions = questions.filter(q => q.dimension === dimension)
      const dimensionAnswers = finalAnswers.filter(a => 
        dimensionQuestions.some(q => q.id === a.questionId)
      )
      
      const dimensionScore = dimensionAnswers.reduce((sum, answer) => {
        const question = dimensionQuestions.find(q => q.id === answer.questionId)
        // Aplicar inversão se necessário (algumas perguntas podem ser negativas)
        const score = question?.isReversed ? (6 - answer.value) : answer.value
        return sum + score
      }, 0) / dimensionAnswers.length

      totalScore += dimensionScore

      // Classificação por nível
      let level = ''
      let color = ''
      let description = ''
      
      if (dimensionScore >= 4.5) {
        level = 'Excelente'
        color = 'text-green-600'
        description = 'Nível muito alto de satisfação'
      } else if (dimensionScore >= 3.5) {
        level = 'Bom'
        color = 'text-blue-600'
        description = 'Nível bom de satisfação'
      } else if (dimensionScore >= 2.5) {
        level = 'Regular'
        color = 'text-yellow-600'
        description = 'Nível moderado de satisfação'
      } else if (dimensionScore >= 1.5) {
        level = 'Baixo'
        color = 'text-orange-600'
        description = 'Nível baixo de satisfação'
      } else {
        level = 'Crítico'
        color = 'text-red-600'
        description = 'Nível crítico - requer atenção imediata'
      }

      dimensionResults.push({
        dimension,
        score: dimensionScore,
        level,
        color,
        description
      })
    })

    const overallQVTScore = totalScore / dimensions.length
    setOverallScore(overallQVTScore)
    setResults(dimensionResults)

    // Submeter para API
    try {
      await fetch('/api/colaborador/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'HUMANIQ_QVT',
          answers: finalAnswers,
          results: {
            overallScore: overallQVTScore,
            dimensions: dimensionResults
          }
        })
      })
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
    }

    setIsCompleted(true)
  }

  const getOverallLevel = (score: number) => {
    if (score >= 4.5) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 3.5) return { level: 'Bom', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 2.5) return { level: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 1.5) return { level: 'Baixo', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: 'Crítico', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = getCurrentAnswer()

  if (isCompleted) {
    const overallLevel = getOverallLevel(overallScore)
    const criticalDimensions = results.filter(r => r.score < 2.0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">HumaniQ QVT</h1>
            </div>
            <p className="text-gray-600">Resultados da Avaliação de Qualidade de Vida no Trabalho</p>
          </div>

          {/* Alerta para dimensões críticas */}
          {criticalDimensions.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Atenção:</strong> {criticalDimensions.length} dimensão(ões) em nível crítico detectada(s). 
                Recomenda-se ação imediata para: {criticalDimensions.map(d => d.dimension).join(', ')}.
              </AlertDescription>
            </Alert>
          )}

          {/* Índice Geral de QVT */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Índice Geral de QVT</CardTitle>
              <CardDescription>Média geral de todas as dimensões avaliadas</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${overallLevel.bgColor} mb-4`}>
                <span className="text-3xl font-bold text-gray-900">{overallScore.toFixed(1)}</span>
                <Badge className={`${overallLevel.color} bg-transparent border-current`}>
                  {overallLevel.level}
                </Badge>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Este índice representa sua satisfação geral com a qualidade de vida no trabalho, 
                considerando todas as dimensões avaliadas.
              </p>
            </CardContent>
          </Card>

          {/* Resultados por Dimensão */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{result.dimension}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{result.score.toFixed(1)}</span>
                    <Badge className={`${result.color} bg-transparent border-current`}>
                      {result.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.description}</p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(result.score / 5) * 100}%`,
                          backgroundColor: result.score >= 4.5 ? '#10b981' : 
                                         result.score >= 3.5 ? '#3b82f6' :
                                         result.score >= 2.5 ? '#f59e0b' :
                                         result.score >= 1.5 ? '#f97316' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Análise Detalhada: Qualidade de Vida no Trabalho */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="w-6 h-6 mr-2 text-blue-600" />
                Análise Detalhada: Qualidade de Vida no Trabalho
              </CardTitle>
              <CardDescription>
                Compreenda seus resultados e receba orientações profissionais personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contextualização Científica */}
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Contextualização Científica</h3>
                <p className="text-blue-700 leading-relaxed">
                  A Qualidade de Vida no Trabalho (QVT) é um conceito multidimensional que engloba aspectos físicos, 
                  psicológicos, sociais e organizacionais do ambiente laboral. Segundo Walton (1973) e posteriormente 
                  desenvolvido por diversos pesquisadores, a QVT refere-se ao grau de satisfação e bem-estar que os 
                  colaboradores experimentam em seu ambiente de trabalho, influenciando diretamente sua produtividade, 
                  engajamento e saúde mental.
                </p>
              </div>

              {/* Análise dos Resultados do Usuário */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Análise dos Seus Resultados</h3>
                
                {overallScore >= 4.5 ? (
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-semibold text-green-800 mb-2">Excelente Qualidade de Vida no Trabalho</h4>
                    <p className="text-green-700 mb-3">
                      Seus resultados indicam uma qualidade de vida no trabalho excepcional (Índice: {overallScore.toFixed(1)}). 
                      Você demonstra alta satisfação em múltiplas dimensões do ambiente laboral, o que está associado a 
                      maior bem-estar psicológico, produtividade e engajamento organizacional.
                    </p>
                    <p className="text-green-700">
                      <strong>Principais fortalezas identificadas:</strong> Ambiente de trabalho favorável, relações 
                      interpessoais saudáveis, equilíbrio adequado entre demandas e recursos, e alinhamento entre 
                      valores pessoais e organizacionais.
                    </p>
                  </div>
                ) : overallScore >= 3.5 ? (
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800 mb-2">Boa Qualidade de Vida no Trabalho</h4>
                    <p className="text-blue-700 mb-3">
                      Seus resultados demonstram uma qualidade de vida no trabalho satisfatória (Índice: {overallScore.toFixed(1)}). 
                      Você apresenta níveis adequados de bem-estar laboral, com algumas áreas que podem ser otimizadas 
                      para alcançar um estado de excelência.
                    </p>
                    <p className="text-blue-700">
                      <strong>Oportunidades de melhoria:</strong> Identifique as dimensões com menores pontuações e 
                      desenvolva estratégias específicas para aprimorar esses aspectos do seu ambiente de trabalho.
                    </p>
                  </div>
                ) : overallScore >= 2.5 ? (
                  <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-800 mb-2">Qualidade de Vida no Trabalho Regular</h4>
                    <p className="text-yellow-700 mb-3">
                      Seus resultados indicam uma qualidade de vida no trabalho moderada (Índice: {overallScore.toFixed(1)}). 
                      Existem aspectos positivos em seu ambiente laboral, mas também áreas significativas que requerem 
                      atenção e intervenção para prevenir o desenvolvimento de problemas mais sérios.
                    </p>
                    <p className="text-yellow-700">
                      <strong>Ação recomendada:</strong> Priorize melhorias nas dimensões com menores pontuações e 
                      considere buscar apoio organizacional ou profissional para desenvolver estratégias de enfrentamento.
                    </p>
                  </div>
                ) : overallScore >= 1.5 ? (
                  <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
                    <h4 className="font-semibold text-orange-800 mb-2">Qualidade de Vida no Trabalho Baixa</h4>
                    <p className="text-orange-700 mb-3">
                      Seus resultados revelam uma qualidade de vida no trabalho comprometida (Índice: {overallScore.toFixed(1)}). 
                      Esta situação pode estar impactando negativamente seu bem-estar físico e psicológico, requerendo 
                      intervenções imediatas e estruturadas.
                    </p>
                    <p className="text-orange-700">
                      <strong>Necessidade de intervenção:</strong> Recomenda-se buscar apoio profissional e organizacional 
                      para desenvolver um plano de ação abrangente visando a melhoria das condições de trabalho.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-semibold text-red-800 mb-2">Situação Crítica Identificada</h4>
                    <p className="text-red-700 mb-3">
                      Seus resultados indicam uma qualidade de vida no trabalho em nível crítico (Índice: {overallScore.toFixed(1)}). 
                      Esta situação representa um risco significativo para sua saúde física e mental, requerendo 
                      intervenção imediata e acompanhamento profissional especializado.
                    </p>
                    <p className="text-red-700">
                      <strong>Ação urgente necessária:</strong> Procure imediatamente apoio de profissionais de saúde 
                      ocupacional, recursos humanos ou psicólogos organizacionais para desenvolver estratégias de 
                      proteção e recuperação.
                    </p>
                  </div>
                )}
              </div>

              {/* Recomendações Profissionais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Recomendações Profissionais</h3>
                
                {overallScore >= 4.0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Estratégias de Manutenção e Otimização</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Mentoria e Liderança:</strong> Considere assumir papéis de mentoria para compartilhar suas experiências positivas com colegas</li>
                      <li>• <strong>Desenvolvimento Contínuo:</strong> Invista em capacitações que ampliem suas competências e satisfação profissional</li>
                      <li>• <strong>Advocacy Organizacional:</strong> Contribua para iniciativas que promovam a QVT em sua organização</li>
                      <li>• <strong>Equilíbrio Sustentável:</strong> Mantenha práticas de autocuidado para preservar seu bem-estar a longo prazo</li>
                    </ul>
                  </div>
                ) : overallScore >= 2.5 ? (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Estratégias de Melhoria Gradual</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Comunicação Assertiva:</strong> Desenvolva habilidades para expressar necessidades e preocupações de forma construtiva</li>
                      <li>• <strong>Gestão de Relacionamentos:</strong> Invista na construção de redes de apoio no ambiente de trabalho</li>
                      <li>• <strong>Organização Pessoal:</strong> Implemente técnicas de gestão do tempo e priorização de tarefas</li>
                      <li>• <strong>Busca por Feedback:</strong> Solicite regularmente feedback construtivo para identificar áreas de melhoria</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Estratégias de Intervenção Imediata</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Apoio Profissional:</strong> Busque orientação de psicólogos organizacionais ou coaches especializados</li>
                      <li>• <strong>Diálogo com Liderança:</strong> Agende conversas estruturadas com sua chefia sobre melhorias necessárias</li>
                      <li>• <strong>Recursos Organizacionais:</strong> Utilize programas de assistência ao colaborador disponíveis na empresa</li>
                      <li>• <strong>Planejamento de Carreira:</strong> Considere alternativas profissionais que melhor atendam suas necessidades</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Considerações Finais sobre Gestão do Estresse Ocupacional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Considerações Finais: Gestão do Estresse Ocupacional</h3>
                
                <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                  <h4 className="font-semibold text-indigo-800 mb-3">Estratégias Individuais de Enfrentamento</h4>
                  <p className="text-indigo-700 mb-3">
                    A gestão eficaz do estresse ocupacional requer uma abordagem multifacetada que combine técnicas 
                    individuais de enfrentamento com mudanças organizacionais. Baseado no modelo de Lazarus e Folkman (1984), 
                    as estratégias de coping podem ser focadas no problema ou na emoção.
                  </p>
                  <ul className="space-y-1 text-indigo-700">
                    <li>• <strong>Técnicas de Relaxamento:</strong> Mindfulness, respiração diafragmática e relaxamento muscular progressivo</li>
                    <li>• <strong>Atividade Física Regular:</strong> Exercícios aeróbicos e de resistência para redução do cortisol</li>
                    <li>• <strong>Gestão do Tempo:</strong> Técnicas de priorização e delegação para otimizar a carga de trabalho</li>
                    <li>• <strong>Suporte Social:</strong> Cultivo de relacionamentos positivos dentro e fora do ambiente de trabalho</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-3">Intervenções Organizacionais</h4>
                  <p className="text-purple-700 mb-3">
                    Segundo o modelo de Karasek e Theorell (1990), a qualidade de vida no trabalho é influenciada 
                    pela interação entre demandas psicológicas, controle sobre o trabalho e suporte social. 
                    Organizações eficazes implementam:
                  </p>
                  <ul className="space-y-1 text-purple-700">
                    <li>• <strong>Redesenho de Cargos:</strong> Aumento da autonomia e variedade de tarefas</li>
                    <li>• <strong>Programas de Bem-estar:</strong> Iniciativas de promoção da saúde física e mental</li>
                    <li>• <strong>Flexibilidade Organizacional:</strong> Horários flexíveis e modalidades de trabalho híbrido</li>
                    <li>• <strong>Cultura de Feedback:</strong> Sistemas estruturados de comunicação e reconhecimento</li>
                  </ul>
                </div>
              </div>

              {/* Referências Científicas */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Referências Científicas</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Walton, R. E. (1973). Quality of working life: what is it? <em>Sloan Management Review</em>, 15(1), 11-21.</p>
                  <p>• Karasek, R., & Theorell, T. (1990). <em>Healthy work: stress, productivity, and the reconstruction of working life</em>. Basic Books.</p>
                  <p>• Lazarus, R. S., & Folkman, S. (1984). <em>Stress, appraisal, and coping</em>. Springer Publishing Company.</p>
                  <p>• Hackman, J. R., & Oldham, G. R. (1976). Motivation through the design of work. <em>Organizational Behavior and Human Performance</em>, 16(2), 250-279.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 justify-center mt-8">
            <Button 
              onClick={() => router.push('/colaborador/psicossociais')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Testes
            </Button>
            <Button 
              onClick={() => window.print()}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul - replicando o print */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo e título à esquerda */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ QVT</h1>
                <p className="text-purple-100 text-sm">Avaliação de Qualidade de Vida no Trabalho</p>
              </div>
            </div>
            
            {/* Questão à direita */}
            <div className="text-right">
              <div className="text-xl font-bold">
                Questão {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo principal com fundo branco */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Categoria/Dimensão em roxo */}
        <div className="mb-6">
          <h2 className="text-purple-600 font-semibold text-lg mb-4">
            {questions[currentQuestion].dimension}
          </h2>
        </div>

        {/* Pergunta */}
        <div className="mb-8">
          <h3 className="text-xl text-gray-800 font-medium leading-relaxed text-center">
            {questions[currentQuestion].text}
          </h3>
        </div>
        
        {/* Escala Likert customizada para replicar o print */}
        <div className="mb-8">
          {/* Labels superiores */}
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-4">
            <span className="text-red-600">Discordo</span>
            <span className="text-yellow-600">Neutro</span>
            <span className="text-green-600">Concordo</span>
          </div>
          
          {/* Barra de gradiente */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 to-green-500 mb-8 shadow-sm"></div>
          
          {/* Botões da escala - grandes e coloridos como no print */}
          <div className="flex justify-center gap-8 mb-6">
            {[
              { value: 1, color: 'bg-red-400 hover:bg-red-500 text-white', label: 'Discordo totalmente' },
              { value: 2, color: 'bg-orange-400 hover:bg-orange-500 text-white', label: 'Discordo' },
              { value: 3, color: 'bg-yellow-400 hover:bg-yellow-500 text-white', label: 'Neutro' },
              { value: 4, color: 'bg-green-400 hover:bg-green-500 text-white', label: 'Concordo' },
              { value: 5, color: 'bg-green-500 hover:bg-green-600 text-white', label: 'Concordo totalmente' }
            ].map((option) => {
              const isSelected = getCurrentAnswer() === option.value
              
              return (
                <div key={option.value} className="flex flex-col items-center space-y-3">
                  <button
                     type="button"
                     onClick={() => {
                       handleAnswer(option.value)
                       // Navegação automática com delay de 800ms
                       setTimeout(() => {
                         if (currentQuestion < questions.length - 1) {
                           setCurrentQuestion(prev => prev + 1)
                         } else {
                           completeTest([...answers.filter(a => a.questionId !== questions[currentQuestion].id), { questionId: questions[currentQuestion].id, value: option.value }])
                         }
                       }, 800)
                     }}
                     className={`w-20 h-20 rounded-lg font-bold text-2xl transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-lg ${
                       isSelected 
                         ? `${option.color} ring-4 ring-offset-2 ring-purple-300 scale-110` 
                         : option.color
                     }`}
                   >
                     {option.value}
                   </button>
                  
                  <span className="text-xs text-gray-600 text-center font-medium max-w-20 leading-tight">
                    {option.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Texto de instrução */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            {getCurrentAnswer() ? 'Avançando automaticamente...' : 'Selecione uma resposta para continuar'}
          </p>
        </div>

        {/* Navegação inferior */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 disabled:opacity-50 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length - 1 || !getCurrentAnswer()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 disabled:opacity-50"
          >
            Próxima
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}