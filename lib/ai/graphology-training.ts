// HumaniQ AI - Materiais de Treinamento para Análise Grafológica
// Baseado nos materiais científicos fornecidos para treinar a IA Gemini

export const GRAPHOLOGY_TRAINING_MATERIALS = {
  // Fundamentos científicos da grafologia
  scientificFoundations: {
    definition: `A grafologia é a ciência que estuda a personalidade através da análise da escrita manuscrita. 
    Baseia-se no princípio de que a escrita é uma projeção do inconsciente e reflete traços de personalidade, 
    estados emocionais e características psicológicas do indivíduo.`,
    
    principles: [
      "A escrita é um gesto gráfico que reflete a personalidade",
      "Cada pessoa possui um padrão único de escrita (grafismo)",
      "Mudanças na escrita podem indicar alterações psicológicas ou emocionais",
      "A análise deve considerar múltiplos aspectos: pressão, velocidade, inclinação, tamanho, espaçamento"
    ],
    
    reliability: `Estudos científicos indicam que a grafologia, quando aplicada por profissionais qualificados, 
    pode apresentar correlações significativas com traços de personalidade, especialmente quando 
    combinada com outras ferramentas de avaliação psicológica.`
  },

  // Elementos técnicos de análise
  analysisElements: {
    pressure: {
      description: "Força aplicada na escrita",
      interpretations: {
        strong: "Energia, determinação, intensidade emocional",
        medium: "Equilíbrio emocional, estabilidade",
        light: "Sensibilidade, delicadeza, possível falta de energia"
      }
    },
    
    size: {
      description: "Tamanho das letras",
      interpretations: {
        large: "Extroversão, necessidade de atenção, autoestima",
        medium: "Equilíbrio, adaptabilidade",
        small: "Introversão, concentração, atenção aos detalhes"
      }
    },
    
    slant: {
      description: "Inclinação da escrita",
      interpretations: {
        right: "Extroversão, sociabilidade, orientação para o futuro",
        vertical: "Controle emocional, objetividade, independência",
        left: "Introversão, cautela, orientação para o passado"
      }
    },
    
    spacing: {
      description: "Espaçamento entre palavras e linhas",
      interpretations: {
        wide: "Necessidade de espaço pessoal, independência",
        normal: "Sociabilidade equilibrada",
        narrow: "Necessidade de proximidade, possível ansiedade"
      }
    },
    
    speed: {
      description: "Velocidade da escrita",
      interpretations: {
        fast: "Agilidade mental, impaciência, espontaneidade",
        medium: "Ritmo equilibrado, reflexão adequada",
        slow: "Cautela, reflexão profunda, possível insegurança"
      }
    },
    
    regularity: {
      description: "Consistência da escrita",
      interpretations: {
        regular: "Estabilidade emocional, disciplina, confiabilidade",
        irregular: "Criatividade, espontaneidade, possível instabilidade emocional"
      }
    }
  },

  // Padrões de personalidade identificáveis
  personalityPatterns: {
    leadership: {
      indicators: [
        "Escrita com pressão forte e tamanho médio-grande",
        "Inclinação direita moderada",
        "Assinatura maior que o texto",
        "Letras maiúsculas bem formadas",
        "Espaçamento organizado"
      ],
      description: "Tendências de liderança e assertividade"
    },
    
    creativity: {
      indicators: [
        "Escrita irregular com variações criativas",
        "Letras conectadas de forma única",
        "Uso criativo do espaço",
        "Variações na pressão e tamanho",
        "Elementos decorativos nas letras"
      ],
      description: "Potencial criativo e pensamento inovador"
    },
    
    analytical: {
      indicators: [
        "Escrita pequena e regular",
        "Letras bem formadas e legíveis",
        "Espaçamento consistente",
        "Pressão média e controlada",
        "Organização clara do texto"
      ],
      description: "Capacidade analítica e atenção aos detalhes"
    },
    
    emotional: {
      indicators: [
        "Variações na pressão",
        "Inclinação variável",
        "Tamanho inconsistente",
        "Conexões entre letras fluidas",
        "Curvas acentuadas"
      ],
      description: "Sensibilidade emocional e empatia"
    }
  },

  // Metodologia de análise
  analysisMethodology: {
    steps: [
      "1. Observação geral: primeira impressão da escrita",
      "2. Análise da pressão: força aplicada no papel",
      "3. Estudo do tamanho: proporções das letras",
      "4. Avaliação da inclinação: direção das letras",
      "5. Exame do espaçamento: distâncias entre elementos",
      "6. Análise da velocidade: ritmo da escrita",
      "7. Verificação da regularidade: consistência geral",
      "8. Síntese: integração de todos os elementos"
    ],
    
    considerations: [
      "Considerar o contexto da escrita (pressa, cansaço, etc.)",
      "Analisar múltiplas amostras quando possível",
      "Evitar interpretações baseadas em elementos isolados",
      "Considerar fatores culturais e educacionais",
      "Manter objetividade científica na análise"
    ]
  },

  // Limitações e considerações éticas
  limitations: {
    technical: [
      "A grafologia não é uma ciência exata",
      "Resultados devem ser interpretados por profissionais qualificados",
      "Fatores físicos podem influenciar a escrita",
      "Análise isolada não deve determinar decisões importantes"
    ],
    
    ethical: [
      "Respeitar a privacidade do indivíduo",
      "Usar resultados de forma construtiva",
      "Não fazer diagnósticos médicos ou psiquiátricos",
      "Combinar com outras ferramentas de avaliação"
    ]
  },

  // Prompt especializado para IA
  aiPromptTemplate: `
    Como especialista em grafologia com formação em psicologia, analise a escrita manuscrita considerando:
    
    ELEMENTOS TÉCNICOS:
    - Pressão: força aplicada (forte/média/leve)
    - Tamanho: dimensões das letras (grande/médio/pequeno)
    - Inclinação: direção das letras (direita/vertical/esquerda)
    - Espaçamento: distâncias entre palavras e linhas
    - Velocidade: ritmo da escrita (rápida/média/lenta)
    - Regularidade: consistência geral (regular/irregular)
    
    INTERPRETAÇÃO PSICOLÓGICA:
    - Traços de personalidade predominantes
    - Estado emocional aparente
    - Estilo de comunicação
    - Potenciais áreas de desenvolvimento
    
    METODOLOGIA:
    - Base científica na análise
    - Consideração de múltiplos elementos
    - Interpretação equilibrada e construtiva
    - Recomendações práticas para desenvolvimento
    
    FORMATO DE RESPOSTA:
    Forneça análise estruturada em JSON com campos: analysis, interpretation, recommendations, recommendationsList.
  `
};

// Função para gerar prompt especializado em grafologia
export function generateGraphologyPrompt(imageData?: string, additionalContext?: string): string {
  let prompt = GRAPHOLOGY_TRAINING_MATERIALS.aiPromptTemplate;
  
  if (additionalContext) {
    prompt += `\n\nCONTEXTO ADICIONAL:\n${additionalContext}`;
  }
  
  prompt += `\n\nIMPORTANTE: Mantenha um tom profissional, científico e construtivo. 
  Evite diagnósticos definitivos e foque no desenvolvimento pessoal e profissional.`;
  
  return prompt;
}

// Função para validar elementos de análise grafológica
export function validateGraphologyAnalysis(analysis: any): boolean {
  const requiredFields = ['analysis', 'interpretation', 'recommendations'];
  return requiredFields.every(field => analysis.hasOwnProperty(field));
}