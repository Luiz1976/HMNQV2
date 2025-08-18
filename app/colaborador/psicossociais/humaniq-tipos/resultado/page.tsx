'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Download, Share2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface TestResult {
  id: string
  personalityType: string
  overallScore: number
  dimensionScores: {
    [dimension: string]: {
      [option: string]: number
    }
  }
  metadata: {
    personalityType: string
    rawScores: {
      E: number, I: number
      S: number, N: number
      T: number, F: number
      J: number, P: number
    }
    dimensions: {
      Energia: string
      Percepção: string
      Decisão: string
      Organização: string
    }
  }
  completedAt: string
  duration: number
}

const personalityDescriptions: { [key: string]: { name: string, description: string, strengths: string[], challenges: string[], workStyle: string } } = {
  'INTJ': {
    name: 'O Arquiteto',
    description: 'Visionários estratégicos com capacidade natural para planejamento e execução de ideias complexas.',
    strengths: ['Pensamento estratégico', 'Independência', 'Determinação', 'Visão de longo prazo'],
    challenges: ['Pode ser muito crítico', 'Dificuldade com detalhes práticos', 'Impaciência com ineficiência'],
    workStyle: 'Prefere trabalhar de forma independente em projetos complexos que exigem planejamento estratégico.'
  },
  'INFP': {
    name: 'O Mediador',
    description: 'Idealistas criativos guiados por valores pessoais profundos e desejo de harmonia.',
    strengths: ['Criatividade', 'Empatia', 'Flexibilidade', 'Autenticidade'],
    challenges: ['Pode evitar conflitos', 'Dificuldade com prazos rígidos', 'Sensibilidade à crítica'],
    workStyle: 'Trabalha melhor em ambientes colaborativos que valorizam criatividade e propósito.'
  },
  'ESTJ': {
    name: 'O Executivo',
    description: 'Organizadores naturais que prosperam em estruturas claras e responsabilidades definidas.',
    strengths: ['Liderança', 'Organização', 'Eficiência', 'Confiabilidade'],
    challenges: ['Pode ser inflexível', 'Dificuldade com mudanças', 'Impaciência com indecisão'],
    workStyle: 'Excele em posições de liderança com responsabilidades claras e metas definidas.'
  },
  'ENFP': {
    name: 'O Ativista',
    description: 'Entusiastas criativos que inspiram outros com sua energia e otimismo.',
    strengths: ['Entusiasmo', 'Criatividade', 'Comunicação', 'Adaptabilidade'],
    challenges: ['Pode se dispersar facilmente', 'Dificuldade com rotinas', 'Evita tarefas repetitivas'],
    workStyle: 'Prospera em ambientes dinâmicos com variedade de projetos e interação social.'
  }
  // Adicionar mais tipos conforme necessário
}

export default function HumaniQTiposResultadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resultId = searchParams.get('id')
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (resultId) {
      fetchResult(resultId)
    } else {
      setError('ID do resultado não encontrado')
      setLoading(false)
    }
  }, [resultId])

  const fetchResult = async (id: string) => {
    try {
      const response = await fetch(`/api/colaborador/resultados/${id}`)
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        setError('Erro ao carregar resultado')
      }
    } catch (error) {
      setError('Erro ao carregar resultado')
    } finally {
      setLoading(false)
    }
  }

  const getPersonalityInfo = (type: string) => {
    return personalityDescriptions[type] || {
      name: `Tipo ${type}`,
      description: 'Perfil cognitivo único com características específicas.',
      strengths: ['Características únicas'],
      challenges: ['Áreas de desenvolvimento'],
      workStyle: 'Estilo de trabalho personalizado.'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Carregando resultado...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/colaborador/resultados')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Resultados
          </Button>
        </div>
      </div>
    )
  }

  const personalityInfo = getPersonalityInfo(result.metadata.personalityType)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              HumaniQ TIPOS - Resultado
            </h1>
            <p className="text-gray-600">
              Seu Perfil Cognitivo (Base Junguiana / MBTI)
            </p>
          </div>
        </div>
      </div>

      {/* Tipo de Personalidade Principal */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="text-2xl px-6 py-2 bg-blue-100 text-blue-800">
              {result.metadata.personalityType}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{personalityInfo.name}</CardTitle>
          <CardDescription className="text-lg">
            {personalityInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {result.overallScore}%
            </div>
            <p className="text-gray-600">Consistência do Perfil</p>
          </div>
        </CardContent>
      </Card>

      {/* Dimensões Cognitivas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Suas Preferências Cognitivas</CardTitle>
          <CardDescription>
            Distribuição das suas preferências em cada dimensão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(result.dimensionScores).map(([dimension, scores]) => {
            const [option1, option2] = Object.entries(scores)
            const [name1, score1] = option1
            const [name2, score2] = option2
            const dominant = score1 > score2 ? name1 : name2
            const dominantScore = Math.max(score1, score2)
            
            return (
              <div key={dimension} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{dimension}</h4>
                  <Badge variant="outline">
                    {result.metadata.dimensions[dimension as keyof typeof result.metadata.dimensions]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{name1}</span>
                    <span>{score1}%</span>
                  </div>
                  <Progress value={score1} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>{name2}</span>
                    <span>{score2}%</span>
                  </div>
                  <Progress value={score2} className="h-2" />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Pontos Fortes e Desafios */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Pontos Fortes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {personalityInfo.strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Áreas de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {personalityInfo.challenges.map((challenge, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-orange-200 flex-shrink-0" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Estilo de Trabalho */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seu Estilo de Trabalho</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{personalityInfo.workStyle}</p>
        </CardContent>
      </Card>

      {/* Informações do Teste */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-600">Data de Conclusão</p>
              <p>{new Date(result.completedAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Tempo Gasto</p>
              <p>{formatDuration(result.duration)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Questões Respondidas</p>
              <p>40 questões</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push('/colaborador/resultados')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Resultados
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Baixar Relatório
        </Button>
        
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  )
}