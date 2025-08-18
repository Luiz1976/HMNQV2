'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Brain, Target, Calculator, Zap, Eye, BookOpen, Award, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function HumaniqQIIntroducaoPage() {
  const router = useRouter()

  const testParts = [
    {
      name: 'Raciocínio Lógico',
      icon: Brain,
      color: 'text-purple-600',
      description: 'Capacidade de pensar de forma lógica e resolver problemas abstratos',
      questions: 5,
      examples: ['Silogismos', 'Sequências lógicas', 'Relações de ordem']
    },
    {
      name: 'Raciocínio Verbal',
      icon: Zap,
      color: 'text-blue-600',
      description: 'Compreensão e manipulação de conceitos verbais e linguísticos',
      questions: 5,
      examples: ['Analogias', 'Sinônimos/Antônimos', 'Classificação de palavras']
    },
    {
      name: 'Raciocínio Numérico',
      icon: Calculator,
      color: 'text-green-600',
      description: 'Habilidade para trabalhar com números e conceitos matemáticos',
      questions: 5,
      examples: ['Operações básicas', 'Porcentagens', 'Sequências numéricas']
    },
    {
      name: 'Raciocínio Espacial',
      icon: Eye,
      color: 'text-orange-600',
      description: 'Capacidade de visualizar e manipular objetos no espaço',
      questions: 5,
      examples: ['Geometria', 'Orientação espacial', 'Visualização 3D']
    }
  ]

  const interpretationLevels = [
    {
      range: '18-20 pontos',
      level: 'Muito Acima da Média',
      description: 'QI muito acima da média - Excelente capacidade cognitiva',
      color: 'bg-green-100 text-green-800',
      percentage: '≥ 130 QI'
    },
    {
      range: '15-17 pontos',
      level: 'Acima da Média',
      description: 'QI acima da média - Boa capacidade cognitiva',
      color: 'bg-blue-100 text-blue-800',
      percentage: '115-129 QI'
    },
    {
      range: '10-14 pontos',
      level: 'Dentro da Média',
      description: 'QI dentro da média - Capacidade cognitiva adequada',
      color: 'bg-yellow-100 text-yellow-800',
      percentage: '85-114 QI'
    },
    {
      range: '6-9 pontos',
      level: 'Abaixo da Média',
      description: 'QI abaixo da média - Sugere-se investigação',
      color: 'bg-orange-100 text-orange-800',
      percentage: '70-84 QI'
    },
    {
      range: '0-5 pontos',
      level: 'Avaliação Necessária',
      description: 'Procure avaliação especializada',
      color: 'bg-red-100 text-red-800',
      percentage: '< 70 QI'
    }
  ]

  const scientificBases = [
    {
      test: 'WAIS (Wechsler Adult Intelligence Scale)',
      description: 'Padrão-ouro para avaliação de inteligência em adultos',
      contribution: 'Estrutura multifatorial e metodologia de aplicação'
    },
    {
      test: 'WISC (Wechsler Intelligence Scale for Children)',
      description: 'Referência para avaliação cognitiva infantil',
      contribution: 'Adaptação de itens e critérios de desenvolvimento'
    },
    {
      test: 'Matrizes Progressivas de Raven',
      description: 'Teste não-verbal de inteligência fluida',
      contribution: 'Metodologia para raciocínio abstrato e espacial'
    },
    {
      test: 'Stanford-Binet Intelligence Scales',
      description: 'Um dos primeiros testes de QI padronizados',
      contribution: 'Conceitos fundamentais de idade mental e QI'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              HumaniQ QI
            </h1>
            <p className="text-xl text-gray-600">
              Teste Completo de Quociente de Inteligência
            </p>
          </div>
        </div>

        {/* Visão Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Sobre o Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                O <strong>HumaniQ QI</strong> é um instrumento de avaliação cognitiva que mede 
                diferentes aspectos da inteligência humana. Baseado em metodologias cientificamente 
                validadas, o teste oferece uma avaliação abrangente das capacidades intelectuais 
                através de quatro domínios fundamentais.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">40-50 min</div>
                    <div className="text-sm text-gray-600">Tempo sugerido</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold">20 questões</div>
                    <div className="text-sm text-gray-600">Total de itens</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold">4 domínios</div>
                    <div className="text-sm text-gray-600">Áreas avaliadas</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-semibold">0-20 pontos</div>
                    <div className="text-sm text-gray-600">Escala de pontuação</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Base Científica */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Fundamentação Científica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                O HumaniQ QI fundamenta-se em décadas de pesquisa psicométrica e utiliza 
                metodologias consagradas na avaliação da inteligência:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scientificBases.map((base, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">{base.test}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-1">{base.description}</p>
                    <p className="text-sm text-gray-600">{base.contribution}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Teoria das Inteligências Múltiplas</h4>
                <p className="text-blue-700 text-sm">
                  O teste incorpora conceitos da <strong>Teoria Psicométrica Clássica</strong> e 
                  elementos da <strong>Teoria CHC (Cattell-Horn-Carroll)</strong>, reconhecendo que 
                  a inteligência é multifacetada e pode ser medida através de diferentes domínios cognitivos.
                </p>
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
            <div className="space-y-6">
              {testParts.map((part, index) => {
                const Icon = part.icon
                return (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${part.color}`} />
                      <h3 className="text-lg font-semibold">{part.name}</h3>
                      <Badge variant="outline" className="ml-auto">
                        {part.questions} questões
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{part.description}</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Exemplos:</span> {part.examples.join(', ')}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sistema de Pontuação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Sistema de Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Critérios de Pontuação</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span><strong>Cada questão correta:</strong> +1 ponto</span>
                    <Badge variant="outline">Máx: 20 pts</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Questão incorreta ou em branco:</strong> 0 pontos</span>
                    <Badge variant="outline">Sem penalização</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Pontuação por domínio:</strong> 0-5 pontos cada</span>
                    <Badge variant="outline">4 domínios</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cálculo do QI Estimado</h4>
                <p className="text-blue-700 text-sm">
                  A pontuação bruta é convertida em uma <strong>estimativa de QI</strong> baseada em 
                  normas populacionais. O QI médio é 100, com desvio padrão de 15 pontos, seguindo 
                  a distribuição normal da inteligência na população.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretação dos Resultados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Interpretação dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interpretationLevels.map((level, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{level.range}</h4>
                    <div className="flex gap-2">
                      <Badge className={level.color}>
                        {level.level}
                      </Badge>
                      <Badge variant="outline">
                        {level.percentage}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{level.description}</p>
                </div>
              ))}
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Distribuição Populacional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-700">
                  <div>
                    <strong>68%</strong> da população: QI 85-115 (Média)
                  </div>
                  <div>
                    <strong>14%</strong> da população: QI 115-130 (Acima da média)
                  </div>
                  <div>
                    <strong>2%</strong> da população: QI ≥ 130 (Muito acima da média)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aplicações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Aplicações do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Contexto Educacional</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Identificação de altas habilidades</li>
                  <li>• Detecção de dificuldades de aprendizagem</li>
                  <li>• Orientação vocacional e profissional</li>
                  <li>• Planejamento pedagógico individualizado</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Contexto Clínico</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Avaliação neuropsicológica</li>
                  <li>• Diagnóstico de deficiência intelectual</li>
                  <li>• Acompanhamento de reabilitação</li>
                  <li>• Pesquisa em psicologia cognitiva</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Contexto Organizacional</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Seleção e recrutamento</li>
                  <li>• Avaliação de potencial</li>
                  <li>• Desenvolvimento de talentos</li>
                  <li>• Análise de competências cognitivas</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Autoconhecimento</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Compreensão das próprias habilidades</li>
                  <li>• Identificação de pontos fortes</li>
                  <li>• Planejamento de desenvolvimento</li>
                  <li>• Tomada de decisões acadêmicas/profissionais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              Instruções Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Antes de Começar</h4>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>• <strong>Reserve 40-50 minutos</strong> sem interrupções</li>
                  <li>• <strong>Escolha um ambiente tranquilo</strong> e bem iluminado</li>
                  <li>• <strong>Certifique-se de estar descansado</strong> e concentrado</li>
                  <li>• <strong>Tenha papel e caneta</strong> para rascunhos (se necessário)</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Durante o Teste</h4>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• <strong>Leia cada questão com atenção</strong> antes de responder</li>
                  <li>• <strong>Marque apenas uma resposta</strong> por questão</li>
                  <li>• <strong>Não há limite de tempo</strong> por questão - pense com calma</li>
                  <li>• <strong>Você pode voltar</strong> e revisar suas respostas</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Estratégias de Desempenho</h4>
                <ul className="text-purple-700 text-sm space-y-2">
                  <li>• <strong>Confie na sua primeira impressão</strong> - geralmente está correta</li>
                  <li>• <strong>Elimine alternativas claramente incorretas</strong> primeiro</li>
                  <li>• <strong>Use papel para cálculos</strong> nas questões numéricas</li>
                  <li>• <strong>Mantenha-se calmo</strong> - ansiedade pode prejudicar o desempenho</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Considerações e Limitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Fatores que Podem Influenciar</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• <strong>Estado emocional:</strong> Ansiedade, estresse, depressão</li>
                  <li>• <strong>Condições físicas:</strong> Fadiga, problemas de saúde</li>
                  <li>• <strong>Fatores ambientais:</strong> Ruído, temperatura, iluminação</li>
                  <li>• <strong>Experiência cultural:</strong> Familiaridade com o tipo de teste</li>
                  <li>• <strong>Escolaridade:</strong> Nível educacional e experiências acadêmicas</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Importante Lembrar</h4>
                <p className="text-red-700 text-sm">
                  Este teste oferece uma <strong>estimativa</strong> das capacidades cognitivas. 
                  A inteligência é multifacetada e não pode ser completamente capturada por um único teste. 
                  Para uma avaliação completa e diagnóstica, consulte um <strong>psicólogo especializado</strong> 
                  em avaliação neuropsicológica.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Validade e Confiabilidade</h4>
                <p className="text-blue-700 text-sm">
                  Este instrumento foi desenvolvido com base em <strong>metodologias cientificamente validadas</strong>, 
                  mas deve ser considerado como uma ferramenta de <strong>triagem inicial</strong>. 
                  Resultados significativamente baixos ou altos devem ser investigados por profissionais qualificados.
                </p>
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
            onClick={() => router.push('/colaborador/psicossociais/humaniq-qi?start=true')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Teste
          </Button>
        </div>
      </div>
    </div>
  )
}