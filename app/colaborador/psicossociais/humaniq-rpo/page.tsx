'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, AlertTriangle, Printer, TrendingUp, Target, Users, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LikertScale } from '@/components/ui/likert-scale'
import { toast } from 'sonner'

interface Question {
  id: number
  text: string
  dimension: string
  category: string
}

interface Answer {
  questionId: number
  score: number
}

const questions: Question[] = [
  // 1. Demandas do Trabalho (12 questões)
  { id: 1, text: 'Tenho tempo suficiente para realizar todas as minhas tarefas.', dimension: 'Demandas do Trabalho', category: 'Carga de Trabalho' },
  { id: 2, text: 'Minha carga de trabalho é adequada às minhas capacidades.', dimension: 'Demandas do Trabalho', category: 'Carga de Trabalho' },
  { id: 3, text: 'Consigo concluir minhas atividades dentro do prazo estabelecido.', dimension: 'Demandas do Trabalho', category: 'Carga de Trabalho' },
  { id: 4, text: 'As demandas do meu trabalho são realistas.', dimension: 'Demandas do Trabalho', category: 'Carga de Trabalho' },
  { id: 5, text: 'Raramente preciso trabalhar além do horário normal.', dimension: 'Demandas do Trabalho', category: 'Carga de Trabalho' },
  { id: 6, text: 'Meu trabalho exige esforço mental excessivo.', dimension: 'Demandas do Trabalho', category: 'Intensidade Mental' },
  { id: 7, text: 'Preciso me concentrar intensamente por longos períodos.', dimension: 'Demandas do Trabalho', category: 'Intensidade Mental' },
  { id: 8, text: 'Meu trabalho requer atenção constante aos detalhes.', dimension: 'Demandas do Trabalho', category: 'Intensidade Mental' },
  { id: 9, text: 'Sinto-me mentalmente esgotado ao final do dia.', dimension: 'Demandas do Trabalho', category: 'Intensidade Mental' },
  { id: 10, text: 'Meu trabalho exige que eu tome muitas decisões difíceis.', dimension: 'Demandas do Trabalho', category: 'Intensidade Mental' },
  { id: 11, text: 'Tenho que lidar com situações emocionalmente difíceis.', dimension: 'Demandas do Trabalho', category: 'Demandas Emocionais' },
  { id: 12, text: 'Meu trabalho me expõe a conflitos interpessoais frequentes.', dimension: 'Demandas do Trabalho', category: 'Demandas Emocionais' },

  // 2. Controle e Autonomia (12 questões)
  { id: 13, text: 'Tenho liberdade para decidir como realizar meu trabalho.', dimension: 'Controle e Autonomia', category: 'Autonomia de Decisão' },
  { id: 14, text: 'Posso influenciar as decisões que afetam meu trabalho.', dimension: 'Controle e Autonomia', category: 'Autonomia de Decisão' },
  { id: 15, text: 'Tenho controle sobre o ritmo do meu trabalho.', dimension: 'Controle e Autonomia', category: 'Autonomia de Decisão' },
  { id: 16, text: 'Posso escolher quando fazer pausas durante o trabalho.', dimension: 'Controle e Autonomia', category: 'Autonomia de Decisão' },
  { id: 17, text: 'Tenho autonomia para organizar minha agenda.', dimension: 'Controle e Autonomia', category: 'Autonomia de Decisão' },
  { id: 18, text: 'Posso usar minhas habilidades e conhecimentos no trabalho.', dimension: 'Controle e Autonomia', category: 'Uso de Habilidades' },
  { id: 19, text: 'Meu trabalho me permite aprender coisas novas.', dimension: 'Controle e Autonomia', category: 'Uso de Habilidades' },
  { id: 20, text: 'Tenho oportunidades de desenvolver minhas competências.', dimension: 'Controle e Autonomia', category: 'Uso de Habilidades' },
  { id: 21, text: 'Meu trabalho é variado e interessante.', dimension: 'Controle e Autonomia', category: 'Uso de Habilidades' },
  { id: 22, text: 'Posso ser criativo no meu trabalho.', dimension: 'Controle e Autonomia', category: 'Uso de Habilidades' },
  { id: 23, text: 'Tenho participação nas decisões importantes da empresa.', dimension: 'Controle e Autonomia', category: 'Participação' },
  { id: 24, text: 'Minha opinião é considerada nas mudanças organizacionais.', dimension: 'Controle e Autonomia', category: 'Participação' },

  // 3. Apoio Social e Relacionamentos (12 questões)
  { id: 25, text: 'Recebo apoio adequado do meu supervisor.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio da Chefia' },
  { id: 26, text: 'Meu supervisor me trata com respeito.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio da Chefia' },
  { id: 27, text: 'Posso contar com meu supervisor quando preciso de ajuda.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio da Chefia' },
  { id: 28, text: 'Meu supervisor reconhece meu bom desempenho.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio da Chefia' },
  { id: 29, text: 'Tenho um bom relacionamento com meus colegas.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio dos Colegas' },
  { id: 30, text: 'Posso contar com meus colegas quando preciso de ajuda.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio dos Colegas' },
  { id: 31, text: 'Existe cooperação entre os membros da equipe.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio dos Colegas' },
  { id: 32, text: 'Sinto-me integrado à equipe de trabalho.', dimension: 'Apoio Social e Relacionamentos', category: 'Apoio dos Colegas' },
  { id: 33, text: 'Há comunicação clara entre os membros da equipe.', dimension: 'Apoio Social e Relacionamentos', category: 'Comunicação' },
  { id: 34, text: 'Recebo informações suficientes para realizar meu trabalho.', dimension: 'Apoio Social e Relacionamentos', category: 'Comunicação' },
  { id: 35, text: 'As informações chegam até mim no tempo adequado.', dimension: 'Apoio Social e Relacionamentos', category: 'Comunicação' },
  { id: 36, text: 'Existe transparência na comunicação organizacional.', dimension: 'Apoio Social e Relacionamentos', category: 'Comunicação' },

  // 4. Recompensa e Reconhecimento (12 questões)
  { id: 37, text: 'Meu salário é adequado ao trabalho que realizo.', dimension: 'Recompensa e Reconhecimento', category: 'Recompensa Financeira' },
  { id: 38, text: 'Recebo benefícios adequados da empresa.', dimension: 'Recompensa e Reconhecimento', category: 'Recompensa Financeira' },
  { id: 39, text: 'Minha remuneração é justa comparada a outros colegas.', dimension: 'Recompensa e Reconhecimento', category: 'Recompensa Financeira' },
  { id: 40, text: 'Tenho perspectivas de crescimento salarial.', dimension: 'Recompensa e Reconhecimento', category: 'Recompensa Financeira' },
  { id: 41, text: 'Recebo reconhecimento pelo meu bom desempenho.', dimension: 'Recompensa e Reconhecimento', category: 'Reconhecimento' },
  { id: 42, text: 'Meu trabalho é valorizado pela organização.', dimension: 'Recompensa e Reconhecimento', category: 'Reconhecimento' },
  { id: 43, text: 'Recebo feedback positivo quando faço um bom trabalho.', dimension: 'Recompensa e Reconhecimento', category: 'Reconhecimento' },
  { id: 44, text: 'Sinto que minha contribuição faz diferença na empresa.', dimension: 'Recompensa e Reconhecimento', category: 'Reconhecimento' },
  { id: 45, text: 'Tenho oportunidades de promoção na empresa.', dimension: 'Recompensa e Reconhecimento', category: 'Desenvolvimento' },
  { id: 46, text: 'A empresa investe no meu desenvolvimento profissional.', dimension: 'Recompensa e Reconhecimento', category: 'Desenvolvimento' },
  { id: 47, text: 'Tenho acesso a treinamentos e capacitações.', dimension: 'Recompensa e Reconhecimento', category: 'Desenvolvimento' },
  { id: 48, text: 'Vejo perspectivas de crescimento na minha carreira.', dimension: 'Recompensa e Reconhecimento', category: 'Desenvolvimento' },

  // 5. Justiça e Clima Organizacional (12 questões)
  { id: 49, text: 'As decisões na empresa são tomadas de forma justa.', dimension: 'Justiça e Clima Organizacional', category: 'Justiça Organizacional' },
  { id: 50, text: 'Todos são tratados com igualdade na organização.', dimension: 'Justiça e Clima Organizacional', category: 'Justiça Organizacional' },
  { id: 51, text: 'Os processos de avaliação são transparentes e justos.', dimension: 'Justiça e Clima Organizacional', category: 'Justiça Organizacional' },
  { id: 52, text: 'As regras são aplicadas de forma consistente para todos.', dimension: 'Justiça e Clima Organizacional', category: 'Justiça Organizacional' },
  { id: 53, text: 'O ambiente de trabalho é respeitoso e cordial.', dimension: 'Justiça e Clima Organizacional', category: 'Clima Organizacional' },
  { id: 54, text: 'Existe confiança entre os membros da organização.', dimension: 'Justiça e Clima Organizacional', category: 'Clima Organizacional' },
  { id: 55, text: 'O ambiente promove a colaboração entre as pessoas.', dimension: 'Justiça e Clima Organizacional', category: 'Clima Organizacional' },
  { id: 56, text: 'Sinto-me confortável para expressar minhas opiniões.', dimension: 'Justiça e Clima Organizacional', category: 'Clima Organizacional' },
  { id: 57, text: 'A empresa tem valores claros e bem definidos.', dimension: 'Justiça e Clima Organizacional', category: 'Valores Organizacionais' },
  { id: 58, text: 'Os valores da empresa são praticados no dia a dia.', dimension: 'Justiça e Clima Organizacional', category: 'Valores Organizacionais' },
  { id: 59, text: 'Identifico-me com a missão e visão da empresa.', dimension: 'Justiça e Clima Organizacional', category: 'Valores Organizacionais' },
  { id: 60, text: 'A empresa age de forma ética e responsável.', dimension: 'Justiça e Clima Organizacional', category: 'Valores Organizacionais' },

  // 6. Segurança no Trabalho e Futuro (12 questões)
  { id: 61, text: 'Sinto-me seguro em relação à estabilidade do meu emprego.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança no Emprego' },
  { id: 62, text: 'Não me preocupo com a possibilidade de ser demitido.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança no Emprego' },
  { id: 63, text: 'A empresa demonstra estabilidade financeira.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança no Emprego' },
  { id: 64, text: 'Confio no futuro da organização.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança no Emprego' },
  { id: 65, text: 'O ambiente físico de trabalho é seguro.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança Física' },
  { id: 66, text: 'A empresa fornece equipamentos de proteção adequados.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança Física' },
  { id: 67, text: 'Recebo treinamentos sobre segurança no trabalho.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança Física' },
  { id: 68, text: 'Os riscos de acidentes são minimizados no meu local de trabalho.', dimension: 'Segurança no Trabalho e Futuro', category: 'Segurança Física' },
  { id: 69, text: 'Tenho perspectivas positivas para meu futuro profissional.', dimension: 'Segurança no Trabalho e Futuro', category: 'Perspectivas Futuras' },
  { id: 70, text: 'Vejo oportunidades de crescimento a longo prazo.', dimension: 'Segurança no Trabalho e Futuro', category: 'Perspectivas Futuras' },
  { id: 71, text: 'Sinto-me otimista em relação ao meu futuro na empresa.', dimension: 'Segurança no Trabalho e Futuro', category: 'Perspectivas Futuras' },
  { id: 72, text: 'A empresa investe em inovação e modernização.', dimension: 'Segurança no Trabalho e Futuro', category: 'Perspectivas Futuras' },

  // 7. Interface Trabalho-Vida Pessoal (12 questões)
  { id: 73, text: 'Consigo equilibrar trabalho e vida pessoal.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Equilíbrio' },
  { id: 74, text: 'Tenho tempo suficiente para atividades pessoais e familiares.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Equilíbrio' },
  { id: 75, text: 'O trabalho não interfere negativamente na minha vida pessoal.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Equilíbrio' },
  { id: 76, text: 'Consigo cumprir minhas responsabilidades familiares.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Equilíbrio' },
  { id: 77, text: 'A empresa oferece flexibilidade de horários quando necessário.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Flexibilidade' },
  { id: 78, text: 'Posso trabalhar de forma remota quando apropriado.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Flexibilidade' },
  { id: 79, text: 'A empresa compreende minhas necessidades pessoais.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Flexibilidade' },
  { id: 80, text: 'Tenho liberdade para negociar horários quando necessário.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Flexibilidade' },
  { id: 81, text: 'A empresa respeita meus limites fora do horário de trabalho.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Limites' },
  { id: 82, text: 'Posso cuidar da minha saúde sem comprometer o trabalho.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Limites' },
  { id: 83, text: 'As exigências do trabalho não afetam minha qualidade de vida.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Limites' },
  { id: 84, text: 'Sinto que consigo "desligar" do trabalho ao final do dia.', dimension: 'Interface Trabalho-Vida Pessoal', category: 'Limites' },

  // 8. Violência, Assédio e Pressão (12 questões)
  { id: 85, text: 'Já presenciei comportamentos abusivos no ambiente de trabalho.', dimension: 'Violência, Assédio e Pressão', category: 'Violência e Assédio' },
  { id: 86, text: 'Já fui vítima de agressão verbal ou psicológica na empresa.', dimension: 'Violência, Assédio e Pressão', category: 'Violência e Assédio' },
  { id: 87, text: 'Existe um canal seguro para denunciar assédio.', dimension: 'Violência, Assédio e Pressão', category: 'Violência e Assédio' },
  { id: 88, text: 'A empresa age quando há denúncias de abuso.', dimension: 'Violência, Assédio e Pressão', category: 'Violência e Assédio' },
  { id: 89, text: 'Me sinto protegido contra qualquer tipo de violência no trabalho.', dimension: 'Violência, Assédio e Pressão', category: 'Violência e Assédio' },
  { id: 90, text: 'Sinto que posso discordar de superiores sem medo.', dimension: 'Violência, Assédio e Pressão', category: 'Pressão Psicológica' },
  { id: 91, text: 'O ambiente tolera comentários ofensivos ou discriminatórios.', dimension: 'Violência, Assédio e Pressão', category: 'Pressão Psicológica' },
  { id: 92, text: 'As metas são impostas com ameaças ou punições.', dimension: 'Violência, Assédio e Pressão', category: 'Pressão Psicológica' },
  { id: 93, text: 'Já me senti humilhado por líderes ou colegas.', dimension: 'Violência, Assédio e Pressão', category: 'Pressão Psicológica' },
  { id: 94, text: 'Existe pressão para manter silêncio sobre irregularidades.', dimension: 'Violência, Assédio e Pressão', category: 'Pressão Psicológica' },
  { id: 95, text: 'A cultura da empresa combate o assédio moral.', dimension: 'Violência, Assédio e Pressão', category: 'Cultura Preventiva' },
  { id: 96, text: 'A organização zela pela saúde mental dos colaboradores.', dimension: 'Violência, Assédio e Pressão', category: 'Cultura Preventiva' }
]



