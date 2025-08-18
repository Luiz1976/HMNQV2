'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Brain, Users, Building2, Target, Clock, Eye, Zap, Shield, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function QIIntroducaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartTest = async () => {
    setIsLoading(true)
    // Simular carregamento
    setTimeout(() => {
      router.push('/colaborador/personalidade/qi')
    }, 1000)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-white hover:bg-emerald-800/50 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Badge variant="secondary" className="bg-emerald-700/50 text-emerald-100 border-emerald-600">
          Teste de Personalidade
        </Badge>
      </div>

      <div className="container mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-600/30 rounded-full">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            HumaniQ QI
          </h1>
          
          <p className="text-xl text-emerald-200 mb-6">
            Teste de Atenção e Raciocínio
          </p>
          
          <p className="text-emerald-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Avaliação científica de atenção e raciocínio com base fundamentada em pesquisa empírica e insights
            avançados.
          </p>

          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="bg-emerald-700/30 text-emerald-100 border-emerald-500 px-4 py-2">
              Ciência Comportamental
            </Badge>
            <Badge variant="outline" className="bg-emerald-700/30 text-emerald-100 border-emerald-500 px-4 py-2">
              Avaliação Cognitiva
            </Badge>
            <Badge variant="outline" className="bg-emerald-700/30 text-emerald-100 border-emerald-500 px-4 py-2">
              Metodologia de Processamento
            </Badge>
            <Badge variant="outline" className="bg-emerald-700/30 text-emerald-100 border-emerald-500 px-4 py-2">
              Controle Inibitório
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-emerald-600/30 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">50.000+</div>
            <div className="text-emerald-200 text-sm">Pessoas Avaliadas</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-emerald-600/30 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-emerald-200 text-sm">Empresas Parceiras</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-emerald-600/30 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">95%</div>
            <div className="text-emerald-200 text-sm">Precisão Diagnóstica</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-emerald-600/30 rounded-full">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">25 min</div>
            <div className="text-emerald-200 text-sm">Duração</div>
          </div>
        </div>

        {/* Dimensions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-emerald-500 rounded-full">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Atenção Sustentada</h3>
            <p className="text-emerald-200 text-sm">
              Avaliação da capacidade de manter foco prolongado
            </p>
            <div className="text-emerald-300 text-xs mt-2">25 min</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-500 rounded-full">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Velocidade de Processamento</h3>
            <p className="text-emerald-200 text-sm">
              Análise da rapidez de processamento cognitivo
            </p>
            <div className="text-emerald-300 text-xs mt-2">25 min</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-500 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Controle Inibitório</h3>
            <p className="text-emerald-200 text-sm">
              Medição da capacidade de controle cognitivo inibitório
            </p>
            <div className="text-emerald-300 text-xs mt-2">25 min</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-500 rounded-full">
                <Shuffle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Flexibilidade Cognitiva</h3>
            <p className="text-emerald-200 text-sm">
              Medição da adaptabilidade mental e flexibilidade de atenção
            </p>
            <div className="text-emerald-300 text-xs mt-2">25 min</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Dimensions Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Dimensões Avaliadas
            </h2>
            <p className="text-emerald-200 text-center mb-8">
              Análise multidimensional das capacidades cognitivas com metodologia científica avançada
            </p>
            
            <div className="space-y-4">
              <Card className="bg-emerald-800/30 border-emerald-600 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Atenção Sustentada</h3>
                    <p className="text-emerald-200 text-sm">
                      Avaliação da capacidade de manter foco prolongado
                    </p>
                    <div className="text-emerald-300 text-xs mt-1">Concentração</div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-emerald-800/30 border-emerald-600 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Velocidade de Processamento</h3>
                    <p className="text-emerald-200 text-sm">
                      Análise da rapidez de processamento cognitivo
                    </p>
                    <div className="text-emerald-300 text-xs mt-1">Agilidade mental</div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-emerald-800/30 border-emerald-600 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Controle Inibitório</h3>
                    <p className="text-emerald-200 text-sm">
                      Medição da capacidade de controle cognitivo inibitório
                    </p>
                    <div className="text-emerald-300 text-xs mt-1">Autocontrole</div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-emerald-800/30 border-emerald-600 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Shuffle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Flexibilidade Cognitiva</h3>
                    <p className="text-emerald-200 text-sm">
                      Medição da adaptabilidade mental e flexibilidade de atenção
                    </p>
                    <div className="text-emerald-300 text-xs mt-1">Adaptabilidade</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Scientific Content */}
          <div className="flex flex-col">
            <div className="flex-1">
              <Card className="bg-emerald-800/30 border-emerald-600 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  Conteúdo Científico
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      O que é o HumaniQ QI?
                    </h3>
                    <p className="text-emerald-200 text-sm leading-relaxed">
                      O Teste de Atenção e Raciocínio QI é um instrumento
                      psicométrico desenvolvido para avaliar capacidades cognitivas
                      fundamentais relacionadas à atenção sustentada e ao controle
                      inibitório.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Base Científica
                    </h3>
                    <p className="text-emerald-200 text-sm leading-relaxed">
                      Desenvolvido com base em décadas de pesquisa em psicologia
                      cognitiva e neurociência, o teste utiliza metodologias
                      validadas cientificamente para mensurar com precisão as
                      capacidades de atenção e raciocínio.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Dimensões Avaliadas
                    </h3>
                    <p className="text-emerald-200 text-sm leading-relaxed">
                      Cada uma das quatro dimensões é avaliada utilizando tarefas
                      específicas que permitem uma análise detalhada e precisa das
                      capacidades cognitivas individuais.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* QI Logo */}
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white/20 mb-2">
                  <Brain className="h-24 w-24 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-white/60">QI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Test Button */}
        <div className="text-center">
          <Button
            onClick={handleStartTest}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            {isLoading ? 'Carregando...' : 'Iniciar Teste'}
          </Button>
        </div>
      </div>
    </div>
  )
}