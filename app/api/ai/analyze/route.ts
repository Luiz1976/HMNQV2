// HumaniQ AI - Análise Inteligente de Testes
// API para cálculo automático de testes e geração de relatórios profissionais

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import {
  PSYCHOSOCIAL_ANALYSIS_TEMPLATES,
  PERSONALITY_ANALYSIS_TEMPLATES,
  GRAPHOLOGY_TRAINING_MATERIALS
} from '@/lib/ai/analysis-templates'

export const dynamic = 'force-dynamic'

// Interface para o resultado da análise de IA
interface AIAnalysisResult {
  analysis: string
  interpretation: string
  recommendations: string
  recommendationsList: string[]
  professionalReport: string
  confidence: number
  metadata?: any
}

// Interfaces para análise de imagem
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

// Tipos de pontuação para diferentes testes
type TestScores = {
  [key: string]: number | string
}

// Interface para dados de teste
interface TestData {
  testType: string
  answers: any[]
  scores?: TestScores
  metadata?: any
}

// POST - Analisar teste com IA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { testResultId, testData }: { testResultId?: string, testData?: TestData } = await request.json()

    if (testResultId) {
      // Analisar resultado de teste existente
      return await analyzeExistingTestResult(testResultId, session.user.id)
    } else if (testData) {
      // Analisar dados de teste em tempo real
      return await analyzeTestData(testData, session.user.id)
    } else {
      return NextResponse.json(
        { error: 'Dados insuficientes para análise' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro na análise de IA:', error)
    return NextResponse.json(
      { error: 'Falha na análise com IA' },
      { status: 500 }
    )
  }
}

// GET - Obter análises existentes
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
    const testResultId = searchParams.get('testResultId')
    const userId = searchParams.get('userId') || session.user.id

    if (testResultId) {
      // Buscar análise específica
      const analysis = await prisma.aIAnalysis.findFirst({
        where: {
          testResultId,
          userId
        }
      })

      if (!analysis) {
        return NextResponse.json(
          { error: 'Análise não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        id: analysis.id,
        analysis: analysis.analysis,
        metadata: analysis.metadata,
        createdAt: analysis.createdAt
      })
    } else {
      // Listar todas as análises do usuário
      const analyses = await prisma.aIAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      return NextResponse.json(analyses)
    }
  } catch (error) {
    console.error('Erro ao buscar análises:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar análises' },
      { status: 500 }
    )
  }
}

