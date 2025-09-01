'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, Trophy } from 'lucide-react'

// Questões do HumaniQ Valores (40 questões baseadas nos 10 valores de Schwartz)
const questions = [
  {
    id: 1,
    text: "É importante para mim ter novas experiências e aventuras.",
    category: "estimulacao"
  },
  {
    id: 2,
    text: "Valorizo muito ter poder e influência sobre outras pessoas.",
    category: "poder"
  },
  {
    id: 3,
    text: "É fundamental para mim ajudar as pessoas ao meu redor.",
    category: "benevolencia"
  },
  {
    id: 4,
    text: "Prefiro seguir tradições e costumes estabelecidos.",
    category: "tradicao"
  },
  {
    id: 5,
    text: "Busco sempre o prazer e a diversão na vida.",
    category: "hedonismo"
  },
  {
    id: 6,
    text: "É importante para mim ser bem-sucedido e reconhecido.",
    category: "realizacao"
  },
  {
    id: 7,
    text: "Valorizo a igualdade e a justiça para todas as pessoas.",
    category: "universalismo"
  },
  {
    id: 8,
    text: "Prefiro ter uma vida estável e previsível.",
    category: "seguranca"
  },
  {
    id: 9,
    text: "Gosto de tomar minhas próprias decisões independentemente.",
    category: "autodeterminacao"
  },
  {
    id: 10,
    text: "É importante para mim seguir regras e normas sociais.",
    category: "conformidade"
  },
  // Adicionar mais 30 questões seguindo o mesmo padrão...
  {
    id: 11,
    text: "Busco constantemente desafios e mudanças em minha vida.",
    category: "estimulacao"
  },
  {
    id: 12,
    text: "É importante para mim ter autoridade e controle.",
    category: "poder"
  },
  {
    id: 13,
    text: "Dedico tempo para cuidar do bem-estar dos outros.",
    category: "benevolencia"
  },
  {
    id: 14,
    text: "Respeito e mantenho os valores da minha família.",
    category: "tradicao"
  },
  {
    id: 15,
    text: "Procuro aproveitar todos os prazeres que a vida oferece.",
    category: "hedonismo"
  },
  {
    id: 16,
    text: "Trabalho duro para alcançar meus objetivos pessoais.",
    category: "realizacao"
  },
  {
    id: 17,
    text: "Me preocupo com o bem-estar de toda a humanidade.",
    category: "universalismo"
  },
  {
    id: 18,
    text: "Valorizo a segurança e a proteção da minha família.",
    category: "seguranca"
  },
  {
    id: 19,
    text: "É fundamental para mim ter liberdade de escolha.",
    category: "autodeterminacao"
  },
  {
    id: 20,
    text: "Evito fazer coisas que possam ofender outras pessoas.",
    category: "conformidade"
  },
  {
    id: 21,
    text: "Gosto de explorar lugares e culturas diferentes.",
    category: "estimulacao"
  },
  {
    id: 22,
    text: "É importante para mim ter recursos e riqueza.",
    category: "poder"
  },
  {
    id: 23,
    text: "Sempre estou disposto(a) a ajudar quem precisa.",
    category: "benevolencia"
  },
  {
    id: 24,
    text: "Mantenho os costumes e tradições do meu grupo.",
    category: "tradicao"
  },
  {
    id: 25,
    text: "Busco experiências que me proporcionem prazer.",
    category: "hedonismo"
  },
  {
    id: 26,
    text: "É importante para mim demonstrar minhas habilidades.",
    category: "realizacao"
  },
  {
    id: 27,
    text: "Me preocupo com a proteção do meio ambiente.",
    category: "universalismo"
  },
  {
    id: 28,
    text: "Prefiro ambientes seguros e conhecidos.",
    category: "seguranca"
  },
  {
    id: 29,
    text: "Valorizo minha independência e autonomia.",
    category: "autodeterminacao"
  },
  {
    id: 30,
    text: "É importante para mim ser educado(a) e cortês.",
    category: "conformidade"
  },
  {
    id: 31,
    text: "Procuro sempre novas formas de me divertir.",
    category: "estimulacao"
  },
  {
    id: 32,
    text: "Gosto de estar em posições de liderança.",
    category: "poder"
  },
  {
    id: 33,
    text: "É fundamental para mim ser leal aos meus amigos.",
    category: "benevolencia"
  },
  {
    id: 34,
    text: "Respeito as tradições religiosas e culturais.",
    category: "tradicao"
  },
  {
    id: 35,
    text: "Valorizo momentos de prazer e relaxamento.",
    category: "hedonismo"
  },
  {
    id: 36,
    text: "Busco ser competente e eficaz no que faço.",
    category: "realizacao"
  },
  {
    id: 37,
    text: "Acredito na importância da tolerância e compreensão.",
    category: "universalismo"
  },
  {
    id: 38,
    text: "É importante para mim ter estabilidade financeira.",
    category: "seguranca"
  },
  {
    id: 39,
    text: "Valorizo minha criatividade e originalidade.",
    category: "autodeterminacao"
  },
  {
    id: 40,
    text: "Procuro sempre agir de acordo com as expectativas sociais.",
    category: "conformidade"
  }
]

const scaleOptions = [
    { value: '1', label: 'Discordo totalmente', color: 'from-red-300 to-red-400' },
    { value: '2', label: 'Discordo', color: 'from-orange-300 to-orange-400' },
    { value: '3', label: 'Neutro', color: 'from-yellow-300 to-yellow-400' },
    { value: '4', label: 'Concordo', color: 'from-green-300 to-green-400' },
    { value: '5', label: 'Concordo totalmente', color: 'from-emerald-300 to-emerald-400' }
  ]

