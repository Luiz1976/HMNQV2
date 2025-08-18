'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Users, Brain, Target, Heart, AlertTriangle, Zap, BookOpen, Award, TrendingUp, CheckCircle, Star, Timer, FileText, Layers, Lightbulb, Shield, Eye, Smile, BarChart3 } from 'lucide-react'

export default function BigFiveIntroducao() {
  const router = useRouter()

  const testStructure = [
    {
      title: "Abertura à Experiência",
      description: "Avalia curiosidade intelectual, criatividade e abertura para novas experiências",
      questions: "24 questões",
      icon: Lightbulb,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Conscienciosidade", 
      description: "Mede organização, disciplina, responsabilidade e orientação para objetivos",
      questions: "24 questões",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Extroversão",
      description: "Analisa sociabilidade, assertividade, energia e busca por estimulação",
      questions: "24 questões", 
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Amabilidade",
      description: "Avalia cooperação, confiança, empatia e orientação pró-social",
      questions: "24 questões",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: "Neuroticismo",
      description: "Mede estabilidade emocional e tendência a experienciar emoções negativas",
      questions: "24 questões",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ]

  const interpretationLevels = [
    { range: "4.0 - 5.0", level: "Muito Alto", description: "Presença muito forte do traço", color: "text-green-700", bg: "bg-green-100" },
    { range: "3.5 - 3.9", level: "Alto", description: "Presença forte do traço", color: "text-blue-700", bg: "bg-blue-100" },
    { range: "2.5 - 3.4", level: "Moderado", description: "Presença moderada do traço", color: "text-yellow-700", bg: "bg-yellow-100" },
    { range: "2.0 - 2.4", level: "Baixo", description: "Presença fraca do traço", color: "text-orange-700", bg: "bg-orange-100" },
    { range: "1.0 - 1.9", level: "Muito Baixo", description: "Presença muito fraca do traço", color: "text-red-700", bg: "bg-red-100" }
  ]

  const applications = [
    {
      icon: TrendingUp,
      title: 'Desenvolvimento Pessoal',
      description: 'Identificação de pontos fortes e áreas de melhoria para crescimento pessoal'
    },
    {
      icon: Users,
      title: 'Seleção de Pessoal',
      description: 'Avaliação de adequação pessoa-cargo e predição de desempenho profissional'
    },
    {
      icon: Target,
      title: 'Planejamento de Carreira',
      description: 'Orientação vocacional baseada em traços de personalidade'
    },
    {
      icon: Heart,
      title: 'Relacionamentos',
      description: 'Melhoria da comunicação e compreensão interpessoal'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg">
              <Brain className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HumaniQ Big Five
              </h1>
              <p className="text-sm text-gray-500 mt-1">Inventário Internacional de Itens de Personalidade</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Avaliação científica da personalidade baseada no modelo dos <strong>Cinco Grandes Fatores</strong>, 
            utilizando o IPIP-120 para análise detalhada de traços de personalidade
          </p>
        </div>

        {/* Visão Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Sobre o Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                O HumaniQ Big Five é baseado no <strong>IPIP-120</strong> (International Personality Item Pool - 120 itens), 
                uma versão cientificamente validada do inventário de personalidade que avalia os cinco grandes fatores 
                da personalidade humana.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center border-2 border-purple-100 hover:border-purple-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Timer className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Tempo Estimado</h3>
                    <p className="text-2xl font-bold text-purple-600">20-25 min</p>
                    <p className="text-sm text-gray-500 mt-1">Duração aproximada</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 border-blue-100 hover:border-blue-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Total de Questões</h3>
                    <p className="text-2xl font-bold text-blue-600">120</p>
                    <p className="text-sm text-gray-500 mt-1">Escala Likert 1-5</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 border-green-100 hover:border-green-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <Layers className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Fatores Avaliados</h3>
                    <p className="text-2xl font-bold text-green-600">5</p>
                    <p className="text-sm text-gray-500 mt-1">Dimensões principais</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 border-orange-100 hover:border-orange-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Facetas Detalhadas</h3>
                    <p className="text-2xl font-bold text-orange-600">30</p>
                    <p className="text-sm text-gray-500 mt-1">Subtraços analisados</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bases Científicas */}
        <Card className="mb-8 border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              Fundamentação Científica
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Baseado em décadas de pesquisa em psicologia da personalidade e validado internacionalmente
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-800">Modelo dos Cinco Fatores</h4>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Fundamentado no modelo mais aceito na psicologia da personalidade, desenvolvido através de 
                  <strong> análise fatorial lexical</strong> e validado em múltiplas culturas e idiomas.
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-green-800">IPIP-120 (Goldberg & Johnson)</h4>
                </div>
                <p className="text-green-700 text-sm leading-relaxed">
                  Desenvolvido por <strong>Lewis Goldberg</strong> e <strong>John A. Johnson</strong>, 
                  utiliza 120 itens cuidadosamente selecionados para máxima precisão e cobertura dos traços.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <h5 className="font-semibold text-purple-800">Validação Cruzada</h5>
                </div>
                <p className="text-purple-700 text-sm">
                  Validado contra o <strong>NEO PI-R</strong> com correlações superiores a 0.85, 
                  demonstrando equivalência com instrumentos padrão-ouro.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <h5 className="font-semibold text-orange-800">Confiabilidade</h5>
                </div>
                <p className="text-orange-700 text-sm">
                  <strong>Alfa de Cronbach &gt; 0.85</strong> para todos os fatores, 
                  garantindo alta consistência interna e precisão das medidas.
                </p>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h5 className="font-semibold text-teal-800">Estabilidade Temporal</h5>
                </div>
                <p className="text-teal-700 text-sm">
                  <strong>Correlações teste-reteste &gt; 0.80</strong> em períodos de 6 meses, 
                  confirmando a estabilidade dos traços de personalidade.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Aplicações Científicas Validadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Psicologia Organizacional:</h5>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Seleção e desenvolvimento de pessoal</li>
                    <li>• Predição de desempenho profissional</li>
                    <li>• Formação de equipes eficazes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Pesquisa Acadêmica:</h5>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Estudos longitudinais de personalidade</li>
                    <li>• Pesquisas cross-culturais</li>
                    <li>• Validação de outros instrumentos</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura do Teste */}
        <Card className="mb-8 border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              Estrutura do Teste - Cinco Grandes Fatores
            </CardTitle>
            <p className="text-gray-600 mt-2">
              O teste avalia cinco dimensões fundamentais da personalidade, cada uma com múltiplas facetas específicas
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testStructure.map((domain, index) => {
                const Icon = domain.icon
                return (
                  <div key={index} className={`p-6 rounded-xl border-2 ${domain.borderColor} ${domain.bgColor} hover:shadow-md transition-all`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                        <Icon className={`w-6 h-6 ${domain.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{domain.title}</h3>
                        <p className="text-sm text-gray-500">{domain.questions}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{domain.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pontuação e Interpretação */}
        <Card className="mb-8 border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              Pontuação e Interpretação
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sistema de pontuação baseado em escala Likert de 5 pontos com interpretação por níveis
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Escala de Resposta
                </h4>
                <div className="space-y-3">
                  {[
                    { value: "5", label: "Muito preciso", desc: "Descreve você perfeitamente", color: "bg-green-100 text-green-800" },
                    { value: "4", label: "Moderadamente preciso", desc: "Descreve você bem", color: "bg-blue-100 text-blue-800" },
                    { value: "3", label: "Neutro", desc: "Nem preciso, nem impreciso", color: "bg-gray-100 text-gray-800" },
                    { value: "2", label: "Moderadamente impreciso", desc: "Não descreve você bem", color: "bg-orange-100 text-orange-800" },
                    { value: "1", label: "Muito impreciso", desc: "Não descreve você", color: "bg-red-100 text-red-800" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.color}`}>
                        {item.value}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Níveis de Interpretação
                </h4>
                <div className="space-y-3">
                  {interpretationLevels.map((level, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${level.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800">{level.level}</span>
                        <span className={`text-sm font-semibold ${level.color}`}>{level.range}</span>
                      </div>
                      <p className="text-sm text-gray-700">{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aplicações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Aplicações e Benefícios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app, index) => {
                const Icon = app.icon
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">{app.title}</h3>
                    </div>
                    <p className="text-sm text-gray-700">{app.description}</p>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Predições Validadas</h4>
              <p className="text-green-700 text-sm">
                Pesquisas demonstram que o modelo dos cinco fatores prediz efetivamente:
                <strong> desempenho no trabalho, sucesso acadêmico, qualidade de relacionamentos e bem-estar psicológico</strong>. 
                A Conscienciosidade, por exemplo, é o melhor preditor de desempenho profissional em diversas ocupações.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mb-8 border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              Instruções para Resposta
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Siga estas diretrizes para obter resultados mais precisos e confiáveis
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-600 rounded-full flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">Honestidade e Autenticidade</h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Responda com base em <strong>como você realmente é</strong>, não como gostaria de ser ou 
                      como acredita que deveria ser. A autenticidade é fundamental para resultados precisos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Resposta Intuitiva</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Responda <strong>rapidamente e intuitivamente</strong>. Sua primeira impressão 
                      geralmente reflete melhor seus traços naturais de personalidade.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="p-2 bg-purple-600 rounded-full flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800 mb-2">Comportamento Geral</h4>
                    <p className="text-purple-700 text-sm leading-relaxed">
                      Considere seu <strong>padrão comportamental típico</strong> na maioria das situações, 
                      não casos específicos ou momentos atípicos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="p-2 bg-orange-600 rounded-full flex-shrink-0">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-800 mb-2">Use Toda a Escala</h4>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      Utilize <strong>toda a escala de 1 a 5</strong> conforme apropriado. 
                      Evite concentrar-se apenas no meio da escala para maior precisão.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Dicas para Máxima Precisão
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-800">Ambiente tranquilo e sem distrações</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-800">Complete em uma única sessão</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-800">Mantenha consistência nas respostas</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Considerações */}
        <Card className="mb-8 border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              Considerações Importantes
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Entenda as limitações e contexto adequado para interpretação dos resultados
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-yellow-800">Modelo Científico</h4>
                  </div>
                  <p className="text-yellow-700 text-sm leading-relaxed mb-3">
                    O modelo dos Cinco Fatores é uma <strong>representação científica robusta</strong>, mas não 
                    captura toda a complexidade da personalidade humana.
                  </p>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Valores pessoais e motivações específicas</li>
                    <li>• Competências técnicas e habilidades</li>
                    <li>• Aspectos situacionais e contextuais</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-blue-800">Contexto Cultural</h4>
                  </div>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Validado em <strong>múltiplas culturas</strong>, mas interpretações podem variar 
                    conforme contexto cultural e social específico.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Smile className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-purple-800">Autorrelato</h4>
                  </div>
                  <p className="text-purple-700 text-sm leading-relaxed mb-3">
                    Baseado em <strong>autopercepção</strong>, podendo ser influenciado por:
                  </p>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Desejabilidade social</li>
                    <li>• Nível de autoconhecimento</li>
                    <li>• Estado emocional atual</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-green-800">Uso Responsável</h4>
                  </div>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Utilize como <strong>ferramenta de autoconhecimento</strong> e desenvolvimento, 
                    não como diagnóstico definitivo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-600" />
                Recomendações para Interpretação
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Combine Fontes</h5>
                    <p className="text-gray-600">Use junto com feedback de terceiros e observação comportamental</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Contextualize</h5>
                    <p className="text-gray-600">Considere o ambiente e situações específicas de aplicação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Desenvolva</h5>
                    <p className="text-gray-600">Use os insights para planos de desenvolvimento pessoal e profissional</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            size="lg"
          >
            Voltar à Lista
          </Button>
          
          <Button
            onClick={() => router.push('/colaborador/psicossociais/humaniq-big-five?start=true')}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Teste
          </Button>
        </div>
      </div>
    </div>
  )
}