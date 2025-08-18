'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, Download, Share2, RotateCcw, TrendingUp, Award, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

// Dados mockados para demonstração - em produção viriam da API
const mockResults = {
  overallScore: 4.2,
  classification: 'Liderança Autêntica Desenvolvida',
  dimensions: {
    'Autoconsciência': { score: 4.3, percentage: 86 },
    'Processamento Balanceado': { score: 4.1, percentage: 82 },
    'Perspectiva Moral Internalizada': { score: 4.4, percentage: 88 },
    'Transparência de Relacionamentos': { score: 4.0, percentage: 80 }
  },
  insights: [
    'Você demonstra alta consciência de seus valores e princípios',
    'Sua capacidade de processar informações de forma equilibrada é bem desenvolvida',
    'Você mantém forte coerência entre valores pessoais e ações',
    'Há oportunidades para aumentar a transparência nos relacionamentos'
  ],
  recommendations: [
    'Continue desenvolvendo sua autoconsciência através de reflexão regular',
    'Pratique ainda mais a escuta ativa e consideração de perspectivas diversas',
    'Mantenha a consistência entre seus valores e ações em situações desafiadoras',
    'Trabalhe na abertura e transparência em seus relacionamentos profissionais'
  ]
}

function getClassificationColor(classification: string) {
  switch (classification) {
    case 'Liderança Autêntica Exemplar':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Liderança Autêntica Desenvolvida':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Liderança Autêntica Emergente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Liderança Autêntica em Desenvolvimento':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    default:
      return 'bg-red-100 text-red-800 border-red-200'
  }
}

function getClassificationIcon(classification: string) {
  switch (classification) {
    case 'Liderança Autêntica Exemplar':
      return <Award className="h-5 w-5" />
    case 'Liderança Autêntica Desenvolvida':
      return <TrendingUp className="h-5 w-5" />
    case 'Liderança Autêntica Emergente':
      return <Target className="h-5 w-5" />
    default:
      return <AlertCircle className="h-5 w-5" />
  }
}

export default function HumaniQTelaResultadoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState(mockResults)

  useEffect(() => {
    // Simular carregamento dos resultados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownloadReport = () => {
    // Implementar download do relatório
    console.log('Download do relatório')
  }

  const handleShareResults = () => {
    // Implementar compartilhamento
    console.log('Compartilhar resultados')
  }

  const handleRetakeTest = () => {
    router.push('/colaborador/psicossociais/humaniq-tela/introducao')
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-amber-100 w-fit mx-auto">
            <Target className="h-12 w-12 text-amber-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Processando Resultados</h1>
          <p className="text-gray-600">Analisando suas respostas...</p>
          <div className="w-64 mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-amber-100">
            <Target className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Seus Resultados - HumaniQ TELA
            </h1>
            <p className="text-lg text-gray-600">
              Teste de Liderança Autêntica
            </p>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-900 flex items-center justify-center gap-2">
            {getClassificationIcon(results.classification)}
            Pontuação Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-amber-600">
            {results.overallScore.toFixed(1)}
          </div>
          <div className="text-lg text-amber-800">de 5.0 pontos</div>
          <Badge className={`text-lg px-4 py-2 ${getClassificationColor(results.classification)}`}>
            {results.classification}
          </Badge>
        </CardContent>
      </Card>

      {/* Dimensions Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Pontuação por Dimensão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(results.dimensions).map(([dimension, data]) => (
              <div key={dimension} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{dimension}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-600">
                      {data.score.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">({data.percentage}%)</span>
                  </div>
                </div>
                <Progress value={data.percentage} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Principais Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Recomendações de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Este relatório fornece insights baseados em suas respostas 
          ao teste de liderança autêntica. Use essas informações como ponto de partida para 
          reflexão e desenvolvimento pessoal. Para um desenvolvimento mais aprofundado, 
          considere buscar feedback adicional e coaching profissional.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <Button 
          onClick={handleDownloadReport}
          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleShareResults}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleRetakeTest}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer Teste
        </Button>
        
        <Button 
          variant="ghost"
          onClick={() => router.push('/colaborador/psicossociais')}
          className="text-gray-600"
        >
          Voltar aos Testes
        </Button>
      </div>
    </div>
  )
}