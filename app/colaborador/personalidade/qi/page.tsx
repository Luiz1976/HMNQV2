'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Brain, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number // índice da resposta correta (0-3)
  dimension: string
  dimensionColor: string
}

// Gabarito: 1-b, 2-d, 3-c, 4-a, 5-a, 6-a, 7-d, 8-b, 9-b, 10-b, 11-c, 12-a, 13-c, 14-b, 15-b, 16-c, 17-a, 18-b, 19-d, 20-a
const questions: Question[] = [
  // Parte 1: Raciocínio Lógico (5 questões)
  {
    id: 1,
    text: "Se todos os pássaros voam e o papagaio é um pássaro, então:",
    options: ["O papagaio não voa", "O papagaio voa", "O papagaio nada", "O papagaio corre"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Lógico",
    dimensionColor: "bg-emerald-500"
  },
  {
    id: 2,
    text: "Qual é o próximo número da sequência: 2, 4, 8, 16, ___",
    options: ["18", "20", "24", "32"],
    correctAnswer: 3, // d
    dimension: "Raciocínio Lógico",
    dimensionColor: "bg-emerald-500"
  },
  {
    id: 3,
    text: "Se Ana é mais velha que Beatriz, e Beatriz é mais velha que Carla, quem é a mais nova?",
    options: ["Ana", "Beatriz", "Carla", "Não é possível saber"],
    correctAnswer: 2, // c
    dimension: "Raciocínio Lógico",
    dimensionColor: "bg-emerald-500"
  },
  {
    id: 4,
    text: "Qual alternativa completa a sequência lógica: AB, CD, EF, GH, ___",
    options: ["IJ", "HI", "JK", "KL"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Lógico",
    dimensionColor: "bg-emerald-500"
  },
  {
    id: 5,
    text: "Se todos os livros da estante são vermelhos e todos os vermelhos são grandes, então:",
    options: ["Todos os livros são grandes", "Todos os livros são pequenos", "Nenhum livro é grande", "Nenhum livro é vermelho"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Lógico",
    dimensionColor: "bg-emerald-500"
  },

  // Parte 2: Raciocínio Verbal (5 questões)
  {
    id: 6,
    text: "Complete a analogia: Médico é para hospital assim como professor é para:",
    options: ["Escola", "Igreja", "Mercado", "Cinema"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Verbal",
    dimensionColor: "bg-blue-500"
  },
  {
    id: 7,
    text: "Qual palavra não pertence ao grupo?",
    options: ["Maçã", "Banana", "Laranja", "Tomate"],
    correctAnswer: 3, // d
    dimension: "Raciocínio Verbal",
    dimensionColor: "bg-blue-500"
  },
  {
    id: 8,
    text: "Assinale a alternativa que apresenta um sinônimo de \"rápido\":",
    options: ["Lento", "Veloz", "Fraco", "Pequeno"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Verbal",
    dimensionColor: "bg-blue-500"
  },
  {
    id: 9,
    text: "Complete a frase: O sol nasce no ___ e se põe no ___.",
    options: ["Norte/Sul", "Leste/Oeste", "Oeste/Leste", "Sul/Norte"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Verbal",
    dimensionColor: "bg-blue-500"
  },
  {
    id: 10,
    text: "Qual é o antônimo de \"feliz\"?",
    options: ["Alegre", "Triste", "Contente", "Satisfeito"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Verbal",
    dimensionColor: "bg-blue-500"
  },

  // Parte 3: Raciocínio Numérico (5 questões)
  {
    id: 11,
    text: "Qual é a soma de 45 + 37?",
    options: ["72", "82", "92", "102"],
    correctAnswer: 2, // c
    dimension: "Raciocínio Numérico",
    dimensionColor: "bg-purple-500"
  },
  {
    id: 12,
    text: "Se um produto custa R$ 120,00 e está com 25% de desconto, qual o valor final?",
    options: ["R$ 90,00", "R$ 100,00", "R$ 95,00", "R$ 85,00"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Numérico",
    dimensionColor: "bg-purple-500"
  },
  {
    id: 13,
    text: "Qual é o próximo número da sequência: 5, 10, 20, 40, ___",
    options: ["45", "60", "80", "100"],
    correctAnswer: 2, // c
    dimension: "Raciocínio Numérico",
    dimensionColor: "bg-purple-500"
  },
  {
    id: 14,
    text: "Se um bolo é dividido igualmente entre 8 pessoas e custa R$ 48,00, quanto cada um paga?",
    options: ["R$ 5,00", "R$ 6,00", "R$ 7,00", "R$ 8,00"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Numérico",
    dimensionColor: "bg-purple-500"
  },
  {
    id: 15,
    text: "Qual é o resultado de 7 x 8?",
    options: ["54", "56", "58", "64"],
    correctAnswer: 1, // b
    dimension: "Raciocínio Numérico",
    dimensionColor: "bg-purple-500"
  },

  // Parte 4: Raciocínio Espacial (5 questões)
  {
    id: 16,
    text: "Se um cubo tem todas as faces pintadas e é cortado em 27 cubos menores iguais, quantos cubos menores terão exatamente 1 face pintada?",
    options: ["6", "8", "12", "24"],
    correctAnswer: 2, // c
    dimension: "Raciocínio Espacial",
    dimensionColor: "bg-orange-500"
  },
  {
    id: 17,
    text: "Qual figura completa a sequência: círculo, quadrado, triângulo, círculo, quadrado, ___",
    options: ["Triângulo", "Círculo", "Quadrado", "Retângulo"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Espacial",
    dimensionColor: "bg-orange-500"
  },
  {
    id: 18,
    text: "Se você está olhando para o sul e gira 270° à direita, para que direção estará olhando?",
    options: ["Oeste", "Norte", "Leste", "Sul"],
    correctAnswer: 2, // c (corrigido: 270° à direita do sul = leste)
    dimension: "Raciocínio Espacial",
    dimensionColor: "bg-orange-500"
  },
  {
    id: 19,
    text: "Um retângulo tem 8 cm de largura e 5 cm de altura. Qual é a sua área?",
    options: ["13 cm²", "20 cm²", "30 cm²", "40 cm²"],
    correctAnswer: 3, // d
    dimension: "Raciocínio Espacial",
    dimensionColor: "bg-orange-500"
  },
  {
    id: 20,
    text: "Se um relógio marca 3 horas, qual ângulo (em graus) há entre o ponteiro das horas e o dos minutos?",
    options: ["90°", "60°", "120°", "180°"],
    correctAnswer: 0, // a
    dimension: "Raciocínio Espacial",
    dimensionColor: "bg-orange-500"
  }
]

export default function QITestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime] = useState(Date.now())
  const [showValidation, setShowValidation] = useState(false)

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const hasAnswer = answers[currentQ.id] !== undefined

  const handleAnswer = (optionIndex: number) => {
    console.log('🔥 handleAnswer chamada com valor:', optionIndex, 'para questão:', currentQ.id)
    console.log('🔥 Estado atual das respostas:', answers)
    
    setAnswers(prev => {
      const newAnswers = { ...prev, [currentQ.id]: optionIndex }
      console.log('🔥 Novas respostas:', newAnswers)
      return newAnswers
    })
    setShowValidation(false)
    
    // Auto-save (simulate API call)
    console.log('Salvando resposta:', { questionId: currentQ.id, value: optionIndex })
    
    // Avanço automático após seleção
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Finalizar teste se for a última questão
        console.log('🔥 Finalizando teste automaticamente - última questão respondida')
        finishTest()
      }
    }, 800)
  }

  const handleAutoAdvance = () => {
    // Esta função não é mais necessária pois a lógica foi movida para handleAnswer
    // Mantida para compatibilidade, mas não faz nada
  }

  const handleNext = () => {
    if (!hasAnswer) {
      setShowValidation(true)
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Finalizar teste
      finishTest()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleBack = () => {
    router.push('/colaborador/personalidade/qi/introducao')
  }

  const finishTest = async () => {
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000 / 60) // em minutos
    
    // Calcular resultados por dimensão
    const results = calculateResults()
    
    // Preparar dados para salvar no localStorage no formato esperado pela página de resultados
    const qiResults = {
      raciocinio_logico: results['Raciocínio Lógico']?.score || 0,
      raciocinio_verbal: results['Raciocínio Verbal']?.score || 0,
      raciocinio_numerico: results['Raciocínio Numérico']?.score || 0,
      raciocinio_espacial: results['Raciocínio Espacial']?.score || 0,
      pontuacao_total: results['Total']?.score || 0,
      pontuacao_maxima: 20,
      percentual_acertos: results['Total']?.percentage || 0,
      duration,
      completedAt: new Date().toISOString()
    }
    
    // Salvar resultados no localStorage
    localStorage.setItem('qiTestResults', JSON.stringify(qiResults))
    
    console.log('Finalizando teste QI:', {
      answers,
      results,
      qiResults,
      duration,
      completedAt: new Date().toISOString()
    })

    // Redirecionar para página de resultados
    router.push('/colaborador/personalidade/qi/resultado')
  }

  const calculateResults = () => {
    let totalScore = 0
    const dimensionScores: { [key: string]: { correct: number; total: number } } = {}
    
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        // Inicializar dimensão se não existir
        if (!dimensionScores[question.dimension]) {
          dimensionScores[question.dimension] = { correct: 0, total: 0 }
        }
        
        // Verificar se a resposta está correta
        const isCorrect = answer === question.correctAnswer
        if (isCorrect) {
          totalScore += 1
          dimensionScores[question.dimension].correct += 1
        }
        dimensionScores[question.dimension].total += 1
      }
    })
    
    // Calcular resultados por dimensão
    const results: { [key: string]: { score: number; percentage: number } } = {}
    Object.keys(dimensionScores).forEach(dimension => {
      const { correct, total } = dimensionScores[dimension]
      const percentage = total > 0 ? (correct / total) * 100 : 0
      results[dimension] = { score: correct, percentage }
    })
    
    // Adicionar pontuação total
    results['Total'] = { score: totalScore, percentage: (totalScore / questions.length) * 100 }
    
    return results
  }

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      // Timer logic can be added here if needed
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">HumaniQ QI</h1>
              <p className="text-green-100">Teste de Atenção e Raciocínio</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100">Questão</p>
            <p className="text-xl font-bold">{currentQuestion + 1}/{questions.length}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-green-600 rounded-full h-2">
            <div 
              className="bg-green-300 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-green-600 hover:bg-green-50 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Question Content */}
      <div className="px-6 pb-6">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-700 mb-4">
                {currentQ.dimension}
              </Badge>
              <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed mb-8">
                {currentQ.text}
              </h2>
            </div>



            {/* Custom QI Likert Scale with 4 options */}
            <div className="mb-8">
              <div className="w-full space-y-6">
                {/* Top Labels and Gradient Bar */}
                <div className="space-y-4">
                  {/* Labels */}
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span className="text-red-600">a)</span>
                    <span className="text-orange-600">b)</span>
                    <span className="text-yellow-600">c)</span>
                    <span className="text-green-600">d)</span>
                  </div>
                  
                  {/* Gradient Bar */}
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 to-green-400 shadow-sm"></div>
                </div>

                {/* Scale Buttons */}
                <div className="flex justify-center gap-6">
                  {currentQ.options.map((option, index) => {
                    const isSelected = answers[currentQ.id] === index
                    const colors = [
                      { 
                        normal: 'bg-red-300 hover:bg-red-400 text-red-900',
                        selected: 'bg-red-400 text-red-900 shadow-lg ring-2 ring-red-500'
                      },
                      { 
                        normal: 'bg-orange-300 hover:bg-orange-400 text-orange-900',
                        selected: 'bg-orange-400 text-orange-900 shadow-lg ring-2 ring-orange-500'
                      },
                      { 
                        normal: 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900',
                        selected: 'bg-yellow-400 text-yellow-900 shadow-lg ring-2 ring-yellow-500'
                      },
                      { 
                        normal: 'bg-green-300 hover:bg-green-400 text-green-900',
                        selected: 'bg-green-400 text-green-900 shadow-lg ring-2 ring-green-500'
                      }
                    ]
                    
                    return (
                      <div key={index} className="flex flex-col items-center space-y-3">
                        {/* Letter Button */}
                        <button
                          type="button"
                          onClick={() => handleAnswer(index)}
                          className={`w-16 h-16 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 focus:outline-none border-0 cursor-pointer ${
                            isSelected ? colors[index].selected : colors[index].normal
                          }`}
                        >
                          {String.fromCharCode(97 + index)}
                        </button>
                        
                        {/* Option Text */}
                        <span className="text-xs text-gray-600 text-center font-medium max-w-20 leading-tight">
                          {option}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Instructions */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500">Selecione uma resposta para continuar</p>
                </div>
              </div>
            </div>

            {showValidation && (
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm">
                  Selecione uma resposta para continuar
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 border-gray-300 text-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {!hasAnswer && (
                <p className="text-gray-500 text-sm">
                  Selecione uma resposta para continuar
                </p>
              )}

              <Button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="bg-green-400 hover:bg-green-500 text-white flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                {currentQuestion < questions.length - 1 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}