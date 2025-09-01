export interface EnneagramSubtype {
  code: string
  name: string
  type: number
  instinct: 'sp' | 'so' | 'sx'
  instinctName: string
  description: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
  motivation: string
  fear: string
  keyBehaviors: string[]
  workStyle: string
  relationships: string
  growth: string
}

export const enneagramSubtypes: EnneagramSubtype[] = [
  // Type 1 - The Perfectionist
  {
    code: '1sp',
    name: 'O Perfeccionista Autopreservativo',
    type: 1,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado na perfeição pessoal e na organização do ambiente físico. Preocupa-se intensamente com saúde, segurança e ordem.',
    characteristics: ['Extremamente organizado', 'Preocupado com saúde', 'Detalhista obsessivo', 'Controlador do ambiente'],
    strengths: ['Disciplina pessoal', 'Organização impecável', 'Responsabilidade', 'Atenção aos detalhes'],
    challenges: ['Ansiedade excessiva', 'Rigidez comportamental', 'Autocrítica severa', 'Dificuldade em relaxar'],
    motivation: 'Manter controle e perfeição em sua vida pessoal',
    fear: 'Perder controle ou ser imperfeito',
    keyBehaviors: ['Organiza obsessivamente', 'Monitora constantemente a saúde', 'Critica imperfeições'],
    workStyle: 'Meticuloso e sistemático, prefere trabalhar sozinho',
    relationships: 'Pode ser crítico com parceiros, mas é leal e confiável',
    growth: 'Aprender a aceitar imperfeições e relaxar padrões'
  },
  {
    code: '1so',
    name: 'O Perfeccionista Social',
    type: 1,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Focado em melhorar a sociedade e corrigir injustiças. Quer ser um exemplo moral para outros.',
    characteristics: ['Reformador social', 'Crítico das normas', 'Ativista moral', 'Educador natural'],
    strengths: ['Senso de justiça', 'Liderança ética', 'Capacidade de ensinar', 'Integridade moral'],
    challenges: ['Julgamento dos outros', 'Rigidez ideológica', 'Impaciência com imperfeições sociais', 'Tendência a pregar'],
    motivation: 'Melhorar o mundo e ser um exemplo moral',
    fear: 'Ser moralmente corrupto ou inadequado',
    keyBehaviors: ['Critica sistemas imperfeitos', 'Ensina e orienta outros', 'Defende causas justas'],
    workStyle: 'Trabalha bem em equipe quando lidera reformas',
    relationships: 'Busca parceiros que compartilhem seus valores morais',
    growth: 'Aceitar diferentes perspectivas morais e ser menos julgador'
  },
  {
    code: '1sx',
    name: 'O Perfeccionista Sexual',
    type: 1,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Busca a perfeição através da intensidade e da paixão. Pode ser mais impulsivo que outros Tipo 1.',
    characteristics: ['Intenso e apaixonado', 'Perfeccionista em relacionamentos', 'Crítico do parceiro', 'Busca conexão profunda'],
    strengths: ['Paixão genuína', 'Dedicação intensa', 'Busca por excelência', 'Lealdade profunda'],
    challenges: ['Crítica excessiva do parceiro', 'Expectativas irreais', 'Ciúme', 'Impulsividade'],
    motivation: 'Encontrar e criar a relação perfeita',
    fear: 'Ser rejeitado ou ter relacionamentos imperfeitos',
    keyBehaviors: ['Busca intensidade emocional', 'Critica imperfeições do parceiro', 'Dedica-se completamente'],
    workStyle: 'Trabalha melhor quando há paixão pelo projeto',
    relationships: 'Intenso e dedicado, mas pode ser crítico demais',
    growth: 'Aceitar imperfeições no parceiro e moderar expectativas'
  },

  // Type 2 - The Helper
  {
    code: '2sp',
    name: 'O Prestativo Autopreservativo',
    type: 2,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Cuida dos outros cuidando de si mesmo primeiro. Mais reservado que outros Tipo 2.',
    characteristics: ['Cuidador discreto', 'Autoconsciente', 'Menos invasivo', 'Cuida através de ações práticas'],
    strengths: ['Cuidado equilibrado', 'Menos manipulativo', 'Prático', 'Respeitoso dos limites'],
    challenges: ['Pode negligenciar próprias necessidades', 'Dificuldade em pedir ajuda', 'Ansiedade sobre segurança'],
    motivation: 'Ser útil mantendo sua própria segurança',
    fear: 'Ser abandonado ou não conseguir cuidar de si',
    keyBehaviors: ['Oferece ajuda prática', 'Mantém certa distância', 'Cuida discretamente'],
    workStyle: 'Colaborativo mas mantém independência',
    relationships: 'Carinhoso mas respeitoso dos limites',
    growth: 'Expressar necessidades próprias mais diretamente'
  },
  {
    code: '2so',
    name: 'O Prestativo Social',
    type: 2,
    instinct: 'so',
    instinctName: 'Social',
    description: 'O Tipo 2 clássico - focado em ajudar grupos e ser indispensável socialmente.',
    characteristics: ['Extremamente sociável', 'Conecta pessoas', 'Organizador social', 'Busca ser indispensável'],
    strengths: ['Habilidades sociais', 'Generosidade', 'Capacidade de unir pessoas', 'Empatia grupal'],
    challenges: ['Manipulação emocional', 'Invasão de limites', 'Dependência da aprovação', 'Negligência própria'],
    motivation: 'Ser amado e necessário pelo grupo',
    fear: 'Ser rejeitado ou desnecessário socialmente',
    keyBehaviors: ['Organiza eventos sociais', 'Conecta pessoas', 'Oferece ajuda constantemente'],
    workStyle: 'Excelente em trabalho em equipe e networking',
    relationships: 'Muito envolvido, às vezes invasivo',
    growth: 'Respeitar limites e cuidar de si mesmo'
  },
  {
    code: '2sx',
    name: 'O Prestativo Sexual',
    type: 2,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Focado em conexões íntimas intensas. Pode ser sedutor e possessivo.',
    characteristics: ['Sedutor e charmoso', 'Intensamente focado no parceiro', 'Possessivo', 'Emocionalmente dramático'],
    strengths: ['Capacidade de conexão profunda', 'Charme natural', 'Dedicação intensa', 'Intuição emocional'],
    challenges: ['Possessividade', 'Manipulação através da sedução', 'Ciúme', 'Dependência emocional'],
    motivation: 'Ser irresistível e indispensável para o parceiro',
    fear: 'Ser rejeitado ou substituído romanticamente',
    keyBehaviors: ['Seduz para conseguir atenção', 'Foca intensamente no parceiro', 'Pode ser dramático'],
    workStyle: 'Trabalha melhor em relacionamentos próximos',
    relationships: 'Intenso e dedicado, mas pode ser sufocante',
    growth: 'Desenvolver independência emocional e reduzir possessividade'
  },

  // Type 3 - The Achiever
  {
    code: '3sp',
    name: 'O Realizador Autopreservativo',
    type: 3,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado em segurança material e sucesso pessoal. Mais reservado sobre suas conquistas.',
    characteristics: ['Trabalhador incansável', 'Focado em segurança material', 'Menos ostensivo', 'Eficiente'],
    strengths: ['Disciplina de trabalho', 'Eficiência', 'Praticidade', 'Perseverança'],
    challenges: ['Workaholism', 'Negligência da saúde', 'Isolamento social', 'Ansiedade sobre segurança'],
    motivation: 'Alcançar segurança através do sucesso pessoal',
    fear: 'Falhar ou ficar sem recursos',
    keyBehaviors: ['Trabalha excessivamente', 'Foca em resultados práticos', 'Evita ostentação'],
    workStyle: 'Extremamente produtivo e focado em resultados',
    relationships: 'Pode negligenciar relacionamentos pelo trabalho',
    growth: 'Equilibrar trabalho com vida pessoal e relacionamentos'
  },
  {
    code: '3so',
    name: 'O Realizador Social',
    type: 3,
    instinct: 'so',
    instinctName: 'Social',
    description: 'O Tipo 3 clássico - focado em status, reconhecimento e sucesso público.',
    characteristics: ['Ambicioso socialmente', 'Consciente da imagem', 'Competitivo', 'Carismático'],
    strengths: ['Liderança natural', 'Carisma', 'Capacidade de inspirar', 'Networking eficaz'],
    challenges: ['Superficialidade', 'Competitividade excessiva', 'Preocupação com imagem', 'Dificuldade com vulnerabilidade'],
    motivation: 'Ser admirado e reconhecido pelo sucesso',
    fear: 'Ser visto como fracassado ou sem valor',
    keyBehaviors: ['Busca reconhecimento público', 'Compete constantemente', 'Projeta imagem de sucesso'],
    workStyle: 'Excelente líder e motivador de equipes',
    relationships: 'Carismático mas pode ser superficial',
    growth: 'Desenvolver autenticidade e aceitar vulnerabilidade'
  },
  {
    code: '3sx',
    name: 'O Realizador Sexual',
    type: 3,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Focado em ser desejável e atraente. Busca sucesso através do charme pessoal.',
    characteristics: ['Charmoso e atraente', 'Focado na aparência', 'Sedutor', 'Competitivo em relacionamentos'],
    strengths: ['Charme natural', 'Atratividade', 'Capacidade de conexão', 'Energia magnética'],
    challenges: ['Vaidade excessiva', 'Superficialidade em relacionamentos', 'Competição por atenção', 'Imagem sobre substância'],
    motivation: 'Ser irresistível e desejado',
    fear: 'Ser rejeitado ou considerado pouco atraente',
    keyBehaviors: ['Foca na aparência e charme', 'Compete por atenção romântica', 'Usa sedução para alcançar objetivos'],
    workStyle: 'Usa charme pessoal para influenciar e liderar',
    relationships: 'Atraente e charmoso, mas pode ser superficial',
    growth: 'Desenvolver profundidade além da aparência'
  },

  // Type 4 - The Individualist
  {
    code: '4sp',
    name: 'O Individualista Autopreservativo',
    type: 4,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Mais estoico e resistente. Suporta sofrimento em silêncio e busca autossuficiência.',
    characteristics: ['Resistente e estoico', 'Suporta dor silenciosamente', 'Autossuficiente', 'Menos dramático'],
    strengths: ['Resistência emocional', 'Autossuficiência', 'Profundidade', 'Criatividade prática'],
    challenges: ['Isolamento excessivo', 'Masoquismo emocional', 'Dificuldade em pedir ajuda', 'Depressão'],
    motivation: 'Encontrar significado através da resistência pessoal',
    fear: 'Ser abandonado ou não conseguir sobreviver emocionalmente',
    keyBehaviors: ['Suporta dificuldades sozinho', 'Evita mostrar vulnerabilidade', 'Busca autossuficiência'],
    workStyle: 'Trabalha bem independentemente, especialmente em projetos criativos',
    relationships: 'Leal mas pode ser distante emocionalmente',
    growth: 'Permitir-se ser vulnerável e aceitar ajuda dos outros'
  },
  {
    code: '4so',
    name: 'O Individualista Social',
    type: 4,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Sente-se diferente e incompreendido socialmente. Busca pertencimento sendo único.',
    characteristics: ['Sente-se diferente dos outros', 'Busca grupos alternativos', 'Expressivo socialmente', 'Crítico da sociedade'],
    strengths: ['Perspectiva única', 'Criatividade social', 'Autenticidade', 'Capacidade de questionar normas'],
    challenges: ['Sentimento de não pertencimento', 'Crítica excessiva da sociedade', 'Inveja social', 'Isolamento'],
    motivation: 'Encontrar seu lugar único no mundo social',
    fear: 'Nunca ser compreendido ou aceito',
    keyBehaviors: ['Expressa diferenças publicamente', 'Critica normas sociais', 'Busca grupos alternativos'],
    workStyle: 'Trabalha bem em ambientes criativos e alternativos',
    relationships: 'Busca pessoas que compreendam sua singularidade',
    growth: 'Aceitar que pode pertencer sem perder sua individualidade'
  },
  {
    code: '4sx',
    name: 'O Individualista Sexual',
    type: 4,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'O mais intenso dos Tipo 4. Busca conexão através da intensidade emocional e pode ser competitivo.',
    characteristics: ['Emocionalmente intenso', 'Competitivo', 'Busca conexão profunda', 'Pode ser dramático'],
    strengths: ['Intensidade emocional', 'Paixão', 'Capacidade de conexão profunda', 'Criatividade intensa'],
    challenges: ['Instabilidade emocional', 'Competitividade destrutiva', 'Drama excessivo', 'Inveja intensa'],
    motivation: 'Encontrar conexão através da intensidade emocional',
    fear: 'Ser abandonado ou não ser suficientemente especial',
    keyBehaviors: ['Busca intensidade emocional', 'Compete por atenção', 'Expressa emoções dramaticamente'],
    workStyle: 'Trabalha melhor quando há paixão e intensidade envolvidas',
    relationships: 'Intenso e apaixonado, mas pode ser instável',
    growth: 'Estabilizar emoções e reduzir competitividade destrutiva'
  },

  // Type 5 - The Investigator
  {
    code: '5sp',
    name: 'O Investigador Autopreservativo',
    type: 5,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'O mais retraído dos Tipo 5. Extremamente focado em conservar energia e recursos.',
    characteristics: ['Extremamente reservado', 'Conserva energia obsessivamente', 'Minimalista', 'Evita demandas externas'],
    strengths: ['Independência total', 'Eficiência de recursos', 'Foco intenso', 'Autodisciplina'],
    challenges: ['Isolamento extremo', 'Avareza excessiva', 'Dificuldade em se conectar', 'Negligência física'],
    motivation: 'Manter autonomia e conservar recursos pessoais',
    fear: 'Ser invadido ou ter recursos esgotados',
    keyBehaviors: ['Evita demandas sociais', 'Conserva energia obsessivamente', 'Vive de forma minimalista'],
    workStyle: 'Trabalha melhor sozinho com mínima interferência',
    relationships: 'Muito reservado, pode parecer frio ou distante',
    growth: 'Permitir mais conexão e compartilhamento de recursos'
  },
  {
    code: '5so',
    name: 'O Investigador Social',
    type: 5,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Busca conhecimento e competência para ter um lugar no grupo. Mais sociável que outros Tipo 5.',
    characteristics: ['Busca expertise para pertencer', 'Compartilha conhecimento', 'Mais sociável', 'Focado em competência'],
    strengths: ['Expertise profunda', 'Capacidade de ensinar', 'Conhecimento especializado', 'Contribuição valiosa'],
    challenges: ['Pode ser pedante', 'Dificuldade com intimidade', 'Foco excessivo em competência', 'Isolamento emocional'],
    motivation: 'Ser reconhecido por sua competência e conhecimento',
    fear: 'Ser visto como incompetente ou inútil',
    keyBehaviors: ['Desenvolve expertise profunda', 'Compartilha conhecimento', 'Busca reconhecimento intelectual'],
    workStyle: 'Excelente especialista e consultor',
    relationships: 'Conecta-se através de interesses intelectuais compartilhados',
    growth: 'Desenvolver conexões emocionais além do intelecto'
  },
  {
    code: '5sx',
    name: 'O Investigador Sexual',
    type: 5,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Busca conexão através de interesses intensos e compartilhados. Mais apaixonado que outros Tipo 5.',
    characteristics: ['Paixões intensas', 'Busca conexão através de interesses', 'Mais expressivo', 'Focado em poucos relacionamentos'],
    strengths: ['Paixão por interesses', 'Capacidade de conexão profunda', 'Intensidade focada', 'Lealdade'],
    challenges: ['Obsessão por interesses', 'Dificuldade com múltiplas conexões', 'Pode ser possessivo', 'Isolamento social'],
    motivation: 'Encontrar conexão através de paixões compartilhadas',
    fear: 'Não encontrar alguém que compartilhe suas paixões',
    keyBehaviors: ['Desenvolve paixões intensas', 'Busca parceiros com interesses similares', 'Foca em poucos relacionamentos'],
    workStyle: 'Trabalha melhor quando apaixonado pelo projeto',
    relationships: 'Intenso e leal com poucos parceiros próximos',
    growth: 'Expandir círculo social e desenvolver múltiplos interesses'
  },

  // Type 6 - The Loyalist
  {
    code: '6sp',
    name: 'O Leal Autopreservativo',
    type: 6,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado em segurança pessoal e material. Mais cauteloso e preparado para problemas.',
    characteristics: ['Extremamente cauteloso', 'Preparado para emergências', 'Focado em segurança', 'Ansioso sobre recursos'],
    strengths: ['Preparação excelente', 'Responsabilidade', 'Lealdade', 'Capacidade de antever problemas'],
    challenges: ['Ansiedade excessiva', 'Paralisia por análise', 'Pessimismo', 'Dificuldade em tomar riscos'],
    motivation: 'Garantir segurança e estabilidade pessoal',
    fear: 'Ficar sem apoio ou recursos em tempos difíceis',
    keyBehaviors: ['Planeja para contingências', 'Evita riscos', 'Busca segurança material'],
    workStyle: 'Confiável e preparado, mas pode ser lento para decidir',
    relationships: 'Leal e comprometido, mas pode ser ansioso',
    growth: 'Desenvolver confiança e aceitar incertezas razoáveis'
  },
  {
    code: '6so',
    name: 'O Leal Social',
    type: 6,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Busca segurança através de grupos e autoridades. Focado em lealdade e pertencimento.',
    characteristics: ['Leal ao grupo', 'Busca orientação de autoridades', 'Responsável socialmente', 'Ansioso sobre posição social'],
    strengths: ['Lealdade grupal', 'Responsabilidade social', 'Capacidade de seguir', 'Trabalho em equipe'],
    challenges: ['Dependência de autoridade', 'Dificuldade com liderança', 'Ansiedade social', 'Conformidade excessiva'],
    motivation: 'Pertencer e ser aceito pelo grupo',
    fear: 'Ser rejeitado ou ficar sem apoio social',
    keyBehaviors: ['Busca aprovação do grupo', 'Segue autoridades', 'Evita conflitos sociais'],
    workStyle: 'Excelente membro de equipe, leal e responsável',
    relationships: 'Leal e comprometido com grupos e comunidades',
    growth: 'Desenvolver confiança própria e capacidade de liderança'
  },
  {
    code: '6sx',
    name: 'O Leal Sexual',
    type: 6,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Mais assertivo e corajoso. Pode ser contrafóbico, enfrentando medos diretamente.',
    characteristics: ['Mais assertivo', 'Enfrenta medos', 'Leal ao parceiro', 'Pode ser rebelde'],
    strengths: ['Coragem para enfrentar medos', 'Lealdade intensa', 'Capacidade de proteção', 'Assertividade'],
    challenges: ['Impulsividade', 'Agressividade quando ameaçado', 'Ciúme', 'Comportamento contrafóbico'],
    motivation: 'Proteger e ser leal ao parceiro',
    fear: 'Ser traído ou abandonado pelo parceiro',
    keyBehaviors: ['Protege o parceiro intensamente', 'Enfrenta ameaças diretamente', 'Pode ser ciumento'],
    workStyle: 'Corajoso e protetor, bom em situações de crise',
    relationships: 'Intensamente leal e protetor, mas pode ser possessivo',
    growth: 'Equilibrar proteção com confiança no parceiro'
  },

  // Type 7 - The Enthusiast
  {
    code: '7sp',
    name: 'O Entusiasta Autopreservativo',
    type: 7,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado em garantir recursos e oportunidades para si mesmo. Mais materialista que outros Tipo 7.',
    characteristics: ['Focado em recursos', 'Materialista', 'Busca conforto', 'Evita privação'],
    strengths: ['Capacidade de garantir recursos', 'Otimismo prático', 'Versatilidade', 'Adaptabilidade'],
    challenges: ['Materialismo excessivo', 'Gula por experiências', 'Evitação de desconforto', 'Impulsividade'],
    motivation: 'Garantir abundância e evitar privação',
    fear: 'Ficar sem recursos ou oportunidades',
    keyBehaviors: ['Acumula recursos e oportunidades', 'Evita desconforto', 'Busca prazer material'],
    workStyle: 'Empreendedor e oportunista, bom em identificar possibilidades',
    relationships: 'Generoso mas pode ser materialista',
    growth: 'Aprender a valorizar experiências simples e não materiais'
  },
  {
    code: '7so',
    name: 'O Entusiasta Social',
    type: 7,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Focado em experiências sociais e ser popular. Quer ser visto como especial e interessante.',
    characteristics: ['Socialmente ativo', 'Busca ser popular', 'Contador de histórias', 'Quer ser especial'],
    strengths: ['Habilidades sociais', 'Capacidade de entreter', 'Otimismo contagiante', 'Networking'],
    challenges: ['Superficialidade social', 'Necessidade de atenção', 'FOMO social', 'Dificuldade com intimidade'],
    motivation: 'Ser admirado e considerado especial socialmente',
    fear: 'Ser ignorado ou considerado comum',
    keyBehaviors: ['Conta histórias interessantes', 'Busca ser o centro das atenções', 'Evita tédio social'],
    workStyle: 'Excelente em networking e apresentações',
    relationships: 'Divertido e sociável, mas pode ser superficial',
    growth: 'Desenvolver profundidade e intimidade real'
  },
  {
    code: '7sx',
    name: 'O Entusiasta Sexual',
    type: 7,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Busca intensidade e novidade em relacionamentos. Mais focado que outros Tipo 7.',
    characteristics: ['Busca intensidade', 'Romântico idealista', 'Focado em poucos interesses', 'Apaixonado'],
    strengths: ['Paixão intensa', 'Capacidade de inspirar', 'Otimismo romântico', 'Energia contagiante'],
    challenges: ['Idealização excessiva', 'Impaciência', 'Dificuldade com rotina', 'Pode ser possessivo'],
    motivation: 'Encontrar a experiência ou pessoa perfeita',
    fear: 'Perder oportunidades de conexão intensa',
    keyBehaviors: ['Idealiza parceiros e experiências', 'Busca novidade constante', 'Foca intensamente em paixões'],
    workStyle: 'Trabalha melhor quando apaixonado pelo projeto',
    relationships: 'Intenso e romântico, mas pode idealizar demais',
    growth: 'Aceitar imperfeições e desenvolver constância'
  },

  // Type 8 - The Challenger
  {
    code: '8sp',
    name: 'O Desafiador Autopreservativo',
    type: 8,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado em sobrevivência e recursos materiais. Mais reservado que outros Tipo 8.',
    characteristics: ['Focado em sobrevivência', 'Materialista', 'Reservado', 'Protetor de recursos'],
    strengths: ['Capacidade de sobrevivência', 'Determinação', 'Praticidade', 'Autossuficiência'],
    challenges: ['Materialismo excessivo', 'Desconfiança', 'Isolamento', 'Dureza emocional'],
    motivation: 'Garantir sobrevivência e controle de recursos',
    fear: 'Ficar vulnerável ou sem recursos',
    keyBehaviors: ['Acumula recursos', 'Protege território', 'Evita dependência'],
    workStyle: 'Empreendedor determinado, focado em resultados práticos',
    relationships: 'Protetor mas pode ser distante emocionalmente',
    growth: 'Desenvolver confiança e compartilhar recursos'
  },
  {
    code: '8so',
    name: 'O Desafiador Social',
    type: 8,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Focado em proteger grupos e lutar por justiça social. Líder natural.',
    characteristics: ['Líder protetor', 'Luta por justiça', 'Protetor dos fracos', 'Confronta injustiças'],
    strengths: ['Liderança natural', 'Senso de justiça', 'Proteção dos vulneráveis', 'Coragem moral'],
    challenges: ['Agressividade excessiva', 'Tendência a controlar', 'Impaciência', 'Dificuldade com autoridade'],
    motivation: 'Proteger o grupo e lutar por justiça',
    fear: 'Ver injustiças prevalecendo',
    keyBehaviors: ['Lidera grupos', 'Confronta injustiças', 'Protege os vulneráveis'],
    workStyle: 'Líder forte e protetor, excelente em crises',
    relationships: 'Protetor leal, mas pode ser controlador',
    growth: 'Aprender a liderar com mais diplomacia'
  },
  {
    code: '8sx',
    name: 'O Desafiador Sexual',
    type: 8,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'O mais intenso dos Tipo 8. Busca controle através da intensidade e pode ser possessivo.',
    characteristics: ['Extremamente intenso', 'Possessivo', 'Apaixonado', 'Controlador em relacionamentos'],
    strengths: ['Paixão intensa', 'Lealdade profunda', 'Proteção feroz', 'Energia magnética'],
    challenges: ['Possessividade extrema', 'Ciúme intenso', 'Controle excessivo', 'Agressividade'],
    motivation: 'Controlar e possuir completamente',
    fear: 'Ser traído ou perder controle do parceiro',
    keyBehaviors: ['Controla o parceiro intensamente', 'Demonstra paixão extrema', 'Pode ser ciumento'],
    workStyle: 'Intenso e focado, trabalha melhor com autonomia',
    relationships: 'Apaixonado e leal, mas pode ser sufocante',
    growth: 'Aprender a confiar e dar espaço ao parceiro'
  },

  // Type 9 - The Peacemaker
  {
    code: '9sp',
    name: 'O Pacificador Autopreservativo',
    type: 9,
    instinct: 'sp',
    instinctName: 'Autopreservação',
    description: 'Focado em conforto pessoal e rotinas. O mais inerte dos Tipo 9.',
    characteristics: ['Busca conforto', 'Apegado a rotinas', 'Evita mudanças', 'Focado em necessidades básicas'],
    strengths: ['Estabilidade', 'Contentamento', 'Simplicidade', 'Paz interior'],
    challenges: ['Inércia extrema', 'Procrastinação', 'Evitação de responsabilidades', 'Negligência própria'],
    motivation: 'Manter conforto e estabilidade pessoal',
    fear: 'Perder conforto ou ser forçado a mudar',
    keyBehaviors: ['Mantém rotinas rígidas', 'Evita desconforto', 'Procrastina mudanças'],
    workStyle: 'Estável e confiável, mas pode ser lento para mudanças',
    relationships: 'Pacífico e estável, mas pode ser passivo',
    growth: 'Desenvolver iniciativa e aceitar mudanças necessárias'
  },
  {
    code: '9so',
    name: 'O Pacificador Social',
    type: 9,
    instinct: 'so',
    instinctName: 'Social',
    description: 'Focado em harmonia grupal e pertencimento. Quer que todos se deem bem.',
    characteristics: ['Mediador natural', 'Busca harmonia grupal', 'Evita conflitos', 'Quer pertencer'],
    strengths: ['Mediação', 'Diplomacia', 'Inclusividade', 'Capacidade de unir pessoas'],
    challenges: ['Evitação de conflitos necessários', 'Dificuldade em tomar posições', 'Passividade', 'Perda de identidade'],
    motivation: 'Manter harmonia e pertencer ao grupo',
    fear: 'Causar conflito ou ser excluído',
    keyBehaviors: ['Media conflitos', 'Evita tomar lados', 'Busca consenso'],
    workStyle: 'Excelente mediador e membro de equipe',
    relationships: 'Harmonioso e inclusivo, mas pode evitar conflitos necessários',
    growth: 'Aprender a expressar opiniões e lidar com conflitos'
  },
  {
    code: '9sx',
    name: 'O Pacificador Sexual',
    type: 9,
    instinct: 'sx',
    instinctName: 'Sexual',
    description: 'Busca união através de fusão com o parceiro. Pode perder identidade própria.',
    characteristics: ['Busca fusão com parceiro', 'Perde identidade própria', 'Extremamente adaptável', 'Evita separação'],
    strengths: ['Capacidade de união profunda', 'Adaptabilidade', 'Harmonia relacional', 'Empatia'],
    challenges: ['Perda de identidade', 'Dependência excessiva', 'Dificuldade com limites', 'Passividade'],
    motivation: 'Fundir-se completamente com o parceiro',
    fear: 'Separação ou perda da conexão',
    keyBehaviors: ['Adapta-se completamente ao parceiro', 'Evita conflitos relacionais', 'Perde limites próprios'],
    workStyle: 'Trabalha melhor em parceria próxima',
    relationships: 'Extremamente adaptável, mas pode perder identidade',
    growth: 'Desenvolver identidade própria mantendo conexão'
  }
]