// Função para analisar resultado de teste existente
async function analyzeExistingTestResult(testResultId: string, userId: string): Promise<NextResponse> {
  try {
    // Buscar resultado do teste
    const testResult = await prisma.testResult.findFirst({
      where: {
        id: testResultId,
        userId
      },
      include: {
        test: true,
        session: {
          include: {
            answers: {
              include: {
                question: true
              }
            }
          }
        },
        user: true
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado do teste não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe análise
    const existingAnalysis = await prisma.aIAnalysis.findFirst({
      where: {
        testResultId,
        userId
      }
    })

    if (existingAnalysis) {
      return NextResponse.json({
        id: existingAnalysis.id,
        analysis: existingAnalysis.analysis,
  
        metadata: existingAnalysis.metadata,
        createdAt: existingAnalysis.createdAt
      })
    }

    // Gerar nova análise
    const analysis = await generateAIAnalysis(testResult)
    
    // Salvar análise no banco
    console.log("Salvando resultado da análise de IA no banco de dados...");
    const aiAnalysis = await prisma.aIAnalysis.create({
      data: {
        testId: testResult.testId,
        userId: testResult.userId,
        testResultId: testResult.id,
        analysisType: `${testResult.test.testType}_ANALYSIS`,
        prompt: analysis.prompt || 'Análise automatizada de teste',
        analysis: analysis.analysis,
        confidence: analysis.confidence || 85,
        metadata: analysis.metadata
      }
    })
    console.log(`Análise de IA salva com sucesso com o ID: ${aiAnalysis.id}`);

    // Atualizar resultado do teste com análise
    await prisma.testResult.update({
      where: { id: testResultId },
      data: {
        interpretation: analysis.interpretation,
        recommendations: analysis.recommendations
      }
    })

    return NextResponse.json({
      id: aiAnalysis.id,
      analysis: aiAnalysis.analysis,
      recommendations: analysis.recommendationsList,
      professionalReport: analysis.professionalReport,
      metadata: aiAnalysis.metadata,
      createdAt: aiAnalysis.createdAt
    })
  } catch (error) {
    console.error('Erro na análise do resultado:', error)
    return NextResponse.json(
      { error: 'Falha na análise do resultado do teste' },
      { status: 500 }
    )
  }
}

// Função para analisar dados de teste em tempo real
async function analyzeTestData(testData: any, userId: string): Promise<NextResponse> {
  try {
    // Buscar informações do teste
    const test = await prisma.test.findUnique({
      where: { id: testData.testId },
      include: {
        questions: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Teste não encontrado' },
        { status: 404 }
      )
    }

    // Calcular pontuações
    const calculatedResults = calculateTestScores(testData.answers, test)

    // Montar um objeto parcial `testResult` para a função de análise
    const partialTestResult = {
      test,
      userId,
      session: {
        answers: testData.answers
      },
      // Adicionar metadados, especialmente para grafologia
      metadata: {
        ...testData.metadata,
        scores: calculatedResults
      },
      dimensionScores: calculatedResults.dimensionScores,
      overallScore: calculatedResults.overallScore
    }

    // Gerar análise de IA
    const analysis = await generateAIAnalysis(partialTestResult)

    return NextResponse.json({
      scores: calculatedResults,
      analysis: analysis.analysis,
      recommendations: analysis.recommendationsList,
      professionalReport: analysis.professionalReport,
      interpretation: analysis.interpretation
    })
  } catch (error) {
    console.error('Erro na análise dos dados:', error)
    return NextResponse.json(
      { error: 'Falha na análise dos dados do teste' },
      { status: 500 }
    )
  }
}

// Função para calcular pontuações do teste
function calculateTestScores(answers: any[], test: any) {
  const scores: any = {
    overallScore: 0,
    dimensionScores: {},
    totalQuestions: answers.length,
    answeredQuestions: answers.filter(a => a.value !== null && a.value !== undefined).length
  }

  // Verificar se é teste DISC
  if (test.testType === 'DISC' || test.name?.includes('DISC') || test.slug?.includes('disc')) {
    scores.dimensionScores = calculateDISCScores(answers, test)
  } else {
    switch (test.testType) {
      case 'PSYCHOSOCIAL':
        scores.dimensionScores = calculatePsychosocialScores(answers, test)
        break
      case 'PERSONALITY':
        scores.dimensionScores = calculatePersonalityScores(answers, test)
        break
      case 'GRAPHOLOGY':
        scores.dimensionScores = calculateGraphologyScores(answers, test)
        break
      case 'CORPORATE':
        scores.dimensionScores = calculateCorporateScores(answers, test)
        break
      default:
        scores.dimensionScores = calculateGenericScores(answers, test)
    }
  }

  // Calcular pontuação geral
  const dimensionValues = Object.values(scores.dimensionScores) as number[]
  scores.overallScore = dimensionValues.length > 0 
    ? dimensionValues.reduce((sum, score) => sum + score, 0) / dimensionValues.length 
    : 0

  return scores
}

// Funções específicas de cálculo por tipo de teste
function calculatePsychosocialScores(answers: any[], test: any) {
  const dimensions = {
    'Autotranscendência': 0,
    'Autopromoção': 0,
    'Abertura à Mudança': 0,
    'Conservação': 0
  }

  answers.forEach(answer => {
    const value = parseInt(answer.value) || 0
    const questionConfig = answer.question?.configuration || {}
    
    // Mapear respostas para dimensões baseado na configuração da questão
    if (questionConfig.dimension) {
      if (dimensions.hasOwnProperty(questionConfig.dimension)) {
        dimensions[questionConfig.dimension as keyof typeof dimensions] += value
      }
    }
  })

  // Normalizar pontuações (0-100)
  const maxPossibleScore = answers.length * 5 // Assumindo escala 1-5
  Object.keys(dimensions).forEach(key => {
    dimensions[key as keyof typeof dimensions] = 
      (dimensions[key as keyof typeof dimensions] / maxPossibleScore) * 100
  })

  return dimensions
}

function calculatePersonalityScores(answers: any[], test: any) {
  const dimensions = {
    'Dominância': 0,
    'Influência': 0,
    'Estabilidade': 0,
    'Conformidade': 0
  }

  answers.forEach(answer => {
    const value = parseInt(answer.value) || 0
    const questionConfig = answer.question?.configuration || {}
    
    // Configuração de dimensões removida
  })

  // Normalizar pontuações
  const total = Object.values(dimensions).reduce((sum, score) => sum + score, 0)
  if (total > 0) {
    Object.keys(dimensions).forEach(key => {
      dimensions[key as keyof typeof dimensions] = 
        (dimensions[key as keyof typeof dimensions] / total) * 100
    })
  }

  return dimensions
}

function calculateDISCScores(answers: any[], test: any) {
  // Mapeamento das perguntas para as dimensões DISC
  const questionDimensions: { [key: string]: string } = {
    // Dominance (D) - Perguntas relacionadas ao controle, assertividade, competitividade
    '1': 'D', '5': 'D', '9': 'D', '13': 'D', '17': 'D', '21': 'D', '25': 'D', '29': 'D', '33': 'D', '37': 'D',
    '41': 'D', '45': 'D', '49': 'D', '53': 'D', '57': 'D', '61': 'D', '65': 'D', '69': 'D', '73': 'D', '77': 'D',
    '81': 'D', '85': 'D', '89': 'D', '93': 'D', '97': 'D',
    
    // Influence (I) - Perguntas relacionadas à sociabilidade, otimismo, persuasão
    '2': 'I', '6': 'I', '10': 'I', '14': 'I', '18': 'I', '22': 'I', '26': 'I', '30': 'I', '34': 'I', '38': 'I',
    '42': 'I', '46': 'I', '50': 'I', '54': 'I', '58': 'I', '62': 'I', '66': 'I', '70': 'I', '74': 'I', '78': 'I',
    '82': 'I', '86': 'I', '90': 'I', '94': 'I', '98': 'I',
    
    // Stability (S) - Perguntas relacionadas à paciência, lealdade, cooperação
    '3': 'S', '7': 'S', '11': 'S', '15': 'S', '19': 'S', '23': 'S', '27': 'S', '31': 'S', '35': 'S', '39': 'S',
    '43': 'S', '47': 'S', '51': 'S', '55': 'S', '59': 'S', '63': 'S', '67': 'S', '71': 'S', '75': 'S', '79': 'S',
    '83': 'S', '87': 'S', '91': 'S', '95': 'S', '99': 'S',
    
    // Conscientiousness (C) - Perguntas relacionadas à precisão, qualidade, sistematização
    '4': 'C', '8': 'C', '12': 'C', '16': 'C', '20': 'C', '24': 'C', '28': 'C', '32': 'C', '36': 'C', '40': 'C',
    '44': 'C', '48': 'C', '52': 'C', '56': 'C', '60': 'C', '64': 'C', '68': 'C', '72': 'C', '76': 'C', '80': 'C',
    '84': 'C', '88': 'C', '92': 'C', '96': 'C', '100': 'C'
  }

  // Inicializar contadores das dimensões
  const dimensions = {
    D: { score: 0, count: 0, percentage: 0 },
    I: { score: 0, count: 0, percentage: 0 },
    S: { score: 0, count: 0, percentage: 0 },
    C: { score: 0, count: 0, percentage: 0 }
  }

  // Calcular pontuações por dimensão
  answers.forEach(answer => {
    const questionNumber = answer.questionId?.toString() || answer.question?.id?.toString()
    const dimension = questionDimensions[questionNumber]
    
    if (dimension && typeof answer.value === 'number') {
      dimensions[dimension as keyof typeof dimensions].score += answer.value
      dimensions[dimension as keyof typeof dimensions].count += 1
    }
  })

  // Calcular percentuais e determinar perfil predominante
  const totalScore = Object.values(dimensions).reduce((sum, dim) => sum + dim.score, 0)
  let dominantProfile = 'D'
  let maxScore = 0

  Object.entries(dimensions).forEach(([key, data]) => {
    data.percentage = totalScore > 0 ? Math.round((data.score / totalScore) * 100) : 0
    
    if (data.score > maxScore) {
      maxScore = data.score
      dominantProfile = key
    }
  })

  return {
    dominance: dimensions.D.percentage,
    influence: dimensions.I.percentage,
    stability: dimensions.S.percentage,
    conscientiousness: dimensions.C.percentage,
    dominantProfile,
    rawScores: dimensions
  }
}

function calculateGraphologyScores(answers: any[], test: any) {
  // Para a grafologia, as pontuações são determinadas pela análise de IA.
  // Aqui, retornamos um placeholder ou indicamos que a análise está pendente.
  return {
    'status': 'pending_ai_analysis',
    'message': 'Pontuações grafológicas serão geradas pela IA.'
  };
}

function calculateCorporateScores(answers: any[], test: any) {
  const dimensions = {
    'Clima Organizacional': 0,
    'Qualidade de Vida': 0,
    'Comunicação': 0,
    'Liderança': 0
  }

  answers.forEach(answer => {
    const value = parseInt(answer.value) || 0
    const questionConfig = answer.question?.configuration || {}
    
    if (questionConfig.corporateDimension) {
      if (dimensions.hasOwnProperty(questionConfig.corporateDimension)) {
        dimensions[questionConfig.corporateDimension as keyof typeof dimensions] += value
      }
    }
  })

  // Normalizar pontuações
  const maxPossibleScore = answers.length * 5
  Object.keys(dimensions).forEach(key => {
    dimensions[key as keyof typeof dimensions] = 
      (dimensions[key as keyof typeof dimensions] / maxPossibleScore) * 100
  })

  return dimensions
}

function calculateGenericScores(answers: any[], test: any) {
  const totalScore = answers.reduce((sum, answer) => {
    return sum + (parseInt(answer.value) || 0)
  }, 0)

  const maxPossibleScore = answers.length * 5
  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0

  return {
    'Pontuação Geral': percentage
  }
}

// Função para gerar análise de IA
async function generateAIAnalysis(testResult: any) {
  // 1. Extrai dados do testResult, que pode vir de um teste existente ou de dados em tempo real.
  const testType = testResult.test?.testType;
  const scores = testResult.dimensionScores || testResult.metadata?.scores || {};
  const answers = testResult.session?.answers || [];
  const metadata = testResult.metadata || {};
  const testDetails = testResult.test || {};

  console.log(`Iniciando análise para o tipo de teste: ${testType}`);

  const apiKey = process.env.GEMINI_API_KEY;
  let analysis;

  try {
    // 2. A função simulateAIAnalysis já contém a lógica de orquestração:
    // tenta a análise real com a IA e, em caso de falha, recorre aos templates.
    if (!apiKey) {
      console.warn('Chave de API do Gemini não configurada. Usando análise simulada com templates.');
    }
    analysis = await simulateAIAnalysis(testType, scores, testResult);

  } catch (error) {
    console.error("Erro crítico durante a análise de IA. Nenhum resultado pôde ser gerado.", error);
    // Retorna um objeto de análise de erro para o chamador.
    const errorReport = generateBasicProfessionalReport(testType, `Falha na análise com IA: ${(error as Error).message}`);
    return {
      analysis: "Falha na análise com IA.",
      interpretation: "Ocorreu um erro durante o processamento.",
      recommendations: "Verifique a configuração e tente novamente.",
      recommendationsList: [],
      professionalReport: errorReport,
      confidence: 0,
      metadata: {
        ...metadata,
        testType,
        analysisDate: new Date().toISOString(),
        error: (error as Error).message
      }
    };
  }

  // 3. Estrutura a resposta final.
  const prompt = generateAnalysisPrompt(testType, scores, answers, testDetails);
  
  return {
    prompt,
    analysis: analysis.analysis,
    interpretation: analysis.interpretation,
    recommendations: analysis.recommendations,
    recommendationsList: analysis.recommendationsList,
    professionalReport: analysis.professionalReport,
    confidence: analysis.confidence,
    metadata: {
      ...metadata,
      testType,
      analysisDate: new Date().toISOString(),
      scoresAnalyzed: scores,
      totalAnswers: answers.length,
      // A confiança > 85 indica que a IA real provavelmente foi usada com sucesso.
      usedRealAI: analysis.confidence > 85 
    }
  };
}

// Função para gerar prompt de análise
function generateAnalysisPrompt(testType: string, scores: any, answers: any[], test: any): string {
  const basePrompt = `Analise os resultados do teste ${test.name} do tipo ${testType}.\n\n`
  const scoresText = `Pontuações obtidas:\n${JSON.stringify(scores, null, 2)}\n\n`
  const contextText = `Total de respostas: ${answers.length}\n`
  const instructionText = `Forneça uma análise profissional detalhada, incluindo interpretação dos resultados, pontos fortes, áreas de desenvolvimento e recomendações específicas.`
  
  return basePrompt + scoresText + contextText + instructionText
}

// Função para realizar análise com IA real usando Google Gemini
async function performRealAIAnalysis(testType: string, scores: any, testResult: any) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no arquivo .env')
  }

  const prompt = generateDetailedAnalysisPrompt(testType, scores, testResult)
  
  try {
    // Usando Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Você é um psicólogo especialista em análise de testes psicossociais e de personalidade. Forneça análises profissionais, detalhadas e construtivas.\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500
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

    return parseAIResponse(aiResponse, testType, scores)
  } catch (error) {
    console.error('Erro na análise com Gemini:', error)
    throw error
  }
}

// Função para simular análise de IA (substituir por integração real)
async function simulateAIAnalysis(testType: string, scores: any, testResult: any) {
  try {
    // Tentar análise com IA real primeiro
    const aiAnalysis = await performRealAIAnalysis(testType, scores, testResult)
    if (aiAnalysis) {
      return aiAnalysis
    }
  } catch (error) {
    console.warn('Falha na análise com IA real, usando templates:', error)
  }
  
  // Fallback para templates se a IA real falhar
  const templates = getAnalysisTemplates(testType)
  const selectedTemplate = selectBestTemplate(templates, scores)
  
  const analysis = generateAnalysisFromTemplate(selectedTemplate, scores, testResult)
  const professionalReport = generateProfessionalReport(testType, scores, analysis, testResult)
  
  return {
    analysis: analysis.text,
    interpretation: analysis.interpretation,
    recommendations: analysis.recommendations,
    recommendationsList: analysis.recommendationsList,
    professionalReport,
    confidence: 85
  }
}

// Templates de análise por tipo de teste
function getAnalysisTemplates(testType: string) {
  const templates: any = {
    PSYCHOSOCIAL: {
      high_autotranscendencia: {
        analysis: "Perfil com forte orientação para valores universais e bem-estar coletivo.",
        interpretation: "Demonstra preocupação genuína com o bem-estar dos outros e questões sociais.",
        recommendations: ["Considerar posições de liderança em projetos sociais", "Desenvolver habilidades de gestão de equipes"]
      },
      high_autopromocao: {
        analysis: "Perfil orientado para conquistas pessoais e reconhecimento.",
        interpretation: "Busca ativamente o sucesso e valoriza o reconhecimento pelos resultados.",
        recommendations: ["Canalizar ambição para projetos desafiadores", "Desenvolver habilidades de colaboração"]
      }
    },
    PERSONALITY: {
      high_dominancia: {
        analysis: "Perfil de liderança natural com foco em resultados.",
        interpretation: "Tende a assumir controle de situações e buscar soluções diretas.",
        recommendations: ["Desenvolver habilidades de escuta ativa", "Praticar delegação efetiva"]
      },
      high_influencia: {
        analysis: "Perfil comunicativo e orientado para relacionamentos.",
        interpretation: "Excelente em motivar outros e criar conexões interpessoais.",
        recommendations: ["Explorar oportunidades em vendas ou marketing", "Desenvolver habilidades de apresentação"]
      }
    },
    CORPORATE: {
      high_clima: {
        analysis: "Percepção muito positiva do ambiente organizacional.",
        interpretation: "Sente-se bem integrado e satisfeito com o clima de trabalho.",
        recommendations: ["Atuar como embaixador da cultura organizacional", "Mentorear novos colaboradores"]
      }
    },
    GRAPHOLOGY: {
      organized_writing: {
        analysis: "Escrita revela personalidade organizada e metódica.",
        interpretation: "Demonstra atenção aos detalhes e capacidade de planejamento.",
        recommendations: ["Explorar funções que exigem precisão", "Desenvolver habilidades de gestão de projetos"]
      }
    }
  }
  
  return templates[testType] || {}
}

// Selecionar melhor template baseado nas pontuações
function selectBestTemplate(templates: any, scores: any) {
  if (!scores || Object.keys(templates).length === 0) {
    return {
      analysis: "Análise personalizada baseada nos resultados obtidos.",
      interpretation: "Os resultados indicam um perfil único com características específicas.",
      recommendations: ["Continuar desenvolvimento pessoal", "Buscar feedback regular"]
    }
  }
  
  // Lógica para selecionar template baseado nas pontuações mais altas
  const sortedScores = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
  
  const highestDimension = sortedScores[0]?.[0]?.toLowerCase().replace(/\s+/g, '_')
  
  // Buscar template correspondente
  for (const [key, template] of Object.entries(templates)) {
    if (key.includes(highestDimension) || highestDimension.includes(key.replace('high_', ''))) {
      return template
    }
  }
  
  // Retornar primeiro template disponível se não encontrar correspondência
  return Object.values(templates)[0] || {
    analysis: "Análise personalizada baseada nos resultados obtidos.",
    interpretation: "Os resultados indicam um perfil único com características específicas.",
    recommendations: ["Continuar desenvolvimento pessoal", "Buscar feedback regular"]
  }
}

// Gerar análise a partir do template
function generateAnalysisFromTemplate(template: any, scores: any, testResult: any) {
  const scoresText = Object.entries(scores)
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



// Gerar relatório profissional
function generateProfessionalReport(testType: string, scores: any, analysis: any, testResult: any): string {
  const currentDate = new Date().toLocaleDateString('pt-BR')
  const testName = testResult.test?.name || 'Teste de Avaliação'
  
  const report = `
# RELATÓRIO DE ANÁLISE PSICOLÓGICA

**Data:** ${currentDate}  
**Teste Aplicado:** ${testName}  
**Tipo de Avaliação:** ${getTestTypeDescription(testType)}  


## RESUMO EXECUTIVO

${analysis.interpretation}

## RESULTADOS DETALHADOS

${Object.entries(scores).map(([dimension, score]) => 
  `**${dimension}:** ${(score as number).toFixed(1)}% - ${getScoreInterpretation(score as number)}`
).join('\n')}

## ANÁLISE COMPORTAMENTAL

${analysis.text}

## RECOMENDAÇÕES PROFISSIONAIS

${analysis.recommendationsList.map((rec: string, index: number) => 
  `${index + 1}. ${rec}`
).join('\n')}

## CONSIDERAÇÕES FINAIS

Esta análise foi gerada através de algoritmos de inteligência artificial baseados em modelos psicométricos validados. Os resultados devem ser interpretados por profissionais qualificados e utilizados como ferramenta complementar no processo de avaliação.

**Validade:** 12 meses a partir da data de aplicação  
**Revisão recomendada:** Anual ou conforme necessidade organizacional

---
*Relatório gerado automaticamente pelo sistema HumaniQ AI*
`
  
  return report.trim()
}

// Obter descrição do tipo de teste
function getTestTypeDescription(testType: string): string {
  const descriptions: { [key: string]: string } = {
    PSYCHOSOCIAL: 'Avaliação Psicossocial - Análise de valores e comportamentos',
    PERSONALITY: 'Perfil Comportamental - Análise de personalidade',
    GRAPHOLOGY: 'Análise Grafológica - Avaliação através da escrita',
    CORPORATE: 'Avaliação Corporativa - Clima e cultura organizacional'
  }
  
  return descriptions[testType] || 'Avaliação Personalizada'
}

// Interpretar pontuação
function getScoreInterpretation(score: number): string {
  if (score >= 80) return 'Muito Alto'
  if (score >= 60) return 'Alto'
  if (score >= 40) return 'Médio'
  if (score >= 20) return 'Baixo'
  return 'Muito Baixo'
}

// Função para gerar prompt detalhado para análise de IA
function generateDetailedAnalysisPrompt(testType: string, scores: any, testResult: any): string {
  const testTypeNames: { [key: string]: string } = {
    'PSYCHOSOCIAL': 'HumaniQ Valores (Teste Psicossocial)',
    'PERSONALITY': 'HumaniQ Tipos (Teste de Personalidade)',
    'CORPORATE': 'Teste Corporativo',
    'GRAPHOLOGY': 'Teste de Grafologia',
    'GENERIC': 'Teste Genérico'
  }

  const testName = testTypeNames[testType] || 'Teste Desconhecido'
  
  // Para análise grafológica, usar prompt especializado
  if (testType === 'GRAPHOLOGY') {
    return generateGraphologyAnalysisPrompt(scores, testResult);
  }
  
  let prompt = `Analise os resultados do ${testName} com base nos seguintes dados:\n\n`
  
  // Adicionar informações específicas por tipo de teste
  if (testType === 'PSYCHOSOCIAL') {
    prompt += `Pontuações dos Valores Humanos:\n`
    prompt += `- Autotranscendência: ${scores.autotranscendencia || 0}%\n`
    prompt += `- Autopromoção: ${scores.autopromocao || 0}%\n`
    prompt += `- Conservação: ${scores.conservacao || 0}%\n`
    prompt += `- Abertura à Mudança: ${scores.abertura_mudanca || 0}%\n\n`
  } else if (testType === 'PERSONALITY') {
    prompt += `Pontuações dos Tipos de Personalidade (MBTI):\n`
    prompt += `- Energia: ${scores.E > scores.I ? 'Extroversão' : 'Introversão'} (E: ${scores.E || 0}, I: ${scores.I || 0})\n`
    prompt += `- Percepção: ${scores.S > scores.N ? 'Sensorial' : 'Intuitivo'} (S: ${scores.S || 0}, N: ${scores.N || 0})\n`
    prompt += `- Decisão: ${scores.T > scores.F ? 'Pensamento' : 'Sentimento'} (T: ${scores.T || 0}, F: ${scores.F || 0})\n`
    prompt += `- Organização: ${scores.J > scores.P ? 'Julgamento' : 'Percepção'} (J: ${scores.J || 0}, P: ${scores.P || 0})\n\n`
  }
  
  prompt += `Por favor, forneça uma análise estruturada no seguinte formato JSON:\n`
  prompt += `{\n`
  prompt += `  "analysis": "Análise detalhada do perfil (2-3 parágrafos)",\n`
  prompt += `  "interpretation": "Interpretação dos resultados (1-2 parágrafos)",\n`
  prompt += `  "recommendations": "Recomendações gerais (1 parágrafo)",\n`
  prompt += `  "recommendationsList": ["Recomendação 1", "Recomendação 2", "Recomendação 3"],\n`

  prompt += `}\n\n`
  prompt += `Mantenha um tom profissional, construtivo e focado no desenvolvimento pessoal e profissional.`
  
  return prompt
}

// Função específica para gerar prompt de análise grafológica
function generateGraphologyAnalysisPrompt(scores: any, testResult: any): string {
  let prompt = `Você é um especialista em grafologia com formação em psicologia. Analise a escrita manuscrita considerando os fundamentos científicos da grafologia.\n\n`;
  
  prompt += `CONHECIMENTO BASE:\n`;
  prompt += `${GRAPHOLOGY_TRAINING_MATERIALS.fundamentals.description}\n\n`;
  
  prompt += `ELEMENTOS TÉCNICOS ANALISADOS:\n`;
  Object.entries(scores).forEach(([element, score]) => {
    prompt += `- ${element}: ${Math.round(score as number)}%\n`;
  });
  
  prompt += `\nMETODOLOGIA DE ANÁLISE:\n`;
  GRAPHOLOGY_TRAINING_MATERIALS.analysis_methodology.steps.forEach(step => {
    prompt += `${step}\n`;
  });
  
  prompt += `\nELEMENTOS DE INTERPRETAÇÃO:\n`;
  prompt += `- Pressão: Indica energia e intensidade emocional\n`;
  prompt += `- Tamanho: Reflete autoestima e necessidade de atenção\n`;
  prompt += `- Inclinação: Mostra orientação social e emocional\n`;
  prompt += `- Espaçamento: Revela necessidades de espaço pessoal\n`;
  prompt += `- Organização: Demonstra capacidade de planejamento\n`;
  prompt += `- Regularidade: Indica estabilidade emocional\n\n`;
  
  prompt += `\nPADRÕES DE PERSONALIDADE:\n`;
  Object.entries(GRAPHOLOGY_TRAINING_MATERIALS.personality_patterns.content).forEach(([pattern, description]) => {
    prompt += `${pattern.toUpperCase()}: ${description}\n`;
  });
  
  prompt += `\nCONSIDERAÇÕES IMPORTANTES:\n`;
  Object.entries(GRAPHOLOGY_TRAINING_MATERIALS.limitations.content).forEach(([key, value]) => {
    prompt += `- ${key}: ${value}\n`;
  });
  
  prompt += `\nLIMITAÇÕES TÉCNICAS:\n`;
  prompt += `- ${GRAPHOLOGY_TRAINING_MATERIALS.limitations.content.scientific_basis}\n`;
  prompt += `- ${GRAPHOLOGY_TRAINING_MATERIALS.limitations.content.cultural_factors}\n`;
  prompt += `- ${GRAPHOLOGY_TRAINING_MATERIALS.limitations.content.context_importance}\n`;
  
  prompt += `\nPor favor, forneça uma análise estruturada no seguinte formato JSON:\n`;
  prompt += `{\n`;
  prompt += `  "analysis": "Análise detalhada baseada nos elementos grafológicos (2-3 parágrafos)",\n`;
  prompt += `  "interpretation": "Interpretação psicológica dos padrões identificados (1-2 parágrafos)",\n`;
  prompt += `  "recommendations": "Recomendações para desenvolvimento pessoal e profissional (1 parágrafo)",\n`;
  prompt += `  "recommendationsList": ["Recomendação específica 1", "Recomendação específica 2", "Recomendação específica 3"],\n`;
;
  prompt += `}\n\n`;
  prompt += `IMPORTANTE: Base sua análise nos princípios científicos da grafologia. Mantenha um tom profissional, construtivo e focado no desenvolvimento. Evite diagnósticos definitivos e considere a grafologia como uma ferramenta complementar de avaliação.`;
  
  return prompt;
}

// Função para processar a resposta da IA
function parseAIResponse(aiResponse: string, testType: string, scores: any) {
  try {
    // Tentar extrair JSON da resposta
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0])
      
      // Gerar relatório profissional com base na análise da IA
      const professionalReport = generateProfessionalReportFromAI(testType, scores, parsedResponse)
      
      return {
        analysis: parsedResponse.analysis || 'Análise não disponível',
        interpretation: parsedResponse.interpretation || 'Interpretação não disponível',
        recommendations: parsedResponse.recommendations || 'Recomendações não disponíveis',
        recommendationsList: parsedResponse.recommendationsList || [],
        professionalReport,
        confidence: parsedResponse.confidence || 88
      }
    }
  } catch (error) {
    console.error('Erro ao processar resposta da IA:', error)
  }
  
  // Fallback se não conseguir processar o JSON
  return {
    analysis: aiResponse.substring(0, 500) + '...',
    interpretation: 'Análise gerada por IA',
    recommendations: 'Consulte a análise completa para recomendações detalhadas',
    recommendationsList: ['Revisar resultados com profissional', 'Aplicar insights no desenvolvimento pessoal'],
    professionalReport: generateBasicProfessionalReport(testType, aiResponse),
    confidence: 80
  }
}

