'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Target, Clock, Users, Brain, Zap, Heart, Shield, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HumaniQMotivaIntroducaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-12 w-12 mr-3" />
              <div className="text-center">
                <CardTitle className="text-3xl font-bold">HumaniQ MOTIVA</CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Perfil de Motivação Profissional
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Target className="h-6 w-6 mr-2 text-purple-600" />
                Objetivo do Teste
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Avaliar os principais fatores motivacionais de colaboradores e candidatos, identificando os elementos 
                que mais impactam seu desempenho, engajamento e satisfação no ambiente de trabalho.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                Base Científica
              </h2>
              <div className="bg-purple-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Teoria da Autodeterminação</strong> (Deci & Ryan, 1985) - Motivadores Intrínsecos e Extrínsecos</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Modelo dos 6 Fatores Motivacionais de Reiss</strong> (2000)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Teoria de Herzberg</strong> (1959) - Fatores Higiênicos e Motivacionais</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Modelo DISC</strong> aplicado à motivação</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Gallup Q12</strong> adaptado para fatores motivacionais</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Estudos de Employee Experience (EX)</strong> e People Analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-purple-600" />
                Estrutura do Teste
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-3">Formato</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• <strong>40 questões</strong> no total</li>
                    <li>• <strong>5 questões</strong> por dimensão</li>
                    <li>• <strong>15-20 minutos</strong> para completar</li>
                    <li>• Escala Likert de <strong>5 pontos</strong></li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-3">Escala de Resposta</h3>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>1 - Discordo totalmente</li>
                    <li>2 - Discordo</li>
                    <li>3 - Neutro</li>
                    <li>4 - Concordo</li>
                    <li>5 - Concordo totalmente</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-purple-600" />
                8 Dimensões Motivacionais Avaliadas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-blue-800">Autonomia e Liberdade</div>
                    <div className="text-sm text-blue-600">Independência nas decisões</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <Heart className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <div className="font-semibold text-green-800">Reconhecimento e Validação</div>
                    <div className="text-sm text-green-600">Valorização do trabalho</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <div className="font-semibold text-purple-800">Crescimento e Desenvolvimento</div>
                    <div className="text-sm text-purple-600">Evolução profissional</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <Shield className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <div className="font-semibold text-yellow-800">Segurança e Estabilidade</div>
                    <div className="text-sm text-yellow-600">Previsibilidade e garantias</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                  <Target className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <div className="font-semibold text-indigo-800">Propósito e Contribuição</div>
                    <div className="text-sm text-indigo-600">Significado e impacto social</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <div className="font-semibold text-orange-800">Recompensa Financeira</div>
                    <div className="text-sm text-orange-600">Benefícios e salário</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
                  <Users className="h-8 w-8 text-pink-600 mr-3" />
                  <div>
                    <div className="font-semibold text-pink-800">Relacionamentos e Clima</div>
                    <div className="text-sm text-pink-600">Conexões interpessoais</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                  <Zap className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <div className="font-semibold text-teal-800">Desafios e Inovação</div>
                    <div className="text-sm text-teal-600">Novidades e complexidade</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
                Resultados e Benefícios
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-purple-800 mb-3">O que você receberá:</h3>
                    <ul className="space-y-2 text-purple-700">
                      <li>• Perfil motivacional personalizado</li>
                      <li>• Identificação dos 3 principais motivadores</li>
                      <li>• Análise dos motivadores menos ativos</li>
                      <li>• Gráfico visual das 8 dimensões</li>
                      <li>• Recomendações personalizadas</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 mb-3">Benefícios para você:</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• Autoconhecimento profissional</li>
                      <li>• Direcionamento de carreira</li>
                      <li>• Melhoria do engajamento</li>
                      <li>• Otimização da performance</li>
                      <li>• Satisfação no trabalho</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Classificação dos Níveis Motivacionais</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-green-100 rounded-lg">
                  <div className="font-bold text-green-800">Muito Alto</div>
                  <div className="text-sm text-green-600">80-100%</div>
                </div>
                <div className="text-center p-3 bg-blue-100 rounded-lg">
                  <div className="font-bold text-blue-800">Alto</div>
                  <div className="text-sm text-blue-600">65-79%</div>
                </div>
                <div className="text-center p-3 bg-yellow-100 rounded-lg">
                  <div className="font-bold text-yellow-800">Moderado</div>
                  <div className="text-sm text-yellow-600">50-64%</div>
                </div>
                <div className="text-center p-3 bg-orange-100 rounded-lg">
                  <div className="font-bold text-orange-800">Baixo</div>
                  <div className="text-sm text-orange-600">35-49%</div>
                </div>
                <div className="text-center p-3 bg-red-100 rounded-lg">
                  <div className="font-bold text-red-800">Muito Baixo</div>
                  <div className="text-sm text-red-600">0-34%</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Como Responder</h2>
              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <ul className="space-y-2 text-gray-700">
                  <li>• Leia cada afirmação com atenção</li>
                  <li>• Responda com base em como você realmente se sente, não como acha que deveria se sentir</li>
                  <li>• Considere suas experiências profissionais atuais e passadas</li>
                  <li>• Não há respostas certas ou erradas</li>
                  <li>• Seja honesto para obter um perfil mais preciso</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confidencialidade</h2>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                Suas respostas são completamente confidenciais e serão utilizadas apenas para gerar seu perfil 
                motivacional personalizado. Os dados são tratados de acordo com a LGPD e não serão compartilhados 
                sem sua autorização expressa.
              </p>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={() => router.push('/colaborador/psicossociais')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Button
                onClick={() => router.push('/colaborador/psicossociais/humaniq-motiva')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                Iniciar Teste
                <Target className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}