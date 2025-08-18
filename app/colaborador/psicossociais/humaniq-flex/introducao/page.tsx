'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock, Users, Target, BookOpen, TrendingUp, Zap, Heart, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HumaniqFlexIntroduction() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HumaniQ FLEX
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Avaliação de Adaptabilidade
          </p>
          <Badge className="bg-blue-100 text-blue-800">
            Adaptabilidade e Flexibilidade
          </Badge>
        </div>

        {/* Objective */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Objetivo do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Medir a capacidade do colaborador ou candidato de se adaptar a mudanças organizacionais, 
              novos contextos, equipes, lideranças e desafios, identificando seu potencial de resiliência, 
              aprendizado contínuo e comportamento flexível.
            </p>
          </CardContent>
        </Card>

        {/* Scientific Base */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Base Científica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Teorias de Adaptabilidade Individual e Organizacional</p>
                  <p className="text-sm text-gray-600">Pulakos et al., 2000; Martin et al., 2012</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Modelos de Resiliência</p>
                  <p className="text-sm text-gray-600">APA – American Psychological Association</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Conceitos de Mindset de Crescimento</p>
                  <p className="text-sm text-gray-600">Carol Dweck</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">ISO 30414 – Gestão de Capital Humano</p>
                  <p className="text-sm text-gray-600">Adaptabilidade e Aprendizagem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Structure */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Estrutura do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Duração</p>
                    <p className="text-sm text-gray-600">8-12 minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Questões</p>
                    <p className="text-sm text-gray-600">24 perguntas</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Dimensões</p>
                    <p className="text-sm text-gray-600">4 dimensões (6 questões cada)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Escala</p>
                    <p className="text-sm text-gray-600">1 a 5 pontos (concordância)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Dimensões Avaliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Abertura à mudança</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Capacidade de aceitar e abraçar mudanças organizacionais, 
                  novas políticas e transições com positividade.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-900">Resiliência emocional</h4>
                </div>
                <p className="text-sm text-green-700">
                  Habilidade de manter foco e equilíbrio emocional 
                  em situações de crise e pressão.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Aprendizagem contínua</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Interesse constante em adquirir novos conhecimentos 
                  e habilidades para crescimento profissional.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Flexibilidade comportamental</h4>
                </div>
                <p className="text-sm text-orange-700">
                  Capacidade de ajustar comportamentos e estratégias 
                  conforme diferentes contextos e demandas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Aplicações do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Para Colaboradores:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Autoconhecimento sobre adaptabilidade</li>
                  <li>• Identificação de áreas de desenvolvimento</li>
                  <li>• Preparação para mudanças organizacionais</li>
                  <li>• Desenvolvimento de resiliência</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Para Organizações:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Seleção para posições dinâmicas</li>
                  <li>• Identificação de potencial de liderança</li>
                  <li>• Planejamento de mudanças organizacionais</li>
                  <li>• Desenvolvimento de equipes ágeis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Benefícios para a Organização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">Identificação de colaboradores com alto potencial adaptativo</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">Formação de equipes resilientes e flexíveis</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">Redução de resistência a mudanças organizacionais</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">Melhoria na capacidade de inovação e transformação</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">Desenvolvimento de cultura organizacional adaptativa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results and Deliverables */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Resultados e Entregáveis na HumaniQ AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📊 Painel Visual Interativo</h4>
                <p className="text-sm text-blue-700">
                  Gráfico radar com as 4 dimensões de adaptabilidade e pontuação geral
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🎯 Diagnóstico Detalhado</h4>
                <p className="text-sm text-green-700">
                  Análise por dimensão com identificação de pontos fortes e vulnerabilidades adaptativas
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">💡 Recomendações Personalizadas</h4>
                <p className="text-sm text-purple-700">
                  Sugestões específicas de desenvolvimento (coaching, treinamentos, desafios graduais)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Classificação dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div>
                  <span className="font-medium text-red-900">Baixa adaptabilidade (0-59 pontos)</span>
                  <p className="text-sm text-red-700">Necessita desenvolvimento significativo em flexibilidade</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div>
                  <span className="font-medium text-yellow-900">Adaptabilidade moderada (60-89 pontos)</span>
                  <p className="text-sm text-yellow-700">Capacidade adaptativa adequada com potencial de melhoria</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <span className="font-medium text-green-900">Alta adaptabilidade (90-109 pontos)</span>
                  <p className="text-sm text-green-700">Excelente capacidade de adaptação e flexibilidade</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <div>
                  <span className="font-medium text-blue-900">Adaptabilidade excepcional (110-120 pontos)</span>
                  <p className="text-sm text-blue-700">Capacidade adaptativa extraordinária, ideal para liderança</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Como Responder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Seja honesto e espontâneo.</strong> Não há respostas certas ou erradas.
              </p>
              <p className="text-gray-700">
                <strong>Pense em situações reais</strong> que você vivenciou no trabalho ou em outros contextos.
              </p>
              <p className="text-gray-700">
                <strong>Responda com base em como você realmente age,</strong> não como gostaria de agir.
              </p>
              <p className="text-gray-700">
                <strong>Use a escala de 1 a 5:</strong> 1 = Discordo totalmente, 5 = Concordo totalmente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/psicossociais')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            onClick={() => router.push('/colaborador/psicossociais/humaniq-flex')}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            Iniciar Teste
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}