'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Target, Users, Heart, Shield, Zap, Star, Eye, Compass, Clock, Award, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

interface Question {
  id: number
  text: string
  type: number // 1-9 representing the enneagram types
}

interface EnneagramResults {
  scores: number[]
  percentages: number[]
  primaryType: number
  secondaryType?: number
  wing?: number
  stressDirection: number
  growthDirection: number
  description: string
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  interpretation: string
  timeSpent: number
  completedAt: string
  radarData: Array<{
    type: string
    score: number
    fullMark: 45
  }>
}

const questions: Question[] = [
  // Tipo 1 - O Reformador
  { id: 1, text: "Preocupo-me em agir corretamente, mesmo quando ninguém está vendo.", type: 1 },
  { id: 2, text: "Sinto desconforto diante de erros ou imperfeições.", type: 1 },
  { id: 3, text: "Costumo me cobrar muito por excelência.", type: 1 },
  { id: 4, text: "Busco fazer as coisas da maneira certa.", type: 1 },
  { id: 5, text: "Tenho um forte senso de responsabilidade.", type: 1 },
  { id: 6, text: "Às vezes fico irritado quando os outros são relaxados com regras.", type: 1 },
  { id: 7, text: "Acredito que há uma maneira certa de fazer as coisas.", type: 1 },
  { id: 8, text: "Sinto necessidade de melhorar tudo ao meu redor.", type: 1 },
  { id: 9, text: "A injustiça me incomoda profundamente.", type: 1 },

  // Tipo 2 - O Prestativo
  { id: 10, text: "Tenho facilidade em perceber o que os outros precisam.", type: 2 },
  { id: 11, text: "Gosto de me sentir útil e necessário.", type: 2 },
  { id: 12, text: "Sinto satisfação quando sou valorizado por ajudar.", type: 2 },
  { id: 13, text: "Tenho dificuldade em dizer 'não'.", type: 2 },
  { id: 14, text: "Demonstro carinho com facilidade.", type: 2 },
  { id: 15, text: "Me preocupo com a opinião que os outros têm de mim.", type: 2 },
  { id: 16, text: "Às vezes faço mais pelos outros do que por mim mesmo.", type: 2 },
  { id: 17, text: "Preciso me sentir amado para estar bem.", type: 2 },
  { id: 18, text: "Costumo assumir tarefas para aliviar os outros.", type: 2 },

  // Tipo 3 - O Realizador
  { id: 19, text: "Gosto de ser reconhecido pelo meu sucesso.", type: 3 },
  { id: 20, text: "Tenho facilidade para me adaptar a diferentes situações.", type: 3 },
  { id: 21, text: "Costumo focar nos resultados mais do que no processo.", type: 3 },
  { id: 22, text: "Me preocupo com a imagem que projeto.", type: 3 },
  { id: 23, text: "Sou competitivo e gosto de vencer.", type: 3 },
  { id: 24, text: "Tenho facilidade para motivar outras pessoas.", type: 3 },
  { id: 25, text: "Busco constantemente novos objetivos.", type: 3 },
  { id: 26, text: "Me sinto bem quando sou admirado pelos outros.", type: 3 },
  { id: 27, text: "Prefiro ser eficiente a ser perfeito.", type: 3 },

  // Tipo 4 - O Individualista
  { id: 28, text: "Sinto que sou diferente das outras pessoas.", type: 4 },
  { id: 29, text: "Tenho uma vida emocional intensa.", type: 4 },
  { id: 30, text: "Valorizo muito a autenticidade.", type: 4 },
  { id: 31, text: "Às vezes me sinto incompreendido.", type: 4 },
  { id: 32, text: "Tenho facilidade para expressar criatividade.", type: 4 },
  { id: 33, text: "Costumo idealizar o que não tenho.", type: 4 },
  { id: 34, text: "Meus sentimentos influenciam muito minhas decisões.", type: 4 },
  { id: 35, text: "Busco profundidade em relacionamentos.", type: 4 },
  { id: 36, text: "Tenho tendência à melancolia.", type: 4 },

  // Tipo 5 - O Investigador
  { id: 37, text: "Prefiro observar antes de agir.", type: 5 },
  { id: 38, text: "Valorizo muito minha privacidade.", type: 5 },
  { id: 39, text: "Gosto de entender como as coisas funcionam.", type: 5 },
  { id: 40, text: "Prefiro trabalhar sozinho.", type: 5 },
  { id: 41, text: "Tenho facilidade para me concentrar profundamente.", type: 5 },
  { id: 42, text: "Às vezes me sinto drenado por interações sociais.", type: 5 },
  { id: 43, text: "Busco conhecimento constantemente.", type: 5 },
  { id: 44, text: "Prefiro pensar antes de falar.", type: 5 },
  { id: 45, text: "Tenho poucos relacionamentos, mas profundos.", type: 5 },

  // Tipo 6 - O Leal
  { id: 46, text: "Busco segurança em minhas decisões.", type: 6 },
  { id: 47, text: "Tenho facilidade para antecipar problemas.", type: 6 },
  { id: 48, text: "Valorizo muito a lealdade.", type: 6 },
  { id: 49, text: "Às vezes duvido de mim mesmo.", type: 6 },
  { id: 50, text: "Gosto de ter o apoio de outras pessoas.", type: 6 },
  { id: 51, text: "Costumo questionar autoridades.", type: 6 },
  { id: 52, text: "Me preocupo com possíveis riscos.", type: 6 },
  { id: 53, text: "Sou cauteloso em situações novas.", type: 6 },
  { id: 54, text: "Valorizo tradições e estruturas.", type: 6 },

  // Tipo 7 - O Entusiasta
  { id: 55, text: "Gosto de ter muitas opções disponíveis.", type: 7 },
  { id: 56, text: "Tenho facilidade para ver o lado positivo das situações.", type: 7 },
  { id: 57, text: "Busco constantemente novas experiências.", type: 7 },
  { id: 58, text: "Tenho dificuldade para me concentrar em uma coisa só.", type: 7 },
  { id: 59, text: "Sou espontâneo e flexível.", type: 7 },
  { id: 60, text: "Evito situações que me causam dor ou desconforto.", type: 7 },
  { id: 61, text: "Gosto de inspirar e motivar outras pessoas.", type: 7 },
  { id: 62, text: "Tenho muitos interesses e hobbies.", type: 7 },
  { id: 63, text: "Prefiro manter as coisas leves e divertidas.", type: 7 },

  // Tipo 8 - O Desafiador
  { id: 64, text: "Gosto de ter controle sobre situações.", type: 8 },
  { id: 65, text: "Não tenho medo de confrontos.", type: 8 },
  { id: 66, text: "Defendo os mais fracos.", type: 8 },
  { id: 67, text: "Sou direto e franco em minhas opiniões.", type: 8 },
  { id: 68, text: "Tenho facilidade para tomar decisões difíceis.", type: 8 },
  { id: 69, text: "Às vezes sou visto como intimidador.", type: 8 },
  { id: 70, text: "Gosto de desafios e riscos.", type: 8 },
  { id: 71, text: "Tenho dificuldade para mostrar vulnerabilidade.", type: 8 },
  { id: 72, text: "Busco justiça e equidade.", type: 8 },

  // Tipo 9 - O Pacificador
  { id: 73, text: "Evito conflitos sempre que possível.", type: 9 },
  { id: 74, text: "Tenho facilidade para ver diferentes pontos de vista.", type: 9 },
  { id: 75, text: "Valorizo muito a harmonia.", type: 9 },
  { id: 76, text: "Às vezes tenho dificuldade para tomar decisões.", type: 9 },
  { id: 77, text: "Sou uma pessoa calma e estável.", type: 9 },
  { id: 78, text: "Tenho tendência a procrastinar.", type: 9 },
  { id: 79, text: "Gosto de manter a paz no grupo.", type: 9 },
  { id: 80, text: "Às vezes me esqueço das minhas próprias necessidades.", type: 9 },
  { id: 81, text: "Prefiro seguir o fluxo a liderar.", type: 9 }
]

