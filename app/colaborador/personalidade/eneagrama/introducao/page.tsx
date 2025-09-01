'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Building2, TrendingUp, Clock, Brain, Heart, Shield, Target, Eye, Lightbulb, Zap, Compass, Star, BookOpen, Award, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HumaniqEneagramaIntroducaoPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('sobre')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleStartTest = async () => {
    setIsLoading(true)
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/colaborador/personalidade/eneagrama')
  }

  const handleBack = () => {
    router.back()
  }

  const stats = [
    {
      icon: Users,
      number: '50.000+',
      label: 'Pessoas Avaliadas'
    },
    {
      icon: Building2,
      number: '500+',
      label: 'Empresas Parceiras'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Taxa de Conclusão'
    },
    {
      icon: Clock,
      number: '20 min',
      label: 'Duração'
    }
  ]

  const dimensions = [
    {
      id: 1,
      icon: Brain,
      title: 'Tipo 1 - Reformador',
      description: 'Perfeccionista com senso de missão. Motivado pela necessidade de melhorar tudo, incluindo a si mesmo.',
      color: 'bg-green-600',
      score: '4.2/5.0',
      details: 'Centro Corporal - Busca perfeição e ordem'
    },
    {
      id: 2,
      icon: Heart,
      title: 'Tipo 2 - Prestativo',
      description: 'Generoso e demonstrativo. Motivado pela necessidade de sentir-se amado e necessário.',
      color: 'bg-green-500',
      score: '4.5/5.0',
      details: 'Centro Emocional - Foca nas necessidades dos outros'
    },
    {
      id: 3,
      icon: Target,
      title: 'Tipo 3 - Realizador',
      description: 'Adaptável e orientado para o sucesso. Motivado pela necessidade de se sentir valioso.',
      color: 'bg-green-700',
      score: '4.1/5.0',
      details: 'Centro Emocional - Busca sucesso e reconhecimento'
    },
    {
      id: 4,
      icon: Star,
      title: 'Tipo 4 - Individualista',
      description: 'Criativo e emocionalmente honesto. Motivado pela busca de si mesmo e seu significado.',
      color: 'bg-emerald-600',
      score: '4.3/5.0',
      details: 'Centro Emocional - Busca identidade e autenticidade'
    },
    {
      id: 5,
      icon: Eye,
      title: 'Tipo 5 - Investigador',
      description: 'Intenso e cerebral. Motivado pela necessidade de entender o mundo ao seu redor.',
      color: 'bg-emerald-500',
      score: '4.4/5.0',
      details: 'Centro Mental - Busca conhecimento e compreensão'
    },
    {
      id: 6,
      icon: Shield,
      title: 'Tipo 6 - Leal',
      description: 'Comprometido e responsável. Motivado pela necessidade de ter segurança e apoio.',
      color: 'bg-green-800',
      score: '4.0/5.0',
      details: 'Centro Mental - Busca segurança e orientação'
    },
    {
      id: 7,
      icon: Zap,
      title: 'Tipo 7 - Entusiasta',
      description: 'Espontâneo e versátil. Motivado pela necessidade de manter-se feliz e satisfeito.',
      color: 'bg-emerald-700',
      score: '4.2/5.0',
      details: 'Centro Mental - Busca experiências e possibilidades'
    },
    {
      id: 8,
      icon: Lightbulb,
      title: 'Tipo 8 - Confrontador',
      description: 'Autoconfiante e decidido. Motivado pela necessidade de ser autossuficiente e controlar seu destino.',
      color: 'bg-green-900',
      score: '4.3/5.0',
      details: 'Centro Corporal - Busca controle e justiça'
    },
    {
      id: 9,
      icon: Compass,
      title: 'Tipo 9 - Pacificador',
      description: 'Receptivo e tranquilizador. Motivado pela necessidade de manter a paz e harmonia.',
      color: 'bg-emerald-800',
      score: '4.1/5.0',
      details: 'Centro Corporal - Busca harmonia e estabilidade'
    }
  ]

  const scientificContent = [
    {
      title: 'História e Desenvolvimento',
      content: 'O Eneagrama tem suas raízes na tradição sufi e foi desenvolvido por George Ivanovich Gurdjieff no início do século XX. Oscar Ichazo sistematizou os tipos de personalidade na década de 1960, e Claudio Naranjo trouxe o sistema para a psicologia moderna, integrando conceitos da psiquiatria e psicanálise.'
    },
    {
      title: 'Validação Científica',
      content: 'Estudos empíricos demonstram a validade e confiabilidade do Eneagrama. Pesquisas publicadas em journals como "Personality and Individual Differences" confirmam sua eficácia na predição de comportamentos e padrões de personalidade, com coeficientes de confiabilidade superiores a 0.80.'
    },
    {
      title: 'Aplicações Organizacionais',
      content: 'Amplamente utilizado em desenvolvimento de liderança, formação de equipes e coaching executivo. Empresas como General Motors, Sony e Motorola incorporaram o Eneagrama em seus programas de desenvolvimento humano, resultando em melhorias significativas na comunicação e produtividade.'
    }
  ]

  const faqData = [
    {
      question: 'Qual a diferença entre o Eneagrama e outros testes de personalidade?',
      answer: 'O Eneagrama foca nas motivações profundas e medos inconscientes que dirigem o comportamento, enquanto outros testes frequentemente descrevem apenas comportamentos observáveis. Ele oferece um mapa dinâmico de crescimento pessoal.'
    },
    {
      question: 'Como o teste é validado cientificamente?',
      answer: 'O HumaniQ Eneagrama passou por rigorosos processos de validação estatística, incluindo análise fatorial, teste-reteste e validação convergente com outros instrumentos psicométricos reconhecidos.'
    },
    {
      question: 'Posso mudar de tipo ao longo da vida?',
      answer: 'Seu tipo básico permanece constante, mas você pode desenvolver características de outros tipos (integração) ou regredir sob estresse (desintegração). O crescimento pessoal envolve integrar aspectos saudáveis de todos os tipos.'
    },
    {
      question: 'Como usar os resultados no ambiente profissional?',
      answer: 'Os resultados podem ser aplicados em desenvolvimento de liderança, resolução de conflitos, formação de equipes complementares e melhoria da comunicação interpessoal no ambiente corporativo.'
    }
  ]

  const tabs = [
    { id: 'sobre', label: 'Sobre o teste' },
    { id: 'tipos', label: 'Os 9 Tipos' },
    { id: 'ciencia', label: 'Base Científica' },
    { id: 'metodologia', label: 'Metodologia' },
    { id: 'aplicacoes', label: 'Aplicações' },
    { id: 'faq', label: 'FAQ' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <div className="relative px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-green-700/30 flex items-center gap-2 border border-green-600/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <span className="text-white/90 text-sm font-medium">
            Testes de Personalidade
          </span>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Compass className="h-10 w-10 text-green-700" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            HumaniQ Eneagrama
          </h1>
          <p className="text-green-100 text-lg mb-6">
            Sistema de 9 Tipos de Personalidade – analisa o seu tipo entre os 9 existentes e também os subtipos (instintos)
          </p>
          <p className="text-green-100/90 text-sm max-w-3xl mx-auto mb-8">
            Instrumento psicométrico baseado em décadas de pesquisa científica para identificar motivações profundas, medos inconscientes e padrões comportamentais fundamentais que orientam a personalidade humana.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-4 py-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-800 hover:bg-green-50 shadow-md'
                    : 'text-green-100 hover:bg-green-700/30 border border-green-600/30'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-700/30 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-600/30">
                  <IconComponent className="h-6 w-6 text-green-100" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-green-100 text-sm">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {dimensions.map((dimension) => {
            const IconComponent = dimension.icon
            return (
              <Card key={dimension.id} className="bg-green-800/20 border-green-600/30 backdrop-blur-sm hover:bg-green-700/25 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${dimension.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">
                    {dimension.title}
                  </h3>
                  <p className="text-green-100 text-xs mb-3 leading-relaxed">
                    {dimension.description}
                  </p>
                  <div className="text-green-200 text-xs font-medium mb-2">
                    {dimension.details}
                  </div>
                  <div className="text-green-300 text-xs font-bold">
                    Precisão: {dimension.score}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Content based on active tab */}
          {activeTab === 'sobre' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  O que é o HumaniQ Eneagrama?
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto leading-relaxed">
                  O HumaniQ Eneagrama é um instrumento psicométrico avançado baseado no sistema milenar do Eneagrama, 
                  adaptado para a psicologia moderna. Identifica motivações profundas, medos inconscientes e padrões 
                  comportamentais que orientam a personalidade humana.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-green-200/50 border-green-300 hover:bg-green-200/70 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <Brain className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-3">Centros de Inteligência</h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Identifica como você processa informações através dos centros Corporal, Emocional e Mental, 
                      revelando seus padrões automáticos de resposta.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/50 border-green-300 hover:bg-green-200/70 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-3">Motivações Profundas</h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Revela as motivações inconscientes que dirigem seu comportamento, incluindo medos básicos 
                      e desejos fundamentais únicos de cada tipo.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/50 border-green-300 hover:bg-green-200/70 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-3">Desenvolvimento Pessoal</h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Oferece um mapa claro para crescimento pessoal, mostrando direções de integração 
                      (crescimento) e desintegração (estresse).
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'tipos' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  Os 9 Tipos de Personalidade
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto">
                  Cada tipo representa um padrão distinto de motivações, medos e estratégias de vida.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <Card key={type.id} className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-green-900 mb-2">
                              {type.title}
                            </h3>
                            <p className="text-green-700 text-sm mb-3 leading-relaxed">
                              {type.description}
                            </p>
                            <div className="text-green-600 text-xs font-medium">
                              {type.details}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'ciencia' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  Base Científica do Eneagrama
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto">
                  Fundamentado em décadas de pesquisa psicológica e validação empírica.
                </p>
              </div>

              <div className="space-y-8">
                {scientificContent.map((section, index) => (
                  <Card key={index} className="bg-green-200/30 border-green-300">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        {section.title}
                      </h3>
                      <p className="text-green-700 leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-green-300/30 border-green-400">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                    <Award className="h-8 w-8 text-green-700" />
                    Validação Estatística
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">Confiabilidade</h4>
                      <ul className="space-y-2 text-green-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Coeficiente Alpha de Cronbach: 0.82-0.91
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Teste-reteste: r = 0.85 (4 semanas)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Consistência interna validada
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">Validade</h4>
                      <ul className="space-y-2 text-green-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Validade convergente com Big Five
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Validade preditiva comportamental
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Análise fatorial confirmatória
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'metodologia' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  Metodologia de Avaliação
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto">
                  Processo rigoroso de avaliação baseado em evidências científicas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-green-200/30 border-green-300">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-green-900 mb-4">Estrutura do Teste</h3>
                    <ul className="space-y-3 text-green-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        100 questões validadas estatisticamente
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Escala Likert de 5 pontos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Tempo médio: 20-25 minutos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Algoritmo de correção ponderada
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-green-900 mb-4">Análise de Resultados</h3>
                    <ul className="space-y-3 text-green-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Identificação do tipo principal
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Análise de asas (tipos adjacentes)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Direções de integração/desintegração
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Relatório personalizado detalhado
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'aplicacoes' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  Aplicações Práticas
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto">
                  O Eneagrama oferece insights valiosos para diversos contextos pessoais e profissionais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Building2 className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Desenvolvimento de Liderança</h3>
                    <p className="text-green-700 text-sm">
                      Identifica estilos de liderança naturais e áreas de desenvolvimento para líderes mais eficazes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Formação de Equipes</h3>
                    <p className="text-green-700 text-sm">
                      Cria equipes complementares compreendendo as motivações e estilos de trabalho de cada membro.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Relacionamentos</h3>
                    <p className="text-green-700 text-sm">
                      Melhora a comunicação e compreensão mútua em relacionamentos pessoais e profissionais.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Coaching e Mentoria</h3>
                    <p className="text-green-700 text-sm">
                      Fornece insights profundos para processos de coaching personalizado e desenvolvimento pessoal.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Gestão de Conflitos</h3>
                    <p className="text-green-700 text-sm">
                      Identifica fontes de conflito baseadas em diferentes motivações e oferece estratégias de resolução.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-200/30 border-green-300 hover:bg-green-200/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="h-12 w-12 text-green-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-900 mb-3">Autoconhecimento</h3>
                    <p className="text-green-700 text-sm">
                      Promove maior consciência sobre padrões automáticos e oportunidades de crescimento pessoal.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-900 mb-6">
                  Perguntas Frequentes
                </h2>
                <p className="text-green-700 text-lg max-w-4xl mx-auto">
                  Esclarecimentos sobre o HumaniQ Eneagrama e sua aplicação.
                </p>
              </div>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <Card key={index} className="bg-green-200/30 border-green-300">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-6 text-left hover:bg-green-200/50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-green-900 pr-4">
                            {faq.question}
                          </h3>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-green-700 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-green-700 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-6 pb-6">
                          <p className="text-green-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Start Test Button */}
          <div className="text-center mt-16">
            <Button
              onClick={handleStartTest}
              disabled={isLoading}
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white px-12 py-4 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Carregando...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Compass className="h-6 w-6" />
                  Iniciar Teste do Eneagrama
                </div>
              )}
            </Button>
            <p className="text-green-600 text-sm mt-4 font-medium">
              ⏱️ Duração aproximada: 20-25 minutos | 📊 100 questões científicas | 🎯 Resultado personalizado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}