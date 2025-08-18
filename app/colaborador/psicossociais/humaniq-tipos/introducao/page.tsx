'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Zap, Eye, Target, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumaniQTiposIntroducao() {
  const router = useRouter()

  const handleStartTest = () => {
    // Set flag to indicate user has seen the introduction
    sessionStorage.setItem('humaniq-tipos-introduction-seen', 'true')
    router.push('/colaborador/psicossociais/humaniq-tipos')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HumaniQ TIPOS - Perfil Cognitivo
          </h1>
          <p className="text-lg text-gray-600">
            Avaliação de preferências cognitivas baseada na teoria de tipos psicológicos
          </p>
        </div>

        {/* Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Energia</h3>
            <p className="text-sm text-gray-600">Extroversão vs Introversão</p>
            <p className="text-xs text-gray-500">10 perguntas</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Percepção</h3>
            <p className="text-sm text-gray-600">Sensação vs Intuição</p>
            <p className="text-xs text-gray-500">10 perguntas</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Decisão</h3>
            <p className="text-sm text-gray-600">Pensamento vs Sentimento</p>
            <p className="text-xs text-gray-500">10 perguntas</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Organização</h3>
            <p className="text-sm text-gray-600">Julgamento vs Percepção</p>
            <p className="text-xs text-gray-500">10 perguntas</p>
          </div>
        </div>

        {/* Information Card */}
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-900">Informações Importantes</h3>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li>• Este teste contém 40 perguntas divididas em 4 dimensões cognitivas</li>
                  <li>• Tempo estimado: 8-12 minutos</li>
                  <li>• Baseado na teoria de tipos psicológicos de Carl Jung</li>
                  <li>• Não há respostas certas ou erradas, apenas preferências pessoais</li>
                  <li>• Responda de forma espontânea e honesta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Sobre o Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              O HumaniQ TIPOS é uma ferramenta de avaliação que identifica suas preferências cognitivas 
              naturais em quatro dimensões fundamentais do comportamento humano. Este teste ajuda a 
              compreender como você prefere processar informações, tomar decisões e interagir com o mundo.
            </p>
            <p className="text-gray-700">
              Os resultados fornecerão insights valiosos sobre seu estilo de trabalho, comunicação 
              e abordagem para resolução de problemas, contribuindo para seu desenvolvimento pessoal 
              e profissional.
            </p>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartTest}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
            size="lg"
          >
            <Clock className="h-5 w-5 mr-2" />
            Iniciar Teste
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Desenvolvido pela equipe HumaniQ • Baseado na teoria de tipos psicológicos de Carl Jung
          </p>
        </div>
      </div>
    </div>
  )
}