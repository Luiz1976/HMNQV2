'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Clock, Users, Target, TrendingUp, Brain, Heart, Zap, Award, BookOpen, AlertTriangle, CheckCircle, Info, Scale, BarChart3, Shield } from 'lucide-react'

export default function HumaniqKarasekSiegristIntroducaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">HumaniQ Karasek-Siegrist</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Avaliação científica de estresse ocupacional baseada no modelo Demanda-Controle e Esforço-Recompensa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">35.000+</div>
            <div className="text-purple-200 text-sm">Trabalhadores avaliados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">300+</div>
            <div className="text-purple-200 text-sm">Organizações</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">94%</div>
            <div className="text-purple-200 text-sm">Precisão diagnóstica</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">12 min</div>
            <div className="text-purple-200 text-sm">Tempo médio</div>
          </div>
        </div>

        {/* Colored Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-green-500 rounded-lg p-6 text-white">
            <Clock className="w-8 h-8 mb-4" />
            <div className="font-semibold mb-2">10-15 min</div>
            <div className="text-sm opacity-90">Duração do teste</div>
          </div>
          <div className="bg-blue-500 rounded-lg p-6 text-white">
            <BarChart3 className="w-8 h-8 mb-4" />
            <div className="font-semibold mb-2">94% precisão</div>
            <div className="text-sm opacity-90">Taxa de acurácia</div>
          </div>
          <div className="bg-purple-500 rounded-lg p-6 text-white">
            <Target className="w-8 h-8 mb-4" />
            <div className="font-semibold mb-2">4 x 1-4</div>
            <div className="text-sm opacity-90">Escala de avaliação</div>
          </div>
          <div className="bg-orange-500 rounded-lg p-6 text-white">
            <Award className="w-8 h-8 mb-4" />
            <div className="font-semibold mb-2">50+ estudos</div>
            <div className="text-sm opacity-90">Base científica</div>
          </div>
        </div>

        {/* Scientific Content and Logo Circle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-300" />
                O que é o HumaniQ Karasek-Siegrist?
              </h3>
              <p className="text-purple-100 mb-4">
                Baseado nos modelos científicos de Karasek (1979) e Siegrist (1996), este teste avalia 
                os riscos psicossociais no ambiente de trabalho através da análise do estresse ocupacional.
              </p>
              <p className="text-purple-100">
                Combina a avaliação de demandas psicológicas, controle no trabalho, esforço despendido 
                e recompensas recebidas para identificar situações de alto risco para a saúde mental.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Validação Científica</h3>
              <p className="text-purple-100 mb-4">
                Amplamente validado internacionalmente com mais de 50 estudos científicos comprovando 
                sua eficácia na predição de problemas de saúde relacionados ao trabalho.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">94%</div>
                  <div className="text-sm text-purple-200">Precisão diagnóstica</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-purple-200">Estudos validadores</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center">
                <Scale className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Dimensões Avaliadas</h2>
          <p className="text-purple-200 text-center mb-8 max-w-3xl mx-auto">
            Análise multidimensional do estresse ocupacional, com metodologia científica validada internacionalmente
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600 rounded-lg p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Demanda Psicológica</h3>
              <p className="text-red-100 text-sm">Pressão temporal, volume de trabalho e exigências cognitivas</p>
            </div>
            
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <Shield className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Controle no Trabalho</h3>
              <p className="text-blue-100 text-sm">Autonomia decisória e uso de habilidades no ambiente laboral</p>
            </div>
            
            <div className="bg-orange-600 rounded-lg p-6 text-white">
              <Target className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Esforço no Trabalho</h3>
              <p className="text-orange-100 text-sm">Investimento físico e mental dedicado às atividades profissionais</p>
            </div>
            
            <div className="bg-green-600 rounded-lg p-6 text-white">
              <Award className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Recompensas</h3>
              <p className="text-green-100 text-sm">Reconhecimento, salário, segurança no emprego e perspectivas de carreira</p>
            </div>
          </div>
        </div>

        {/* Informações Gerais */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-300" />
              <div>
                <div className="font-semibold text-white">Tempo Sugerido</div>
                <div className="text-sm text-blue-200">40-50 minutos</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-500/20 rounded-lg">
              <Target className="w-6 h-6 text-green-300" />
              <div>
                <div className="font-semibold text-white">Questões</div>
                <div className="text-sm text-green-200">60 questões</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-300" />
              <div>
                <div className="font-semibold text-white">Dimensões</div>
                <div className="text-sm text-purple-200">6 dimensões</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fundamentação Científica */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Fundamentação Científica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Modelo Karasek (Job Demand-Control)</h4>
              <p className="text-green-700 text-sm mb-2">
                Desenvolvido por Robert Karasek (1979), este modelo identifica que o estresse ocupacional resulta da interação entre demandas psicológicas do trabalho e o grau de controle que o trabalhador possui sobre suas atividades.
              </p>
              <div className="text-xs text-green-600">
                <strong>Referência:</strong> Karasek, R. A. (1979). Job demands, job decision latitude, and mental strain. Administrative Science Quarterly, 24(2), 285-308.
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Extensão Johnson & Theorell (Demand-Control-Support)</h4>
              <p className="text-blue-700 text-sm mb-2">
                Johnson e Theorell (1988) expandiram o modelo original incluindo o apoio social como terceira dimensão, criando o modelo DCS (Demand-Control-Support), que considera o suporte de colegas e supervisores.
              </p>
              <div className="text-xs text-blue-600">
                <strong>Referência:</strong> Johnson, J. V., & Hall, E. M. (1988). Job strain, work place social support, and cardiovascular disease. American Journal of Public Health, 78(10), 1336-1342.
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Modelo Siegrist (Effort-Reward Imbalance)</h4>
              <p className="text-purple-700 text-sm mb-2">
                Johannes Siegrist (1996) propôs que o estresse ocupacional surge do desequilíbrio entre esforços despendidos e recompensas recebidas, incluindo o conceito de hipercomprometimento como traço de risco pessoal.
              </p>
              <div className="text-xs text-purple-600">
                <strong>Referência:</strong> Siegrist, J. (1996). Adverse health effects of high-effort/low-reward conditions. Journal of Occupational Health Psychology, 1(1), 27-41.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura do Teste */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Estrutura do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold">Demanda Psicológica</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Avalia pressão temporal, carga mental, complexidade das tarefas e exigências emocionais do trabalho.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold">Controle e Autonomia</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mede o grau de liberdade para tomar decisões, organizar tarefas e participar de processos decisórios.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Apoio Social</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Avalia suporte de colegas, liderança, clima organizacional e qualidade dos relacionamentos.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold">Esforço Exigido</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mede a intensidade do esforço físico, mental e emocional demandado pelo trabalho.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold">Recompensas Recebidas</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Avalia reconhecimento, remuneração, estabilidade, perspectivas de crescimento e valorização.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Hipercomprometimento</h4>
                    <Badge variant="outline">10 questões</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Identifica traços de personalidade relacionados ao excesso de envolvimento e dificuldade de desligamento.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sistema de Pontuação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Sistema de Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Escala de Resposta</h4>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold">1</div>
                  <div>Nunca</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold">2</div>
                  <div>Raramente</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold">3</div>
                  <div>Às vezes</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold">4</div>
                  <div>Frequentemente</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold">5</div>
                  <div>Sempre</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Cálculo dos Resultados</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Soma dos pontos por dimensão (10-50 pontos cada)</li>
                <li>• Conversão para porcentagem (0-100%)</li>
                <li>• Inversão de escala para dimensões positivas (Controle, Apoio, Recompensas)</li>
                <li>• Cálculo do risco geral (média das 5 primeiras dimensões)</li>
                <li>• Análise separada do hipercomprometimento</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Interpretação dos Resultados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              Interpretação dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-semibold text-green-800">Baixo Risco (0-39%)</h4>
                  </div>
                  <p className="text-green-700 text-sm">
                    Condições de trabalho adequadas. Baixo risco de desenvolvimento de problemas psicossociais.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <h4 className="font-semibold text-yellow-800">Moderado/Atenção (40-69%)</h4>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Algumas áreas requerem atenção. Monitoramento e intervenções preventivas recomendadas.
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h4 className="font-semibold text-red-800">Alto/Crítico (70-100%)</h4>
                  </div>
                  <p className="text-red-700 text-sm">
                    Risco elevado. Intervenção urgente necessária para prevenir agravos à saúde.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aplicações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Aplicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Organizacional</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Diagnóstico de clima organizacional</li>
                  <li>• Prevenção de burnout e adoecimento</li>
                  <li>• Planejamento de intervenções</li>
                  <li>• Avaliação de programas de bem-estar</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Clínica</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Avaliação de fatores ocupacionais</li>
                  <li>• Diagnóstico diferencial</li>
                  <li>• Planejamento terapêutico</li>
                  <li>• Orientação vocacional</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Pesquisa</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Estudos epidemiológicos</li>
                  <li>• Validação de instrumentos</li>
                  <li>• Pesquisa em saúde ocupacional</li>
                  <li>• Análise de intervenções</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Individual</h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Autoconhecimento profissional</li>
                  <li>• Identificação de riscos pessoais</li>
                  <li>• Desenvolvimento de estratégias</li>
                  <li>• Tomada de decisões de carreira</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções Importantes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Instruções Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Antes do Teste</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Escolha um ambiente tranquilo e sem interrupções</li>
                  <li>• Reserve tempo suficiente (40-50 minutos)</li>
                  <li>• Reflita sobre sua experiência de trabalho atual</li>
                  <li>• Responda com base nos últimos 6 meses</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Durante o Teste</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Leia cada questão com atenção</li>
                  <li>• Responda de forma honesta e espontânea</li>
                  <li>• Não há respostas certas ou erradas</li>
                  <li>• Marque apenas uma resposta por questão</li>
                  <li>• Evite respostas neutras em excesso</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Considerações e Limitações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-600" />
              Considerações e Limitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Fatores que Podem Influenciar</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Estado emocional atual</li>
                  <li>• Eventos recentes no trabalho</li>
                  <li>• Mudanças organizacionais</li>
                  <li>• Condições pessoais de saúde</li>
                  <li>• Expectativas profissionais</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Importante Lembrar</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Este é um instrumento de triagem, não diagnóstico</li>
                  <li>• Resultados devem ser interpretados por profissionais qualificados</li>
                  <li>• Intervenções requerem análise contextual</li>
                  <li>• Reavaliações periódicas são recomendadas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => router.push('/colaborador/psicossociais/humaniq-karasek-siegrist')}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
          >
            Iniciar Avaliação
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}