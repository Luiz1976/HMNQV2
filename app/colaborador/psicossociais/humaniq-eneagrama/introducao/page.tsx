'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Clock, Users, Brain, Target, CheckCircle, Star, Heart, Shield, Zap, Eye, Compass, Award, BarChart3, Timer, TrendingUp, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

const enneagramTypes = [
  {
    number: 1,
    name: "O Perfeccionista",
    description: "Racional, idealista, de princípios, determinado, controlado e perfeccionista.",
    icon: <Target className="w-5 h-5" />,
    center: "Instintivo",
    motivation: "Ser perfeito e correto"
  },
  {
    number: 2,
    name: "O Prestativo",
    description: "Carinhoso, interpessoal, demonstrativo, generoso, possessivo e manipulativo.",
    icon: <Heart className="w-5 h-5" />,
    center: "Emocional",
    motivation: "Ser amado e necessário"
  },
  {
    number: 3,
    name: "O Realizador",
    description: "Adaptável, ambicioso, orientado para o sucesso, consciente da imagem e competitivo.",
    icon: <Star className="w-5 h-5" />,
    center: "Emocional",
    motivation: "Ser valorizado e admirado"
  },
  {
    number: 4,
    name: "O Individualista",
    description: "Expressivo, dramático, egocêntrico, temperamental e criativo.",
    icon: <Eye className="w-5 h-5" />,
    center: "Emocional",
    motivation: "Encontrar a si mesmo e seu significado"
  },
  {
    number: 5,
    name: "O Investigador",
    description: "Intenso, cerebral, perceptivo, inovador, reservado e isolado.",
    icon: <Brain className="w-5 h-5" />,
    center: "Mental",
    motivation: "Ser competente e compreender"
  },
  {
    number: 6,
    name: "O Leal",
    description: "Engajado, responsável, ansioso, desconfiado, cauteloso e indeciso.",
    icon: <Shield className="w-5 h-5" />,
    center: "Mental",
    motivation: "Ter segurança e apoio"
  },
  {
    number: 7,
    name: "O Entusiasta",
    description: "Espontâneo, versátil, distraído, dispersivo, otimista e impulsivo.",
    icon: <Zap className="w-5 h-5" />,
    center: "Mental",
    motivation: "Manter-se satisfeito e realizado"
  },
  {
    number: 8,
    name: "O Desafiador",
    description: "Autoconfiante, decidido, voluntarioso, confrontativo e controlador.",
    icon: <Users className="w-5 h-5" />,
    center: "Instintivo",
    motivation: "Ser autossuficiente e controlar"
  },
  {
    number: 9,
    name: "O Pacificador",
    description: "Receptivo, tranquilizador, agradável, complacente e resignado.",
    icon: <Compass className="w-5 h-5" />,
    center: "Instintivo",
    motivation: "Manter harmonia e paz interior"
  }
]

