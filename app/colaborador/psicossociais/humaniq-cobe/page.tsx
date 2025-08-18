'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LikertScale } from '@/components/ui/likert-scale'
import { ArrowLeft, ArrowRight, CheckCircle, Users, MessageSquare, Scale, BarChart3, Brain, Clock, TrendingUp } from 'lucide-react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Question {
  id: number
  text: string
  dimension: string
}

interface DimensionResult {
  name: string
  score: number
  classification: string
  description: string
  recommendations: string[]
}

interface TestResult {
  overallScore: number
  overallClassification: string
  dimensions: DimensionResult[]
}

const questions: Question[] = [
  // 1. Liderança & Confiança (itens 1-5)
  { id: 1, text: "Confio na capacidade da minha liderança para tomar decisões acertadas.", dimension: "Liderança & Confiança" },
  { id: 2, text: "Meu gestor demonstra interesse genuíno no meu desenvolvimento profissional.", dimension: "Liderança & Confiança" },
  { id: 3, text: "Sinto que posso contar com o apoio da liderança quando preciso.", dimension: "Liderança & Confiança" },
  { id: 4, text: "A liderança age de forma consistente com os valores que prega.", dimension: "Liderança & Confiança" },
  { id: 5, text: "Meu gestor me trata com respeito e dignidade.", dimension: "Liderança & Confiança" },

  // 2. Comunicação & Transparência (itens 6-10)
  { id: 6, text: "Recebo informações claras sobre as decisões que afetam meu trabalho.", dimension: "Comunicação & Transparência" },
  { id: 7, text: "A comunicação na empresa é aberta e transparente.", dimension: "Comunicação & Transparência" },
  { id: 8, text: "Sinto-me à vontade para expressar minhas opiniões e ideias.", dimension: "Comunicação & Transparência" },
  { id: 9, text: "As informações importantes chegam até mim no tempo adequado.", dimension: "Comunicação & Transparência" },
  { id: 10, text: "Existe diálogo aberto entre diferentes níveis hierárquicos.", dimension: "Comunicação & Transparência" },

  // 3. Reconhecimento & Recompensas (itens 11-15)
  { id: 11, text: "Recebo reconhecimento adequado pelo meu bom desempenho.", dimension: "Reconhecimento & Recompensas" },
  { id: 12, text: "Meus esforços e contribuições são valorizados pela empresa.", dimension: "Reconhecimento & Recompensas" },
  { id: 13, text: "O sistema de recompensas da empresa é justo e transparente.", dimension: "Reconhecimento & Recompensas" },
  { id: 14, text: "Sinto que meu trabalho faz diferença e é reconhecido.", dimension: "Reconhecimento & Recompensas" },
  { id: 15, text: "A empresa celebra conquistas e sucessos da equipe.", dimension: "Reconhecimento & Recompensas" },

  // 4. Trabalho & Carga (itens 16-20, item 20 invertido)
  { id: 16, text: "Minha carga de trabalho é adequada e gerenciável.", dimension: "Trabalho & Carga" },
  { id: 17, text: "Tenho tempo suficiente para realizar minhas tarefas com qualidade.", dimension: "Trabalho & Carga" },
  { id: 18, text: "As demandas do meu trabalho são realistas e alcançáveis.", dimension: "Trabalho & Carga" },
  { id: 19, text: "Consigo manter um bom equilíbrio entre vida pessoal e profissional.", dimension: "Trabalho & Carga" },
  { id: 20, text: "Frequentemente me sinto sobrecarregado com o volume de trabalho.", dimension: "Trabalho & Carga" }, // ITEM INVERTIDO

  // 5. Recursos & Suporte ao Trabalho (itens 21-25)
  { id: 21, text: "Tenho acesso aos recursos necessários para realizar meu trabalho.", dimension: "Recursos & Suporte ao Trabalho" },
  { id: 22, text: "Recebo o suporte técnico adequado quando preciso.", dimension: "Recursos & Suporte ao Trabalho" },
  { id: 23, text: "As ferramentas e equipamentos disponíveis são adequados.", dimension: "Recursos & Suporte ao Trabalho" },
  { id: 24, text: "Tenho acesso às informações necessárias para tomar decisões.", dimension: "Recursos & Suporte ao Trabalho" },
  { id: 25, text: "O ambiente físico de trabalho é adequado e confortável.", dimension: "Recursos & Suporte ao Trabalho" },

  // 6. Colaboração & Trabalho em Equipe (itens 26-30)
  { id: 26, text: "Existe boa colaboração entre os membros da minha equipe.", dimension: "Colaboração & Trabalho em Equipe" },
  { id: 27, text: "Sinto que posso contar com meus colegas quando preciso de ajuda.", dimension: "Colaboração & Trabalho em Equipe" },
  { id: 28, text: "Trabalhamos bem juntos para alcançar objetivos comuns.", dimension: "Colaboração & Trabalho em Equipe" },
  { id: 29, text: "Há espírito de cooperação e apoio mútuo na equipe.", dimension: "Colaboração & Trabalho em Equipe" },
  { id: 30, text: "As diferentes áreas da empresa colaboram efetivamente.", dimension: "Colaboração & Trabalho em Equipe" },

  // 7. Segurança Psicológica (itens 31-35)
  { id: 31, text: "Sinto-me seguro para expressar minhas opiniões sem medo de retaliação.", dimension: "Segurança Psicológica" },
  { id: 32, text: "Posso admitir erros sem medo de ser punido ou humilhado.", dimension: "Segurança Psicológica" },
  { id: 33, text: "Sinto-me à vontade para fazer perguntas quando tenho dúvidas.", dimension: "Segurança Psicológica" },
  { id: 34, text: "Posso discordar de decisões sem medo de consequências negativas.", dimension: "Segurança Psicológica" },
  { id: 35, text: "O ambiente de trabalho encoraja a tomada de riscos calculados.", dimension: "Segurança Psicológica" },

  // 8. Justiça & Ética Organizacional (itens 36-40)
  { id: 36, text: "As decisões na empresa são tomadas de forma justa e imparcial.", dimension: "Justiça & Ética Organizacional" },
  { id: 37, text: "As políticas e procedimentos são aplicados consistentemente.", dimension: "Justiça & Ética Organizacional" },
  { id: 38, text: "A empresa age de acordo com princípios éticos sólidos.", dimension: "Justiça & Ética Organizacional" },
  { id: 39, text: "Sinto que sou tratado com justiça em relação aos meus colegas.", dimension: "Justiça & Ética Organizacional" },
  { id: 40, text: "Existe transparência nos processos de tomada de decisão.", dimension: "Justiça & Ética Organizacional" },

  // 9. Desenvolvimento & Carreira (itens 41-45)
  { id: 41, text: "Tenho oportunidades claras de crescimento profissional.", dimension: "Desenvolvimento & Carreira" },
  { id: 42, text: "A empresa investe no meu desenvolvimento e capacitação.", dimension: "Desenvolvimento & Carreira" },
  { id: 43, text: "Recebo feedback regular sobre meu desempenho e desenvolvimento.", dimension: "Desenvolvimento & Carreira" },
  { id: 44, text: "Vejo um futuro promissor para minha carreira nesta empresa.", dimension: "Desenvolvimento & Carreira" },
  { id: 45, text: "Tenho acesso a treinamentos e programas de desenvolvimento.", dimension: "Desenvolvimento & Carreira" },

  // 10. Propósito, Valores & Orgulho (itens 46-50)
  { id: 46, text: "Sinto orgulho de trabalhar nesta empresa.", dimension: "Propósito, Valores & Orgulho" },
  { id: 47, text: "Meu trabalho tem significado e propósito para mim.", dimension: "Propósito, Valores & Orgulho" },
  { id: 48, text: "Os valores da empresa estão alinhados com meus valores pessoais.", dimension: "Propósito, Valores & Orgulho" },
  { id: 49, text: "Sinto que contribuo para algo maior que meu trabalho individual.", dimension: "Propósito, Valores & Orgulho" },
  { id: 50, text: "Recomendaria esta empresa como um bom lugar para trabalhar.", dimension: "Propósito, Valores & Orgulho" },

  // 11. Bem-estar & Equilíbrio Vida-Trabalho (itens 51-55)
  { id: 51, text: "A empresa se preocupa genuinamente com meu bem-estar.", dimension: "Bem-estar & Equilíbrio Vida-Trabalho" },
  { id: 52, text: "Consigo manter um equilíbrio saudável entre trabalho e vida pessoal.", dimension: "Bem-estar & Equilíbrio Vida-Trabalho" },
  { id: 53, text: "Sinto-me apoiado quando preciso lidar com questões pessoais.", dimension: "Bem-estar & Equilíbrio Vida-Trabalho" },
  { id: 54, text: "O ambiente de trabalho promove minha saúde física e mental.", dimension: "Bem-estar & Equilíbrio Vida-Trabalho" },
  { id: 55, text: "Tenho flexibilidade para gerenciar meu tempo de trabalho quando necessário.", dimension: "Bem-estar & Equilíbrio Vida-Trabalho" },

  // 12. Gestão da Mudança & Inovação (itens 56-60)
  { id: 56, text: "A empresa gerencia mudanças de forma eficaz e transparente.", dimension: "Gestão da Mudança & Inovação" },
  { id: 57, text: "Sou envolvido adequadamente nos processos de mudança.", dimension: "Gestão da Mudança & Inovação" },
  { id: 58, text: "A empresa encoraja inovação e novas ideias.", dimension: "Gestão da Mudança & Inovação" },
  { id: 59, text: "Sinto-me preparado para lidar com as mudanças organizacionais.", dimension: "Gestão da Mudança & Inovação" },
  { id: 60, text: "A empresa adapta-se bem às mudanças do mercado e ambiente.", dimension: "Gestão da Mudança & Inovação" }
]

