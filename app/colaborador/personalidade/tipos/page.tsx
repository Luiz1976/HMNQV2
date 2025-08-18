'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Question {
  id: number
  text: string
  category: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
  dichotomy: 'EI' | 'SN' | 'TF' | 'JP'
}

interface Results {
  personalityType: string
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
}

const questions: Question[] = [
  // Dicotomia Extroversão/Introversão (E/I) - Questões 1-10
  { id: 1, text: "Gosto de iniciar conversas com pessoas novas.", category: "E", dichotomy: "EI" },
  { id: 2, text: "Sinto-me energizado ao participar de eventos sociais.", category: "E", dichotomy: "EI" },
  { id: 3, text: "Prefiro atividades em grupo a tarefas solitárias.", category: "E", dichotomy: "EI" },
  { id: 4, text: "Tenho facilidade em me expressar verbalmente.", category: "E", dichotomy: "EI" },
  { id: 5, text: "Recarrego minha energia em ambientes silenciosos.", category: "I", dichotomy: "EI" },
  { id: 6, text: "Gosto de refletir antes de falar.", category: "I", dichotomy: "EI" },
  { id: 7, text: "Prefiro escrever do que falar em público.", category: "I", dichotomy: "EI" },
  { id: 8, text: "Evito ambientes muito movimentados.", category: "I", dichotomy: "EI" },
  { id: 9, text: "Sinto-me cansado após muitas interações sociais.", category: "I", dichotomy: "EI" },
  { id: 10, text: "Fico entusiasmado quando tenho companhia para realizar atividades.", category: "E", dichotomy: "EI" },

  // Dicotomia Sensação/Intuição (S/N) - Questões 11-20
  { id: 11, text: "Gosto de trabalhar com fatos concretos e verificáveis.", category: "S", dichotomy: "SN" },
  { id: 12, text: "Prefiro seguir instruções claras e detalhadas.", category: "S", dichotomy: "SN" },
  { id: 13, text: "Presto atenção aos detalhes do presente.", category: "S", dichotomy: "SN" },
  { id: 14, text: "Valorizo experiências práticas em vez de teorias.", category: "S", dichotomy: "SN" },
  { id: 15, text: "Tenho facilidade em imaginar diferentes cenários futuros.", category: "N", dichotomy: "SN" },
  { id: 16, text: "Penso sobre o 'todo' antes de olhar as partes.", category: "N", dichotomy: "SN" },
  { id: 17, text: "Sinto-me atraído por ideias inovadoras.", category: "N", dichotomy: "SN" },
  { id: 18, text: "Gosto de questionar padrões e regras estabelecidas.", category: "N", dichotomy: "SN" },
  { id: 19, text: "Tenho insights espontâneos com frequência.", category: "N", dichotomy: "SN" },
  { id: 20, text: "Gosto de explorar possibilidades e alternativas.", category: "N", dichotomy: "SN" },

  // Dicotomia Pensamento/Sentimento (T/F) - Questões 21-30
  { id: 21, text: "Tomo decisões com base em lógica e justiça.", category: "T", dichotomy: "TF" },
  { id: 22, text: "Analiso prós e contras de forma objetiva.", category: "T", dichotomy: "TF" },
  { id: 23, text: "Prefiro ser justo a ser gentil.", category: "T", dichotomy: "TF" },
  { id: 24, text: "Valorizo argumentos racionais.", category: "T", dichotomy: "TF" },
  { id: 25, text: "Considero os sentimentos das pessoas ao tomar decisões.", category: "F", dichotomy: "TF" },
  { id: 26, text: "Preocupo-me com o impacto emocional das minhas ações.", category: "F", dichotomy: "TF" },
  { id: 27, text: "Busco harmonia nos relacionamentos.", category: "F", dichotomy: "TF" },
  { id: 28, text: "Evito magoar as pessoas, mesmo quando discordo.", category: "F", dichotomy: "TF" },
  { id: 29, text: "Presto atenção à linguagem corporal e emoções.", category: "F", dichotomy: "TF" },
  { id: 30, text: "Tenho empatia por quem está em dificuldade.", category: "F", dichotomy: "TF" },

  // Dicotomia Julgamento/Percepção (J/P) - Questões 31-40
  { id: 31, text: "Gosto de manter uma rotina organizada.", category: "J", dichotomy: "JP" },
  { id: 32, text: "Planejo atividades com antecedência.", category: "J", dichotomy: "JP" },
  { id: 33, text: "Fico desconfortável com imprevistos.", category: "J", dichotomy: "JP" },
  { id: 34, text: "Cumpro prazos rigorosamente.", category: "J", dichotomy: "JP" },
  { id: 35, text: "Sinto-me mais produtivo com horários flexíveis.", category: "P", dichotomy: "JP" },
  { id: 36, text: "Prefiro deixar decisões em aberto.", category: "P", dichotomy: "JP" },
  { id: 37, text: "Gosto de improvisar quando necessário.", category: "P", dichotomy: "JP" },
  { id: 38, text: "Adio decisões para reunir mais informações.", category: "P", dichotomy: "JP" },
  { id: 39, text: "Mudo de ideia com facilidade.", category: "P", dichotomy: "JP" },
  { id: 40, text: "Gosto de começar projetos mesmo sem todos os detalhes.", category: "P", dichotomy: "JP" }
]

