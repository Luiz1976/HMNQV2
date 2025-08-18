'use client'

import { ArrowLeft, Brain, Target, Zap, Shield, Users, Building, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TiposIntroducao() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-emerald-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>
        <h1 className="text-white font-semibold text-lg">Testes de Personalidade</h1>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HumaniQ TIPOS
          </h1>
          <p className="text-xl text-emerald-100 mb-6">
            Perfil Cognitivo (Base Junguiana / MBTI)
          </p>
          <p className="text-emerald-200 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Avaliação baseada na teoria dos tipos psicológicos de Carl Jung e no modelo MBTI para identificar suas preferências cognitivas e estilo de personalidade através de 4 dicotomias fundamentais.
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="px-4 py-2 bg-white/10 rounded-full text-emerald-100 text-sm font-medium">
              Base Junguiana
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-emerald-100 text-sm font-medium">
              Modelo MBTI
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-emerald-100 text-sm font-medium">
              4 Dicotomias
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-emerald-100 text-sm font-medium">
              16 Tipos
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">50.000+</div>
            <div className="text-emerald-200 text-sm">Pessoas Avaliadas</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">500+</div>
            <div className="text-emerald-200 text-sm">Empresas Parceiras</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">95%</div>
            <div className="text-emerald-200 text-sm">Precisão Diagnóstica</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">15 min</div>
            <div className="text-emerald-200 text-sm">Duração</div>
          </div>
        </div>

        {/* Dichotomies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Energia</h3>
            <p className="text-emerald-200 text-sm">
              Extroversão vs Introversão - Como você direciona sua energia e atenção.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Percepção</h3>
            <p className="text-emerald-200 text-sm">
              Sensação vs Intuição - Como você coleta e processa informações.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Decisão</h3>
            <p className="text-emerald-200 text-sm">
              Pensamento vs Sentimento - Como você toma decisões e avalia situações.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Organização</h3>
            <p className="text-emerald-200 text-sm">
              Julgamento vs Percepção - Como você se organiza e lida com o mundo externo.
            </p>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="bg-emerald-800/30 rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Dicotomias Avaliadas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Energia (E/I)</h3>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Extroversão vs Introversão - Avalia como você direciona sua energia: para o mundo externo ou interno.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Percepção (S/N)</h3>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Sensação vs Intuição - Avalia como você coleta informações: através dos sentidos ou da intuição.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Decisão (T/F)</h3>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Pensamento vs Sentimento - Avalia como você toma decisões: baseado na lógica ou nos valores pessoais.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Organização (J/P)</h3>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Julgamento vs Percepção - Avalia como você se organiza: de forma estruturada ou flexível.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Content */}
        <div className="bg-white/5 rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Base Científica</h2>
          <p className="text-emerald-200 text-center leading-relaxed max-w-3xl mx-auto">
            Fundamentado na teoria dos tipos psicológicos de Carl Jung e no modelo MBTI (Myers-Briggs Type Indicator), 
            o HumaniQ TIPOS avalia 4 dicotomias cognitivas fundamentais para identificar seu tipo de personalidade 
            entre os 16 tipos possíveis, oferecendo insights profundos sobre suas preferências naturais.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Scientific Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-xl">Conteúdo Científico</h3>
            </div>
            <ul className="space-y-3 text-emerald-200">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>O que é o HumaniQ TIPOS?</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Base Científica</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Dimensões Avaliadas</span>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-xl">O que é o HumaniQ TIPOS?</h3>
            </div>
            <p className="text-emerald-200 leading-relaxed mb-6">
              O HumaniQ TIPOS é uma ferramenta de avaliação de personalidade baseada na teoria junguiana 
              e no modelo MBTI, que identifica seu tipo psicológico através de 4 dicotomias fundamentais.
            </p>
            <p className="text-emerald-200 leading-relaxed mb-8">
              Através de 40 questões cuidadosamente elaboradas, o teste mapeia suas preferências naturais 
              em Energia, Percepção, Decisão e Organização, revelando um dos 16 tipos de personalidade 
              para autoconhecimento e desenvolvimento.
            </p>
            
            {/* TIPOS Logo */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-2xl mb-4">
                <span className="text-white font-bold text-2xl">TIPOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => router.push('/colaborador/personalidade/tipos?start=true')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Iniciar Teste
          </button>
        </div>
      </div>
    </div>
  )
}