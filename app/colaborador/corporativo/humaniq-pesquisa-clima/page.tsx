'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BarChart3, Brain, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Question {
  id: number
  text: string
  dimension: string
  isReversed?: boolean
}

interface DimensionResult {
  name: string
  score: number
  interpretation: string
  color: string
}

const questions: Question[] = [
  // Segurança Psicológica (5 perguntas)
  { id: 1, text: "Sinto-me à vontade para expressar minhas opiniões, mesmo quando discordo da maioria.", dimension: "Segurança Psicológica" },
  { id: 2, text: "Posso admitir erros sem medo de ser penalizado ou julgado negativamente.", dimension: "Segurança Psicológica" },
  { id: 3, text: "É seguro fazer perguntas ou pedir ajuda quando não sei algo.", dimension: "Segurança Psicológica" },
  { id: 4, text: "Minha equipe aceita bem ideias diferentes e inovadoras.", dimension: "Segurança Psicológica" },
  { id: 5, text: "Não tenho medo de ser ridicularizado ao propor soluções criativas.", dimension: "Segurança Psicológica" },

  // Comunicação & Transparência (5 perguntas)
  { id: 6, text: "As informações importantes chegam até mim de forma clara e no tempo adequado.", dimension: "Comunicação & Transparência" },
  { id: 7, text: "Minha liderança é transparente sobre decisões que afetam meu trabalho.", dimension: "Comunicação & Transparência" },
  { id: 8, text: "Existe comunicação aberta entre diferentes níveis hierárquicos.", dimension: "Comunicação & Transparência" },
  { id: 9, text: "Sinto que posso me comunicar facilmente com meus colegas e superiores.", dimension: "Comunicação & Transparência" },
  { id: 10, text: "As mudanças organizacionais são comunicadas de forma adequada.", dimension: "Comunicação & Transparência" },

  // Reconhecimento & Feedback (5 perguntas)
  { id: 11, text: "Recebo reconhecimento adequado pelo meu trabalho e contribuições.", dimension: "Reconhecimento & Feedback" },
  { id: 12, text: "Meu superior me dá feedback construtivo regularmente.", dimension: "Reconhecimento & Feedback" },
  { id: 13, text: "Sinto que meus esforços são valorizados pela organização.", dimension: "Reconhecimento & Feedback" },
  { id: 14, text: "Recebo feedback específico sobre meu desempenho, não apenas genérico.", dimension: "Reconhecimento & Feedback" },
  { id: 15, text: "Existe um sistema justo de reconhecimento e recompensas.", dimension: "Reconhecimento & Feedback" },

  // Desenvolvimento & Aprendizagem (5 perguntas)
  { id: 16, text: "Tenho oportunidades claras de crescimento profissional na organização.", dimension: "Desenvolvimento & Aprendizagem" },
  { id: 17, text: "A empresa investe no meu desenvolvimento e capacitação.", dimension: "Desenvolvimento & Aprendizagem" },
  { id: 18, text: "Posso aprender coisas novas e desenvolver novas habilidades no meu trabalho.", dimension: "Desenvolvimento & Aprendizagem" },
  { id: 19, text: "Minha liderança me apoia em meus objetivos de desenvolvimento.", dimension: "Desenvolvimento & Aprendizagem" },
  { id: 20, text: "Sinto que meu crescimento profissional está estagnado nesta organização.", dimension: "Desenvolvimento & Aprendizagem", isReversed: true },

  // Recursos & Suporte (5 perguntas)
  { id: 21, text: "Tenho acesso às ferramentas e recursos necessários para fazer meu trabalho bem feito.", dimension: "Recursos & Suporte" },
  { id: 22, text: "Recebo o suporte técnico adequado quando preciso.", dimension: "Recursos & Suporte" },
  { id: 23, text: "As informações que preciso para trabalhar estão facilmente disponíveis.", dimension: "Recursos & Suporte" },
  { id: 24, text: "Minha equipe tem os recursos financeiros necessários para atingir nossos objetivos.", dimension: "Recursos & Suporte" },
  { id: 25, text: "Posso contar com apoio administrativo quando necessário.", dimension: "Recursos & Suporte" },

  // Carga de Trabalho (5 perguntas)
  { id: 26, text: "Minha carga de trabalho é realista e gerenciável.", dimension: "Carga de Trabalho" },
  { id: 27, text: "Os prazos estabelecidos para minhas tarefas são razoáveis.", dimension: "Carga de Trabalho" },
  { id: 28, text: "Consigo manter um equilíbrio saudável entre trabalho e vida pessoal.", dimension: "Carga de Trabalho" },
  { id: 29, text: "Não me sinto constantemente sobrecarregado com demandas excessivas.", dimension: "Carga de Trabalho" },
  { id: 30, text: "Tenho tempo suficiente para fazer meu trabalho com qualidade.", dimension: "Carga de Trabalho" },

  // Autonomia & Controle (5 perguntas)
  { id: 31, text: "Tenho liberdade para decidir como realizar minhas tarefas.", dimension: "Autonomia & Controle" },
  { id: 32, text: "Posso influenciar decisões que afetam meu trabalho.", dimension: "Autonomia & Controle" },
  { id: 33, text: "Tenho controle sobre meu ritmo de trabalho.", dimension: "Autonomia & Controle" },
  { id: 34, text: "Sou encorajado a tomar iniciativas e ser proativo.", dimension: "Autonomia & Controle" },
  { id: 35, text: "Posso organizar meu trabalho da forma que considero mais eficiente.", dimension: "Autonomia & Controle" },

  // Colaboração & Relacionamentos (5 perguntas)
  { id: 36, text: "Existe um bom espírito de equipe no meu ambiente de trabalho.", dimension: "Colaboração & Relacionamentos" },
  { id: 37, text: "Meus colegas são colaborativos e dispostos a ajudar.", dimension: "Colaboração & Relacionamentos" },
  { id: 38, text: "Trabalho bem em equipe e me sinto integrado ao grupo.", dimension: "Colaboração & Relacionamentos" },
  { id: 39, text: "Existe respeito mútuo entre os membros da equipe.", dimension: "Colaboração & Relacionamentos" },
  { id: 40, text: "Conflitos são resolvidos de forma construtiva na minha equipe.", dimension: "Colaboração & Relacionamentos" },

  // Propósito & Orgulho (5 perguntas)
  { id: 41, text: "Sinto orgulho de trabalhar nesta organização.", dimension: "Propósito & Orgulho" },
  { id: 42, text: "Meu trabalho tem significado e propósito para mim.", dimension: "Propósito & Orgulho" },
  { id: 43, text: "Acredito na missão e valores da organização.", dimension: "Propósito & Orgulho" },
  { id: 44, text: "Sinto que meu trabalho faz diferença e contribui para algo maior.", dimension: "Propósito & Orgulho" },
  { id: 45, text: "Recomendaria esta organização como um bom lugar para trabalhar.", dimension: "Propósito & Orgulho" },

  // Justiça & Ética (5 perguntas)
  { id: 46, text: "As decisões na organização são tomadas de forma justa e imparcial.", dimension: "Justiça & Ética" },
  { id: 47, text: "Existe igualdade de oportunidades para todos os funcionários.", dimension: "Justiça & Ética" },
  { id: 48, text: "A organização age de acordo com princípios éticos claros.", dimension: "Justiça & Ética" },
  { id: 49, text: "Sinto que sou tratado com justiça e respeito.", dimension: "Justiça & Ética" },
  { id: 50, text: "Os processos de avaliação e promoção são transparentes e justos.", dimension: "Justiça & Ética" },

  // Confiança na Liderança (5 perguntas)
  { id: 51, text: "Confio na competência e integridade da minha liderança imediata.", dimension: "Confiança na Liderança" },
  { id: 52, text: "Minha liderança demonstra coerência entre o que fala e o que faz.", dimension: "Confiança na Liderança" },
  { id: 53, text: "Sinto que posso contar com o apoio do meu superior quando preciso.", dimension: "Confiança na Liderança" },
  { id: 54, text: "Minha liderança toma decisões pensando no bem da equipe.", dimension: "Confiança na Liderança" },
  { id: 55, text: "Acredito que minha liderança tem a visão e direção certas para a equipe.", dimension: "Confiança na Liderança" },

  // Bem-estar & Qualidade de Vida (5 perguntas)
  { id: 56, text: "Meu trabalho não afeta negativamente minha saúde física ou mental.", dimension: "Bem-estar & Qualidade de Vida" },
  { id: 57, text: "A organização se preocupa com o bem-estar dos funcionários.", dimension: "Bem-estar & Qualidade de Vida" },
  { id: 58, text: "Tenho flexibilidade para atender necessidades pessoais quando necessário.", dimension: "Bem-estar & Qualidade de Vida" },
  { id: 59, text: "O ambiente físico de trabalho é adequado e confortável.", dimension: "Bem-estar & Qualidade de Vida" },
  { id: 60, text: "Sinto-me energizado e motivado na maior parte dos dias de trabalho.", dimension: "Bem-estar & Qualidade de Vida" }
]