export function getSubtypeByCode(code: string): EnneagramSubtype | undefined {
  return enneagramSubtypes.find(subtype => subtype.code === code)
}

// Color mappings for instincts
export const instinctColors: Record<string, string> = {
  sp: '#8B5CF6', // Purple for Self-Preservation
  so: '#10B981', // Green for Social
  sx: '#EF4444'  // Red for Sexual
}

// Display names for instincts
export const instinctDisplayNames: Record<string, string> = {
  sp: 'Autopreservação',
  so: 'Social',
  sx: 'Sexual'
}

// Color mappings for types
export const typeColors: Record<number, string> = {
  1: '#DC2626',  // Red
  2: '#EA580C',  // Orange
  3: '#D97706',  // Amber
  4: '#CA8A04',  // Yellow
  5: '#65A30D',  // Lime
  6: '#16A34A',  // Green
  7: '#059669',  // Emerald
  8: '#0D9488',  // Teal
  9: '#0891B2'   // Cyan
}

export function getSubtypesByType(type: number): EnneagramSubtype[] {
  return enneagramSubtypes.filter(subtype => subtype.type === type)
}

export function getSubtypesByInstinct(instinct: 'sp' | 'so' | 'sx'): EnneagramSubtype[] {
  return enneagramSubtypes.filter(subtype => subtype.instinct === instinct)
}

export const instinctNames = {
  sp: 'Autopreservação',
  so: 'Social', 
  sx: 'Sexual'
} as const