'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { ArrowLeft, ArrowRight, CheckCircle, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: string
  text: string
  dimension: string
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
}

interface Answer {
  questionId: string
  score: number
}

const questions: Question[] = [
  // Extroversão (E) × Introversão (I)
  { id: 'cmebj0nmj00028w8wf5s5tuq1', text: 'Gosto de iniciar conversas com pessoas novas.', dimension: 'Energia', type: 'E' },
  { id: 'cmebj0nmv00048w8wmu5eaafk', text: 'Sinto-me energizado ao participar de eventos sociais.', dimension: 'Energia', type: 'E' },
  { id: 'cmebj0nn500068w8wean5zm4m', text: 'Prefiro atividades em grupo a tarefas solitárias.', dimension: 'Energia', type: 'E' },
  { id: 'cmebj0nnf00088w8wggbz0ut1', text: 'Tenho facilidade em me expressar verbalmente.', dimension: 'Energia', type: 'E' },
  { id: 'cmebj0nno000a8w8wzpgc512t', text: 'Recarrego minha energia em ambientes silenciosos.', dimension: 'Energia', type: 'I' },
  { id: 'cmebj0nnx000c8w8wytj5cgjs', text: 'Gosto de refletir antes de falar.', dimension: 'Energia', type: 'I' },
  { id: 'cmebj0no8000e8w8w6oo93iw5', text: 'Prefiro escrever do que falar em público.', dimension: 'Energia', type: 'I' },
  { id: 'cmebj0noj000g8w8wf1m3b718', text: 'Evito ambientes muito movimentados.', dimension: 'Energia', type: 'I' },
  { id: 'cmebj0nor000i8w8w2vsei3k5', text: 'Sinto-me cansado após muitas interações sociais.', dimension: 'Energia', type: 'I' },
  { id: 'cmebj0np1000k8w8wenltk0lv', text: 'Fico entusiasmado quando tenho companhia para realizar atividades.', dimension: 'Energia', type: 'E' },

  // Sensação (S) × Intuição (N)
  { id: 'cmebj0npa000m8w8w2bb3wyku', text: 'Gosto de trabalhar com fatos concretos e verificáveis.', dimension: 'Percepção', type: 'S' },
  { id: 'cmebj0npj000o8w8w1nljd4w5', text: 'Prefiro seguir instruções claras e detalhadas.', dimension: 'Percepção', type: 'S' },
  { id: 'cmebj0nps000q8w8whxy6gpzm', text: 'Presto atenção aos detalhes do presente.', dimension: 'Percepção', type: 'S' },
  { id: 'cmebj0nq3000s8w8wnshgb5p3', text: 'Valorizo experiências práticas em vez de teorias.', dimension: 'Percepção', type: 'S' },
  { id: 'cmebj0nqk000u8w8wwllgwsjt', text: 'Tenho facilidade em imaginar diferentes cenários futuros.', dimension: 'Percepção', type: 'N' },
  { id: 'cmebj0nqu000w8w8w3zu2p0f2', text: 'Penso sobre o "todo" antes de olhar as partes.', dimension: 'Percepção', type: 'N' },
  { id: 'cmebj0nr3000y8w8wl66v1bxv', text: 'Sinto-me atraído por ideias inovadoras.', dimension: 'Percepção', type: 'N' },
  { id: 'cmebj0nrf00108w8wkwhn6con', text: 'Gosto de questionar padrões e regras estabelecidas.', dimension: 'Percepção', type: 'N' },
  { id: 'cmebj0nrq00128w8wnjcq0qe8', text: 'Tenho insights espontâneos com frequência.', dimension: 'Percepção', type: 'N' },
  { id: 'cmebj0ns200148w8whx6f0dc7', text: 'Gosto de explorar possibilidades e alternativas.', dimension: 'Percepção', type: 'N' },

  // Pensamento (T) × Sentimento (F)
  { id: 'cmebj0nsf00168w8wegkx8um6', text: 'Tomo decisões com base em lógica e justiça.', dimension: 'Decisão', type: 'T' },
  { id: 'cmebj0nsp00188w8wioq9p2em', text: 'Analiso prós e contras de forma objetiva.', dimension: 'Decisão', type: 'T' },
  { id: 'cmebj0nt0001a8w8wah30poe4', text: 'Prefiro ser justo a ser gentil.', dimension: 'Decisão', type: 'T' },
  { id: 'cmebj0nta001c8w8wx0a2vs3i', text: 'Valorizo argumentos racionais.', dimension: 'Decisão', type: 'T' },
  { id: 'cmebj0ntj001e8w8wdxs7uy3k', text: 'Considero os sentimentos das pessoas ao tomar decisões.', dimension: 'Decisão', type: 'F' },
  { id: 'cmebj0ntu001g8w8wibgulxp5', text: 'Preocupo-me com o impacto emocional das minhas ações.', dimension: 'Decisão', type: 'F' },
  { id: 'cmebj0nu3001i8w8wgbgvsgij', text: 'Busco harmonia nos relacionamentos.', dimension: 'Decisão', type: 'F' },
  { id: 'cmebj0nud001k8w8wcyk46l51', text: 'Evito magoar as pessoas, mesmo quando discordo.', dimension: 'Decisão', type: 'F' },
  { id: 'cmebj0nus001m8w8wkvdzegdb', text: 'Presto atenção à linguagem corporal e emoções.', dimension: 'Decisão', type: 'F' },
  { id: 'cmebj0nv4001o8w8wbm5w7dg3', text: 'Tenho empatia por quem está em dificuldade.', dimension: 'Decisão', type: 'F' },

  // Julgamento (J) × Percepção (P)
  { id: 'cmebj0nvd001q8w8wzu5p84i9', text: 'Gosto de manter uma rotina organizada.', dimension: 'Organização', type: 'J' },
  { id: 'cmebj0nvo001s8w8wdn46pscw', text: 'Planejo atividades com antecedência.', dimension: 'Organização', type: 'J' },
  { id: 'cmebj0nvx001u8w8woi1150zi', text: 'Fico desconfortável com imprevistos.', dimension: 'Organização', type: 'J' },
  { id: 'cmebj0nw7001w8w8w5b2lgy3u', text: 'Cumpro prazos rigorosamente.', dimension: 'Organização', type: 'J' },
  { id: 'cmebj0nwg001y8w8wz26x7vpm', text: 'Sinto-me mais produtivo com horários flexíveis.', dimension: 'Organização', type: 'P' },
  { id: 'cmebj0nwq00208w8wkiarehmh', text: 'Prefiro deixar decisões em aberto.', dimension: 'Organização', type: 'P' },
  { id: 'cmebj0nwy00228w8wy1c56ati', text: 'Gosto de improvisar quando necessário.', dimension: 'Organização', type: 'P' },
  { id: 'cmebj0nx800248w8wutsolwii', text: 'Adio decisões para reunir mais informações.', dimension: 'Organização', type: 'P' },
  { id: 'cmebj0nxh00268w8wpxuh46qp', text: 'Mudo de ideia com facilidade.', dimension: 'Organização', type: 'P' },
  { id: 'cmebj0nxr00288w8wbqq6s7ju', text: 'Gosto de começar projetos mesmo sem todos os detalhes.', dimension: 'Organização', type: 'P' }
]