// Função para gerar relatório profissional baseado na análise da IA
function generateProfessionalReportFromAI(testType: string, scores: any, aiAnalysis: any): string {
  const testTypeDescription = getTestTypeDescription(testType)
  const currentDate = new Date().toLocaleDateString('pt-BR')
  
  return `
# RELATÓRIO DE ANÁLISE PSICOLÓGICA

**Data:** ${currentDate}
**Tipo de Avaliação:** ${testTypeDescription}
**Análise:** Gerada por Inteligência Artificial

## RESUMO EXECUTIVO

${aiAnalysis.analysis}

## INTERPRETAÇÃO DOS RESULTADOS

${aiAnalysis.interpretation}

## RECOMENDAÇÕES

${aiAnalysis.recommendations}

### Ações Específicas:
${aiAnalysis.recommendationsList.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

## CONSIDERAÇÕES FINAIS

Esta análise foi gerada por inteligência artificial com base nos resultados do teste. Recomenda-se discussão com profissional qualificado para interpretação mais aprofundada e plano de desenvolvimento personalizado.


  `.trim()
}

// Função para gerar relatório básico quando o parsing falha
function generateBasicProfessionalReport(testType: string, aiResponse: string): string {
  const testTypeDescription = getTestTypeDescription(testType)
  const currentDate = new Date().toLocaleDateString('pt-BR')
  
  return `
# RELATÓRIO DE ANÁLISE PSICOLÓGICA

**Data:** ${currentDate}
**Tipo de Avaliação:** ${testTypeDescription}
**Análise:** Gerada por Inteligência Artificial

## ANÁLISE

${aiResponse}

## CONSIDERAÇÕES FINAIS

Esta análise foi gerada por inteligência artificial. Recomenda-se discussão com profissional qualificado para interpretação mais aprofundada.
  `.trim()
}