// Removido responseOptions - agora usando LikertScale component

export default function HumaniQCOBEPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar se deve redirecionar para introdução
  useEffect(() => {
    const startParam = searchParams.get('start')
    if (!startParam || startParam !== 'true') {
      router.push('/colaborador/psicossociais/humaniq-cobe/introducao')
    }
  }, [searchParams, router])

  // Timer
  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showResults])

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    // Auto-advance to next question or complete test
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // All questions answered, show results automatically
        setShowResults(true)
      }
    }, 300)
  }

  const calculateResults = (): TestResult => {
    const dimensionScores: { [key: string]: number[] } = {}
    
    // Agrupar respostas por dimensão
    questions.forEach((question) => {
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = []
      }
      
      // Aplicar inversão para o item 20
      let score = answers[question.id] || 0
      if (question.id === 20) {
        score = 6 - score // Inversão: 1→5, 2→4, 3→3, 4→2, 5→1
      }
      
      dimensionScores[question.dimension].push(score)
    })
    
    // Calcular média por dimensão e reescalar para 0-100
    const dimensionResults: DimensionResult[] = Object.keys(dimensionScores).map(dimension => {
      const scores = dimensionScores[dimension]
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      // Reescalar de 1-5 para 0-100: ((média - 1) / 4) * 100
      const scaledScore = ((average - 1) / 4) * 100
      
      const classification = getClassification(scaledScore)
      const description = getDimensionDescription(dimension, classification)
      const recommendations = getDimensionRecommendations(dimension, classification)

      return {
        name: dimension,
        score: Number(scaledScore.toFixed(2)),
        classification,
        description,
        recommendations
      }
    })

    // Calcular IGC (Índice Global de Clima) como média das dimensões
    const overallScore = dimensionResults.reduce((sum, dim) => sum + dim.score, 0) / dimensionResults.length
    const overallClassification = getClassification(overallScore)

    const result: TestResult = {
      overallScore: Number(overallScore.toFixed(2)),
      overallClassification,
      dimensions: dimensionResults
    }

    setShowResults(true)
    return result
  }

  const getClassification = (score: number): string => {
    if (score >= 85) return "Excelente"
    if (score >= 70) return "Sólido"
    if (score >= 55) return "Atenção"
    return "Crítico"
  }

  const getDimensionDescription = (dimension: string, classification: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      "Liderança & Confiança": {
        "Excelente": "Liderança altamente confiável e eficaz. Colaboradores têm plena confiança na capacidade de gestão e sentem-se apoiados.",
        "Sólido": "Boa relação de confiança com a liderança. Há base sólida para desenvolvimento contínuo.",
        "Atenção": "Confiança na liderança precisa ser fortalecida. Oportunidades de melhoria na relação gestor-colaborador.",
        "Crítico": "Baixa confiança na liderança. Necessária intervenção urgente para reconstruir a relação de confiança."
      },
      "Comunicação & Transparência": {
        "Excelente": "Comunicação transparente e eficaz em todos os níveis. Informações fluem adequadamente.",
        "Sólido": "Boa comunicação organizacional com oportunidades pontuais de melhoria.",
        "Atenção": "Comunicação precisa ser aprimorada. Gaps informativos podem estar impactando o engajamento.",
        "Crítico": "Comunicação deficiente. Falta de transparência está prejudicando o clima organizacional."
      },
      "Reconhecimento & Recompensas": {
        "Excelente": "Sistema de reconhecimento eficaz e justo. Colaboradores sentem-se valorizados por suas contribuições.",
        "Sólido": "Bom nível de reconhecimento com oportunidades de aprimoramento.",
        "Atenção": "Reconhecimento insuficiente. Colaboradores podem não se sentir adequadamente valorizados.",
        "Crítico": "Falta de reconhecimento está impactando negativamente a motivação e engajamento."
      },
      "Trabalho & Carga": {
        "Excelente": "Carga de trabalho bem equilibrada e gerenciável. Colaboradores conseguem manter qualidade e bem-estar.",
        "Sólido": "Carga de trabalho adequada com pontos de atenção específicos.",
        "Atenção": "Sobrecarga de trabalho pode estar impactando a qualidade e bem-estar dos colaboradores.",
        "Crítico": "Sobrecarga crítica. Risco elevado de burnout e impacto na saúde dos colaboradores."
      },
      "Recursos & Suporte ao Trabalho": {
        "Excelente": "Recursos e suporte adequados para execução eficaz do trabalho.",
        "Sólido": "Bom nível de recursos com oportunidades pontuais de melhoria.",
        "Atenção": "Recursos insuficientes podem estar limitando a produtividade e qualidade.",
        "Crítico": "Falta crítica de recursos está prejudicando significativamente o desempenho."
      },
      "Colaboração & Trabalho em Equipe": {
        "Excelente": "Excelente colaboração e espírito de equipe. Sinergia positiva entre colaboradores.",
        "Sólido": "Boa colaboração com oportunidades de fortalecimento.",
        "Atenção": "Colaboração precisa ser melhorada. Possíveis silos ou conflitos interpessoais.",
        "Crítico": "Colaboração deficiente está impactando negativamente os resultados da equipe."
      },
      "Segurança Psicológica": {
        "Excelente": "Ambiente psicologicamente seguro. Colaboradores sentem-se à vontade para expressar opiniões e assumir riscos.",
        "Sólido": "Boa segurança psicológica com oportunidades de fortalecimento.",
        "Atenção": "Segurança psicológica precisa ser desenvolvida. Colaboradores podem estar hesitantes.",
        "Crítico": "Baixa segurança psicológica está inibindo inovação e engajamento."
      },
      "Justiça & Ética Organizacional": {
        "Excelente": "Percepção muito positiva de justiça e ética. Processos transparentes e equitativos.",
        "Sólido": "Boa percepção de justiça com oportunidades de aprimoramento.",
        "Atenção": "Percepção de justiça precisa ser melhorada. Possíveis questionamentos sobre equidade.",
        "Crítico": "Percepção negativa de justiça está prejudicando a confiança organizacional."
      },
      "Desenvolvimento & Carreira": {
        "Excelente": "Excelentes oportunidades de desenvolvimento e crescimento profissional.",
        "Sólido": "Boas oportunidades de desenvolvimento com espaço para expansão.",
        "Atenção": "Oportunidades de desenvolvimento limitadas podem estar impactando a retenção.",
        "Crítico": "Falta de perspectivas de crescimento está prejudicando o engajamento e retenção."
      },
      "Propósito, Valores & Orgulho": {
        "Excelente": "Forte alinhamento com propósito e valores. Alto orgulho organizacional.",
        "Sólido": "Bom alinhamento com oportunidades de fortalecimento do propósito.",
        "Atenção": "Conexão com propósito e valores precisa ser desenvolvida.",
        "Crítico": "Desalinhamento com propósito está impactando o engajamento e orgulho."
      },
      "Bem-estar & Equilíbrio Vida-Trabalho": {
        "Excelente": "Excelente equilíbrio vida-trabalho e cuidado com o bem-estar dos colaboradores.",
        "Sólido": "Bom equilíbrio com oportunidades de aprimoramento das práticas de bem-estar.",
        "Atenção": "Equilíbrio vida-trabalho precisa ser melhorado. Possível impacto no bem-estar.",
        "Crítico": "Desequilíbrio crítico está prejudicando a saúde e bem-estar dos colaboradores."
      },
      "Gestão da Mudança & Inovação": {
        "Excelente": "Excelente gestão de mudanças e cultura de inovação bem estabelecida.",
        "Sólido": "Boa capacidade de adaptação com oportunidades de fortalecimento da inovação.",
        "Atenção": "Gestão de mudanças precisa ser aprimorada. Resistência ou dificuldades de adaptação.",
        "Crítico": "Dificuldades críticas na gestão de mudanças estão prejudicando a adaptabilidade organizacional."
      }
    }
    return descriptions[dimension]?.[classification] || "Descrição não disponível"
  }

  const getDimensionRecommendations = (dimension: string, classification: string): string[] => {
    const recommendations: Record<string, Record<string, string[]>> = {
      "Liderança & Confiança": {
        "Excelente": [
          "Mantenha as práticas atuais de liderança transparente e empática",
          "Continue desenvolvendo líderes como modelos de comportamento",
          "Compartilhe as melhores práticas de liderança com outras áreas"
        ],
        "Sólido": [
          "Implemente programas de desenvolvimento de liderança",
          "Promova maior proximidade entre gestores e equipes",
          "Estabeleça canais regulares de feedback sobre liderança"
        ],
        "Atenção": [
          "Realize treinamentos intensivos em liderança empática",
          "Implemente mentoria para gestores com dificuldades",
          "Estabeleça metas claras de melhoria na relação gestor-colaborador"
        ],
        "Crítico": [
          "Intervenção urgente: avalie e substitua lideranças inadequadas",
          "Implemente programa emergencial de reconstrução de confiança",
          "Estabeleça ouvidoria e canais anônimos para denúncias"
        ]
      },
      "Comunicação & Transparência": {
        "Excelente": [
          "Mantenha os altos padrões de transparência e clareza",
          "Continue utilizando múltiplos canais de comunicação eficazes",
          "Promova a comunicação como diferencial competitivo"
        ],
        "Sólido": [
          "Melhore a frequência das comunicações organizacionais",
          "Implemente ferramentas de comunicação mais interativas",
          "Treine líderes em técnicas de comunicação clara"
        ],
        "Atenção": [
          "Revise os processos de comunicação interna",
          "Implemente canais de comunicação bidirecionais",
          "Realize pesquisas sobre eficácia da comunicação"
        ],
        "Crítico": [
          "Reestruture completamente a estratégia de comunicação",
          "Implemente transparência radical nas decisões",
          "Estabeleça comunicação de crise para reconstruir confiança"
        ]
      },
      "Reconhecimento & Recompensas": {
        "Excelente": [
          "Mantenha o sistema de reconhecimento diversificado e justo",
          "Continue celebrando conquistas individuais e coletivas",
          "Expanda as práticas de reconhecimento para outras áreas"
        ],
        "Sólido": [
          "Diversifique as formas de reconhecimento além do financeiro",
          "Implemente reconhecimento peer-to-peer",
          "Aumente a frequência de feedbacks positivos"
        ],
        "Atenção": [
          "Revise os critérios de reconhecimento para maior equidade",
          "Implemente sistema estruturado de reconhecimento",
          "Treine gestores em técnicas de reconhecimento eficaz"
        ],
        "Crítico": [
          "Implemente urgentemente sistema de reconhecimento justo",
          "Revise completamente políticas de recompensas",
          "Estabeleça metas de melhoria na percepção de valorização"
        ]
      },
      "Trabalho & Carga": {
        "Excelente": [
          "Mantenha o equilíbrio atual entre demanda e capacidade",
          "Continue monitorando indicadores de bem-estar",
          "Promova as práticas de gestão de carga como referência"
        ],
        "Sólido": [
          "Monitore regularmente a distribuição de carga de trabalho",
          "Implemente ferramentas de gestão de tempo e prioridades",
          "Promova práticas de trabalho mais eficientes"
        ],
        "Atenção": [
          "Redistribua cargas de trabalho de forma mais equitativa",
          "Implemente pausas obrigatórias e limites de horas extras",
          "Contrate pessoal adicional ou reavalie processos"
        ],
        "Crítico": [
          "Intervenção urgente: reduza imediatamente a sobrecarga",
          "Implemente programa de prevenção ao burnout",
          "Reavalie completamente a estrutura organizacional"
        ]
      },
      "Recursos & Suporte ao Trabalho": {
        "Excelente": [
          "Mantenha os recursos atualizados e adequados",
          "Continue investindo em tecnologia e ferramentas",
          "Promova o suporte como diferencial competitivo"
        ],
        "Sólido": [
          "Identifique gaps específicos de recursos",
          "Implemente plano de atualização tecnológica",
          "Melhore o suporte técnico e administrativo"
        ],
        "Atenção": [
          "Realize diagnóstico detalhado de necessidades de recursos",
          "Priorize investimentos em ferramentas essenciais",
          "Implemente suporte técnico mais eficaz"
        ],
        "Crítico": [
          "Invista urgentemente em recursos básicos de trabalho",
          "Implemente plano emergencial de suporte",
          "Reavalie orçamento para recursos essenciais"
        ]
      },
      "Colaboração & Trabalho em Equipe": {
        "Excelente": [
          "Mantenha a cultura colaborativa forte",
          "Continue promovendo projetos multidisciplinares",
          "Compartilhe as práticas de colaboração com outras equipes"
        ],
        "Sólido": [
          "Promova mais atividades de team building",
          "Implemente ferramentas de colaboração mais eficazes",
          "Desenvolva competências de trabalho em equipe"
        ],
        "Atenção": [
          "Identifique e resolva conflitos interpessoais",
          "Implemente treinamentos em colaboração",
          "Reestruture processos para promover colaboração"
        ],
        "Crítico": [
          "Intervenha urgentemente em conflitos destrutivos",
          "Implemente mediação profissional",
          "Reestruture equipes para melhorar dinâmica"
        ]
      },
      "Segurança Psicológica": {
        "Excelente": [
          "Mantenha o ambiente de abertura e confiança",
          "Continue promovendo a cultura de aprendizado com erros",
          "Reconheça e celebre contribuições inovadoras"
        ],
        "Sólido": [
          "Promova sessões de feedback construtivo",
          "Implemente práticas de escuta ativa",
          "Crie mais espaços seguros para discussão"
        ],
        "Atenção": [
          "Treine líderes em comunicação empática",
          "Estabeleça políticas contra retaliações",
          "Implemente canais anônimos para sugestões"
        ],
        "Crítico": [
          "Implemente urgentemente políticas de proteção",
          "Realize intervenção em lideranças tóxicas",
          "Estabeleça programa de reconstrução de confiança"
        ]
      },
      "Justiça & Ética Organizacional": {
        "Excelente": [
          "Mantenha a transparência nos processos decisórios",
          "Continue aplicando critérios justos e consistentes",
          "Promova a ética como valor fundamental"
        ],
        "Sólido": [
          "Melhore a transparência nos critérios de avaliação",
          "Implemente processos de feedback mais estruturados",
          "Revise políticas para garantir maior equidade"
        ],
        "Atenção": [
          "Revise processos de avaliação e promoção",
          "Implemente comitê de ética",
          "Treine gestores em práticas justas"
        ],
        "Crítico": [
          "Reestruture completamente processos de avaliação",
          "Implemente ouvidoria independente",
          "Estabeleça código de ética rigoroso"
        ]
      },
      "Desenvolvimento & Carreira": {
        "Excelente": [
          "Mantenha os programas de desenvolvimento robustos",
          "Continue oferecendo oportunidades diversificadas",
          "Promova mentoria e coaching interno"
        ],
        "Sólido": [
          "Expanda oportunidades de desenvolvimento",
          "Implemente planos de carreira mais claros",
          "Aumente investimento em capacitação"
        ],
        "Atenção": [
          "Crie planos de desenvolvimento individualizados",
          "Implemente programas de sucessão",
          "Estabeleça parcerias para capacitação externa"
        ],
        "Crítico": [
          "Implemente urgentemente programas de desenvolvimento",
          "Crie oportunidades imediatas de crescimento",
          "Estabeleça planos de retenção de talentos"
        ]
      },
      "Propósito, Valores & Orgulho": {
        "Excelente": [
          "Mantenha o alinhamento forte com propósito",
          "Continue celebrando conquistas organizacionais",
          "Promova embaixadores da cultura organizacional"
        ],
        "Sólido": [
          "Fortaleça a comunicação do propósito organizacional",
          "Implemente práticas de reconhecimento de valores",
          "Promova mais atividades de engajamento"
        ],
        "Atenção": [
          "Revise e comunique melhor missão e valores",
          "Implemente programas de engajamento cultural",
          "Alinhe práticas diárias com valores declarados"
        ],
        "Crítico": [
          "Redefina propósito organizacional com participação",
          "Implemente mudança cultural profunda",
          "Estabeleça programa de reconstrução de orgulho"
        ]
      },
      "Bem-estar & Equilíbrio Vida-Trabalho": {
        "Excelente": [
          "Mantenha as práticas de bem-estar atuais",
          "Continue promovendo flexibilidade no trabalho",
          "Expanda programas de qualidade de vida"
        ],
        "Sólido": [
          "Implemente mais opções de flexibilidade",
          "Promova programas de saúde e bem-estar",
          "Monitore indicadores de equilíbrio vida-trabalho"
        ],
        "Atenção": [
          "Implemente políticas de desconexão",
          "Promova programas de gestão de estresse",
          "Revise cargas de trabalho e expectativas"
        ],
        "Crítico": [
          "Implemente urgentemente políticas de bem-estar",
          "Estabeleça limites rígidos de horário de trabalho",
          "Ofereça suporte psicológico profissional"
        ]
      },
      "Gestão da Mudança & Inovação": {
        "Excelente": [
          "Mantenha a cultura de inovação forte",
          "Continue promovendo adaptabilidade",
          "Compartilhe práticas de gestão de mudança"
        ],
        "Sólido": [
          "Implemente processos mais estruturados de mudança",
          "Promova cultura de experimentação",
          "Desenvolva competências de adaptabilidade"
        ],
        "Atenção": [
          "Treine equipes em gestão de mudança",
          "Implemente comunicação mais eficaz sobre mudanças",
          "Reduza resistências através de participação"
        ],
        "Crítico": [
          "Implemente gestão de mudança profissional",
          "Estabeleça programa de superação de resistências",
          "Promova liderança de mudança em todos os níveis"
        ]
      }
    }
    return recommendations[dimension]?.[classification] || ["Recomendações não disponíveis"]
  }

  const completeTest = async () => {
    setIsSubmitting(true)
    
    try {
      // Criar sessão do teste
      const sessionResponse = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'humaniq-cobe',
          startedAt: new Date().toISOString()
        })
      })
      
      if (!sessionResponse.ok) {
        throw new Error('Falha ao criar sessão do teste')
      }
      
      const { sessionId } = await sessionResponse.json()
      
      // Calcular resultados
      const result = calculateResults()
      
      // Preparar dados para submissão
      const submissionData = {
        testId: 'humaniq-cobe',
        sessionId,
        answers,
        results: result,
        duration: timeElapsed,
        metadata: {
          questionsAnswered: Object.keys(answers).length,
          totalQuestions: questions.length,
          completedAt: new Date().toISOString()
        }
      }
      
      // Submeter resultados
      const submitResponse = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })
      
      if (!submitResponse.ok) {
        throw new Error('Falha ao submeter resultados do teste')
      }
      
      console.log('Resultado do HumaniQ Pesquisa de Clima:', result)
      
      // Mostrar resultados localmente
      setShowResults(true)
      
      // Redirecionar para página de resultados após delay
      setTimeout(() => {
        router.push(`/colaborador/psicossociais/humaniq-cobe/resultados?sessionId=${sessionId}`)
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
      // Em caso de erro, ainda mostrar resultados localmente
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case "Segurança Psicológica":
        return <Users className="h-6 w-6" />
      case "Comunicação Interna":
        return <MessageSquare className="h-6 w-6" />
      case "Pertencimento e Inclusão":
        return <Users className="h-6 w-6" />
      case "Justiça Organizacional":
        return <Scale className="h-6 w-6" />
      default:
        return <BarChart3 className="h-6 w-6" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 3.6) return "text-green-600"
    if (score >= 2.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getClassificationColor = (classification: string) => {
    if (classification === "Clima positivo e saudável") return "bg-green-100 text-green-800"
    if (classification === "Clima moderado/neutro") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (showResults) {
    const result = calculateResults()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                HumaniQ Pesquisa de Clima - Resultados
              </CardTitle>
              <CardDescription>
                Clima Organizacional e Bem-Estar Psicológico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Tempo decorrido</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Questões respondidas</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(answers).length}/{questions.length}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore.toFixed(2)}
                </div>
                <Badge className={getClassificationColor(result.overallClassification)}>
                  {result.overallClassification}
                </Badge>
                <div className="mt-4">
                  <Progress value={(result.overallScore / 5) * 100} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos de Visualização */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Gráfico Radar - Dimensões COBE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={result.dimensions.map(d => ({
                    dimension: d.name.split(' ')[0],
                    score: d.score,
                    fullName: d.name
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Pontuação"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gráfico de Barras - Pontuações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.dimensions.map(d => ({
                    name: d.name.split(' ')[0],
                    score: d.score,
                    fullName: d.name
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: any, name: any, props: any) => [
                        `${value.toFixed(2)}`, 
                        props.payload.fullName
                      ]}
                    />
                    <Bar 
                       dataKey="score" 
                       fill="#3b82f6"
                       radius={[4, 4, 0, 0]}
                     />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {result.dimensions.map((dimension, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getDimensionIcon(dimension.name)}
                    <div>
                      <CardTitle className="text-lg">{dimension.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                          {dimension.score}
                        </span>
                        <Badge className={getClassificationColor(dimension.classification)}>
                          {dimension.classification}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{dimension.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Recomendações:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {dimension.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Sobre o HumaniQ Pesquisa de Clima:</strong> Este teste avalia o clima organizacional através de 12 dimensões 
                  fundamentais, baseado em pesquisas científicas consolidadas sobre ambiente de trabalho e bem-estar organizacional.
                </p>
                <p>
                  <strong>Interpretação dos Escores:</strong> Excelente (85-100), Sólido (70-84), Atenção (55-69), Crítico (0-54). 
                  O Índice Global de Clima (IGC) representa a média das 12 dimensões avaliadas.
                </p>
                <p>
                  <strong>Resultados Esperados:</strong> Mapa de forças e fragilidades, identificação de gaps de liderança, 
                  sinais de risco psicossocial, alavancas de curto prazo e plano de ação direcionado para melhoria do clima organizacional.
                </p>
                <p>
                  <strong>Base Científica:</strong> Fundamentado nos trabalhos de Schneider, Edmondson, Colquitt, Bakker & Demerouti, 
                  Harter, Kluger & DeNisi, Dirks & Ferrin, e Men, entre outros pesquisadores renomados da área.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button 
              onClick={() => router.push('/colaborador/psicossociais')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Testes
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
            >
              Refazer Teste
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com gradiente roxo */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ Pesquisa de Clima</h1>
                <p className="text-purple-100">Clima Organizacional e Bem-Estar Psicológico</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Questão</p>
              <p className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="bg-white rounded-b-2xl shadow-2xl">
          <div className="p-8">
            {/* Dimensão atual */}
            <div className="mb-6">
              <span className="text-purple-600 font-semibold text-lg">
                {currentQ.dimension}
              </span>
            </div>

            {/* Pergunta */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-800 leading-relaxed">
                {currentQ.text}
              </h2>
            </div>

            {/* Barra de gradiente com labels */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Discordo</span>
                <span>Neutro</span>
                <span>Concordo</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full"></div>
            </div>

            {/* Escala Likert customizada */}
            <div className="mb-8">
              <div className="flex justify-between gap-4">
                {[
                  { value: 1, color: 'bg-red-400 hover:bg-red-500', label: 'Discordo totalmente' },
                  { value: 2, color: 'bg-orange-400 hover:bg-orange-500', label: 'Discordo' },
                  { value: 3, color: 'bg-yellow-400 hover:bg-yellow-500', label: 'Neutro' },
                  { value: 4, color: 'bg-green-400 hover:bg-green-500', label: 'Concordo' },
                  { value: 5, color: 'bg-green-600 hover:bg-green-700', label: 'Concordo totalmente' }
                ].map((option) => (
                  <div key={option.value} className="flex-1 text-center">
                    <button
                      onClick={() => handleAnswer(option.value)}
                      className={`w-16 h-16 rounded-2xl text-white font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        option.color
                      } ${
                        answers[currentQ.id] === option.value 
                          ? 'ring-4 ring-purple-300 scale-105' 
                          : ''
                      }`}
                    >
                      {option.value}
                    </button>
                    <p className="text-xs text-gray-600 mt-2 leading-tight">
                      {option.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensagem para continuar */}
            <div className="text-center mb-8">
              <p className="text-gray-500">
                {answers[currentQ.id] ? 'Resposta selecionada!' : 'Selecione uma resposta para continuar'}
              </p>
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                variant="outline"
                disabled={currentQuestion === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button 
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[currentQ.id]}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  Próxima
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={completeTest}
                  disabled={!answers[currentQ.id] || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Finalizando...
                    </>
                  ) : (
                    <>
                      Finalizar
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}