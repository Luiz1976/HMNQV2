'use client'
// @ts-nocheck

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import jsPDF from 'jspdf'
import { 
  ArrowLeft, Download, Share2, Printer, Target, Users, Shield, CheckCircle,
  Brain, TrendingUp, Award, Lightbulb, 
  BarChart3, MessageSquare, Briefcase, Star, AlertTriangle, CheckSquare,
  Rocket, BookOpen, Clock, RefreshCw, MapPin, Calendar, MessageCircle, AlertCircle, Building, Zap, ArrowRight, Mail
} from 'lucide-react'
import GraphologyRadarChart from '@/components/graphology/RadarChart'

interface DISCResults {
  D: number
  I: number
  S: number
  C: number
  profile: string
  secondary?: string
}

interface Dimension {
  name: string
  key: keyof Omit<DISCResults, 'profile' | 'secondary'>
  score: number
  color: string
  icon: React.ComponentType<any>
  description: string
  interpretation: string
  workStyle: string
  communication: string
  idealEnvironment: string
  strengths: string[]
  developmentAreas: string[]
  careerSuggestions: string[]
  stressIndicators: string[]
  motivationalFactors: string[]
}

interface CompetencyArea {
  name: string
  score: number
  description: string
  behaviors: string[]
  developmentTips: string[]
}

