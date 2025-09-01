'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Download, Share2, RotateCcw, Home, Printer, Star, TrendingUp, Target, Heart, Brain, Zap, Award, BookOpen, Users, Lightbulb, User, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EnhancedStaticHDMandala from '@/components/EnhancedStaticHDMandala'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import SubtypeDetails from '@/components/SubtypeDetails'
import CompatibilityAnalysis from '@/components/CompatibilityAnalysis'
import DevelopmentRecommendations from '@/components/DevelopmentRecommendations'
import { EnneagramSubtype, getSubtypeByCode } from '@/data/enneagram-subtypes'

interface EnneagramResult {
  id: string
  userId: string
  testId: string
  responses: any[]
  scores: Record<string, number>
  metadata: {
    dominantType: {
      type: number
      percentage: number
    }
    dominantInstinct: 'sp' | 'so' | 'sx'
    types: Array<{
      type: number
      percentage: number
      description: string
      characteristics: string[]
      strengths: string[]
      challenges: string[]
      motivation: string
      fear: string
    }>
    instincts?: Array<{
      instinct: 'sp' | 'so' | 'sx'
      percentage: number
      description: string
    }>
  }
  createdAt: string
  updatedAt: string
}



interface EnneagramType {
  id: number
  type: number
  name: string
  description: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
  motivation: string
  fear: string
  color: string
}

const enneagramTypes: EnneagramType[] = [
  {
    id: 1,
    type: 1,
    name: "O Perfeccionista",
    description: "Pessoas do Tipo 1 são racionais, idealistas e têm fortes princípios. São éticos, conscienciosos e têm um senso claro do certo e errado. São professores e cruzados, sempre se esforçando para melhorar as coisas, mas com medo de cometer erros. Bem organizados, ordenados e meticulosos, eles tentam manter altos padrões, mas podem se tornar críticos e perfeccionistas.",
    characteristics: [
      "Orientados por princípios e valores éticos",
      "Busca constante pela perfeição e melhoria",
      "Senso aguçado de responsabilidade",
      "Tendência a ser crítico consigo mesmo e com outros",
      "Organização e metodologia em suas ações"
    ],
    strengths: [
      "Integridade e honestidade inabaláveis",
      "Capacidade de ver o que precisa ser melhorado",
      "Disciplina e autocontrole excepcionais",
      "Senso de justiça e equidade",
      "Habilidade para criar ordem e estrutura"
    ],
    challenges: [
      "Tendência ao perfeccionismo excessivo",
      "Dificuldade em aceitar imperfeições",
      "Crítica interna constante",
      "Rigidez em pensamentos e comportamentos",
      "Dificuldade em relaxar e se divertir"
    ],
    motivation: "Ser bom, correto, perfeito e melhorar tudo ao seu redor",
    fear: "Ser corrupto, defeituoso ou errado",
    color: "#FF6B6B"
  },
  // ... outros tipos seriam adicionados aqui
]

