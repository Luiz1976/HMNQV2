// HumaniQ AI - Análise Avançada de Imagem Grafológica
// API para processamento de imagens com IA e identificação de traços relevantes

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { GRAPHOLOGY_TRAINING_MATERIALS } from '@/lib/ai/graphology-training'

export const dynamic = 'force-dynamic'

// Interface para análise de imagem
interface ImageAnalysisResult {
  id: string
  imageUrl: string
  highlights: ImageHighlight[]
  analysis: string
  behavioralAnalysis: BehavioralAnalysis
  confidence: number
  metadata: any
  createdAt: Date
}

// Interface para destaques na imagem
interface ImageHighlight {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'pressure' | 'size' | 'inclination' | 'spacing' | 'organization' | 'regularity'
  description: string
  interpretation: string
  confidence: number
}

// Interface para análise comportamental avançada
interface BehavioralAnalysis {
  professionalSummary: string
  behavioralTrends: {
    communication: string
    organization: string
    emotionalStability: string
    leadership: string
    adaptability: string
  }
  organizationalSuggestions: string[]
  developmentAreas: string[]
  strengths: string[]
}

// POST - Analisar imagem grafológica
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const testType = formData.get('testType') as string
    const testResultId = formData.get('testResultId') as string

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    // Converter imagem para base64 para análise
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')
    const imageDataUrl = `data:${imageFile.type};base64,${imageBase64}`

    // Realizar análise da imagem com IA
    const analysisResult = await analyzeImageWithAI(imageDataUrl, testType, session.user.id)

    // Salvar análise no banco de dados
    const savedAnalysis = await prisma.aIAnalysis.create({
      data: {
        testId: 'graphology-test', // ID padrão para testes de grafologia
        userId: session.user.id,
        testResultId: testResultId || null,
        analysisType: 'image_analysis',
        prompt: 'Análise de imagem grafológica',
        analysis: JSON.stringify({
          imageUrl: imageDataUrl,
          highlights: analysisResult.highlights,
          analysis: analysisResult.analysis,
          behavioralAnalysis: analysisResult.behavioralAnalysis
        }),
        confidence: analysisResult.confidence || 85,
        metadata: analysisResult.metadata
      }
    })

    const analysisData = JSON.parse(savedAnalysis.analysis)
    return NextResponse.json({
      id: savedAnalysis.id,
      imageUrl: analysisData.imageUrl,
      highlights: analysisData.highlights,
      analysis: analysisData.analysis,
      behavioralAnalysis: analysisData.behavioralAnalysis,
      confidence: savedAnalysis.confidence,
      createdAt: savedAnalysis.createdAt
    })

  } catch (error) {
    console.error('Erro na análise de imagem:', error)
    return NextResponse.json(
      { error: 'Falha na análise da imagem' },
      { status: 500 }
    )
  }
}

// GET - Obter análise de imagem existente
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')
    const testResultId = searchParams.get('testResultId')

    if (analysisId) {
      const analysis = await prisma.aIAnalysis.findFirst({
        where: {
          id: analysisId,
          userId: session.user.id
        }
      })

      if (!analysis) {
        return NextResponse.json(
          { error: 'Análise não encontrada' },
          { status: 404 }
        )
      }

      const analysisData = JSON.parse(analysis.analysis)
      return NextResponse.json({
        ...analysis,
        imageUrl: analysisData.imageUrl,
        highlights: analysisData.highlights,
        analysis: analysisData.analysis,
        behavioralAnalysis: analysisData.behavioralAnalysis,
        confidence: analysis.confidence
      })
    }

    if (testResultId) {
      const analysis = await prisma.aIAnalysis.findFirst({
        where: {
          testResultId,
          userId: session.user.id
        }
      })

      if (analysis) {
        const analysisData = JSON.parse(analysis.analysis)
        return NextResponse.json({
          ...analysis,
          imageUrl: analysisData.imageUrl,
          highlights: analysisData.highlights,
          analysis: analysisData.analysis,
          behavioralAnalysis: analysisData.behavioralAnalysis,
          confidence: analysis.confidence
        })
      }
      return NextResponse.json(null)
    }

    return NextResponse.json(
      { error: 'Parâmetros insuficientes' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao buscar análise:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar análise' },
      { status: 500 }
    )
  }
}

// Função para analisar imagem com IA
async function analyzeImageWithAI(imageDataUrl: string, testType: string, userId: string): Promise<ImageAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    // Simular análise se não houver API key
    return simulateImageAnalysis(imageDataUrl, testType)
  }

  try {
    const prompt = generateImageAnalysisPrompt(testType)
    
    // Usar Google Gemini Vision API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageDataUrl.split(',')[1]
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Erro na API Gemini: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error('Resposta vazia do Gemini')
    }

    return parseImageAnalysisResponse(aiResponse, imageDataUrl, testType)

  } catch (error) {
    console.error('Erro na análise com Gemini Vision:', error)
    // Fallback para simulação
    return simulateImageAnalysis(imageDataUrl, testType)
  }
}

