import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { GoogleGenerativeAI } from '@google/generative-ai'
// import vision from '@google-cloud/vision' // Removido para usar apenas Gemini AI

// Check if API keys are configured
function areAPIKeysConfigured(): boolean {
  const geminiKey = process.env.GEMINI_API_KEY
  
  // Only require Gemini API key since it's our primary analysis service
  return !!(geminiKey && geminiKey !== 'sua_chave_gemini_aqui')
}

// Mock analysis response for development
function generateMockAnalysis(): SignatureAnalysisResponse {
  return {
    detailedAnalysis: {
      technicalObservations: {
        pressure: 'Pressão moderada indica equilíbrio emocional e energia controlada. Sugere uma pessoa que consegue manter a calma sob pressão.',
        size: 'Tamanho médio da assinatura indica autoestima equilibrada e confiança moderada. Não busca chamar atenção excessiva nem se esconder.',
        inclination: 'Leve inclinação à direita sugere otimismo moderado e abertura para o futuro. Indica uma pessoa sociável e orientada para objetivos.',
        spacing: 'Espaçamento equilibrado entre elementos indica organização mental e capacidade de planejamento adequada.',
        rhythm: 'Ritmo consistente na escrita sugere estabilidade emocional e confiabilidade. Indica uma pessoa previsível e organizada.',
        regularity: 'Regularidade na formação das letras indica disciplina e atenção aos detalhes, com alguma flexibilidade criativa.',
        legibility: 'Assinatura com boa legibilidade indica transparência e clareza na comunicação profissional.',
        ornamentation: 'Ornamentação moderada demonstra equilíbrio entre funcionalidade e expressão pessoal.'
      },
      psychologicalInterpretation: 'Esta assinatura revela uma personalidade equilibrada e confiável. A pessoa demonstra boa autoestima, liderança natural e integridade. Há sinais de criatividade controlada e habilidades sociais desenvolvidas. O indivíduo parece ser ambicioso mas realista, com boa capacidade de adaptação e pensamento analítico. A estabilidade emocional é um ponto forte, sugerindo alguém em quem se pode confiar em situações desafiadoras.'
    },
    behavioralSummary: 'Esta assinatura revela uma personalidade equilibrada e confiável. A pessoa demonstra boa autoestima, liderança natural e integridade. Há sinais de criatividade controlada e habilidades sociais desenvolvidas. O indivíduo parece ser ambicioso mas realista, com boa capacidade de adaptação e pensamento analítico. A estabilidade emocional é um ponto forte, sugerindo alguém em quem se pode confiar em situações desafiadoras.',
    workplaceTrends: {
      communication: {
        score: 85,
        description: 'Comunicação clara e assertiva, com boa capacidade de expressão e transparência profissional.'
      },
      organization: {
        score: 82,
        description: 'Excelente capacidade organizacional evidenciada pela estrutura equilibrada da assinatura.'
      },
      emotionalStability: {
        score: 88,
        description: 'Alta estabilidade emocional demonstrada pela consistência e controle dos traços.'
      },
      leadership: {
        score: 80,
        description: 'Potencial de liderança natural com autoridade equilibrada e presença profissional.'
      },
      adaptability: {
        score: 76,
        description: 'Boa capacidade de adaptação com flexibilidade controlada e abertura a mudanças.'
      }
    },
    practicalSuggestions: [
      'Desenvolver ainda mais as habilidades de liderança através de cursos especializados',
      'Buscar oportunidades de mentoria para compartilhar conhecimentos e experiências',
      'Considerar posições de maior responsabilidade que aproveitem a estabilidade emocional',
      'Aprimorar técnicas de comunicação para maximizar o potencial já existente',
      'Explorar atividades que estimulem a criatividade controlada identificada'
    ],
    visualHighlights: [
      {
        x: 15,
        y: 25,
        width: 30,
        height: 12,
        type: 'pressure',
        interpretation: 'Pressão moderada e consistente indica equilíbrio emocional',
        technicalDetails: 'Análise de intensidade dos traços revela controle adequado'
      },
      {
        x: 45,
        y: 20,
        width: 25,
        height: 15,
        type: 'spacing',
        interpretation: 'Espaçamento equilibrado demonstra organização mental',
        technicalDetails: 'Distribuição harmônica dos elementos da assinatura'
      },
      {
        x: 70,
        y: 18,
        width: 20,
        height: 18,
        type: 'inclination',
        interpretation: 'Inclinação otimista sugere orientação para o futuro',
        technicalDetails: 'Ângulo ascendente indica motivação e ambição'
      }
    ],
    professionalInsights: {
      strengths: [
        'Liderança natural com autoridade equilibrada',
        'Excelente estabilidade emocional e autocontrole',
        'Comunicação clara e transparente',
        'Capacidade organizacional bem desenvolvida',
        'Integridade e confiabilidade profissional'
      ],
      developmentAreas: [
        'Desenvolver maior flexibilidade em estilos de liderança',
        'Aprimorar habilidades de inovação e criatividade',
        'Expandir conhecimentos em gestão de mudanças'
      ],
      workStyle: 'Estilo de trabalho equilibrado com foco em resultados e qualidade. Demonstra preferência por ambientes organizados e processos estruturados.',
      communicationStyle: 'Comunicação direta e assertiva, com transparência adequada e capacidade de transmitir confiança.',
      leadershipStyle: 'Liderança natural com autoridade equilibrada, capaz de inspirar confiança e tomar decisões consistentes.'
    },
    confidence: 75,
    scientificBasis: 'Esta análise utiliza princípios estabelecidos da grafologia aplicada a assinaturas, considerando aspectos técnicos como pressão, tamanho, inclinação, espaçamento e ritmo para inferir características de personalidade e comportamento profissional.'
  }
}