const enneagramTypes = [
  {
    number: 1,
    name: "O Reformador",
    description: "Perfeccionista, ético, busca integridade",
    motivation: "Ser bom, correto e perfeito",
    fear: "Ser corrupto, defeituoso ou errado",
    stressDirection: 4,
    growthDirection: 7,
    icon: <Target className="w-6 h-6" />
  },
  {
    number: 2,
    name: "O Prestativo",
    description: "Voltado ao outro, busca amor e aceitação",
    motivation: "Sentir-se amado e necessário",
    fear: "Ser rejeitado ou indesejado",
    stressDirection: 8,
    growthDirection: 4,
    icon: <Heart className="w-6 h-6" />
  },
  {
    number: 3,
    name: "O Realizador",
    description: "Foco em metas e imagem de sucesso",
    motivation: "Sentir-se valioso e admirado",
    fear: "Ser sem valor ou sem mérito",
    stressDirection: 9,
    growthDirection: 6,
    icon: <Star className="w-6 h-6" />
  },
  {
    number: 4,
    name: "O Individualista",
    description: "Sensível, criativo e emocional",
    motivation: "Encontrar-se e sua significância",
    fear: "Não ter identidade ou significado",
    stressDirection: 2,
    growthDirection: 1,
    icon: <Eye className="w-6 h-6" />
  },
  {
    number: 5,
    name: "O Investigador",
    description: "Analítico, busca conhecimento e privacidade",
    motivation: "Ser competente e compreender",
    fear: "Ser invadido ou incapaz",
    stressDirection: 7,
    growthDirection: 8,
    icon: <Brain className="w-6 h-6" />
  },
  {
    number: 6,
    name: "O Leal",
    description: "Confiável, cauteloso, busca segurança",
    motivation: "Ter segurança e apoio",
    fear: "Ficar sem apoio ou orientação",
    stressDirection: 3,
    growthDirection: 9,
    icon: <Shield className="w-6 h-6" />
  },
  {
    number: 7,
    name: "O Entusiasta",
    description: "Otimista, busca variedade e liberdade",
    motivation: "Manter-se satisfeito e contente",
    fear: "Ficar preso na dor ou privação",
    stressDirection: 1,
    growthDirection: 5,
    icon: <Zap className="w-6 h-6" />
  },
  {
    number: 8,
    name: "O Desafiador",
    description: "Forte, assertivo, busca controle",
    motivation: "Ser autossuficiente e controlar",
    fear: "Ser controlado ou vulnerável",
    stressDirection: 5,
    growthDirection: 2,
    icon: <Users className="w-6 h-6" />
  },
  {
    number: 9,
    name: "O Pacificador",
    description: "Calmo, diplomático, busca harmonia",
    motivation: "Manter paz interior e exterior",
    fear: "Perda de conexão e fragmentação",
    stressDirection: 6,
    growthDirection: 3,
    icon: <Compass className="w-6 h-6" />
  }
]

