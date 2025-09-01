'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, ArrowRight, Circle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { showResultStorageSuccess, showResultStorageError, showSavingProgress } from '@/lib/toast-utils'

interface Question {
  id: number
  text: string
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

interface TestResults {
  type1: number
  type2: number
  type3: number
  type4: number
  type5: number
  type6: number
  type7: number
  type8: number
  type9: number
  dominantType: string
  completedAt: string
  // Novos campos para cálculo aprimorado
  percentageScores: Record<string, number>
  rankedTypes: { type: string; percentage: number; rank: number; rawScore: number }[]
  dominantTypePercentage: number
  secondaryType: string
  secondaryTypePercentage: number
  wing: string | null
  wingNotation: string
  wingPercentage: number
  developmentLevel: string
  questionDistribution: { [key: string]: number }
  calculationMethod: string
  totalQuestions: number
}



const questions: Question[] = [
  // Tipo 1 - O Perfeccionista (11 perguntas)
  { id: 1, text: "Procuro seguir as regras mesmo quando ninguém está observando.", type: 1 },
  { id: 2, text: "Sinto desconforto quando percebo erros em algo que fiz.", type: 1 },
  { id: 3, text: "Tenho um forte senso de certo e errado.", type: 1 },
  { id: 4, text: "Revisar e melhorar o que faço me traz satisfação.", type: 1 },
  { id: 5, text: "Me incomoda ver pessoas quebrando regras básicas.", type: 1 },
  { id: 6, text: "Gosto de manter tudo organizado e padronizado.", type: 1 },
  { id: 7, text: "É difícil para mim aceitar um trabalho feito de forma descuidada.", type: 1 },
  { id: 8, text: "Quando algo dá errado, penso no que poderia ter feito melhor.", type: 1 },
  { id: 9, text: "Sinto necessidade de corrigir injustiças.", type: 1 },
  { id: 10, text: "Costumo manter listas e planos para cumprir tarefas.", type: 1 },
  { id: 11, text: "Tenho dificuldade em aceitar críticas que considero injustas.", type: 1 },

  // Tipo 2 - O Prestativo (11 perguntas)
  { id: 12, text: "Sinto satisfação em ajudar pessoas, mesmo que isso me canse.", type: 2 },
  { id: 13, text: "É natural para mim perceber as necessidades dos outros.", type: 2 },
  { id: 14, text: "Muitas vezes coloco os outros antes de mim mesmo.", type: 2 },
  { id: 15, text: "Gosto de ser reconhecido por ajudar.", type: 2 },
  { id: 16, text: "Às vezes me sinto magoado quando minha ajuda não é valorizada.", type: 2 },
  { id: 17, text: "Tenho facilidade em criar laços de amizade.", type: 2 },
  { id: 18, text: "Procuro estar presente quando alguém precisa de apoio.", type: 2 },
  { id: 19, text: "Me sinto motivado quando posso contribuir com algo útil.", type: 2 },
  { id: 20, text: "Evito pedir ajuda, mesmo quando preciso.", type: 2 },
  { id: 21, text: "Percebo rapidamente quando alguém está triste.", type: 2 },
  { id: 22, text: "Gosto de ser visto como uma pessoa generosa.", type: 2 },

  // Tipo 3 - O Bem-sucedido (11 perguntas)
  { id: 23, text: "Gosto de atingir metas e ser reconhecido por isso.", type: 3 },
  { id: 24, text: "Costumo ajustar minha imagem para impressionar positivamente.", type: 3 },
  { id: 25, text: "Procuro estar entre os melhores no que faço.", type: 3 },
  { id: 26, text: "É importante para mim causar boa impressão.", type: 3 },
  { id: 27, text: "Evito mostrar minhas fragilidades em público.", type: 3 },
  { id: 28, text: "Sinto satisfação em ser admirado pelo meu trabalho.", type: 3 },
  { id: 29, text: "Gosto de competir para provar meu valor.", type: 3 },
  { id: 30, text: "Procuro sempre melhorar meu desempenho.", type: 3 },
  { id: 31, text: "Tenho facilidade em identificar o que as pessoas esperam de mim.", type: 3 },
  { id: 32, text: "Gosto de estar ocupado e produtivo.", type: 3 },
  { id: 33, text: "Acredito que minha aparência influencia meu sucesso.", type: 3 },

  // Tipo 4 - O Romântico (11 perguntas)
  { id: 34, text: "Sinto minhas emoções de forma intensa.", type: 4 },
  { id: 35, text: "Tenho a sensação de ser diferente da maioria das pessoas.", type: 4 },
  { id: 36, text: "Aprecio arte, música e beleza.", type: 4 },
  { id: 37, text: "Às vezes me comparo com os outros e me sinto inferior.", type: 4 },
  { id: 38, text: "Prefiro profundidade emocional a conversas superficiais.", type: 4 },
  { id: 39, text: "É comum eu sentir nostalgia.", type: 4 },
  { id: 40, text: "Busco autenticidade em tudo o que faço.", type: 4 },
  { id: 41, text: "Sinto que compreendo melhor a dor dos outros.", type: 4 },
  { id: 42, text: "Acredito que minhas emoções me definem.", type: 4 },
  { id: 43, text: "Tenho tendência a idealizar relacionamentos.", type: 4 },
  { id: 44, text: "Às vezes me sinto incompreendido.", type: 4 },

  // Tipo 5 - O Observador (11 perguntas)
  { id: 45, text: "Gosto de passar tempo sozinho para refletir.", type: 5 },
  { id: 46, text: "Prefiro observar antes de participar.", type: 5 },
  { id: 47, text: "Valorizo conhecimento e informação.", type: 5 },
  { id: 48, text: "Evito depender emocionalmente de outras pessoas.", type: 5 },
  { id: 49, text: "Tenho facilidade para me concentrar em algo que me interessa.", type: 5 },
  { id: 50, text: "Não gosto de desperdiçar recursos, como tempo e energia.", type: 5 },
  { id: 51, text: "Sinto-me mais seguro quando tenho dados suficientes para decidir.", type: 5 },
  { id: 52, text: "Prefiro analisar do que agir rapidamente.", type: 5 },
  { id: 53, text: "Tenho dificuldade em lidar com interrupções.", type: 5 },
  { id: 54, text: "Evito compartilhar minha vida pessoal.", type: 5 },
  { id: 55, text: "Prefiro ambientes calmos e controlados.", type: 5 },

  // Tipo 6 - O Leal (11 perguntas)
  { id: 56, text: "Gosto de me sentir parte de um grupo ou equipe.", type: 6 },
  { id: 57, text: "Costumo planejar para evitar problemas.", type: 6 },
  { id: 58, text: "Tenho cautela antes de confiar em alguém.", type: 6 },
  { id: 59, text: "Preocupo-me com segurança e estabilidade.", type: 6 },
  { id: 60, text: "Sinto necessidade de ter apoio em decisões importantes.", type: 6 },
  { id: 61, text: "Tenho dificuldade em lidar com mudanças repentinas.", type: 6 },
  { id: 62, text: "Gosto de seguir líderes que transmitem confiança.", type: 6 },
  { id: 63, text: "Às vezes questiono se estou tomando a decisão certa.", type: 6 },
  { id: 64, text: "Sinto-me mais seguro quando há regras claras.", type: 6 },
  { id: 65, text: "Evito riscos desnecessários.", type: 6 },
  { id: 66, text: "Tenho facilidade em identificar possíveis ameaças.", type: 6 },

  // Tipo 7 - O Entusiasta (11 perguntas)
  { id: 67, text: "Gosto de buscar novas experiências e aventuras.", type: 7 },
  { id: 68, text: "Evito ficar preso a rotinas por muito tempo.", type: 7 },
  { id: 69, text: "Procuro manter um clima leve e divertido.", type: 7 },
  { id: 70, text: "Gosto de pensar em múltiplas possibilidades para o futuro.", type: 7 },
  { id: 71, text: "Evito lidar com emoções negativas por muito tempo.", type: 7 },
  { id: 72, text: "Sinto energia extra quando inicio novos projetos.", type: 7 },
  { id: 73, text: "Tenho dificuldade em lidar com tédio.", type: 7 },
  { id: 74, text: "Gosto de surpreender as pessoas com ideias criativas.", type: 7 },
  { id: 75, text: "Sinto que há sempre algo melhor me esperando.", type: 7 },
  { id: 76, text: "Evito pensar demais em problemas.", type: 7 },
  { id: 77, text: "Tenho facilidade em motivar os outros.", type: 7 },

  // Tipo 8 - O Desafiador (11 perguntas)
  { id: 78, text: "Assumo a liderança de forma natural.", type: 8 },
  { id: 79, text: "Não tenho medo de defender minhas opiniões.", type: 8 },
  { id: 80, text: "Gosto de sentir que estou no controle da situação.", type: 8 },
  { id: 81, text: "Tenho dificuldade em aceitar autoridade que considero injusta.", type: 8 },
  { id: 82, text: "Protejo pessoas próximas de forma intensa.", type: 8 },
  { id: 83, text: "Não me intimido facilmente.", type: 8 },
  { id: 84, text: "Gosto de enfrentar desafios.", type: 8 },
  { id: 85, text: "Sinto desconforto quando percebo fraqueza em mim.", type: 8 },
  { id: 86, text: "Prefiro agir diretamente a esperar.", type: 8 },
  { id: 87, text: "Tenho um senso forte de justiça.", type: 8 },
  { id: 88, text: "Evito mostrar vulnerabilidade.", type: 8 },

  // Tipo 9 - O Pacificador (12 perguntas)
  { id: 89, text: "Evito conflitos sempre que possível.", type: 9 },
  { id: 90, text: "Tenho dificuldade em dizer 'não'.", type: 9 },
  { id: 91, text: "Gosto de manter a harmonia ao meu redor.", type: 9 },
  { id: 92, text: "Às vezes cedo demais para evitar discussões.", type: 9 },
  { id: 93, text: "Gosto de ambientes calmos e estáveis.", type: 9 },
  { id: 94, text: "Evito tomar partido em discussões.", type: 9 },
  { id: 95, text: "É difícil para mim expressar raiva.", type: 9 },
  { id: 96, text: "Gosto de ouvir mais do que falar.", type: 9 },
  { id: 97, text: "Às vezes adio decisões para evitar problemas.", type: 9 },
  { id: 98, text: "Sinto que minha paz interior é prioridade.", type: 9 },
  { id: 99, text: "Evito mudanças drásticas na minha rotina.", type: 9 },
  { id: 100, text: "Procuro ver o lado positivo das situações.", type: 9 }
]

export default function PersonalityEnneagramPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testStartTime] = useState(Date.now())
  const [hasAutoFinalized, setHasAutoFinalized] = useState(false)
  const [isFinalizingRef] = useState({ current: false })
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionCreated, setSessionCreated] = useState(false)

  const progress = (Object.keys(answers).length / 100) * 100
  const answeredQuestions = Object.keys(answers).length

  // Criar sessão de teste ao inicializar
  useEffect(() => {
    const createTestSession = async () => {
      if (sessionCreated) return
      
      try {
        console.log('🔄 Criando sessão de teste...')
        const response = await fetch('/api/tests/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            testId: 'humaniq_eneagrama'
          })
        })

        if (!response.ok) {
          throw new Error('Erro ao criar sessão de teste')
        }

        const data = await response.json()
        console.log('✅ Sessão criada:', data.sessionId)
        setSessionId(data.sessionId)
        setSessionCreated(true)
      } catch (error) {
        console.error('❌ Erro ao criar sessão:', error)
        toast({
          title: "Erro",
          description: "Não foi possível inicializar o teste. Recarregue a página.",
          variant: "destructive"
        })
      }
    }

    createTestSession()
  }, [sessionCreated, toast])

  // Função para salvar resposta individual no backend
  const saveAnswerToBackend = async (questionId: number, value: number) => {
    if (!sessionId) return
    
    try {
      const response = await fetch('/api/tests/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          testId: 'humaniq_eneagrama',
          questionId: questionId,
          value: value,
          metadata: {
            type: questions.find(q => q.id === questionId)?.type,
            timestamp: new Date().toISOString()
          }
        })
      })
      
      if (!response.ok) {
        console.warn('Erro ao salvar resposta individual:', response.statusText)
      }
    } catch (error) {
      console.warn('Erro ao salvar resposta no backend:', error)
    }
  }

  // Função para finalizar teste automaticamente
  const finalizeTestAutomatically = async (currentAnswers: Record<number, number>) => {
    console.log('🎯 finalizeTestAutomatically iniciada')
    console.log('📊 Dados recebidos:')
    console.log('   - Total de respostas:', Object.keys(currentAnswers).length)
    console.log('   - IDs das questões:', Object.keys(currentAnswers).sort((a, b) => parseInt(a) - parseInt(b)))
    
    try {
      // Verificar se realmente temos todas as 100 respostas
      const answeredQuestions = Object.keys(currentAnswers).length
      console.log('📈 Número de questões respondidas:', answeredQuestions)
      
      if (answeredQuestions < 100) {
        console.log('❌ ERRO: Não é possível finalizar - faltam respostas')
        console.log('❌ Esperado: 100, Recebido:', answeredQuestions)
        
        // Resetar estados
        setIsSubmitting(false)
        isFinalizingRef.current = false
        setHasAutoFinalized(false)
        
        toast({
          title: "Teste incompleto",
          description: `Faltam ${100 - answeredQuestions} respostas para finalizar o teste.`,
          variant: "destructive"
        })
        return
      }
      
      // Validar que todas as questões de 1 a 100 estão presentes
      const missingQuestions = []
      for (let i = 1; i <= 100; i++) {
        if (!currentAnswers[i] || currentAnswers[i] < 1 || currentAnswers[i] > 5) {
          missingQuestions.push(i)
        }
      }
      
      if (missingQuestions.length > 0) {
        console.log('❌ ERRO: Questões com respostas inválidas:', missingQuestions)
        
        // Resetar estados
        setIsSubmitting(false)
        isFinalizingRef.current = false
        setHasAutoFinalized(false)
        
        toast({
          title: "Respostas inválidas",
          description: `Algumas questões têm respostas inválidas. Verifique suas respostas.`,
          variant: "destructive"
        })
        return
      }
      
      console.log('✅ Validação concluída - todas as 100 questões têm respostas válidas')
      console.log('🚀 Iniciando completeTest...')
      
      // Chamar completeTest com as respostas validadas
      await completeTest(currentAnswers, true) // true indica finalização automática
      
      console.log('✅ completeTest executado com sucesso')
      
    } catch (error) {
      console.error('❌ ERRO CRÍTICO na finalização automática:', error)
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A')
      
      // Resetar todos os estados de finalização
      setIsSubmitting(false)
      isFinalizingRef.current = false
      setHasAutoFinalized(false)
      
      toast({
        title: "Erro na finalização",
        description: "Ocorreu um erro inesperado ao finalizar o teste. Tente recarregar a página.",
        variant: "destructive"
      })
    }
  }
  
  // Verificar e finalizar se completo
  const checkAndFinalizeIfComplete = async () => {
    console.log('🔍 checkAndFinalizeIfComplete chamada')
    const totalAnswers = Object.keys(answers).length
    console.log('📊 Total de respostas atuais:', totalAnswers)
    console.log('🔍 Estados: hasAutoFinalized:', hasAutoFinalized, 'isSubmitting:', isSubmitting)
    
    if (totalAnswers === 100 && !hasAutoFinalized && !isSubmitting && !isFinalizingRef.current) {
      console.log('✅ Teste completo detectado! Iniciando finalização de fallback...')
      
      // Verificar se a questão 100 foi respondida
      const hasAnsweredQuestion100 = answers[100] !== undefined
      console.log('🎯 Questão 100 respondida?', hasAnsweredQuestion100)
      
      if (hasAnsweredQuestion100) {
        console.log('🚀 Executando finalização de fallback')
        await finalizeTestAutomatically(answers)
      } else {
        console.log('⚠️ Questão 100 não foi respondida ainda')
      }
    } else {
      console.log('⏳ Condições para finalização não atendidas:')
      console.log('   - Total respostas === 100?', totalAnswers === 100)
      console.log('   - !hasAutoFinalized?', !hasAutoFinalized)
      console.log('   - !isSubmitting?', !isSubmitting)
      console.log('   - !isFinalizingRef.current?', !isFinalizingRef.current)
    }
  }
  
  // Função de fallback para finalização manual
  const handleManualFinalization = async () => {
    console.log('🔧 handleManualFinalization chamada')
    const totalAnswers = Object.keys(answers).length
    
    if (totalAnswers < 100) {
      toast({
        title: "Teste incompleto",
        description: `Você precisa responder todas as 100 questões. Faltam ${100 - totalAnswers} respostas.`,
        variant: "destructive"
      })
      return
    }
    
    if (isSubmitting || hasAutoFinalized || isFinalizingRef.current) {
      console.log('⚠️ Finalização já em andamento')
      return
    }
    
    console.log('🚀 Iniciando finalização manual')
    isFinalizingRef.current = true
    setHasAutoFinalized(true)
    setIsSubmitting(true)
    
    try {
      await finalizeTestAutomatically(answers)
    } catch (error) {
      console.error('❌ Erro na finalização manual:', error)
      isFinalizingRef.current = false
      setHasAutoFinalized(false)
      setIsSubmitting(false)
    }
  }

  const handleAnswer = async (questionId: number, value: number) => {
    console.log('🔄 handleAnswer chamada para questionId:', questionId, 'valor:', value)
    console.log('🔍 Estado atual - isSubmitting:', isSubmitting, 'hasAutoFinalized:', hasAutoFinalized, 'isFinalizingRef:', isFinalizingRef.current)
    
    // Prevenir múltiplas execuções se já está finalizando
    if (isFinalizingRef.current || hasAutoFinalized || isSubmitting) {
      console.log('⚠️ handleAnswer bloqueado por finalização em andamento')
      return
    }
    
    // Prevenir múltiplas submissões da mesma resposta
    if (answers[questionId] === value) {
      console.log('⚠️ Resposta já foi submetida para esta pergunta')
      return
    }
    
    const newAnswers = { ...answers, [questionId]: value }
    console.log('📝 newAnswers criado:', Object.keys(newAnswers).length, 'respostas')
    setAnswers(newAnswers)
    
    // Salvar resposta no backend de forma assíncrona (não bloquear UI)
    saveAnswerToBackend(questionId, value).catch(error => {
      console.warn('⚠️ Erro ao salvar resposta no backend:', error)
    })
    
    // Verificar se é a última questão (ID 100) e se todas as 100 questões foram respondidas
    const isLastQuestion = questionId === 100
    const totalAnswers = Object.keys(newAnswers).length
    const isTestComplete = totalAnswers === 100
    
    console.log('🎯 Análise da finalização:')
    console.log('   - É a última questão (ID 100)?', isLastQuestion)
    console.log('   - Total de respostas:', totalAnswers)
    console.log('   - Teste completo?', isTestComplete)
    console.log('   - Deve finalizar?', isLastQuestion && isTestComplete)
    
    // Se respondeu a questão 100 e tem todas as 100 respostas, finalizar automaticamente
    if (isLastQuestion && isTestComplete) {
      console.log('🚀 INICIANDO FINALIZAÇÃO AUTOMÁTICA DO TESTE!')
      
      // Definir estados de finalização ANTES de chamar a função
      isFinalizingRef.current = true
      setHasAutoFinalized(true)
      setIsSubmitting(true)
      
      try {
        await finalizeTestAutomatically(newAnswers)
        console.log('✅ Finalização automática concluída com sucesso')
      } catch (error) {
        console.error('❌ Erro na finalização automática:', error)
        // Resetar estados em caso de erro
        isFinalizingRef.current = false
        setHasAutoFinalized(false)
        setIsSubmitting(false)
        
        toast({
          title: "Erro na finalização",
          description: "Ocorreu um erro ao finalizar o teste. Tente novamente.",
          variant: "destructive"
        })
      }
    } else if (!isLastQuestion && currentQuestion < questions.length - 1) {
      // Avançar para próxima questão apenas se não for a última
      console.log('➡️ Avançando para próxima questão:', currentQuestion + 1)
      setCurrentQuestion(prev => prev + 1)
    } else {
      console.log('🔄 Permanecendo na questão atual - aguardando finalização ou navegação manual')
    }
  }

  // useEffect para verificar finalização automática
  useEffect(() => {
    console.log('🔄 useEffect [answers] disparado - Total respostas:', Object.keys(answers).length)
    
    // Adicionar um pequeno delay para evitar execuções múltiplas
    const timeoutId = setTimeout(() => {
      checkAndFinalizeIfComplete()
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [answers, hasAutoFinalized, isSubmitting])

  const handleNext = () => {
    console.log('🔄 handleNext called - currentQuestion:', currentQuestion)
    if (currentQuestion < questions.length - 1) {
      console.log('✅ Advancing to next question:', currentQuestion + 1)
      setCurrentQuestion(prev => {
        console.log('📝 handleNext setCurrentQuestion - prev:', prev, 'new:', prev + 1)
        return prev + 1
      })
    } else {
      console.log('❌ Cannot advance - already at last question')
    }
  }

  const handlePrevious = () => {
    console.log('🔄 handlePrevious called - currentQuestion:', currentQuestion)
    if (currentQuestion > 0) {
      console.log('✅ Going to previous question:', currentQuestion - 1)
      setCurrentQuestion(prev => {
        console.log('📝 handlePrevious setCurrentQuestion - prev:', prev, 'new:', prev - 1)
        return prev - 1
      })
    } else {
      console.log('❌ Cannot go back - already at first question')
    }
  }

  /**
   * Cálculo dos resultados do Eneagrama baseado nas especificações científicas
   * 
   * Base científica:
   * - Riso, Don & Hudson, Russ – The Wisdom of the Enneagram
   * - Ginger Lapid-Bogda – Bringing Out the Best in Yourself at Work
   * - Helen Palmer – The Enneagram: Understanding Yourself and the Others in Your Life
   * 
   * Correlação com Big Five: Pesquisas mostram correlação entre Eneagrama e traços
   * do Big Five, aumentando sua credibilidade como ferramenta de autoconhecimento.
   */
  const calculateResults = (finalAnswers: Record<number, number>): TestResults => {
    // 1. Agrupamento: Cada pergunta pertence a um tipo (1 a 9)
    const rawScores = {
      type1: 0, type2: 0, type3: 0, type4: 0, type5: 0,
      type6: 0, type7: 0, type8: 0, type9: 0
    }
    
    // Contar perguntas por tipo para cálculo da pontuação máxima
    const questionCounts = {
      type1: 0, type2: 0, type3: 0, type4: 0, type5: 0,
      type6: 0, type7: 0, type8: 0, type9: 0
    }
    
    // 2. Pontuação: Cada resposta recebe de 1 a 5 pontos
    // 3. Soma por tipo: Somar as respostas de cada tipo → resultado bruto
    questions.forEach(question => {
      const answer = finalAnswers[question.id]
      const typeKey = `type${question.type}` as keyof typeof rawScores
      
      if (answer) {
        rawScores[typeKey] += answer
      }
      questionCounts[typeKey]++
    })
    
    // 4. Normalização: Converter em percentual para permitir comparação
    const normalizedScores: Record<string, number> = {}
    const percentageScores: Record<string, number> = {}
    
    Object.entries(rawScores).forEach(([type, score]) => {
      const questionCount = questionCounts[type as keyof typeof questionCounts]
      const maxPossibleScore = questionCount * 5 // Escala de 1-5
      const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0
      
      normalizedScores[type] = score
      percentageScores[type] = Math.round(percentage * 100) / 100 // Arredondar para 2 casas decimais
    })
    
    // 5. Rank: Ordenar do tipo com maior pontuação para o menor
    const rankedTypes = Object.entries(percentageScores)
      .sort(([,a], [,b]) => b - a)
      .map(([type, percentage], index) => ({
        type,
        percentage,
        rank: index + 1,
        rawScore: normalizedScores[type]
      }))
    
    // Identificar tipo dominante, secundário e ala (wing)
    const dominantType = rankedTypes[0]
    const secondaryType = rankedTypes[1]
    
    // Determinar ala (wing) - tipos adjacentes ao dominante
    const dominantTypeNumber = parseInt(dominantType.type.replace('type', ''))
    const adjacentTypes = [
      dominantTypeNumber === 1 ? 9 : dominantTypeNumber - 1,
      dominantTypeNumber === 9 ? 1 : dominantTypeNumber + 1
    ]
    
    // Encontrar qual tipo adjacente tem maior pontuação
    const wingCandidates = rankedTypes.filter(t => 
      adjacentTypes.includes(parseInt(t.type.replace('type', '')))
    )
    const wing = wingCandidates.length > 0 ? wingCandidates[0] : null
    
    const typeNames = {
      type1: 'Tipo 1 - O Perfeccionista',
      type2: 'Tipo 2 - O Prestativo',
      type3: 'Tipo 3 - O Realizador',
      type4: 'Tipo 4 - O Individualista',
      type5: 'Tipo 5 - O Investigador',
      type6: 'Tipo 6 - O Leal',
      type7: 'Tipo 7 - O Entusiasta',
      type8: 'Tipo 8 - O Desafiador',
      type9: 'Tipo 9 - O Pacificador'
    }
    
    // Determinar nível de desenvolvimento baseado na pontuação percentual
    const getDevelopmentLevel = (percentage: number) => {
      if (percentage >= 80) return 'saudável'
      if (percentage >= 60) return 'médio'
      return 'não saudável'
    }
    
    const wingNotation = wing ? 
      `${dominantTypeNumber}w${wing.type.replace('type', '')}` : 
      dominantTypeNumber.toString()

    return {
      // Pontuações brutas (compatibilidade com sistema existente)
      type1: normalizedScores.type1 || 0,
      type2: normalizedScores.type2 || 0,
      type3: normalizedScores.type3 || 0,
      type4: normalizedScores.type4 || 0,
      type5: normalizedScores.type5 || 0,
      type6: normalizedScores.type6 || 0,
      type7: normalizedScores.type7 || 0,
      type8: normalizedScores.type8 || 0,
      type9: normalizedScores.type9 || 0,
      
      // Novos campos com cálculo aprimorado
      percentageScores,
      rankedTypes,
      dominantType: typeNames[dominantType.type as keyof typeof typeNames],
      dominantTypePercentage: dominantType.percentage,
      secondaryType: typeNames[secondaryType.type as keyof typeof typeNames],
      secondaryTypePercentage: secondaryType.percentage,
      wing: wing ? typeNames[wing.type as keyof typeof typeNames] : null,
      wingNotation,
      wingPercentage: wing ? wing.percentage : 0,
      developmentLevel: getDevelopmentLevel(dominantType.percentage),
      
      // Metadados
      completedAt: new Date().toISOString(),
      calculationMethod: 'normalized_percentage',
      totalQuestions: questions.length,
      questionDistribution: questionCounts
    }
  }

  const completeTest = async (finalAnswers: Record<number, number>, isAutoFinalization = false) => {
    console.log('🏁 INICIANDO FINALIZAÇÃO DO TESTE')
    console.log('📊 Dados da finalização:')
    console.log('   - Total de respostas:', Object.keys(finalAnswers).length)
    console.log('   - É finalização automática?', isAutoFinalization)
    console.log('   - SessionId disponível?', !!sessionId)
    
    // Só exibir alerta se não for finalização automática
    if (Object.keys(finalAnswers).length < 100 && !isAutoFinalization) {
      console.warn('❌ Teste incompleto, faltam respostas')
      alert('Por favor, responda todas as questões antes de finalizar.')
      return
    }

    // Helper para aguardar a criação da sessão antes de submeter o teste
    const waitForSessionId = async (getSessionId: () => string | null, timeout = 5000, interval = 300): Promise<string | null> => {
      const start = Date.now()
      while (Date.now() - start < timeout) {
        const id = getSessionId()
        if (id) return id
        await new Promise(resolve => setTimeout(resolve, interval))
      }
      return null
    }
    
    setIsSubmitting(true)
    
    try {
      // Mostrar mensagem de progresso
      showSavingProgress('HumaniQ Eneagrama')
      
      const results = calculateResults(finalAnswers)
      console.log('Resultados calculados:', results)
      
      // Converter answers para o formato esperado pela API
      const formattedAnswers = Object.entries(finalAnswers).map(([questionId, value]) => ({
        questionId: questionId,
        value: value,
        metadata: {
          type: questions.find(q => q.id === parseInt(questionId))?.type
        }
      }))
      
      // Garantir que temos um sessionId válido antes de submeter
      const obtainedSessionId = await waitForSessionId(() => sessionId)
      if (!obtainedSessionId) {
        throw new Error('Não foi possível obter o sessionId para submeter o teste.')
      }

      // Preparar dados para a nova API segura
      const resultData = {
        tipoTeste: 'ENEAGRAMA',
        respostasCriptografadas: {
          ...results,
          answers: formattedAnswers
        },
        metadata: {
          testName: 'HumaniQ Eneagrama',
          testId: 'humaniq_eneagrama',
          sessionId: obtainedSessionId,
          duration: Math.floor((Date.now() - testStartTime) / 1000),
          testType: 'ENNEAGRAM',
          completedAt: new Date().toISOString(),
          version: '2.0'
        }
      }

      // Submeter para a nova API segura
      const response = await fetch('/api/colaborador/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(resultData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro ${response.status}`)
      }

      const responseData = await response.json()
      
      // Mostrar mensagem de sucesso
      showResultStorageSuccess('HumaniQ Eneagrama')

      // Aguardar um pouco para o usuário ver a mensagem
      setTimeout(() => {
        console.log('🎉 SUCESSO! Redirecionando para resultados com ID:', responseData.data.idResultado)
        router.push(`/colaborador/personalidade/eneagrama/resultado?id=${responseData.data.idResultado}`)
      }, 2000)
      
    } catch (error) {
      console.error('❌ ERRO CRÍTICO ao submeter teste:', error)
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A')
      
      showResultStorageError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Resetar estados de finalização em caso de erro
      isFinalizingRef.current = false
      setHasAutoFinalized(false)
    } finally {
      setIsSubmitting(false)
      console.log('🔄 Estados resetados - isSubmitting definido como false')
    }
  }

  // Verificação de segurança para evitar erro quando currentQuestion está fora dos limites
  const currentQ = questions[currentQuestion]
  if (!currentQ) {
    console.error('Erro: currentQ é undefined. currentQuestion:', currentQuestion, 'questions.length:', questions.length)
    // Redirecionar para a primeira pergunta se currentQuestion estiver fora dos limites
    if (currentQuestion >= questions.length) {
      setCurrentQuestion(questions.length - 1)
    } else if (currentQuestion < 0) {
      setCurrentQuestion(0)
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pergunta...</p>
        </div>
      </div>
    )
  }
  
  const currentAnswer = answers[currentQ.id]
  const isLastQuestion = currentQuestion === questions.length - 1
  const canGoNext = currentQ && answers[currentQ.id] !== undefined
  const canGoPrevious = currentQuestion > 0
  const allQuestionsAnswered = Object.keys(answers).length === 100
  const canFinish = isLastQuestion && currentQ && answers[currentQ.id] !== undefined

  const getTypeInfo = (type: number) => {
    const typeInfo = {
      1: { name: 'Perfeccionista', color: 'bg-red-100 text-red-700' },
      2: { name: 'Prestativo', color: 'bg-pink-100 text-pink-700' },
      3: { name: 'Realizador', color: 'bg-yellow-100 text-yellow-700' },
      4: { name: 'Individualista', color: 'bg-purple-100 text-purple-700' },
      5: { name: 'Investigador', color: 'bg-blue-100 text-blue-700' },
      6: { name: 'Leal', color: 'bg-indigo-100 text-indigo-700' },
      7: { name: 'Entusiasta', color: 'bg-green-100 text-green-700' },
      8: { name: 'Desafiador', color: 'bg-orange-100 text-orange-700' },
      9: { name: 'Pacificador', color: 'bg-teal-100 text-teal-700' }
    }
    return typeInfo[type as keyof typeof typeInfo]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Verde Escuro - Seguindo exatamente o padrão da imagem */}
      <div className="bg-green-800 text-white px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo Circular e Título */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Circle className="h-7 w-7 text-green-800" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HumaniQ Eneagrama</h1>
              <p className="text-green-100 text-sm">Teste de Personalidade</p>
            </div>
          </div>
          
          {/* Contador de Questões */}
          <div className="text-right">
            <p className="text-green-100 text-sm">Questão</p>
            <p className="text-2xl font-bold">{currentQ?.id || currentQuestion + 1}/100</p>
            
          </div>
        </div>
        
        {/* Barra de Progresso Verde */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="w-full bg-green-700 rounded-full h-3">
            <div 
              className="bg-green-300 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Botão Voltar */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/colaborador/personalidade/eneagrama/introducao')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Card da Pergunta Centralizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* Badge do Tipo */}
          <div className="mb-6">
            <Badge 
              className={`px-4 py-2 text-sm font-medium rounded-full ${getTypeInfo(currentQ.type).color}`}
            >
              Tipo {currentQ.type} - {getTypeInfo(currentQ.type).name}
            </Badge>
          </div>
          
          {/* Pergunta */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {currentQ.text}
          </h2>
          
          {/* Labels da Escala */}
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-4">
            <span>Discordo</span>
            <span>Neutro</span>
            <span>Concordo</span>
          </div>
          
          {/* Barra de Gradiente Horizontal */}
          <div className="h-2 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-green-300 to-green-600 rounded-full mb-8"></div>
          
          {/* Escala Likert com 5 Opções Coloridas */}
          <div className="flex justify-center gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((value) => {
              const colors = {
                1: 'bg-red-300 hover:bg-red-400 text-white',
                2: 'bg-orange-300 hover:bg-orange-400 text-white',
                3: 'bg-yellow-300 hover:bg-yellow-400 text-gray-800',
                4: 'bg-green-300 hover:bg-green-400 text-white',
                5: 'bg-green-600 hover:bg-green-700 text-white'
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
                    onClick={() => handleAnswer(currentQ.id, value)}
                    className={`
                      w-16 h-16 rounded-xl font-bold text-xl transition-all duration-200 shadow-md
                      ${colors[value as keyof typeof colors]}
                      ${currentAnswer === value 
                        ? 'ring-4 ring-green-500 ring-opacity-50 scale-110 shadow-lg' 
                        : 'hover:scale-105'
                      }
                    `}
                  >
                    {value}
                  </button>
                  <span className="text-xs text-gray-600 mt-3 text-center max-w-20 leading-tight">
                    {labels[value as keyof typeof labels]}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Texto de Instrução Centralizado */}
          <div className="text-center">
            {currentAnswer ? (
              <p className="text-green-600 font-medium">Resposta selecionada</p>
            ) : (
              <p className="text-gray-500">Selecione uma resposta para continuar</p>
            )}
          </div>
        </div>

        {/* Navegação Inferior */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="text-center text-gray-500">
            Selecione uma resposta para continuar
          </div>

          {isLastQuestion ? (
            <div className="flex flex-col gap-2">
              {isSubmitting ? (
                <div className="flex items-center gap-2 px-6 py-3 text-green-600 font-medium">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  Finalizando automaticamente...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-6 py-3 text-green-600 font-medium">
                    Responda para finalizar automaticamente
                  </div>
                  {Object.keys(answers).length === 100 && !hasAutoFinalized && (
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-sm text-amber-600">
                        ⚠️ Finalização automática não funcionou? Clique abaixo:
                      </span>
                      <Button
                        onClick={handleManualFinalization}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Finalizar Teste Manualmente
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              Próxima
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}