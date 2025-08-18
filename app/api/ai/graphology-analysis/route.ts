import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db as prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Verificar se a chave existe antes de inicializar
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ABACUSAI_API_KEY = process.env.ABACUSAI_API_KEY
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

interface GraphologyAnalysisRequest {
  imageBase64: string
  testId: string
  manuscriptType: 'manuscript' | 'signature'
}

interface GraphologyAnalysisResponse {
  behavioralSummary: string
  workplaceTrends: {
    communication: { score: number; description: string }
    organization: { score: number; description: string }
    emotionalStability: { score: number; description: string }
    leadership: { score: number; description: string }
    adaptability: { score: number; description: string }
  }
  practicalSuggestions: string[]
  visualHighlights: {
    x: number
    y: number
    width: number
    height: number
    type: 'pressure' | 'spacing' | 'inclination' | 'size' | 'margin' | 'rhythm'
    interpretation: string
    technicalDetails?: string
  }[]
  confidence: number
  detailedAnalysis?: {
    technicalObservations: {
      pressure: string
      size: string
      inclination: string
      spacing: string
      rhythm: string
      regularity: string
    }
    psychologicalInterpretation: string
  }
  professionalInsights?: {
    strengths: string[]
    developmentAreas: string[]
    workStyle: string
    communicationStyle: string
  }
  scientificBasis?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { imageBase64, testId, manuscriptType }: GraphologyAnalysisRequest = await request.json()

