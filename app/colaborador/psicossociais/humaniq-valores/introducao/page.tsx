'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Users, 
  Target, 
  CheckCircle,
  Heart,
  Shield,
  Zap,
  Trophy,
  Compass
} from 'lucide-react'

const valueCategories = [
  {
    name: "Autotranscendência",
    description: "Perfil ético, colaborativo, voltado ao impacto coletivo",
    icon: Heart,
    color: "bg-blue-100 text-blue-700",
    values: ["Universalismo", "Benevolência"]
  },
  {
    name: "Autopromoção", 
    description: "Foco em performance, status e recompensas",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700",
    values: ["Poder", "Realização"]
  },
  {
    name: "Abertura à Mudança",
    description: "Perfil inovador, empreendedor e flexível", 
    icon: Zap,
    color: "bg-purple-100 text-purple-700",
    values: ["Autodeterminação", "Estimulação", "Hedonismo"]
  },
  {
    name: "Conservação",
    description: "Perfil conservador, focado em estabilidade, rotina e normas",
    icon: Shield,
    color: "bg-green-100 text-green-700",
    values: ["Conformidade", "Tradição", "Segurança"]
  }
]

const testFeatures = [
  {
    icon: Clock,
    title: "20 minutos",
    description: "Tempo estimado para conclusão"
  },
  {
    icon: Users,
    title: "40 questões",
    description: "Baseadas na teoria de valores de Schwartz"
  },
  {
    icon: Target,
    title: "10 valores fundamentais",
    description: "Análise completa do seu perfil de valores"
  },
  {
    icon: CheckCircle,
    title: "Resultados detalhados",
    description: "Gráfico visual e perfil textual personalizado"
  }
]

const processSteps = [
  {
    number: 1,
    title: "Responda às Questões",
    description: "40 afirmações sobre valores e preferências pessoais",
    color: "bg-blue-100 text-blue-600"
  },
  {
    number: 2,
    title: "Análise Automática",
    description: "Suas respostas são analisadas segundo os 10 valores de Schwartz",
    color: "bg-green-100 text-green-600"
  },
  {
    number: 3,
    title: "Receba Seus Resultados",
    description: "Gráfico visual e perfil textual personalizado",
    color: "bg-purple-100 text-purple-600"
  }
]

export default function HumaniqValoresIntroducao() {
  const router = useRouter()

  const handleStartTest = () => {
    router.push('/colaborador/psicossociais/humaniq-valores')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              HumaniQ Valores
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Descubra os valores fundamentais que guiam sua vida
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto">
              O HumaniQ Valores é baseado na teoria científica de Shalom Schwartz sobre valores humanos universais, 
              identificando os 10 valores fundamentais que guiam suas decisões e comportamentos.
            </p>
          </div>
        </div>

        {/* Test Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Características do Teste
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                  <span className="text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Value Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Os 4 Grupos de Valores
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Entenda os diferentes perfis que podem ser identificados pelo teste.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.values.map((value, valueIndex) => (
                        <Badge key={valueIndex} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Ready to Start */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Você está pronto para descobrir seus valores fundamentais. 
            Lembre-se de responder com honestidade para obter resultados mais precisos.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Dicas Importantes:</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li>• Responda com base em seus valores pessoais, não no que é socialmente esperado</li>
              <li>• Não há respostas certas ou erradas</li>
              <li>• Seja honesto(a) consigo mesmo(a)</li>
              <li>• O teste leva aproximadamente 20 minutos</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleStartTest}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg"
          >
            Iniciar Teste
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}