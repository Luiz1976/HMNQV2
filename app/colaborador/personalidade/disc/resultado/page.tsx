'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Share2, BarChart3, Target, Users, Shield, CheckCircle } from 'lucide-react'

interface DISCResults {
  D: number // Dominância
  I: number // Influência
  S: number // Estabilidade
  C: number // Conformidade
  profile: string // Perfil predominante (ex: "DI", "SC", "C puro")
  secondary?: string // Perfil secundário se aplicável
}

interface Dimension {
  name: string
  key: keyof Omit<DISCResults, 'profile' | 'secondary'>
  score: number
  color: string
  icon: React.ComponentType<any>
  description: string
  interpretation: string
  workStyle: string
  communication: string
  idealEnvironment: string
}

export default function DISCResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<DISCResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recuperar resultados do localStorage
    const savedResults = localStorage.getItem('discTestResults')
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // Se não há resultados, redirecionar para o teste
      router.push('/colaborador/personalidade/disc')
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
          <Button onClick={() => router.push('/colaborador/personalidade/disc')}>
            Fazer Teste
          </Button>
        </div>
      </div>
    )
  }

  const dimensions: Dimension[] = [
    {
      name: 'Dominância',
      key: 'D',
      score: results.D,
      color: 'bg-red-500',
      icon: Target,
      description: 'Orientação para resultados, assertividade e tomada de decisões rápidas',
      interpretation: results.D >= 80 ? 'Muito Alto - Líder natural, decisivo e orientado para resultados' : 
                     results.D >= 60 ? 'Alto - Assertivo, gosta de desafios e assume responsabilidades' : 
                     results.D >= 40 ? 'Moderado - Equilibrado entre liderança e colaboração' :
                     'Baixo - Prefere seguir orientações e evita confrontos',
      workStyle: results.D >= 60 ? 'Assume liderança, toma decisões rápidas, foca em resultados' : 'Colaborativo, busca consenso, evita conflitos',
      communication: results.D >= 60 ? 'Direto, objetivo, vai direto ao ponto' : 'Diplomático, cuidadoso, busca harmonia',
      idealEnvironment: results.D >= 60 ? 'Ambientes desafiadores, com autonomia e metas claras' : 'Ambientes estáveis, com diretrizes claras e suporte'
    },
    {
      name: 'Influência',
      key: 'I',
      score: results.I,
      color: 'bg-yellow-500',
      icon: Users,
      description: 'Habilidades sociais, entusiasmo e capacidade de influenciar pessoas',
      interpretation: results.I >= 80 ? 'Muito Alto - Extremamente sociável, carismático e persuasivo' : 
                     results.I >= 60 ? 'Alto - Comunicativo, otimista e bom em relacionamentos' : 
                     results.I >= 40 ? 'Moderado - Equilibrado entre interação social e trabalho individual' :
                     'Baixo - Prefere trabalhar sozinho, mais reservado socialmente',
      workStyle: results.I >= 60 ? 'Trabalha bem em equipe, motiva outros, gera ideias criativas' : 'Prefere tarefas individuais, foco na qualidade',
      communication: results.I >= 60 ? 'Expressivo, entusiástico, usa histórias e exemplos' : 'Conciso, factual, prefere comunicação escrita',
      idealEnvironment: results.I >= 60 ? 'Ambientes sociais, dinâmicos, com interação frequente' : 'Ambientes calmos, com pouca pressão social'
    },
    {
      name: 'Estabilidade',
      key: 'S',
      score: results.S,
      color: 'bg-green-500',
      icon: Shield,
      description: 'Paciência, lealdade e preferência por estabilidade e rotina',
      interpretation: results.S >= 80 ? 'Muito Alto - Extremamente paciente, leal e resistente a mudanças' : 
                     results.S >= 60 ? 'Alto - Confiável, paciente e prefere estabilidade' : 
                     results.S >= 40 ? 'Moderado - Equilibrado entre estabilidade e adaptação' :
                     'Baixo - Gosta de mudanças, impaciente com rotina',
      workStyle: results.S >= 60 ? 'Consistente, confiável, trabalha bem em equipes estáveis' : 'Adaptável, gosta de variedade, aceita mudanças facilmente',
      communication: results.S >= 60 ? 'Calmo, paciente, ouve atentamente antes de responder' : 'Rápido, direto, gosta de novidades',
      idealEnvironment: results.S >= 60 ? 'Ambientes previsíveis, com rotinas estabelecidas e segurança' : 'Ambientes dinâmicos, com mudanças e novos desafios'
    },
    {
      name: 'Conformidade',
      key: 'C',
      score: results.C,
      color: 'bg-blue-500',
      icon: CheckCircle,
      description: 'Atenção aos detalhes, precisão e seguimento de padrões e procedimentos',
      interpretation: results.C >= 80 ? 'Muito Alto - Extremamente detalhista, preciso e sistemático' : 
                     results.C >= 60 ? 'Alto - Organizado, segue procedimentos, atento à qualidade' : 
                     results.C >= 40 ? 'Moderado - Equilibrado entre precisão e flexibilidade' :
                     'Baixo - Flexível, prefere visão geral a detalhes',
      workStyle: results.C >= 60 ? 'Metódico, preciso, segue procedimentos rigorosamente' : 'Flexível, foca no panorama geral, aceita imperfeições',
      communication: results.C >= 60 ? 'Preciso, detalhado, baseado em fatos e dados' : 'Geral, conceitual, foca nas ideias principais',
      idealEnvironment: results.C >= 60 ? 'Ambientes estruturados, com regras claras e padrões definidos' : 'Ambientes flexíveis, com liberdade criativa'
    }
  ]

  const getProfileInterpretation = (profile: string) => {
    const profiles: Record<string, { name: string, description: string, leadership: string, recommendation: string }> = {
      'D': {
        name: 'Dominante Puro',
        description: 'Líder nato, orientado para resultados, decisivo e assertivo',
        leadership: 'Estilo de liderança direta, focada em resultados e eficiência',
        recommendation: 'Desenvolva habilidades de escuta ativa e empatia para melhorar relacionamentos'
      },
      'I': {
        name: 'Influenciador Puro',
        description: 'Comunicador natural, entusiástico, sociável e persuasivo',
        leadership: 'Estilo de liderança inspiracional, motiva através do carisma',
        recommendation: 'Foque em desenvolver habilidades de organização e atenção aos detalhes'
      },
      'S': {
        name: 'Estável Puro',
        description: 'Confiável, paciente, leal e orientado para o trabalho em equipe',
        leadership: 'Estilo de liderança colaborativa, constrói consenso e harmonia',
        recommendation: 'Desenvolva assertividade e confiança para tomar decisões mais rápidas'
      },
      'C': {
        name: 'Conformista Puro',
        description: 'Analítico, preciso, sistemático e orientado para a qualidade',
        leadership: 'Estilo de liderança técnica, baseada em competência e precisão',
        recommendation: 'Trabalhe flexibilidade e habilidades interpessoais'
      },
      'DI': {
        name: 'Dominante-Influenciador',
        description: 'Líder carismático, combina assertividade com habilidades sociais',
        leadership: 'Liderança inspiracional e diretiva, motiva e direciona equipes',
        recommendation: 'Balance a velocidade das decisões com a consideração pelos outros'
      },
      'DC': {
        name: 'Dominante-Conformista',
        description: 'Líder técnico, combina orientação para resultados com precisão',
        leadership: 'Liderança baseada em competência, foca em padrões elevados',
        recommendation: 'Desenvolva habilidades interpessoais e flexibilidade'
      },
      'IS': {
        name: 'Influenciador-Estável',
        description: 'Comunicador empático, combina sociabilidade com lealdade',
        leadership: 'Liderança colaborativa e inspiracional, constrói relacionamentos',
        recommendation: 'Desenvolva assertividade e foco em resultados'
      },
      'IC': {
        name: 'Influenciador-Conformista',
        description: 'Comunicador preciso, combina sociabilidade com atenção aos detalhes',
        leadership: 'Liderança técnica e inspiracional, comunica com precisão',
        recommendation: 'Balance a atenção aos detalhes com a visão do panorama geral'
      },
      'SC': {
        name: 'Estável-Conformista',
        description: 'Especialista confiável, combina estabilidade com precisão',
        leadership: 'Liderança técnica e colaborativa, constrói processos sólidos',
        recommendation: 'Desenvolva assertividade e habilidades de comunicação'
      }
    }
    
    return profiles[profile] || {
      name: 'Perfil Misto',
      description: 'Combinação equilibrada de características comportamentais',
      leadership: 'Estilo de liderança adaptativo, ajusta-se às situações',
      recommendation: 'Continue desenvolvendo suas forças naturais'
    }
  }

  const profileInfo = getProfileInterpretation(results.profile)

  const handleDownload = () => {
    console.log('Download do relatório DISC')
  }

  const handleShare = () => {
    console.log('Compartilhar resultados DISC')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/colaborador/personalidade')}
              className="text-white hover:bg-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Resultados do Teste DISC</h1>
            <p className="text-purple-100 text-lg">Análise do seu perfil comportamental profissional</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Perfil Principal */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Seu Perfil DISC</CardTitle>
            <div className="text-6xl font-bold text-purple-600 mb-2">
              {results.profile}
            </div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              {profileInfo.name}
            </div>
            <p className="text-gray-600 mb-4">{profileInfo.description}</p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Estilo de Liderança:</strong> {profileInfo.leadership}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Dimensões DISC */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {dimensions.map((dimension, index) => {
            const IconComponent = dimension.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {dimension.name} ({dimension.key})
                  </CardTitle>
                  <p className="text-sm text-gray-600">{dimension.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{dimension.score}</span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <Progress 
                      value={dimension.score} 
                      className="h-3"
                    />
                    <p className="text-sm text-gray-700 font-medium">{dimension.interpretation}</p>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><strong>Estilo de Trabalho:</strong> {dimension.workStyle}</p>
                      <p><strong>Comunicação:</strong> {dimension.communication}</p>
                      <p><strong>Ambiente Ideal:</strong> {dimension.idealEnvironment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recomendações de Desenvolvimento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Recomendações de Desenvolvimento</CardTitle>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Desenvolvimento Principal:</h4>
                <p className="text-purple-700 text-sm">{profileInfo.recommendation}</p>
              </div>
              
              {results.D < 40 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Desenvolver Dominância:</h4>
                  <p className="text-red-700 text-sm">Pratique tomar decisões mais rápidas, assuma mais responsabilidades e desenvolva assertividade.</p>
                </div>
              )}
              
              {results.I < 40 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Desenvolver Influência:</h4>
                  <p className="text-yellow-700 text-sm">Trabalhe habilidades de comunicação, networking e apresentações públicas.</p>
                </div>
              )}
              
              {results.S < 40 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Desenvolver Estabilidade:</h4>
                  <p className="text-green-700 text-sm">Pratique paciência, trabalho em equipe e construção de relacionamentos duradouros.</p>
                </div>
              )}
              
              {results.C < 40 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Desenvolver Conformidade:</h4>
                  <p className="text-blue-700 text-sm">Melhore atenção aos detalhes, organização e seguimento de procedimentos.</p>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Fundamentação Científica */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Fundamentação Científica</CardTitle>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Base Teórica:</h4>
                <p className="text-gray-700 text-sm mb-2">
                  O teste DISC é baseado na teoria de William Moulton Marston (1928), que identificou 
                  quatro dimensões comportamentais fundamentais:
                </p>
                <ul className="text-gray-700 text-sm space-y-1 ml-4">
                  <li>• <strong>Dominância (D):</strong> Como você responde a problemas e desafios</li>
                  <li>• <strong>Influência (I):</strong> Como você influencia e se relaciona com pessoas</li>
                  <li>• <strong>Estabilidade (S):</strong> Como você responde ao ritmo e mudanças</li>
                  <li>• <strong>Conformidade (C):</strong> Como você responde a regras e procedimentos</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Aplicação Profissional:</h4>
                <p className="text-blue-700 text-sm">
                  O DISC é amplamente utilizado em contextos organizacionais para desenvolvimento de liderança, 
                  formação de equipes, comunicação eficaz e seleção de pessoal. É uma das ferramentas de 
                  avaliação comportamental mais utilizadas no mundo corporativo.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Importante:</h4>
                <p className="text-yellow-700 text-sm">
                  Este perfil representa suas tendências comportamentais naturais. Lembre-se de que todos 
                  possuem características de todas as dimensões, e o comportamento pode variar conforme 
                  o contexto e situação.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownload} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Baixar Relatório
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/personalidade/disc')}
          >
            Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  )
}