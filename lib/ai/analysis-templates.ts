// Templates de análise para diferentes tipos de testes
// Utilizados como fallback quando a IA não está disponível

export const PSYCHOSOCIAL_ANALYSIS_TEMPLATES = {
  high_autotranscendencia: {
    analysis: "Perfil com forte orientação para valores universais e bem-estar coletivo.",
    interpretation: "Demonstra preocupação genuína com o bem-estar dos outros e questões sociais.",
    recommendations: ["Considerar posições de liderança em projetos sociais", "Desenvolver habilidades de gestão de equipes"]
  },
  high_autopromocao: {
    analysis: "Perfil orientado para conquistas pessoais e reconhecimento.",
    interpretation: "Busca ativamente o sucesso e valoriza o reconhecimento pelos resultados.",
    recommendations: ["Canalizar ambição para projetos desafiadores", "Desenvolver habilidades de colaboração"]
  },
  high_conservacao: {
    analysis: "Perfil que valoriza estabilidade, segurança e tradição.",
    interpretation: "Prefere ambientes estruturados e processos bem definidos.",
    recommendations: ["Explorar funções em organizações estabelecidas", "Desenvolver habilidades de adaptação a mudanças"]
  },
  high_abertura_mudanca: {
    analysis: "Perfil aberto a novas experiências e mudanças.",
    interpretation: "Demonstra flexibilidade e capacidade de adaptação a novos contextos.",
    recommendations: ["Buscar projetos inovadores", "Considerar posições em startups ou empresas em transformação"]
  }
}

export const PERSONALITY_ANALYSIS_TEMPLATES = {
  high_extroversao: {
    analysis: "Perfil extrovertido com facilidade para interações sociais.",
    interpretation: "Energiza-se através do contato com outras pessoas e ambientes dinâmicos.",
    recommendations: ["Explorar oportunidades em vendas ou marketing", "Desenvolver habilidades de apresentação"]
  },
  high_amabilidade: {
    analysis: "Perfil cooperativo e empático nas relações interpessoais.",
    interpretation: "Demonstra facilidade para trabalhar em equipe e resolver conflitos.",
    recommendations: ["Considerar funções de mediação", "Desenvolver habilidades de liderança colaborativa"]
  },
  high_conscienciosidade: {
    analysis: "Perfil organizado e orientado para objetivos.",
    interpretation: "Demonstra disciplina e capacidade de planejamento a longo prazo.",
    recommendations: ["Explorar funções de gestão de projetos", "Desenvolver habilidades estratégicas"]
  },
  high_neuroticismo: {
    analysis: "Perfil que pode apresentar maior sensibilidade emocional.",
    interpretation: "Necessita de estratégias para gestão de estresse e ansiedade.",
    recommendations: ["Desenvolver técnicas de gestão emocional", "Buscar ambientes de trabalho estruturados"]
  },
  high_abertura: {
    analysis: "Perfil criativo e aberto a novas experiências.",
    interpretation: "Demonstra curiosidade intelectual e capacidade de inovação.",
    recommendations: ["Explorar funções criativas", "Buscar projetos de pesquisa e desenvolvimento"]
  }
}