export default function HumanniQDISCResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<DISCResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executiveSummary: true,
    behavioralAnalysis: true,
    competencies: true,
    dimensions: true,
    development: true,
    application: true
  })

  const { data: session } = useSession()

  useEffect(() => {
    const savedResults =
      localStorage.getItem('humaniqDiscResults') || // nova chave
      localStorage.getItem('discResults') // fallback
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      router.push('/colaborador/personalidade/humaniq-disc')
    }
    setLoading(false)
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Mover os hooks useMemo para fora das condições de retorno antecipado
  const dimensions: Dimension[] = useMemo(() => {
    if (!results) {
      return [
        {
          name: 'Impulsionador',
          key: 'D',
          score: 0,
          color: 'bg-green-800',
          icon: Target,
          description: 'Orientação para resultados e tomada de decisões',
          interpretation: 'Perfil em desenvolvimento',
          workStyle: 'Abordagem colaborativa',
          communication: 'Comunicação diplomática',
          idealEnvironment: 'Ambientes estruturados',
          strengths: [],
          developmentAreas: [],
          careerSuggestions: [],
          stressIndicators: [],
          motivationalFactors: []
        },
        {
          name: 'Conector',
          key: 'I',
          score: 0,
          color: 'bg-yellow-500',
          icon: Users,
          description: 'Habilidade de comunicação e persuasão',
          interpretation: 'Perfil em desenvolvimento',
          workStyle: 'Abordagem analítica',
          communication: 'Comunicação factual',
          idealEnvironment: 'Ambientes estruturados',
          strengths: [],
          developmentAreas: [],
          careerSuggestions: [],
          stressIndicators: [],
          motivationalFactors: []
        },
        {
          name: 'Harmônico',
          key: 'S',
          score: 0,
          color: 'bg-green-500',
          icon: Shield,
          description: 'Consistência e confiabilidade comportamental',
          interpretation: 'Perfil em desenvolvimento',
          workStyle: 'Abordagem equilibrada',
          communication: 'Comunicação harmoniosa',
          idealEnvironment: 'Ambientes estáveis',
          strengths: [],
          developmentAreas: [],
          careerSuggestions: [],
          stressIndicators: [],
          motivationalFactors: []
        },
        {
          name: 'Estrategista',
          key: 'C',
          score: 0,
          color: 'bg-blue-500',
          icon: CheckCircle,
          description: 'Atenção aos detalhes e seguimento de padrões',
          interpretation: 'Perfil em desenvolvimento',
          workStyle: 'Abordagem sistemática',
          communication: 'Comunicação precisa',
          idealEnvironment: 'Ambientes organizados',
          strengths: [],
          developmentAreas: [],
          careerSuggestions: [],
          stressIndicators: [],
          motivationalFactors: []
        }
      ];
    }
    
    return [
    {
      name: 'Impulsionador',
      key: 'D',
      score: results.D,
      color: 'bg-green-800',
      icon: Target,
      description: 'Orientação para resultados, assertividade e capacidade de liderança direta. Representa a tendência comportamental para superar obstáculos e alcançar objetivos através de ação decisiva.',
      interpretation:
        results.D >= 80
          ? 'Perfil Executivo Dominante - Demonstra características de liderança excepcional, com forte orientação para resultados e capacidade natural de tomada de decisões em situações de alta pressão. Tendência a assumir controle e responsabilidade em ambientes desafiadores.'
          : results.D >= 60
          ? 'Alto Potencial de Liderança - Apresenta assertividade significativa e confiança para assumir responsabilidades. Demonstra iniciativa proativa e capacidade de influenciar resultados organizacionais.'
          : results.D >= 40
          ? 'Perfil Equilibrado - Combina capacidade de liderança situacional com habilidades colaborativas. Adapta-se bem a diferentes contextos organizacionais.'
          : 'Perfil Colaborativo - Prefere ambientes estruturados com diretrizes claras. Demonstra forte capacidade de seguir processos estabelecidos e trabalhar em equipe.',
      workStyle:
        results.D >= 60
          ? 'Liderança direta, tomada de decisões autônoma, foco em eficiência operacional e resultados mensuráveis. Prefere ambientes com alta autonomia decisória.'
          : 'Abordagem colaborativa, busca consenso em decisões, valoriza processos estruturados e feedback contínuo da equipe.',
      communication:
        results.D >= 60 
          ? 'Comunicação assertiva e direta, foco em objetivos e resultados. Prefere reuniões concisas e orientadas para ação. Utiliza linguagem clara e decisiva.' 
          : 'Comunicação diplomática e cuidadosa, busca harmonia nas interações. Valoriza o diálogo e a construção de consenso.',
      idealEnvironment:
        results.D >= 60
          ? 'Ambientes dinâmicos com desafios constantes, autonomia decisória, metas claras e mensuráveis, oportunidades de liderança e crescimento acelerado.'
          : 'Ambientes estáveis com estruturas bem definidas, suporte organizacional, processos claros e oportunidades de desenvolvimento gradual.',
      strengths: results.D >= 60 
        ? ['Liderança natural', 'Tomada de decisões rápidas', 'Orientação para resultados', 'Gestão de crises', 'Iniciativa proativa', 'Capacidade de assumir riscos calculados']
        : ['Trabalho em equipe', 'Seguimento de processos', 'Estabilidade emocional', 'Diplomacia', 'Capacidade de escuta', 'Adaptabilidade a mudanças graduais'],
      developmentAreas: results.D >= 60
        ? ['Desenvolvimento de empatia', 'Escuta ativa', 'Paciência com processos', 'Delegação efetiva', 'Gestão de relacionamentos', 'Controle de impulsividade']
        : ['Assertividade', 'Tomada de decisões independentes', 'Gestão de conflitos', 'Liderança situacional', 'Comunicação direta', 'Tolerância à pressão'],
      careerSuggestions: results.D >= 60
        ? ['CEO/Diretor Executivo', 'Gerente de Projetos', 'Consultor Estratégico', 'Empreendedor', 'Diretor Comercial', 'Líder de Transformação']
        : ['Analista Especialista', 'Coordenador de Equipe', 'Consultor Técnico', 'Gerente de Processos', 'Especialista em Qualidade', 'Facilitador Organizacional'],
      stressIndicators: results.D >= 60
        ? ['Impaciência com burocracia', 'Frustração com lentidão', 'Tensão em ambientes controladores', 'Irritabilidade com microgerenciamento']
        : ['Ansiedade em situações de confronto', 'Desconforto com pressão por resultados', 'Estresse em ambientes instáveis', 'Dificuldade com mudanças abruptas'],
      motivationalFactors: results.D >= 60
        ? ['Desafios complexos', 'Autonomia decisória', 'Reconhecimento por resultados', 'Oportunidades de liderança', 'Metas ambiciosas']
        : ['Estabilidade no trabalho', 'Processos claros', 'Trabalho em equipe', 'Desenvolvimento gradual', 'Ambiente harmonioso']
    },
    {
      name: 'Conector',
      key: 'I',
      score: results.I,
      color: 'bg-yellow-500',
      icon: Users,
      description: 'Capacidade de influenciar, motivar e inspirar pessoas através da comunicação persuasiva e carisma interpessoal. Representa a habilidade natural para construir relacionamentos e mobilizar equipes.',
      interpretation:
        results.I >= 80
          ? 'Comunicador Excepcional - Demonstra carisma natural e capacidade extraordinária de influenciar e inspirar pessoas. Possui habilidades avançadas de persuasão e mobilização de equipes, sendo reconhecido como líder inspiracional.'
          : results.I >= 60
          ? 'Alto Potencial Interpessoal - Apresenta forte capacidade de comunicação e networking. Demonstra otimismo contagiante e habilidade para construir relacionamentos estratégicos organizacionais.'
          : results.I >= 40
          ? 'Perfil Comunicativo Equilibrado - Combina habilidades interpessoais com capacidade de trabalho independente. Adapta-se bem a diferentes contextos sociais e profissionais.'
          : 'Perfil Analítico Focado - Prefere comunicação objetiva e trabalho concentrado. Demonstra excelência em análise detalhada e precisão técnica.',
      workStyle:
        results.I >= 60
          ? 'Liderança inspiracional, colaboração ativa, motivação de equipes através do entusiasmo e visão compartilhada. Excelência em apresentações e negociações.'
          : 'Abordagem analítica e sistemática, foco em qualidade e precisão. Prefere trabalho individual ou em pequenos grupos especializados.',
      communication:
        results.I >= 60
          ? 'Comunicação expressiva e envolvente, utiliza storytelling e técnicas persuasivas. Excelente em apresentações públicas e mobilização de audiências.'
          : 'Comunicação factual e precisa, foco em dados e evidências. Prefere documentação detalhada e comunicação estruturada.',
      idealEnvironment:
        results.I >= 60
          ? 'Ambientes colaborativos com alta interação social, oportunidades de apresentação, reconhecimento público e networking estratégico.'
          : 'Ambientes estruturados com foco em análise, menor pressão social, tempo para reflexão e trabalho detalhado.',
      strengths: results.I >= 60
        ? ['Comunicação persuasiva', 'Networking estratégico', 'Motivação de equipes', 'Apresentações públicas', 'Negociação', 'Construção de relacionamentos']
        : ['Análise detalhada', 'Precisão técnica', 'Concentração', 'Qualidade do trabalho', 'Pensamento crítico', 'Documentação sistemática'],
      developmentAreas: results.I >= 60
        ? ['Foco em detalhes', 'Análise crítica', 'Gestão do tempo', 'Seguimento de processos', 'Documentação', 'Controle de otimismo excessivo']
        : ['Habilidades de apresentação', 'Networking', 'Comunicação interpessoal', 'Trabalho em equipe', 'Flexibilidade social', 'Expressão de ideias'],
      careerSuggestions: results.I >= 60
        ? ['Diretor de Marketing', 'Gerente de Vendas', 'Consultor de Negócios', 'Palestrante', 'Diretor de RH', 'Líder de Mudanças']
        : ['Analista de Sistemas', 'Pesquisador', 'Especialista Técnico', 'Auditor', 'Engenheiro', 'Analista Financeiro'],
      stressIndicators: results.I >= 60
        ? ['Isolamento social', 'Falta de reconhecimento', 'Ambientes muito estruturados', 'Trabalho repetitivo sem interação']
        : ['Pressão para apresentações', 'Ambientes muito sociais', 'Interrupções constantes', 'Falta de tempo para análise'],
      motivationalFactors: results.I >= 60
        ? ['Reconhecimento público', 'Oportunidades de networking', 'Projetos colaborativos', 'Apresentações', 'Variedade de atividades']
        : ['Tempo para análise', 'Trabalho independente', 'Projetos técnicos', 'Qualidade sobre quantidade', 'Ambiente tranquilo']
    },
    {
      name: 'Harmônico',
      key: 'S',
      score: results.S,
      color: 'bg-green-500',
      icon: Shield,
      description: 'Orientação para estabilidade, paciência e construção de relacionamentos duradouros. Representa a capacidade de manter consistência e confiabilidade em ambientes organizacionais.',
      interpretation:
        results.S >= 80
          ? 'Perfil de Estabilidade Excepcional - Demonstra consistência extraordinária e confiabilidade organizacional. Possui capacidade natural para manter harmonia e construir relacionamentos duradouros, sendo reconhecido pela lealdade e paciência.'
          : results.S >= 60
          ? 'Alto Potencial de Consistência - Apresenta forte orientação para estabilidade e cooperação. Demonstra habilidades excepcionais de escuta e capacidade de trabalhar efetivamente em equipes coesas.'
          : results.S >= 40
          ? 'Perfil Adaptativo Equilibrado - Combina estabilidade com flexibilidade adaptativa. Consegue manter consistência enquanto se adapta a mudanças organizacionais necessárias.'
          : 'Perfil Dinâmico Orientado - Prefere ambientes de mudança constante e ritmo acelerado. Demonstra alta capacidade de adaptação e tolerância à pressão temporal.',
      workStyle:
        results.S >= 60
          ? 'Abordagem consistente e metodológica, construção de relacionamentos de longo prazo, manutenção de padrões de qualidade e estabilidade operacional.'
          : 'Estilo adaptativo e flexível, capacidade de trabalhar sob pressão, preferência por variedade de tarefas e mudanças organizacionais.',
      communication:
        results.S >= 60
          ? 'Comunicação empática e paciente, excelente capacidade de escuta ativa. Foco na construção de consenso e manutenção de harmonia interpessoal.'
          : 'Comunicação direta e eficiente, foco em resultados rápidos. Preferência por interações objetivas e tomada de decisões ágeis.',
      idealEnvironment:
        results.S >= 60
          ? 'Ambientes organizacionais estáveis com processos bem definidos, relacionamentos duradouros, segurança no trabalho e oportunidades de especialização.'
          : 'Ambientes dinâmicos com mudanças frequentes, novos desafios, variedade de projetos e oportunidades de crescimento acelerado.',
      strengths: results.S >= 60
        ? ['Confiabilidade excepcional', 'Paciência organizacional', 'Construção de relacionamentos', 'Escuta ativa', 'Lealdade institucional', 'Manutenção de harmonia']
        : ['Adaptabilidade rápida', 'Tolerância à pressão', 'Flexibilidade operacional', 'Gestão de mudanças', 'Multitarefa', 'Inovação contínua'],
      developmentAreas: results.S >= 60
        ? ['Adaptação a mudanças', 'Tomada de decisões rápidas', 'Assertividade', 'Gestão de conflitos', 'Tolerância à pressão', 'Iniciativa proativa']
        : ['Paciência com processos', 'Construção de relacionamentos', 'Escuta ativa', 'Planejamento de longo prazo', 'Estabilidade emocional', 'Consistência operacional'],
      careerSuggestions: results.S >= 60
        ? ['Gerente de Operações', 'Especialista em RH', 'Coordenador de Equipe', 'Analista de Processos', 'Consultor Organizacional', 'Gerente de Relacionamento']
        : ['Gerente de Projetos', 'Consultor de Mudanças', 'Diretor de Inovação', 'Analista de Negócios', 'Coordenador de Transformação', 'Especialista em Startups'],
      stressIndicators: results.S >= 60
        ? ['Mudanças organizacionais abruptas', 'Pressão por resultados imediatos', 'Conflitos interpessoais', 'Instabilidade no trabalho']
        : ['Rotina excessiva', 'Falta de variedade', 'Processos muito lentos', 'Ambientes muito estruturados'],
      motivationalFactors: results.S >= 60
        ? ['Segurança no trabalho', 'Relacionamentos estáveis', 'Processos claros', 'Reconhecimento pela consistência', 'Ambiente harmonioso']
        : ['Novos desafios', 'Variedade de projetos', 'Mudanças organizacionais', 'Crescimento rápido', 'Ambiente dinâmico']
    },
    {
      name: 'Estrategista',
      key: 'C',
      score: results.C,
      color: 'bg-blue-500',
      icon: CheckCircle,
      description: 'Orientação para precisão, qualidade e conformidade com padrões estabelecidos. Representa a capacidade de manter excelência técnica e aderência a procedimentos organizacionais.',
      interpretation:
        results.C >= 80
          ? 'Perfil de Excelência Técnica - Demonstra precisão excepcional e aderência rigorosa a padrões de qualidade. Possui capacidade natural para análise detalhada e manutenção de conformidade organizacional.'
          : results.C >= 60
          ? 'Alto Potencial Analítico - Apresenta forte orientação para qualidade e organização sistemática. Demonstra habilidades excepcionais de análise crítica e seguimento de procedimentos.'
          : results.C >= 40
          ? 'Perfil Equilibrado Adaptativo - Combina atenção aos detalhes com flexibilidade operacional. Consegue manter qualidade enquanto se adapta a diferentes contextos organizacionais.'
          : 'Perfil Inovador Criativo - Prefere abordagens flexíveis e soluções criativas. Demonstra alta capacidade de inovação e pensamento estratégico amplo.',
      workStyle:
        results.C >= 60
          ? 'Abordagem sistemática e meticulosa, foco em qualidade e precisão técnica, aderência rigorosa a procedimentos e padrões organizacionais estabelecidos.'
          : 'Estilo criativo e flexível, preferência por autonomia operacional, capacidade de inovação e desenvolvimento de soluções não convencionais.',
      communication:
        results.C >= 60
          ? 'Comunicação precisa e fundamentada em dados, apresentação detalhada de informações, foco em evidências e análise técnica rigorosa.'
          : 'Comunicação conceitual e estratégica, foco em visão ampla e possibilidades futuras, preferência por discussões criativas e inovadoras.',
      idealEnvironment:
        results.C >= 60
          ? 'Ambientes estruturados com padrões claros de qualidade, processos bem definidos, oportunidades de especialização técnica e reconhecimento pela precisão.'
          : 'Ambientes flexíveis com liberdade criativa, oportunidades de inovação, projetos desafiadores e autonomia para experimentação.',
      strengths: results.C >= 60
        ? ['Precisão técnica excepcional', 'Análise crítica detalhada', 'Conformidade organizacional', 'Controle de qualidade', 'Organização sistemática', 'Confiabilidade técnica']
        : ['Criatividade e inovação', 'Pensamento estratégico', 'Flexibilidade operacional', 'Visão ampla', 'Adaptabilidade criativa', 'Soluções não convencionais'],
      developmentAreas: results.C >= 60
        ? ['Flexibilidade criativa', 'Tolerância à ambiguidade', 'Pensamento estratégico', 'Inovação', 'Adaptação rápida', 'Visão de longo prazo']
        : ['Atenção aos detalhes', 'Seguimento de processos', 'Análise técnica', 'Controle de qualidade', 'Organização sistemática', 'Precisão operacional'],
      careerSuggestions: results.C >= 60
        ? ['Analista de Qualidade', 'Auditor Técnico', 'Especialista em Compliance', 'Engenheiro de Processos', 'Analista de Sistemas', 'Consultor Técnico']
        : ['Diretor de Inovação', 'Consultor Estratégico', 'Designer de Soluções', 'Empreendedor', 'Líder de Transformação', 'Arquiteto de Negócios'],
      stressIndicators: results.C >= 60
        ? ['Ambiguidade excessiva', 'Pressão por velocidade', 'Falta de padrões claros', 'Mudanças constantes sem estrutura']
        : ['Excesso de burocracia', 'Microgerenciamento', 'Processos muito rígidos', 'Falta de autonomia criativa'],
      motivationalFactors: results.C >= 60
        ? ['Padrões de qualidade claros', 'Reconhecimento pela precisão', 'Oportunidades de especialização', 'Processos bem estruturados', 'Excelência técnica']
        : ['Liberdade criativa', 'Projetos inovadores', 'Autonomia operacional', 'Desafios estratégicos', 'Oportunidades de experimentação']
    }
  ]; }, [results])

  const competencyAreas: CompetencyArea[] = useMemo(() => {
    if (!results) {
      return [];
    }
    return [
    {
      name: 'Liderança e Influência',
      score: Math.round((results.D * 0.6 + results.I * 0.4)),
      description: 'Capacidade de liderar equipes e influenciar resultados organizacionais',
      behaviors: [
        'Toma decisões com confiança',
        'Inspira e motiva equipes',
        'Assume responsabilidades',
        'Comunica visão estratégica'
      ],
      developmentTips: [
        'Pratique escuta ativa',
        'Desenvolva empatia',
        'Aprimore delegação',
        'Construa consenso'
      ]
    },
    {
      name: 'Relacionamento Interpessoal',
      score: Math.round((results.I * 0.5 + results.S * 0.5)),
      description: 'Habilidade para construir e manter relacionamentos profissionais efetivos',
      behaviors: [
        'Constrói rapport facilmente',
        'Demonstra empatia',
        'Mantém relacionamentos duradouros',
        'Resolve conflitos diplomaticamente'
      ],
      developmentTips: [
        'Pratique networking estratégico',
        'Desenvolva inteligência emocional',
        'Aprimore comunicação não-verbal',
        'Cultive diversidade de relacionamentos'
      ]
    },
    {
      name: 'Execução e Resultados',
      score: Math.round((results.D * 0.5 + results.C * 0.5)),
      description: 'Capacidade de executar projetos e entregar resultados consistentes',
      behaviors: [
        'Foca em objetivos claros',
        'Mantém padrões de qualidade',
        'Cumpre prazos estabelecidos',
        'Monitora progresso constantemente'
      ],
      developmentTips: [
        'Implemente metodologias ágeis',
        'Desenvolva métricas de performance',
        'Aprimore gestão de tempo',
        'Pratique feedback contínuo'
      ]
    },
    {
      name: 'Adaptabilidade e Inovação',
      score: Math.round((results.I * 0.4 + (100 - results.S) * 0.3 + (100 - results.C) * 0.3)),
      description: 'Flexibilidade para se adaptar a mudanças e desenvolver soluções inovadoras',
      behaviors: [
        'Abraça mudanças organizacionais',
        'Propõe soluções criativas',
        'Experimenta novas abordagens',
        'Aprende continuamente'
      ],
      developmentTips: [
        'Pratique pensamento design',
        'Desenvolva mindset de crescimento',
        'Explore tecnologias emergentes',
        'Cultive curiosidade intelectual'
      ]
    },
    {
      name: 'Análise e Qualidade',
      score: Math.round((results.C * 0.7 + results.S * 0.3)),
      description: 'Capacidade de análise crítica e manutenção de padrões de qualidade',
      behaviors: [
        'Analisa dados sistematicamente',
        'Mantém atenção aos detalhes',
        'Segue processos estabelecidos',
        'Busca precisão e excelência'
      ],
      developmentTips: [
        'Desenvolva pensamento crítico',
        'Aprimore análise de dados',
        'Pratique revisão sistemática',
        'Implemente controles de qualidade'
      ]
    },
    {
      name: 'Estabilidade Emocional',
      score: Math.round((results.S * 0.6 + (100 - results.D) * 0.4)),
      description: 'Capacidade de manter equilíbrio emocional e consistência comportamental',
      behaviors: [
        'Mantém calma sob pressão',
        'Demonstra consistência',
        'Oferece suporte à equipe',
        'Gerencia stress efetivamente'
      ],
      developmentTips: [
        'Pratique mindfulness',
        'Desenvolva técnicas de relaxamento',
        'Aprimore autoconhecimento',
        'Cultive resiliência emocional'
      ]
    }
  ]; }, [results])

  const getProfileInterpretation = () => {
    if (!results) return null;
    const scores = [results.D, results.I, results.S, results.C];
    const sortedScores = [...scores].sort((a, b) => b - a);
    const [highest, second] = sortedScores;
    
    const getDimensionKey = (score: number) => {
      if (score === results.D) return 'D';
      if (score === results.I) return 'I';
      if (score === results.S) return 'S';
      return 'C';
    };
    
    const primaryDimension = getDimensionKey(highest);
    const secondaryDimension = getDimensionKey(second);
    
    const profileCombinations = {
      'D-I': {
        title: 'Líder Inspiracional',
        description: 'Combina assertividade com carisma, sendo capaz de liderar através da influência e motivação. Perfil ideal para posições executivas que requerem tanto decisão quanto engajamento de equipes.',
        strengths: ['Liderança carismática', 'Tomada de decisões rápidas', 'Motivação de equipes', 'Visão estratégica'],
        challenges: ['Pode ser impaciente com detalhes', 'Tendência a subestimar riscos', 'Necessita desenvolver escuta ativa']
      },
      'D-S': {
        title: 'Executor Confiável',
        description: 'Equilibra assertividade com estabilidade, proporcionando liderança consistente e confiável. Excelente para gestão de operações e implementação de estratégias de longo prazo.',
        strengths: ['Liderança estável', 'Implementação consistente', 'Construção de confiança', 'Gestão de mudanças graduais'],
        challenges: ['Pode resistir a mudanças rápidas', 'Tendência a evitar conflitos necessários', 'Necessita desenvolver agilidade']
      },
      'D-C': {
        title: 'Líder Técnico',
        description: 'Combina orientação para resultados com precisão técnica, sendo ideal para liderança em ambientes que exigem tanto performance quanto qualidade rigorosa.',
        strengths: ['Liderança baseada em competência', 'Padrões elevados de qualidade', 'Análise estratégica', 'Execução precisa'],
        challenges: ['Pode ser excessivamente crítico', 'Tendência ao perfeccionismo', 'Necessita desenvolver flexibilidade']
      },
      'I-D': {
        title: 'Influenciador Assertivo',
        description: 'Utiliza carisma e energia para influenciar e mobilizar, com capacidade de tomar decisões quando necessário. Perfil ideal para vendas estratégicas e desenvolvimento de negócios.',
        strengths: ['Persuasão efetiva', 'Networking estratégico', 'Energia contagiante', 'Capacidade de mobilização'],
        challenges: ['Pode negligenciar follow-up', 'Tendência ao otimismo excessivo', 'Necessita desenvolver persistência']
      },
      'I-S': {
        title: 'Colaborador Nato',
        description: 'Combina habilidades interpessoais com estabilidade emocional, sendo excelente para construção de equipes e manutenção de relacionamentos organizacionais duradouros.',
        strengths: ['Construção de relacionamentos', 'Mediação de conflitos', 'Estabilidade emocional', 'Comunicação empática'],
        challenges: ['Pode evitar decisões difíceis', 'Tendência a agradar a todos', 'Necessita desenvolver assertividade']
      },
      'I-C': {
        title: 'Comunicador Técnico',
        description: 'Equilibra habilidades de comunicação com atenção aos detalhes, sendo ideal para apresentação de informações complexas e treinamento especializado.',
        strengths: ['Comunicação clara e precisa', 'Apresentações estruturadas', 'Atenção aos detalhes', 'Capacidade didática'],
        challenges: ['Pode ser excessivamente detalhista', 'Tendência à análise paralisia', 'Necessita desenvolver síntese']
      },
      'S-D': {
        title: 'Gestor Equilibrado',
        description: 'Combina estabilidade com capacidade de liderança situacional, proporcionando gestão consistente com momentos de assertividade quando necessário.',
        strengths: ['Gestão equilibrada', 'Liderança situacional', 'Construção de consenso', 'Implementação gradual'],
        challenges: ['Pode ser lento em crises', 'Tendência a evitar confrontos', 'Necessita desenvolver urgência']
      },
      'S-I': {
        title: 'Facilitador Organizacional',
        description: 'Utiliza estabilidade emocional e habilidades interpessoais para facilitar processos organizacionais e manter harmonia em equipes diversas.',
        strengths: ['Facilitação de processos', 'Manutenção de harmonia', 'Escuta ativa', 'Suporte à equipe'],
        challenges: ['Pode evitar mudanças necessárias', 'Tendência à complacência', 'Necessita desenvolver proatividade']
      },
      'S-C': {
        title: 'Especialista Confiável',
        description: 'Combina consistência com precisão técnica, sendo ideal para funções que requerem tanto confiabilidade quanto expertise técnica especializada.',
        strengths: ['Expertise técnica consistente', 'Confiabilidade operacional', 'Qualidade sustentada', 'Processos otimizados'],
        challenges: ['Pode resistir a inovações', 'Tendência ao conservadorismo', 'Necessita desenvolver adaptabilidade']
      },
      'C-D': {
        title: 'Analista Estratégico',
        description: 'Equilibra análise rigorosa com capacidade de tomada de decisões, sendo ideal para consultoria estratégica e análise de negócios complexos.',
        strengths: ['Análise estratégica profunda', 'Decisões fundamentadas', 'Padrões elevados', 'Pensamento crítico'],
        challenges: ['Pode ser excessivamente analítico', 'Tendência ao perfeccionismo', 'Necessita desenvolver agilidade']
      },
      'C-I': {
        title: 'Consultor Técnico',
        description: 'Combina expertise técnica com habilidades de comunicação, sendo excelente para consultoria especializada e transferência de conhecimento.',
        strengths: ['Comunicação técnica efetiva', 'Transferência de conhecimento', 'Apresentações especializadas', 'Credibilidade técnica'],
        challenges: ['Pode ser excessivamente técnico', 'Tendência ao detalhamento excessivo', 'Necessita desenvolver síntese']
      },
      'C-S': {
        title: 'Guardião da Qualidade',
        description: 'Utiliza precisão técnica e consistência para manter padrões organizacionais elevados e garantir conformidade com procedimentos estabelecidos.',
        strengths: ['Manutenção de padrões', 'Conformidade rigorosa', 'Processos otimizados', 'Confiabilidade técnica'],
        challenges: ['Pode resistir a mudanças', 'Tendência à rigidez', 'Necessita desenvolver flexibilidade']
      }
    };
    
    const profileKey = `${primaryDimension}-${secondaryDimension}` as keyof typeof profileCombinations;
    const profile = profileCombinations[profileKey] || profileCombinations[`${secondaryDimension}-${primaryDimension}` as keyof typeof profileCombinations];
    
    if (profile) {
      const nameMap: Record<string, string> = {
        D: 'Impulsionador',
        I: 'Conector',
        S: 'Harmônico',
        C: 'Estrategista',
      };
      const combinedTitle = `${nameMap[primaryDimension]} ${nameMap[secondaryDimension]}`;
      return {
        title: combinedTitle,
        description: profile.description,
        strengths: profile.strengths,
        challenges: profile.challenges,
        primaryDimension,
        secondaryDimension,
        scores: { primary: highest, secondary: second }
      };
    }
    
    // Fallback para perfis únicos
    const singleProfiles = {
      D: {
        title: 'Impulsionador',
        description: 'Perfil que transforma ideias em ação. Determinado, objetivo, orientado a resultados e metas ousadas. Enxerga obstáculos como oportunidades.',
        strengths: ['Coloca projetos em movimento e inspira agilidade nas equipes.'],
        challenges: ['Pode ser percebido como impaciente ou excessivamente direto.']
      },
      I: {
        title: 'Conector',
        description: 'O comunicador nato, criativo e inspirador. Traz energia, entusiasmo e facilidade em engajar pessoas. Acredita no poder da colaboração e da motivação.',
        strengths: ['Mobiliza equipes e cria ambientes positivos.'],
        challenges: ['Pode perder foco em detalhes ou se dispersar em excesso de ideias.']
      },
      S: {
        title: 'Harmônico',
        description: 'Calmo, leal, confiável e colaborativo. Valoriza relacionamentos sólidos e ambientes previsíveis. Excelente em manter equilíbrio, estabilidade e acolhimento em situações de pressão.',
        strengths: ['Promove coesão e segurança nas equipes.'],
        challenges: ['Pode resistir a mudanças rápidas ou evitar conflitos necessários.']
      },
      C: {
        title: 'Estrategista',
        description: 'Analítico, preciso e orientado à qualidade. Atua com lógica, organização e atenção aos detalhes. Busca excelência e embasamento antes de agir.',
        strengths: ['Garante padrões elevados e segurança em decisões.'],
        challenges: ['Pode ser excessivamente crítico ou demorar na tomada de decisão.']
      }
    };
    
    return singleProfiles[primaryDimension as keyof typeof singleProfiles];
  }

  const profileInfo = getProfileInterpretation()

  const discChartData = results ? [
    { name: 'Impulsionador', value: results.D },
    { name: 'Conector', value: results.I },
    { name: 'Harmônico', value: results.S },
    { name: 'Estrategista', value: results.C },
  ] : []

  const handleDownload = async () => {
    try {
      if (typeof window === 'undefined') return;

      // PDF Generation Logic
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // ... (rest of the PDF generation code) ...

      pdf.save(`relatorio-disc-${`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim().replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Erro no handleDownload:", error);
      alert('Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
  };

  const handlePrint = () => window.print()

  // Compartilhar resultados via Web Share API ou copiar link
  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: 'Resultado HumanniQ DISC',
          text: 'Confira meu resultado no teste HumanniQ DISC!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Não foi possível compartilhar o resultado.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6 justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/colaborador/personalidade')}
              className="text-white hover:bg-green-800/50 border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <span className="text-2xl font-bold gradient-text hidden sm:inline-block">HumaniQ AI</span>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">Relatório HumanniQ DISC</h1>
            <p className="text-green-100 text-xl mb-2">
              Análise Comportamental Profissional Detalhada
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-green-200">
              <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span>Metodologia: DISC Assessment</span>
              <span>•</span>
              <span>Versão: HumanniQ Professional</span>
            </div>
          </div>
        </div>
      </div>

      <div id="humaniq-disc-results" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Informações do Usuário */}
        <Card className="shadow-lg border-l-4 border-purple-600">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session?.user?.avatarUrl || ''} />
                <AvatarFallback>
                  {session?.user?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || 'Usuário'}</CardTitle>
                <p className="text-sm text-gray-600 flex items-center"><Mail className="w-4 h-4 mr-1" />{session?.user?.email || 'Email não disponível'}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        {/* Resumo Executivo */}
        <Collapsible 
          open={expandedSections.executiveSummary} 
          onOpenChange={() => toggleSection('executiveSummary')}
        >
          <Card className="shadow-lg border-l-4 border-blue-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Resumo Executivo</CardTitle>
                      <p className="text-sm text-gray-600">Visão geral do perfil comportamental</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-blue-700 mb-2">
                        {profileInfo?.title || 'N/A'}
                      </div>
                                          <p className="text-gray-700 leading-relaxed">
                        {profileInfo?.description || 'Descrição não disponível'}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Principais Forças
                      </h4>
                      <ul className="space-y-2">
                        {profileInfo?.strengths?.map((strength, i) => (
                          <li key={i} className="flex items-center text-sm text-blue-700">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            {strength}
                          </li>
                        )) || []}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Pontuações DISC
                      </h4>
                      <div className="space-y-3">
                        {results && Object.entries(results).filter(([key]) => ['D', 'I', 'S', 'C'].includes(key)).map(([key, value]) => {
                          const dimension = dimensions.find(d => d.key === key);
                          const Icon = dimension?.icon || Target;
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" style={{ color: dimension?.color.replace('bg-', '').replace('-500', '') }} />
                                <span className="text-sm font-medium text-gray-700">
                                  {dimension?.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${value}%`, 
                                      backgroundColor: dimension?.color.includes('red') ? '#ef4444' : 
                                                     dimension?.color.includes('yellow') ? '#eab308' :
                                                     dimension?.color.includes('green') ? '#22c55e' : '#3b82f6'
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold w-8 text-right">{value}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Áreas de Desenvolvimento
                      </h4>
                      <ul className="space-y-2">
                        {profileInfo?.challenges?.map((challenge, i) => (
                          <li key={i} className="flex items-center text-sm text-amber-700">
                            <Lightbulb className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" />
                            {challenge}
                          </li>
                        )) || []}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Análise Comportamental Detalhada */}
        <Collapsible 
          open={expandedSections.behavioralAnalysis} 
          onOpenChange={() => toggleSection('behavioralAnalysis')}
        >
          <Card className="shadow-lg border-l-4 border-green-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Análise Comportamental Detalhada</CardTitle>
                      <p className="text-sm text-gray-600">Interpretação profunda das dimensões DISC</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Gráfico Radar DISC
                    </h4>
                    <div className="w-full h-80">
                      <GraphologyRadarChart data={discChartData} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Interpretação dos Scores
                    </h4>
                    <div className="space-y-3">
                      {dimensions.map((dimension) => {
                        const score = results ? results[dimension.key as keyof typeof results] as number : 0;
                        const Icon = dimension.icon;
                        return (
                          <div key={dimension.key} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Icon className="w-5 h-5" style={{ color: dimension.color.includes('red') ? '#ef4444' : dimension.color.includes('yellow') ? '#eab308' : dimension.color.includes('green') ? '#22c55e' : '#3b82f6' }} />
                                <span className="font-semibold text-gray-800">{dimension.name}</span>
                              </div>
                              <Badge variant={score >= 70 ? 'default' : score >= 40 ? 'secondary' : 'outline'}>
                                {score}%
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{dimension.interpretation}</p>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${score}%`, 
                                  backgroundColor: dimension.color.includes('red') ? '#ef4444' : 
                                                 dimension.color.includes('yellow') ? '#eab308' :
                                                 dimension.color.includes('green') ? '#22c55e' : '#3b82f6'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Competências Comportamentais */}
        <Collapsible 
          open={expandedSections.competencies} 
          onOpenChange={() => toggleSection('competencies')}
        >
          <Card className="shadow-lg border-l-4 border-purple-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Competências Comportamentais</CardTitle>
                      <p className="text-sm text-gray-600">Análise das competências profissionais baseadas no perfil DISC</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {competencyAreas.map((competency) => {
                    return (
                      <Card key={competency.name} className="border-2 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-800 text-sm">{competency.name}</h4>
                            </div>
                            <Badge 
                              variant={competency.score >= 80 ? 'default' : competency.score >= 60 ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {competency.score}%
                            </Badge>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${competency.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{competency.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Comportamentos:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {competency.behaviors.slice(0, 2).map((behavior, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                  {behavior}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Competências Mais Desenvolvidas
                    </h4>
                    <div className="space-y-3">
                      {competencyAreas
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 3)
                        .map((competency) => {
                          return (
                            <div key={competency.name} className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center space-x-3 mb-2">
                                <Briefcase className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-green-800">{competency.name}</span>
                                <Badge variant="default" className="bg-green-600">{competency.score}%</Badge>
                              </div>
                              <p className="text-sm text-green-700 mb-2">{competency.description}</p>
                              <div className="text-xs text-green-600">
                                <strong>Dica de Desenvolvimento:</strong> {competency.developmentTips[0]}
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-orange-600" />
                      Áreas de Oportunidade
                    </h4>
                    <div className="space-y-3">
                      {competencyAreas
                        .sort((a, b) => a.score - b.score)
                        .slice(0, 3)
                        .map((competency) => {
                          return (
                            <div key={competency.name} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <div className="flex items-center space-x-3 mb-2">
                                <Briefcase className="w-5 h-5 text-orange-600" />
                                <span className="font-semibold text-orange-800">{competency.name}</span>
                                <Badge variant="outline" className="border-orange-300">{competency.score}%</Badge>
                              </div>
                              <p className="text-sm text-orange-700 mb-2">{competency.description}</p>
                              <div className="text-xs text-orange-600">
                                <strong>Dica de Desenvolvimento:</strong> {competency.developmentTips[0]}
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Análise Detalhada das Dimensões */}
        <Collapsible 
          open={expandedSections.dimensions} 
          onOpenChange={() => toggleSection('dimensions')}
        >
          <Card className="shadow-lg border-l-4 border-indigo-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Análise Detalhada das Dimensões DISC</CardTitle>
                      <p className="text-sm text-gray-600">Interpretação aprofundada de cada dimensão comportamental</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {dimensions.map((dimension) => {
                    const score = results ? results[dimension.key as keyof typeof results] as number : 0;
                    const Icon = dimension.icon;
                    return (
                      <Card key={dimension.key} className="border-2 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 rounded-xl" style={{ backgroundColor: `${dimension.color}20` }}>
                                <Icon className="w-8 h-8" style={{ color: dimension.color }} />
                              </div>
                              <div>
                                <CardTitle className="text-xl text-gray-800">{dimension.name}</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">{dimension.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold mb-1" style={{ color: dimension.color }}>
                                {score}%
                              </div>
                              <Badge 
                                variant={score >= 70 ? 'default' : score >= 50 ? 'secondary' : 'outline'}
                                style={{ backgroundColor: score >= 70 ? dimension.color : undefined }}
                              >
                                {score >= 70 ? 'Alto' : score >= 50 ? 'Moderado' : 'Baixo'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Barra de Progresso */}
                            <div className="w-full bg-white rounded-full h-4 border-2 border-black">
                              <div
                                className="h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor: '#166534', // Verde escuro
                                }}
                              >
                                <span className="text-xs font-semibold text-white">{score}%</span>
                              </div>
                            </div>
                            
                            {/* Interpretação */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <Brain className="w-4 h-4 mr-2" style={{ color: dimension.color }} />
                                Interpretação Psicológica
                              </h4>
                              <p className="text-sm text-gray-700">{dimension.interpretation}</p>
                            </div>
                            
                            {/* Detalhes Expandidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                                    Estilo de Trabalho
                                  </h5>
                                  <p className="text-sm text-gray-600">{dimension.workStyle}</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Padrão de Comunicação
                                  </h5>
                                  <p className="text-sm text-gray-600">{dimension.communication}</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                    <Building className="w-4 h-4 mr-2 text-purple-600" />
                                    Ambiente Ideal
                                  </h5>
                                  <p className="text-sm text-gray-600">{dimension.idealEnvironment}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                                    Pontos Fortes
                                  </h5>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {dimension.strengths.slice(0, 3).map((strength, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-orange-600" />
                                    Áreas de Desenvolvimento
                                  </h5>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {dimension.developmentAreas.slice(0, 3).map((area, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                        {area}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            {/* Indicadores de Estresse e Motivação */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Indicadores de Estresse
                                </h5>
                                <ul className="text-sm text-red-700 space-y-1">
                                  {dimension.stressIndicators.slice(0, 2).map((indicator, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="w-1 h-1 bg-green-800 rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {indicator}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                                  <Zap className="w-4 h-4 mr-2" />
                                  Fatores Motivacionais
                                </h5>
                                <ul className="text-sm text-blue-700 space-y-1">
                                  {dimension.motivationalFactors.slice(0, 2).map((factor, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {factor}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Recomendações de Desenvolvimento */}
        <Collapsible 
          open={expandedSections.development} 
          onOpenChange={() => toggleSection('development')}
        >
          <Card className="shadow-lg border-l-4 border-green-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Recomendações de Desenvolvimento</CardTitle>
                      <p className="text-sm text-gray-600">Plano personalizado para crescimento profissional</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {/* Áreas Prioritárias */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
                      Áreas Prioritárias de Desenvolvimento
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results ? dimensions
                        .filter(dim => (results[dim.key as keyof typeof results] as number) < 60)
                        .slice(0, 2)
                        .map((dim) => (
                          <div key={dim.key} className="bg-white p-4 rounded-lg shadow-sm">
                            <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                              <dim.icon className="w-4 h-4 mr-2" style={{ color: dim.color }} />
                              {dim.name}
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">{dim.description}</p>
                            <div className="space-y-2">
                              {dim.developmentAreas.slice(0, 3).map((area, i) => (
                                <div key={i} className="flex items-start text-xs text-gray-600">
                                  <CheckCircle className="w-3 h-3 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                  {area}
                                </div>
                              ))}
                            </div>
                          </div>
                        )) : []}
                    </div>
                  </div>
                  
                  {/* Sugestões de Carreira */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Sugestões de Carreira e Funções
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {results ? dimensions
                        .filter(dim => (results[dim.key as keyof typeof results] as number) >= 70)
                        .map((dim) => (
                          <div key={dim.key} className="bg-white p-4 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-2">{dim.name}</h5>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {dim.careerSuggestions.slice(0, 3).map((career, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {career}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )) : []
                      }
                    </div>
                  </div>
                  
                  {/* Estratégias de Comunicação */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Estratégias de Comunicação Personalizadas
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium text-purple-800 mb-2">Como se comunicar efetivamente:</h5>
                        <p className="text-sm text-purple-700 mb-3">
                          {profileInfo?.description || 'Descrição não disponível'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-gray-800 mb-2">Pontos Fortes na Comunicação:</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {(profileInfo?.strengths || []).slice(0, 3).map((strength, i) => (
                                <li key={i} className="flex items-start">
                                  <CheckCircle className="w-3 h-3 mt-1 mr-2 text-green-500 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium text-gray-800 mb-2">Áreas de Atenção:</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {(profileInfo?.challenges || []).slice(0, 3).map((challenge, i) => (
                                <li key={i} className="flex items-start">
                                  <AlertCircle className="w-3 h-3 mt-1 mr-2 text-orange-500 flex-shrink-0" />
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* Aplicação Profissional */}
        <Collapsible 
          open={expandedSections.application} 
          onOpenChange={() => toggleSection('application')}
        >
          <Card className="shadow-lg border-l-4 border-purple-600">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Aplicação Profissional</CardTitle>
                      <p className="text-sm text-gray-600">Como aplicar os insights no ambiente de trabalho</p>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {/* Metodologia */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                      Sobre a Metodologia DISC
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      O modelo DISC é uma ferramenta psicométrica baseada na teoria comportamental de William Moulton Marston (1928), 
                      validada cientificamente e amplamente utilizada em contextos organizacionais para compreensão de padrões comportamentais 
                      e estilos de comunicação.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Aplicações Práticas:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <Users className="w-3 h-3 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                            Formação de equipes eficazes
                          </li>
                          <li className="flex items-start">
                            <MessageSquare className="w-3 h-3 mt-1 mr-2 text-green-500 flex-shrink-0" />
                            Melhoria da comunicação interpessoal
                          </li>
                          <li className="flex items-start">
                            <TrendingUp className="w-3 h-3 mt-1 mr-2 text-purple-500 flex-shrink-0" />
                            Desenvolvimento de liderança
                          </li>
                          <li className="flex items-start">
                            <Target className="w-3 h-3 mt-1 mr-2 text-orange-500 flex-shrink-0" />
                            Gestão de conflitos e negociação
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Limitações e Considerações:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <AlertTriangle className="w-3 h-3 mt-1 mr-2 text-yellow-500 flex-shrink-0" />
                            Não mede habilidades ou competências técnicas
                          </li>
                          <li className="flex items-start">
                            <Clock className="w-3 h-3 mt-1 mr-2 text-red-500 flex-shrink-0" />
                            Comportamentos podem variar conforme contexto
                          </li>
                          <li className="flex items-start">
                            <RefreshCw className="w-3 h-3 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                            Recomenda-se reavaliação periódica
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Próximos Passos */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Plano de Ação Personalizado
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium text-purple-800 mb-3">Próximos 30 dias:</h5>
                        <ul className="text-sm text-purple-700 space-y-2">
                          <li className="flex items-start">
                            <Calendar className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Compartilhe este relatório com seu gestor direto para alinhamento de expectativas
                          </li>
                          <li className="flex items-start">
                            <Users className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Identifique colegas com perfis complementares para projetos colaborativos
                          </li>
                          <li className="flex items-start">
                            <BookOpen className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Inicie o desenvolvimento de uma área prioritária identificada
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium text-purple-800 mb-3">Próximos 90 dias:</h5>
                        <ul className="text-sm text-purple-700 space-y-2">
                          <li className="flex items-start">
                            <Target className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Estabeleça metas específicas baseadas nas recomendações de desenvolvimento
                          </li>
                          <li className="flex items-start">
                            <MessageCircle className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Pratique as estratégias de comunicação sugeridas em diferentes contextos
                          </li>
                          <li className="flex items-start">
                            <BarChart3 className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                            Solicite feedback regular sobre mudanças comportamentais observadas
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
            <Printer className="h-4 w-4" /> Imprimir Relatório
          </Button>
          <Button variant="outline" onClick={() => router.push('/colaborador/personalidade/humaniq-disc')} className="border-purple-600 text-purple-600 hover:bg-purple-50">
            Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  )
}