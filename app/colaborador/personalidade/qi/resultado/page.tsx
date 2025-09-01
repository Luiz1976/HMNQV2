'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Share2, BarChart3, Printer } from 'lucide-react'

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

  // Calcular interpretações de forma segura antes de qualquer retorno condicional
  const overall = useMemo(() => {
    if (!results) return {
      level: '',
      color: '',
      description: '',
      recommendation: ''
    }
    return getOverallInterpretation(results.pontuacao_total)
  }, [results])

  const professionalAnalysis = useMemo(() => {
    if (!overall || !overall.level) return ''
    const insights: Record<string, string> = {
      'QI Muito Acima da Média': 'Seu desempenho cognitivo excepcional indica alto potencial para tarefas que exigem pensamento crítico e resolução complexa de problemas. Procure oportunidades de liderança intelectual e continue desafiando-se com projetos inovadores.',
      'QI Acima da Média': 'Você possui excelente capacidade de aprendizado e adaptação. Considere envolver-se em projetos que exijam raciocínio analítico e técnica avançada para maximizar seu potencial.',
      'QI Dentro da Média': 'Sua capacidade cognitiva é adequada para a maioria das funções. Foque em aprimorar habilidades específicas por meio de treinamentos direcionados e prática consistente.',
      'QI Abaixo da Média': 'É recomendável buscar capacitações adicionais e acompanhamento profissional para desenvolver competências cognitivas fundamentais.',
      'Avaliação Especializada Recomendada': 'Procure avaliação neuropsicológica detalhada para orientar planos de desenvolvimento cognitivo personalizados.'
    }
    return insights[overall.level] || ''
  }, [overall])

  const dimensions: Dimension[] = useMemo(() => {
    if (!results) return []
    return [
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
  }, [results])

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

  // Hooks já definidos antes dos retornos condicionais para evitar erro de hooks duplicados

  const handlePrint = () => {
    window.print()
  }



  const handleShare = () => {
    // Implementar compartilhamento
    console.log('Compartilhar resultados')
  }

  return (
    <>

      <div id="qi-results" className="min-h-screen bg-gray-50">
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

        {/* Análise Profissional Detalhada */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4 text-center">Análise Profissional das Suas Características Cognitivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Perfil Cognitivo Geral */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Perfil Cognitivo Geral</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {professionalAnalysis}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Pontos Fortes Identificados:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dimensions.map((dim, idx) => {
                        if (dim.score >= 4) {
                          return <li key={idx} className="flex items-center gap-2">• <span className="text-green-600 font-medium">{dim.name}</span> - Desempenho excepcional</li>
                        }
                        if (dim.score >= 3) {
                          return <li key={idx} className="flex items-center gap-2">• <span className="text-blue-600 font-medium">{dim.name}</span> - Bom desempenho</li>
                        }
                        return null
                      }).filter(Boolean)}
                      {dimensions.every(dim => dim.score < 3) && (
                        <li className="text-gray-500">Todas as áreas apresentam potencial de desenvolvimento</li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Áreas de Desenvolvimento:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dimensions.map((dim, idx) => {
                        if (dim.score < 3) {
                          return <li key={idx} className="flex items-center gap-2">• <span className="text-orange-600 font-medium">{dim.name}</span> - Foco recomendado</li>
                        }
                        return null
                      }).filter(Boolean)}
                      {dimensions.every(dim => dim.score >= 3) && (
                        <li className="text-green-600">Perfil cognitivo equilibrado - manter desenvolvimento contínuo</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Análise Comportamental e Profissional */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Implicações Comportamentais e Profissionais</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Estilo de Aprendizagem Recomendado:</h4>
                    <div className="space-y-3">
                      {results.raciocinio_verbal >= results.raciocinio_espacial ? (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Verbal-Linguístico:</strong> Você processa melhor informações através de palavras, textos e discussões. Prefira métodos de estudo que envolvam leitura, escrita e explicações verbais.</p>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Visual-Espacial:</strong> Você aprende melhor através de imagens, diagramas e representações visuais. Utilize mapas mentais, gráficos e recursos visuais em seus estudos.</p>
                        </div>
                      )}
                      {results.raciocinio_logico >= 3 && (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Analítico:</strong> Sua capacidade lógica permite abordar problemas de forma sistemática e estruturada. Você se beneficia de métodos organizados e sequenciais.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Áreas Profissionais Compatíveis:</h4>
                    <div className="space-y-2">
                      {results.raciocinio_logico >= 4 && (
                        <div className="bg-white p-2 rounded text-sm text-gray-700">• <strong>Engenharia e Tecnologia:</strong> Desenvolvimento de sistemas, programação, análise de dados</div>
                      )}
                      {results.raciocinio_verbal >= 4 && (
                        <div className="bg-white p-2 rounded text-sm text-gray-700">• <strong>Comunicação e Educação:</strong> Jornalismo, ensino, tradução, marketing de conteúdo</div>
                      )}
                      {results.raciocinio_numerico >= 4 && (
                        <div className="bg-white p-2 rounded text-sm text-gray-700">• <strong>Finanças e Análise:</strong> Contabilidade, auditoria, análise financeira, estatística</div>
                      )}
                      {results.raciocinio_espacial >= 4 && (
                        <div className="bg-white p-2 rounded text-sm text-gray-700">• <strong>Design e Arquitetura:</strong> Design gráfico, arquitetura, engenharia civil, artes visuais</div>
                      )}
                      {dimensions.every(dim => dim.score >= 3) && (
                        <div className="bg-white p-2 rounded text-sm text-gray-700">• <strong>Gestão e Liderança:</strong> Seu perfil equilibrado é ideal para funções gerenciais</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estratégias de Desenvolvimento Personalizado */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Plano de Desenvolvimento Cognitivo Personalizado</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Estratégias de Curto Prazo (1-3 meses):</h4>
                    {dimensions.map((dim, idx) => {
                      if (dim.score < 3) {
                        const strategies = {
                          'Raciocínio Lógico': 'Dedique 15 minutos diários a jogos de lógica (Sudoku, quebra-cabeças). Pratique silogismos e sequências.',
                          'Raciocínio Verbal': 'Leia 30 minutos diariamente. Mantenha um diário de vocabulário com 5 palavras novas por semana.',
                          'Raciocínio Numérico': 'Pratique cálculo mental diário. Resolva 3 problemas matemáticos diferentes por dia.',
                          'Raciocínio Espacial': 'Pratique origami ou quebra-cabeças 3D. Desenhe objetos de diferentes perspectivas.'
                        }
                        return (
                          <div key={idx} className="bg-white p-3 rounded-lg">
                            <p className="text-sm"><strong>{dim.name}:</strong> {strategies[dim.name as keyof typeof strategies]}</p>
                          </div>
                        )
                      }
                      return null
                    }).filter(Boolean)}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Estratégias de Longo Prazo (3-12 meses):</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm mb-2"><strong>Desenvolvimento Integrado:</strong></p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Participe de cursos que combinem suas áreas mais fortes</li>
                        <li>• Busque projetos que desafiem suas áreas de desenvolvimento</li>
                        <li>• Considere mentoria profissional especializada</li>
                        <li>• Avalie progresso mensalmente com novos testes</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm mb-2"><strong>Metas Específicas:</strong></p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Aumentar pontuação geral em 15-20%</li>
                        <li>• Equilibrar todas as dimensões acima de 3 pontos</li>
                        <li>• Aplicar habilidades em contexto profissional real</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Considerações Psicológicas */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Considerações Psicológicas e Comportamentais</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Perfil de Personalidade Cognitiva:</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Com base no seu desempenho, você demonstra características de um perfil 
                      {overall.level.includes('Acima') ? ' analítico e estratégico' : 
                       overall.level.includes('Média') ? ' equilibrado e adaptável' : 
                       ' em desenvolvimento com grande potencial'}.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">Características Comportamentais:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {results.raciocinio_logico >= 3 && <li>• Abordagem sistemática para resolução de problemas</li>}
                          {results.raciocinio_verbal >= 3 && <li>• Boa capacidade de comunicação e expressão</li>}
                          {results.raciocinio_numerico >= 3 && <li>• Pensamento quantitativo e analítico</li>}
                          {results.raciocinio_espacial >= 3 && <li>• Capacidade de visualização e criatividade</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">Recomendações Comportamentais:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Mantenha confiança em suas capacidades</li>
                          <li>• Busque desafios graduais e progressivos</li>
                          <li>• Pratique mindfulness para melhor concentração</li>
                          <li>• Celebre pequenos progressos diários</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
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
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
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
    </>
  )
}