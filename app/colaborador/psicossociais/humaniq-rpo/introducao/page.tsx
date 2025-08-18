'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Clock, Users, Shield, AlertTriangle, CheckCircle, BarChart3, FileText, Scale, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumaniQRPOIntroducaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            HumaniQ RPO
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Teste de Atenção e Raciocínio
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Avaliação científica para identificar e mensurar riscos psicossociais no ambiente de trabalho, 
            baseado em normas internacionais como ISO 45003 e OIT.
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">96</div>
            <div className="text-sm text-blue-200">Questões científicas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">8</div>
            <div className="text-sm text-blue-200">Dimensões avaliadas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-sm text-blue-200">Precisão científica</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">20 min</div>
            <div className="text-sm text-blue-200">Duração média</div>
          </div>
        </div>

        {/* Dimensões Avaliadas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Dimensões Avaliadas
          </h2>
          <p className="text-center text-blue-200 mb-8 max-w-3xl mx-auto">
            Análise multidimensional das capacidades cognitivas e comportamentais essenciais para o desempenho profissional
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="font-semibold text-green-300 mb-2">Demandas do Trabalho</h3>
              <p className="text-sm text-green-200/80">Avalia a carga de trabalho e pressões temporais</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
              <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-2">Controle e Autonomia</h3>
              <p className="text-sm text-blue-200/80">Mede o nível de controle sobre as atividades</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
              <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-2">Apoio Social</h3>
              <p className="text-sm text-purple-200/80">Avalia relacionamentos e suporte no trabalho</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30">
              <div className="w-12 h-12 bg-orange-500/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-orange-300" />
              </div>
              <h3 className="font-semibold text-orange-300 mb-2">Recompensa</h3>
              <p className="text-sm text-orange-200/80">Mede reconhecimento e recompensas recebidas</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-sm rounded-xl p-6 border border-teal-400/30">
              <div className="w-12 h-12 bg-teal-500/30 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-teal-300" />
              </div>
              <h3 className="font-semibold text-teal-300 mb-2">Justiça Organizacional</h3>
              <p className="text-sm text-teal-200/80">Avalia percepção de equidade e transparência</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
              <div className="w-12 h-12 bg-indigo-500/30 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-semibold text-indigo-300 mb-2">Segurança no Trabalho</h3>
              <p className="text-sm text-indigo-200/80">Mede estabilidade e segurança no emprego</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-pink-400/30">
              <div className="w-12 h-12 bg-pink-500/30 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-300" />
              </div>
              <h3 className="font-semibold text-pink-300 mb-2">Equilíbrio Vida-Trabalho</h3>
              <p className="text-sm text-pink-200/80">Avalia interface entre vida pessoal e profissional</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-400/30">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
              <h3 className="font-semibold text-red-300 mb-2">Violência e Assédio</h3>
              <p className="text-sm text-red-200/80">Identifica situações de pressão e assédio</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Científico */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Base Científica e Validação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Fundamentação Teórica</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Baseado em normas internacionais ISO 45003</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Diretrizes da Organização Internacional do Trabalho (OIT)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Modelos científicos validados internacionalmente</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Pesquisas em psicologia organizacional e saúde ocupacional</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-4">Validação e Precisão</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Validação estatística com amostras representativas</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Índices de confiabilidade superiores a 0,85</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Validação convergente e discriminante confirmada</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Aplicação em diversos setores e organizações</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => router.push('/colaborador/psicossociais')} 
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-3 rounded-xl backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={() => router.push('/colaborador/psicossociais/humaniq-rpo')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Teste
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}