interface LikertScaleProps {
  onSelect: (value: number) => void
  selectedValue: number | null
  disabled?: boolean
}

function LikertScale({ onSelect, selectedValue, disabled }: LikertScaleProps) {
  const options = [
    { value: 1, label: 'Discordo totalmente', color: 'bg-red-300 hover:bg-red-400' },
    { value: 2, label: 'Discordo', color: 'bg-orange-300 hover:bg-orange-400' },
    { value: 3, label: 'Neutro', color: 'bg-yellow-300 hover:bg-yellow-400' },
    { value: 4, label: 'Concordo', color: 'bg-green-300 hover:bg-green-400' },
    { value: 5, label: 'Concordo totalmente', color: 'bg-green-500 hover:bg-green-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Barra colorida */}
      <div className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-500 rounded-full"></div>
      
      {/* Labels das extremidades */}
      <div className="flex justify-between text-sm text-gray-600 px-2">
        <span className="text-red-600 font-medium">Discordo</span>
        <span className="text-gray-500 font-medium">Neutro</span>
        <span className="text-green-600 font-medium">Concordo</span>
      </div>

      {/* Botões da escala */}
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => !disabled && onSelect(option.value)}
            disabled={disabled}
            className={`
              w-16 h-16 rounded-xl font-bold text-lg transition-all duration-200
              ${option.color}
              ${selectedValue === option.value ? 'ring-4 ring-blue-500 scale-110' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105'}
              shadow-lg
            `}
          >
            {option.value}
          </button>
        ))}
      </div>

      {/* Labels dos botões */}
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <div key={option.value} className="w-16 text-center">
            <span className="text-xs text-gray-600 leading-tight">
              {option.label}
            </span>
          </div>
        ))}
      </div>

      {/* Texto de instrução */}
      <div className="text-center text-gray-500 text-sm mt-4">
        Selecione uma resposta para continuar
      </div>
    </div>
  )
}

