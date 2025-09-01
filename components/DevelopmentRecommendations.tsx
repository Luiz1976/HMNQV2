'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Heart, 
  Briefcase, 
  Brain, 
  Compass,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb,
  Calendar,
  BarChart3,
  Globe,
  Award,
  Clock,
  Zap
} from 'lucide-react'

interface DevelopmentRecommendationsProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
}

// Dados de recomendações por tipo
const developmentData = {
  1: {
    name: 'O Perfeccionista',
    personalGrowth: {
      focus: 'Flexibilidade e Aceitação',
      practices: [
        'Pratique mindfulness para reduzir a autocrítica',
        'Estabeleça limites saudáveis entre perfeição e progresso',
        'Desenvolva tolerância a erros e imperfeições',
        'Cultive a paciência consigo mesmo e com outros'
      ],
      books: ['O Poder do Agora - Eckhart Tolle', 'Mindset - Carol Dweck'],
      activities: ['Meditação', 'Yoga', 'Journaling', 'Arte terapia'],
      onlineResources: [
        'Curso: "Mindfulness para Perfeccionistas" - Headspace',
        'Podcast: "The Perfectionism Project"',
        'App: Insight Timer (meditações guiadas)'
      ],
      actionPlan: {
        thirtyDays: 'Estabelecer rotina diária de 10 min de mindfulness',
        sixtyDays: 'Implementar técnica "bom o suficiente" em 3 projetos',
        ninetyDays: 'Desenvolver sistema de feedback construtivo para equipe'
      },
      metrics: [
        'Redução de 30% no tempo gasto revisando trabalhos',
        'Aumento da satisfação da equipe em 25%',
        'Diminuição do estresse auto-relatado'
      ]
    },
    professional: {
      strengths: ['Atenção aos detalhes', 'Organização', 'Ética de trabalho', 'Qualidade'],
      challenges: ['Perfeccionismo paralisante', 'Crítica excessiva', 'Rigidez'],
      recommendations: [
        'Defina critérios claros de "bom o suficiente"',
        'Pratique delegação e confiança na equipe',
        'Desenvolva habilidades de feedback construtivo',
        'Aprenda técnicas de gestão de tempo e priorização'
      ],
      idealRoles: ['Auditor', 'Editor', 'Arquiteto', 'Consultor de Qualidade']
    },
    relationships: {
      focus: 'Comunicação Empática',
      tips: [
        'Pratique expressar necessidades sem críticas',
        'Desenvolva tolerância às diferenças dos outros',
        'Aprenda a receber feedback sem defensividade',
        'Cultive a expressão de afeto e apreciação'
      ]
    }
  },
  2: {
    name: 'O Prestativo',
    personalGrowth: {
      focus: 'Autocuidado e Limites',
      practices: [
        'Identifique e expresse suas próprias necessidades',
        'Estabeleça limites saudáveis no cuidado com outros',
        'Desenvolva autocompaixão e autocuidado',
        'Pratique dizer "não" quando necessário'
      ],
      books: ['Boundaries - Henry Cloud', 'Self-Compassion - Kristin Neff'],
      activities: ['Terapia', 'Grupos de apoio', 'Hobbies pessoais', 'Exercícios'],
      onlineResources: [
        'Curso: "Estabelecendo Limites Saudáveis" - Coursera',
        'Podcast: "Self-Care for Caregivers"',
        'App: Sanvello (autocuidado e bem-estar)'
      ],
      actionPlan: {
        thirtyDays: 'Identificar e listar 5 necessidades pessoais não atendidas',
        sixtyDays: 'Praticar dizer "não" a 2 solicitações por semana',
        ninetyDays: 'Estabelecer rotina semanal de autocuidado de 3 horas'
      },
      metrics: [
        'Aumento de 40% no tempo dedicado a atividades pessoais',
        'Redução de 50% em sentimentos de ressentimento',
        'Melhoria na qualidade do sono e energia'
      ]
    },
    professional: {
      strengths: ['Empatia', 'Trabalho em equipe', 'Comunicação', 'Suporte'],
      challenges: ['Dificuldade em priorizar tarefas próprias', 'Burnout', 'Evitar conflitos'],
      recommendations: [
        'Desenvolva habilidades de assertividade',
        'Aprenda a equilibrar ajuda aos outros com responsabilidades próprias',
        'Pratique autoadvocacia e negociação',
        'Estabeleça métricas claras de sucesso pessoal'
      ],
      idealRoles: ['RH', 'Terapeuta', 'Professor', 'Gerente de Relacionamento']
    },
    relationships: {
      focus: 'Reciprocidade Saudável',
      tips: [
        'Comunique suas necessidades diretamente',
        'Aceite ajuda e cuidado dos outros',
        'Desenvolva relacionamentos baseados em reciprocidade',
        'Pratique vulnerabilidade autêntica'
      ]
    }
  },
  3: {
    name: 'O Realizador',
    personalGrowth: {
      focus: 'Autenticidade e Conexão',
      practices: [
        'Explore sua identidade além das conquistas',
        'Desenvolva relacionamentos genuínos',
        'Pratique vulnerabilidade e abertura emocional',
        'Cultive hobbies sem objetivos de performance'
      ],
      books: ['Daring Greatly - Brené Brown', 'The Gifts of Imperfection - Brené Brown'],
      activities: ['Terapia', 'Grupos de crescimento', 'Arte', 'Voluntariado'],
      onlineResources: [
        'Curso: "Liderança Autêntica" - LinkedIn Learning',
        'Podcast: "Dare to Lead with Brené Brown"',
        'App: Reflectly (journaling e autorreflexão)'
      ],
      actionPlan: {
        thirtyDays: 'Compartilhar uma vulnerabilidade com pessoa próxima semanalmente',
        sixtyDays: 'Dedicar 2 horas semanais a atividade sem objetivo de performance',
        ninetyDays: 'Implementar check-ins emocionais regulares com equipe'
      },
      metrics: [
        'Aumento de 35% na satisfação em relacionamentos pessoais',
        'Redução de 25% em sintomas de burnout',
        'Melhoria na avaliação 360° de liderança empática'
      ]
    },
    professional: {
      strengths: ['Orientação a resultados', 'Liderança', 'Adaptabilidade', 'Motivação'],
      challenges: ['Workaholism', 'Impaciência', 'Foco excessivo na imagem'],
      recommendations: [
        'Desenvolva liderança autêntica e empática',
        'Pratique escuta ativa e feedback genuíno',
        'Equilibre metas de curto e longo prazo',
        'Invista em desenvolvimento da equipe'
      ],
      idealRoles: ['CEO', 'Vendas', 'Marketing', 'Empreendedor']
    },
    relationships: {
      focus: 'Conexão Autêntica',
      tips: [
        'Compartilhe fracassos e vulnerabilidades',
        'Invista tempo de qualidade sem agenda',
        'Pratique escuta sem tentar resolver problemas',
        'Valorize pessoas pelo que são, não pelo que fazem'
      ]
    }
  },
  4: {
    name: 'O Individualista',
    personalGrowth: {
      focus: 'Estabilidade Emocional',
      practices: [
        'Desenvolva técnicas de regulação emocional',
        'Pratique gratidão e foco no presente',
        'Cultive relacionamentos estáveis e duradouros',
        'Estabeleça rotinas que proporcionem segurança'
      ],
      books: ['Emotional Intelligence - Daniel Goleman', 'The Happiness Trap - Russ Harris'],
      activities: ['Arte terapia', 'Música', 'Escrita', 'Caminhadas na natureza'],
      onlineResources: [
        'Curso: "Regulação Emocional" - Udemy',
        'Podcast: "The Creative Codex"',
        'App: Daylio (rastreamento de humor e padrões)'
      ],
      actionPlan: {
        thirtyDays: 'Estabelecer rotina matinal de 30 min para estabilizar humor',
        sixtyDays: 'Completar um projeto criativo do início ao fim',
        ninetyDays: 'Desenvolver rede de apoio com 3 relacionamentos estáveis'
      },
      metrics: [
        'Redução de 40% na variabilidade emocional diária',
        'Aumento de 50% na conclusão de projetos iniciados',
        'Melhoria na consistência de produtividade'
      ]
    },
    professional: {
      strengths: ['Criatividade', 'Intuição', 'Profundidade', 'Originalidade'],
      challenges: ['Instabilidade emocional', 'Procrastinação', 'Comparação com outros'],
      recommendations: [
        'Desenvolva disciplina e consistência',
        'Crie estruturas que apoiem sua criatividade',
        'Pratique colaboração e trabalho em equipe',
        'Foque em completar projetos, não apenas iniciá-los'
      ],
      idealRoles: ['Designer', 'Artista', 'Escritor', 'Terapeuta']
    },
    relationships: {
      focus: 'Comunicação Equilibrada',
      tips: [
        'Expresse emoções de forma construtiva',
        'Pratique empatia e consideração pelos outros',
        'Desenvolva tolerância a relacionamentos "comuns"',
        'Cultive estabilidade e confiabilidade'
      ]
    }
  },
  5: {
    name: 'O Investigador',
    personalGrowth: {
      focus: 'Conexão e Ação',
      practices: [
        'Pratique compartilhamento de conhecimento e ideias',
        'Desenvolva habilidades sociais e de comunicação',
        'Cultive relacionamentos próximos e íntimos',
        'Transforme conhecimento em ação prática'
      ],
      books: ['Quiet - Susan Cain', 'The Charisma Myth - Olivia Fox Cabane'],
      activities: ['Grupos de estudo', 'Apresentações', 'Mentoria', 'Projetos colaborativos'],
      onlineResources: [
        'Curso: "Comunicação Eficaz para Introvertidos" - Coursera',
        'Podcast: "The Knowledge Project"',
        'App: Toastmasters Pathways (desenvolvimento de apresentação)'
      ],
      actionPlan: {
        thirtyDays: 'Participar de um grupo de estudo ou apresentação semanal',
        sixtyDays: 'Compartilhar conhecimento através de mentoria ou ensino',
        ninetyDays: 'Liderar um projeto colaborativo aplicando expertise'
      },
      metrics: [
        'Aumento de 60% na frequência de compartilhamento de ideias',
        'Melhoria de 45% na avaliação de habilidades de comunicação',
        'Expansão da rede profissional em 30%'
      ]
    },
    professional: {
      strengths: ['Análise', 'Conhecimento profundo', 'Independência', 'Objetividade'],
      challenges: ['Isolamento', 'Dificuldade em comunicar ideias', 'Procrastinação'],
      recommendations: [
        'Desenvolva habilidades de apresentação e comunicação',
        'Pratique trabalho colaborativo e liderança',
        'Estabeleça prazos e accountability externa',
        'Compartilhe expertise através de ensino ou mentoria'
      ],
      idealRoles: ['Pesquisador', 'Analista', 'Consultor', 'Especialista técnico']
    },
    relationships: {
      focus: 'Abertura e Compartilhamento',
      tips: [
        'Pratique compartilhar pensamentos e sentimentos',
        'Desenvolva interesse genuíno pelos outros',
        'Cultive presença e disponibilidade emocional',
        'Equilibre tempo sozinho com tempo social'
      ]
    }
  },
  6: {
    name: 'O Leal',
    personalGrowth: {
      focus: 'Autoconfiança e Decisão',
      practices: [
        'Desenvolva confiança em sua própria intuição',
        'Pratique tomada de decisão independente',
        'Cultive coragem para enfrentar medos',
        'Estabeleça uma base interna de segurança'
      ],
      books: ['Feel the Fear and Do It Anyway - Susan Jeffers', 'The Confidence Code - Kay & Shipman'],
      activities: ['Esportes desafiadores', 'Cursos de liderança', 'Terapia', 'Grupos de apoio'],
      onlineResources: [
        'Curso: "Construindo Autoconfiança" - MindTools',
        'Podcast: "The Confidence Code"',
        'App: Calm (técnicas de ansiedade e meditação)'
      ],
      actionPlan: {
        thirtyDays: 'Tomar uma decisão importante sem consultar outros',
        sixtyDays: 'Liderar um projeto ou iniciativa no trabalho',
        ninetyDays: 'Estabelecer sistema pessoal de tomada de decisão'
      },
      metrics: [
        'Redução de 50% no tempo para tomar decisões',
        'Aumento de 40% na confiança auto-relatada',
        'Diminuição de 35% nos níveis de ansiedade'
      ]
    },
    professional: {
      strengths: ['Lealdade', 'Trabalho em equipe', 'Responsabilidade', 'Solução de problemas'],
      challenges: ['Ansiedade', 'Procrastinação', 'Dificuldade em tomar decisões'],
      recommendations: [
        'Desenvolva habilidades de liderança e tomada de decisão',
        'Pratique comunicação assertiva e confiante',
        'Cultive redes de apoio profissional',
        'Aprenda técnicas de gestão de ansiedade e stress'
      ],
      idealRoles: ['Gerente de projeto', 'Advogado', 'Contador', 'Analista de sistemas']
    },
    relationships: {
      focus: 'Confiança e Independência',
      tips: [
        'Desenvolva confiança em relacionamentos',
        'Pratique comunicação direta sobre preocupações',
        'Cultive independência emocional saudável',
        'Aprenda a confiar em sua própria percepção'
      ]
    }
  },
  7: {
    name: 'O Entusiasta',
    personalGrowth: {
      focus: 'Profundidade e Compromisso',
      practices: [
        'Desenvolva capacidade de foco e concentração',
        'Pratique mindfulness e presença no momento',
        'Cultive relacionamentos profundos e duradouros',
        'Aprenda a processar emoções difíceis'
      ],
      books: ['The Power of Now - Eckhart Tolle', 'Deep Work - Cal Newport'],
      activities: ['Meditação', 'Journaling', 'Terapia', 'Projetos de longo prazo'],
      onlineResources: [
        'App: Headspace (meditação e mindfulness)',
        'Curso: "Deep Work" - Cal Newport',
        'Podcast: "The Tim Ferriss Show" (foco e produtividade)'
      ],
      actionPlan: {
        thirtyDays: 'Completar um projeto do início ao fim sem distrações',
        sixtyDays: 'Estabelecer rotina diária de meditação de 20 minutos',
        ninetyDays: 'Desenvolver relacionamento profundo com mentor ou coach'
      },
      metrics: [
        'Aumento de 60% no tempo de foco contínuo',
        'Redução de 45% na procrastinação',
        'Melhoria de 50% na qualidade dos relacionamentos'
      ]
    },
    professional: {
      strengths: ['Criatividade', 'Entusiasmo', 'Visão', 'Networking'],
      challenges: ['Falta de foco', 'Dificuldade em completar projetos', 'Impaciência'],
      recommendations: [
        'Desenvolva disciplina e sistemas de organização',
        'Pratique foco em menos projetos com mais profundidade',
        'Cultive paciência e persistência',
        'Estabeleça accountability e prazos claros'
      ],
      idealRoles: ['Inovador', 'Consultor', 'Empreendedor', 'Facilitador']
    },
    relationships: {
      focus: 'Compromisso e Profundidade',
      tips: [
        'Pratique escuta profunda e presença',
        'Desenvolva tolerância a conflitos e dificuldades',
        'Cultive compromisso de longo prazo',
        'Aprenda a apoiar outros em momentos difíceis'
      ]
    }
  },
  8: {
    name: 'O Desafiador',
    personalGrowth: {
      focus: 'Vulnerabilidade e Compaixão',
      practices: [
        'Desenvolva inteligência emocional e empatia',
        'Pratique vulnerabilidade e abertura',
        'Cultive paciência e consideração pelos outros',
        'Aprenda a receber cuidado e apoio'
      ],
      books: ['Daring Greatly - Brené Brown', 'Nonviolent Communication - Marshall Rosenberg'],
      activities: ['Terapia', 'Mentoria', 'Voluntariado', 'Práticas de compaixão'],
      onlineResources: [
        'TED Talk: "The Power of Vulnerability" - Brené Brown',
        'Curso: "Emotional Intelligence" - Daniel Goleman',
        'App: Insight Timer (meditação de compaixão)'
      ],
      actionPlan: {
        thirtyDays: 'Praticar escuta ativa em todas as conversas importantes',
        sixtyDays: 'Compartilhar uma vulnerabilidade pessoal com alguém próximo',
        ninetyDays: 'Implementar feedback 360° e agir nas sugestões recebidas'
      },
      metrics: [
        'Aumento de 55% na satisfação da equipe',
        'Redução de 40% em conflitos interpessoais',
        'Melhoria de 65% na comunicação empática'
      ]
    },
    professional: {
      strengths: ['Liderança', 'Decisão', 'Proteção da equipe', 'Visão estratégica'],
      challenges: ['Impaciência', 'Confronto excessivo', 'Microgerenciamento'],
      recommendations: [
        'Desenvolva liderança colaborativa e empática',
        'Pratique delegação e empoderamento da equipe',
        'Cultive paciência e escuta ativa',
        'Aprenda técnicas de comunicação não-violenta'
      ],
      idealRoles: ['CEO', 'Diretor', 'Empreendedor', 'Líder de mudança']
    },
    relationships: {
      focus: 'Gentileza e Reciprocidade',
      tips: [
        'Pratique gentileza e consideração',
        'Desenvolva capacidade de receber cuidado',
        'Cultive relacionamentos baseados em igualdade',
        'Aprenda a expressar vulnerabilidade'
      ]
    }
  },
  9: {
    name: 'O Pacificador',
    personalGrowth: {
      focus: 'Ação e Assertividade',
      practices: [
        'Desenvolva assertividade e expressão de opiniões',
        'Pratique tomada de decisão e ação',
        'Cultive energia e motivação pessoal',
        'Aprenda a lidar com conflitos de forma saudável'
      ],
      books: ['The Assertiveness Workbook - Randy Paterson', 'Getting Things Done - David Allen'],
      activities: ['Exercícios físicos', 'Grupos de assertividade', 'Coaching', 'Projetos pessoais'],
      onlineResources: [
        'Curso: "Assertiveness Training" - Coursera',
        'App: Todoist (organização e produtividade)',
        'Podcast: "The Productivity Show"'
      ],
      actionPlan: {
        thirtyDays: 'Expressar opinião contrária em uma reunião importante',
        sixtyDays: 'Iniciar e liderar um projeto pessoal ou profissional',
        ninetyDays: 'Estabelecer sistema de metas e accountability pessoal'
      },
      metrics: [
        'Aumento de 70% na iniciativa pessoal',
        'Redução de 50% na procrastinação',
        'Melhoria de 60% na expressão de opiniões'
      ]
    },
    professional: {
      strengths: ['Mediação', 'Estabilidade', 'Trabalho em equipe', 'Paciência'],
      challenges: ['Procrastinação', 'Evitar conflitos', 'Falta de iniciativa'],
      recommendations: [
        'Desenvolva habilidades de liderança e iniciativa',
        'Pratique comunicação assertiva e direta',
        'Estabeleça metas claras e sistemas de accountability',
        'Cultive energia e motivação através de propósito'
      ],
      idealRoles: ['Mediador', 'Conselheiro', 'Facilitador', 'Gerente de operações']
    },
    relationships: {
      focus: 'Presença e Autenticidade',
      tips: [
        'Pratique expressar opiniões e preferências',
        'Desenvolva presença ativa nos relacionamentos',
        'Cultive iniciativa em demonstrar afeto',
        'Aprenda a lidar com conflitos construtivamente'
      ]
    }
  }
}

