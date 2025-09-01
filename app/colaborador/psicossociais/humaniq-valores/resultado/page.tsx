'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Printer,
  BarChart3,
  Heart,
  Shield,
  Zap,
  Trophy,
  Users,
  Star,
  Target,
  Compass,
  Globe,
  Lock
} from 'lucide-react'

interface ValueResult {
  category: string
  score: number
}

interface ValueInfo {
  name: string
  description: string
  icon: any
  color: string
  group: string
  characteristics: string[]
  motivations: string[]
  conflicts: string[]
}

const valueInfoMap: Record<string, ValueInfo> = {
  universalismo: {
    name: "Universalismo",
    description: "Compreensão, apreço, tolerância e proteção do bem-estar de todas as pessoas e da natureza",
    icon: Globe,
    color: "bg-blue-100 text-blue-700",
    group: "Autotranscendência",
    characteristics: ["Mente aberta", "Tolerante", "Protetor da natureza", "Justo", "Sábio"],
    motivations: ["Igualdade", "Justiça social", "Proteção ambiental", "Paz mundial"],
    conflicts: ["Ambientes competitivos extremos", "Foco exclusivo em lucro", "Discriminação"]
  },
  benevolencia: {
    name: "Benevolência",
    description: "Preservação e melhoria do bem-estar das pessoas próximas no contato pessoal frequente",
    icon: Heart,
    color: "bg-blue-100 text-blue-700",
    group: "Autotranscendência",
    characteristics: ["Prestativo", "Honesto", "Perdoador", "Leal", "Responsável"],
    motivations: ["Amizade verdadeira", "Amor maduro", "Vida espiritual", "Sentido na vida"],
    conflicts: ["Ambientes individualistas", "Competição desleal", "Falta de colaboração"]
  },
  conformidade: {
    name: "Conformidade",
    description: "Restrição de ações, inclinações e impulsos que podem magoar outros e violar normas sociais",
    icon: Users,
    color: "bg-green-100 text-green-700",
    group: "Conservação",
    characteristics: ["Educado", "Obediente", "Autodisciplinado", "Honra pais e idosos"],
    motivations: ["Cortesia", "Autodisciplina", "Honrar pais e idosos", "Obediência"],
    conflicts: ["Ambientes muito liberais", "Mudanças constantes", "Falta de regras claras"]
  },
  tradicao: {
    name: "Tradição",
    description: "Respeito, compromisso e aceitação dos costumes e ideias da cultura tradicional",
    icon: Shield,
    color: "bg-green-100 text-green-700",
    group: "Conservação",
    characteristics: ["Humilde", "Devoto", "Aceita porção na vida", "Moderado"],
    motivations: ["Respeito pela tradição", "Humildade", "Devoção", "Aceitar a vida"],
    conflicts: ["Inovação radical", "Quebra de tradições", "Desrespeito aos costumes"]
  },
  seguranca: {
    name: "Segurança",
    description: "Segurança, harmonia e estabilidade da sociedade, das relações e de si mesmo",
    icon: Lock,
    color: "bg-green-100 text-green-700",
    group: "Conservação",
    characteristics: ["Segurança familiar", "Ordem social", "Limpo", "Reciprocidade de favores"],
    motivations: ["Segurança nacional", "Ordem social", "Segurança familiar", "Limpeza"],
    conflicts: ["Instabilidade", "Mudanças bruscas", "Ambientes caóticos"]
  },
  poder: {
    name: "Poder",
    description: "Status social e prestígio, controle ou domínio sobre pessoas e recursos",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700",
    group: "Autopromoção",
    characteristics: ["Autoridade", "Riqueza", "Poder social", "Preservar imagem pública"],
    motivations: ["Poder social", "Autoridade", "Riqueza", "Reconhecimento social"],
    conflicts: ["Ambientes igualitários", "Falta de hierarquia", "Limitação de autoridade"]
  },
  realizacao: {
    name: "Realização",
    description: "Sucesso pessoal através da demonstração de competência de acordo com padrões sociais",
    icon: Star,
    color: "bg-yellow-100 text-yellow-700",
    group: "Autopromoção",
    characteristics: ["Bem-sucedido", "Capaz", "Ambicioso", "Influente", "Inteligente"],
    motivations: ["Sucesso", "Capacidade", "Ambição", "Influência", "Inteligência"],
    conflicts: ["Falta de metas claras", "Ambientes sem reconhecimento", "Mediocridade"]
  },
  hedonismo: {
    name: "Hedonismo",
    description: "Prazer e gratificação sensual para si mesmo",
    icon: Zap,
    color: "bg-purple-100 text-purple-700",
    group: "Abertura à Mudança",
    characteristics: ["Prazer", "Aproveitar a vida", "Autoindulgente"],
    motivations: ["Prazer", "Aproveitar a vida", "Autoindulgência"],
    conflicts: ["Ambientes muito rígidos", "Excesso de responsabilidades", "Falta de diversão"]
  },
  estimulacao: {
    name: "Estimulação",
    description: "Excitação, novidade e desafio na vida",
    icon: Zap,
    color: "bg-purple-100 text-purple-700",
    group: "Abertura à Mudança",
    characteristics: ["Vida excitante", "Vida variada", "Ousado"],
    motivations: ["Vida excitante", "Vida variada", "Ousadia", "Novidades"],
    conflicts: ["Rotina excessiva", "Falta de desafios", "Ambientes previsíveis"]
  },
  autodeterminacao: {
    name: "Autodeterminação",
    description: "Pensamento independente e escolha de ação, criatividade, exploração",
    icon: Compass,
    color: "bg-purple-100 text-purple-700",
    group: "Abertura à Mudança",
    characteristics: ["Criatividade", "Liberdade", "Independente", "Curioso", "Escolher objetivos"],
    motivations: ["Criatividade", "Liberdade", "Independência", "Curiosidade", "Autorespeto"],
    conflicts: ["Microgerenciamento", "Falta de autonomia", "Ambientes controladores"]
  }
}