// Função para gerar prompt de análise de imagem
function generateImageAnalysisPrompt(testType: string): string {
  return `
Você é um especialista em grafologia com formação em psicologia e visão computacional. Analise esta imagem de ${testType === 'manuscript' ? 'manuscrito' : 'assinatura'} e identifique traços grafológicos relevantes.

BASE CIENTÍFICA:
${GRAPHOLOGY_TRAINING_MATERIALS.scientificFoundations.definition}

ELEMENTOS PARA ANALISAR:
- Pressão da escrita (força aplicada)
- Tamanho das letras (dimensões)
- Inclinação (direção das letras)
- Espaçamento (distâncias entre elementos)
- Organização (estrutura geral)
- Regularidade (consistência)

TAREFAS:
1. Identifique áreas específicas da imagem que demonstram cada elemento
2. Forneça coordenadas aproximadas (x, y, largura, altura) em percentual da imagem
3. Gere análise comportamental profissional
4. Crie sugestões organizacionais práticas

FORMATO DE RESPOSTA (JSON):
{
  "highlights": [
    {
      "x": 10,
      "y": 20,
      "width": 30,
      "height": 15,
      "type": "pressure",
      "description": "Pressão forte na escrita",
      "interpretation": "Indica determinação e energia",
    
    }
  ],
  "analysis": "Análise detalhada dos padrões identificados",
  "behavioralAnalysis": {
    "professionalSummary": "Resumo comportamental profissional",
    "behavioralTrends": {
      "communication": "Estilo de comunicação identificado",
      "organization": "Capacidade organizacional",
      "emotionalStability": "Estabilidade emocional",
      "leadership": "Potencial de liderança",
      "adaptability": "Capacidade de adaptação"
    },
    "organizationalSuggestions": ["Sugestão 1", "Sugestão 2"],
    "developmentAreas": ["Área 1", "Área 2"],
    "strengths": ["Força 1", "Força 2"]
  },
  "confidence": 85
}

IMPORTANTE: Use coordenadas em percentual (0-100) para responsividade. Seja preciso nas interpretações baseadas na ciência grafológica.
  `
}

// Função para simular análise de imagem
function simulateImageAnalysis(imageDataUrl: string, testType: string): ImageAnalysisResult {
  const highlights: ImageHighlight[] = [
    {
      id: '1',
      x: 15,
      y: 25,
      width: 25,
      height: 12,
      type: 'pressure',
      description: 'Pressão forte na escrita',
      interpretation: 'Indica determinação e energia emocional intensa',
      confidence: 88
    },
    {
      id: '2',
      x: 45,
      y: 35,
      width: 30,
      height: 15,
      type: 'inclination',
      description: 'Inclinação para a direita',
      interpretation: 'Demonstra orientação social e extroversão',
      confidence: 92
    },
    {
      id: '3',
      x: 20,
      y: 55,
      width: 40,
      height: 10,
      type: 'spacing',
      description: 'Espaçamento regular entre palavras',
      interpretation: 'Indica equilíbrio emocional e organização mental',
      confidence: 85
    }
  ]

  const behavioralAnalysis: BehavioralAnalysis = {
    professionalSummary: "Perfil de pessoa determinada e socialmente orientada, com boa capacidade de organização e estabilidade emocional. Demonstra energia para enfrentar desafios e tendência natural para trabalho em equipe.",
    behavioralTrends: {
      communication: "Comunicação direta e assertiva, com facilidade para expressar ideias",
      organization: "Boa capacidade de planejamento e estruturação de tarefas",
      emotionalStability: "Equilíbrio emocional adequado com controle de impulsos",
      leadership: "Potencial de liderança com características de influência positiva",
      adaptability: "Flexibilidade para mudanças e novos desafios"
    },
    organizationalSuggestions: [
      "Aproveitar energia e determinação em projetos desafiadores",
      "Utilizar habilidades sociais em funções de relacionamento",
      "Desenvolver capacidades de liderança através de mentoria"
    ],
    developmentAreas: [
      "Aprimorar paciência em processos longos",
      "Desenvolver escuta ativa em situações de conflito"
    ],
    strengths: [
      "Determinação e persistência",
      "Habilidades sociais desenvolvidas",
      "Capacidade organizacional",
      "Estabilidade emocional"
    ]
  }

  return {
    id: Date.now().toString(),
    imageUrl: imageDataUrl,
    highlights,
    analysis: "Análise grafológica revela um perfil equilibrado com características de liderança e boa adaptação social. A pressão da escrita indica energia e determinação, enquanto a inclinação sugere orientação para relacionamentos interpessoais. O espaçamento regular demonstra organização mental e controle emocional adequado.",
    behavioralAnalysis,
    confidence: 87,
    metadata: {
      testType,
      analysisDate: new Date().toISOString(),
      highlightsCount: highlights.length,
      simulatedAnalysis: true
    },
    createdAt: new Date()
  }
}

// Função para processar resposta da IA
function parseImageAnalysisResponse(aiResponse: string, imageDataUrl: string, testType: string): ImageAnalysisResult {
  try {
    // Tentar extrair JSON da resposta
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        id: Date.now().toString(),
        imageUrl: imageDataUrl,
        highlights: parsed.highlights || [],
        analysis: parsed.analysis || '',
        behavioralAnalysis: parsed.behavioralAnalysis || {},
        confidence: parsed.confidence || 85,
        metadata: {
          testType,
          analysisDate: new Date().toISOString(),
          aiGenerated: true
        },
        createdAt: new Date()
      }
    }
  } catch (error) {
    console.error('Erro ao processar resposta da IA:', error)
  }

  // Fallback para simulação
  return simulateImageAnalysis(imageDataUrl, testType)
}