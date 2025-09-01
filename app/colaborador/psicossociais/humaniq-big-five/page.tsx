'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Brain, Target, Users, Heart, Zap, AlertTriangle, Clock, Play, Trophy, Briefcase } from 'lucide-react'
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
  // Abertura (Openness) - 24 questões
  { id: 1, text: "Eu tenho uma imaginação fértil.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 2, text: "Eu acredito na importância da arte.", factor: 'openness', facet: 'Interesses Artísticos', reversed: false },
  { id: 3, text: "Eu experimento minhas emoções intensamente.", factor: 'openness', facet: 'Emocionalidade', reversed: false },
  { id: 4, text: "Eu prefiro variedade à rotina.", factor: 'openness', facet: 'Aventura', reversed: false },
  { id: 5, text: "Eu adoro ler materiais desafiadores.", factor: 'openness', facet: 'Intelecto', reversed: false },
  { id: 6, text: "Eu tendo a votar em candidatos políticos liberais.", factor: 'openness', facet: 'Liberalismo', reversed: false },
  { id: 7, text: "Eu gosto de voos selvagens de fantasia.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 8, text: "Eu vejo beleza em coisas que outros talvez não percebam.", factor: 'openness', facet: 'Interesses Artísticos', reversed: false },
  { id: 9, text: "Eu sinto as emoções dos outros.", factor: 'openness', facet: 'Emocionalidade', reversed: false },
  { id: 10, text: "Eu procuro aventura.", factor: 'openness', facet: 'Aventura', reversed: false },
  { id: 11, text: "Eu evito discussões filosóficas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 12, text: "Eu acredito que não existe certo ou errado absoluto.", factor: 'openness', facet: 'Liberalismo', reversed: false },
  { id: 13, text: "Eu adoro sonhar acordado.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 14, text: "Eu não gosto de poesia.", factor: 'openness', facet: 'Interesses Artísticos', reversed: true },
  { id: 15, text: "Eu raramente percebo minhas reações emocionais.", factor: 'openness', facet: 'Emocionalidade', reversed: true },
  { id: 16, text: "Eu não gosto de mudanças.", factor: 'openness', facet: 'Aventura', reversed: true },
  { id: 17, text: "Eu tenho dificuldade em entender ideias abstratas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 18, text: "Eu tendo a votar em candidatos políticos conservadores.", factor: 'openness', facet: 'Liberalismo', reversed: true },
  { id: 19, text: "Eu gosto de me perder em pensamentos.", factor: 'openness', facet: 'Imaginação', reversed: false },
  { id: 20, text: "Eu não gosto de ir a museus de arte.", factor: 'openness', facet: 'Interesses Artísticos', reversed: true },
  { id: 21, text: "Eu não entendo pessoas que ficam emotivas.", factor: 'openness', facet: 'Emocionalidade', reversed: true },
  { id: 22, text: "Eu sou apegado aos costumes convencionais.", factor: 'openness', facet: 'Aventura', reversed: true },
  { id: 23, text: "Eu não estou interessado em discussões teóricas.", factor: 'openness', facet: 'Intelecto', reversed: true },
  { id: 24, text: "Eu acredito que devemos ser duros com o crime.", factor: 'openness', facet: 'Liberalismo', reversed: true },

  // Conscienciosidade (Conscientiousness) - 24 questões
  { id: 25, text: "Eu concluo tarefas com sucesso.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 26, text: "Eu gosto de arrumar.", factor: 'conscientiousness', facet: 'Ordem', reversed: false },
  { id: 27, text: "Eu cumpro minhas promessas.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: false },
  { id: 28, text: "Eu trabalho duro.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: false },
  { id: 29, text: "Eu estou sempre preparado.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: false },
  { id: 30, text: "Eu me destaco no que faço.", factor: 'conscientiousness', facet: 'Deliberação', reversed: false },
  { id: 31, text: "Eu faço mais do que esperam de mim.", factor: 'conscientiousness', facet: 'Eficácia', reversed: false },
  { id: 32, text: "Eu executo meus planos.", factor: 'conscientiousness', facet: 'Ordem', reversed: false },
  { id: 33, text: "Eu digo a verdade.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: false },
  { id: 34, text: "Eu lido com as tarefas com fluidez.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: false },
  { id: 35, text: "Eu entro nas coisas sem pensar.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: true },
  { id: 36, text: "Eu frequentemente esqueço de colocar as coisas de volta no devido lugar.", factor: 'conscientiousness', facet: 'Deliberação', reversed: true },
  { id: 37, text: "Eu quebro as regras.", factor: 'conscientiousness', facet: 'Eficácia', reversed: true },
  { id: 38, text: "Eu deixo uma bagunça no meu quarto.", factor: 'conscientiousness', facet: 'Ordem', reversed: true },
  { id: 39, text: "Eu quebro minhas promessas.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: true },
  { id: 40, text: "Eu trabalho apenas o suficiente para sobreviver.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: true },
  { id: 41, text: "Eu perco meu tempo.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: true },
  { id: 42, text: "Eu me apresso nas coisas.", factor: 'conscientiousness', facet: 'Deliberação', reversed: true },
  { id: 43, text: "Eu dedico pouco tempo e esforço ao meu trabalho.", factor: 'conscientiousness', facet: 'Eficácia', reversed: true },
  { id: 44, text: "Eu deixo meus pertences por aí.", factor: 'conscientiousness', facet: 'Ordem', reversed: true },
  { id: 45, text: "Eu tenho dificuldade em iniciar tarefas.", factor: 'conscientiousness', facet: 'Senso de Dever', reversed: true },
  { id: 46, text: "Eu gosto de ir com calma.", factor: 'conscientiousness', facet: 'Esforço para Realização', reversed: true },
  { id: 47, text: "Eu ajo sem pensar.", factor: 'conscientiousness', facet: 'Autodisciplina', reversed: true },
  { id: 48, text: "Eu resisto facilmente às tentações.", factor: 'conscientiousness', facet: 'Deliberação', reversed: false },

  // Extroversão (Extraversion) - 24 questões
  { id: 49, text: "Eu faço amigos facilmente.", factor: 'extraversion', facet: 'Cordialidade', reversed: false },
  { id: 50, text: "Eu adoro festas grandes.", factor: 'extraversion', facet: 'Gregariedade', reversed: false },
  { id: 51, text: "Eu assumo o controle.", factor: 'extraversion', facet: 'Assertividade', reversed: false },
  { id: 52, text: "Eu estou sempre ocupado.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 53, text: "Eu adoro emoção.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 54, text: "Eu irradio alegria.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },
  { id: 55, text: "Eu me sinto confortável perto das pessoas.", factor: 'extraversion', facet: 'Cordialidade', reversed: false },
  { id: 56, text: "Eu converso com muitas pessoas diferentes em festas.", factor: 'extraversion', facet: 'Gregariedade', reversed: false },
  { id: 57, text: "Eu tento liderar os outros.", factor: 'extraversion', facet: 'Assertividade', reversed: false },
  { id: 58, text: "Eu estou sempre em movimento.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 59, text: "Eu me divirto bastante.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 60, text: "Eu amo a vida.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },
  { id: 61, text: "Eu acho difícil abordar outras pessoas.", factor: 'extraversion', facet: 'Cordialidade', reversed: true },
  { id: 62, text: "Eu prefiro ficar sozinho.", factor: 'extraversion', facet: 'Gregariedade', reversed: true },
  { id: 63, text: "Eu tenho medo de chamar atenção para mim.", factor: 'extraversion', facet: 'Assertividade', reversed: true },
  { id: 64, text: "Eu faço muita coisa no meu tempo livre.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 65, text: "Eu me sinto confortável apenas com amigos.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: true },
  { id: 66, text: "Eu evito contato com outras pessoas.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: true },
  { id: 67, text: "Eu mantenho os outros à distância.", factor: 'extraversion', facet: 'Cordialidade', reversed: true },
  { id: 68, text: "Eu evito multidões.", factor: 'extraversion', facet: 'Gregariedade', reversed: true },
  { id: 69, text: "Eu espero que outros mostrem o caminho.", factor: 'extraversion', facet: 'Assertividade', reversed: true },
  { id: 70, text: "Eu não me incomodo com situações sociais difíceis.", factor: 'extraversion', facet: 'Atividade', reversed: false },
  { id: 71, text: "Eu me divirto sendo imprudente.", factor: 'extraversion', facet: 'Busca por Emoções', reversed: false },
  { id: 72, text: "Eu assumo o controle das coisas.", factor: 'extraversion', facet: 'Emoções Positivas', reversed: false },

  // Amabilidade (Agreeableness) - 24 questões
  { id: 73, text: "Eu confio nos outros.", factor: 'agreeableness', facet: 'Confiança', reversed: false },
  { id: 74, text: "Eu adoro ajudar os outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: false },
  { id: 75, text: "Eu sinto simpatia pelos moradores de rua.", factor: 'agreeableness', facet: 'Modéstia', reversed: false },
  { id: 76, text: "Eu me preocupo com os outros.", factor: 'agreeableness', facet: 'Cooperação', reversed: false },
  { id: 77, text: "Eu acredito que os outros têm boas intenções.", factor: 'agreeableness', facet: 'Sensibilidade', reversed: false },
  { id: 78, text: "Eu sinto compaixão por aqueles que estão em situação pior que a minha.", factor: 'agreeableness', facet: 'Ternura Mental', reversed: false },
  { id: 79, text: "Eu confio no que as pessoas dizem.", factor: 'agreeableness', facet: 'Confiança', reversed: false },
  { id: 80, text: "Eu sou indiferente aos sentimentos dos outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 81, text: "Eu uso os outros para meus próprios fins.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 82, text: "Eu adoro uma boa briga.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 83, text: "Eu acredito que sou melhor que os outros.", factor: 'agreeableness', facet: 'Sensibilidade', reversed: true },
  { id: 84, text: "Eu trapaceio para progredir.", factor: 'agreeableness', facet: 'Ternura Mental', reversed: true },
  { id: 85, text: "Eu desconfio das pessoas.", factor: 'agreeableness', facet: 'Confiança', reversed: true },
  { id: 86, text: "Eu não estou interessado nos problemas dos outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 87, text: "Eu tenho uma opinião muito boa de mim mesmo.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 88, text: "Eu grito com as pessoas.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 89, text: "Eu obstruo os planos dos outros.", factor: 'agreeableness', facet: 'Sensibilidade', reversed: true },
  { id: 90, text: "Eu tiro vantagem dos outros.", factor: 'agreeableness', facet: 'Ternura Mental', reversed: true },
  { id: 91, text: "Eu tenho uma opinião elevada sobre mim mesmo.", factor: 'agreeableness', facet: 'Confiança', reversed: true },
  { id: 92, text: "Eu não reservo tempo para os outros.", factor: 'agreeableness', facet: 'Altruísmo', reversed: true },
  { id: 93, text: "Eu me gabo das minhas virtudes.", factor: 'agreeableness', facet: 'Modéstia', reversed: true },
  { id: 94, text: "Eu me vingo dos outros.", factor: 'agreeableness', facet: 'Cooperação', reversed: true },
  { id: 95, text: "Eu insulto pessoas.", factor: 'agreeableness', facet: 'Sensibilidade', reversed: true },
  { id: 96, text: "Eu tento não pensar nos necessitados.", factor: 'agreeableness', facet: 'Ternura Mental', reversed: true },

  // Neuroticismo (Neuroticism) - 24 questões
  { id: 97, text: "Eu me preocupo com as coisas.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 98, text: "Eu fico com raiva facilmente.", factor: 'neuroticism', facet: 'Hostilidade', reversed: false },
  { id: 99, text: "Eu me sinto triste com frequência.", factor: 'neuroticism', facet: 'Depressão', reversed: false },
  { id: 100, text: "Eu faço maratonas.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: true },
  { id: 101, text: "Eu entro em pânico facilmente.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 102, text: "Eu temo o pior.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: false },
  { id: 103, text: "Eu fico irritado facilmente.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 104, text: "Eu não gosto de mim mesmo.", factor: 'neuroticism', facet: 'Hostilidade', reversed: false },
  { id: 105, text: "Eu fico sobrecarregado pelos acontecimentos.", factor: 'neuroticism', facet: 'Depressão', reversed: false },
  { id: 106, text: "Eu raramente exagero.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: true },
  { id: 107, text: "Eu tomo decisões precipitadas.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 108, text: "Eu tenho medo de muitas coisas.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: false },
  { id: 109, text: "Eu perco a paciência.", factor: 'neuroticism', facet: 'Ansiedade', reversed: false },
  { id: 110, text: "Eu estou sempre deprimido.", factor: 'neuroticism', facet: 'Hostilidade', reversed: false },
  { id: 111, text: "Eu sinto que sou incapaz de lidar com as coisas.", factor: 'neuroticism', facet: 'Depressão', reversed: false },
  { id: 112, text: "Eu me sinto confortável comigo mesmo.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: true },
  { id: 113, text: "Eu fico estressado facilmente.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 114, text: "Eu não me irrito facilmente.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: true },
  { id: 115, text: "Eu mantenho a calma sob pressão.", factor: 'neuroticism', facet: 'Ansiedade', reversed: true },
  { id: 116, text: "Eu olho para o lado positivo da vida.", factor: 'neuroticism', facet: 'Hostilidade', reversed: true },
  { id: 117, text: "Eu sou capaz de controlar meus desejos.", factor: 'neuroticism', facet: 'Depressão', reversed: true },
  { id: 118, text: "Eu ajo de forma selvagem e louca.", factor: 'neuroticism', facet: 'Autoconsciência', reversed: false },
  { id: 119, text: "Eu ajo sem pensar.", factor: 'neuroticism', facet: 'Impulsividade', reversed: false },
  { id: 120, text: "Eu me sinto confortável comigo mesmo.", factor: 'neuroticism', facet: 'Vulnerabilidade', reversed: true }
]



const factorNames = {
  openness: 'Abertura',
  conscientiousness: 'Conscienciosidade',
  extraversion: 'Extroversão',
  agreeableness: 'Amabilidade',
  neuroticism: 'Neuroticismo'
}

const factorDescriptions = {
  openness: 'Tendência a ser criativo, imaginativo e aberto a novas experiências',
  conscientiousness: 'Tendência a ser organizado, responsável e orientado para objetivos',
  extraversion: 'Tendência a ser sociável, assertivo e energético',
  agreeableness: 'Tendência a ser cooperativo, confiante e empático',
  neuroticism: 'Tendência a experimentar emoções negativas e instabilidade emocional'
}

function getFactorIcon(factor: string) {
  switch (factor) {
    case 'openness': return Brain
    case 'conscientiousness': return Target
    case 'extraversion': return Users
    case 'agreeableness': return Heart
    case 'neuroticism': return AlertTriangle
    default: return Zap
  }
}

function getScoreInterpretation(score: number): { level: string; color: string; description: string } {
  if (score >= 4.5) {
    return {
      level: "Muito Alto",
      color: "text-green-700 bg-green-100",
      description: "Pontuação muito elevada neste fator"
    }
  } else if (score >= 3.5) {
    return {
      level: "Alto",
      color: "text-blue-700 bg-blue-100",
      description: "Pontuação acima da média"
    }
  } else if (score >= 2.5) {
    return {
      level: "Médio",
      color: "text-yellow-700 bg-yellow-100",
      description: "Pontuação na média"
    }
  } else if (score >= 1.5) {
    return {
      level: "Baixo",
      color: "text-orange-700 bg-orange-100",
      description: "Pontuação abaixo da média"
    }
  } else {
    return {
      level: "Muito Baixo",
      color: "text-red-700 bg-red-100",
      description: "Pontuação muito baixa neste fator"
    }
  }
}

// Gera análise profissional detalhada para cada fator considerando o nível obtido
function getProfessionalAnalysis(factor: string, score: number): string {
  const { level } = getScoreInterpretation(score)
  switch (factor) {
    case 'openness':
      if (level === 'Muito Alto' || level === 'Alto') {
        return 'Pontuações elevadas em Abertura indicam grande potencial para inovação, aprendizagem rápida e capacidade de lidar com cenários de mudança constante.'
      } else if (level === 'Médio') {
        return 'Equilíbrio saudável entre criatividade e pragmatismo; pode alternar entre seguir padrões estabelecidos e propor melhorias quando necessário.'
      } else {
        return 'Preferência por rotinas consolidadas e menor tolerância a incertezas. A exposição gradativa a projetos criativos pode estimular desenvolvimento desta competência.'
      }
    case 'conscientiousness':
      if (level === 'Muito Alto' || level === 'Alto') {
        return 'Alto grau de organização, confiabilidade e foco em metas. Útil para funções que exigem forte responsabilidade e atenção a detalhes.'
      } else if (level === 'Médio') {
        return 'Mantém disciplina adequada sem perder flexibilidade; adapta-se bem a ambientes que combinam rotinas e imprevistos.'
      } else {
        return 'Possível dificuldade com prazos e organização. Programas de mentoring e metodologias ágeis podem auxiliar no desenvolvimento.'
      }
    case 'extraversion':
      if (level === 'Muito Alto' || level === 'Alto') {
        return 'Energia social elevada, tende a liderar interações e motivar equipes. Indicado para papéis que envolvam networking e comunicação frequente.'
      } else if (level === 'Médio') {
        return 'Capaz de alternar entre momentos de exposição e reflexão. Adequado para posições que exijam colaboração moderada.'
      } else {
        return 'Prefere ambientes tranquilos e trabalho focado. Estratégias de comunicação assíncrona podem aumentar produtividade e conforto.'
      }
    case 'agreeableness':
      if (level === 'Muito Alto' || level === 'Alto') {
        return 'Alta cooperação e empatia favorecem clima organizacional positivo e gestão de conflitos. Ideal para atividades de suporte e atendimento.'
      } else if (level === 'Médio') {
        return 'Equilíbrio entre assertividade e colaboração, permitindo negociações justas sem comprometer relações.'
      } else {
        return 'Pode demonstrar postura mais competitiva ou crítica. Treinamentos em escuta ativa e mediação podem agregar valor.'
      }
    case 'neuroticism':
      if (level === 'Muito Baixo' || level === 'Baixo') {
        return 'Estabilidade emocional elevada contribui para resiliência em situações de pressão e tomada de decisão assertiva.'
      } else if (level === 'Médio') {
        return 'Níveis moderados de sensibilidade geram autoconsciência útil, desde que existam práticas de gestão do estresse.'
      } else {
        return 'Tendência a reatividade emocional; programas de bem-estar, mindfulness e suporte psicológico podem aumentar desempenho e satisfação.'
      }
    default:
      return ''
  }
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
      router.push('/colaborador/psicossociais/humaniq-big-five/introducao')
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

  // Formatação do tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Se não validado, não renderizar nada (redirecionamento em andamento)
  if (!isValidated) {
    return null
  }

  const progress = (currentQuestion / questions.length) * 100

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    // Auto-advance to next question or complete test
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // All questions answered, complete test automatically
        calculateResults(newAnswers)
        setTimeout(() => {
          completeTest(newAnswers)
        }, 500)
      }
    }, 300)
  }

  const calculateResults = (finalAnswers: Record<number, number>) => {
    // Validação: verificar se todas as 120 questões foram respondidas
    const answeredQuestions = Object.keys(finalAnswers).length
    if (answeredQuestions !== questions.length) {
      console.warn(`Apenas ${answeredQuestions} de ${questions.length} questões foram respondidas`)
    }

    const factorScores: Record<string, number[]> = {
      openness: [],
      conscientiousness: [],
      extraversion: [],
      agreeableness: [],
      neuroticism: []
    }

    const facetScores: Record<string, number[]> = {}

    // Processamento das respostas seguindo o padrão IPIP-120
    questions.forEach(question => {
      const answer = finalAnswers[question.id]
      if (answer !== undefined && answer >= 1 && answer <= 5) {
        // Aplicar pontuação reversa conforme especificação IPIP-120
        const score = question.reversed ? (6 - answer) : answer
        
        // Adicionar à pontuação do fator
        factorScores[question.factor].push(score)
        
        // Adicionar à pontuação da faceta
        if (!facetScores[question.facet]) {
          facetScores[question.facet] = []
        }
        facetScores[question.facet].push(score)
      }
    })

    // Calcular médias dos fatores (escala 1.0-5.0)
    const factorAverages: Results = {
      openness: factorScores.openness.length > 0 ? 
        Math.round((factorScores.openness.reduce((a, b) => a + b, 0) / factorScores.openness.length) * 100) / 100 : 0,
      conscientiousness: factorScores.conscientiousness.length > 0 ? 
        Math.round((factorScores.conscientiousness.reduce((a, b) => a + b, 0) / factorScores.conscientiousness.length) * 100) / 100 : 0,
      extraversion: factorScores.extraversion.length > 0 ? 
        Math.round((factorScores.extraversion.reduce((a, b) => a + b, 0) / factorScores.extraversion.length) * 100) / 100 : 0,
      agreeableness: factorScores.agreeableness.length > 0 ? 
        Math.round((factorScores.agreeableness.reduce((a, b) => a + b, 0) / factorScores.agreeableness.length) * 100) / 100 : 0,
      neuroticism: factorScores.neuroticism.length > 0 ? 
        Math.round((factorScores.neuroticism.reduce((a, b) => a + b, 0) / factorScores.neuroticism.length) * 100) / 100 : 0,
      facets: {}
    }

    // Calcular médias das facetas com precisão de 2 casas decimais
    Object.keys(facetScores).forEach(facet => {
      if (facetScores[facet].length > 0) {
        factorAverages.facets[facet] = Math.round((facetScores[facet].reduce((a, b) => a + b, 0) / facetScores[facet].length) * 100) / 100
      }
    })

    console.log('Resultados calculados:', factorAverages)
    setResults(factorAverages)
    setShowResults(true)
  }

  const completeTest = async (finalAnswers: Record<number, number>) => {
    setIsSubmitting(true)
    
    try {
      // Buscar o teste Big Five no banco de dados
      const testResponse = await fetch('/api/tests')
      const testsData = await testResponse.json()
      
      // Encontrar o teste Big Five
      const bigFiveTest = testsData.tests?.find((test: any) => 
        test.title?.includes('Big Five') || 
        test.title?.includes('Cinco Grandes Fatores') ||
        test.id === 'humaniq-big-five'
      )
      
      if (!bigFiveTest) {
        throw new Error('Teste Big Five não encontrado no sistema')
      }
      
      // Preparar dados para envio à API real
      const testResultData = {
        testId: bigFiveTest.id,
        testType: 'PERSONALITY',
        answers: finalAnswers,
        overallScore: Math.round(Object.values(results || {}).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0) / 5 * 20),
        dimensionScores: {
          openness: Math.round((results?.openness || 0) * 20),
          conscientiousness: Math.round((results?.conscientiousness || 0) * 20),
          extraversion: Math.round((results?.extraversion || 0) * 20),
          agreeableness: Math.round((results?.agreeableness || 0) * 20),
          neuroticism: Math.round((results?.neuroticism || 0) * 20)
        },
        facetScores: results?.facets || {},
        duration: timeElapsed,
        completedAt: new Date().toISOString(),
        metadata: {
          testVersion: 'IPIP-120',
          totalQuestions: questions.length,
          factorScores: results
        }
      }
      
      console.log('🚀 Enviando dados do teste Big Five para API:', testResultData)
      
      // Enviar para a API real de resultados
      const response = await fetch('/api/colaborador/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResultData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Erro na API: ${errorData.message || response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ Resultado salvo com sucesso:', result)
      
      // Redirecionamento para a página de resultados
      router.push('/colaborador/resultados?highlight=big-five')
    } catch (error) {
      console.error('❌ Erro ao enviar resultados do Big Five:', error)
      // Em caso de erro, ainda redireciona mas mostra mensagem
      router.push('/colaborador/resultados?error=big-five-submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Resultados HumaniQ Big Five
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Análise completa da sua personalidade baseada no modelo IPIP-120
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Tempo: {formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>120 questões respondidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>5 fatores analisados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Geral dos Cinco Fatores */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="w-6 h-6" />
                Perfil de Personalidade - Cinco Fatores
              </CardTitle>
              <p className="text-purple-100 mt-2">
                Análise baseada no modelo científico IPIP-120 com 30 facetas detalhadas
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(factorNames).map(([factor, name]) => {
                  const score = results[factor as keyof Results] as number
                  const interpretation = getScoreInterpretation(score)
                  const Icon = getFactorIcon(factor)
                  const percentage = Math.round((score / 5) * 100)
                  
                  return (
                    <div key={factor} className="relative p-6 border-2 border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{name}</h3>
                            <p className="text-sm text-gray-500">Fator {Object.keys(factorNames).indexOf(factor) + 1}</p>
                          </div>
                        </div>
                        <Badge className={`${interpretation.color} text-xs font-semibold px-3 py-1`}>
                          {interpretation.level}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {score.toFixed(1)}
                          </span>
                          <span className="text-lg text-gray-500">/5.0</span>
                        </div>
                        
                        {/* Barra de Progresso Visual */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              percentage >= 80 ? 'bg-green-500' :
                              percentage >= 60 ? 'bg-blue-500' :
                              percentage >= 40 ? 'bg-yellow-500' :
                              percentage >= 20 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Baixo</span>
                          <span className="font-medium">{percentage}%</span>
                          <span>Alto</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {factorDescriptions[factor as keyof typeof factorDescriptions]}
                      </p>
                      
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Interpretação:</strong> {interpretation.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Análise Detalhada por Facetas */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="w-6 h-6" />
                Análise Detalhada por Facetas (30 Dimensões)
              </CardTitle>
              <p className="text-blue-100 mt-2">
                Cada fator é composto por 6 facetas específicas que detalham aspectos únicos da personalidade
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {Object.entries(factorNames).map(([factor, factorName]) => {
                  const factorScore = results[factor as keyof Results] as number
                  const factorInterpretation = getScoreInterpretation(factorScore)
                  const Icon = getFactorIcon(factor)
                  const factorPercentage = Math.round((factorScore / 5) * 100)
                  const factorFacets = Object.entries(results.facets).filter(([facet]) => {
                    return questions.some(q => q.factor === factor && q.facet === facet)
                  })
                  
                  return (
                    <div key={factor} className="border-2 border-gray-100 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                      {/* Cabeçalho do Fator */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <Icon className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{factorName}</h3>
                            <p className="text-gray-600">6 facetas analisadas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {factorScore.toFixed(1)}/5.0
                          </div>
                          <Badge className={`${factorInterpretation.color} text-sm font-semibold px-4 py-2`}>
                            {factorInterpretation.level} ({factorPercentage}%)
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Grid de Facetas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {factorFacets.map(([facet, score]) => {
                          const facetInterpretation = getScoreInterpretation(score)
                          const facetPercentage = Math.round((score / 5) * 100)
                          
                          return (
                            <div key={facet} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                                  {facet}
                                </h4>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900">
                                    {score.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-500">/5.0</div>
                                </div>
                              </div>
                              
                              {/* Mini barra de progresso */}
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    facetPercentage >= 80 ? 'bg-green-500' :
                                    facetPercentage >= 60 ? 'bg-blue-500' :
                                    facetPercentage >= 40 ? 'bg-yellow-500' :
                                    facetPercentage >= 20 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${facetPercentage}%` }}
                                ></div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <Badge className={`${facetInterpretation.color} text-xs px-2 py-1`}>
                                  {facetInterpretation.level}
                                </Badge>
                                <span className="text-xs font-medium text-gray-600">
                                  {facetPercentage}%
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interpretação Científica e Metodológica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fundamentação Científica */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5" />
                  Fundamentação Científica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-800 mb-2">Modelo dos Cinco Fatores (Big Five)</h4>
                  <p className="text-sm text-green-700">
                    Modelo científico mais aceito na psicologia da personalidade, validado em mais de 50 países 
                    e culturas diferentes, representando as dimensões universais da personalidade humana.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-800 mb-2">IPIP-120 (Goldberg & Johnson)</h4>
                  <p className="text-sm text-blue-700">
                    Instrumento com 120 itens do International Personality Item Pool, 
                    validado cientificamente com alta confiabilidade ({"α > 0.85"}) e estabilidade temporal.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-800 mb-2">30 Facetas Detalhadas</h4>
                  <p className="text-sm text-purple-700">
                    Cada fator é composto por 6 facetas específicas, totalizando 30 dimensões 
                    que oferecem uma análise granular e precisa da personalidade.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Aplicações e Considerações */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Aplicações e Considerações
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-800 mb-2">Aplicações Validadas</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Pesquisa acadêmica e científica</li>
                    <li>• Seleção e desenvolvimento de pessoal</li>
                    <li>• Coaching e desenvolvimento profissional</li>
                    <li>• Autoconhecimento e crescimento pessoal</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold text-yellow-800 mb-2">Considerações Importantes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Reflete tendências comportamentais típicas</li>
                    <li>• Personalidade pode variar conforme contexto</li>
                    <li>• Desenvolvimento contínuo ao longo da vida</li>
                    <li>• Complementar com outras avaliações</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-bold text-red-800 mb-2">Uso Responsável</h4>
                  <p className="text-sm text-red-700">
                    Este teste deve ser interpretado por profissionais qualificados. 
                    Não substitui avaliação psicológica completa ou diagnóstico clínico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Estatísticas do Teste */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5" />
                Estatísticas e Confiabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">120</div>
                  <div className="text-sm text-indigo-800 font-medium">Questões Analisadas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">30</div>
                  <div className="text-sm text-purple-800 font-medium">Facetas Detalhadas</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                  <div className="text-sm text-blue-800 font-medium">Fatores Principais</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(timeElapsed / 60)}</div>
                  <div className="text-sm text-green-800 font-medium">Minutos Investidos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">
                {isSubmitting ? 'Salvando resultados...' : 'Resultados salvos automaticamente!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              HumaniQ Big Five (IPIP-120)
            </h1>
            <p className="text-gray-600 mb-2">
              Questão {currentQuestion + 1} de {questions.length}
            </p>
            
            {/* Timer e Status */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Tempo: {formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Play className="w-4 h-4" />
                <span>Em andamento</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar Melhorada */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Início</span>
              <span>Conclusão</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {questions[currentQuestion].text}
            </CardTitle>
            <div className="text-center">
              <Badge variant="outline" className="text-purple-600">
                {factorNames[questions[currentQuestion].factor]} - {questions[currentQuestion].facet}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={answers[questions[currentQuestion].id]}
              onChange={handleAnswer}
              hideQuestion={true}
            />
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Selecione a opção que melhor descreve você
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}