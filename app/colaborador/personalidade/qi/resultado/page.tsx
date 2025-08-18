'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Share2, BarChart3 } from 'lucide-react'

interface QIResults {
  raciocinio_logico: number
  raciocinio_verbal: number
  raciocinio_numerico: number
  raciocinio_espacial: number
  pontuacao_total: number
  pontuacao_maxima: number
  percentual_acertos: number
}

interface Dimension {
  name: string
  score: number
  maxScore: number
  color: string
  description: string
  interpretation: string
}

export default function QIResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<QIResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recuperar resultados do localStorage
    const savedResults = localStorage.getItem('qiTestResults')
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // Se não há resultados, redirecionar para o teste
      router.push('/colaborador/personalidade/qi')
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhum resultado encontrado</p>
          <Button onClick={() => router.push('/colaborador/personalidade/qi')}>
            Fazer Teste
          </Button>
        </div>
      </div>
    )
  }

  const dimensions: Dimension[] = [
    {
      name: 'Raciocínio Lógico',
      score: results.raciocinio_logico,
      maxScore: 5,
      color: 'bg-blue-500',
      description: 'Capacidade de análise lógica, dedução e resolução de problemas sequenciais',
      interpretation: results.raciocinio_logico >= 4 ? 'Excelente capacidade de raciocínio lógico' : 
                     results.raciocinio_logico >= 3 ? 'Boa capacidade de análise lógica' : 
                     results.raciocinio_logico >= 2 ? 'Capacidade adequada de raciocínio lógico' :
                     'Pode desenvolver melhor o pensamento lógico'
    },
    {
      name: 'Raciocínio Verbal',
      score: results.raciocinio_verbal,
      maxScore: 5,
      color: 'bg-green-500',
      description: 'Habilidade com linguagem, analogias, vocabulário e compreensão verbal',
      interpretation: results.raciocinio_verbal >= 4 ? 'Excelente domínio verbal' : 
                     results.raciocinio_verbal >= 3 ? 'Boa habilidade verbal' : 
                     results.raciocinio_verbal >= 2 ? 'Capacidade verbal adequada' :
                     'Pode expandir vocabulário e habilidades verbais'
    },
    {
      name: 'Raciocínio Numérico',
      score: results.raciocinio_numerico,
      maxScore: 5,
      color: 'bg-purple-500',
      description: 'Capacidade de trabalhar com números, cálculos e sequências matemáticas',
      interpretation: results.raciocinio_numerico >= 4 ? 'Excelente habilidade numérica' : 
                     results.raciocinio_numerico >= 3 ? 'Boa capacidade numérica' : 
                     results.raciocinio_numerico >= 2 ? 'Habilidade numérica adequada' :
                     'Pode desenvolver melhor o raciocínio matemático'
    },
    {
      name: 'Raciocínio Espacial',
      score: results.raciocinio_espacial,
      maxScore: 5,
      color: 'bg-orange-500',
      description: 'Capacidade de visualização espacial, orientação e manipulação mental de objetos',
      interpretation: results.raciocinio_espacial >= 4 ? 'Excelente percepção espacial' : 
                     results.raciocinio_espacial >= 3 ? 'Boa capacidade espacial' : 
                     results.raciocinio_espacial >= 2 ? 'Percepção espacial adequada' :
                     'Pode desenvolver melhor a visualização espacial'
    }
  ]

  const getOverallInterpretation = (score: number) => {
    if (score >= 18) return { 
      level: 'QI Muito Acima da Média', 
      color: 'text-green-600', 
      description: 'Desempenho cognitivo excepcional (≥130 QI)',
      recommendation: 'Continue desafiando-se com problemas complexos e atividades intelectuais avançadas.'
    }
    if (score >= 15) return { 
      level: 'QI Acima da Média', 
      color: 'text-blue-600', 
      description: 'Boa capacidade cognitiva (115-129 QI)',
      recommendation: 'Explore áreas de interesse intelectual e desenvolva talentos específicos.'
    }
    if (score >= 10) return { 
      level: 'QI Dentro da Média', 
      color: 'text-yellow-600', 
      description: 'Capacidade cognitiva adequada (85-114 QI)',
      recommendation: 'Continue praticando e desenvolvendo suas habilidades cognitivas regularmente.'
    }
    if (score >= 6) return { 
      level: 'QI Abaixo da Média', 
      color: 'text-orange-600', 
      description: 'Sugere-se investigação mais detalhada (70-84 QI)',
      recommendation: 'Considere buscar orientação profissional para desenvolvimento cognitivo.'
    }
    return { 
      level: 'Avaliação Especializada Recomendada', 
      color: 'text-red-600', 
      description: 'Procure avaliação neuropsicológica completa (<70 QI)',
      recommendation: 'Busque avaliação profissional especializada para investigação aprofundada.'
    }
  }

  const overall = getOverallInterpretation(results.pontuacao_total)

  const handleDownload = () => {
    // Implementar download do relatório
    console.log('Download do relatório')
  }

  const handleShare = () => {
    // Implementar compartilhamento
    console.log('Compartilhar resultados')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/colaborador/personalidade')}
              className="text-white hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Resultados do Teste de QI</h1>
            <p className="text-green-100 text-lg">Análise das suas habilidades cognitivas</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Pontuação Geral */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Pontuação Geral</CardTitle>
            <div className="text-6xl font-bold text-green-600 mb-2">
              {results.pontuacao_total}/20
            </div>
            <div className="text-lg text-gray-600 mb-2">
              {results.percentual_acertos.toFixed(1)}% de acertos
            </div>
            <div className={`text-xl font-semibold ${overall.color} mb-2`}>
              {overall.level}
            </div>
            <p className="text-gray-600 mb-4">{overall.description}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recomendação:</strong> {overall.recommendation}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Dimensões */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {dimensions.map((dimension, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {dimension.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{dimension.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{dimension.score}</span>
                    <span className="text-sm text-gray-500">/{dimension.maxScore}</span>
                  </div>
                  <Progress 
                    value={(dimension.score / dimension.maxScore) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-gray-700">{dimension.interpretation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recomendações de Desenvolvimento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Recomendações de Desenvolvimento</CardTitle>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Para Raciocínio Lógico:</h4>
                <p className="text-blue-700 text-sm">Pratique problemas de lógica, sequências, silogismos e jogos de estratégia como xadrez.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Para Raciocínio Verbal:</h4>
                <p className="text-green-700 text-sm">Leia regularmente, expanda vocabulário, pratique analogias e exercícios de compreensão textual.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Para Raciocínio Numérico:</h4>
                <p className="text-purple-700 text-sm">Resolva problemas matemáticos, sequências numéricas, cálculos mentais e exercícios de lógica quantitativa.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Para Raciocínio Espacial:</h4>
                <p className="text-orange-700 text-sm">Pratique quebra-cabeças 3D, origami, desenho técnico e exercícios de rotação mental.</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Referências Científicas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Fundamentação Científica</CardTitle>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Base Teórica:</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Este teste é estruturado com base em instrumentos clássicos de avaliação cognitiva:
                </p>
                <ul className="text-gray-700 text-sm space-y-1 ml-4">
                  <li>• <strong>WAIS</strong> (Wechsler Adult Intelligence Scale)</li>
                  <li>• <strong>WISC</strong> (Wechsler Intelligence Scale for Children)</li>
                  <li>• <strong>Matrizes Progressivas de Raven</strong></li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Domínios Cognitivos Avaliados:</h4>
                <p className="text-blue-700 text-sm">
                  Os quatro domínios (raciocínio lógico, verbal, numérico e espacial) são tradicionalmente 
                  aplicados em testes de QI e representam as principais dimensões da inteligência humana 
                  segundo a literatura científica em psicologia cognitiva.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Importante:</h4>
                <p className="text-yellow-700 text-sm">
                  Este é um teste de triagem. Para avaliação clínica completa, procure um psicólogo 
                  especializado em avaliação neuropsicológica.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar Relatório
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/personalidade/qi')}
          >
            Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  )
}