export default function TiposTest() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [results, setResults] = useState<Results | null>(null)
  const [startTime] = useState(Date.now())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoAdvancing, setAutoAdvancing] = useState(false)

  // Validação inicial
  useEffect(() => {
    const start = searchParams.get('start')
    if (start !== 'true') {
      router.push('/colaborador/personalidade/tipos/introducao')
      return
    }
  }, [searchParams, router])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const calculateResults = (): Results => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    }

    // Soma pontos para cada categoria
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId))
      if (question) {
        const score = answer // Pontuação de 1-5
        scores[question.category] += score
      }
    })

    // Determina preferência para cada dicotomia (maior pontuação)
    const personalityType = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N', 
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P'
    ].join('')

    return {
      personalityType,
      scores
    }
  }

  const handleAnswerChange = (value: number) => {
    if (autoAdvancing) return
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))

    // Avanço automático após 500ms
    setAutoAdvancing(true)
    setTimeout(() => {
      setAutoAdvancing(false)
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }, 500)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    const calculatedResults = calculateResults()
    setResults(calculatedResults)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getInterpretation = (score: number) => {
    if (score >= 80) return { level: 'Muito Alto', color: 'text-green-600' }
    if (score >= 60) return { level: 'Alto', color: 'text-green-500' }
    if (score >= 40) return { level: 'Moderado', color: 'text-yellow-500' }
    if (score >= 20) return { level: 'Baixo', color: 'text-orange-500' }
    return { level: 'Muito Baixo', color: 'text-red-500' }
  }

  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, { name: string, description: string, strengths: string[], challenges: string[], workEnvironment: string }> = {
      'INTJ': { 
        name: 'Arquiteto', 
        description: 'Visionário estratégico com foco em sistemas e planejamento de longo prazo',
        strengths: ['Pensamento estratégico', 'Independência', 'Determinação', 'Visão de futuro'],
        challenges: ['Impaciência com ineficiência', 'Dificuldade com detalhes rotineiros', 'Pode parecer distante'],
        workEnvironment: 'Ambiente estruturado com autonomia para desenvolver estratégias e sistemas complexos'
      },
      'INTP': { 
        name: 'Pensador', 
        description: 'Analista lógico com paixão por teorias e sistemas conceituais',
        strengths: ['Análise lógica', 'Criatividade', 'Flexibilidade mental', 'Resolução de problemas'],
        challenges: ['Procrastinação', 'Dificuldade com prazos', 'Evita conflitos', 'Desorganização'],
        workEnvironment: 'Ambiente flexível que permita exploração de ideias e trabalho independente'
      },
      'ENTJ': { 
        name: 'Comandante', 
        description: 'Líder natural focado em eficiência e resultados organizacionais',
        strengths: ['Liderança', 'Organização', 'Determinação', 'Visão estratégica'],
        challenges: ['Impaciência', 'Pode ser dominador', 'Foco excessivo em resultados', 'Crítico'],
        workEnvironment: 'Posições de liderança com responsabilidade por resultados e equipes'
      },
      'ENTP': { 
        name: 'Inovador', 
        description: 'Empreendedor criativo que gera ideias e inspira mudanças',
        strengths: ['Criatividade', 'Entusiasmo', 'Adaptabilidade', 'Comunicação'],
        challenges: ['Dificuldade com rotina', 'Procrastinação', 'Perde interesse rapidamente', 'Desorganização'],
        workEnvironment: 'Ambiente dinâmico com variedade de projetos e oportunidades de inovação'
      },
      'INFJ': { 
        name: 'Advogado', 
        description: 'Idealista perspicaz focado em ajudar outros e criar mudanças positivas',
        strengths: ['Empatia', 'Visão', 'Determinação', 'Criatividade'],
        challenges: ['Perfeccionismo', 'Sensibilidade a críticas', 'Esgotamento', 'Evita conflitos'],
        workEnvironment: 'Ambiente colaborativo focado em desenvolvimento humano e causas significativas'
      },
      'INFP': { 
        name: 'Mediador', 
        description: 'Idealista autêntico guiado por valores pessoais profundos',
        strengths: ['Autenticidade', 'Criatividade', 'Empatia', 'Flexibilidade'],
        challenges: ['Sensibilidade', 'Procrastinação', 'Dificuldade com críticas', 'Evita conflitos'],
        workEnvironment: 'Ambiente que valorize criatividade, autonomia e alinhamento com valores pessoais'
      },
      'ENFJ': { 
        name: 'Protagonista', 
        description: 'Líder carismático focado no desenvolvimento e bem-estar das pessoas',
        strengths: ['Liderança inspiradora', 'Empatia', 'Comunicação', 'Organização'],
        challenges: ['Esgotamento por ajudar outros', 'Sensibilidade', 'Perfeccionismo', 'Evita conflitos'],
        workEnvironment: 'Posições que envolvam desenvolvimento de pessoas e trabalho em equipe'
      },
      'ENFP': { 
        name: 'Ativista', 
        description: 'Entusiasta criativo que inspira e conecta pessoas em torno de ideias',
        strengths: ['Entusiasmo', 'Criatividade', 'Comunicação', 'Flexibilidade'],
        challenges: ['Dificuldade com rotina', 'Procrastinação', 'Desorganização', 'Perde foco'],
        workEnvironment: 'Ambiente colaborativo e dinâmico com variedade e interação social'
      },
      'ISTJ': { 
        name: 'Logístico', 
        description: 'Organizador prático focado em responsabilidade e tradições estabelecidas',
        strengths: ['Confiabilidade', 'Organização', 'Atenção aos detalhes', 'Perseverança'],
        challenges: ['Resistência a mudanças', 'Inflexibilidade', 'Dificuldade com inovação', 'Estresse com pressão'],
        workEnvironment: 'Ambiente estruturado com processos claros e responsabilidades definidas'
      },
      'ISFJ': { 
        name: 'Protetor', 
        description: 'Cuidador dedicado focado em apoiar e proteger outros',
        strengths: ['Lealdade', 'Empatia', 'Confiabilidade', 'Atenção aos detalhes'],
        challenges: ['Dificuldade em dizer não', 'Evita conflitos', 'Subestima próprias necessidades', 'Resistência a mudanças'],
        workEnvironment: 'Ambiente colaborativo e harmonioso focado em ajudar pessoas'
      },
      'ESTJ': { 
        name: 'Executivo', 
        description: 'Administrador eficiente focado em organização e resultados práticos',
        strengths: ['Liderança', 'Organização', 'Eficiência', 'Determinação'],
        challenges: ['Inflexibilidade', 'Impaciência', 'Dificuldade com mudanças', 'Pode ser dominador'],
        workEnvironment: 'Posições de gestão com responsabilidade por processos e resultados'
      },
      'ESFJ': { 
        name: 'Cônsul', 
        description: 'Facilitador social focado em harmonia e bem-estar do grupo',
        strengths: ['Empatia', 'Organização', 'Lealdade', 'Comunicação'],
        challenges: ['Sensibilidade a críticas', 'Dificuldade com conflitos', 'Pode negligenciar próprias necessidades', 'Resistência a mudanças'],
        workEnvironment: 'Ambiente colaborativo com foco em relacionamentos e trabalho em equipe'
      },
      'ISTP': { 
        name: 'Virtuoso', 
        description: 'Solucionador prático que prefere ação direta e experiência hands-on',
        strengths: ['Resolução prática de problemas', 'Adaptabilidade', 'Calma sob pressão', 'Independência'],
        challenges: ['Dificuldade com planejamento', 'Evita compromissos', 'Comunicação limitada', 'Impaciência com teoria'],
        workEnvironment: 'Ambiente flexível com projetos práticos e autonomia para trabalhar'
      },
      'ISFP': { 
        name: 'Aventureiro', 
        description: 'Artista sensível guiado por valores pessoais e experiências estéticas',
        strengths: ['Criatividade', 'Flexibilidade', 'Empatia', 'Autenticidade'],
        challenges: ['Sensibilidade', 'Dificuldade com críticas', 'Procrastinação', 'Evita conflitos'],
        workEnvironment: 'Ambiente criativo e flexível que valorize expressão individual'
      },
      'ESTP': { 
        name: 'Empresário', 
        description: 'Pragmático energético focado em ação imediata e resultados tangíveis',
        strengths: ['Adaptabilidade', 'Energia', 'Pragmatismo', 'Comunicação'],
        challenges: ['Impaciência', 'Dificuldade com planejamento', 'Impulsividade', 'Evita teoria'],
        workEnvironment: 'Ambiente dinâmico com variedade, interação social e resultados imediatos'
      },
      'ESFP': { 
        name: 'Animador', 
        description: 'Entertainer espontâneo que traz energia positiva e foco nas pessoas',
        strengths: ['Entusiasmo', 'Empatia', 'Flexibilidade', 'Comunicação'],
        challenges: ['Dificuldade com planejamento', 'Sensibilidade', 'Procrastinação', 'Evita conflitos'],
        workEnvironment: 'Ambiente social e colaborativo com variedade e interação com pessoas'
      }
    }
    return descriptions[type] || { 
      name: type, 
      description: 'Tipo de personalidade único baseado na teoria de Carl Jung',
      strengths: ['Características únicas'], 
      challenges: ['Áreas de desenvolvimento'], 
      workEnvironment: 'Ambiente adequado às suas preferências cognitivas'
    }
  }

  if (results) {
    const typeDescription = getTypeDescription(results.personalityType)
    const answeredQuestions = Object.keys(answers).length
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6" />
              <h1 className="text-2xl font-bold">HumaniQ TIPOS</h1>
            </div>
            <p className="text-green-100">Teste de Tipos de Personalidade (MBTI) - Resultados</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Estatísticas do teste */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Tempo Total</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{answeredQuestions}/40</div>
              <div className="text-sm text-gray-600">Questões Respondidas</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{results.personalityType}</div>
              <div className="text-sm text-gray-600">Seu Tipo</div>
            </Card>
          </div>

          {/* Explicação do que significa o tipo */}
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-purple-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-800 mb-3">
                🔍 O que significa seu tipo {results.personalityType}?
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-red-600 mr-2">{results.personalityType[0]}</span>
                  <div>
                    <h4 className="font-semibold text-red-700">Energia</h4>
                    <p className="text-gray-600">
                      {results.personalityType[0] === 'E' ? 'Extroversão - Foca energia no mundo exterior' : 'Introversão - Foca energia no mundo interior'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-yellow-600 mr-2">{results.personalityType[1]}</span>
                  <div>
                    <h4 className="font-semibold text-yellow-700">Percepção</h4>
                    <p className="text-gray-600">
                      {results.personalityType[1] === 'S' ? 'Sensação - Prefere informações concretas e detalhes' : 'Intuição - Prefere padrões e possibilidades'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-blue-600 mr-2">{results.personalityType[2]}</span>
                  <div>
                    <h4 className="font-semibold text-blue-700">Decisão</h4>
                    <p className="text-gray-600">
                      {results.personalityType[2] === 'T' ? 'Pensamento - Toma decisões baseadas em lógica' : 'Sentimento - Toma decisões baseadas em valores'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-green-600 mr-2">{results.personalityType[3]}</span>
                  <div>
                    <h4 className="font-semibold text-green-700">Organização</h4>
                    <p className="text-gray-600">
                      {results.personalityType[3] === 'J' ? 'Julgamento - Prefere estrutura e planejamento' : 'Percepção - Prefere flexibilidade e adaptação'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-center text-sm text-purple-700">
                <strong>Seu tipo {results.personalityType}</strong> representa suas preferências naturais em cada uma dessas quatro dimensões da personalidade.
              </p>
            </div>
          </Card>

          {/* Descrição do tipo */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {typeDescription.name}
              </h3>
              <p className="text-lg text-gray-600">
                {typeDescription.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-700 mb-2">💪 Pontos Fortes</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {typeDescription.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-orange-700 mb-2">🎯 Desafios de Desenvolvimento</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {typeDescription.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-blue-700 mb-2">🏢 Ambiente de Trabalho Ideal</h4>
              <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{typeDescription.workEnvironment}</p>
            </div>
          </Card>

          {/* Resultados por dicotomia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3">Energia</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Extroversão (E): {results.scores.E}</span>
                <span className="text-sm font-medium">Introversão (I): {results.scores.I}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${(results.scores.E / (results.scores.E + results.scores.I)) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2 font-semibold">
                Preferência: {results.scores.E >= results.scores.I ? 'Extroversão' : 'Introversão'}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-yellow-700 mb-3">Percepção</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sensação (S): {results.scores.S}</span>
                <span className="text-sm font-medium">Intuição (N): {results.scores.N}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-yellow-500 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${(results.scores.S / (results.scores.S + results.scores.N)) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2 font-semibold">
                Preferência: {results.scores.S >= results.scores.N ? 'Sensação' : 'Intuição'}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Decisão</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Pensamento (T): {results.scores.T}</span>
                <span className="text-sm font-medium">Sentimento (F): {results.scores.F}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${(results.scores.T / (results.scores.T + results.scores.F)) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2 font-semibold">
                Preferência: {results.scores.T >= results.scores.F ? 'Pensamento' : 'Sentimento'}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Organização</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Julgamento (J): {results.scores.J}</span>
                <span className="text-sm font-medium">Percepção (P): {results.scores.P}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${(results.scores.J / (results.scores.J + results.scores.P)) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2 font-semibold">
                Preferência: {results.scores.J >= results.scores.P ? 'Julgamento' : 'Percepção'}
              </p>
            </Card>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => router.push('/colaborador/personalidade/tipos/introducao')}
              variant="outline"
            >
              Voltar à Introdução
            </Button>
            <Button 
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700"
            >
              Imprimir Resultados
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const selectedAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header verde */}
      <div className="bg-green-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">HumaniQ TIPOS</h1>
                <p className="text-green-100">Teste de Tipos de Personalidade</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">Questão</div>
              <div className="text-2xl font-bold">{currentQuestion + 1}/40</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-green-500 rounded-full h-3">
            <div 
              className="bg-green-300 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Botão voltar */}
        <Button 
          onClick={() => router.push('/colaborador/personalidade/tipos/introducao')}
          variant="ghost" 
          className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Card da questão */}
        <Card className="p-8 mb-8">
          {/* Badge do tipo */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {currentQ.category}
            </span>
          </div>

          {/* Pergunta */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
            {currentQ.text}
          </h2>

          {/* Escala Likert */}
          <LikertScale 
            onSelect={handleAnswerChange}
            selectedValue={selectedAnswer || null}
            disabled={autoAdvancing}
          />
        </Card>

        {/* Botões de navegação */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || autoAdvancing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="text-center text-gray-500 text-sm">
            {selectedAnswer ? 'Resposta selecionada' : 'Selecione uma resposta para continuar'}
          </div>

          <Button 
            onClick={handleNext}
            disabled={!selectedAnswer || autoAdvancing || isSubmitting}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? (
              isSubmitting ? 'Finalizando...' : 'Finalizar'
            ) : (
              <>
                Próxima
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}