    if (!imageBase64 || !testId) {
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 })
    }

    let analysisData: GraphologyAnalysisResponse
    let modelUsed = 'unknown'

    // Sistema de fallback hierárquico
    if (GEMINI_API_KEY && genAI) {
      try {
        console.log('🔍 Tentando análise com Google Gemini API...')
        // Configurar o modelo Gemini Vision
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Você é um especialista em grafologia com formação em psicologia e décadas de experiência em análise comportamental através da escrita manuscrita. Analise esta imagem de ${manuscriptType === 'manuscript' ? 'manuscrito' : 'assinatura'} seguindo rigorosamente os princípios científicos da grafologia.

## METODOLOGIA DE ANÁLISE CIENTÍFICA:

### 1. OBSERVAÇÃO GERAL
- Primeira impressão da escrita
- Harmonia geral do conjunto
- Organização espacial

### 2. ANÁLISE TÉCNICA DETALHADA

**PRESSÃO (Força aplicada):**
- Forte: Energia, determinação, intensidade emocional
- Média: Equilíbrio emocional, estabilidade
- Leve: Sensibilidade, delicadeza, possível falta de energia

**TAMANHO (Dimensões das letras):**
- Grande: Extroversão, confiança, necessidade de reconhecimento
- Médio: Equilíbrio, adaptabilidade social
- Pequeno: Introversão, concentração, modéstia

**INCLINAÇÃO (Direção das letras):**
- Direita: Extroversão, sociabilidade, orientação para o futuro
- Vertical: Controle emocional, objetividade, independência
- Esquerda: Introversão, cautela, ligação com o passado

**ESPAÇAMENTO:**
- Entre letras: Capacidade de relacionamento
- Entre palavras: Necessidade de espaço pessoal
- Entre linhas: Organização mental

**VELOCIDADE/RITMO:**
- Rápida: Agilidade mental, impaciência
- Média: Equilíbrio, reflexão adequada
- Lenta: Cautela, reflexão profunda

**REGULARIDADE:**
- Regular: Estabilidade, confiabilidade
- Irregular: Espontaneidade, criatividade, possível instabilidade

### 3. INTERPRETAÇÃO PSICOLÓGICA PROFISSIONAL
Baseie-se nos elementos observados para inferir:
- Traços de personalidade predominantes
- Estado emocional aparente
- Estilo de comunicação
- Potencial de liderança
- Capacidade de adaptação
- Organização mental
- Estabilidade emocional

### 4. ANÁLISE COMPORTAMENTAL NO TRABALHO
Avalie especificamente:
- Comunicação: Clareza, assertividade, diplomacia
- Organização: Método, planejamento, estrutura
- Estabilidade Emocional: Controle, resiliência, equilíbrio
- Liderança: Autoridade natural, capacidade de influência
- Adaptabilidade: Flexibilidade, abertura a mudanças

### 5. IDENTIFICAÇÃO VISUAL PRECISA
Identifique e marque na imagem (coordenadas em %):
- Áreas de pressão significativa
- Padrões de espaçamento
- Variações de inclinação
- Mudanças de tamanho
- Características de margem
- Elementos rítmicos

### 6. RECOMENDAÇÕES PRÁTICAS
Forneça sugestões específicas e acionáveis para desenvolvimento pessoal e profissional.

## FORMATO DE RESPOSTA JSON:
{
  "detailedAnalysis": {
    "technicalObservations": {
      "pressure": "Análise detalhada da pressão",
      "size": "Análise detalhada do tamanho",
      "inclination": "Análise detalhada da inclinação",
      "spacing": "Análise detalhada do espaçamento",
      "rhythm": "Análise detalhada do ritmo",
      "regularity": "Análise detalhada da regularidade"
    },
    "psychologicalInterpretation": "Interpretação psicológica profissional baseada nos elementos técnicos observados"
  },
  "behavioralSummary": "Resumo comportamental profissional de 3-4 parágrafos com base científica",
  "workplaceTrends": {
    "communication": { "score": 0-100, "description": "Análise detalhada da comunicação com base nos padrões observados" },
    "organization": { "score": 0-100, "description": "Análise detalhada da organização com base nos padrões observados" },
    "emotionalStability": { "score": 0-100, "description": "Análise detalhada da estabilidade emocional com base nos padrões observados" },
    "leadership": { "score": 0-100, "description": "Análise detalhada da liderança com base nos padrões observados" },
    "adaptability": { "score": 0-100, "description": "Análise detalhada da adaptabilidade com base nos padrões observados" }
  },
  "practicalSuggestions": ["Sugestão específica 1", "Sugestão específica 2", "Sugestão específica 3", "Sugestão específica 4", "Sugestão específica 5"],
  "visualHighlights": [
    {
      "x": 0-100,
      "y": 0-100,
      "width": 0-100,
      "height": 0-100,
      "type": "pressure|spacing|inclination|size|margin|rhythm",
      "interpretation": "Interpretação específica baseada em princípios grafológicos",

      "technicalDetails": "Detalhes técnicos específicos do que foi observado"
    }
  ],
  "professionalInsights": {
    "strengths": ["Força 1", "Força 2", "Força 3"],
    "developmentAreas": ["Área 1", "Área 2", "Área 3"],
    "workStyle": "Descrição do estilo de trabalho",
    "communicationStyle": "Descrição do estilo de comunicação"
  },
  "confidence": 0-100,
  "scientificBasis": "Explicação dos princípios grafológicos aplicados na análise"
}

## IMPORTANTE:
- Base sua análise em princípios grafológicos científicos estabelecidos
- Seja objetivo e profissional
- Evite interpretações baseadas em elementos isolados
- Considere o conjunto da escrita
- Mantenha ética e responsabilidade na interpretação
- Forneça pelo menos 5-8 highlights visuais precisos
- Seja específico nas coordenadas dos highlights (use valores realistas)
`

    // Converter base64 para formato adequado
    const imageData = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        mimeType: 'image/jpeg'
      }
    }

        // Fazer a análise com Gemini Vision
        const result = await model.generateContent([prompt, imageData])
        const response = await result.response
        const analysisText = response.text()

        // Tentar extrair JSON da resposta
        try {
          // Remover markdown se presente
          const cleanedText = analysisText.replace(/```json\n?|```\n?/g, '').trim()
          analysisData = JSON.parse(cleanedText)
          modelUsed = 'gemini-1.5-flash'
          console.log('✅ Análise realizada com Google Gemini API')
        } catch (parseError) {
          console.error('Erro ao fazer parse da resposta do Gemini:', parseError)
          throw parseError
        }
      } catch (geminiError) {
        console.log('❌ Erro com Gemini API, tentando AbacusAI...', geminiError)
        
        // 2. Tentar AbacusAI como fallback
        if (ABACUSAI_API_KEY) {
          try {
            console.log('🔄 Tentando análise com AbacusAI...')
            analysisData = await analyzeWithAbacusAI(imageBase64, manuscriptType)
            modelUsed = 'abacus-ai'
            console.log('✅ Análise realizada com AbacusAI')
          } catch (abacusError) {
            console.log('❌ Erro com AbacusAI, usando análise simulada...', abacusError)
            analysisData = generateSimulatedAnalysis(manuscriptType)
            modelUsed = 'simulated-analysis-no-abacus-key'
            console.log('✅ Análise simulada gerada')
          }
        } else {
          console.log('🔄 AbacusAI não configurado, usando análise simulada...')
          analysisData = generateSimulatedAnalysis(manuscriptType)
          modelUsed = 'simulated-analysis-no-abacus-key'
          console.log('✅ Análise simulada gerada')
        }
      }
    } else {
      // 2. Tentar AbacusAI se não houver chave Gemini
      if (ABACUSAI_API_KEY) {
        try {
          console.log('🔄 Gemini não configurado, tentando AbacusAI...')
          analysisData = await analyzeWithAbacusAI(imageBase64, manuscriptType)
          modelUsed = 'abacus-ai'
          console.log('✅ Análise realizada com AbacusAI')
        } catch (abacusError) {
          console.log('❌ Erro com AbacusAI, usando análise simulada...', abacusError)
          analysisData = generateSimulatedAnalysis(manuscriptType)
          modelUsed = 'simulated-analysis-no-abacus-key'
          console.log('✅ Análise simulada gerada')
        }
      } else {
        // 3. Usar análise simulada como último recurso
        console.log('🔄 Nenhuma API configurada, usando análise simulada...')
        analysisData = generateSimulatedAnalysis(manuscriptType)
        modelUsed = 'simulated-analysis-no-keys'
        console.log('✅ Análise simulada gerada')
      }
    }

    // Salvar a análise no banco de dados
    const aiAnalysis = await prisma.aIAnalysis.create({
      data: {
        testId: testId,
        userId: session.user.id,
        testResultId: testId,
        prompt: 'Análise grafológica avançada com IA'.substring(0, 1000), // Limitar o tamanho do prompt
        analysis: JSON.stringify(analysisData),
        confidence: analysisData.confidence || 85,
        analysisType: 'GRAPHOLOGY_ADVANCED',
        metadata: {
          manuscriptType,
          processedAt: new Date().toISOString(),
          modelUsed
        }
      }
    })

    return NextResponse.json({
      success: true,
      analysisId: aiAnalysis.id,
      analysis: analysisData,
      confidence: aiAnalysis.confidence
    })

  } catch (error) {
    console.error('Erro na análise grafológica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para análise com AbacusAI
async function analyzeWithAbacusAI(imageBase64: string, manuscriptType: string): Promise<GraphologyAnalysisResponse> {
  if (!ABACUSAI_API_KEY) {
    throw new Error('AbacusAI API key not configured')
  }

  const requestBody = {
    deploymentId: 'graphology-analysis',
    data: {
      image: imageBase64,
      analysisType: manuscriptType
    }
  }

  const response = await fetch('https://api.abacus.ai/api/v0/deployments/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ABACUSAI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`AbacusAI API error: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  return result.prediction || generateSimulatedAnalysis(manuscriptType)
}

// Função para gerar análise simulada
function generateSimulatedAnalysis(manuscriptType: string): GraphologyAnalysisResponse {
  const isSignature = manuscriptType === 'signature'
  
  return {
    detailedAnalysis: {
      technicalObservations: {
        pressure: isSignature ? "Pressão moderada a forte detectada na assinatura, indicando confiança e determinação na tomada de decisões importantes." : "Pressão equilibrada observada no manuscrito, sugerindo estabilidade emocional e energia adequada para as tarefas.",
        size: isSignature ? "Tamanho médio a grande da assinatura, demonstrando autoconfiança e presença marcante." : "Letras de tamanho médio, indicando equilíbrio entre introversão e extroversão.",
        inclination: isSignature ? "Inclinação predominantemente à direita na assinatura, revelando orientação para o futuro e sociabilidade." : "Inclinação ligeiramente à direita, demonstrando abertura social e otimismo.",
        spacing: isSignature ? "Espaçamento controlado entre elementos da assinatura, indicando organização e clareza de pensamento." : "Espaçamento regular entre palavras e letras, sugerindo capacidade de relacionamento equilibrada.",
        rhythm: isSignature ? "Ritmo fluido e controlado na execução da assinatura, indicando segurança e prática." : "Ritmo de escrita moderado, demonstrando reflexão adequada antes da ação.",
        regularity: isSignature ? "Boa regularidade na assinatura com variações naturais, mostrando confiabilidade e autenticidade." : "Regularidade adequada com variações naturais, indicando flexibilidade e adaptabilidade."
      },
      psychologicalInterpretation: isSignature ? "A análise da assinatura revela uma personalidade confiante e determinada. Os padrões observados sugerem uma pessoa com boa autoestima, capacidade de liderança e orientação para resultados. A fluidez da execução indica experiência e segurança nas decisões importantes." : "A análise do manuscrito indica uma personalidade equilibrada com características positivas para o ambiente profissional. Os padrões de escrita sugerem estabilidade emocional, capacidade de comunicação efetiva e organização mental estruturada."
    },
    behavioralSummary: isSignature ? "A análise grafológica da assinatura revela um perfil comportamental de liderança natural. A pessoa demonstra confiança em suas decisões, capacidade de assumir responsabilidades e presença marcante em grupos. Os padrões identificados sugerem alguém orientado para resultados, com boa capacidade de comunicação e habilidades interpessoais desenvolvidas. A fluidez e controle na execução da assinatura indicam maturidade emocional e experiência em posições de responsabilidade." : "A análise grafológica do manuscrito revela um perfil comportamental equilibrado e promissor para o ambiente profissional. A pessoa demonstra estabilidade emocional, organização mental e capacidade de comunicação clara. Os padrões de escrita indicam alguém confiável, adaptável e com bom potencial para trabalho em equipe. A regularidade e fluidez da escrita sugerem consistência no desempenho e capacidade de manter foco nas tarefas.",
    workplaceTrends: {
      communication: {
        score: isSignature ? 88 : 85,
        description: isSignature ? "Excelente capacidade de comunicação evidenciada pela clareza e fluidez da assinatura. Demonstra habilidade para transmitir ideias de forma assertiva e convincente." : "Boa capacidade de comunicação observada através da organização e clareza da escrita. Demonstra habilidade para expressar ideias de forma estruturada."
      },
      organization: {
        score: isSignature ? 85 : 88,
        description: isSignature ? "Boa organização demonstrada pelo controle e estrutura da assinatura. Indica capacidade de planejamento e execução ordenada." : "Excelente organização evidenciada pelo espaçamento regular e estrutura da escrita. Indica forte capacidade de planejamento e método."
      },
      emotionalStability: {
        score: isSignature ? 87 : 86,
        description: isSignature ? "Alta estabilidade emocional refletida na consistência e controle da assinatura. Demonstra capacidade de manter equilíbrio sob pressão." : "Boa estabilidade emocional observada através da regularidade e pressão equilibrada da escrita. Indica capacidade de lidar com desafios."
      },
      leadership: {
        score: isSignature ? 90 : 82,
        description: isSignature ? "Forte potencial de liderança evidenciado pela presença e confiança da assinatura. Demonstra autoridade natural e capacidade de influência." : "Bom potencial de liderança sugerido pela organização e clareza da escrita. Indica capacidade de orientar e coordenar equipes."
      },
      adaptability: {
        score: isSignature ? 83 : 87,
        description: isSignature ? "Boa adaptabilidade demonstrada pelas variações naturais na assinatura. Indica flexibilidade para diferentes contextos." : "Excelente adaptabilidade evidenciada pelas variações controladas na escrita. Demonstra flexibilidade e abertura a mudanças."
      }
    },
    practicalSuggestions: isSignature ? [
      "Aproveitar a confiança natural para assumir mais responsabilidades de liderança",
      "Desenvolver ainda mais as habilidades de comunicação em apresentações públicas",
      "Utilizar a capacidade de influência para mentoria de equipes",
      "Manter o equilíbrio entre assertividade e receptividade a feedback",
      "Explorar oportunidades de networking para expandir conexões profissionais"
    ] : [
      "Aproveitar a organização natural para liderar projetos complexos",
      "Desenvolver ainda mais as habilidades de comunicação escrita",
      "Utilizar a estabilidade emocional para mediar conflitos",
      "Explorar oportunidades de mentoria aproveitando a clareza de pensamento",
      "Considerar posições que exijam planejamento estratégico e atenção aos detalhes"
    ],
    visualHighlights: [
      { 
        x: 15, y: 20, width: 25, height: 12, 
        type: "pressure", 
        interpretation: isSignature ? "Pressao forte na inicial da assinatura" : "Pressao equilibrada nas letras principais", 
        technicalDetails: "Analise simulada baseada em padroes tipicos" 
      },
      { 
        x: 45, y: 35, width: 20, height: 10, 
        type: "spacing", 
        interpretation: isSignature ? "Espacamento controlado entre elementos" : "Espacamento regular entre palavras", 
        technicalDetails: "Padrao identificado por analise simulada" 
      },
      { 
        x: 70, y: 25, width: 18, height: 15, 
        type: "inclination", 
        interpretation: isSignature ? "Inclinacao a direita na finalizacao" : "Inclinacao consistente a direita", 
        technicalDetails: "Caracteristica detectada por simulacao" 
      },
      { 
        x: 25, y: 50, width: 30, height: 8, 
        type: "size", 
        interpretation: isSignature ? "Tamanho medio a grande" : "Tamanho medio das letras", 
        technicalDetails: "Dimensoes analisadas por simulacao" 
      },
      { 
        x: 10, y: 15, width: 80, height: 5, 
        type: "margin", 
        interpretation: isSignature ? "Margem superior adequada" : "Margens bem organizadas", 
        technicalDetails: "Organizacao espacial simulada" 
      },
      { 
        x: 35, y: 40, width: 40, height: 12, 
        type: "rhythm", 
        interpretation: isSignature ? "Ritmo fluido e controlado" : "Ritmo moderado e reflexivo", 
        technicalDetails: "Fluidez avaliada por simulacao" 
      }
    ],
    professionalInsights: {
      strengths: isSignature ? [
        "Liderança natural e presença marcante",
        "Confiança e determinação nas decisões",
        "Boa capacidade de comunicação assertiva"
      ] : [
        "Organização mental estruturada",
        "Estabilidade emocional e confiabilidade",
        "Capacidade de comunicação clara e efetiva"
      ],
      developmentAreas: isSignature ? [
        "Desenvolver ainda mais a escuta ativa",
        "Aprimorar flexibilidade em diferentes contextos",
        "Equilibrar assertividade com colaboração"
      ] : [
        "Desenvolver mais confiança em apresentações",
        "Aprimorar habilidades de liderança",
        "Expandir rede de relacionamentos profissionais"
      ],
      workStyle: isSignature ? "Estilo de trabalho orientado para resultados, com foco em liderança e tomada de decisões rápidas. Prefere ambientes dinâmicos onde possa exercer influência e responsabilidade." : "Estilo de trabalho metódico e organizado, com foco na qualidade e atenção aos detalhes. Prefere ambientes estruturados onde possa planejar e executar tarefas de forma sistemática.",
      communicationStyle: isSignature ? "Comunicação direta e assertiva, com capacidade de influenciar e persuadir. Demonstra confiança ao expressar ideias e tomar posições claras em discussões." : "Comunicação clara e estruturada, com foco na transmissão efetiva de informações. Demonstra capacidade de organizar ideias de forma lógica e compreensível."
    },
    confidence: isSignature ? 88 : 85,
    scientificBasis: isSignature ? "Esta análise simulada baseia-se em princípios estabelecidos da grafologia aplicados à análise de assinaturas, considerando elementos como pressão, fluidez, tamanho e organização espacial. A assinatura é considerada uma expressão concentrada da personalidade, refletindo a autoimagem e o comportamento em situações formais." : "Esta análise simulada fundamenta-se em princípios científicos da grafologia, considerando elementos técnicos como pressão, inclinação, espaçamento e regularidade. A escrita manuscrita reflete padrões neuromotores que podem indicar características de personalidade e comportamento."
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')

    if (!testId) {
      return NextResponse.json({ error: 'ID do teste é obrigatório' }, { status: 400 })
    }

    // Buscar análise existente
    const aiAnalysis = await prisma.aIAnalysis.findFirst({
      where: {
        testResultId: testId,
        analysisType: 'GRAPHOLOGY_ADVANCED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!aiAnalysis) {
      return NextResponse.json({ error: 'Análise não encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analysis: JSON.parse(aiAnalysis.analysis as string),
      confidence: aiAnalysis.confidence,
      createdAt: aiAnalysis.createdAt
    })

  } catch (error) {
    console.error('Erro ao buscar análise grafológica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}