export default function HumaniQEneagrama() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(81).fill(0))
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<EnneagramResults | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [timeSpent, setTimeSpent] = useState(0)
  const [isTestStarted, setIsTestStarted] = useState(false)

  // Timer effect
  useEffect(() => {
    if (isTestStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTestStarted, showResults, startTime])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start test
  const startTest = () => {
    setIsTestStarted(true)
    toast.success('Teste iniciado! Responda com sinceridade para obter resultados precisos.')
  }

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    
    // Auto advance to next question or complete test
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 400)
    } else {
      // Complete test automatically after last question
      setTimeout(() => {
        calculateResults(newAnswers)
      }, 400)
    }
  }

  const currentAnswer = answers[currentQuestion] || 0

  const calculateResults = (finalAnswers: number[]) => {
    // Calculate scores for each type (1-9)
    const scores = new Array(9).fill(0)
    
    finalAnswers.forEach((answer, index) => {
      const questionType = questions[index].type
      scores[questionType - 1] += answer
    })

    // Calculate percentages
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const percentages = scores.map(score => Math.round((score / totalScore) * 100))

    // Find primary and secondary types
    const sortedScores = [...scores].sort((a, b) => b - a)
    const maxScore = sortedScores[0]
    const secondMaxScore = sortedScores[1]
    
    const primaryType = scores.indexOf(maxScore) + 1
    const secondaryType = scores.indexOf(secondMaxScore) + 1

    // Check for wing (adjacent types with high scores)
    let wing: number | undefined
    const leftWing = primaryType === 1 ? 9 : primaryType - 1
    const rightWing = primaryType === 9 ? 1 : primaryType + 1
    
    const leftWingScore = scores[leftWing - 1]
    const rightWingScore = scores[rightWing - 1]
    
    if (Math.abs(maxScore - leftWingScore) <= 3 && leftWingScore > rightWingScore) {
      wing = leftWing
    } else if (Math.abs(maxScore - rightWingScore) <= 3 && rightWingScore > leftWingScore) {
      wing = rightWing
    }

    // Create radar chart data
    const radarData = enneagramTypes.map((type, index) => ({
      type: `Tipo ${type.number}`,
      score: scores[index],
      fullMark: 45 as const
    }))

    const typeInfo = enneagramTypes[primaryType - 1]
    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    const calculatedResults: EnneagramResults = {
      scores,
      percentages,
      primaryType,
      secondaryType: secondaryType !== primaryType ? secondaryType : undefined,
      wing,
      stressDirection: typeInfo.stressDirection,
      growthDirection: typeInfo.growthDirection,
      description: getTypeDescription(primaryType, wing),
      strengths: getTypeStrengths(primaryType),
      challenges: getTypeChallenges(primaryType),
      recommendations: getTypeRecommendations(primaryType),
      interpretation: getDetailedInterpretation(primaryType, secondaryType, wing, percentages),
      timeSpent: finalTimeSpent,
      completedAt: new Date().toISOString(),
      radarData
    }

    setResults(calculatedResults)
    setShowResults(true)
    toast.success('Teste concluído! Analisando seu perfil Eneagrama...')
  }

  const getTypeDescription = (type: number, wing?: number): string => {
    const descriptions: { [key: number]: string } = {
      1: "Você é uma pessoa ética, responsável e perfeccionista. Busca sempre fazer o que é certo e tem um forte senso de integridade. Pode ser crítico consigo mesmo e com os outros quando os padrões não são atendidos.",
      2: "Você é uma pessoa calorosa, prestativa e orientada para os relacionamentos. Tem facilidade para perceber as necessidades dos outros e se sente realizado ao ajudar. Pode negligenciar suas próprias necessidades.",
      3: "Você é uma pessoa ambiciosa, adaptável e orientada para o sucesso. Tem facilidade para alcançar objetivos e se apresentar de forma positiva. Pode focar demais na imagem e nos resultados.",
      4: "Você é uma pessoa criativa, sensível e autêntica. Valoriza a individualidade e tem uma rica vida emocional. Pode tender à melancolia e se sentir incompreendido.",
      5: "Você é uma pessoa analítica, observadora e independente. Busca compreender o mundo através do conhecimento e valoriza sua privacidade. Pode se isolar emocionalmente.",
      6: "Você é uma pessoa leal, responsável e orientada para a segurança. Valoriza relacionamentos estáveis e pode ser cauteloso com mudanças. Pode tender à ansiedade e dúvida.",
      7: "Você é uma pessoa entusiasta, otimista e versátil. Busca experiências positivas e tem facilidade para ver oportunidades. Pode ter dificuldade para se comprometer ou lidar com aspectos negativos.",
      8: "Você é uma pessoa forte, assertiva e protetora. Tem facilidade para liderar e tomar decisões difíceis. Pode ser confrontativo e ter dificuldade para mostrar vulnerabilidade.",
      9: "Você é uma pessoa pacífica, estável e diplomática. Valoriza a harmonia e tem facilidade para ver diferentes perspectivas. Pode tender à procrastinação e evitar conflitos."
    }
    
    let description = descriptions[type] || ""
    if (wing) {
      description += ` Com influência do Tipo ${wing}, você também apresenta características de ${enneagramTypes[wing - 1].name.toLowerCase()}.`
    }
    
    return description
  }

  const getTypeStrengths = (type: number): string[] => {
    const strengths: { [key: number]: string[] } = {
      1: ["Ética e integridade", "Atenção aos detalhes", "Responsabilidade", "Busca pela excelência", "Senso de justiça"],
      2: ["Empatia e compaixão", "Habilidades interpessoais", "Generosidade", "Intuição emocional", "Capacidade de apoio"],
      3: ["Orientação para resultados", "Adaptabilidade", "Carisma e presença", "Eficiência", "Motivação para o sucesso"],
      4: ["Criatividade e originalidade", "Profundidade emocional", "Autenticidade", "Sensibilidade estética", "Capacidade de transformação"],
      5: ["Pensamento analítico", "Independência", "Objetividade", "Capacidade de concentração", "Conhecimento especializado"],
      6: ["Lealdade e confiabilidade", "Pensamento estratégico", "Senso de responsabilidade", "Capacidade de trabalho em equipe", "Prudência"],
      7: ["Otimismo e entusiasmo", "Criatividade e inovação", "Flexibilidade", "Energia e vitalidade", "Visão de possibilidades"],
      8: ["Liderança natural", "Coragem e determinação", "Proteção aos outros", "Tomada de decisão", "Energia e intensidade"],
      9: ["Diplomacia e mediação", "Estabilidade emocional", "Aceitação e inclusão", "Paciência", "Capacidade de síntese"]
    }
    return strengths[type] || []
  }

  const getTypeChallenges = (type: number): string[] => {
    const challenges: { [key: number]: string[] } = {
      1: ["Perfeccionismo excessivo", "Crítica e julgamento", "Rigidez", "Dificuldade para relaxar", "Impaciência com erros"],
      2: ["Negligência das próprias necessidades", "Dependência emocional", "Manipulação sutil", "Dificuldade para dizer não", "Ressentimento não expresso"],
      3: ["Foco excessivo na imagem", "Dificuldade com vulnerabilidade", "Competitividade destrutiva", "Negligência de emoções", "Burnout por excesso de trabalho"],
      4: ["Instabilidade emocional", "Tendência à melancolia", "Comparação com outros", "Dramatização", "Dificuldade com rotina"],
      5: ["Isolamento social", "Dificuldade com emoções", "Procrastinação", "Avareza emocional", "Desconexão do corpo"],
      6: ["Ansiedade e preocupação", "Dúvida excessiva", "Dependência de autoridade", "Procrastinação por medo", "Pessimismo"],
      7: ["Dificuldade de comprometimento", "Evitação de dor", "Superficialidade", "Impulsividade", "FOMO (medo de perder algo)"],
      8: ["Tendência ao confronto", "Dificuldade com vulnerabilidade", "Impaciência", "Controle excessivo", "Intensidade intimidadora"],
      9: ["Procrastinação", "Evitação de conflitos", "Inércia", "Dificuldade para priorizar", "Negligência de si mesmo"]
    }
    return challenges[type] || []
  }

  const getTypeRecommendations = (type: number): string[] => {
    const recommendations: { [key: number]: string[] } = {
      1: ["Pratique autocompaixão e aceite imperfeições", "Desenvolva flexibilidade e tolerância", "Encontre formas saudáveis de expressar raiva", "Cultive paciência consigo mesmo", "Busque equilíbrio entre trabalho e lazer"],
      2: ["Pratique autocuidado regularmente", "Aprenda a identificar e expressar suas necessidades", "Desenvolva independência emocional", "Estabeleça limites saudáveis", "Cultive relacionamentos recíprocos"],
      3: ["Pratique vulnerabilidade e autenticidade", "Conecte-se com suas emoções genuínas", "Valorize o processo, não apenas resultados", "Desenvolva relacionamentos profundos", "Encontre propósito além do sucesso"],
      4: ["Cultive estabilidade emocional", "Pratique gratidão pelo que tem", "Desenvolva disciplina e rotina", "Busque conexões genuínas", "Canalize criatividade de forma produtiva"],
      5: ["Pratique conexão emocional", "Desenvolva habilidades sociais", "Compartilhe conhecimento com outros", "Cultive relacionamentos íntimos", "Equilibre reflexão com ação"],
      6: ["Desenvolva autoconfiança", "Pratique tomada de decisão independente", "Cultive pensamento positivo", "Busque segurança interna", "Aprenda a confiar em sua intuição"],
      7: ["Pratique foco e comprometimento", "Desenvolva tolerância à frustração", "Cultive profundidade em relacionamentos", "Aprenda a processar emoções difíceis", "Estabeleça prioridades claras"],
      8: ["Pratique vulnerabilidade e humildade", "Desenvolva paciência e diplomacia", "Cultive empatia e compaixão", "Aprenda a delegar e confiar", "Busque equilíbrio entre força e gentileza"],
      9: ["Desenvolva assertividade", "Pratique tomada de decisão", "Cultive energia e motivação", "Estabeleça prioridades pessoais", "Aprenda a lidar com conflitos construtivamente"]
    }
    return recommendations[type] || []
  }

  const getDetailedInterpretation = (primaryType: number, secondaryType?: number, wing?: number, percentages?: number[]): string => {
    const primaryInfo = enneagramTypes[primaryType - 1]
    let interpretation = `Seu perfil Eneagrama indica que você é predominantemente do ${primaryInfo.name} (Tipo ${primaryType}), representando ${percentages ? percentages[primaryType - 1] : 0}% do seu perfil total. `
    
    interpretation += `Isso significa que sua motivação central é ${primaryInfo.motivation.toLowerCase()}, e seu maior medo é ${primaryInfo.fear.toLowerCase()}. `
    
    if (secondaryType && secondaryType !== primaryType) {
      const secondaryInfo = enneagramTypes[secondaryType - 1]
      interpretation += `Seu tipo secundário é o ${secondaryInfo.name} (Tipo ${secondaryType}), com ${percentages ? percentages[secondaryType - 1] : 0}% do seu perfil, o que adiciona características de ${secondaryInfo.description.toLowerCase()} ao seu comportamento. `
    }
    
    if (wing) {
      const wingInfo = enneagramTypes[wing - 1]
      interpretation += `Sua asa ${wing} (${wingInfo.name}) influencia seu comportamento, trazendo elementos de ${wingInfo.description.toLowerCase()}. `
    }
    
    interpretation += `Em situações de stress, você pode apresentar comportamentos do Tipo ${primaryInfo.stressDirection}, enquanto em momentos de crescimento, você desenvolve qualidades do Tipo ${primaryInfo.growthDirection}.`
    
    return interpretation
  }

  const completeTest = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send results to your API
      console.log('Enneagram test completed:', results)
      
      // Redirect to results page or dashboard
      router.push('/colaborador/resultados?saved=1')
    } catch (error) {
      console.error('Error submitting test:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showResults && results) {
    const primaryTypeInfo = enneagramTypes[results.primaryType - 1]
    const stressTypeInfo = enneagramTypes[results.stressDirection - 1]
    const growthTypeInfo = enneagramTypes[results.growthDirection - 1]

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {primaryTypeInfo.icon}
                <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800">
                  Mapeamento de Personalidade
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Seu Tipo: {primaryTypeInfo.name}
              </CardTitle>
              <CardDescription className="text-lg">
                {primaryTypeInfo.description}
                {results.wing && ` com asa ${results.wing}`}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Desafios de Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Descrição do Seu Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{results.description}</p>
              
              {/* Interpretação Detalhada */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  Interpretação Detalhada
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {results.interpretation}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5 text-red-500" />
                  Direção de Stress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  {stressTypeInfo.icon}
                  <div>
                    <p className="font-semibold text-gray-800">Tipo {results.stressDirection} - {stressTypeInfo.name}</p>
                    <p className="text-sm text-gray-600">Comportamentos que podem emergir sob pressão</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-500" />
                  Direção de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  {growthTypeInfo.icon}
                  <div>
                    <p className="font-semibold text-gray-800">Tipo {results.growthDirection} - {growthTypeInfo.name}</p>
                    <p className="text-sm text-gray-600">Qualidades a desenvolver para crescimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Recomendações de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Gráfico de Radar dos 9 Tipos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Perfil Eneagrama - Distribuição dos 9 Tipos
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Visualização das suas pontuações em cada um dos 9 tipos de personalidade
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={results.radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid gridType="polygon" className="stroke-gray-200" />
                    <PolarAngleAxis 
                      dataKey="type" 
                      className="text-xs font-medium" 
                      tick={{ fontSize: 11, fill: '#374151' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      className="text-xs" 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      tickCount={6}
                    />
                    <Radar
                      name="Pontuação (%)"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legenda dos Tipos */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                {enneagramTypes.map((type, index) => (
                  <div key={type.number} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <div className="w-3 h-3 text-purple-600">
                      {React.cloneElement(type.icon, { className: "w-3 h-3" })}
                    </div>
                    <span className="font-medium">{type.number}</span>
                    <span className="text-gray-600 truncate">{type.name}</span>
                    <span className="ml-auto font-semibold text-purple-600">
                      {results.percentages[index]}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push('/colaborador/psicossociais')}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Testes
            </Button>
            <div className="text-center text-sm text-gray-600 px-6 py-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              Resultados salvos automaticamente
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/colaborador/psicossociais/humaniq-eneagrama/introducao')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                Mapeamento de Personalidade
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Questão {currentQuestion + 1} de {questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(timeSpent)}
                  </span>
                  <span>{Math.round(progress)}% concluído</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={currentAnswer}
              onChange={handleAnswer}
              hideQuestion={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}