'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, Share2, RotateCcw, TrendingUp, Award, AlertCircle, Printer } from 'lucide-react'
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



  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
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

      {/* Detailed Professional Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Award className="h-6 w-6" />
            Análise Detalhada: Liderança Autêntica Desenvolvida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scientific Context */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Contextualização Científica
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Liderança Autêntica, conforme conceituada por Avolio e Gardner (2005), representa um padrão 
              de comportamento de liderança que se baseia em quatro componentes fundamentais: autoconsciência, 
              processamento balanceado de informações, perspectiva moral internalizada e transparência relacional. 
              Pesquisas longitudinais demonstram que líderes autênticos promovem maior engajamento, confiança 
              e bem-estar organizacional (Walumbwa et al., 2008).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Seu perfil "Liderança Autêntica Desenvolvida" indica um nível avançado de maturidade em liderança, 
              posicionando-se no terceiro quartil superior da distribuição populacional, segundo estudos normativos 
              realizados com amostras brasileiras (Sobral & Gimba, 2012).
            </p>
          </div>

          {/* User Results Analysis */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Análise dos Seus Resultados
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-green-800 mb-2">Pontos Fortes Identificados:</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Perspectiva Moral Internalizada (4.4/5.0):</strong> Demonstra sólida base ética e coerência entre valores pessoais e ações profissionais, característica essencial para liderança sustentável.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Autoconsciência (4.3/5.0):</strong> Elevado nível de autoconhecimento sobre forças, limitações e impacto nos outros, facilitando o desenvolvimento contínuo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Processamento Balanceado (4.1/5.0):</strong> Capacidade desenvolvida para análise objetiva de informações e consideração de perspectivas diversas antes da tomada de decisão.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-amber-800 mb-2">Áreas de Desenvolvimento:</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Transparência de Relacionamentos (4.0/5.0):</strong> Oportunidade para aprimorar a abertura e autenticidade nas interações, fortalecendo vínculos de confiança com a equipe.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Professional Recommendations */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Award className="h-5 w-5 text-purple-600 mr-2" />
              Recomendações Profissionais Baseadas nos Resultados
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-purple-800 mb-2">Desenvolvimento Imediato (0-3 meses):</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Implementar práticas de feedback 360° para aumentar a transparência relacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Estabelecer sessões regulares de coaching ou mentoring para aprofundar a autoconsciência</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-800 mb-2">Desenvolvimento de Médio Prazo (3-12 meses):</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Participar de programas de desenvolvimento de liderança focados em autenticidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Desenvolver competências em comunicação não-violenta e escuta empática</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-800 mb-2">Desenvolvimento de Longo Prazo (1-2 anos):</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Assumir projetos de liderança transformacional que desafiem e expandam suas capacidades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Tornar-se mentor de outros líderes, consolidando e transmitindo conhecimentos adquiridos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Occupational Stress Management */}
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              Considerações sobre Gestão do Estresse Ocupacional
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Líderes autênticos desenvolvidos, como demonstrado em seu perfil, tendem a apresentar maior 
              resiliência ao estresse ocupacional devido à congruência entre valores pessoais e ações 
              profissionais (Kernis, 2003). No entanto, a responsabilidade aumentada pode gerar pressões específicas.
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-orange-800 mb-2">Estratégias Preventivas Recomendadas:</h5>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Mindfulness e Autorregulação:</strong> Práticas diárias de 10-15 minutos para manter a autoconsciência e equilíbrio emocional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Delegação Eficaz:</strong> Utilizar sua transparência relacional para desenvolver a equipe e distribuir responsabilidades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Rede de Apoio Profissional:</strong> Manter conexões com outros líderes para troca de experiências e suporte mútuo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Equilíbrio Vida-Trabalho:</strong> Estabelecer boundaries claros alinhados com seus valores morais internalizados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Scientific References */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Referências Científicas</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Avolio, B. J., & Gardner, W. L. (2005). Authentic leadership development: Getting to the root of positive forms of leadership. <em>The Leadership Quarterly, 16</em>(3), 315-338.</p>
              <p>• Kernis, M. H. (2003). Toward a conceptualization of optimal self-esteem. <em>Psychological Inquiry, 14</em>(1), 1-26.</p>
              <p>• Sobral, F., & Gimba, R. (2012). As prioridades axiológicas do líder autêntico: Um estudo sobre valores e liderança. <em>RAM - Revista de Administração Mackenzie, 13</em>(3), 96-121.</p>
              <p>• Walumbwa, F. O., Avolio, B. J., Gardner, W. L., Wernsing, T. S., & Peterson, S. J. (2008). Authentic leadership: Development and validation of a theory-based measure. <em>Journal of Management, 34</em>(1), 89-126.</p>
            </div>
          </div>
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
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 print:hidden"
        >
          <Printer className="h-4 w-4" />
          Imprimir Teste
        </Button>
        

        
        <Button 
          variant="outline"
          onClick={handleShareResults}
          className="flex items-center gap-2 print:hidden"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleRetakeTest}
          className="flex items-center gap-2 print:hidden"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer Teste
        </Button>
        
        <Button 
          variant="ghost"
          onClick={() => router.push('/colaborador/psicossociais')}
          className="text-gray-600 print:hidden"
        >
          Voltar aos Testes
        </Button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\:hidden {
            display: none !important;
          }
          
          .max-w-4xl {
            max-width: none;
            margin: 0;
          }
          
          .space-y-6 > * + * {
            margin-top: 1rem;
          }
          
          .bg-gradient-to-r {
            background: #fef3c7 !important;
          }
          
          .border {
            border: 1px solid #d1d5db !important;
          }
          
          .shadow, .shadow-sm, .shadow-md, .shadow-lg {
            box-shadow: none !important;
          }
          
          .rounded, .rounded-lg, .rounded-full {
            border-radius: 4px !important;
          }
          
          .text-6xl {
            font-size: 3rem !important;
          }
          
          .p-6 {
            padding: 1rem !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 0.75rem !important;
          }
          
          .space-y-3 > * + * {
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}