export default function IntroducaoEneagrama() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg">
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">HumaniQ Eneagrama</h1>
              <p className="text-xl text-purple-600 font-semibold">Sistema Científico de Tipologia da Personalidade</p>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            O Eneagrama é um sistema dinâmico que mapeia nove tipos fundamentais de personalidade, 
            revelando padrões profundos de motivação, comportamento e desenvolvimento pessoal através 
            de metodologia científica validada internacionalmente.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <Timer className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">15-20</div>
              <div className="text-sm text-purple-600">minutos</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">9</div>
              <div className="text-sm text-blue-600">tipos</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">81</div>
              <div className="text-sm text-green-600">questões</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">3</div>
              <div className="text-sm text-orange-600">centros</div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/colaborador/psicossociais')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                Mapeamento de Personalidade
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Award className="w-8 h-8" />
              Metodologia Científica do Eneagrama
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Fundamentação Teórica
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-semibold text-purple-700">Sistema Dinâmico de Personalidade</p>
                      <p className="text-sm">Mapeamento de 9 tipos fundamentais baseado em motivações inconscientes e padrões comportamentais</p>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="font-semibold text-indigo-700">Três Centros de Inteligência</p>
                      <p className="text-sm">Instintivo (Tipos 8,9,1), Emocional (Tipos 2,3,4) e Mental (Tipos 5,6,7)</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold text-blue-700">Teoria das Asas e Setas</p>
                      <p className="text-sm">Influências adjacentes e direções de integração/desintegração da personalidade</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Especificações Técnicas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">81</div>
                      <div className="text-sm text-gray-600">Questões Validadas</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">9</div>
                      <div className="text-sm text-gray-600">Tipos Mapeados</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-gray-600">Escala Likert</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Centros Base</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6" />
                    Base Científica Internacional
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-semibold text-green-700 mb-1">George Ivanovich Gurdjieff (1866-1949)</p>
                      <p className="text-sm text-gray-600">Introduziu o Eneagrama no Ocidente como sistema de autoconhecimento e desenvolvimento espiritual</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-700 mb-1">Oscar Ichazo (1931-2020)</p>
                      <p className="text-sm text-gray-600">Sistematizou os 9 tipos de personalidade e suas fixações psicológicas fundamentais</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <p className="font-semibold text-purple-700 mb-1">Claudio Naranjo (1932-2019)</p>
                      <p className="text-sm text-gray-600">Psiquiatra chileno que integrou o Eneagrama à psicologia moderna e terapia gestáltica</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-200">
                      <p className="font-semibold text-indigo-700 mb-1">Don Richard Riso & Russ Hudson</p>
                      <p className="text-sm text-gray-600">Criadores do RHETI e principais pesquisadores contemporâneos do Eneagrama científico</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Validação Científica
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm"><strong>Psicologia Transpessoal:</strong> Validado por estudos em desenvolvimento humano integral</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm"><strong>Neurociência:</strong> Correlações identificadas com padrões neurais e comportamentais</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm"><strong>Psicologia Organizacional:</strong> Aplicado em desenvolvimento de liderança e equipes</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm"><strong>Validação Internacional:</strong> Reconhecido por instituições de psicologia em 40+ países</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <Compass className="w-8 h-8" />
              Os 9 Tipos de Personalidade do Eneagrama
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Cada tipo representa um padrão único de motivações, medos, desejos e estratégias de enfrentamento, 
                organizados em três centros de inteligência que determinam como processamos informações e tomamos decisões.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Centro Instintivo */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Centro Instintivo - Tipos 8, 9, 1
                </h3>
                <p className="text-gray-700 mb-6">Focados em controle, autonomia e resistência. Processam o mundo através do corpo e instintos.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {enneagramTypes.filter(type => [8, 9, 1].includes(type.number)).map((type) => (
                    <div key={type.number} className="bg-white p-6 rounded-lg border border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {type.number}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{type.name}</h4>
                          <p className="text-sm text-red-600 font-medium">{type.center}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500"><strong>Motivação:</strong> {type.motivation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Centro Emocional */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Centro Emocional - Tipos 2, 3, 4
                </h3>
                <p className="text-gray-700 mb-6">Focados em imagem, identidade e conexões emocionais. Processam o mundo através dos sentimentos.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {enneagramTypes.filter(type => [2, 3, 4].includes(type.number)).map((type) => (
                    <div key={type.number} className="bg-white p-6 rounded-lg border border-pink-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {type.number}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{type.name}</h4>
                          <p className="text-sm text-pink-600 font-medium">{type.center}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500"><strong>Motivação:</strong> {type.motivation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Centro Mental */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Centro Mental - Tipos 5, 6, 7
                </h3>
                <p className="text-gray-700 mb-6">Focados em segurança, planejamento e processamento mental. Processam o mundo através do pensamento.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {enneagramTypes.filter(type => [5, 6, 7].includes(type.number)).map((type) => (
                    <div key={type.number} className="bg-white p-6 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {type.number}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{type.name}</h4>
                          <p className="text-sm text-blue-600 font-medium">{type.center}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500"><strong>Motivação:</strong> {type.motivation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Aplicações do Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Mapeamento de personalidade profundo</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Integração com estilo de liderança</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Trilhas de desenvolvimento emocional</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Diagnóstico de equipes complementares</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Ferramenta para coaching e feedback</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Benefícios para a Organização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Gestão individualizada de talentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Melhoria na comunicação interpessoal</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Redução de conflitos em equipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Desenvolvimento de liderança eficaz</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Otimização de processos seletivos</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Resultados e Entregáveis na HumaniQ AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Painel Visual</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tipo central identificado</li>
                  <li>• Asas de influência</li>
                  <li>• Setas de stress e crescimento</li>
                  <li>• Gráfico radar personalizado</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Relatório PDF</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Perfil descritivo personalizado</li>
                  <li>• Análise de compatibilidade</li>
                  <li>• Sugestões de desenvolvimento</li>
                  <li>• Recomendações específicas</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Análise Cruzada</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Integração com outros testes</li>
                  <li>• Mapa de motivação</li>
                  <li>• Estilo de liderança</li>
                  <li>• Perfil comportamental</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Interpretação dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h4 className="font-semibold text-purple-700 mb-1">Tipo Predominante</h4>
                <p className="text-sm text-gray-600">Personalidade central identificada com base nas maiores pontuações</p>
              </div>
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-700 mb-1">Asas de Influência</h4>
                <p className="text-sm text-gray-600">Tipos adjacentes que influenciam seu comportamento (ex.: 3w2 ou 3w4)</p>
              </div>
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-semibold text-red-700 mb-1">Seta de Stress</h4>
                <p className="text-sm text-gray-600">Comportamentos que emergem em momentos de sobrecarga emocional</p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-semibold text-green-700 mb-1">Seta de Crescimento</h4>
                <p className="text-sm text-gray-600">Qualidades a desenvolver para equilíbrio e desenvolvimento pessoal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Como Responder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                Leia cada afirmação com atenção e reflita sobre como ela se aplica a você
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                Responda com base em como você realmente é, não como gostaria de ser
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                Use a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente)
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                Seja honesto e autêntico em suas respostas para obter resultados precisos
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">5.</span>
                Não há respostas certas ou erradas, apenas diferentes tipos de personalidade
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/psicossociais')}
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button 
            onClick={() => router.push('/colaborador/psicossociais/humaniq-eneagrama')}
            className="bg-purple-600 hover:bg-purple-700 px-6"
          >
            Iniciar Teste
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}