const likertOptions = [
  { value: 1, label: "Discordo Totalmente" },
  { value: 2, label: "Discordo" },
  { value: 3, label: "Neutro" },
  { value: 4, label: "Concordo" },
  { value: 5, label: "Concordo Totalmente" }
]

const dimensionColors = {
  "Segurança Psicológica": "from-blue-500 to-cyan-500",
  "Comunicação & Transparência": "from-green-500 to-emerald-500",
  "Reconhecimento & Feedback": "from-yellow-500 to-orange-500",
  "Desenvolvimento & Aprendizagem": "from-purple-500 to-pink-500",
  "Recursos & Suporte": "from-indigo-500 to-blue-500",
  "Carga de Trabalho": "from-red-500 to-pink-500",
  "Autonomia & Controle": "from-teal-500 to-green-500",
  "Colaboração & Relacionamentos": "from-cyan-500 to-blue-500",
  "Propósito & Orgulho": "from-rose-500 to-red-500",
  "Justiça & Ética": "from-amber-500 to-yellow-500",
  "Confiança na Liderança": "from-emerald-500 to-teal-500",
  "Bem-estar & Qualidade de Vida": "from-violet-500 to-purple-500"
}

export default function HumaniqPesquisaClima() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<DimensionResult[]>([])
  const [globalScore, setGlobalScore] = useState(0)
  const [startTime] = useState(Date.now())

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }))
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      setTimeout(() => {
        calculateResults()
      }, 300)
    }
  }

  const calculateResults = () => {
    const dimensionScores: Record<string, number[]> = {}
    
    // Agrupar respostas por dimensão
    questions.forEach(question => {
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = []
      }
      
      let score = answers[question.id] || 3
      
      // Aplicar inversão para o item 20 (pergunta sobre estagnação)
      if (question.isReversed) {
        score = 6 - score
      }
      
      dimensionScores[question.dimension].push(score)
    })

    // Calcular escores por dimensão
    const dimensionResults: DimensionResult[] = []
    let totalScore = 0

    Object.entries(dimensionScores).forEach(([dimension, scores]) => {
      // Média simples dos itens válidos (1-5)
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      
      // Reescalar para 0-100: (Média - 1) / 4 × 100
      const scaledScore = ((average - 1) / 4) * 100
      
      // Interpretação do escore
      let interpretation = ""
      let color = ""
      
      if (scaledScore >= 85) {
        interpretation = "Excelente"
        color = "from-green-500 to-emerald-600"
      } else if (scaledScore >= 70) {
        interpretation = "Sólido"
        color = "from-blue-500 to-cyan-600"
      } else if (scaledScore >= 55) {
        interpretation = "Atenção"
        color = "from-yellow-500 to-orange-600"
      } else {
        interpretation = "Crítico"
        color = "from-red-500 to-rose-600"
      }

      dimensionResults.push({
        name: dimension,
        score: Math.round(scaledScore),
        interpretation,
        color
      })

      totalScore += scaledScore
    })

    // Índice Global de Clima (IGC) - média dos 12 índices dimensionais
    const igc = Math.round(totalScore / dimensionResults.length)

    setResults(dimensionResults)
    setGlobalScore(igc)
    setShowResults(true)

    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000 / 60)
    
    toast.success(`Teste concluído em ${duration} minutos!`)
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const getGlobalInterpretation = (score: number) => {
    if (score >= 85) return { level: "Excelente", color: "from-green-500 to-emerald-600", description: "Manter práticas; compartilhar cases internos." }
    if (score >= 70) return { level: "Sólido", color: "from-blue-500 to-cyan-600", description: "Melhorar pontos específicos; planos táticos." }
    if (score >= 55) return { level: "Atenção", color: "from-yellow-500 to-orange-600", description: "Intervir com planos de 90 dias; revisar processos." }
    return { level: "Crítico", color: "from-red-500 to-rose-600", description: "Ação imediata; patrocínio executivo; acompanhamento quinzenal." }
  }

  if (showResults) {
    const globalInterpretation = getGlobalInterpretation(globalScore)
    const topDimensions = [...results].sort((a, b) => b.score - a.score).slice(0, 3)
    const bottomDimensions = [...results].sort((a, b) => a.score - b.score).slice(0, 3)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Resultados - HumaniQ Pesquisa de Clima</h1>
            <p className="text-gray-300">Seu perfil de clima organizacional e bem-estar psicológico</p>
          </motion.div>

          {/* IGC Global */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Índice Global de Clima (IGC)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${globalInterpretation.color} mb-4`}>
                  <span className="text-4xl font-bold text-white">{globalScore}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{globalInterpretation.level}</h3>
                <p className="text-gray-300">{globalInterpretation.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 3 e Bottom 3 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-green-400">Top 3 Dimensões (Forças)</CardTitle>
                </CardHeader>
                <CardContent>
                  {topDimensions.map((dim, index) => (
                    <div key={dim.name} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                      <span className="text-sm">{dim.name}</span>
                      <Badge className={`bg-gradient-to-r ${dim.color} text-white`}>
                        {dim.score}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-red-400">Bottom 3 Dimensões (Oportunidades)</CardTitle>
                </CardHeader>
                <CardContent>
                  {bottomDimensions.map((dim, index) => (
                    <div key={dim.name} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                      <span className="text-sm">{dim.name}</span>
                      <Badge className={`bg-gradient-to-r ${dim.color} text-white`}>
                        {dim.score}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Todas as Dimensões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Detalhamento por Dimensão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{result.name}</h4>
                        <Badge className={`bg-gradient-to-r ${result.color} text-white`}>
                          {result.score}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={result.score} className="flex-1" />
                        <span className="text-xs text-gray-400">{result.interpretation}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Botões de Ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Button
              onClick={() => router.push('/colaborador/corporativo')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Voltar aos Testes
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Imprimir Resultados
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">HumaniQ Pesquisa de Clima</h1>
          <p className="text-gray-300 mb-4">Clima Organizacional e Bem-Estar Psicológico</p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              <Clock className="w-4 h-4 mr-2" />
              12-15 min
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              <Users className="w-4 h-4 mr-2" />
              {currentQuestion + 1}/{questions.length}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              <Target className="w-4 h-4 mr-2" />
              {currentQ.dimension}
            </Badge>
          </div>

          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`bg-gradient-to-r ${dimensionColors[currentQ.dimension as keyof typeof dimensionColors]} text-white`}>
                  {currentQ.dimension}
                </Badge>
                <span className="text-sm text-gray-400">Pergunta {currentQ.id}/60</span>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQ.text}
                {currentQ.isReversed && (
                  <Badge variant="outline" className="ml-2 text-xs border-yellow-500 text-yellow-400">
                    Invertida
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {likertOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      answers[currentQ.id] === option.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === option.value
                          ? 'border-white bg-white'
                          : 'border-gray-400'
                      }`}>
                        {answers[currentQ.id] === option.value && (
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center mt-8 max-w-4xl mx-auto"
        >
          <Button
            onClick={goBack}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={() => router.push('/colaborador/corporativo')}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Sair do Teste
          </Button>

          <div className="w-20"> {/* Spacer for alignment */}</div>
        </motion.div>
      </div>
    </div>
  )
}