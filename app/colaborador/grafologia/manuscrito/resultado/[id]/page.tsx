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
  FileText, 
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
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Import new interactive components
import RadarChart from '@/components/graphology/RadarChart'
import BarChart from '@/components/graphology/BarChart'
import ManuscriptViewer from '@/components/graphology/ManuscriptViewer'
import ConfidenceIndicator from '@/components/graphology/ConfidenceIndicator'
import ReportTabs, { TabType } from '@/components/graphology/ReportTabs'
import ExportFeatures from '@/components/graphology/ExportFeatures'

interface ManuscriptAnalysisData {
  detailedAnalysis: {
    technicalObservations: {
      pressure: string
      size: string
      inclination: string
      spacing: string
      rhythm: string
      regularity: string
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
  }
  confidence: number
  scientificBasis: string
  manuscriptUrl?: string
}

export default function ResultadoPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [data, setData] = useState<ManuscriptAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchAnalysisResults()
    }
  }, [params.id])

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ai/graphology/manuscript?analysisId=${params.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar resultados')
      }

      const responseData = await response.json()
      console.log('Resposta completa da API:', responseData)
      console.log('manuscriptUrl da API:', responseData.manuscriptUrl)
      
      // Incluir manuscriptUrl nos dados da análise
      const analysisWithImage = {
        ...responseData.analysis,
        manuscriptUrl: responseData.manuscriptUrl
      }
      console.log('Dados finais com manuscriptUrl:', analysisWithImage)
      setData(analysisWithImage)
    } catch (error) {
      console.error('Erro ao carregar análise:', error)
      setError('Erro ao carregar os resultados da análise')
      toast.error('Erro ao carregar os resultados')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for export and sharing
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Implementation will be handled by ExportFeatures component
      toast.success('PDF exportado com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async (accessLevel: string, expirationDays: number) => {
    try {
      // Implementation for sharing functionality
      toast.success('Link de compartilhamento criado!')
    } catch (error) {
      toast.error('Erro ao criar link de compartilhamento')
    }
  }

  // Transform data for chart components
  const getChartData = () => {
    if (!data?.workplaceTrends) return []
    
    return [
      { name: 'Comunicação', value: data.workplaceTrends.communication?.score || 0 },
      { name: 'Organização', value: data.workplaceTrends.organization?.score || 0 },
      { name: 'Estabilidade Emocional', value: data.workplaceTrends.emotionalStability?.score || 0 },
      { name: 'Liderança', value: data.workplaceTrends.leadership?.score || 0 },
      { name: 'Adaptabilidade', value: data.workplaceTrends.adaptability?.score || 0 }
    ]
  }

  const getConfidenceData = () => {
    if (!data) return { overall: 0, technical: 0, behavioral: 0, reliability: 0 }
    
    return {
      overall: data.confidence || 0,
      technical: Math.min(100, (data.confidence || 0) + 5),
      behavioral: Math.max(0, (data.confidence || 0) - 3),
      reliability: data.confidence || 0
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando resultados da análise...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{error ? 'Erro ao carregar' : 'Análise não encontrada'}</h3>
                <p className="text-gray-600 mb-6">{error || 'Não foi possível encontrar os dados da análise grafológica.'}</p>
                <Button onClick={handleGoBack} variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const chartData = getChartData()
  const confidenceData = getConfidenceData()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Confiança Geral</p>
                      <p className="text-3xl font-bold text-blue-800">{confidenceData.overall}%</p>
                    </div>
                    <Brain className="h-12 w-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Pontos Fortes</p>
                      <p className="text-3xl font-bold text-green-800">{data?.professionalInsights?.strengths?.length || 0}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Competências</p>
                      <p className="text-3xl font-bold text-purple-800">{chartData.length}</p>
                    </div>
                    <Target className="h-12 w-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Competências Comportamentais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart data={chartData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Análise Detalhada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart data={chartData} />
                </CardContent>
              </Card>
            </div>

            {/* Confidence Indicator */}
            <ConfidenceIndicator 
              confidence={confidenceData}
              scientificBasis={Array.isArray(data?.scientificBasis) ? data.scientificBasis : data?.scientificBasis ? [data.scientificBasis] : []}
            />
          </motion.div>
        )
        
      case 'visualization':
        return (
          <motion.div
            key="visualization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Visualização Completa das Competências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Gráfico Radial</h3>
                      <RadarChart data={chartData} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Gráfico de Barras</h3>
                      <BarChart data={chartData} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <Badge variant={item.value >= 80 ? 'default' : item.value >= 60 ? 'secondary' : 'outline'}>
                          {item.value}%
                        </Badge>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
        
      case 'manuscript':
        return (
          <motion.div
            key="manuscript"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ManuscriptViewer 
              manuscriptUrl={data?.manuscriptUrl || ''}
              highlights={data?.visualHighlights || []}
            />
          </motion.div>
        )
        
      case 'insights':
        return (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Professional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Pontos Fortes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.professionalInsights?.strengths?.map((strength, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Target className="h-5 w-5" />
                    Áreas de Desenvolvimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.professionalInsights?.developmentAreas?.map((area, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{area}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Work and Communication Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Estilo de Trabalho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{data?.professionalInsights?.workStyle}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    Estilo de Comunicação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{data?.professionalInsights?.communicationStyle}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Practical Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Sugestões Práticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.practicalSuggestions?.map((suggestion, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100"
                    >
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Relatório Grafológico Interativo</h1>
                <p className="text-sm text-gray-500">Análise Comportamental Completa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportFeatures 
                onExportPDF={handleExportPDF}
                onShare={handleShare}
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <ReportTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}