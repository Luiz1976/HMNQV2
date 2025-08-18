'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LikertScale } from '@/components/ui/likert-scale'
import { Building2, Clock, Users, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface Question {
  id: string
  text: string
  options: {
    value: number
    label: string
  }[]
}

const questions: Question[] = [
  {
    id: '1',
    text: 'Como você avalia o ambiente de trabalho na sua empresa?',
    options: [
      { value: 1, label: 'Muito insatisfatório' },
      { value: 2, label: 'Insatisfatório' },
      { value: 3, label: 'Neutro' },
      { value: 4, label: 'Satisfatório' },
      { value: 5, label: 'Muito satisfatório' }
    ]
  },
  {
    id: '2',
    text: 'O quanto você se sente valorizado pela sua equipe e liderança?',
    options: [
      { value: 1, label: 'Nada valorizado' },
      { value: 2, label: 'Pouco valorizado' },
      { value: 3, label: 'Moderadamente valorizado' },
      { value: 4, label: 'Muito valorizado' },
      { value: 5, label: 'Extremamente valorizado' }
    ]
  },
  {
    id: '3',
    text: 'Como você avalia a comunicação interna da empresa?',
    options: [
      { value: 1, label: 'Muito ruim' },
      { value: 2, label: 'Ruim' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Boa' },
      { value: 5, label: 'Excelente' }
    ]
  }
]

export default function ClimaOrganizacionalTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswered = answers[questions[currentQuestion].id] !== undefined

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (!hasAnswered) {
      toast.error('Por favor, selecione uma resposta antes de continuar.')
      return
    }

    if (isLastQuestion) {
      completeTest()
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const completeTest = async () => {
    setIsCompleting(true)
    
    try {
      // Simular envio dos resultados
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Teste concluído com sucesso!')
      
      // Redirecionar para resultados
      setTimeout(() => {
        router.push('/colaborador/corporativos/clima-organizacional/resultado')
      }, 1000)
    } catch (error) {
      toast.error('Erro ao finalizar o teste. Tente novamente.')
      setIsCompleting(false)
    }
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-purple-600" />
              Avaliação de Clima Organizacional
            </h1>
            <p className="text-gray-600">Questão {currentQuestion + 1} de {questions.length}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso do teste</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestionData.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LikertScale
            question={currentQuestionData.text}
            value={answers[currentQuestionData.id]}
            onChange={(value) => handleAnswer(currentQuestionData.id, value)}
            hideQuestion={true}
            autoAdvance={true}
            onAutoAdvance={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                completeTest()
              }
            }}
            autoAdvanceDelay={600}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!hasAnswered || isCompleting || isLastQuestion}
          className="flex items-center gap-2"
        >
          Próxima
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Info */}
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Confidencialidade:</strong> Suas respostas são anônimas e serão utilizadas 
          apenas para análises organizacionais agregadas.
        </AlertDescription>
      </Alert>
    </div>
  )
}