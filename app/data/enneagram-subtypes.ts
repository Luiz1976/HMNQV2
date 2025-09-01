// Base de dados dos 27 subtipos do Eneagrama
// Cada tipo tem 3 variantes instintuais: SP (Autopreservação), SO (Social), SX (Sexual/Um-a-um)

export interface EnneagramSubtype {
  code: string
  type: number
  instinct: 'sp' | 'so' | 'sx'
  name: string
  description: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
  growthPath: string[]
  relationships: string
  career: string
  stress: string
  security: string
}

export const enneagramSubtypes: EnneagramSubtype[] = [
  // TIPO 1 - O PERFECCIONISTA
  {
    code: '1sp',
    type: 1,
    instinct: 'sp',
    name: 'O Perfeccionista Preocupado',
    description: 'Focado na perfeição pessoal e na correção de detalhes. Preocupa-se intensamente com a própria saúde, segurança e bem-estar.',
    characteristics: [
      'Extremamente meticuloso com detalhes pessoais',
      'Preocupação constante com saúde e segurança',
      'Tendência ao perfeccionismo obsessivo',
      'Dificuldade em relaxar e aceitar imperfeições',
      'Foco na correção e melhoria contínua'
    ],
    strengths: [
      'Atenção excepcional aos detalhes',
      'Padrões elevados de qualidade',
      'Responsabilidade pessoal',
      'Dedicação ao aperfeiçoamento',
      'Confiabilidade'
    ],
    challenges: [
      'Ansiedade excessiva com imperfeições',
      'Dificuldade em delegar',
      'Tendência ao esgotamento',
      'Crítica interna severa',
      'Rigidez comportamental'
    ],
    growthPath: [
      'Aprender a aceitar imperfeições',
      'Desenvolver autocompaixão',
      'Praticar flexibilidade',
      'Equilibrar trabalho e descanso',
      'Cultivar paciência consigo mesmo'
    ],
    relationships: 'Busca parceiros que compartilhem seus valores de ordem e correção, mas pode ser crítico demais.',
    career: 'Excelente em áreas que requerem precisão: contabilidade, medicina, engenharia, controle de qualidade.',
    stress: 'Torna-se ainda mais crítico e perfeccionista, podendo desenvolver comportamentos obsessivos.',
    security: 'Relaxa um pouco os padrões e permite-se ser mais espontâneo e criativo.'
  },
  {
    code: '1so',
    type: 1,
    instinct: 'so',
    name: 'O Perfeccionista Inadaptável',
    description: 'Foca na correção social e moral. Sente-se responsável por melhorar o mundo e corrigir injustiças sociais.',
    characteristics: [
      'Forte senso de justiça social',
      'Crítico das imperfeições sociais',
      'Desejo de reformar sistemas',
      'Intolerância com incompetência alheia',
      'Tendência a ser moralizador'
    ],
    strengths: [
      'Liderança ética',
      'Compromisso com a justiça',
      'Capacidade de mobilizar mudanças',
      'Integridade moral',
      'Visão sistêmica'
    ],
    challenges: [
      'Julgamento excessivo dos outros',
      'Impaciência com o ritmo de mudança',
      'Tendência a ser preachy',
      'Dificuldade em aceitar diferentes perspectivas',
      'Burnout por excesso de responsabilidade social'
    ],
    growthPath: [
      'Desenvolver tolerância e compreensão',
      'Aceitar que mudança leva tempo',
      'Praticar humildade',
      'Focar em influência positiva, não controle',
      'Equilibrar idealismo com realismo'
    ],
    relationships: 'Busca parceiros que compartilhem seus ideais sociais e morais.',
    career: 'Advocacia, ativismo social, educação, política, organizações não-governamentais.',
    stress: 'Torna-se mais crítico e intolerante, podendo se isolar ou tornar-se excessivamente controlador.',
    security: 'Desenvolve mais compaixão e aceita que as pessoas têm ritmos diferentes de crescimento.'
  },
  {
    code: '1sx',
    type: 1,
    instinct: 'sx',
    name: 'O Perfeccionista Zeloso',
    description: 'Busca a perfeição através da intensidade e paixão. Pode ser mais impulsivo que outros Tipo 1.',
    characteristics: [
      'Intensidade emocional',
      'Paixão por causas específicas',
      'Tendência a ser mais impulsivo',
      'Busca por conexões profundas',
      'Pode ser mais expressivo da raiva'
    ],
    strengths: [
      'Energia e entusiasmo',
      'Capacidade de inspirar outros',
      'Paixão genuína',
      'Coragem para defender convicções',
      'Intensidade focada'
    ],
    challenges: [
      'Impulsividade destrutiva',
      'Raiva intensa quando frustrado',
      'Tendência ao fanatismo',
      'Dificuldade em moderar intensidade',
      'Relacionamentos turbulentos'
    ],
    growthPath: [
      'Canalizar intensidade construtivamente',
      'Desenvolver autocontrole emocional',
      'Praticar moderação',
      'Aceitar imperfeições nos relacionamentos',
      'Equilibrar paixão com razão'
    ],
    relationships: 'Busca conexões intensas e apaixonadas, mas pode ser exigente demais com parceiros.',
    career: 'Arte, design, reforma social, empreendedorismo, áreas que permitam expressão criativa.',
    stress: 'Pode tornar-se explosivo, crítico e destrutivo em relacionamentos.',
    security: 'Canaliza sua intensidade de forma mais equilibrada e construtiva.'
  },

  // TIPO 2 - O PRESTATIVO
  {
    code: '2sp',
    type: 2,
    instinct: 'sp',
    name: 'O Prestativo Privilegiado',
    description: 'Cuida dos outros cuidando primeiro de si mesmo. Mais consciente das próprias necessidades que outros Tipo 2.',
    characteristics: [
      'Equilibra cuidado próprio e dos outros',
      'Mais consciente das próprias necessidades',
      'Cria ambientes acolhedores',
      'Foco na segurança familiar',
      'Menos propenso ao martírio'
    ],
    strengths: [
      'Autocuidado saudável',
      'Capacidade de nutrir sustentavelmente',
      'Criação de ambientes seguros',
      'Equilíbrio entre dar e receber',
      'Estabilidade emocional'
    ],
    challenges: [
      'Pode parecer menos altruísta',
      'Tendência ao conforto excessivo',
      'Dificuldade em situações de escassez',
      'Pode ser possessivo com recursos',
      'Resistência a mudanças'
    ],
    growthPath: [
      'Expandir círculo de cuidado',
      'Desenvolver generosidade genuína',
      'Aceitar vulnerabilidade',
      'Praticar desapego',
      'Equilibrar conforto com crescimento'
    ],
    relationships: 'Cria relacionamentos estáveis e nutritivos, mas pode ser possessivo.',
    career: 'Hospitalidade, culinária, cuidados de saúde, educação infantil, gestão familiar.',
    stress: 'Pode tornar-se mais egoísta e focado apenas nas próprias necessidades.',
    security: 'Expande naturalmente seu cuidado para círculos maiores de pessoas.'
  },
  {
    code: '2so',
    type: 2,
    instinct: 'so',
    name: 'O Prestativo Ambicioso',
    description: 'Ajuda outros para ganhar reconhecimento e status social. Mais consciente da hierarquia social.',
    characteristics: [
      'Busca reconhecimento através do serviço',
      'Consciente da hierarquia social',
      'Networking através do cuidado',
      'Desejo de ser indispensável',
      'Foco em pessoas influentes'
    ],
    strengths: [
      'Habilidades sociais excepcionais',
      'Capacidade de mobilizar recursos',
      'Liderança através do serviço',
      'Construção de redes sólidas',
      'Influência positiva'
    ],
    challenges: [
      'Motivações ocultas no cuidado',
      'Manipulação sutil',
      'Dependência de reconhecimento',
      'Competitividade disfarçada',
      'Burnout por excesso de compromissos'
    ],
    growthPath: [
      'Desenvolver motivações genuínas',
      'Praticar humildade',
      'Aceitar ajuda dos outros',
      'Reconhecer próprias necessidades',
      'Servir sem expectativas'
    ],
    relationships: 'Pode usar relacionamentos para ganhar status, mas também oferece apoio genuíno.',
    career: 'Relações públicas, política, organizações beneficentes, liderança comunitária.',
    stress: 'Torna-se mais manipulativo e focado em ganhar vantagens através do cuidado.',
    security: 'Desenvolve motivações mais puras e serve genuinamente sem expectativas.'
  },
  {
    code: '2sx',
    type: 2,
    instinct: 'sx',
    name: 'O Prestativo Agressivo/Sedutor',
    description: 'Usa charme e sedução para conquistar e manter relacionamentos próximos. Mais intenso emocionalmente.',
    characteristics: [
      'Charme e carisma intensos',
      'Foco em relacionamentos íntimos',
      'Pode ser sedutor ou manipulativo',
      'Intensidade emocional',
      'Ciúme e possessividade'
    ],
    strengths: [
      'Magnetismo pessoal',
      'Capacidade de conexão profunda',
      'Paixão e intensidade',
      'Lealdade intensa',
      'Habilidade de inspirar outros'
    ],
    challenges: [
      'Manipulação emocional',
      'Ciúme excessivo',
      'Dependência emocional',
      'Comportamento possessivo',
      'Drama desnecessário'
    ],
    growthPath: [
      'Desenvolver amor incondicional',
      'Praticar desapego saudável',
      'Reconhecer manipulação',
      'Cultivar independência emocional',
      'Canalizar intensidade positivamente'
    ],
    relationships: 'Relacionamentos intensos e apaixonados, mas pode ser possessivo e ciumento.',
    career: 'Entretenimento, vendas, terapia, coaching, áreas que envolvem influência pessoal.',
    stress: 'Pode tornar-se manipulativo, ciumento e emocionalmente instável.',
    security: 'Desenvolve amor mais maduro e equilibrado, menos possessivo.'
  },

  // TIPO 3 - O REALIZADOR
  {
    code: '3sp',
    type: 3,
    instinct: 'sp',
    name: 'O Realizador Seguro',
    description: 'Foca no sucesso material e segurança pessoal. Mais conservador e focado em estabilidade.',
    characteristics: [
      'Foco na segurança material',
      'Abordagem conservadora ao sucesso',
      'Planejamento de longo prazo',
      'Preocupação com estabilidade',
      'Menos ostentação que outros Tipo 3'
    ],
    strengths: [
      'Planejamento estratégico',
      'Construção de segurança sólida',
      'Eficiência prática',
      'Responsabilidade financeira',
      'Sustentabilidade'
    ],
    challenges: [
      'Pode ser excessivamente cauteloso',
      'Foco excessivo em segurança material',
      'Resistência a riscos necessários',
      'Pode sacrificar relacionamentos pelo trabalho',
      'Workaholism'
    ],
    growthPath: [
      'Equilibrar segurança com crescimento',
      'Valorizar relacionamentos',
      'Aceitar vulnerabilidade',
      'Desenvolver autenticidade',
      'Praticar presença'
    ],
    relationships: 'Busca parceiros que ofereçam estabilidade e compartilhem objetivos práticos.',
    career: 'Finanças, imóveis, consultoria, empreendedorismo, gestão de recursos.',
    stress: 'Pode tornar-se workaholic e negligenciar relacionamentos e saúde.',
    security: 'Relaxa e permite-se ser mais autêntico e presente nos relacionamentos.'
  },
  {
    code: '3so',
    type: 3,
    instinct: 'so',
    name: 'O Realizador Prestigioso',
    description: 'Busca sucesso e reconhecimento social. Foca em status, prestígio e admiração pública.',
    characteristics: [
      'Foco em status e prestígio',
      'Busca reconhecimento público',
      'Networking estratégico',
      'Imagem cuidadosamente construída',
      'Competitividade social'
    ],
    strengths: [
      'Liderança carismática',
      'Habilidades de apresentação',
      'Capacidade de inspirar',
      'Networking eficaz',
      'Visão de mercado'
    ],
    challenges: [
      'Foco excessivo na imagem',
      'Competitividade destrutiva',
      'Superficialidade',
      'Dependência de validação externa',
      'Burnout por pressão social'
    ],
    growthPath: [
      'Desenvolver autenticidade',
      'Valorizar substância sobre imagem',
      'Praticar humildade',
      'Conectar-se com valores genuínos',
      'Equilibrar sucesso com bem-estar'
    ],
    relationships: 'Pode usar relacionamentos para networking, mas também pode ser genuinamente inspirador.',
    career: 'Marketing, vendas, política, entretenimento, liderança corporativa.',
    stress: 'Torna-se mais competitivo e focado obsessivamente na imagem.',
    security: 'Desenvolve mais autenticidade e foca em contribuições genuínas.'
  },
  {
    code: '3sx',
    type: 3,
    instinct: 'sx',
    name: 'O Realizador Carismático',
    description: 'Busca sucesso através do carisma pessoal e conexões intensas. Mais focado em impacto pessoal.',
    characteristics: [
      'Carisma magnético',
      'Foco em conexões pessoais',
      'Intensidade e paixão',
      'Busca por admiração íntima',
      'Pode ser mais autêntico'
    ],
    strengths: [
      'Magnetismo pessoal',
      'Capacidade de inspirar intimamente',
      'Paixão genuína',
      'Conexões profundas',
      'Autenticidade emocional'
    ],
    challenges: [
      'Pode ser manipulativo emocionalmente',
      'Dependência de admiração',
      'Intensidade excessiva',
      'Ciúme de outros sucessos',
      'Drama desnecessário'
    ],
    growthPath: [
      'Desenvolver amor próprio genuíno',
      'Praticar vulnerabilidade autêntica',
      'Equilibrar intensidade',
      'Focar em contribuição, não admiração',
      'Cultivar relacionamentos equilibrados'
    ],
    relationships: 'Relacionamentos intensos e apaixonados, busca ser admirado e desejado.',
    career: 'Arte, entretenimento, coaching, terapia, áreas que envolvem influência pessoal.',
    stress: 'Pode tornar-se manipulativo e obcecado por admiração.',
    security: 'Desenvolve autenticidade genuína e relacionamentos mais equilibrados.'
  },

  // TIPO 4 - O INDIVIDUALISTA
  {
    code: '4sp',
    type: 4,
    instinct: 'sp',
    name: 'O Individualista Tenaz',
    description: 'Foca na criação de um ambiente pessoal único e na expressão da individualidade através do estilo de vida.',
    characteristics: [
      'Criação de ambientes únicos',
      'Foco na estética pessoal',
      'Tenacidade silenciosa',
      'Menos dramático que outros Tipo 4',
      'Busca por autenticidade prática'
    ],
    strengths: [
      'Criatividade prática',
      'Estilo único e autêntico',
      'Resistência emocional',
      'Independência',
      'Sensibilidade estética'
    ],
    challenges: [
      'Pode ser teimoso demais',
      'Isolamento excessivo',
      'Resistência a mudanças',
      'Melancolia persistente',
      'Dificuldade em pedir ajuda'
    ],
    growthPath: [
      'Abrir-se para conexões',
      'Aceitar apoio dos outros',
      'Praticar flexibilidade',
      'Equilibrar individualidade com comunidade',
      'Cultivar gratidão'
    ],
    relationships: 'Relacionamentos profundos mas pode ser reservado e independente demais.',
    career: 'Arte, design, artesanato, arquitetura, áreas que permitam expressão individual.',
    stress: 'Pode tornar-se mais isolado e teimoso, resistindo a mudanças necessárias.',
    security: 'Abre-se mais para conexões e colaboração mantendo sua autenticidade.'
  },
  {
    code: '4so',
    type: 4,
    instinct: 'so',
    name: 'O Individualista Sofredor',
    description: 'Expressa individualidade através do sofrimento e da diferença social. Pode ser mais dramático.',
    characteristics: [
      'Expressão dramática de emoções',
      'Foco no sofrimento como identidade',
      'Busca por reconhecimento da dor',
      'Comparação social constante',
      'Pode ser vitimista'
    ],
    strengths: [
      'Empatia profunda com sofrimento alheio',
      'Capacidade de expressar emoções difíceis',
      'Autenticidade emocional',
      'Sensibilidade social',
      'Criatividade através da dor'
    ],
    challenges: [
      'Vitimização excessiva',
      'Drama desnecessário',
      'Competição no sofrimento',
      'Dependência de validação da dor',
      'Melancolia crônica'
    ],
    growthPath: [
      'Encontrar identidade além do sofrimento',
      'Desenvolver resiliência',
      'Praticar gratidão',
      'Focar em contribuições positivas',
      'Equilibrar expressão emocional'
    ],
    relationships: 'Busca parceiros que validem seu sofrimento, mas pode ser emocionalmente intenso demais.',
    career: 'Terapia, arte terapia, trabalho social, áreas que lidem com sofrimento humano.',
    stress: 'Torna-se mais dramático e focado no próprio sofrimento.',
    security: 'Desenvolve uma identidade mais equilibrada e positiva.'
  },
  {
    code: '4sx',
    type: 4,
    instinct: 'sx',
    name: 'O Individualista Competitivo',
    description: 'Expressa individualidade através da competição e intensidade. Mais agressivo que outros Tipo 4.',
    characteristics: [
      'Competitividade intensa',
      'Busca por conexões profundas',
      'Pode ser mais agressivo',
      'Intensidade emocional',
      'Ciúme e inveja'
    ],
    strengths: [
      'Paixão e intensidade',
      'Coragem emocional',
      'Capacidade de conexão profunda',
      'Autenticidade feroz',
      'Criatividade intensa'
    ],
    challenges: [
      'Competitividade destrutiva',
      'Ciúme excessivo',
      'Intensidade avassaladora',
      'Relacionamentos turbulentos',
      'Raiva e ressentimento'
    ],
    growthPath: [
      'Canalizar competitividade construtivamente',
      'Desenvolver compaixão',
      'Praticar aceitação',
      'Equilibrar intensidade',
      'Cultivar relacionamentos saudáveis'
    ],
    relationships: 'Relacionamentos intensos e apaixonados, mas pode ser ciumento e competitivo.',
    career: 'Arte, performance, esportes, áreas competitivas que permitam expressão intensa.',
    stress: 'Pode tornar-se mais competitivo, ciumento e emocionalmente instável.',
    security: 'Canaliza sua intensidade de forma mais equilibrada e construtiva.'
  },

  // TIPO 5 - O INVESTIGADOR
  {
    code: '5sp',
    type: 5,
    instinct: 'sp',
    name: 'O Investigador Castelo',
    description: 'Foca na criação de um ambiente seguro e privado. Extremamente reservado e independente.',
    characteristics: [
      'Extrema necessidade de privacidade',
      'Criação de espaços seguros',
      'Minimalismo e simplicidade',
      'Autossuficiência',
      'Resistência a intrusões'
    ],
    strengths: [
      'Independência total',
      'Eficiência com recursos',
      'Foco profundo',
      'Simplicidade elegante',
      'Autoconhecimento'
    ],
    challenges: [
      'Isolamento excessivo',
      'Dificuldade em compartilhar',
      'Resistência a compromissos',
      'Pode ser muito minimalista',
      'Evitação de responsabilidades sociais'
    ],
    growthPath: [
      'Abrir-se gradualmente para outros',
      'Compartilhar conhecimento',
      'Aceitar interdependência',
      'Equilibrar solitude com conexão',
      'Praticar generosidade'
    ],
    relationships: 'Relacionamentos profundos mas raros, precisa de muito espaço pessoal.',
    career: 'Pesquisa, programação, escrita, áreas que permitam trabalho independente.',
    stress: 'Torna-se ainda mais isolado e resistente a qualquer demanda externa.',
    security: 'Abre-se mais para compartilhar conhecimento e conectar-se com outros.'
  },
  {
    code: '5so',
    type: 5,
    instinct: 'so',
    name: 'O Investigador Tótem',
    description: 'Busca conhecimento especializado para ganhar posição social. Mais disposto a compartilhar expertise.',
    characteristics: [
      'Busca por expertise reconhecida',
      'Compartilhamento seletivo de conhecimento',
      'Posição como especialista',
      'Networking intelectual',
      'Menos isolado que outros Tipo 5'
    ],
    strengths: [
      'Expertise profunda',
      'Capacidade de ensinar',
      'Liderança intelectual',
      'Networking estratégico',
      'Contribuição social através do conhecimento'
    ],
    challenges: [
      'Pode ser arrogante intelectualmente',
      'Competição por status de expert',
      'Dificuldade com críticas',
      'Pode ser condescendente',
      'Isolamento quando não reconhecido'
    ],
    growthPath: [
      'Desenvolver humildade intelectual',
      'Aceitar diferentes perspectivas',
      'Compartilhar conhecimento generosamente',
      'Valorizar contribuições dos outros',
      'Equilibrar expertise com sabedoria'
    ],
    relationships: 'Busca parceiros que valorizem sua inteligência e expertise.',
    career: 'Academia, consultoria, pesquisa, áreas que reconheçam especialização.',
    stress: 'Pode tornar-se mais arrogante e competitivo intelectualmente.',
    security: 'Compartilha conhecimento mais generosamente e aceita aprender com outros.'
  },
  {
    code: '5sx',
    type: 5,
    instinct: 'sx',
    name: 'O Investigador Confidencial',
    description: 'Busca conexões íntimas através do compartilhamento de conhecimento profundo. Mais intenso emocionalmente.',
    characteristics: [
      'Busca por conexões íntimas',
      'Compartilhamento profundo seletivo',
      'Intensidade emocional oculta',
      'Fascínio por temas profundos',
      'Pode ser mais expressivo'
    ],
    strengths: [
      'Capacidade de conexão profunda',
      'Intensidade intelectual',
      'Lealdade intensa',
      'Insights únicos',
      'Paixão por conhecimento'
    ],
    challenges: [
      'Pode ser possessivo com conhecimento',
      'Intensidade avassaladora',
      'Ciúme intelectual',
      'Relacionamentos turbulentos',
      'Obsessão por temas específicos'
    ],
    growthPath: [
      'Equilibrar intensidade',
      'Desenvolver estabilidade emocional',
      'Praticar desapego',
      'Cultivar relacionamentos equilibrados',
      'Canalizar paixão construtivamente'
    ],
    relationships: 'Relacionamentos intensos e profundos, mas pode ser possessivo com parceiros.',
    career: 'Pesquisa especializada, arte, escrita, áreas que permitam exploração profunda.',
    stress: 'Pode tornar-se obsessivo e emocionalmente instável.',
    security: 'Desenvolve relacionamentos mais equilibrados mantendo profundidade.'
  },

  // TIPO 6 - O LEAL
  {
    code: '6sp',
    type: 6,
    instinct: 'sp',
    name: 'O Leal Aquecedor',
    description: 'Foca na criação de segurança pessoal e familiar. Mais caloroso e acolhedor que outros Tipo 6.',
    characteristics: [
      'Foco na segurança familiar',
      'Criação de ambientes acolhedores',
      'Lealdade ao círculo íntimo',
      'Preocupação com bem-estar dos próximos',
      'Menos ansioso que outros Tipo 6'
    ],
    strengths: [
      'Criação de segurança para outros',
      'Lealdade profunda',
      'Capacidade de nutrir',
      'Estabilidade emocional',
      'Senso de comunidade'
    ],
    challenges: [
      'Pode ser superprotetor',
      'Resistência a mudanças',
      'Ansiedade com ameaças à segurança',
      'Pode ser possessivo',
      'Dificuldade em confiar em estranhos'
    ],
    growthPath: [
      'Expandir círculo de confiança',
      'Aceitar mudanças necessárias',
      'Desenvolver coragem',
      'Equilibrar proteção com liberdade',
      'Cultivar fé no futuro'
    ],
    relationships: 'Relacionamentos estáveis e leais, mas pode ser superprotetor.',
    career: 'Educação, cuidados de saúde, segurança, áreas que protejam outros.',
    stress: 'Torna-se mais ansioso e controlador com a segurança.',
    security: 'Desenvolve mais coragem e confiança no futuro.'
  },
  {
    code: '6so',
    type: 6,
    instinct: 'so',
    name: 'O Leal Dever',
    description: 'Foca na lealdade a grupos e instituições. Forte senso de dever e responsabilidade social.',
    characteristics: [
      'Forte senso de dever',
      'Lealdade a instituições',
      'Busca por orientação de autoridades',
      'Responsabilidade social',
      'Pode ser mais conformista'
    ],
    strengths: [
      'Confiabilidade excepcional',
      'Senso de responsabilidade',
      'Capacidade de seguir regras',
      'Lealdade institucional',
      'Estabilidade social'
    ],
    challenges: [
      'Pode ser excessivamente conformista',
      'Dificuldade em questionar autoridade',
      'Ansiedade com mudanças sociais',
      'Pode ser rígido demais',
      'Dependência de aprovação externa'
    ],
    growthPath: [
      'Desenvolver pensamento independente',
      'Questionar autoridades quando necessário',
      'Equilibrar conformidade com autenticidade',
      'Cultivar coragem moral',
      'Aceitar mudanças sociais'
    ],
    relationships: 'Busca parceiros que compartilhem valores e responsabilidades sociais.',
    career: 'Serviço público, militar, educação, áreas que sirvam à sociedade.',
    stress: 'Torna-se mais rígido e dependente de autoridades externas.',
    security: 'Desenvolve mais independência mantendo senso de responsabilidade.'
  },
  {
    code: '6sx',
    type: 6,
    instinct: 'sx',
    name: 'O Leal Força/Beleza',
    description: 'Busca segurança através de conexões intensas. Pode ser mais corajoso e confrontativo.',
    characteristics: [
      'Busca por conexões intensas',
      'Pode ser mais corajoso',
      'Lealdade apaixonada',
      'Tendência a testar relacionamentos',
      'Pode ser confrontativo'
    ],
    strengths: [
      'Coragem em relacionamentos',
      'Lealdade intensa',
      'Capacidade de enfrentar medos',
      'Paixão genuína',
      'Proteção feroz dos amados'
    ],
    challenges: [
      'Pode ser muito intenso',
      'Tendência a criar drama',
      'Ciúme e possessividade',
      'Teste excessivo de relacionamentos',
      'Confrontos desnecessários'
    ],
    growthPath: [
      'Desenvolver confiança genuína',
      'Reduzir testes em relacionamentos',
      'Equilibrar intensidade',
      'Praticar vulnerabilidade',
      'Cultivar segurança interna'
    ],
    relationships: 'Relacionamentos intensos e leais, mas pode testar constantemente a lealdade do parceiro.',
    career: 'Advocacia, ativismo, áreas que permitam lutar por causas.',
    stress: 'Pode tornar-se mais confrontativo e desconfiado.',
    security: 'Desenvolve confiança genuína e relacionamentos mais equilibrados.'
  },

  // TIPO 7 - O ENTUSIASTA
  {
    code: '7sp',
    type: 7,
    instinct: 'sp',
    name: 'O Entusiasta Família',
    description: 'Foca na criação de segurança através de redes de apoio e recursos. Mais prático que outros Tipo 7.',
    characteristics: [
      'Criação de redes de segurança',
      'Foco em recursos e oportunidades',
      'Mais prático e realista',
      'Lealdade ao grupo próximo',
      'Menos impulsivo que outros Tipo 7'
    ],
    strengths: [
      'Planejamento prático',
      'Criação de oportunidades',
      'Lealdade ao grupo',
      'Otimismo realista',
      'Capacidade de mobilizar recursos'
    ],
    challenges: [
      'Pode ser materialista',
      'Ansiedade com escassez',
      'Tendência ao acúmulo',
      'Pode ser menos aventureiro',
      'Foco excessivo em segurança'
    ],
    growthPath: [
      'Equilibrar segurança com aventura',
      'Praticar generosidade',
      'Aceitar incertezas',
      'Desenvolver confiança no futuro',
      'Cultivar simplicidade'
    ],
    relationships: 'Relacionamentos estáveis e divertidos, foca em criar segurança mútua.',
    career: 'Empreendedorismo, consultoria, áreas que combinem criatividade com praticidade.',
    stress: 'Pode tornar-se mais ansioso com segurança e menos espontâneo.',
    security: 'Relaxa e permite-se ser mais aventureiro e confiante.'
  },
  {
    code: '7so',
    type: 7,
    instinct: 'so',
    name: 'O Entusiasta Sacrifício',
    description: 'Foca em contribuir para o bem maior. Mais altruísta e consciente socialmente que outros Tipo 7.',
    characteristics: [
      'Foco no bem comum',
      'Sacrifício por causas maiores',
      'Consciência social desenvolvida',
      'Menos hedonista',
      'Busca por significado coletivo'
    ],
    strengths: [
      'Visão de futuro positivo',
      'Capacidade de inspirar grupos',
      'Altruísmo genuíno',
      'Liderança visionária',
      'Otimismo contagiante'
    ],
    challenges: [
      'Pode negligenciar necessidades pessoais',
      'Burnout por excesso de compromissos',
      'Idealismo excessivo',
      'Dificuldade em dizer não',
      'Pode ser ingênuo'
    ],
    growthPath: [
      'Equilibrar altruísmo com autocuidado',
      'Desenvolver realismo',
      'Aprender a estabelecer limites',
      'Aceitar limitações humanas',
      'Praticar discernimento'
    ],
    relationships: 'Busca parceiros que compartilhem ideais e visão de futuro.',
    career: 'Organizações não-governamentais, educação, áreas que sirvam ao bem comum.',
    stress: 'Pode tornar-se mais disperso e negligenciar necessidades pessoais.',
    security: 'Equilibra contribuição social com bem-estar pessoal.'
  },
  {
    code: '7sx',
    type: 7,
    instinct: 'sx',
    name: 'O Entusiasta Sugestionável',
    description: 'Busca experiências intensas e conexões apaixonadas. Mais impulsivo e intenso emocionalmente.',
    characteristics: [
      'Busca por experiências intensas',
      'Conexões apaixonadas',
      'Impulsividade emocional',
      'Fascínio por novidades',
      'Pode ser mais dramático'
    ],
    strengths: [
      'Paixão e entusiasmo',
      'Capacidade de inspirar',
      'Criatividade intensa',
      'Coragem para experimentar',
      'Magnetismo pessoal'
    ],
    challenges: [
      'Impulsividade destrutiva',
      'Dificuldade com compromissos',
      'Pode ser superficial',
      'Instabilidade emocional',
      'Tendência ao vício'
    ],
    growthPath: [
      'Desenvolver profundidade',
      'Praticar compromisso',
      'Equilibrar intensidade',
      'Cultivar estabilidade',
      'Canalizar energia construtivamente'
    ],
    relationships: 'Relacionamentos intensos e apaixonados, mas pode ter dificuldade com compromissos.',
    career: 'Arte, entretenimento, marketing, áreas que permitam expressão criativa.',
    stress: 'Pode tornar-se mais impulsivo e instável emocionalmente.',
    security: 'Desenvolve mais profundidade e capacidade de compromisso.'
  },

  // TIPO 8 - O DESAFIADOR
  {
    code: '8sp',
    type: 8,
    instinct: 'sp',
    name: 'O Desafiador Satisfatório',
    description: 'Foca na criação de segurança material e controle do ambiente. Mais prático e menos confrontativo.',
    characteristics: [
      'Foco na segurança material',
      'Controle do ambiente físico',
      'Menos confrontativo socialmente',
      'Mais prático e realista',
      'Proteção do território pessoal'
    ],
    strengths: [
      'Capacidade de criar segurança',
      'Praticidade e eficiência',
      'Proteção dos recursos',
      'Estabilidade material',
      'Liderança prática'
    ],
    challenges: [
      'Pode ser possessivo com recursos',
      'Resistência a mudanças',
      'Pode ser teimoso',
      'Foco excessivo no material',
      'Dificuldade em compartilhar controle'
    ],
    growthPath: [
      'Aprender a compartilhar recursos',
      'Desenvolver flexibilidade',
      'Equilibrar controle com colaboração',
      'Aceitar mudanças necessárias',
      'Cultivar generosidade'
    ],
    relationships: 'Relacionamentos estáveis, foca em criar segurança material para a família.',
    career: 'Empreendedorismo, imóveis, construção, áreas que envolvam recursos materiais.',
    stress: 'Pode tornar-se mais controlador e possessivo com recursos.',
    security: 'Relaxa o controle e torna-se mais generoso e colaborativo.'
  },
  {
    code: '8so',
    type: 8,
    instinct: 'so',
    name: 'O Desafiador Amizade',
    description: 'Foca na proteção de grupos e causas sociais. Mais altruísta e consciente socialmente.',
    characteristics: [
      'Proteção de grupos e causas',
      'Liderança social',
      'Luta contra injustiças',
      'Menos focado em ganho pessoal',
      'Senso de responsabilidade social'
    ],
    strengths: [
      'Liderança corajosa',
      'Proteção dos vulneráveis',
      'Capacidade de mobilizar mudanças',
      'Senso de justiça',
      'Altruísmo genuíno'
    ],
    challenges: [
      'Pode ser excessivamente confrontativo',
      'Tendência ao autoritarismo',
      'Impaciência com processos',
      'Pode negligenciar necessidades pessoais',
      'Burnout por excesso de responsabilidade'
    ],
    growthPath: [
      'Desenvolver paciência com processos',
      'Equilibrar liderança com colaboração',
      'Praticar diplomacia',
      'Cuidar das próprias necessidades',
      'Aceitar diferentes ritmos de mudança'
    ],
    relationships: 'Busca parceiros que compartilhem valores de justiça social.',
    career: 'Ativismo, política, advocacia, liderança de organizações sociais.',
    stress: 'Pode tornar-se mais autoritário e confrontativo.',
    security: 'Desenvolve liderança mais colaborativa e diplomática.'
  },
  {
    code: '8sx',
    type: 8,
    instinct: 'sx',
    name: 'O Desafiador Posse/Rendição',
    description: 'Busca controle através de conexões intensas. Mais emocional e possessivo que outros Tipo 8.',
    characteristics: [
      'Intensidade emocional',
      'Possessividade em relacionamentos',
      'Busca por controle íntimo',
      'Paixão intensa',
      'Pode ser mais vulnerável'
    ],
    strengths: [
      'Paixão e intensidade',
      'Lealdade feroz',
      'Capacidade de conexão profunda',
      'Proteção intensa dos amados',
      'Coragem emocional'
    ],
    challenges: [
      'Possessividade excessiva',
      'Ciúme intenso',
      'Pode ser controlador em relacionamentos',
      'Intensidade avassaladora',
      'Dificuldade com vulnerabilidade'
    ],
    growthPath: [
      'Desenvolver confiança genuína',
      'Praticar vulnerabilidade',
      'Equilibrar intensidade',
      'Aceitar independência do parceiro',
      'Cultivar relacionamentos equilibrados'
    ],
    relationships: 'Relacionamentos intensos e apaixonados, mas pode ser possessivo e controlador.',
    career: 'Áreas que permitam intensidade: arte, esportes, negociação, liderança.',
    stress: 'Pode tornar-se mais possessivo e controlador emocionalmente.',
    security: 'Desenvolve relacionamentos mais equilibrados mantendo intensidade.'
  },

  // TIPO 9 - O PACIFICADOR
  {
    code: '9sp',
    type: 9,
    instinct: 'sp',
    name: 'O Pacificador Apetite',
    description: 'Foca no conforto pessoal e na manutenção de rotinas. Mais focado em bem-estar físico.',
    characteristics: [
      'Foco no conforto pessoal',
      'Manutenção de rotinas',
      'Busca por bem-estar físico',
      'Pode ser mais indulgente',
      'Resistência a mudanças'
    ],
    strengths: [
      'Capacidade de criar conforto',
      'Estabilidade e consistência',
      'Presença calmante',
      'Simplicidade genuína',
      'Contentamento'
    ],
    challenges: [
      'Pode ser preguiçoso',
      'Resistência excessiva a mudanças',
      'Tendência à indulgência',
      'Procrastinação',
      'Evitação de responsabilidades'
    ],
    growthPath: [
      'Desenvolver disciplina pessoal',
      'Aceitar mudanças necessárias',
      'Equilibrar conforto com crescimento',
      'Assumir responsabilidades',
      'Cultivar motivação interna'
    ],
    relationships: 'Relacionamentos confortáveis e estáveis, mas pode ser passivo demais.',
    career: 'Áreas que ofereçam estabilidade e conforto: administração, cuidados, serviços.',
    stress: 'Pode tornar-se mais preguiçoso e resistente a qualquer mudança.',
    security: 'Desenvolve mais energia e disposição para ação.'
  },
  {
    code: '9so',
    type: 9,
    instinct: 'so',
    name: 'O Pacificador Participação',
    description: 'Foca na harmonia grupal e na participação social. Mais ativo socialmente que outros Tipo 9.',
    characteristics: [
      'Foco na harmonia grupal',
      'Participação social ativa',
      'Mediação de conflitos',
      'Busca por consenso',
      'Menos passivo que outros Tipo 9'
    ],
    strengths: [
      'Capacidade de mediar conflitos',
      'Criação de harmonia grupal',
      'Inclusividade',
      'Diplomacia natural',
      'Estabilidade social'
    ],
    challenges: [
      'Pode evitar conflitos necessários',
      'Dificuldade em tomar posições',
      'Pode ser indeciso em grupos',
      'Tendência ao conformismo',
      'Negligência das próprias necessidades'
    ],
    growthPath: [
      'Desenvolver coragem para conflitos necessários',
      'Expressar opiniões próprias',
      'Equilibrar harmonia com autenticidade',
      'Assumir liderança quando necessário',
      'Valorizar próprias necessidades'
    ],
    relationships: 'Busca relacionamentos harmoniosos e busca agradar a todos.',
    career: 'Mediação, recursos humanos, trabalho social, áreas que promovam harmonia.',
    stress: 'Pode tornar-se mais passivo e evitar ainda mais conflitos.',
    security: 'Desenvolve mais coragem para expressar opiniões e liderar.'
  },
  {
    code: '9sx',
    type: 9,
    instinct: 'sx',
    name: 'O Pacificador União',
    description: 'Busca harmonia através de conexões íntimas profundas. Mais intenso emocionalmente que outros Tipo 9.',
    characteristics: [
      'Busca por união íntima',
      'Fusão com parceiros',
      'Intensidade emocional oculta',
      'Pode ser mais apaixonado',
      'Tendência à codependência'
    ],
    strengths: [
      'Capacidade de conexão profunda',
      'Lealdade intensa',
      'Empatia profunda',
      'Capacidade de fusão emocional',
      'Amor incondicional'
    ],
    challenges: [
      'Tendência à codependência',
      'Perda da própria identidade',
      'Pode ser possessivo sutilmente',
      'Dificuldade com limites',
      'Evitação de conflitos íntimos'
    ],
    growthPath: [
      'Desenvolver identidade própria',
      'Estabelecer limites saudáveis',
      'Equilibrar união com individualidade',
      'Praticar assertividade',
      'Cultivar independência emocional'
    ],
    relationships: 'Relacionamentos profundos e fusionais, mas pode perder a própria identidade.',
    career: 'Terapia de casais, arte, áreas que envolvam conexão emocional profunda.',
    stress: 'Pode tornar-se mais codependente e perder ainda mais a própria identidade.',
    security: 'Desenvolve relacionamentos mais equilibrados mantendo conexão profunda.'
  }
]