// Recomendações específicas por instinto
const instinctRecommendations = {
  sp: {
    name: 'Autopreservação',
    focus: 'Equilíbrio e Bem-estar',
    tips: [
      'Desenvolva rotinas saudáveis de autocuidado',
      'Pratique técnicas de gestão de stress',
      'Cultive hobbies que proporcionem prazer pessoal',
      'Estabeleça limites saudáveis entre trabalho e vida pessoal'
    ]
  },
  so: {
    name: 'Social',
    focus: 'Conexão e Contribuição',
    tips: [
      'Desenvolva habilidades de liderança comunitária',
      'Pratique networking autêntico e significativo',
      'Cultive relacionamentos diversos e inclusivos',
      'Encontre formas de contribuir para causas maiores'
    ]
  },
  sx: {
    name: 'Sexual/Um-a-um',
    focus: 'Intensidade e Conexão Profunda',
    tips: [
      'Desenvolva relacionamentos íntimos e significativos',
      'Pratique comunicação emocional profunda',
      'Cultive paixões e interesses intensos',
      'Aprenda a canalizar energia de forma produtiva'
    ]
  }
}

export default function DevelopmentRecommendations({ dominantType, dominantInstinct }: DevelopmentRecommendationsProps) {
  const typeData = developmentData[dominantType as keyof typeof developmentData]
  const instinctData = instinctRecommendations[dominantInstinct]

  if (!typeData) {
    return <div>Dados não encontrados para este tipo.</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="mb-4 text-sm font-semibold">
          <Target className="w-4 h-4 mr-2" />
          PLANO DE DESENVOLVIMENTO
        </Badge>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Recomendações para {typeData.name}
        </h3>
        <p className="text-gray-600">
          Estratégias personalizadas para seu crescimento pessoal e profissional
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Crescimento Pessoal */}
        <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-700">
              <Heart className="w-6 h-6" />
              Crescimento Pessoal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Foco Principal</h4>
              </div>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                {typeData.personalGrowth.focus}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Práticas Recomendadas</h4>
              </div>
              <ul className="space-y-2">
                {typeData.personalGrowth.practices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {practice}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Leituras Recomendadas</h4>
              </div>
              <ul className="space-y-1">
                {typeData.personalGrowth.books.map((book, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    • {book}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900">Atividades Sugeridas</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeData.personalGrowth.activities.map((activity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-cyan-600" />
                <h4 className="font-semibold text-gray-900">Recursos Online</h4>
              </div>
              <ul className="space-y-2">
                {typeData.personalGrowth.onlineResources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <ArrowRight className="w-3 h-3 text-cyan-500 mt-1 flex-shrink-0" />
                    {resource}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Plano de Ação</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">30 dias</span>
                  </div>
                  <p className="text-green-700 text-sm">{typeData.personalGrowth.actionPlan.thirtyDays}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">60 dias</span>
                  </div>
                  <p className="text-yellow-700 text-sm">{typeData.personalGrowth.actionPlan.sixtyDays}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">90 dias</span>
                  </div>
                  <p className="text-blue-700 text-sm">{typeData.personalGrowth.actionPlan.ninetyDays}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-900">Métricas de Progresso</h4>
              </div>
              <ul className="space-y-2">
                {typeData.personalGrowth.metrics.map((metric, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <Award className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Desenvolvimento Profissional */}
        <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-700">
              <Briefcase className="w-6 h-6" />
              Desenvolvimento Profissional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Seus Pontos Fortes</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeData.professional.strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">Áreas de Desenvolvimento</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeData.professional.challenges.map((challenge, index) => (
                  <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Recomendações</h4>
              </div>
              <ul className="space-y-2">
                {typeData.professional.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Papéis Ideais</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeData.professional.idealRoles.map((role, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relacionamentos */}
      <Card className="border-2 border-pink-100 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-pink-700">
            <Users className="w-6 h-6" />
            Relacionamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-900">Foco: {typeData.relationships.focus}</h4>
              </div>
              <ul className="space-y-2">
                {typeData.relationships.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <ArrowRight className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Instinto {instinctData.name}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">{instinctData.focus}</p>
              <ul className="space-y-1">
                {instinctData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <ArrowRight className="w-3 h-3 text-indigo-500 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano de Implementação Personalizado */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Seu Plano de Implementação
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comece sua jornada de crescimento com estas ações prioritárias para {typeData.name}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Primeira Semana</h4>
              <p className="text-sm text-gray-600">
                {typeData.personalGrowth.actionPlan.thirtyDays.split(' ').slice(0, 8).join(' ')}...
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Primeiro Mês</h4>
              <p className="text-sm text-gray-600">
                Estabeleça rotinas e hábitos fundamentais
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Primeiros 90 Dias</h4>
              <p className="text-sm text-gray-600">
                Consolide mudanças e meça resultados
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Dica Especial para {typeData.name}
            </h4>
            <p className="text-gray-700 text-sm mb-3">
              {typeData.personalGrowth.focus} é sua chave para o crescimento. 
              Foque em pequenas mudanças consistentes ao invés de transformações drásticas.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Comece hoje
              </Badge>
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                Seja paciente
              </Badge>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Celebre pequenas vitórias
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}