export const GRAPHOLOGY_TRAINING_MATERIALS = {
  fundamentals: {
    title: "Fundamentos da Grafologia",
    description: "Princípios básicos da análise grafológica científica",
    content: {
      pressure: "A pressão da escrita revela energia vital e determinação",
      size: "O tamanho das letras indica autoestima e necessidade de reconhecimento",
      inclination: "A inclinação mostra orientação emocional e social",
      spacing: "O espaçamento revela organização mental e capacidade de planejamento",
      rhythm: "O ritmo indica estabilidade emocional e capacidade de adaptação",
      regularity: "A regularidade demonstra consistência comportamental"
    }
  },
  personality_patterns: {
    title: "Padrões de Personalidade",
    description: "Correlações entre características da escrita e traços de personalidade",
    content: {
      leadership: "Escrita firme, tamanho médio-grande, inclinação controlada",
      creativity: "Escrita variável, ornamentação moderada, espaçamento irregular",
      organization: "Escrita regular, espaçamento uniforme, margens consistentes",
      communication: "Legibilidade boa, conectividade adequada, fluidez na escrita",
      emotional_stability: "Pressão consistente, regularidade boa, ritmo equilibrado"
    }
  },
  analysis_methodology: {
    title: "Metodologia de Análise",
    description: "Processo estruturado para análise grafológica",
    steps: [
      "1. Observação geral: primeira impressão da escrita",
      "2. Análise da pressão: força aplicada no papel",
      "3. Estudo do tamanho: proporções das letras",
      "4. Avaliação da inclinação: direção das letras",
      "5. Análise do espaçamento: distribuição no papel",
      "6. Estudo do ritmo: fluidez da escrita",
      "7. Avaliação da regularidade: consistência dos traços",
      "8. Síntese e interpretação: conclusões integradas"
    ]
  },
  limitations: {
    title: "Limitações e Considerações Éticas",
    description: "Aspectos importantes a considerar na análise grafológica",
    content: {
      scientific_basis: "A grafologia deve ser usada como ferramenta complementar, não definitiva",
      cultural_factors: "Considerar influências culturais e educacionais na escrita",
      context_importance: "A análise deve considerar o contexto e propósito da escrita",
      ethical_use: "Usar apenas para desenvolvimento pessoal e profissional positivo",
      privacy: "Respeitar a privacidade e consentimento do indivíduo analisado"
    }
  }
}

// Função para selecionar template baseado no tipo de teste e pontuações
export function selectAnalysisTemplate(testType: string, scores: any) {
  let templates: any = {}
  
  switch (testType.toUpperCase()) {
    case 'PSYCHOSOCIAL':
      templates = PSYCHOSOCIAL_ANALYSIS_TEMPLATES
      break
    case 'PERSONALITY':
      templates = PERSONALITY_ANALYSIS_TEMPLATES
      break
    case 'GRAPHOLOGY':
      // Para grafologia, usar análise baseada em características detectadas
      return {
        analysis: "Análise grafológica baseada em características visuais detectadas.",
        interpretation: "Os padrões identificados sugerem traços específicos de personalidade.",
        recommendations: ["Desenvolver autoconhecimento", "Explorar potenciais identificados"]
      }
    default:
      return {
        analysis: "Análise personalizada baseada nos resultados obtidos.",
        interpretation: "Os resultados indicam um perfil único com características específicas.",
        recommendations: ["Continuar desenvolvimento pessoal", "Buscar feedback regular"]
      }
  }
  
  if (!scores || Object.keys(templates).length === 0) {
    return {
      analysis: "Análise personalizada baseada nos resultados obtidos.",
      interpretation: "Os resultados indicam um perfil único com características específicas.",
      recommendations: ["Continuar desenvolvimento pessoal", "Buscar feedback regular"]
    }
  }
  
  // Selecionar template baseado na pontuação mais alta
  const sortedScores = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
  
  const highestDimension = sortedScores[0]?.[0]
  const templateKey = `high_${highestDimension}`
  
  return templates[templateKey] || {
    analysis: "Análise personalizada baseada nos resultados obtidos.",
    interpretation: "Os resultados indicam um perfil único com características específicas.",
    recommendations: ["Continuar desenvolvimento pessoal", "Buscar feedback regular"]
  }
}

// Função para gerar análise a partir do template
export function generateAnalysisFromTemplate(template: any, scores: any, testResult: any) {
  const scoresText = Object.entries(scores || {})
    .map(([dimension, score]) => `${dimension}: ${(score as number).toFixed(1)}%`)
    .join(', ')
  
  const analysis = `${template.analysis}\n\nPontuações detalhadas: ${scoresText}`
  
  return {
    text: analysis,
    interpretation: template.interpretation,
    recommendations: template.recommendations.join('. ') + '.',
    recommendationsList: template.recommendations
  }
}