// Função para buscar subtipo por código
export function getSubtypeByCode(code: string): EnneagramSubtype | undefined {
  return enneagramSubtypes.find(subtype => subtype.code === code)
}

// Função para buscar subtipos por tipo
export function getSubtypesByType(type: number): EnneagramSubtype[] {
  return enneagramSubtypes.filter(subtype => subtype.type === type)
}

// Função para buscar subtipos por instinto
export function getSubtypesByInstinct(instinct: 'sp' | 'so' | 'sx'): EnneagramSubtype[] {
  return enneagramSubtypes.filter(subtype => subtype.instinct === instinct)
}

// Nomes dos instintos para exibição
export const instinctDisplayNames = {
  sp: 'Autopreservação',
  so: 'Social',
  sx: 'Sexual/Um-a-um'
}

// Cores para cada instinto (para uso na mandala)
export const instinctColors = {
  sp: '#8B4513', // Marrom - terra, segurança
  so: '#4169E1', // Azul - social, comunidade
  sx: '#DC143C'  // Vermelho - paixão, intensidade
}

// Cores para cada tipo do Eneagrama
export const typeColors = {
  1: '#FF6B6B', // Vermelho claro
  2: '#4ECDC4', // Verde água
  3: '#45B7D1', // Azul
  4: '#96CEB4', // Verde claro
  5: '#FFEAA7', // Amarelo claro
  6: '#DDA0DD', // Roxo claro
  7: '#98D8C8', // Verde menta
  8: '#F7DC6F', // Amarelo
  9: '#BB8FCE'  // Lilás
}