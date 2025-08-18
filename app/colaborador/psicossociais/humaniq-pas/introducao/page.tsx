'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Clock, Users, AlertTriangle, FileText, CheckCircle, ArrowLeft, ArrowRight, Target, BookOpen, TrendingUp, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function HumaniQPASIntroducaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-red-400 mr-4" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                HumaniQ PAS
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Percepção de Assédio Moral e Sexual
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-red-400 mb-2">48</div>
            <div className="text-gray-300 text-sm">Questões</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-orange-400 mb-2">5</div>
            <div className="text-gray-300 text-sm">Dimensões</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">95%</div>
            <div className="text-gray-300 text-sm">Precisão</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-green-400 mb-2">18 min</div>
            <div className="text-gray-300 text-sm">Duração</div>
          </div>
        </div>

        {/* Colored Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">15-20 min</div>
            <div className="text-sm opacity-90">90% precisão</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">4+ a 0,85</div>
            <div className="text-sm opacity-90">100+ estudos</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">Controle Judicial</div>
            <div className="text-sm opacity-90">Validação Científica</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">100+ estudos</div>
            <div className="text-sm opacity-90">Validação Científica</div>
          </div>
        </div>
          
        {/* Dimensions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Dimensões Avaliadas</h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            Análise multidimensional das capacidades cognitivas, com metodologia científica
            baseada em décadas de pesquisa em psicologia organizacional.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                <h3 className="font-semibold text-red-400">Assédio Moral Direto</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Avalia situações diretas de assédio moral no ambiente de trabalho
              </p>
              <div className="text-xs text-gray-400">12 questões • Validação científica</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                <h3 className="font-semibold text-orange-400">Assédio Moral Institucional</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Identifica práticas institucionais que caracterizam assédio moral
              </p>
              <div className="text-xs text-gray-400">10 questões • Metodologia validada</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <h3 className="font-semibold text-purple-400">Assédio Sexual</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Detecta situações de assédio sexual e comportamentos inadequados
              </p>
              <div className="text-xs text-gray-400">12 questões • Base científica</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                <h3 className="font-semibold text-blue-400">Percepção de Ambiente</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Avalia a percepção geral do ambiente organizacional
              </p>
              <div className="text-xs text-gray-400">10 questões • Metodologia científica</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <h3 className="font-semibold text-green-400">Impactos Emocionais</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Mensura os impactos emocionais das situações vivenciadas
              </p>
              <div className="text-xs text-gray-400">4 questões • Validação científica</div>
            </div>
          </div>
        </div>

        {/* Scientific Content */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Conteúdo Científico</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">O que é o HumaniQ PAS?</strong> O HumaniQ PAS é um instrumento científico desenvolvido para avaliar a percepção de assédio moral e sexual no ambiente de trabalho, baseado nas diretrizes da OIT, ISO 30415:2021 e legislação brasileira.
                </p>
                <p>
                  <strong className="text-white">Validação Científica:</strong> Baseado em décadas de pesquisa em psicologia organizacional, o teste possui validação científica robusta com mais de 100 estudos de referência e aplicação em diversos contextos organizacionais.
                </p>
                <p>
                  <strong className="text-white">Base Legal:</strong> O instrumento observa rigorosamente as diretrizes legais brasileiras e internacionais para identificação e prevenção de situações de assédio no ambiente de trabalho, promovendo ambientes mais seguros e respeitosos.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 border-2 border-red-400/30 flex items-center justify-center">
                <Shield className="h-24 w-24 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/colaborador/psicossociais/humaniq-pas')}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Iniciar Teste HumaniQ PAS
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}