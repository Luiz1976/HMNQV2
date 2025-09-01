'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Brain, Target, Users, Heart, Zap, AlertTriangle, Clock, Play, Trophy } from 'lucide-react'
import { LikertScale } from '@/components/ui/likert-scale'

interface Question {
  id: number
  text: string
  factor: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'
  facet: string
  reversed: boolean
}

interface Results {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  facets: Record<string, number>
}

const questions: Question[] = [
  // Neuroticismo (Neuroticism) - 24 questões
  { id: 1, text: "Eu me preocupo com as coisas.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 6, text: "Eu fico com raiva facilmente.", factor: 'neuroticism', facet: 'Raiva', reversed: false },
  { id: 11, text: "Eu me sinto triste com frequência.", factor: 'neuroticism', facet: 'Depressão', reversed: false },
  { id: 21, text: "Eu faço maratonas.", factor: 'neuroticism', facet: 'Autodisciplina', reversed: true },
  { id: 26, text: "Eu entro em pânico facilmente.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 31, text: "Eu temo o pior.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 36, text: "Eu fico irritado facilmente.", factor: 'neuroticism', facet: 'Raiva', reversed: false },
  { id: 41, text: "Eu não gosto de mim mesmo.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: false },
  { id: 51, text: "Eu raramente exagero.", factor: 'neuroticism', facet: 'Impulsividade', reversed: true },
  { id: 56, text: "Eu fico sobrecarregado pelos acontecimentos.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: false },
  { id: 61, text: "Eu tenho medo de muitas coisas.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 66, text: "Eu perco a paciência.", factor: 'neuroticism', facet: 'Raiva', reversed: false },
  { id: 71, text: "Eu estou sempre deprimido.", factor: 'neuroticism', facet: 'Depressão', reversed: false },
  { id: 81, text: "Eu sinto que sou incapaz de lidar com as coisas.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: false },
  { id: 86, text: "Eu fico estressado facilmente.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 91, text: "Eu não me irrito facilmente.", factor: 'neuroticism', facet: 'Raiva', reversed: true },
  { id: 96, text: "Eu me sinto confortável comigo mesmo.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: true },
  { id: 101, text: "Eu mantenho a calma sob pressão.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: true },
  { id: 106, text: "Eu olho para o lado positivo da vida.", factor: 'neuroticism', facet: 'Depressão', reversed: true },
  { id: 111, text: "Eu resisto facilmente às tentações.", factor: 'neuroticism', facet: 'Impulsividade', reversed: true },
  { id: 116, text: "Eu sou capaz de controlar meus desejos.", factor: 'neuroticism', facet: 'Impulsividade', reversed: true },
  { id: 30, text: "Eu entro nas coisas sem pensar.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 60, text: "Eu tomo decisões precipitadas.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 90, text: "Eu me apresso nas coisas.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },

  // Extroversão (Extraversion) - 24 questões
  { id: 2, text: "Eu faço amigos facilmente.", factor: 'extraversion', facet: 'Cordialidade', reversed: false },
  { id: 7, text: "Eu adoro festas grandes.", factor: 'extraversion', facet: 'Gregariedade', reversed: false },
  { id: 12, text: "Eu assumo o controle.", factor: 'extraversion', facet: 'Assertividade', reversed: false },
  { id: 22, text: "Eu adoro emoção.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 27, text: "Eu irradio alegria.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },
  { id: 32, text: "Eu me sinto confortável perto das pessoas.", factor: 'extraversion', facet: 'Cordialidade', reversed: false },
  { id: 37, text: "Eu converso com muitas pessoas diferentes em festas.", factor: 'extraversion', facet: 'Gregariedade', reversed: false },
  { id: 42, text: "Eu tento liderar os outros.", factor: 'extraversion', facet: 'Assertividade', reversed: false },
  { id: 47, text: "Eu estou sempre em movimento.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 52, text: "Eu procuro aventura.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 57, text: "Eu me divirto bastante.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },
  { id: 67, text: "Eu prefiro ficar sozinho.", factor: 'extraversion', facet: 'Gregariedade', reversed: true },
  { id: 72, text: "Eu assumo o controle das coisas.", factor: 'extraversion', facet: 'Assertividade', reversed: false },
  { id: 77, text: "Eu faço muita coisa no meu tempo livre.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 82, text: "Eu amo a vida.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },
  { id: 87, text: "Eu me divirto sendo imprudente.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 97, text: "Eu ajo de forma selvagem e louca.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 16, text: "Eu acho difícil abordar outras pessoas.", factor: 'extraversion', facet: 'Cordialidade', reversed: true },
  { id: 46, text: "Eu tenho medo de chamar atenção para mim.", factor: 'extraversion', facet: 'Assertividade', reversed: true },
  { id: 76, text: "Eu me sinto confortável apenas com amigos.", factor: 'extraversion', facet: 'Cordialidade', reversed: true },
  { id: 62, text: "Eu evito contato com outras pessoas.", factor: 'extraversion', facet: 'Gregariedade', reversed: true },
  { id: 87, text: "Eu mantenho os outros à distância.", factor: 'extraversion', facet: 'Cordialidade', reversed: true },
  { id: 92, text: "Eu evito multidões.", factor: 'extraversion', facet: 'Gregariedade', reversed: true },
  { id: 102, text: "Eu gosto de ir com calma.", factor: 'extraversion', facet: 'Atividade', reversed: true },

  // Abertura (Openness) - 24 questões
  { id: 3, text: "Eu tenho uma imaginação fértil.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 8, text: "Eu acredito na importância da arte.", factor: 'openness', facet: 'Interesses Artísticos', reversed: false },
  { id: 13, text: "Eu experimento minhas emoções intensamente.", factor: 'openness', facet: 'Emocionalidade', reversed: false },
  { id: 18, text: "Eu prefiro variedade à rotina.", factor: 'openness', facet: 'Aventura', reversed: false },
  { id: 23, text: "Eu adoro ler materiais desafiadores.", factor: 'openness', facet: 'Intelecto', reversed: false },
  { id: 28, text: "Eu tendo a votar em candidatos políticos liberais.", factor: 'openness', facet: 'Liberalismo', reversed: false },
  { id: 33, text: "Eu gosto de voos selvagens de fantasia.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 38, text: "Eu vejo beleza em coisas que outros talvez não percebam.", factor: 'openness', facet: 'Interesses Artísticos', reversed: false },
  { id: 48, text: "Eu prefiro continuar com coisas que conheço.", factor: 'openness', facet: 'Aventura', reversed: true },
  { id: 53, text: "Eu evito discussões filosóficas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 58, text: "Eu acredito que não existe certo ou errado absoluto.", factor: 'openness', facet: 'Liberalismo', reversed: false },
  { id: 63, text: "Eu adoro sonhar acordado.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 68, text: "Eu não gosto de poesia.", factor: 'openness', facet: 'Interesses Artísticos', reversed: true },
  { id: 73, text: "Eu raramente percebo minhas reações emocionais.", factor: 'openness', facet: 'Emocionalidade', reversed: true },
  { id: 78, text: "Eu não gosto de mudanças.", factor: 'openness', facet: 'Aventura', reversed: true },
  { id: 83, text: "Eu tenho dificuldade em entender ideias abstratas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 88, text: "Eu tendo a votar em candidatos políticos conservadores.", factor: 'openness', facet: 'Liberalismo', reversed: true },
  { id: 93, text: "Eu não gosto de ir a museus de arte.", factor: 'openness', facet: 'Interesses Artísticos', reversed: true },
  { id: 98, text: "Eu não entendo pessoas que ficam emotivas.", factor: 'openness', facet: 'Emocionalidade', reversed: true },
  { id: 103, text: "Eu sou apegado aos costumes convencionais.", factor: 'openness', facet: 'Aventura', reversed: true },
  { id: 108, text: "Eu não estou interessado em discussões teóricas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 113, text: "Eu acredito que devemos ser duros com o crime.", factor: 'openness', facet: 'Liberalismo', reversed: true },
  { id: 64, text: "Eu gosto de me perder em pensamentos.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 118, text: "Eu não estou interessado em discussões teóricas.", factor: 'openness', facet: 'Intelecto', reversed: true },

  // Amabilidade (Agreeableness) - 24 questões
  { id: 4, text: "Eu confio nos outros.", factor: 'agreeableness', facet: 'Confiança', reversed: false },
  { id: 14, text: "Eu adoro ajudar os outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: false },
  { id: 29, text: "Eu sinto simpatia pelos moradores de rua.", factor: 'agreeableness', facet: 'Altruísmo', reversed: false },
  { id: 34, text: "Eu acredito que os outros têm boas intenções.", factor: 'agreeableness', facet: 'Confiança', reversed: false },
  { id: 43, text: "Eu sinto as emoções dos outros.", factor: 'agreeableness', facet: 'Empatia', reversed: false },
  { id: 44, text: "Eu me preocupo com os outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: false },
  { id: 59, text: "Eu sinto compaixão por aqueles que estão em situação pior que a minha.", factor: 'agreeableness', facet: 'Altruísmo', reversed: false },
  { id: 64, text: "Eu confio no que as pessoas dizem.", factor: 'agreeableness', facet: 'Confiança', reversed: false },
  { id: 74, text: "Eu sou indiferente aos sentimentos dos outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 99, text: "Eu não reservo tempo para os outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 84, text: "Eu não estou interessado nos problemas dos outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 114, text: "Eu tento não pensar nos necessitados.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 9, text: "Eu uso os outros para meus próprios fins.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 39, text: "Eu trapaceio para progredir.", factor: 'agreeableness', facet: 'Honestidade', reversed: true },
  { id: 24, text: "Eu acredito que sou melhor que os outros.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 54, text: "Eu tenho uma opinião muito boa de mim mesmo.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 84, text: "Eu tenho uma opinião elevada sobre mim mesmo.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 109, text: "Eu me gabo das minhas virtudes.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 19, text: "Eu adoro uma boa briga.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 49, text: "Eu grito com as pessoas.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 79, text: "Eu insulto pessoas.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 104, text: "Eu me vingo dos outros.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 94, text: "Eu obstruo os planos dos outros.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 89, text: "Eu desconfio das pessoas.", factor: 'agreeableness', facet: 'Confiança', reversed: true },

  // Conscienciosidade (Conscientiousness) - 24 questões
  { id: 5, text: "Eu concluo tarefas com sucesso.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 10, text: "Eu gosto de arrumar.", factor: 'conscientiousness', facet: 'Ordem', reversed: false },
  { id: 15, text: "Eu cumpro minhas promessas.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: false },
  { id: 20, text: "Eu trabalho duro.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: false },
  { id: 25, text: "Eu estou sempre preparado.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: false },
  { id: 35, text: "Eu me destaco no que faço.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 50, text: "Eu faço mais do que esperam de mim.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: false },
  { id: 55, text: "Eu executo meus planos.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: false },
  { id: 45, text: "Eu digo a verdade.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: false },
  { id: 65, text: "Eu lido com as tarefas com fluidez.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 95, text: "Eu sei como fazer as coisas.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 100, text: "Eu não me incomodo com situações sociais difíceis.", factor: 'conscientiousness', facet: 'Autocontrole', reversed: false },
  { id: 40, text: "Eu frequentemente esqueço de colocar as coisas de volta no devido lugar.", factor: 'conscientiousness', facet: 'Ordem', reversed: true },
  { id: 75, text: "Eu quebro as regras.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: true },
  { id: 69, text: "Eu deixo uma bagunça no meu quarto.", factor: 'conscientiousness', facet: 'Ordem', reversed: true },
  { id: 105, text: "Eu quebro minhas promessas.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: true },
  { id: 80, text: "Eu trabalho apenas o suficiente para sobreviver.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: true },
  { id: 85, text: "Eu perco meu tempo.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: true },
  { id: 105, text: "Eu dedico pouco tempo e esforço ao meu trabalho.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: true },
  { id: 95, text: "Eu deixo meus pertences por aí.", factor: 'conscientiousness', facet: 'Ordem', reversed: true },
  { id: 110, text: "Eu tenho dificuldade em iniciar tarefas.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: true },
  { id: 115, text: "Eu ajo sem pensar.", factor: 'conscientiousness', facet: 'Deliberação', reversed: true },
  { id: 72, text: "Eu espero que outros mostrem o caminho.", factor: 'conscientiousness', facet: 'Liderança', reversed: true },
  { id: 70, text: "Eu tiro vantagem dos outros.", factor: 'conscientiousness', facet: 'Honestidade', reversed: true }
]

const factorNames = {
  openness: 'Abertura à Experiência',
  conscientiousness: 'Conscienciosidade',
  extraversion: 'Extroversão',
  agreeableness: 'Amabilidade',
  neuroticism: 'Neuroticismo'
}

const factorDescriptions = {
  openness: 'Curiosidade intelectual, criatividade e abertura para novas experiências',
  conscientiousness: 'Organização, disciplina, responsabilidade e orientação para objetivos',
  extraversion: 'Sociabilidade, assertividade, energia e busca por estimulação',
  agreeableness: 'Cooperação, confiança, empatia e orientação pró-social',
  neuroticism: 'Estabilidade emocional e tendência a experienciar emoções negativas'
}

const factorColors = {
  openness: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', progress: 'bg-blue-500' },
  conscientiousness: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', progress: 'bg-green-500' },
  extraversion: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', progress: 'bg-orange-500' },
  agreeableness: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', progress: 'bg-pink-500' },
  neuroticism: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', progress: 'bg-purple-500' }
}

function getScoreInterpretation(score: number) {
  if (score >= 80) return { level: 'Muito Alto', color: 'text-green-600', bg: 'bg-green-50' };
  if (score >= 60) return { level: 'Alto', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (score >= 40) return { level: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (score >= 20) return { level: 'Baixo', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { level: 'Muito Baixo', color: 'text-red-600', bg: 'bg-red-50' };
}

export default function HumaniqBigFivePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [isValidated, setIsValidated] = useState(false)

  // Validação do parâmetro start=true
  useEffect(() => {
    const startParam = searchParams.get('start')
    if (startParam === 'true') {
      setIsValidated(true)
      setTestStarted(true)
    } else {
      // Redirecionar para página de introdução se não tiver parâmetro start=true
      router.push('/colaborador/personalidade/big-five/introducao')
    }
  }, [searchParams, router])

  // Timer automático
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [testStarted, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateResults = (): Results => {
    const factorScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    }

    const facetScores: Record<string, number[]> = {}

    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        const score = question.reversed ? (6 - answer) : answer
        factorScores[question.factor] += score
        
        if (!facetScores[question.facet]) {
          facetScores[question.facet] = []
        }
        facetScores[question.facet].push(score)
      }
    })

    // Normalizar scores (0-100) - Agora com 120 questões
    const normalizedScores = {
      openness: Math.round((factorScores.openness / 120) * 100),
      conscientiousness: Math.round((factorScores.conscientiousness / 120) * 100),
      extraversion: Math.round((factorScores.extraversion / 120) * 100),
      agreeableness: Math.round((factorScores.agreeableness / 120) * 100),
      neuroticism: Math.round((factorScores.neuroticism / 120) * 100)
    }

    // Calcular médias das facetas
    const facetAverages: Record<string, number> = {}
    Object.keys(facetScores).forEach(facet => {
      const scores = facetScores[facet]
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      facetAverages[facet] = Math.round((average / 5) * 100)
    })

    return {
      ...normalizedScores,
      facets: facetAverages
    }
  }

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
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
    setIsSubmitting(true)
    
    try {
      const calculatedResults = calculateResults()
      setResults(calculatedResults)
      setShowResults(true)
    } catch (error) {
      console.error('Erro ao calcular resultados:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acesso ao teste...</p>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div id="bigfive-results" className="max-w-6xl mx-auto">
          {/* Header dos Resultados */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg">
                <Trophy className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Seus Resultados Big Five
                </h1>
                <p className="text-sm text-gray-500 mt-1">Perfil de Personalidade Completo</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Tempo: {formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>119 questões respondidas</span>
              </div>
            </div>
          </div>

          {/* Resultados dos Fatores */}
          <div className="grid gap-6 mb-8">
            {Object.entries(results).filter(([key]) => key !== 'facets').map(([factor, score]) => {
              const factorKey = factor as keyof typeof factorNames
              const interpretation = getScoreInterpretation(score)
              const colors = factorColors[factorKey]
              
              return (
                <Card key={factor} className={`border-2 ${colors.border} ${colors.bg}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`text-xl font-bold ${colors.text}`}>
                          {factorNames[factorKey]}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {factorDescriptions[factorKey]}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${colors.text}`}>
                          {score}%
                        </div>
                        <Badge className={`${interpretation.bg} ${interpretation.color} border-0`}>
                          {interpretation.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${colors.progress} transition-all duration-1000 ease-out`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    {/* Insight Profissional */}
                    <p className="mt-4 text-gray-700">
                      {getInsight(factorKey, score)}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Análise Profissional Detalhada */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Análise Profissional Detalhada
            </h2>
            <div className="space-y-8">
              {/* Visão Geral do Perfil */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Visão Geral do Perfil</h3>
                <p className="text-gray-700 leading-relaxed">
                  {getOverallAnalysis(results)}
                </p>
              </div>
               {Object.entries(results)
                .filter(([key]) => key !== 'facets')
                .map(([factor, score]) => (
                  <div key={factor}>
                    <h3 className="text-lg font-semibold mb-2">
                      {factorNames[factor as keyof typeof factorNames]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {getProfessionalAnalysis(factor as string, score as number)}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/colaborador/personalidade')}
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Testes
            </Button>
            
            <Button
              onClick={() => window.print()}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Imprimir Resultados
            </Button>
            <Button onClick={() => handleDownload(results)} size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Verde */}
      <div className="bg-green-800 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HumaniQ Big Five</h1>
                <p className="text-sm text-green-100">Teste de Personalidade</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Questão</p>
              <p className="text-lg font-bold">{currentQuestion + 1}/120</p>
            </div>
          </div>
          
          {/* Progress Bar Verde */}
          <div className="w-full bg-green-600 rounded-full h-2">
            <div 
              className="bg-green-300 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/colaborador/personalidade/big-five/introducao')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Question Card */}
        <Card className="mb-8 bg-white border-0 shadow-sm">
          <CardContent className="p-8">
            {/* Badge da Categoria */}
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                {factorNames[currentQ.factor]}
              </Badge>
            </div>
            
            {/* Pergunta */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
                {currentQ.text}
              </h2>
            </div>
            
            {/* Escala Likert */}
            <div className="mb-6">
              <LikertScale
                hideQuestion={true}
                value={currentAnswer}
                onChange={handleAnswerChange}
                autoAdvance={true}
                onAutoAdvance={handleNext}
                autoAdvanceDelay={800}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="lg"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Selecione uma resposta para continuar
            </p>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processando...
              </div>
            ) : currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              'Próxima'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function getInsight(factor: string, score: number) {
  const { level } = getScoreInterpretation(score)
  switch (factor) {
    case 'openness':
      return level.includes('Alto')
        ? 'Sua alta abertura indica criatividade e disposição para inovação, características valiosas em funções que exigem pensamento estratégico.'
        : 'Uma pontuação mais baixa sugere preferência por rotinas estabelecidas; funções com processos claros podem otimizar seu desempenho.'
    case 'conscientiousness':
      return level.includes('Alto')
        ? 'Elevada conscienciosidade reflete forte senso de responsabilidade e organização, essenciais para cargos de liderança e gestão de projetos.'
        : 'Para melhorar resultados, foque em desenvolver planejamento e gestão de tempo.'
    case 'extraversion':
      return level.includes('Alto')
        ? 'Sua sociabilidade favorece trabalhos em equipe, vendas e papéis que exigem constante interação.'
        : 'Ambientes que valorizem análise e reflexão podem aproveitar melhor suas competências.'
    case 'agreeableness':
      return level.includes('Alto')
        ? 'Alta amabilidade demonstra cooperação e empatia, contribuindo para clima organizacional positivo.'
        : 'Considere estratégias de comunicação assertiva para fortalecer relacionamentos profissionais.'
    case 'neuroticism':
      return level.includes('Alto')
        ? 'Níveis elevados de neuroticismo podem impactar gestão de estresse; recomenda-se treinamento em resiliência emocional.'
        : 'Boa estabilidade emocional favorece tomada de decisão sob pressão.'
    default:
      return ''
  }
}

function getProfessionalAnalysis(factor: string, score: number) {
  const { level } = getScoreInterpretation(score)
  switch (factor) {
    case 'openness':
      return level.includes('Alto')
        ? 'Profissionais com alta abertura tendem a inovar, propor soluções originais e se adaptar rapidamente a mudanças organizacionais. São indicados para áreas de P&D, design estratégico ou funções que exijam pensamento futurista. Recomenda-se estimular programas de inovação para potencializar esse perfil.'
        : 'Perfis mais conservadores priorizam estabilidade e processos estabelecidos. Podem se destacar em funções de controle de qualidade ou compliance, onde a aderência a normas é essencial. Treinamentos progressivos em criatividade podem ampliar sua adaptabilidade.'
    case 'conscientiousness':
      return level.includes('Alto')
        ? 'Alto grau de conscienciosidade revela foco em metas, disciplina e confiabilidade. Tais características são cruciais para gestão de projetos, auditorias e cargos de alta responsabilidade. É importante reconhecer conquistas para manter a motivação desse colaborador.'
        : 'Níveis menores sugerem flexibilidade, mas também possíveis dificuldades com prazos. Estruturas de acompanhamento, metas SMART e feedback frequente auxiliam no desenvolvimento desse fator.'
    case 'extraversion':
      return level.includes('Alto')
        ? 'Extroversão elevada favorece liderança carismática, vendas e gestão de relacionamento com stakeholders. Incentive networking e atribuições com interação constante para maximizar resultados.'
        : 'Baixa extraversão indica perfil analítico e focado. Ambientes que exijam concentração, como data analytics ou pesquisa, podem ser ideais. Garanta espaços de trabalho silenciosos e comunicação assíncrona eficiente.'
    case 'agreeableness':
      return level.includes('Alto')
        ? 'Alta amabilidade contribui para mediação de conflitos, suporte ao cliente e construção de equipes colaborativas. Programas de mentoring e projetos de responsabilidade social podem engajar esse profissional.'
        : 'Menor amabilidade pode gerar debates produtivos e pensamento crítico. Direcionar esse colaborador para papéis de consultoria interna ou análise de processos ajuda a transformar esse estilo em vantagem competitiva.'
    case 'neuroticism':
      return level.includes('Alto')
        ? 'Níveis altos demandam acompanhamento de bem-estar e capacitação em resiliência emocional. Técnicas de mindfulness e políticas de apoio psicológico reduzem impactos em produtividade sob pressão.'
        : 'Baixa neuroticismo indica estabilidade e alto controle emocional, essenciais em situações de crise. Incentive participação em times de resposta rápida ou gestão de riscos.'
    default:
      return ''
  }
}



const handleDownload = async (resultsParam: Results | null) => {
  if (!resultsParam) {
    alert('Erro: Resultados não encontrados para gerar o PDF')
    return
  }
  const results = resultsParam
  console.log('🔄 Iniciando processo de download do PDF...')

  try {
    console.log('📦 Importando bibliotecas...')
    const { jsPDF } = await import('jspdf')
    console.log('✅ Bibliotecas importadas')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let currentY = margin
    let pageNum = 1

    // Função para adicionar cabeçalho
    const addHeader = () => {
      // Fundo do cabeçalho com gradiente visual
      pdf.setFillColor(41, 98, 255) // Azul mais elegante
      pdf.rect(0, 0, pageWidth, 35, 'F')
      
      // Logo/Título principal
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('HumaniQ AI', margin, 22)
      
      // Subtítulo
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Relatório de Personalidade Big Five', pageWidth - margin, 18, { align: 'right' })
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 28, { align: 'right' })
      
      // Linha decorativa
      pdf.setDrawColor(255, 255, 255)
      pdf.setLineWidth(0.5)
      pdf.line(margin, 32, pageWidth - margin, 32)
      
      return 50 // Retorna posição Y após cabeçalho
    }

    // Função para adicionar rodapé
    const addFooter = () => {
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(`Página ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      pdf.text('HumaniQ AI - Análise de Personalidade', margin, pageHeight - 10)
      pdf.text('Confidencial', pageWidth - margin, pageHeight - 10, { align: 'right' })
    }

    // Função para verificar quebra de página
    const checkPageBreak = (neededSpace: number) => {
      if (currentY + neededSpace > pageHeight - 30) {
        addFooter()
        pdf.addPage()
        pageNum++
        currentY = addHeader()
      }
    }

    // Primeira página - cabeçalho
    currentY = addHeader()

    // Título principal do relatório
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(41, 98, 255)
    pdf.text('Seus Resultados Big Five', margin, currentY)
    currentY += 15

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    pdf.text('Perfil de Personalidade Completo', margin, currentY)
    currentY += 20

    // Seção de resultados dos fatores
    if (results) {
      Object.entries(results).filter(([key]) => key !== 'facets').forEach(([factor, score]) => {
        const factorKey = factor as keyof typeof factorNames
        const interpretation = getScoreInterpretation(score)
        
        checkPageBreak(60)
        
        // Card visual para cada fator
        pdf.setFillColor(248, 250, 252) // Fundo cinza claro
        pdf.roundedRect(margin, currentY - 5, contentWidth, 45, 3, 3, 'F')
        
        // Nome do fator
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(30, 41, 59)
        pdf.text(factorNames[factorKey], margin + 10, currentY + 8)
        
        // Score com destaque
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        const scoreColor = score >= 70 ? [34, 197, 94] : score >= 40 ? [249, 115, 22] : [239, 68, 68]
        pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
        pdf.text(`${score}%`, pageWidth - margin - 10, currentY + 8, { align: 'right' })
        
        // Nível de interpretação
        pdf.setFontSize(12)
        pdf.setTextColor(100, 116, 139)
        pdf.text(interpretation.level, pageWidth - margin - 10, currentY + 18, { align: 'right' })
        
        currentY += 25
        
        // Barra de progresso visual aprimorada
        const barY = currentY
        const barHeight = 6
        
        // Fundo da barra
        pdf.setFillColor(226, 232, 240)
        pdf.roundedRect(margin + 10, barY, contentWidth - 20, barHeight, 3, 3, 'F')
        
        // Preenchimento da barra com cor do fator
        const colors = {
          openness: [59, 130, 246],
          conscientiousness: [34, 197, 94],
          extraversion: [249, 115, 22],
          agreeableness: [236, 72, 153],
          neuroticism: [147, 51, 234]
        }
        
        const [r, g, b] = colors[factorKey] || [100, 100, 100]
        pdf.setFillColor(r, g, b)
        const barWidth = ((contentWidth - 20) * score) / 100
        pdf.roundedRect(margin + 10, barY, barWidth, barHeight, 3, 3, 'F')
        
        currentY += 20
        
        // Insight com melhor formatação
        const insight = getInsight(factorKey, score)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(71, 85, 105)
        const insightLines = pdf.splitTextToSize(insight, contentWidth - 20)
        pdf.text(insightLines, margin + 10, currentY)
        currentY += insightLines.length * 4 + 15
      })
    }

    // Nova página para análise profissional
    addFooter()
    pdf.addPage()
    pageNum++
    currentY = addHeader()
    
    // Título da análise profissional
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(41, 98, 255)
    pdf.text('Análise Profissional Detalhada', margin, currentY)
    currentY += 20
    
    // Visão geral do perfil
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(30, 41, 59)
    pdf.text('Visão Geral do Perfil', margin, currentY)
    currentY += 10
    
    if (results) {
      const overallAnalysis = getOverallAnalysis(results)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(71, 85, 105)
      const overallLines = pdf.splitTextToSize(overallAnalysis, contentWidth)
      pdf.text(overallLines, margin, currentY)
      currentY += overallLines.length * 5 + 20
      
      // Análises individuais dos fatores
      Object.entries(results).filter(([key]) => key !== 'facets').forEach(([factor, score]) => {
        const factorKey = factor as keyof typeof factorNames
        
        checkPageBreak(50)
        
        // Seção do fator com fundo colorido
        pdf.setFillColor(248, 250, 252)
        pdf.roundedRect(margin, currentY - 5, contentWidth, 8, 2, 2, 'F')
        
        pdf.setFontSize(13)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(30, 41, 59)
        pdf.text(factorNames[factorKey], margin + 5, currentY + 2)
        currentY += 15
        
        const analysis = getProfessionalAnalysis(factorKey, score)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(71, 85, 105)
        const analysisLines = pdf.splitTextToSize(analysis, contentWidth)
        pdf.text(analysisLines, margin, currentY)
        currentY += analysisLines.length * 4 + 15
      })
    }
    
    // Rodapé final
    addFooter()
    
    console.log('PDF gerado com sucesso, iniciando download...')
    pdf.save('humaniq-big-five-resultados.pdf')
    console.log('Download do PDF concluído')
  } catch (error: unknown) {
    console.error('Erro detalhado ao gerar PDF:', error)
    const errorMessage = error instanceof Error ? error.message : String(error) || 'Erro desconhecido'
    alert(`Erro ao gerar PDF: ${errorMessage}. Verifique o console para mais detalhes.`)
  }
}


function getOverallAnalysis(allResults: Results) {
  const analysis: string[] = []
  
  // Análise individual dos fatores
  const factorAnalysis = Object.entries(allResults)
    .filter(([k]) => k !== 'facets')
    .map(([factor, score]) => ({ factor, score, level: getScoreInterpretation(score) }))
  
  // Perfil geral baseado nos fatores dominantes
  const highFactors = factorAnalysis.filter(f => f.score >= 70)
  const lowFactors = factorAnalysis.filter(f => f.score <= 30)
  const moderateFactors = factorAnalysis.filter(f => f.score > 30 && f.score < 70)
  
  analysis.push('VISÃO GERAL DO PERFIL DE PERSONALIDADE')
  analysis.push('')
  
  // Características dominantes
  if (highFactors.length > 0) {
    analysis.push('CARACTERÍSTICAS DOMINANTES')
    highFactors.forEach(f => {
      const factorName = factorNames[f.factor as keyof typeof factorNames]
      analysis.push(`${factorName} (${f.score}%): ${getDetailedFactorDescription(f.factor, 'high')}`)
    })
    analysis.push('')
  }
  
  // Áreas de desenvolvimento
  if (lowFactors.length > 0) {
    analysis.push('ÁREAS DE DESENVOLVIMENTO')
    lowFactors.forEach(f => {
      const factorName = factorNames[f.factor as keyof typeof factorNames]
      analysis.push(`${factorName} (${f.score}%): ${getDetailedFactorDescription(f.factor, 'low')}`)
    })
    analysis.push('')
  }
  
  // Características equilibradas
  if (moderateFactors.length > 0) {
    analysis.push('CARACTERÍSTICAS EQUILIBRADAS')
    moderateFactors.forEach(f => {
      const factorName = factorNames[f.factor as keyof typeof factorNames]
      analysis.push(`${factorName} (${f.score}%): ${getDetailedFactorDescription(f.factor, 'moderate')}`)
    })
    analysis.push('')
  }
  
  // Análise de combinações e padrões
  analysis.push('ANÁLISE DE PADRÕES COMPORTAMENTAIS')
  analysis.push('')
  analysis.push(getPatternAnalysis(allResults))
  analysis.push('')
  
  // Implicações profissionais
  analysis.push('IMPLICAÇÕES PROFISSIONAIS')
  analysis.push('')
  analysis.push(getProfessionalImplications(allResults))
  analysis.push('')
  
  // Recomendações de desenvolvimento
  analysis.push('RECOMENDAÇÕES DE DESENVOLVIMENTO')
  analysis.push('')
  analysis.push(getDevelopmentRecommendations(allResults))
  
  return analysis.join('\n')
}

function getDetailedFactorDescription(factor: string, level: 'high' | 'low' | 'moderate') {
  const descriptions = {
    openness: {
      high: 'Demonstra forte curiosidade intelectual, criatividade excepcional e grande abertura para novas experiências. Tende a ser inovador, imaginativo e receptivo a mudanças.',
      low: 'Prefere rotinas estabelecidas e abordagens convencionais. Pode ser mais prático e focado em métodos testados, mas pode resistir a mudanças ou inovações.',
      moderate: 'Equilibra criatividade com praticidade, sendo seletivo sobre quando abraçar mudanças ou manter tradições.'
    },
    conscientiousness: {
      high: 'Altamente organizado, disciplinado e orientado para objetivos. Demonstra excelente autocontrole, planejamento detalhado e forte ética de trabalho.',
      low: 'Tende a ser mais espontâneo e flexível, mas pode enfrentar desafios com organização e cumprimento de prazos. Beneficia-se de estruturas externas.',
      moderate: 'Consegue ser organizado quando necessário, mas também valoriza flexibilidade e espontaneidade em situações apropriadas.'
    },
    extraversion: {
      high: 'Altamente sociável, energético e assertivo. Prospera em interações sociais, demonstra liderança natural e busca ativamente estimulação externa.',
      low: 'Prefere ambientes mais calmos e interações em pequenos grupos. Tende a ser reflexivo, independente e pode precisar de tempo sozinho para recarregar.',
      moderate: 'Adapta-se bem tanto a situações sociais quanto a momentos de introspecção, sendo versátil em diferentes contextos sociais.'
    },
    agreeableness: {
      high: 'Demonstra forte empatia, cooperação e orientação para ajudar outros. Valoriza harmonia nas relações e tende a confiar nas pessoas.',
      low: 'Mais direto e objetivo nas interações, priorizando eficiência sobre harmonia. Pode ser cético em relação às motivações dos outros.',
      moderate: 'Equilibra cooperação com assertividade, sendo capaz de colaborar efetivamente enquanto mantém seus próprios interesses.'
    },
    neuroticism: {
      high: 'Pode experienciar emoções intensas e ser mais sensível ao estresse. Beneficia-se de estratégias de manejo emocional e ambientes de apoio.',
      low: 'Demonstra alta estabilidade emocional, resiliência ao estresse e capacidade de manter calma sob pressão.',
      moderate: 'Geralmente estável emocionalmente, mas pode ser afetado por situações de alto estresse. Responde bem a estratégias de equilíbrio.'
    }
  }
  
  return descriptions[factor as keyof typeof descriptions][level]
}

function getPatternAnalysis(results: Results) {
  const patterns: string[] = []
  
  // Análise de liderança
  if (results.extraversion >= 60 && results.conscientiousness >= 60) {
    patterns.push('Perfil de Liderança Natural: A combinação de alta extroversão e conscienciosidade sugere forte potencial para posições de liderança, com capacidade de motivar equipes e manter foco em resultados.')
  }
  
  // Análise de inovação
  if (results.openness >= 70 && results.conscientiousness >= 60) {
    patterns.push('Inovador Disciplinado: Combina criatividade com execução, sendo capaz de gerar ideias originais e implementá-las de forma estruturada.')
  }
  
  // Análise de colaboração
  if (results.agreeableness >= 60 && results.extraversion >= 60) {
    patterns.push('Colaborador Natural: Excelente em trabalho em equipe, construção de relacionamentos e facilitação de consenso em grupos.')
  }
  
  // Análise de estabilidade
  if (results.neuroticism <= 40 && results.conscientiousness >= 60) {
    patterns.push('Perfil de Alta Confiabilidade: Demonstra estabilidade emocional combinada com disciplina, sendo altamente confiável em situações de pressão.')
  }
  
  // Análise de adaptabilidade
  if (results.openness >= 60 && results.neuroticism <= 50) {
    patterns.push('Adaptabilidade Resiliente: Combina abertura para mudanças com estabilidade emocional, facilitando adaptação a novos ambientes e desafios.')
  }
  
  if (patterns.length === 0) {
    patterns.push('Perfil Equilibrado: Demonstra um padrão de características balanceadas, oferecendo versatilidade em diferentes situações e contextos.')
  }
  
  return patterns.join('\n\n')
}

function getProfessionalImplications(results: Results) {
  const implications: string[] = []
  
  // Estilo de trabalho preferido
  implications.push('ESTILO DE TRABALHO PREFERIDO')
  if (results.extraversion >= 60) {
    implications.push('Prospera em ambientes colaborativos e dinâmicos')
    implications.push('Prefere comunicação direta e interação frequente com colegas')
  } else {
    implications.push('Trabalha melhor em ambientes mais calmos e focados')
    implications.push('Prefere comunicação escrita e tempo para reflexão antes de decisões')
  }
  
  if (results.conscientiousness >= 60) {
    implications.push('Excelente em planejamento, organização e cumprimento de prazos')
    implications.push('Valoriza processos estruturados e metas claras')
  }
  
  implications.push('')
  
  // Ambientes de trabalho ideais
  implications.push('AMBIENTES DE TRABALHO IDEAIS')
  if (results.openness >= 60) {
    implications.push('Ambientes que valorizam inovação e criatividade')
    implications.push('Organizações com cultura de mudança e aprendizado contínuo')
  }
  
  if (results.agreeableness >= 60) {
    implications.push('Culturas organizacionais colaborativas e de apoio mútuo')
    implications.push('Ambientes que valorizam trabalho em equipe e harmonia')
  }
  
  implications.push('')
  
  // Potenciais desafios
  implications.push('POTENCIAIS DESAFIOS PROFISSIONAIS')
  if (results.neuroticism >= 60) {
    implications.push('Pode ser mais sensível a feedback crítico ou ambientes de alta pressão')
    implications.push('Beneficia-se de suporte emocional e estratégias de manejo de estresse')
  }
  
  if (results.conscientiousness <= 40) {
    implications.push('Pode enfrentar desafios com organização e cumprimento de prazos rígidos')
    implications.push('Beneficia-se de sistemas de apoio e estruturas externas')
  }
  
  return implications.join('\n')
}

function getDevelopmentRecommendations(results: Results) {
  const recommendations: string[] = []
  
  recommendations.push('ÁREAS DE FOCO PARA DESENVOLVIMENTO')
  recommendations.push('')
  
  // Recomendações baseadas em pontos baixos
  if (results.conscientiousness <= 40) {
    recommendations.push('Organização e Planejamento: Desenvolver sistemas pessoais de organização, usar ferramentas de produtividade e estabelecer rotinas estruturadas.')
  }
  
  if (results.extraversion <= 40) {
    recommendations.push('Habilidades de Comunicação: Praticar apresentações, participar de grupos pequenos e desenvolver confiança em interações sociais profissionais.')
  }
  
  if (results.openness <= 40) {
    recommendations.push('Flexibilidade e Inovação: Buscar experiências novas, questionar métodos estabelecidos e desenvolver pensamento criativo.')
  }
  
  if (results.agreeableness <= 40) {
    recommendations.push('Colaboração e Empatia: Desenvolver habilidades de escuta ativa, praticar perspectiva dos outros e trabalhar em projetos colaborativos.')
  }
  
  if (results.neuroticism >= 60) {
    recommendations.push('Manejo Emocional: Desenvolver técnicas de relaxamento, mindfulness e estratégias de enfrentamento do estresse.')
  }
  
  recommendations.push('')
  
  // Recomendações para maximizar pontos fortes
  recommendations.push('ESTRATÉGIAS PARA MAXIMIZAR PONTOS FORTES')
  recommendations.push('')
  
  if (results.conscientiousness >= 60) {
    recommendations.push('Assumir responsabilidades de coordenação e planejamento em projetos')
  }
  
  if (results.extraversion >= 60) {
    recommendations.push('Buscar oportunidades de liderança e representação da equipe')
  }
  
  if (results.openness >= 60) {
    recommendations.push('Liderar iniciativas de inovação e processos de mudança organizacional')
  }
  
  if (results.agreeableness >= 60) {
    recommendations.push('Atuar como mediador em conflitos e facilitador de consenso')
  }
  
  if (results.neuroticism <= 40) {
    recommendations.push('Assumir responsabilidades em situações de alta pressão e crise')
  }
  
  return recommendations.join('\n')
}