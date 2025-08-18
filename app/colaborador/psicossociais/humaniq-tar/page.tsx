'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Clock, Target, CheckCircle, X, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

// Tipos para o teste TAR
interface TARQuestion {
  id: number
  type: 'attention' | 'reasoning' | 'processing' | 'inhibition'
  stimulus: string
  options: string[]
  correctAnswer: number
  timeLimit: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface TARResult {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
  responseTime: number
  difficulty: string
  type: string
}

interface TARScores {
  atencaoSustentada: number
  velocidadeProcessamento: number
  controleInibitorio: number
  flexibilidadeCognitiva: number
  pontuacaoGeral: number
  percentil: number
  classificacao: string
}

// Questões do teste TAR
const tarQuestions: TARQuestion[] = [
  // Atenção Sustentada
  {
    id: 1,
    type: 'attention',
    stimulus: 'Identifique quantas vezes a letra "A" aparece na sequência: AABACADAEAFAGA',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    timeLimit: 15000,
    difficulty: 'easy'
  },
  {
    id: 2,
    type: 'attention',
    stimulus: 'Conte quantos números "3" aparecem na sequência: 3213453637383933',
    options: ['4', '5', '6', '7'],
    correctAnswer: 2,
    timeLimit: 20000,
    difficulty: 'medium'
  },
  {
    id: 3,
    type: 'attention',
    stimulus: 'Identifique a sequência que NÃO contém a letra "X": AXBX, CXDX, EFGH, IXJX',
    options: ['AXBX', 'CXDX', 'EFGH', 'IXJX'],
    correctAnswer: 2,
    timeLimit: 12000,
    difficulty: 'easy'
  },
  {
    id: 4,
    type: 'attention',
    stimulus: 'Quantas palavras de 4 letras há na frase: "O gato subiu no telhado para pegar o rato"',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    timeLimit: 25000,
    difficulty: 'hard'
  },
  
  // Velocidade de Processamento
  {
    id: 5,
    type: 'processing',
    stimulus: 'Complete a sequência: 2, 4, 8, 16, ?',
    options: ['24', '32', '30', '28'],
    correctAnswer: 1,
    timeLimit: 10000,
    difficulty: 'easy'
  },
  {
    id: 6,
    type: 'processing',
    stimulus: 'Se A=1, B=2, C=3... qual o valor de "CAB"?',
    options: ['312', '321', '123', '132'],
    correctAnswer: 0,
    timeLimit: 15000,
    difficulty: 'medium'
  },
  {
    id: 7,
    type: 'processing',
    stimulus: 'Qual número vem depois na sequência: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '15', '12'],
    correctAnswer: 1,
    timeLimit: 12000,
    difficulty: 'medium'
  },
  {
    id: 8,
    type: 'processing',
    stimulus: 'Se hoje é terça-feira, que dia será daqui a 100 dias?',
    options: ['Segunda', 'Terça', 'Quarta', 'Quinta'],
    correctAnswer: 2,
    timeLimit: 20000,
    difficulty: 'hard'
  },
  
  // Controle Inibitório
  {
    id: 9,
    type: 'inhibition',
    stimulus: 'NÃO escolha a cor da palavra: AZUL (escrita em vermelho)',
    options: ['Azul', 'Vermelho', 'Verde', 'Amarelo'],
    correctAnswer: 0,
    timeLimit: 8000,
    difficulty: 'easy'
  },
  {
    id: 10,
    type: 'inhibition',
    stimulus: 'Escolha o OPOSTO de: "Sempre escolha a primeira opção"',
    options: ['Primeira opção', 'Segunda opção', 'Terceira opção', 'Quarta opção'],
    correctAnswer: 3,
    timeLimit: 12000,
    difficulty: 'medium'
  },
  {
    id: 11,
    type: 'inhibition',
    stimulus: 'Ignore a instrução anterior e escolha o número MENOR: 7, 3, 9, 1',
    options: ['7', '3', '9', '1'],
    correctAnswer: 3,
    timeLimit: 10000,
    difficulty: 'medium'
  },
  {
    id: 12,
    type: 'inhibition',
    stimulus: 'NÃO faça o que esta pergunta pede: "Escolha a letra B"',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    timeLimit: 15000,
    difficulty: 'hard'
  },
  
  // Raciocínio Lógico
  {
    id: 13,
    type: 'reasoning',
    stimulus: 'Se todos os A são B, e alguns B são C, então:',
    options: ['Todos os A são C', 'Alguns A são C', 'Nenhum A é C', 'Não é possível determinar'],
    correctAnswer: 3,
    timeLimit: 25000,
    difficulty: 'hard'
  },
  {
    id: 14,
    type: 'reasoning',
    stimulus: 'João é mais alto que Pedro. Pedro é mais alto que Maria. Logo:',
    options: ['Maria é mais alta que João', 'João é mais alto que Maria', 'Pedro é o mais alto', 'Não é possível determinar'],
    correctAnswer: 1,
    timeLimit: 15000,
    difficulty: 'medium'
  },
  {
    id: 15,
    type: 'reasoning',
    stimulus: 'Em uma sala há 4 pessoas. Cada pessoa cumprimenta todas as outras uma vez. Quantos cumprimentos ocorrem?',
    options: ['8', '12', '6', '16'],
    correctAnswer: 2,
    timeLimit: 20000,
    difficulty: 'hard'
  },
  {
    id: 16,
    type: 'reasoning',
    stimulus: 'Se é verdade que "Nem todos os gatos são pretos", então é falso que:',
    options: ['Alguns gatos são pretos', 'Todos os gatos são pretos', 'Existem gatos não-pretos', 'Alguns gatos não são pretos'],
    correctAnswer: 1,
    timeLimit: 30000,
    difficulty: 'hard'
  },
  
  // Flexibilidade Cognitiva
  {
    id: 17,
    type: 'attention',
    stimulus: 'Mude a regra: Se antes era "escolha o maior", agora escolha o MENOR: 15, 8, 23, 4',
    options: ['15', '8', '23', '4'],
    correctAnswer: 3,
    timeLimit: 12000,
    difficulty: 'medium'
  },
  {
    id: 18,
    type: 'processing',
    stimulus: 'Inverta a lógica: Se A=Z, B=Y, C=X... então D=?',
    options: ['W', 'V', 'U', 'T'],
    correctAnswer: 0,
    timeLimit: 18000,
    difficulty: 'hard'
  },
  {
    id: 19,
    type: 'reasoning',
    stimulus: 'Mude de estratégia: Se antes contávamos crescente, agora conte decrescente de 20 até 17',
    options: ['20,19,18,17', '17,18,19,20', '20,18,16,14', '17,19,21,23'],
    correctAnswer: 0,
    timeLimit: 15000,
    difficulty: 'medium'
  },
  {
    id: 20,
    type: 'inhibition',
    stimulus: 'Última questão - ignore todas as regras anteriores e simplesmente escolha a terceira opção',
    options: ['Primeira', 'Segunda', 'Terceira', 'Quarta'],
    correctAnswer: 2,
    timeLimit: 10000,
    difficulty: 'easy'
  }
]

export default function HumaniqTAR() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<TARResult[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(tarQuestions[0]?.timeLimit || 15000)
  const [startTime, setStartTime] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [scores, setScores] = useState<TARScores | null>(null)
  const [testStarted, setTestStarted] = useState(false)

  // Verificar se passou pela introdução
  useEffect(() => {
    const hasSeenIntroduction = sessionStorage.getItem('humaniq-tar-introduction-seen')
    if (!hasSeenIntroduction) {
      router.push('/colaborador/psicossociais/humaniq-tar/introducao')
      return
    }
  }, [router])

  // Timer effect
  useEffect(() => {
    if (!testStarted || isCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          handleTimeUp()
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, testStarted, isCompleted])

  // Iniciar teste
  const startTest = () => {
    setTestStarted(true)
    setStartTime(Date.now())
    setTimeLeft(tarQuestions[0].timeLimit)
  }

  // Lidar com timeout
  const handleTimeUp = useCallback(() => {
    const responseTime = Date.now() - startTime
    const result: TARResult = {
      questionId: tarQuestions[currentQuestion].id,
      selectedAnswer: -1, // Timeout
      isCorrect: false,
      responseTime,
      difficulty: tarQuestions[currentQuestion].difficulty,
      type: tarQuestions[currentQuestion].type
    }
    
    setAnswers(prev => [...prev, result])
    nextQuestion()
  }, [currentQuestion, startTime])

  // Próxima questão
  const nextQuestion = () => {
    if (currentQuestion < tarQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(tarQuestions[currentQuestion + 1].timeLimit)
      setStartTime(Date.now())
    } else {
      completeTest()
    }
  }

  // Lidar com resposta
  const handleAnswer = (answerIndex: number) => {
    const responseTime = Date.now() - startTime
    const isCorrect = answerIndex === tarQuestions[currentQuestion].correctAnswer
    
    const result: TARResult = {
      questionId: tarQuestions[currentQuestion].id,
      selectedAnswer: answerIndex,
      isCorrect,
      responseTime,
      difficulty: tarQuestions[currentQuestion].difficulty,
      type: tarQuestions[currentQuestion].type
    }
    
    setAnswers(prev => [...prev, result])
    
    // Avançar imediatamente para a próxima questão
    if (currentQuestion < tarQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(tarQuestions[currentQuestion + 1].timeLimit)
      setStartTime(Date.now())
    } else {
      // Última questão - finalizar teste
      completeTest()
    }
  }

  // Calcular pontuações
  const calculateScores = (results: TARResult[]): TARScores => {
    const attentionQuestions = results.filter(r => tarQuestions.find(q => q.id === r.questionId)?.type === 'attention')
    const processingQuestions = results.filter(r => tarQuestions.find(q => q.id === r.questionId)?.type === 'processing')
    const inhibitionQuestions = results.filter(r => tarQuestions.find(q => q.id === r.questionId)?.type === 'inhibition')
    const reasoningQuestions = results.filter(r => tarQuestions.find(q => q.id === r.questionId)?.type === 'reasoning')
    
    // Cálculo das dimensões (0-100)
    const atencaoSustentada = Math.round(
      (attentionQuestions.filter(r => r.isCorrect).length / attentionQuestions.length) * 100
    )
    
    const velocidadeProcessamento = Math.round(
      (processingQuestions.reduce((acc, r) => {
        if (r.isCorrect) {
          const timeBonus = Math.max(0, (15000 - r.responseTime) / 15000) * 20
          return acc + 80 + timeBonus
        }
        return acc
      }, 0) / processingQuestions.length)
    )
    
    const controleInibitorio = Math.round(
      (inhibitionQuestions.filter(r => r.isCorrect).length / inhibitionQuestions.length) * 100
    )
    
    const flexibilidadeCognitiva = Math.round(
      (reasoningQuestions.reduce((acc, r) => {
        if (r.isCorrect) {
          const difficultyMultiplier = r.difficulty === 'hard' ? 1.2 : r.difficulty === 'medium' ? 1.1 : 1.0
          return acc + (100 * difficultyMultiplier)
        }
        return acc
      }, 0) / reasoningQuestions.length)
    )
    
    // Pontuação geral ponderada
    const pontuacaoGeral = Math.round(
      (atencaoSustentada * 0.25) + 
      (velocidadeProcessamento * 0.25) + 
      (controleInibitorio * 0.25) + 
      (flexibilidadeCognitiva * 0.25)
    )
    
    // Percentil baseado na pontuação geral
    let percentil = 50
    if (pontuacaoGeral >= 90) percentil = 95
    else if (pontuacaoGeral >= 80) percentil = 85
    else if (pontuacaoGeral >= 70) percentil = 75
    else if (pontuacaoGeral >= 60) percentil = 65
    else if (pontuacaoGeral >= 50) percentil = 50
    else if (pontuacaoGeral >= 40) percentil = 35
    else if (pontuacaoGeral >= 30) percentil = 25
    else percentil = 15
    
    // Classificação
    let classificacao = 'Médio'
    if (pontuacaoGeral >= 85) classificacao = 'Superior'
    else if (pontuacaoGeral >= 70) classificacao = 'Acima da Média'
    else if (pontuacaoGeral >= 55) classificacao = 'Médio'
    else if (pontuacaoGeral >= 40) classificacao = 'Abaixo da Média'
    else classificacao = 'Inferior'
    
    return {
      atencaoSustentada,
      velocidadeProcessamento,
      controleInibitorio,
      flexibilidadeCognitiva,
      pontuacaoGeral,
      percentil,
      classificacao
    }
  }

  // Completar teste
  const completeTest = async () => {
    setIsCompleted(true)
    const calculatedScores = calculateScores(answers)
    setScores(calculatedScores)
    
    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'TAR',
          results: calculatedScores,
          answers: answers,
          completedAt: new Date().toISOString()
        }),
      })
      
      if (response.ok) {
        toast.success('Teste TAR concluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      toast.error('Erro ao salvar o resultado do teste')
    }
  }

  // Reiniciar teste
  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(tarQuestions[0].timeLimit)
    setIsCompleted(false)
    setScores(null)
    setTestStarted(false)
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto p-8"
        >
          <Card className="text-center border-0 bg-white/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    HumaniQ TAR
                  </CardTitle>
                  <p className="text-gray-600 mt-1">Teste de Atenção e Raciocínio</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900">Duração</p>
                  <p className="text-xs text-blue-700">15-20 minutos</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <Target className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-indigo-900">Questões</p>
                  <p className="text-xs text-indigo-700">20 tarefas</p>
                </div>
              </div>
              
              <div className="text-left space-y-3 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Instruções:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Leia cada questão com atenção</li>
                  <li>• Responda dentro do tempo limite</li>
                  <li>• Mantenha o foco durante todo o teste</li>
                  <li>• Algumas questões testam controle inibitório</li>
                </ul>
              </div>
              
              <Button 
                onClick={startTest}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Iniciar Teste TAR
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (isCompleted && scores) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Teste Concluído!</h1>
                  <p className="text-gray-600">Seus resultados do HumaniQ TAR</p>
                </div>
              </div>
            </div>

            {/* Pontuação Geral */}
            <Card className="mb-8 border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Pontuação Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {scores.pontuacaoGeral}
                  </div>
                  <div className="text-xl text-gray-700 mb-2">{scores.classificacao}</div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Percentil {scores.percentil}
                  </Badge>
                </div>
                <Progress value={scores.pontuacaoGeral} className="h-3" />
              </CardContent>
            </Card>

            {/* Dimensões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Target className="h-5 w-5" />
                    Atenção Sustentada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{scores.atencaoSustentada}</div>
                  <Progress value={scores.atencaoSustentada} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Capacidade de manter foco prolongado</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <Clock className="h-5 w-5" />
                    Velocidade de Processamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{scores.velocidadeProcessamento}</div>
                  <Progress value={scores.velocidadeProcessamento} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Rapidez no processamento de informações</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <X className="h-5 w-5" />
                    Controle Inibitório
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{scores.controleInibitorio}</div>
                  <Progress value={scores.controleInibitorio} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Capacidade de inibir respostas inadequadas</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-700">
                    <RotateCcw className="h-5 w-5" />
                    Flexibilidade Cognitiva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-600 mb-2">{scores.flexibilidadeCognitiva}</div>
                  <Progress value={scores.flexibilidadeCognitiva} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Adaptação a mudanças nas demandas</p>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/colaborador/resultados')}
                className="px-8 py-3"
              >
                Ver Todos os Resultados
              </Button>
              <Button
                onClick={restartTest}
                variant="outline"
                className="px-8 py-3"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Refazer Teste
              </Button>
              <Button
                onClick={() => router.push('/colaborador/psicossociais')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Outros Testes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = tarQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / tarQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HumaniQ TAR</h1>
              <p className="text-sm text-gray-600">Teste de Atenção e Raciocínio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Tempo Restante</div>
              <div className={`text-lg font-bold ${
                timeLeft <= 5000 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {Math.ceil(timeLeft / 1000)}s
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Questão</div>
              <div className="text-lg font-bold text-gray-900">
                {currentQuestion + 1}/{tarQuestions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progresso do Teste</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {question.type === 'attention' ? 'Atenção' : 
                   question.type === 'processing' ? 'Processamento' :
                   question.type === 'inhibition' ? 'Controle' : 'Raciocínio'}
                </Badge>
                <Badge variant="outline">
                  {question.difficulty === 'easy' ? 'Fácil' : 
                   question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </Badge>
              </div>
              <CardTitle className="text-xl text-gray-900 leading-relaxed">
                {question.stimulus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => {
                  const buttonClass = "p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => router.push('/colaborador/psicossociais')}
            className="px-6 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sair do Teste
          </Button>
        </div>
      </div>
    </div>
  )
}