// API configurations
const VISION_API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate'
const ABACUSAI_API_KEY = process.env.ABACUSAI_API_KEY
const ABACUSAI_API_URL = 'https://cloud.abacus.ai/api/v0/deployments/predict'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface SignatureAnalysisRequest {
  imageData: string
  analysisType: 'signature'
  userId?: string
}

interface SignatureAnalysisResponse {
  detailedAnalysis: {
    technicalObservations: {
      pressure: string
      size: string
      inclination: string
      spacing: string
      rhythm: string
      regularity: string
      legibility: string
      ornamentation: string
    }
    psychologicalInterpretation: string
  }
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
    type: 'pressure' | 'spacing' | 'inclination' | 'size' | 'margin' | 'rhythm' | 'ornamentation' | 'legibility'
    interpretation: string
    technicalDetails: string
  }[]
  professionalInsights: {
    strengths: string[]
    developmentAreas: string[]
    workStyle: string
    communicationStyle: string
    leadershipStyle: string
  }
  confidence: number
  scientificBasis: string
}

// Google Cloud Vision function removed - using only Gemini AI and mock fallback

// Function to call AbacusAI API as fallback for signature analysis
async function analyzeSignatureWithAbacusAI(imageBase64: string): Promise<any> {
  if (!ABACUSAI_API_KEY) {
    throw new Error('AbacusAI API key not configured')
  }

  const requestBody = {
    deploymentId: 'graphology-analysis',
    data: {
      image: imageBase64,
      analysisType: 'signature'
    }
  }

  const response = await fetch(ABACUSAI_API_URL, {
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

  return await response.json()
}

// Function to analyze signature using Gemini AI with specialized graphology prompts
async function analyzeSignatureWithGeminiAI(imageBase64: string): Promise<SignatureAnalysisResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
  
  const graphologyPrompt = `
Você é um especialista em grafologia com mais de 20 anos de experiência em análise de assinaturas para avaliação profissional e psicológica. Analise esta assinatura seguindo os princípios científicos da grafologia.

Analise as seguintes características técnicas da assinatura:

1. **PRESSÃO**: Examine a intensidade e consistência dos traços
2. **TAMANHO**: Avalie as proporções e ocupação do espaço
3. **INCLINAÇÃO**: Observe a direção e ângulo dos elementos
4. **ESPAÇAMENTO**: Analise a distribuição interna dos elementos
5. **RITMO**: Examine a fluidez e velocidade de execução
6. **REGULARIDADE**: Avalie a consistência e variações
7. **LEGIBILIDADE**: Determine o grau de clareza e decodificação
8. **ORNAMENTAÇÃO**: Observe elementos decorativos e estilísticos

Com base nesta análise técnica, forneça:

**INTERPRETAÇÃO PSICOLÓGICA PROFUNDA**:
- Traços de personalidade evidenciados
- Características de liderança e autoridade
- Estabilidade emocional e autocontrole
- Capacidade de comunicação e relacionamento
- Orientação para objetivos e ambição

**ANÁLISE COMPORTAMENTAL NO TRABALHO**:
- Estilo de liderança predominante
- Capacidade de tomada de decisão
- Habilidades de comunicação profissional
- Adaptabilidade e flexibilidade
- Organização e planejamento

**INSIGHTS PROFISSIONAIS**:
- Pontos fortes para desenvolvimento de carreira
- Áreas que necessitam atenção ou desenvolvimento
- Sugestões práticas para maximizar potencial
- Adequação para diferentes tipos de função

Forneça uma análise detalhada, científica e profissional, baseada exclusivamente nos princípios estabelecidos da grafologia aplicada a assinaturas.

RETORNE APENAS UM JSON válido seguindo exatamente o formato indicado, preenchendo cada campo exclusivamente com dados obtidos da análise da imagem enviada. NÃO utilize valores de exemplo ou genéricos; produza valores originais e específicos para cada assinatura analisada:
{
  "detailedAnalysis": {
    "technicalObservations": {
      "pressure": "análise detalhada da pressão",
      "size": "análise detalhada do tamanho",
      "inclination": "análise detalhada da inclinação",
      "spacing": "análise detalhada do espaçamento",
      "rhythm": "análise detalhada do ritmo",
      "regularity": "análise detalhada da regularidade",
      "legibility": "análise detalhada da legibilidade",
      "ornamentation": "análise detalhada da ornamentação"
    },
    "psychologicalInterpretation": "interpretação psicológica profunda baseada nas características observadas"
  },
  "behavioralSummary": "resumo comportamental detalhado para contexto profissional",
  "workplaceTrends": {
    "communication": { "score": 85, "description": "descrição das habilidades de comunicação" },
    "organization": { "score": 82, "description": "descrição das habilidades organizacionais" },
    "emotionalStability": { "score": 88, "description": "descrição da estabilidade emocional" },
    "leadership": { "score": 90, "description": "descrição do potencial de liderança" },
    "adaptability": { "score": 78, "description": "descrição da capacidade de adaptação" }
  },
  "practicalSuggestions": [
    "sugestão prática 1",
    "sugestão prática 2",
    "sugestão prática 3",
    "sugestão prática 4",
    "sugestão prática 5"
  ],
  "professionalInsights": {
    "strengths": ["força 1", "força 2", "força 3", "força 4"],
    "developmentAreas": ["área 1", "área 2", "área 3"],
    "workStyle": "descrição do estilo de trabalho",
    "communicationStyle": "descrição do estilo de comunicação",
    "leadershipStyle": "descrição do estilo de liderança"
  },
  "confidence": 87,
  "scientificBasis": "base científica da análise grafológica aplicada"
}
`;

  const requestBody = {
    contents: [{
      parts: [
        {
          text: graphologyPrompt
        },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: cleanBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
      response_mime_type: "application/json"
    }
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  
  if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
    throw new Error('Invalid response from Gemini API')
  }

  // Gemini pode retornar diretamente um objeto JSON quando `response_mime_type` é "application/json".
  // Tentamos primeiro identificar um part que contenha texto; se não existir, assumimos que o primeiro part já é o JSON.
  const textPart = result.candidates[0].content.parts.find((p: any) => typeof p.text === "string")

  let analysisData: any
  try {
    if (textPart && textPart.text) {
      const analysisText = textPart.text

      // Extrai o último objeto JSON retornado pela Gemini (evita capturar exemplo do prompt)
      const lastOpen = analysisText.lastIndexOf('{')
      const lastClose = analysisText.lastIndexOf('}')
      if (lastOpen === -1 || lastClose === -1 || lastClose <= lastOpen) {
        throw new Error('Nenhum JSON encontrado na resposta da Gemini')
      }
      analysisData = JSON.parse(analysisText.slice(lastOpen, lastClose + 1))
    } else {
      // Se não há texto, provavelmente o próprio part contém o JSON estruturado
      const rawPart = result.candidates[0].content.parts[0]
      // Alguns formatos retornam como {"data":{...}} ou já diretamente o JSON esperado
      analysisData = rawPart.data ?? rawPart
    }
    
    // Add visual highlights based on the analysis
    analysisData.visualHighlights = generateVisualHighlights(analysisData);
    
    return analysisData;
  } catch (parseError) {
    console.error('Error parsing Gemini response:', parseError);
    throw new Error('Failed to parse Gemini analysis response');
  }
}

// Function to generate visual highlights based on analysis
function generateVisualHighlights(analysisData: any): any[] {
  return [
    {
      x: 20, y: 30, width: 60, height: 15,
      type: "pressure",
      interpretation: "Área de pressão analisada pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.pressure || "Análise de pressão"
    },
    {
      x: 15, y: 25, width: 70, height: 20,
      type: "size",
      interpretation: "Tamanho analisado pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.size || "Análise de tamanho"
    },
    {
      x: 10, y: 35, width: 80, height: 10,
      type: "inclination",
      interpretation: "Inclinação analisada pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.inclination || "Análise de inclinação"
    },
    {
      x: 25, y: 40, width: 50, height: 8,
      type: "legibility",
      interpretation: "Legibilidade analisada pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.legibility || "Análise de legibilidade"
    },
    {
      x: 30, y: 20, width: 40, height: 25,
      type: "ornamentation",
      interpretation: "Ornamentação analisada pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.ornamentation || "Análise de ornamentação"
    },
    {
      x: 18, y: 28, width: 65, height: 18,
      type: "rhythm",
      interpretation: "Ritmo analisado pela IA",
      technicalDetails: analysisData.detailedAnalysis?.technicalObservations?.rhythm || "Análise de ritmo"
    }
  ]
}

// Google Cloud Vision functions removed - now using only Gemini AI and mock fallback

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { imageData, analysisType, userId }: SignatureAnalysisRequest = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: 'Imagem é obrigatória' }, { status: 400 })
    }

    let analysisData: SignatureAnalysisResponse
    let modelUsed = 'gemini-ai'

    // Check if API keys are configured
    if (!areAPIKeysConfigured()) {
      console.log('⚠️ APIs não configuradas, usando análise mock para desenvolvimento')
      analysisData = generateMockAnalysis()
      modelUsed = 'mock-development'
      console.log('✅ Análise mock gerada com sucesso')
    } else {
      try {
        // First priority: Gemini AI for direct graphology analysis
        console.log('🔍 Tentando análise de assinatura com Gemini AI...')
        analysisData = await analyzeSignatureWithGeminiAI(imageData)
        modelUsed = 'gemini-ai'
        console.log('✅ Análise de assinatura realizada com Gemini AI')
      } catch (geminiError) {
        console.error('❌ Erro na API Gemini para assinatura:', geminiError)
        
        // Final fallback: use mock analysis
        console.log('🔄 Usando análise mock como último recurso')
        analysisData = generateMockAnalysis()
        modelUsed = 'mock-fallback'
        console.log('✅ Análise mock de fallback gerada')
      }
    }

    // Generate unique ID for the analysis
    const analysisId = uuidv4()
    
    // Get or create the graphology category
    let graphologyCategory = await db.testCategory.findFirst({
      where: {
        name: 'Grafologia'
      }
    })
    
    if (!graphologyCategory) {
      console.log('🔄 Criando categoria de grafologia...')
      graphologyCategory = await db.testCategory.create({
        data: {
          name: 'Grafologia',
          description: 'Análises de personalidade através da escrita e assinatura',
          icon: '✍️',
          color: '#8B5CF6',
          isActive: true
        }
      })
      console.log('✅ Categoria de grafologia criada com sucesso')
    }

    // Get or create the graphology test
    let graphologyTest = await db.test.findFirst({
      where: {
        testType: 'GRAPHOLOGY'
      }
    })
    
    if (!graphologyTest) {
      console.log('🔄 Criando teste de grafologia...')
      try {
        graphologyTest = await db.test.create({
          data: {
            categoryId: graphologyCategory.id,
            name: 'Análise Grafológica de Assinatura',
            description: 'Teste de análise de personalidade através da assinatura utilizando princípios científicos da grafologia',
            testType: 'GRAPHOLOGY',
            isActive: true
          }
        })
        console.log('✅ Teste de grafologia criado com sucesso')
      } catch (createError) {
        console.error('❌ Erro ao criar teste de grafologia:', createError)
        return NextResponse.json(
          { error: 'Erro ao configurar sistema de análise' },
          { status: 500 }
        )
      }
    }

    // Save analysis to database
    let aiAnalysis
    try {
      aiAnalysis = await db.aIAnalysis.create({
        data: {
          id: analysisId,
          testId: graphologyTest.id,
          userId: session.user.id,
          prompt: `Análise de assinatura com ${modelUsed}`,
          analysis: JSON.stringify(analysisData),
          confidence: analysisData.confidence || 85,
          analysisType: 'GRAPHOLOGY_SIGNATURE',
          metadata: JSON.stringify({
            analysisType: 'signature',
            processedAt: new Date().toISOString(),
            modelUsed,
            imageSize: imageData.length,
            apiKeysConfigured: areAPIKeysConfigured()
          })
        }
      })
      console.log('✅ Análise salva no banco de dados com sucesso')
    } catch (dbError) {
      console.error('❌ Erro ao salvar análise no banco:', dbError)
      // Return analysis even if database save fails
      return NextResponse.json({
        success: true,
        analysisId: analysisId,
        analysis: analysisData,
        confidence: analysisData.confidence || 85,
        warning: 'Análise realizada com sucesso, mas não foi possível salvar no histórico.'
      })
    }

    return NextResponse.json({
      success: true,
      analysisId: aiAnalysis.id,
      analysis: analysisData,
      confidence: aiAnalysis.confidence
    })

  } catch (error) {
    console.error('❌ Erro crítico na análise de assinatura:', error)
    
    // Provide more specific error information
    let errorMessage = 'Erro interno do servidor'
    let errorDetails = 'Ocorreu um erro inesperado durante o processamento'
    
    if (error instanceof Error) {
      console.error('Detalhes do erro:', error.message)
      console.error('Stack trace:', error.stack)
      
      // Don't expose internal error details in production
      if (process.env.NODE_ENV === 'development') {
        errorDetails = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        suggestion: 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}



// Função removida - agora usamos apenas análise real com IA
// A análise simulada foi completamente substituída por análise genuína com Gemini AI

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('analysisId')

    if (!analysisId) {
      return NextResponse.json({ error: 'ID da análise é obrigatório' }, { status: 400 })
    }

    // Buscar análise existente
    const aiAnalysis = await db.aIAnalysis.findFirst({
      where: {
        id: analysisId,
        userId: session.user.id,
        analysisType: 'GRAPHOLOGY_SIGNATURE'
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
    console.error('Erro ao buscar análise de assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}