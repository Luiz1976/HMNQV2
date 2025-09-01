'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Target, 
  TrendingUp, 
  ArrowLeft, 
  Download,
  Share2,
  Clock,
  User,
  BarChart3,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

// Interface genérica para resultados
interface TestResult {
  id: string
  testName: string
  testType: string
  completedAt: string
  totalScore: number
  maxScore: number
  percentage: number
  level: string
  dimensions: any[]
  recommendations: any[]
  duration?: number
  userId: string
}

export default function FlexResultPage() {
  const params = useParams()
  const router = useRouter()
  const resultId = params.id as string
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (resultId) {
      loadResult()
    }
  }, [resultId])

  const loadResult = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/test-results/${resultId}`)
      
      if (!response.ok) {
        throw new Error('Resultado não encontrado')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        // Dados genéricos do resultado
        const transformedResult = {
          id: data.data.id,
          testName: data.data.testName || 'Teste de Personalidade',
          testType: data.data.testType || 'GENERIC',
          completedAt: data.data.completedAt,
          totalScore: data.data.overallScore || 0,
          maxScore: 100,
          percentage: data.data.overallScore || 0,
          level: 'Resultado disponível',
          dimensions: [],
          recommendations: [],
          duration: data.data.duration,
          userId: data.data.userId
        }
        
        setResult(transformedResult)
      } else {
        throw new Error('Dados do resultado inválidos')
      }
    } catch (error) {
      console.error('Erro ao carregar resultado:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      toast.error('Erro ao carregar resultado do teste')
    } finally {
      setLoading(false)
    }
  }

  // Funções auxiliares removidas - código genérico

  const handleShare = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  const handleDownload = () => {
    toast.info('Funcionalidade de download em desenvolvimento')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando resultado...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Resultado não encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'O resultado solicitado não foi encontrado.'}</p>
          <Button onClick={() => router.push('/colaborador/psicossociais')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Testes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultado do Teste</h1>
          <p className="text-gray-600">{result.testName}</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Concluído em {new Date(result.completedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>ID: {result.id}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 justify-center mb-8"
        >
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </motion.div>

        {/* Overall Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Resultado Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.totalScore}
                </div>
                <div className="text-xl text-gray-700 mb-2">{result.level}</div>
                <div className="text-sm text-gray-500">
                  Pontuação do teste
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.dimensions.map((dimension, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="font-semibold text-sm mb-2">{dimension.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {dimension.score}/{dimension.maxScore}
                    </div>
                    <Badge 
                      variant={dimension.level === 'Baixo' ? 'destructive' : 
                              dimension.level === 'Moderado' ? 'secondary' : 'default'}
                      className="text-xs mb-2"
                    >
                      {dimension.level}
                    </Badge>
                    <p className="text-xs text-gray-600">{dimension.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recomendações de Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/psicossociais')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Testes
          </Button>
          <Button 
            onClick={() => router.push('/colaborador/resultados')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Todos os Resultados
          </Button>
        </motion.div>
      </div>
    </div>
  )
}