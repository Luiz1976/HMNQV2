'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InteractiveManuscriptViewer } from '@/components/ui/interactive-manuscript-viewer'
import { AdvancedBehavioralAnalysis } from '@/components/ui/advanced-behavioral-analysis'
import { GraphologyReportHeader } from '@/components/ui/graphology-report-header'
import { ReportActions } from '@/components/ui/report-actions'
import PDFGenerator from '@/components/ui/pdf-generator'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Download, 
  Share2, 
  Eye, 
  RefreshCw, 
  Clock, 
  User, 
  BarChart3, 
  FileText, 
  Sparkles,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Copy,
  Mail,
  Phone,
  Image as ImageIcon,
  Zap,
  PenTool,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface VisualHighlight {
  x: number
  y: number
  width: number
  height: number
  type: 'pressure' | 'spacing' | 'inclination' | 'size' | 'margin' | 'rhythm'
  interpretation: string

  technicalDetails?: string
}

interface WorkplaceTrend {
  score: number
  description: string
}

interface WorkplaceTrends {
  communication: WorkplaceTrend
  organization: WorkplaceTrend
  emotionalStability: WorkplaceTrend
  leadership: WorkplaceTrend
  adaptability: WorkplaceTrend
}

interface GraphologyAnalysis {
  detailedAnalysis?: {
    technicalObservations: {
      pressure: string;
      size: string;
      inclination: string;
      spacing: string;
      rhythm: string;
      regularity: string;
    };
    psychologicalInterpretation: string;
  };
  behavioralSummary: string
  workplaceTrends: WorkplaceTrends
  practicalSuggestions: string[]
  visualHighlights: VisualHighlight[]
  professionalInsights?: {
    strengths: string[];
    developmentAreas: string[];
    workStyle: string;
    communicationStyle: string;
  };
  scientificBasis?: string;

}

interface ManuscriptData {
  imageUrl: string
  manuscriptType: 'manuscript' | 'signature'
}

interface TestResult {
  id: string
  test: {
    id: string
    name: string
    description: string
    testType: string
    category: {
      id: string
      name: string
    }
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  completedAt: string
  duration: number
  overallScore: number | null
  dimensionScores: { [key: string]: number }
  interpretation: string | null
  recommendations: string | null
  metadata: any
  aiAnalysis: {
    id: string
    analysis: string
  
    analysisType: string
    metadata: any
    createdAt: string
    professionalReport?: string
  } | null
  graphologyAnalysis?: GraphologyAnalysis | null
  manuscriptData?: ManuscriptData | null
  answers: Array<{
    questionId: string
    question: {
      id: string
      text: string
      type: string
      configuration: any
    }
    answerValue: any
    timeSpent: number
  }>
}

export default function ResultDetailPage() {
  const params = useParams()
  const resultId = params.id as string
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)
  const [regeneratingAnalysis, setRegeneratingAnalysis] = useState(false)
  const [loadingGraphologyAnalysis, setLoadingGraphologyAnalysis] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [graphologyAnalysis, setGraphologyAnalysis] = useState<GraphologyAnalysis | null>(null)
  const [manuscriptData, setManuscriptData] = useState<ManuscriptData | null>(null)
  const [professionalReport, setProfessionalReport] = useState<string | null>(null)

  useEffect(() => {
    if (resultId) {
      loadResult()
    }
  }, [resultId])

  const loadResult = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/colaborador/resultados/${resultId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar resultado')
      }

      const data = await response.json()
      setResult(data)
      
      if (data.aiAnalysis?.professionalReport) {
        setProfessionalReport(data.aiAnalysis.professionalReport)
      }
      
      if (data.graphologyAnalysis) {
        setGraphologyAnalysis(data.graphologyAnalysis)
      }
      