const groupColors = {
  "Autotranscendência": "from-blue-500 to-cyan-500",
  "Autopromoção": "from-yellow-500 to-orange-500",
  "Abertura à Mudança": "from-purple-500 to-pink-500",
  "Conservação": "from-green-500 to-emerald-500"
}

export default function HumaniqValoresResultado() {
  const router = useRouter()
  const [results, setResults] = useState<ValueResult[]>([])
  const [loading, setLoading] = useState(true)
  const [dominantValues, setDominantValues] = useState<ValueResult[]>([])
  const [profileText, setProfileText] = useState('')
  const [professionalAnalysis, setProfessionalAnalysis] = useState('')

  useEffect(() => {
    // Carregar resultados do localStorage
    const savedResults = localStorage.getItem('humaniq-valores-results')
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      setResults(parsedResults)
      
      // Identificar valores dominantes (top 3)
      const sortedResults = [...parsedResults].sort((a, b) => b.score - a.score)
      const topValues = sortedResults.slice(0, 3)
      setDominantValues(topValues)
      
      // Gerar perfil textual
      generateProfileText(topValues)
    }
    setLoading(false)
  }, [])

  const generateProfileText = (topValues: ValueResult[]) => {
    if (topValues.length === 0) return
    
    const primaryValue = valueInfoMap[topValues[0].category]
    const secondaryValue = valueInfoMap[topValues[1]?.category]
    
    let text = `Você valoriza principalmente ${primaryValue.name.toLowerCase()}, `
    text += `se motivando por ${primaryValue.motivations.slice(0, 2).join(' e ').toLowerCase()}. `
    
    if (secondaryValue) {
      text += `Também demonstra forte orientação para ${secondaryValue.name.toLowerCase()}, `
      text += `buscando ${secondaryValue.motivations[0].toLowerCase()}. `
    }
    
    text += `Pode ter conflitos com ambientes que apresentam ${primaryValue.conflicts[0].toLowerCase()} `
    text += `ou ${primaryValue.conflicts[1]?.toLowerCase()}. `
    
    text += `Seu perfil sugere que você se adapta melhor a contextos que valorizam `
    text += `${primaryValue.group.toLowerCase()} e oferecem oportunidades para expressar `
    text += `${primaryValue.characteristics.slice(0, 2).join(' e ').toLowerCase()}.`
    
    setProfileText(text)
    
    // Gerar análise profissional
    const analysisText = `Com base nos seus valores dominantes, você demonstra um perfil profissional que valoriza ${primaryValue.name.toLowerCase()} acima de tudo. Isso indica que você se sente mais motivado(a) em ambientes que promovem ${primaryValue.characteristics[0].toLowerCase()}. Seus outros valores importantes (${dominantValues.slice(1, 3).map(v => valueInfoMap[v.category].name.toLowerCase()).join(' e ')}) complementam essa orientação, sugerindo que você busca equilibrio entre diferentes aspectos da vida profissional.`
    
    setProfessionalAnalysis(analysisText)
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500'
    if (score >= 4.0) return 'bg-blue-500'
    if (score >= 3.5) return 'bg-yellow-500'
    if (score >= 3.0) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Muito Alto'
    if (score >= 4.0) return 'Alto'
    if (score >= 3.5) return 'Moderado'
    if (score >= 3.0) return 'Baixo'
    return 'Muito Baixo'
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implementar download do PDF
    console.log('Download PDF')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus resultados...</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Nenhum resultado encontrado</CardTitle>
            <CardDescription>
              Faça o teste primeiro para ver seus resultados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/colaborador/psicossociais/humaniq-valores/introducao')}
              className="w-full"
            >
              Fazer Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div id="valores-results" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/colaborador/personalidade')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Testes
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seus Resultados - HumaniQ Valores
            </h1>
            <p className="text-gray-600">
              Análise completa dos seus valores fundamentais
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Valores */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Gráfico de Valores
                </CardTitle>
                <CardDescription>
                  Seus 10 valores fundamentais ordenados por intensidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results
                    .sort((a, b) => b.score - a.score)
                    .map((result, index) => {
                      const valueInfo = valueInfoMap[result.category]
                      const IconComponent = valueInfo.icon
                      return (
                        <div key={result.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${valueInfo.color}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">
                                  {valueInfo.name}
                                </span>
                                <Badge 
                                  variant="secondary" 
                                  className="ml-2 text-xs"
                                >
                                  {valueInfo.group}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">
                                {result.score.toFixed(1)}
                              </span>
                              <Badge 
                                className={`text-white ${getScoreColor(result.score)}`}
                              >
                                {getScoreLabel(result.score)}
                              </Badge>
                            </div>
                          </div>
                          <Progress 
                            value={(result.score / 5) * 100} 
                            className="h-2"
                          />
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Perfil e Valores Dominantes */}
          <div className="space-y-6">
            {/* Perfil Textual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Seu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {profileText}
                </p>
              </CardContent>
            </Card>

            {/* Valores Dominantes */}
            <Card>
              <CardHeader>
                <CardTitle>Valores Dominantes</CardTitle>
                <CardDescription>
                  Seus 3 valores mais importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dominantValues.map((value, index) => {
                    const valueInfo = valueInfoMap[value.category]
                    const IconComponent = valueInfo.icon
                    return (
                      <div key={value.category} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${valueInfo.color}`}>
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <span className="font-medium text-sm">
                            {index + 1}º {valueInfo.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {valueInfo.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {valueInfo.characteristics.slice(0, 3).map((char, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Análise Profissional Detalhada */}
            <Card>
              <CardHeader>
                <CardTitle>Análise Profissional Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  {professionalAnalysis}
                </p>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}