export default function HumaniQRPOPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Adicionar estilos CSS para animações
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
      }
      @keyframes slide-in {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers]
    const existingIndex = newAnswers.findIndex(a => a.questionId === questions[currentQuestion].id)
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].score = score
    } else {
      newAnswers.push({ questionId: questions[currentQuestion].id, score })
    }
    
    setAnswers(newAnswers)
  }

  // Função para calcular o progresso baseado na questão atual
  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getCurrentAnswer = () => {
    const answer = answers.find(a => a.questionId === questions[currentQuestion].id)
    return answer?.score || 0
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeTest()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completeTest = async (finalAnswers?: Answer[]) => {
    const answersToUse = finalAnswers || answers
    
    // Calcular resultados por dimensão
    const dimensionScores: { [key: string]: number[] } = {}
    
    questions.forEach(question => {
      const answer = answersToUse.find(a => a.questionId === question.id)
      if (answer) {
        if (!dimensionScores[question.dimension]) {
          dimensionScores[question.dimension] = []
        }
        dimensionScores[question.dimension].push(answer.score)
      }
    })

    // Calcular médias e classificações por dimensão
    const finalResults: { [key: string]: { total: number, average: number, classification: string, risk: string, color: string } } = {}
    
    Object.keys(dimensionScores).forEach(dimension => {
      const scores = dimensionScores[dimension]
      const total = scores.reduce((sum, score) => sum + score, 0)
      const average = total / scores.length
      
      let classification = ''
      let risk = ''
      let color = ''
      
      if (average >= 4.0) {
        classification = 'Excelente'
        risk = 'Baixo Risco'
        color = 'text-green-600'
      } else if (average >= 3.0) {
        classification = 'Bom'
        risk = 'Risco Moderado'
        color = 'text-blue-600'
      } else if (average >= 2.0) {
        classification = 'Regular'
        risk = 'Risco Alto'
        color = 'text-yellow-600'
      } else {
        classification = 'Crítico'
        risk = 'Risco Muito Alto'
        color = 'text-red-600'
      }
      
      finalResults[dimension] = { total, average, classification, risk, color }
    })

    // Calcular Índice Geral de Risco Psicossocial
    const totalSum = answersToUse.reduce((sum, answer) => sum + answer.score, 0)
    const generalIndex = totalSum / 96
    
    let generalClassification = ''
    let generalColor = ''
    
    if (generalIndex >= 4.0) {
      generalClassification = 'Excelente - Baixo Risco'
      generalColor = 'text-green-600'
    } else if (generalIndex >= 3.0) {
      generalClassification = 'Bom - Risco Moderado'
      generalColor = 'text-blue-600'
    } else if (generalIndex >= 2.0) {
      generalClassification = 'Regular - Risco Alto'
      generalColor = 'text-yellow-600'
    } else {
      generalClassification = 'Crítico - Risco Muito Alto'
      generalColor = 'text-red-600'
    }

    setResults({ dimensions: finalResults, generalIndex, generalClassification, generalColor })
    setIsCompleted(true)

    // Submeter resultados para a API
    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: 'humaniq-rpo',
          sessionId: 'temp-session-' + Date.now(),
          answers: answersToUse,
          duration: 0,
          results: { dimensions: finalResults, generalIndex, generalClassification }
        })
      })

      if (!response.ok) {
        console.error('Erro ao submeter teste:', response.statusText)
      } else {
        console.log('Teste submetido com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao submeter teste:', error)
    }
  }

  const getCriticalDimensions = () => {
    if (!results) return []
    return Object.entries(results.dimensions)
      .filter(([_, data]: [string, any]) => data.average < 2.0)
      .map(([dimension, _]) => dimension)
  }

  if (isCompleted && results) {
    const criticalDimensions = getCriticalDimensions()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-2xl font-bold text-purple-800">
                  HumaniQ RPO - Resultados
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Riscos Psicossociais Ocupacionais - Análise Completa
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Alerta Crítico */}
          {criticalDimensions.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-red-800">Alerta Crítico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-2">
                  As seguintes dimensões apresentam risco muito alto (abaixo de 2.0):
                </p>
                <ul className="list-disc list-inside text-red-700">
                  {criticalDimensions.map(dimension => (
                    <li key={dimension} className="font-medium">{dimension}</li>
                  ))}
                </ul>
                <p className="text-red-700 mt-2 font-medium">
                  Recomenda-se ação imediata para mitigar estes riscos.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Índice Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Índice Geral de Risco Psicossocial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold">{results.generalIndex.toFixed(2)}</div>
                <div className={`text-xl font-semibold ${results.generalColor}`}>
                  {results.generalClassification}
                </div>
                <div className="text-sm text-gray-600">
                  Baseado na média de todas as 96 questões
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados por Dimensão */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados por Dimensão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.dimensions).map(([dimension, data]: [string, any]) => (
                  <div key={dimension} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{dimension}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Média:</span>
                        <span className="font-bold">{data.average.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classificação:</span>
                        <span className={`font-semibold ${data.color}`}>{data.classification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nível de Risco:</span>
                        <span className={`font-semibold ${data.color}`}>{data.risk}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise Detalhada: Riscos Psicossociais Ocupacionais */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-blue-800">Análise Detalhada: Riscos Psicossociais Ocupacionais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contextualização Científica */}
              <div className="bg-white p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Brain className="h-5 w-5 text-blue-600 mr-2" />
                  Contextualização Científica
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Os riscos psicossociais ocupacionais referem-se aos aspectos do ambiente de trabalho que podem 
                  causar estresse psicológico, impactar a saúde mental e física dos trabalhadores, e influenciar 
                  o desempenho organizacional. Segundo o modelo de Karasek e Theorell (1990), a combinação de 
                  altas demandas com baixo controle constitui o principal fator de risco para o desenvolvimento 
                  de transtornos relacionados ao trabalho.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  A Organização Internacional do Trabalho (OIT) reconhece que os fatores psicossociais no trabalho 
                  são determinantes críticos da saúde ocupacional, podendo resultar em burnout, ansiedade, 
                  depressão e outras condições que afetam tanto o bem-estar individual quanto a produtividade organizacional.
                </p>
              </div>

              {/* Análise dos Resultados do Usuário */}
              <div className="bg-white p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  Análise dos Seus Resultados
                </h4>
                {results.generalIndex >= 4.0 ? (
                  <div className="space-y-3">
                    <p className="text-green-700 font-medium">✓ Excelente Gestão de Riscos Psicossociais</p>
                    <p className="text-gray-700 leading-relaxed">
                      Seus resultados indicam um ambiente de trabalho com baixo risco psicossocial. As dimensões 
                      avaliadas demonstram condições favoráveis que promovem o bem-estar ocupacional. Esta situação 
                      está associada a maior satisfação no trabalho, melhor saúde mental e maior engajamento 
                      profissional, conforme evidenciado por estudos longitudinais (Bakker & Demerouti, 2017).
                    </p>
                  </div>
                ) : results.generalIndex >= 3.0 ? (
                  <div className="space-y-3">
                    <p className="text-blue-700 font-medium">⚠ Risco Psicossocial Moderado Identificado</p>
                    <p className="text-gray-700 leading-relaxed">
                      Seus resultados sugerem a presença de fatores de risco psicossocial em nível moderado. 
                      Embora não configurem uma situação crítica, algumas dimensões requerem atenção preventiva. 
                      Pesquisas indicam que intervenções precoces podem prevenir a escalada para níveis mais 
                      problemáticos (Lamontagne et al., 2014).
                    </p>
                  </div>
                ) : results.generalIndex >= 2.0 ? (
                  <div className="space-y-3">
                    <p className="text-yellow-700 font-medium">⚠ Alto Risco Psicossocial Detectado</p>
                    <p className="text-gray-700 leading-relaxed">
                      Os resultados revelam a presença significativa de fatores de risco psicossocial que podem 
                      impactar sua saúde e bem-estar. Esta condição está associada a maior probabilidade de 
                      desenvolvimento de sintomas de estresse, fadiga e redução da satisfação no trabalho. 
                      Estudos epidemiológicos demonstram correlação entre estes níveis e aumento do absenteísmo 
                      e rotatividade (Nieuwenhuijsen et al., 2010).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-700 font-medium">🚨 Situação Crítica de Risco Psicossocial</p>
                    <p className="text-gray-700 leading-relaxed">
                      Seus resultados indicam exposição a múltiplos fatores de risco psicossocial em níveis 
                      preocupantes. Esta situação requer atenção imediata, pois está fortemente associada ao 
                      desenvolvimento de transtornos mentais relacionados ao trabalho, incluindo burnout, 
                      ansiedade e depressão ocupacional (Maslach & Leiter, 2016). A literatura científica 
                      demonstra que a exposição prolongada a estes fatores pode resultar em consequências 
                      graves para a saúde física e mental.
                    </p>
                  </div>
                )}
              </div>

              {/* Recomendações Profissionais */}
              <div className="bg-white p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Recomendações Profissionais
                </h4>
                <div className="space-y-4">
                  {results.generalIndex >= 4.0 ? (
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">Estratégias de Manutenção:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Continue desenvolvendo suas competências de enfrentamento adaptativo</li>
                        <li>Mantenha práticas regulares de autocuidado e gestão do tempo</li>
                        <li>Considere atuar como mentor para colegas em situações mais desafiadoras</li>
                        <li>Participe de programas de promoção da saúde ocupacional</li>
                      </ul>
                    </div>
                  ) : results.generalIndex >= 3.0 ? (
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">Intervenções Preventivas:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Desenvolva estratégias de enfrentamento focadas no problema (Lazarus & Folkman, 1984)</li>
                        <li>Busque feedback regular sobre seu desempenho e desenvolvimento</li>
                        <li>Participe de treinamentos em gestão do estresse e resiliência</li>
                        <li>Estabeleça limites claros entre vida pessoal e profissional</li>
                        <li>Considere mentoring ou coaching profissional</li>
                      </ul>
                    </div>
                  ) : results.generalIndex >= 2.0 ? (
                    <div>
                      <h5 className="font-medium text-yellow-700 mb-2">Intervenções Necessárias:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Procure apoio psicológico especializado em saúde ocupacional</li>
                        <li>Dialogue com a liderança sobre ajustes nas demandas de trabalho</li>
                        <li>Implemente técnicas de relaxamento e mindfulness no cotidiano</li>
                        <li>Avalie a necessidade de reorganização das atividades laborais</li>
                        <li>Considere participar de grupos de apoio ou programas de bem-estar</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Intervenções Urgentes:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Busque imediatamente apoio psicológico especializado</li>
                        <li>Considere afastamento temporário se necessário para recuperação</li>
                        <li>Documente situações de risco e comunique ao RH/liderança</li>
                        <li>Ative sua rede de apoio social (família, amigos, colegas)</li>
                        <li>Avalie mudanças significativas no ambiente ou função de trabalho</li>
                        <li>Procure orientação médica para avaliação de sintomas físicos</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Considerações Finais sobre Gestão do Estresse Ocupacional */}
              <div className="bg-white p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  Gestão do Estresse Ocupacional: Considerações Finais
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Estratégias Individuais de Enfrentamento:</h5>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      Baseado no modelo transacional de Lazarus e Folkman (1984), recomenda-se o desenvolvimento 
                      de estratégias de enfrentamento adaptativas, incluindo:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><strong>Enfrentamento focado no problema:</strong> Identificação e modificação das fontes de estresse</li>
                      <li><strong>Enfrentamento focado na emoção:</strong> Regulação emocional e técnicas de relaxamento</li>
                      <li><strong>Busca de apoio social:</strong> Fortalecimento de redes de suporte profissional e pessoal</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Intervenções Organizacionais:</h5>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      Segundo o modelo Demanda-Controle-Apoio de Karasek e Theorell (1990), as organizações 
                      devem focar em:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><strong>Redesenho do trabalho:</strong> Equilibrio entre demandas e recursos disponíveis</li>
                      <li><strong>Aumento da autonomia:</strong> Maior controle sobre métodos e ritmo de trabalho</li>
                      <li><strong>Fortalecimento do apoio social:</strong> Melhoria das relações interpessoais no trabalho</li>
                      <li><strong>Programas de bem-estar:</strong> Iniciativas sistemáticas de promoção da saúde mental</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-medium mb-2">Importante:</p>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Este instrumento oferece uma avaliação inicial dos riscos psicossociais. Para situações 
                      de alto risco ou sintomas persistentes, recomenda-se buscar avaliação profissional 
                      especializada em saúde ocupacional ou psicologia organizacional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Referências Científicas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-800 mb-2">Referências Científicas:</h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Bakker, A. B., & Demerouti, E. (2017). Job demands-resources theory. Wellbeing, 3, 1-28.</p>
                  <p>• Karasek, R., & Theorell, T. (1990). Healthy work: Stress, productivity, and the reconstruction of working life. Basic Books.</p>
                  <p>• Lamontagne, A. D., et al. (2014). Workplace mental health: Developing an integrated intervention approach. BMC Psychiatry, 14(1), 131.</p>
                  <p>• Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer Publishing Company.</p>
                  <p>• Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience. World Psychiatry, 15(2), 103-111.</p>
                  <p>• Nieuwenhuijsen, K., et al. (2010). Psychosocial work environment and stress-related disorders. Occupational Medicine, 60(4), 277-286.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center space-x-4">
                <Button onClick={() => router.push('/colaborador/psicossociais')} variant="outline">
                  Voltar aos Testes
                </Button>
                <Button 
                  onClick={() => router.push('/colaborador/resultados?saved=1')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  Ver Todos os Resultados
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul escuro */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo circular */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HumaniQ RPO</h1>
                <p className="text-purple-100 text-sm">Riscos Psicossociais Ocupacionais</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200">Questão</div>
              <div className="text-2xl font-bold text-white">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <Progress 
            value={getProgressPercentage()} 
            className="h-2 bg-gray-200 [&>div]:bg-purple-600"
          />
        </div>
      </div>

      {/* Área principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Categoria da pergunta */}
          <div className="mb-6">
            <span className="text-purple-600 font-medium text-lg">
              {questions[currentQuestion].dimension}
            </span>
          </div>

          {/* Pergunta */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {questions[currentQuestion].text}
          </h2>

          {/* Barra de gradiente colorido */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-red-500">Discordo</span>
              <span className="text-yellow-500">Neutro</span>
              <span className="text-green-500">Concordo</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full mb-6"></div>
          </div>

          {/* Escala Likert customizada */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-4">
              {[1, 2, 3, 4, 5].map((value) => {
                const colors = {
                  1: 'bg-pink-400 hover:bg-pink-500',
                  2: 'bg-orange-400 hover:bg-orange-500', 
                  3: 'bg-yellow-400 hover:bg-yellow-500',
                  4: 'bg-lime-400 hover:bg-lime-500',
                  5: 'bg-green-500 hover:bg-green-600'
                }
                const isSelected = getCurrentAnswer() === value
                return (
                  <button
                    key={value}
                    onClick={() => {
                      const newAnswers = [...answers]
                      const existingIndex = newAnswers.findIndex(a => a.questionId === questions[currentQuestion].id)
                      
                      if (existingIndex >= 0) {
                        newAnswers[existingIndex].score = value
                      } else {
                        newAnswers.push({ questionId: questions[currentQuestion].id, score: value })
                      }
                      
                      setAnswers(newAnswers)
                      setIsTransitioning(true)
                      
                      setTimeout(() => {
                        setIsTransitioning(false)
                        if (currentQuestion < questions.length - 1) {
                          setCurrentQuestion(prev => prev + 1)
                        } else {
                          // Na última pergunta, garantir que a barra chegue a 100% antes de completar
                          completeTest(newAnswers)
                        }
                      }, 600)
                    }}
                    className={`w-16 h-16 rounded-lg ${colors[value as keyof typeof colors]} text-white font-bold text-xl transition-all duration-200 hover:scale-105 ${
                      isSelected ? 'ring-4 ring-purple-300 scale-105' : ''
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
            
            {/* Labels descritivos */}
            <div className="flex justify-center space-x-4 text-sm text-gray-600">
              <div className="w-16 text-center">Discordo totalmente</div>
              <div className="w-16 text-center">Discordo</div>
              <div className="w-16 text-center">Neutro</div>
              <div className="w-16 text-center">Concordo</div>
              <div className="w-16 text-center">Concordo totalmente</div>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0 || isTransitioning}
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            
            <div className="text-center text-gray-500 text-sm">
              Selecione uma resposta para continuar
            </div>
            
            <Button
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
              disabled
            >
              <span>Próxima</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}