      if (data.manuscriptData) {
        setManuscriptData(data.manuscriptData)
      }
    } catch (error) {
      console.error('Erro ao carregar resultado:', error)
      toast.error('Erro ao carregar resultado')
    } finally {
      setLoading(false)
    }
  }

  const generateProfessionalReport = async () => {
    try {
      setLoadingReport(true)
      const response = await fetch(`/api/colaborador/resultados/${resultId}?includeReport=true`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar relatório')
      }

      const data = await response.json()
      
      if (data.aiAnalysis?.professionalReport) {
        setProfessionalReport(data.aiAnalysis.professionalReport)
        toast.success('Relatório profissional gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar relatório profissional')
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório profissional')
    } finally {
      setLoadingReport(false)
    }
  }

  const regenerateAIAnalysis = async () => {
    try {
      setRegeneratingAnalysis(true)
      const response = await fetch(`/api/colaborador/resultados/${resultId}?regenerateAnalysis=true`)
      
      if (!response.ok) {
        throw new Error('Erro ao regenerar análise')
      }

      const data = await response.json()
      setResult(data)
      toast.success('Análise de IA regenerada com sucesso!')
    } catch (error) {
      console.error('Erro ao regenerar análise:', error)
      toast.error('Erro ao regenerar análise de IA')
    } finally {
      setRegeneratingAnalysis(false)
    }
  }

  const generateGraphologyAnalysis = async () => {
    console.log(`Botão 'Gerar Análise Grafológica' clicado. Iniciando análise para o resultId: ${resultId}`);
    if (!resultId) {
      toast.error('ID do resultado não encontrado');
      return;
    }

    try {
      setLoadingGraphologyAnalysis(true);
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultId: resultId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || 'Falha ao gerar análise grafológica');
      }

      const data = await response.json();
      
      toast.success('Análise grafológica gerada e salva com sucesso!');
      
      // Recarrega os dados da página para exibir a análise salva
      await loadResult();

    } catch (error: any) {
      console.error('Erro ao gerar análise grafológica:', error);
      toast.error(error.message || 'Ocorreu um erro ao gerar a análise.');
    } finally {
      setLoadingGraphologyAnalysis(false);
    }
  };

  const downloadReport = async (format: 'md' | 'pdf' = 'pdf') => {
    try {
      setLoadingReport(true)
      
      if (format === 'pdf') {
        const response = await fetch('/api/pdf/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resultId: resultId,
            includeGraphology: !!graphologyAnalysis,
            includeProfessionalReport: !!professionalReport
          })
        })

        if (!response.ok) {
          throw new Error('Erro ao gerar PDF')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `relatorio-grafologico-${result?.test.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Relatório PDF baixado com sucesso!')
      } else {
        // Download Markdown
        if (!professionalReport) {
          toast.error('Relatório profissional não disponível')
          return
        }
        
        const blob = new Blob([professionalReport], { type: 'text/markdown' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `relatorio-${result?.test.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Relatório Markdown baixado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao baixar relatório:', error)
      toast.error('Erro ao baixar relatório')
    } finally {
      setLoadingReport(false)
    }
  }

  const shareResult = async (method: 'link' | 'whatsapp' | 'email') => {
    const shareUrl = `${window.location.origin}/colaborador/resultados/${resultId}`
    const shareText = `Confira meu resultado do teste ${result?.test.name}: ${shareUrl}`
    
    switch (method) {
      case 'link':
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copiado para a área de transferência!')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Resultado do teste ${result?.test.name}`)}&body=${encodeURIComponent(shareText)}`, '_blank')
        break
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert>
          <AlertDescription>
            Resultado não encontrado ou você não tem permissão para visualizá-lo.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{result.test.name}</h1>
              <p className="text-purple-100 mt-1">{result.test.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(result.completedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(result.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{result.user.firstName} {result.user.lastName}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.aiAnalysis && (
              <Button
                variant="secondary"
                size="sm"
                onClick={generateProfessionalReport}
                disabled={loadingReport}
              >
                {loadingReport ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Gerar Relatório
              </Button>
            )}
            
            {result.test.testType === 'GRAPHOLOGY' && (
              <ReportActions
                testId={result.id}
                userName={`${result.user.firstName} ${result.user.lastName}`}
                testDate={new Date(result.completedAt).toLocaleDateString('pt-BR')}
              />
            )}
            
            {result.test.testType === 'GRAPHOLOGY' && (
              <GraphologyReportHeader
                userName={`${result.user.firstName} ${result.user.lastName}`}
                testDate={new Date(result.completedAt).toLocaleDateString('pt-BR')}
                testType={result.test.testType}
              />
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full ${result.test.testType === 'GRAPHOLOGY' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          {result.test.testType === 'GRAPHOLOGY' && (
            <TabsTrigger value="manuscript">Manuscrito</TabsTrigger>
          )}
          <TabsTrigger value="behavioral">Comportamental</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="report">Relatório</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {result.overallScore !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Pontuação Geral</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore.toFixed(1)}%
                  </div>
                  <Progress value={result.overallScore} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {result.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Confiança da Análise IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Análise concluída</p>
                    <Badge className="bg-green-100 text-green-800">
                  Análise IA
                </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regenerateAIAnalysis}
                    disabled={regeneratingAnalysis}
                  >
                    {regeneratingAnalysis ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Regenerar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Informações do Teste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{result.test.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">{result.test.testType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questões:</span>
                <span className="font-medium">{result.answers.length}</span>
              </div>
            </CardContent>
          </Card>

          {Object.keys(result.dimensionScores).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pontuações por Dimensão</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.dimensionScores).map(([dimension, score]) => {
                  // Verificar se score é um número ou um objeto aninhado
                  if (typeof score === 'object' && score !== null) {
                    // Para testes como HumaniQ TIPOS que têm estrutura aninhada
                    return (
                      <div key={dimension} className="space-y-3">
                        <h4 className="font-semibold text-gray-800">{dimension}</h4>
                        {Object.entries(score as Record<string, number>).map(([subDimension, subScore]) => (
                          <div key={subDimension} className="space-y-2 ml-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{subDimension}</span>
                              <span className={`font-bold ${getScoreColor(Number(subScore))}`}>
                                {Number(subScore).toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={Number(subScore)} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )
                  } else {
                    // Para testes com estrutura simples
                    const numericScore = Number(score)
                    return (
                      <div key={dimension} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{dimension}</span>
                          <span className={`font-bold ${getScoreColor(numericScore)}`}>
                            {numericScore.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={numericScore} className="h-2" />
                      </div>
                    )
                  }
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {result.test.testType === 'GRAPHOLOGY' && (
          <TabsContent value="manuscript" className="space-y-6">
            {manuscriptData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PenTool className="h-5 w-5" />
                    <span>Visualizador de Manuscrito Interativo</span>
                  </CardTitle>
                  <CardDescription>
                    Explore o manuscrito com análises visuais detalhadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InteractiveManuscriptViewer
                    imageUrl={manuscriptData.imageUrl}
                    highlights={graphologyAnalysis?.visualHighlights || []}
                  />
                  {graphologyAnalysis && (
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800">
                  Análise Grafológica
                </Badge>
                    </div>
                  )}
                  {!graphologyAnalysis && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 mb-4">Análise grafológica não disponível</p>
                      <Button
                        onClick={generateGraphologyAnalysis}
                        disabled={loadingGraphologyAnalysis}
                      >
                        {loadingGraphologyAnalysis ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Gerar Análise Grafológica
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Manuscrito não disponível</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="behavioral" className="space-y-6">
          {graphologyAnalysis ? (
            <AdvancedBehavioralAnalysis
              analysis={{
                behavioralSummary: graphologyAnalysis.behavioralSummary,
                workplaceTrends: {
                  communication: {
                    score: graphologyAnalysis.workplaceTrends.communication.score,
                    description: graphologyAnalysis.workplaceTrends.communication.description
                  },
                  organization: {
                    score: graphologyAnalysis.workplaceTrends.organization.score,
                    description: graphologyAnalysis.workplaceTrends.organization.description
                  },
                  emotionalStability: {
                    score: graphologyAnalysis.workplaceTrends.emotionalStability.score,
                    description: graphologyAnalysis.workplaceTrends.emotionalStability.description
                  },
                  leadership: {
                    score: graphologyAnalysis.workplaceTrends.leadership.score,
                    description: graphologyAnalysis.workplaceTrends.leadership.description
                  },
                  adaptability: {
                    score: graphologyAnalysis.workplaceTrends.adaptability.score,
                    description: graphologyAnalysis.workplaceTrends.adaptability.description
                  }
                },
                practicalSuggestions: graphologyAnalysis.practicalSuggestions,
                visualHighlights: graphologyAnalysis.visualHighlights
              }}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Análise comportamental não disponível</p>
                {manuscriptData ? (
                  <Button
                    onClick={generateGraphologyAnalysis}
                    disabled={loadingGraphologyAnalysis}
                  >
                    {loadingGraphologyAnalysis ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Gerar Análise
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">Manuscrito necessário para análise comportamental</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>



        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Respostas Detalhadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.answers.map((answer, index) => (
                <div key={answer.questionId} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {index + 1}. {answer.question.text}
                    </h4>
                    <Badge variant="outline">
                      {answer.timeSpent}s
                    </Badge>
                  </div>
                  <div className="text-gray-700">
                    <strong>Resposta:</strong>{' '}
                    {typeof answer.answerValue === 'object'
                      ? JSON.stringify(answer.answerValue, null, 2)
                      : answer.answerValue}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Gerador de Relatório PDF</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PDFGenerator
                data={{
                  testResult: {
                    id: result.id,
                    testType: result.test.name,
                    userName: `${result.user.firstName} ${result.user.lastName}`,
                    userEmail: result.user.email,
                    companyName: 'N/A',
                    completedAt: result.completedAt,
                    scores: {},
                    interpretation: result.interpretation || '',
                    recommendations: result.recommendations ? [result.recommendations] : []
                  },
                  imageAnalysis: manuscriptData ? {
                     imageUrl: manuscriptData.imageUrl,
                     highlights: [],
                     analysis: typeof graphologyAnalysis?.detailedAnalysis === 'string' 
                       ? graphologyAnalysis.detailedAnalysis 
                       : JSON.stringify(graphologyAnalysis?.detailedAnalysis || ''),
                     behavioralAnalysis: graphologyAnalysis,
                     confidence: 85
                   } : undefined,
                  aiAnalysis: result.aiAnalysis ? {
                    summary: result.aiAnalysis.analysis,
                    insights: [],
                    recommendations: result.recommendations ? [result.recommendations] : []
                  } : undefined
                }}
              />
            </CardContent>
          </Card>
          
          {professionalReport && (
            <Card>
              <CardHeader>
                <CardTitle>Relatório Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {professionalReport}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Resultado</DialogTitle>
            <DialogDescription>
              Compartilhe seu resultado do teste com outras pessoas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => shareResult('link')}
              variant="outline"
              className="w-full justify-start"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
            <Button
              onClick={() => shareResult('whatsapp')}
              variant="outline"
              className="w-full justify-start"
            >
              <Phone className="h-4 w-4 mr-2" />
              Compartilhar no WhatsApp
            </Button>
            <Button
              onClick={() => shareResult('email')}
              variant="outline"
              className="w-full justify-start"
            >
              <Mail className="h-4 w-4 mr-2" />
              Compartilhar por E-mail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}