export default function HumaniqValoresTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Criar sessão de teste quando o componente é montado
  useEffect(() => {
    const createTestSession = async () => {
      try {
        console.log('🔄 Criando sessão de teste HumaniQ VALORES...')
        const response = await fetch('/api/tests/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: 'cmehdpsrq00168wc06urx1lqb' // ID do teste HumaniQ VALORES
          })
        })

        if (!response.ok) {
          throw new Error('Erro ao criar sessão de teste')
        }

        const sessionData = await response.json()
        setSessionId(sessionData.sessionId)
        console.log('✅ Sessão criada:', sessionData.sessionId)
      } catch (error) {
        console.error('❌ Erro ao criar sessão:', error)
      }
    }

    createTestSession()
  }, [])

  const handleAnswer = async (value: string) => {
    const questionId = questions[currentQuestion].id
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // Salvar resposta na API se a sessão estiver criada
    if (sessionId) {
      try {
        await fetch('/api/tests/save-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            questionId,
            selectedOption: value,
            category: questions[currentQuestion].category
          })
        })
      } catch (error) {
        console.error('Erro ao salvar resposta:', error)
      }
    }
    
    // Avanço automático após 500ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setIsCompleted(true)
      }
    }, 500)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleFinish = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Calcular resultados
      const results = calculateResults(answers)
      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)
      
      // Se não temos sessionId, criar uma nova sessão
      let currentSessionId = sessionId
      if (!currentSessionId) {
        const sessionResponse = await fetch('/api/tests/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: 'cmehdpsrq00168wc06urx1lqb'
          })
        })
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          currentSessionId = sessionData.sessionId
        }
      }
      
      // Preparar dados para submissão
      const submissionData = {
        testId: 'cmehdpsrq00168wc06urx1lqb',
        sessionId: currentSessionId,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === parseInt(questionId))
          return {
            questionId: parseInt(questionId),
            selectedOption: answer.toString(),
            category: question?.category || ''
          }
        }),
        results: {
          categoryScores: results,
          dominantValues: results.sort((a, b) => b.score - a.score).slice(0, 3)
        },
        duration,
        metadata: {
          testName: 'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
          totalQuestions: questions.length,
          completedAt: new Date().toISOString()
        }
      }
      
      // Submeter para a API de resultados
      const submitResponse = await fetch('/api/colaborador/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      if (submitResponse.ok) {
        const submitData = await submitResponse.json()
        console.log('✅ Resultados salvos com sucesso:', submitData)
        
        // Salvar também no localStorage para compatibilidade
        localStorage.setItem('humaniq-valores-results', JSON.stringify(results))
        
        // Redirecionar para página de resultados
        if (submitData.success && submitData.testResult?.id) {
          router.push(`/colaborador/resultados/${submitData.testResult.id}?saved=1`)
        } else {
          router.push('/colaborador/psicossociais/humaniq-valores/resultado')
        }
      } else {
        throw new Error('Falha ao submeter resultados')
      }
      
    } catch (error) {
      console.error('❌ Erro ao finalizar teste:', error)
      // Em caso de erro, salvar no localStorage e continuar
      const results = calculateResults(answers)
      localStorage.setItem('humaniq-valores-results', JSON.stringify(results))
      router.push('/colaborador/psicossociais/humaniq-valores/resultado')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateResults = (answers: Record<number, string>) => {
    const categories: Record<string, number[]> = {
      estimulacao: [],
      poder: [],
      benevolencia: [],
      tradicao: [],
      hedonismo: [],
      realizacao: [],
      universalismo: [],
      seguranca: [],
      autodeterminacao: [],
      conformidade: []
    }

    // Agrupar respostas por categoria
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer && categories[question.category as keyof typeof categories]) {
        categories[question.category as keyof typeof categories].push(parseInt(answer))
      }
    })

    // Calcular médias por categoria
    const results = Object.entries(categories).map(([category, scores]) => {
      const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      return { category, score: average }
    })

    return results
  }

  const currentAnswer = answers[questions[currentQuestion]?.id]
  const canProceed = currentAnswer !== undefined

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Teste Concluído!
            </CardTitle>
            <CardDescription>
              Suas respostas foram registradas com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleFinish}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando resultados...' : 'Ver Resultados'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com gradiente */}
        <Card className="mb-6 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">HumaniQ VALORES</h1>
                  <p className="text-green-100">Mapa de Valores Pessoais e Profissionais</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Questão</p>
                <p className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</p>
              </div>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Categoria da questão */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
            {questions[currentQuestion]?.category.charAt(0).toUpperCase() + questions[currentQuestion]?.category.slice(1)}
          </Badge>
        </div>

        {/* Questão */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-8 leading-relaxed">
              {questions[currentQuestion]?.text}
            </h2>
            
            {/* Escala de concordância visual */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Discordo</span>
                <span>Neutro</span>
                <span>Concordo</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full"></div>
            </div>
            
            {/* Botões de resposta */}
            <div className="flex justify-center gap-4 mb-6">
              {scaleOptions.map((option) => (
                <button
                   key={option.value}
                   onClick={() => handleAnswer(option.value)}
                   className={`
                     w-16 h-16 rounded-lg text-white font-bold text-lg
                     bg-gradient-to-br ${option.color}
                     hover:scale-110 transform transition-all duration-200
                     shadow-lg hover:shadow-xl
                     ${currentAnswer === option.value ? 'ring-4 ring-blue-300 scale-110' : ''}
                   `}
                 >
                   {option.value}
                 </button>
              ))}
            </div>
            
            {/* Labels dos botões */}
            <div className="flex justify-center gap-4">
              {scaleOptions.map((option) => (
                <div key={`label-${option.value}`} className="w-16 text-center">
                  <p className="text-xs text-gray-600 font-medium">
                    {option.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Selecione uma resposta para continuar
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            Próxima
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}