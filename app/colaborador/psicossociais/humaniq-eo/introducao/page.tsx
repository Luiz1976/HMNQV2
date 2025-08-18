'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Target, Brain, Heart, Shield, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumaniQEOIntroduction() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/colaborador/psicossociais')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">HumaniQ EO</h1>
          <p className="text-xl text-blue-200 mb-2">Estresse Ocupacional, Burnout e Resiliência</p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Avaliação científica de última geração para mensurar capacidades cognitivas fundamentais com precisão excepcional e insights avançados.
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Atenção Sustentada</Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Flexibilidade Cognitiva</Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Velocidade de Processamento</Badge>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Controle Inibitório</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">50.000+</div>
            <div className="text-sm text-gray-400">Pessoas avaliadas</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-gray-400">Empresas</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-gray-400">Precisão científica</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-400" />
            <div className="text-2xl font-bold">18 min</div>
            <div className="text-sm text-gray-400">Duração</div>
          </div>
        </div>

        {/* Colored Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 text-center">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-300 mb-1">Resiliência</div>
            <div className="text-xs text-gray-400">Avaliação em 15-20 minutos</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-blue-300 mb-1">95% precisão</div>
            <div className="text-xs text-gray-400">Alta confiabilidade científica</div>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-purple-300 mb-1">α &gt; 0,85</div>
            <div className="text-xs text-gray-400">Índice de confiabilidade</div>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 text-center">
            <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-orange-300 mb-1">100+ estudos</div>
            <div className="text-xs text-gray-400">Validação científica</div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2">Dimensões Avaliadas</h2>
          <p className="text-gray-400 text-center mb-8">Análise multidimensional das capacidades cognitivas com metodologia científica avançada</p>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-300 mb-1">Atenção Sustentada</h3>
                  <p className="text-sm text-gray-400">Análise precisa da capacidade de manter foco prolongado</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-green-500/20 text-green-300 text-xs">Concentração contínua</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-300 mb-1">Velocidade de Processamento</h3>
                  <p className="text-sm text-gray-400">Análise da rapidez de processamento cognitivo</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">Processamento rápido</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-300 mb-1">Controle Inibitório</h3>
                  <p className="text-sm text-gray-400">Avaliação da capacidade de controlar impulsos inadequados</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-purple-500/20 text-purple-300 text-xs">Autocontrole cognitivo</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-300 mb-1">Flexibilidade Cognitiva</h3>
                  <p className="text-sm text-gray-400">Capacidade de adaptação e mudança de estratégias de raciocínio</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-orange-500/20 text-orange-300 text-xs">Adaptabilidade mental</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side circle with logo */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-2 text-red-400" />
                <div className="text-lg font-bold">EO</div>
                <div className="w-16 h-1 bg-white/30 mx-auto mt-2 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              Conteúdo Científico
            </h3>
            <div className="space-y-3">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="font-medium text-blue-300">Conceito de Burnout (Maslach)</span>
                </div>
                <p className="text-sm text-gray-400">Base científica para avaliação de esgotamento</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="font-medium text-green-300">Teoria da Resiliência</span>
                </div>
                <p className="text-sm text-gray-400">Metodologia Connor & Davidson</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="font-medium text-purple-300">Diretrizes ISO 45003</span>
                </div>
                <p className="text-sm text-gray-400">Padrões internacionais de saúde mental</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              O que é o HumaniQ EO?
            </h3>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                O Teste de Estresse e Resiliência (EOR) é um instrumento psicométrico desenvolvido para avaliar as capacidades cognitivas fundamentais relacionadas à atenção sustentada e ao controle inibitório.
              </p>
              <p className="text-gray-300 mb-4">
                Baseado em décadas de pesquisa em psicologia cognitiva, o TAR mensura a capacidade de manter a atenção em tarefas específicas e a habilidade de inibir respostas inadequadas.
              </p>
              <p className="text-gray-300">
                Este teste é amplamente utilizado em contextos organizacionais para identificar profissionais com alta capacidade de concentração e resistência cognitiva.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/colaborador/psicossociais/humaniq-eo')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
          >
            Iniciar Teste
          </Button>
        </div>
      </div>
    </div>
  )
}