'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, TrendingUp, Users, CheckCircle, ArrowLeft, Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  overallScore: number
  dimensions: {
    name: string
    score: number
    description: string
  }[]
  completedAt: string
  recommendations: string[]
}

export default function ClimaOrganizacionalResult() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<TestResult | null>(null)

  useEffect(() => {
    // Simular carregamento dos resultados
    setTimeout(() => {
      setResult({
        overallScore: 78,
        dimensions: [
          {
            name: 'Ambiente de Trabalho',
            score: 82,
            description: 'Avaliação positiva do ambiente físico e psicológico'
          },
          {
            name: 'Valorização Profissional',
            score: 75,
            description: 'Reconhecimento adequado do trabalho realizado'
          },
          {
            name: 'Comunicação Interna',
            score: 77,
            description: 'Fluxo de informações satisfatório na organização'
          }
        ],
        completedAt: new Date().toLocaleDateString('pt-BR'),
        recommendations: [
          'Continue mantendo o bom relacionamento com a equipe',
          'Busque feedback regular sobre seu desempenho',
          'Participe ativamente das iniciativas de comunicação da empresa'
        ]
      })
      setLoading(false)
    }, 1500)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bom'
    return 'Precisa Melhorar'
  }

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleShare = () => {
    toast.info('Funcionalidade de compartilhamento em desenvolvimento')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Processando seus resultados...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">Erro ao carregar os resultados.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/colaborador/corporativos')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Testes
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-purple-600" />
              Resultado: Clima Organizacional
            </h1>
            <p className="text-gray-600">Concluído em {result.completedAt}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Pontuação Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className="space-y-2">
              <p className={`text-xl font-semibold ${getScoreColor(result.overallScore)}`}>
                {getScoreLabel(result.overallScore)}
              </p>
              <Progress value={result.overallScore} className="h-3" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sua avaliação do clima organizacional indica um ambiente de trabalho 
              {result.overallScore >= 80 ? 'muito positivo' : result.overallScore >= 60 ? 'satisfatório' : 'que precisa de melhorias'}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Análise por Dimensões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.dimensions.map((dimension, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">{dimension.name}</h4>
                  <span className={`font-bold ${getScoreColor(dimension.score)}`}>
                    {dimension.score}/100
                  </span>
                </div>
                <Progress value={dimension.score} className="h-2" />
                <p className="text-sm text-gray-600">{dimension.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Próximos Passos:</strong> Seus resultados foram registrados e contribuirão 
          para as análises organizacionais. Continue participando das avaliações para 
          acompanhar a evolução do clima organizacional.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={() => router.push('/colaborador/corporativos')}
          className="flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Outros Testes Corporativos
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/colaborador/resultados')}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Todos os Resultados
        </Button>
      </div>
    </div>
  )
}