export default function EnneagramResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resultId = searchParams.get('id')
  
  const [result, setResult] = useState<EnneagramResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!resultId) {
      setError('ID do resultado não fornecido')
      setLoading(false)
      return
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/test-results/${resultId}`)
        if (!response.ok) {
          throw new Error('Resultado não encontrado')
        }
        const json = await response.json()
 
        if (json?.success) {
          let resultData: any = json.data

          // Normalizar formato legado se não houver campos esperados
          if (resultData?.metadata && !('dominantType' in resultData.metadata)) {
            const legacy = (resultData.metadata as any).results
            if (legacy) {
              const ranked = legacy.rankedTypes ?? []

              resultData.metadata = {
                dominantType: {
                  type: parseInt((legacy.dominantType?.match(/\d+/) || ['0'])[0]),
                  percentage: legacy.dominantTypePercentage ?? 0
                },
                dominantInstinct: legacy.dominantInstinct ?? 'sp',
                types: ranked.map((rt: any) => ({
                  type: parseInt(rt.type.replace('type', '')),
                  percentage: rt.percentage,
                  description: '',
                  characteristics: [],
                  strengths: [],
                  challenges: [],
                  motivation: '',
                  fear: ''
                }))
              }
            }
          }

          setResult(resultData)
        } else {
          throw new Error(json?.error || 'Resultado não encontrado')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar resultado')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [resultId])

  const getDominantType = () => {
    if (!result?.metadata?.dominantType) return null
    const found = enneagramTypes.find(type => type.id === result.metadata?.dominantType?.type)
    return found
  }

  // Função utilitária para formatar a data do teste
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-white text-lg font-medium">Revelando sua personalidade...</p>
          <p className="text-purple-200 text-sm mt-2">Preparando insights únicos para você</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-white text-lg mb-4">{error || 'Resultado não encontrado'}</p>
          <Button onClick={() => router.back()} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const dominantType = getDominantType()
  // Obter subtipo dominante (ex.: 3sp)
  const dominantSubtype = result?.metadata ? getSubtypeByCode(`${result.metadata.dominantType.type}${result.metadata.dominantInstinct}`) : null

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <button
            onClick={() => router.back()}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl backdrop-blur-lg border border-gray-300 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex gap-3">
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 backdrop-blur-lg">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 backdrop-blur-lg">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
          {/* Logo e informações */}
          <div className="flex flex-col items-center mb-10">
            <Image src="/humaniq-logo.svg" alt="HumaniQ AI" width={180} height={40} priority />
            <div className="mt-2 text-purple-100 text-sm font-medium text-center">
               Análise de Personalidade • {formatDate(result.createdAt)}
             </div>
          </div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Star className="w-4 h-4" />
              Análise Completa de Personalidade
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Seu Perfil
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                {dominantType?.name || 'Eneagrama'}
              </span>
            </h1>
            
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              {dominantType?.description || 'Descobrindo os aspectos únicos da sua personalidade através do Eneagrama.'}
            </p>

            <div className="text-center">
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                Tipo {result.metadata?.dominantType?.type || 'N/A'} - {result.metadata?.dominantType?.percentage || 0}% de correspondência
              </Badge>
            </div>

            <div className="text-center">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-lg px-6 py-2 mt-4">
                Instinto {result.metadata?.dominantInstinct?.toUpperCase() || 'N/A'}
              </Badge>
            </div>
            {dominantSubtype && (
              <div className="text-center">
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2 mt-4">
                  {dominantSubtype.name} • {dominantSubtype.instinctName}
                </Badge>
                <p className="text-purple-200 text-sm mt-2 max-w-xl mx-auto">
                  {`${dominantSubtype.description} Este é o subtipo ${dominantSubtype.instinct.toUpperCase()} (Autopreservação) do Instinto ${dominantSubtype.instinct.toUpperCase()}.`}
                </p>
              </div>
            )}

            <div className="text-center">
              
            </div>
          </div>

          {/* Mandala Visualization */}
          <div className="flex justify-center mb-0">
            <div className="relative w-full max-w-4xl">
              <EnhancedStaticHDMandala
                dominantType={result.metadata?.dominantType?.type || 1}
                dominantInstinct={result.metadata?.dominantInstinct || 'sp'}
                typeScores={result.metadata?.types?.map(t => t.percentage) || []}
                percentageScores={result.metadata?.types?.reduce((acc, type) => {
                  acc[`type${type.type}`] = type.percentage
                  return acc
                }, {} as Record<string, number>) || {}}
                className="w-full max-w-3xl mx-auto"
              />
            </div>
          </div>

          {/* Análise Profunda e Profissional */}
          {dominantType && (
            <div className="mt-24 max-w-5xl mx-auto text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Análise Profunda do Seu Perfil</h2>
              <p className="text-lg md:text-xl text-purple-100 leading-relaxed max-w-3xl mx-auto">
                {`Como um(a) ${dominantType.name}, você tende a apresentar características centrais como ${dominantType.characteristics?.[0] || 'foco, disciplina e busca de excelência'}. `}
                {dominantSubtype ? `No subtipo ${dominantSubtype.name}, essas qualidades se manifestam principalmente através do instinto de ${dominantSubtype.instinctName.toLowerCase()}, evidenciando uma motivação forte para ${dominantType.motivation || 'garantir segurança pessoal e bem-estar'}. ` : ''}
                Sua combinação única de tipo e instinto sugere um estilo de tomada de decisão que equilibra suas necessidades internas com as demandas do ambiente, demonstrando ${Array.isArray(dominantType.strengths) ? dominantType.strengths[0] : dominantType.strengths || 'responsabilidade, consistência e atenção aos detalhes'}. Ao mesmo tempo, é comum observar desafios relacionados a ${Array.isArray(dominantType.challenges) ? dominantType.challenges[0] : dominantType.challenges || 'perfeccionismo e autocrítica'}. Reconhecer essas tendências permitirá que você desenvolva estratégias de crescimento focadas em ${dominantType.motivation || 'aceitação de imperfeições, flexibilidade e autocompaixão'}. Essa compreensão aprofunda sua jornada de autoconhecimento e potencializa seu sucesso em contextos pessoais e profissionais.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content sections would continue here */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Análise Detalhada</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
              Explore os aspectos fundamentais da sua personalidade e descubra como aplicar esses insights em sua vida pessoal e profissional.
            </p>
          </div>

          {/* Lista de Tipos e Percentuais */}
          {result?.metadata?.types && result.metadata.types.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8 space-y-6">
              {result.metadata.types.map((type) => {
                const typeInfo = enneagramTypes.find(t => t.type === type.type)
                const isDominant = type.type === result.metadata.dominantType.type
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDominant ? 'text-purple-700' : 'text-gray-700'}`}>Tipo {type.type}{typeInfo?.name ? ` - ${typeInfo.name}` : ''}</span>
                      <span className={`font-bold ${isDominant ? 'text-purple-700' : 'text-gray-700'}`}>{type.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`${isDominant ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-gray-300 to-gray-500'} h-full rounded-full`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Análise de Subtipo */}
          {result?.metadata?.dominantType && (
            <div className="mt-20 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Análise de Subtipo</h3>
              <SubtypeDetails
                dominantType={result.metadata.dominantType.type}
                dominantInstinct={result.metadata.dominantInstinct}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}