export default function HumaniQTiposPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [startTime] = useState(Date.now())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false)

  // Bypass prevention: Check if user came from introduction page
  useEffect(() => {
    const introductionSeen = sessionStorage.getItem('humaniq-tipos-introduction-seen')
    if (!introductionSeen) {
      // User hasn't seen the introduction, redirect them
      router.replace('/colaborador/psicossociais/humaniq-tipos/introducao')
      return
    }
    setHasSeenIntroduction(true)
  }, [router])

  // Don't render the test if user hasn't seen introduction
  if (!hasSeenIntroduction) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p>Redirecionando para a introdução...</p>
        </div>
      </div>
    )
  }

  const handleAnswer = (score: number) => {
    // Permitir respostas mesmo durante submissão para evitar bloqueio
    console.log('HumaniQ Tipos - Resposta recebida:', { questionId: questions[currentQuestion].id, score, isSubmitting })

    const newAnswers = [...answers]
    const existingIndex = newAnswers.findIndex(a => a.questionId === questions[currentQuestion].id)
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].score = score
    } else {
      newAnswers.push({ questionId: questions[currentQuestion].id, score })
    }
    
    setAnswers(newAnswers)
    console.log('HumaniQ Tipos - Total de respostas:', newAnswers.length, 'de', questions.length)
  }

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === questions[currentQuestion].id)?.score
  }

  const canGoNext = () => {
    return getCurrentAnswer() !== undefined
  }

  const canGoPrevious = () => {
    return currentQuestion > 0
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    }

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (question) {
        scores[question.type] += answer.score
      }
    })

    const personality = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('')

    return {
      personality,
      scores,
      dimensions: {
        Energia: scores.E > scores.I ? 'Extroversão' : 'Introversão',
        Percepção: scores.S > scores.N ? 'Sensação' : 'Intuição',
        Decisão: scores.T > scores.F ? 'Pensamento' : 'Sentimento',
        Organização: scores.J > scores.P ? 'Julgamento' : 'Percepção'
      }
    }
  }

  const handleSubmit = async () => {
    if (hasSubmitted) {
      console.log('⚠️ Teste já foi submetido, ignorando nova tentativa')
      return
    }
    
    setIsSubmitting(true)
    setHasSubmitted(true)
    
    try {
      console.log('🚀 Iniciando submissão do teste HumaniQ Tipos')
      
      // 1. Criar sessão de teste se não existir
      let currentSessionId = sessionId
      if (!currentSessionId) {
        console.log('📝 Criando sessão de teste...')
        const sessionResponse = await fetch('/api/tests/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            testId: 'cmdxqvgu4000p8wsg7l8brjee'
          })
        })
        
        if (!sessionResponse.ok) {
          const sessionError = await sessionResponse.text()
          console.error('❌ Erro ao criar sessão:', sessionError)
          throw new Error(`Falha ao criar sessão de teste: ${sessionResponse.status}`)
        }
        
        const sessionData = await sessionResponse.json()
        currentSessionId = sessionData.sessionId
        setSessionId(currentSessionId)
        console.log('✅ Sessão criada:', currentSessionId)
      }
      
      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)
      const results = calculateResults()
      
      console.log('📊 Preparando dados de submissão:', {
        testId: 'cmdxqvgu4000p8wsg7l8brjee',
        sessionId: currentSessionId,
        answersCount: answers.length,
        duration
      })
      
      const submission = {
        testId: 'cmdxqvgu4000p8wsg7l8brjee', // ID do teste HumaniQ TIPOS no banco
        sessionId: currentSessionId,
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          value: answer.score,
          metadata: {}
        })),
        duration: duration,
        metadata: {
          results: results
        }
      }

      console.log('📤 Enviando submissão para API...')
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Falha ao enviar o teste: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Resposta da API recebida:', data)

      if (data && data.testResult && data.testResult.id) {
        console.log('🎯 Teste submetido com sucesso, ID:', data.testResult.id)
        
        // Disparar análise de IA em segundo plano (sem esperar)
        fetch('/api/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ testResultId: data.testResult.id })
        }).catch(aiError => {
          console.warn('⚠️ Erro na análise de IA (não crítico):', aiError)
        })

        // Redirecionar para a página de resultados
        console.log('🔄 Redirecionando para resultados...')
        router.push(`/colaborador/resultados/${data.testResult.id}`)
      } else {
        console.error('❌ ID do resultado do teste não encontrado na resposta da API:', data)
        throw new Error('Resposta inválida da API - ID do resultado não encontrado')
      }

    } catch (error) {
      console.error('💥 Erro ao submeter o teste:', error)
      setHasSubmitted(false) // Permitir nova tentativa em caso de erro
      
      // Mostrar erro para o usuário
      if (error instanceof Error) {
        alert(`Erro ao finalizar teste: ${error.message}`)
      } else {
        alert('Erro desconhecido ao finalizar teste. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calcular progresso baseado no número de questões respondidas
  const answeredQuestions = answers.filter(answer => answer.score > 0).length
  const progress = (answeredQuestions / questions.length) * 100
  const question = questions[currentQuestion]

  // Verificação de segurança
  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p>Carregando questão...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              HumaniQ TIPOS - Perfil Cognitivo
            </h1>
            <p className="text-gray-600">
              Base Junguiana / MBTI - Questão {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      {question && (
      <Card className={`mb-6 ${isTransitioning ? 'opacity-50' : 'animate-slide-in'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Questão {currentQuestion + 1}
              </CardTitle>
              <CardDescription>
                {question.dimension} • Perfil Cognitivo
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500">Progresso</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed text-center font-medium">
            {question.text}
          </p>

          <LikertScale
            value={getCurrentAnswer()}
            onChange={handleAnswer}
            hideQuestion={true}
            autoAdvance={true}
            onAutoAdvance={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                handleSubmit()
              }
            }}
            autoAdvanceDelay={600}
          />

          {/* Mensagem de Continuação Automática */}
          {(getCurrentAnswer() || 0) > 0 && !isTransitioning && (
            <div className="text-center text-sm text-gray-500 animate-fade-in">
              {currentQuestion === questions.length - 1 
                ? isSubmitting 
                  ? 'Finalizando teste e gerando análise...'
                  : 'Teste concluído. Processando...'
                : 'Clique na sua resposta para continuar automaticamente'
              }
            </div>
          )}
        </CardContent>
      </Card>
      )}


      {/* Botões de navegação - ocultos na última questão */}
      {currentQuestion < questions.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2"
          >
            Próxima
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Indicador de finalização na última questão */}
      {currentQuestion === questions.length - 1 && (getCurrentAnswer() || 0) > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-blue-600 font-medium">
            <CheckCircle className="h-5 w-5 animate-pulse" />
            {isSubmitting ? 'Processando análise...' : 'Teste será finalizado automaticamente'}
          </div>
        </div>
      )}
    </div>
  )
}