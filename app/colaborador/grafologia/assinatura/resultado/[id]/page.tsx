'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  PenTool, 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Heart, 
  Crown, 
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Loader2,
  FileText,
  Award
} from 'lucide-react'
import { toast } from 'sonner'

interface SignatureAnalysisData {
  detailedAnalysis: {
    technicalObservations: {
      pressure: string
      size: string
      inclination: string
      spacing: string
      rhythm: string
      regularity: string
      legibility: string
      ornamentation: string
    }
    psychologicalInterpretation: string
  }
  behavioralSummary: string
  workplaceTrends: {
    communication: { score: number; description: string }
    organization: { score: number; description: string }
    emotionalStability: { score: number; description: string }
    leadership: { score: number; description: string }
    adaptability: { score: number; description: string }
  }
  practicalSuggestions: string[]
  visualHighlights: {
    x: number
    y: number
    width: number
    height: number
    type: string
    interpretation: string
    technicalDetails: string
  }[]
  professionalInsights: {
    strengths: string[]
    developmentAreas: string[]
    workStyle: string
    communicationStyle: string
    leadershipStyle: string
  }
  confidence: number
  scientificBasis: string
}

export default function SignatureResultPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [analysisData, setAnalysisData] = useState<SignatureAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchAnalysisResults()
    }
  }, [params.id])

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ai/graphology/signature?analysisId=${params.id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar resultados')
      }

      const data = await response.json()
      setAnalysisData(data.analysis)
    } catch (error) {
      console.error('Erro ao carregar análise:', error)
      setError('Erro ao carregar os resultados da análise')
      toast.error('Erro ao carregar os resultados')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    router.push('/colaborador/grafologia')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-blue-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando resultados da análise...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">{error || 'Análise não encontrada'}</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mr-4 hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Análise de Assinatura
              </h1>
              <p className="text-gray-600 mt-1">
                Resultados da análise grafológica baseada em IA
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Confidence Score */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confiabilidade da Análise</h3>
                <p className="text-sm text-gray-600">Baseada em princípios científicos de grafologia para assinaturas</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-pink-600">{analysisData.confidence}%</div>
                <Badge variant="secondary" className="mt-1">
                  {analysisData.confidence >= 85 ? 'Alta Confiança' : 
                   analysisData.confidence >= 70 ? 'Boa Confiança' : 'Confiança Moderada'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Summary */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Resumo Comportamental
            </CardTitle>
            <CardDescription>
              Análise psicológica baseada nos padrões da assinatura observados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {analysisData.behavioralSummary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workplace Trends */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pink-600" />
              Tendências Profissionais
            </CardTitle>
            <CardDescription>
              Avaliação de competências comportamentais baseada na assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Communication */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Comunicação</span>
                </div>
                <span className={`font-bold ${getScoreColor(analysisData.workplaceTrends.communication.score)}`}>
                  {analysisData.workplaceTrends.communication.score}%
                </span>
              </div>
              <Progress value={analysisData.workplaceTrends.communication.score} className="h-2" />
              <p className="text-sm text-gray-600">{analysisData.workplaceTrends.communication.description}</p>
            </div>

            <Separator />

            {/* Organization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Organização</span>
                </div>
                <span className={`font-bold ${getScoreColor(analysisData.workplaceTrends.organization.score)}`}>
                  {analysisData.workplaceTrends.organization.score}%
                </span>
              </div>
              <Progress value={analysisData.workplaceTrends.organization.score} className="h-2" />
              <p className="text-sm text-gray-600">{analysisData.workplaceTrends.organization.description}</p>
            </div>

            <Separator />

            {/* Emotional Stability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Estabilidade Emocional</span>
                </div>
                <span className={`font-bold ${getScoreColor(analysisData.workplaceTrends.emotionalStability.score)}`}>
                  {analysisData.workplaceTrends.emotionalStability.score}%
                </span>
              </div>
              <Progress value={analysisData.workplaceTrends.emotionalStability.score} className="h-2" />
              <p className="text-sm text-gray-600">{analysisData.workplaceTrends.emotionalStability.description}</p>
            </div>

            <Separator />

            {/* Leadership */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Liderança</span>
                </div>
                <span className={`font-bold ${getScoreColor(analysisData.workplaceTrends.leadership.score)}`}>
                  {analysisData.workplaceTrends.leadership.score}%
                </span>
              </div>
              <Progress value={analysisData.workplaceTrends.leadership.score} className="h-2" />
              <p className="text-sm text-gray-600">{analysisData.workplaceTrends.leadership.description}</p>
            </div>

            <Separator />

            {/* Adaptability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Adaptabilidade</span>
                </div>
                <span className={`font-bold ${getScoreColor(analysisData.workplaceTrends.adaptability.score)}`}>
                  {analysisData.workplaceTrends.adaptability.score}%
                </span>
              </div>
              <Progress value={analysisData.workplaceTrends.adaptability.score} className="h-2" />
              <p className="text-sm text-gray-600">{analysisData.workplaceTrends.adaptability.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisData.professionalInsights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Development Areas */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Áreas de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisData.professionalInsights.developmentAreas.map((area, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work, Communication and Leadership Style */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-600" />
                Estilo de Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysisData.professionalInsights.workStyle}</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                Estilo de Comunicação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysisData.professionalInsights.communicationStyle}</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Estilo de Liderança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysisData.professionalInsights.leadershipStyle}</p>
            </CardContent>
          </Card>
        </div>

        {/* Practical Suggestions */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Sugestões Práticas
            </CardTitle>
            <CardDescription>
              Recomendações para desenvolvimento pessoal e profissional baseadas na assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {analysisData.practicalSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                  <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Analysis Details */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-gray-600" />
              Análise Técnica Detalhada
            </CardTitle>
            <CardDescription>
              Observações técnicas específicas da assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pressão</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.pressure}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tamanho</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Inclinação</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.inclination}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legibilidade</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.legibility}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Espaçamento</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.spacing}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ritmo</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.rhythm}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regularidade</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.regularity}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ornamentação</h4>
                  <p className="text-sm text-gray-600">{analysisData.detailedAnalysis.technicalObservations.ornamentation}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Interpretação Psicológica</h4>
              <p className="text-gray-700 leading-relaxed">{analysisData.detailedAnalysis.psychologicalInterpretation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Scientific Basis */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Base Científica
            </CardTitle>
            <CardDescription>
              Fundamentos grafológicos aplicados na análise de assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{analysisData.scientificBasis}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}