// HumaniQ AI - API de Submissão de Testes
// Processa submissões de testes e aciona análise automática de IA

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import TestResultArchiver from '@/archives/utils/archiver'

export const dynamic = 'force-dynamic'

// Interface para submissão de teste
interface TestSubmission {
  testId: string
  sessionId: string
  answers: {
    questionId: string
    value: any
    metadata?: any
  }[]
  duration: number
  metadata?: any
}

// POST - Submeter teste completo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const submission: TestSubmission = await request.json()
    
    // Validar dados da submissão
    if (!submission.testId || !submission.sessionId || !submission.answers) {
      return NextResponse.json(
        { error: 'Dados de submissão incompletos' },
        { status: 400 }
      )
    }

    // Verificar se o teste existe, está ativo e o usuário tem permissão
    const test = await prisma.test.findUnique({
      where: { id: submission.testId },
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

    // Validar se o teste está ativo (apenas testes oficiais)
    if (!test.isActive) {
      return NextResponse.json(
        { error: 'Teste não está disponível' },
        { status: 403 }
      )
    }

    // Verificar sessão do teste
    const testSession = await prisma.testSession.findFirst({
      where: {
        id: submission.sessionId,
        userId: session.user.id,
        testId: submission.testId
      }
    })

    if (!testSession) {
      return NextResponse.json(
        { error: 'Sessão de teste inválida' },
        { status: 404 }
      )
    }

    // Verificar se existem questões cadastradas para este teste
    const questionsCount = await prisma.question.count({
      where: { testId: submission.testId }
    })
    
    // Salvar respostas no banco de dados apenas se existirem questões cadastradas
    if (questionsCount > 0) {
      await saveTestAnswers(submission, session.user.id)
    } else {
      console.log(`⚠️ Teste ${submission.testId} não possui questões cadastradas. Pulando salvamento de respostas.`)
    }
    
    // Calcular resultados do teste
    const calculatedResults = await calculateTestResults(submission, test)
    
    // Criar resultado do teste
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: submission.sessionId,
        testId: submission.testId,
        userId: session.user.id,
        duration: submission.duration,
        overallScore: (calculatedResults as any).overallScore || 0,
        dimensionScores: (calculatedResults as any).dimensionScores || {},
        metadata: {
          ...submission.metadata,
          calculationDate: new Date().toISOString(),
          totalAnswers: submission.answers.length
        }
      }
    })

    // Arquivar resultado automaticamente
    try {
      await archiveTestResult(testResult, test, session.user.id)
    } catch (archiveError) {
      console.error('Erro ao arquivar resultado (não crítico):', archiveError)
      // Não interromper o fluxo principal se o arquivamento falhar
    }

    // Atualizar status da sessão
    await prisma.testSession.update({
      where: { id: submission.sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    // Acionar análise de IA em segundo plano (não-bloqueante)
    triggerAIAnalysis(testResult.id, {
      testId: submission.testId,
      testType: test.testType,
      answers: submission.answers,
      userId: session.user.id,
      sessionId: submission.sessionId
    }).catch(error => {
      console.error('Erro na análise de IA em segundo plano:', error)
    })

    // Retornar resposta imediatamente sem esperar a análise de IA
    return NextResponse.json({
      success: true,
      testResult: {
        id: testResult.id
      },
      results: {
        overallScore: (calculatedResults as any).overallScore || 0,
        dimensionScores: (calculatedResults as any).dimensionScores || {}
      },
      message: 'Teste submetido com sucesso. Análise de IA será processada em segundo plano.'
    })

  } catch (error) {
    console.error('Erro na submissão do teste:', error)
    return NextResponse.json(
      { error: 'Falha na submissão do teste' },
      { status: 500 }
    )
  }
}

// Função para arquivar resultado do teste
async function archiveTestResult(testResult: any, test: any, userId: string) {
  try {
    const archiver = new TestResultArchiver()
    
    // Converter resultado do Prisma para formato do archiver
    const archiveData = {
      id: testResult.id,
      testId: testResult.testId,
      testName: test.name,
      testType: test.testType,
      userId: userId,
      sessionId: testResult.sessionId,
      overallScore: testResult.overallScore,
      dimensionScores: testResult.dimensionScores,
      duration: testResult.duration,
      completedAt: testResult.createdAt || new Date().toISOString(),
      status: 'completed' as 'completed' | 'incomplete',
      metadata: {
        ...testResult.metadata,
        testCategory: test.category,
        testDescription: test.description,
        archivedFromAPI: true
      }
    }
    
    // Arquivar o resultado
    const filePath = await archiver.archiveTestResult(archiveData, {
      autoIndex: true,
      createDirectories: true,
      overwrite: false
    })
    
    console.log(`✅ Resultado arquivado com sucesso: ${filePath}`)
    return filePath
    
  } catch (error) {
    console.error('❌ Erro no arquivamento:', error)
    throw error
  }
}

// Função para salvar respostas do teste
async function saveTestAnswers(submission: TestSubmission, userId: string) {
  const answersData = submission.answers.map(answer => ({
    sessionId: submission.sessionId,
    questionId: answer.questionId,
    userId: userId,
    answerValue: typeof answer.value === 'object' ? JSON.stringify(answer.value) : String(answer.value),
    metadata: answer.metadata
  }))

  // Deletar respostas existentes para esta sessão (caso seja resubmissão)
  await prisma.answer.deleteMany({
    where: {
      sessionId: submission.sessionId,
      userId: userId
    }
  })

  // Inserir novas respostas
  await prisma.answer.createMany({
    data: answersData
  })
}

// Função para calcular resultados do teste
async function calculateTestResults(submission: TestSubmission, test: any) {
  const answers = submission.answers
  const questions = test.questions
  
  // Mapear respostas com informações das questões
  const answersWithQuestions = answers.map(answer => {
    const question = questions.find((q: any) => q.id === answer.questionId)
    return {
      ...answer,
      question
    }
  })

  // Calcular pontuações baseado no tipo de teste
  const results = calculateScoresByTestType(test.testType, answersWithQuestions, test)
  
  return results
}

// Função para calcular pontuações por tipo de teste
function calculateScoresByTestType(testType: string, answers: any[], test: any) {
  // Verificar se é o teste HumaniQ TIPOS pelo ID específico
  if (test.id === 'cmdxqvgu4000p8wsg7l8brjee') {
    return calculateHumaniQTiposResults(answers, test)
  }
  
  // Verificar se é o teste HumaniQ TELA pelo ID específico
  if (test.id === 'cmdyknc1q00018w5g9pfo2lgp') {
    return calculateHumaniQTelaResults(answers, test)
  }
  
  // Verificar se é o teste HumaniQ QI pelo ID específico
  if (test.id === 'cme216bqg000f8wg08lorykq7') {
    return calculateHumaniQQIResults(answers, test)
  }
  
  // Verificar se é o teste HumaniQ Eneagrama pelo ID específico
  if (test.id === 'humaniq-enneagram-test') {
    return calculateEnneagramResults(answers, test)
  }
  
  
  
  switch (testType) {
    case 'PSYCHOSOCIAL':
      return calculatePsychosocialResults(answers, test)
    case 'PERSONALITY':
      return calculateGenericResults(answers, test)
    case 'GRAPHOLOGY':
      return calculateGraphologyResults(answers, test)
    case 'CORPORATE':
      return calculateCorporateResults(answers, test)
    default:
      return calculateGenericResults(answers, test)
  }
}

// Cálculos específicos para teste psicossocial (HumaniQ Valores)
function calculatePsychosocialResults(answers: any[], test: any) {
  const dimensions = {
    'Autotranscendência': { score: 0, count: 0 },
    'Autopromoção': { score: 0, count: 0 },
    'Abertura à Mudança': { score: 0, count: 0 },
    'Conservação': { score: 0, count: 0 }
  }

  // Mapear questões para dimensões (baseado no teste HumaniQ Valores)
  const questionDimensionMap: { [key: number]: string } = {
    1: 'Autotranscendência',    // Universalismo
    2: 'Autopromoção',         // Poder
    3: 'Abertura à Mudança',   // Autodeterminação
    4: 'Conservação',          // Conformidade
    5: 'Autotranscendência',   // Benevolência
    6: 'Autopromoção',         // Conquista
    7: 'Abertura à Mudança',   // Estimulação
    8: 'Conservação',          // Tradição
    9: 'Autotranscendência',   // Universalismo
    10: 'Autopromoção',        // Hedonismo
    11: 'Abertura à Mudança',  // Autodeterminação
    12: 'Conservação',         // Segurança
    13: 'Autotranscendência',  // Benevolência
    14: 'Autopromoção',        // Poder
    15: 'Abertura à Mudança',  // Estimulação
    16: 'Conservação',         // Conformidade
    17: 'Autotranscendência',  // Universalismo
    18: 'Autopromoção',        // Conquista
    19: 'Abertura à Mudança',  // Hedonismo
    20: 'Conservação'          // Tradição
  }

  answers.forEach((answer, index) => {
    const questionNumber = index + 1
    const dimension = questionDimensionMap[questionNumber]
    const value = parseInt(answer.value) || 0
    
    if (dimension && dimensions[dimension as keyof typeof dimensions]) {
      dimensions[dimension as keyof typeof dimensions].score += value
      dimensions[dimension as keyof typeof dimensions].count += 1
    }
  })

  // Calcular médias e percentuais
  const dimensionScores: { [key: string]: number } = {}
  let totalScore = 0
  let totalCount = 0

  Object.entries(dimensions).forEach(([dimension, data]) => {
    if (data.count > 0) {
      const average = data.score / data.count
      dimensionScores[dimension] = (average / 5) * 100 // Normalizar para 0-100
      totalScore += data.score
      totalCount += data.count
    } else {
      dimensionScores[dimension] = 0
    }
  })

  const overallScore = totalCount > 0 ? (totalScore / (totalCount * 5)) * 100 : 0

  return {
    overallScore,
    dimensionScores,
    metadata: {
      totalQuestions: answers.length,
      calculationMethod: 'psychosocial_values',
      dimensionCounts: Object.fromEntries(
        Object.entries(dimensions).map(([key, data]) => [key, data.count])
      )
    }
  }
}

// Cálculos específicos para teste HumaniQ TIPOS (Base Junguiana / MBTI)
function calculateHumaniQTiposResults(answers: any[], test: any) {
  const scores = {
    E: 0, I: 0, // Energia: Extroversão vs Introversão
    S: 0, N: 0, // Percepção: Sensação vs Intuição
    T: 0, F: 0, // Decisão: Pensamento vs Sentimento
    J: 0, P: 0  // Organização: Julgamento vs Percepção
  }

  // Processar cada resposta
  answers.forEach(answer => {
    const question = answer.question
    const value = parseInt(answer.value) || 0
    const questionType = question?.metadata?.type
    
    if (questionType && scores.hasOwnProperty(questionType)) {
      scores[questionType as keyof typeof scores] += value
    }
  })

  // Determinar preferências (maior pontuação em cada dicotomia)
  const personality = [
    scores.E > scores.I ? 'E' : 'I',
    scores.S > scores.N ? 'S' : 'N',
    scores.T > scores.F ? 'T' : 'F',
    scores.J > scores.P ? 'J' : 'P'
  ].join('')

  // Calcular percentuais para cada dimensão
  const dimensionScores = {
    'Energia': {
      'Extroversão (E)': Math.round((scores.E / (scores.E + scores.I)) * 100),
      'Introversão (I)': Math.round((scores.I / (scores.E + scores.I)) * 100)
    },
    'Percepção': {
      'Sensação (S)': Math.round((scores.S / (scores.S + scores.N)) * 100),
      'Intuição (N)': Math.round((scores.N / (scores.S + scores.N)) * 100)
    },
    'Decisão': {
      'Pensamento (T)': Math.round((scores.T / (scores.T + scores.F)) * 100),
      'Sentimento (F)': Math.round((scores.F / (scores.T + scores.F)) * 100)
    },
    'Organização': {
      'Julgamento (J)': Math.round((scores.J / (scores.J + scores.P)) * 100),
      'Percepção (P)': Math.round((scores.P / (scores.J + scores.P)) * 100)
    }
  }

  // Calcular pontuação geral (média das preferências dominantes)
  const dominantScores = [
    Math.max(scores.E, scores.I),
    Math.max(scores.S, scores.N),
    Math.max(scores.T, scores.F),
    Math.max(scores.J, scores.P)
  ]
  const overallScore = Math.round((dominantScores.reduce((sum, score) => sum + score, 0) / (dominantScores.length * 5)) * 100)

  return {
    overallScore,
    dimensionScores,
    metadata: {
      personalityType: personality,
      rawScores: scores,
      totalQuestions: answers.length,
      calculationMethod: 'junguian_mbti',
      dimensions: {
        Energia: scores.E > scores.I ? 'Extroversão' : 'Introversão',
        Percepção: scores.S > scores.N ? 'Sensação' : 'Intuição',
        Decisão: scores.T > scores.F ? 'Pensamento' : 'Sentimento',
        Organização: scores.J > scores.P ? 'Julgamento' : 'Percepção'
      }
    }
  }
}

// Cálculos específicos para teste HumaniQ QI (Quociente de Inteligência)
function calculateHumaniQQIResults(answers: any[], test: any) {
  const dimensions = {
    'Raciocínio Lógico': { score: 0, count: 0 },
    'Raciocínio Numérico': { score: 0, count: 0 },
    'Raciocínio Verbal': { score: 0, count: 0 },
    'Raciocínio Espacial': { score: 0, count: 0 }
  }

  // Mapear questões para dimensões (assumindo 5 questões por dimensão)
  const questionDimensionMap: { [key: number]: string } = {
    // Raciocínio Lógico (questões 1-5)
    1: 'Raciocínio Lógico', 2: 'Raciocínio Lógico', 3: 'Raciocínio Lógico', 4: 'Raciocínio Lógico', 5: 'Raciocínio Lógico',
    // Raciocínio Numérico (questões 6-10)
    6: 'Raciocínio Numérico', 7: 'Raciocínio Numérico', 8: 'Raciocínio Numérico', 9: 'Raciocínio Numérico', 10: 'Raciocínio Numérico',
    // Raciocínio Verbal (questões 11-15)
    11: 'Raciocínio Verbal', 12: 'Raciocínio Verbal', 13: 'Raciocínio Verbal', 14: 'Raciocínio Verbal', 15: 'Raciocínio Verbal',
    // Raciocínio Espacial (questões 16-20)
    16: 'Raciocínio Espacial', 17: 'Raciocínio Espacial', 18: 'Raciocínio Espacial', 19: 'Raciocínio Espacial', 20: 'Raciocínio Espacial'
  }

  answers.forEach((answer, index) => {
    const questionNumber = index + 1
    const dimension = questionDimensionMap[questionNumber]
    const isCorrect = answer.value === answer.question?.correctAnswer || (typeof answer.value === 'string' && answer.value.toLowerCase() === 'correct')
    const points = isCorrect ? 1 : 0
    
    if (dimension && dimensions[dimension as keyof typeof dimensions]) {
      dimensions[dimension as keyof typeof dimensions].score += points
      dimensions[dimension as keyof typeof dimensions].count += 1
    }
  })

  // Calcular percentuais e pontuações
  const dimensionScores: { [key: string]: number } = {}
  let totalCorrect = 0
  let totalQuestions = 0

  Object.entries(dimensions).forEach(([dimension, data]) => {
    if (data.count > 0) {
      const percentage = (data.score / data.count) * 100
      dimensionScores[dimension] = Math.round(percentage)
      totalCorrect += data.score
      totalQuestions += data.count
    } else {
      dimensionScores[dimension] = 0
    }
  })

  // Calcular QI baseado na pontuação total (escala padrão: média 100, desvio 15)
  const correctPercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) : 0
  let qiScore = 100 // QI médio
  
  if (correctPercentage >= 0.95) qiScore = 145 // Superdotado
  else if (correctPercentage >= 0.90) qiScore = 130 // Muito Superior
  else if (correctPercentage >= 0.80) qiScore = 120 // Superior
  else if (correctPercentage >= 0.70) qiScore = 110 // Acima da Média
  else if (correctPercentage >= 0.50) qiScore = 100 // Média
  else if (correctPercentage >= 0.30) qiScore = 90  // Abaixo da Média
  else if (correctPercentage >= 0.20) qiScore = 80  // Limítrofe
  else qiScore = 70 // Abaixo do Limítrofe

  return {
    overallScore: qiScore,
    dimensionScores,
    metadata: {
      totalQuestions: answers.length,
      totalCorrect,
      correctPercentage: Math.round(correctPercentage * 100),
      calculationMethod: 'iq_assessment',
      qiClassification: getQIClassification(qiScore),
      dimensionCounts: Object.fromEntries(
        Object.entries(dimensions).map(([key, data]) => [key, data.count])
      )
    }
  }
}

// Função auxiliar para classificação do QI
function getQIClassification(qiScore: number): string {
  if (qiScore >= 145) return 'Superdotado'
  if (qiScore >= 130) return 'Muito Superior'
  if (qiScore >= 120) return 'Superior'
  if (qiScore >= 110) return 'Acima da Média'
  if (qiScore >= 90) return 'Média'
  if (qiScore >= 80) return 'Abaixo da Média'
  if (qiScore >= 70) return 'Limítrofe'
  return 'Abaixo do Limítrofe'
}

// Cálculos específicos para teste HumaniQ Eneagrama (9 tipos de personalidade)
function calculateEnneagramResults(answers: any[], test: any) {
  // Mapeamento das 100 perguntas para os 9 tipos do Eneagrama
  // Cada tipo tem aproximadamente 11-12 perguntas distribuídas ao longo do teste
  const questionTypeMap: { [key: number]: number } = {
    // Tipo 1 - O Perfeccionista (perguntas 1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100)
    1: 1, 10: 1, 19: 1, 28: 1, 37: 1, 46: 1, 55: 1, 64: 1, 73: 1, 82: 1, 91: 1, 100: 1,
    // Tipo 2 - O Prestativo (perguntas 2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92)
    2: 2, 11: 2, 20: 2, 29: 2, 38: 2, 47: 2, 56: 2, 65: 2, 74: 2, 83: 2, 92: 2,
    // Tipo 3 - O Realizador (perguntas 3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93)
    3: 3, 12: 3, 21: 3, 30: 3, 39: 3, 48: 3, 57: 3, 66: 3, 75: 3, 84: 3, 93: 3,
    // Tipo 4 - O Individualista (perguntas 4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94)
    4: 4, 13: 4, 22: 4, 31: 4, 40: 4, 49: 4, 58: 4, 67: 4, 76: 4, 85: 4, 94: 4,
    // Tipo 5 - O Investigador (perguntas 5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95)
    5: 5, 14: 5, 23: 5, 32: 5, 41: 5, 50: 5, 59: 5, 68: 5, 77: 5, 86: 5, 95: 5,
    // Tipo 6 - O Leal (perguntas 6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96)
    6: 6, 15: 6, 24: 6, 33: 6, 42: 6, 51: 6, 60: 6, 69: 6, 78: 6, 87: 6, 96: 6,
    // Tipo 7 - O Entusiasta (perguntas 7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97)
    7: 7, 16: 7, 25: 7, 34: 7, 43: 7, 52: 7, 61: 7, 70: 7, 79: 7, 88: 7, 97: 7,
    // Tipo 8 - O Desafiador (perguntas 8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98)
    8: 8, 17: 8, 26: 8, 35: 8, 44: 8, 53: 8, 62: 8, 71: 8, 80: 8, 89: 8, 98: 8,
    // Tipo 9 - O Pacificador (perguntas 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99)
    9: 9, 18: 9, 27: 9, 36: 9, 45: 9, 54: 9, 63: 9, 72: 9, 81: 9, 90: 9, 99: 9
  }

  // Inicializar contadores para cada tipo
  const typeScores = {
    1: { score: 0, count: 0, percentage: 0 },
    2: { score: 0, count: 0, percentage: 0 },
    3: { score: 0, count: 0, percentage: 0 },
    4: { score: 0, count: 0, percentage: 0 },
    5: { score: 0, count: 0, percentage: 0 },
    6: { score: 0, count: 0, percentage: 0 },
    7: { score: 0, count: 0, percentage: 0 },
    8: { score: 0, count: 0, percentage: 0 },
    9: { score: 0, count: 0, percentage: 0 }
  }

  // Processar cada resposta e agrupar por tipo
  answers.forEach(answer => {
    const questionNumber = parseInt(answer.questionId) || 0
    const enneagramType = questionTypeMap[questionNumber]
    const value = parseInt(answer.value) || 0 // Respostas de 1 a 5
    
    if (enneagramType && typeScores[enneagramType as keyof typeof typeScores]) {
      typeScores[enneagramType as keyof typeof typeScores].score += value
      typeScores[enneagramType as keyof typeof typeScores].count += 1
    }
  })

  // Calcular percentuais para cada tipo
  Object.entries(typeScores).forEach(([type, data]) => {
    if (data.count > 0) {
      // Normalizar: (pontuação obtida ÷ pontuação máxima possível) × 100
      const maxPossibleScore = data.count * 5 // Máximo 5 pontos por pergunta
      data.percentage = Math.round((data.score / maxPossibleScore) * 100)
    }
  })

  // Ordenar tipos por percentual (ranking)
  const rankedTypes = Object.entries(typeScores)
    .map(([type, data]) => ({
      type: parseInt(type),
      percentage: data.percentage,
      score: data.score,
      count: data.count
    }))
    .sort((a, b) => b.percentage - a.percentage)

  // Identificar tipo dominante, secundário e ala (wing)
  const dominantType = rankedTypes[0]
  const secondaryType = rankedTypes[1]
  
  // Determinar ala (wing) - tipos adjacentes ao dominante com maior pontuação
  const dominantTypeNumber = dominantType.type
  const adjacentTypes = [
    dominantTypeNumber === 1 ? 9 : dominantTypeNumber - 1, // Tipo anterior
    dominantTypeNumber === 9 ? 1 : dominantTypeNumber + 1  // Tipo posterior
  ]
  
  const wings = rankedTypes
    .filter(t => adjacentTypes.includes(t.type))
    .sort((a, b) => b.percentage - a.percentage)
  
  const primaryWing = wings[0]

  // Nomes dos tipos do Eneagrama
  const typeNames = {
    1: 'O Perfeccionista',
    2: 'O Prestativo', 
    3: 'O Realizador',
    4: 'O Individualista',
    5: 'O Investigador',
    6: 'O Leal',
    7: 'O Entusiasta',
    8: 'O Desafiador',
    9: 'O Pacificador'
  }

  // Preparar scores por dimensão para compatibilidade
  const dimensionScores: { [key: string]: number } = {}
  rankedTypes.forEach(type => {
    const typeName = typeNames[type.type as keyof typeof typeNames]
    dimensionScores[`Tipo ${type.type} - ${typeName}`] = type.percentage
  })

  return {
    overallScore: dominantType.percentage,
    dimensionScores,
    metadata: {
      dominantType: {
        number: dominantType.type,
        name: typeNames[dominantType.type as keyof typeof typeNames],
        percentage: dominantType.percentage
      },
      secondaryType: {
        number: secondaryType.type,
        name: typeNames[secondaryType.type as keyof typeof typeNames],
        percentage: secondaryType.percentage
      },
      wing: primaryWing ? {
        number: primaryWing.type,
        name: typeNames[primaryWing.type as keyof typeof typeNames],
        percentage: primaryWing.percentage
      } : null,
      fullRanking: rankedTypes.map(type => ({
        type: type.type,
        name: typeNames[type.type as keyof typeof typeNames],
        percentage: type.percentage,
        rawScore: type.score,
        questionCount: type.count
      })),
      totalQuestions: answers.length,
      calculationMethod: 'enneagram_nine_types',
      testConsistency: calculateEnneagramConsistency(rankedTypes)
    }
  }
}

// Função auxiliar para calcular consistência do teste Eneagrama
function calculateEnneagramConsistency(rankedTypes: any[]): string {
  const topThree = rankedTypes.slice(0, 3)
  const percentageDiff = topThree[0].percentage - topThree[2].percentage
  
  if (percentageDiff >= 30) return 'Alta consistência'
  if (percentageDiff >= 20) return 'Boa consistência'
  if (percentageDiff >= 10) return 'Consistência moderada'
  return 'Baixa consistência - resultado pode ser impreciso'
}



// Cálculos específicos para teste HumaniQ TELA (Liderança Autêntica)
function calculateHumaniQTelaResults(answers: any[], test: any) {
  const dimensions = {
    'Autoconsciência': { score: 0, count: 0 },
    'Processamento Balanceado': { score: 0, count: 0 },
    'Perspectiva Moral Internalizada': { score: 0, count: 0 },
    'Transparência de Relacionamentos': { score: 0, count: 0 }
  }

  // Mapear questões para dimensões (10 questões por dimensão)
  const questionDimensionMap: { [key: number]: string } = {
    // Autoconsciência (questões 1-10)
    1: 'Autoconsciência', 2: 'Autoconsciência', 3: 'Autoconsciência', 4: 'Autoconsciência', 5: 'Autoconsciência',
    6: 'Autoconsciência', 7: 'Autoconsciência', 8: 'Autoconsciência', 9: 'Autoconsciência', 10: 'Autoconsciência',
    // Processamento Balanceado (questões 11-20)
    11: 'Processamento Balanceado', 12: 'Processamento Balanceado', 13: 'Processamento Balanceado', 14: 'Processamento Balanceado', 15: 'Processamento Balanceado',
    16: 'Processamento Balanceado', 17: 'Processamento Balanceado', 18: 'Processamento Balanceado', 19: 'Processamento Balanceado', 20: 'Processamento Balanceado',
    // Perspectiva Moral Internalizada (questões 21-30)
    21: 'Perspectiva Moral Internalizada', 22: 'Perspectiva Moral Internalizada', 23: 'Perspectiva Moral Internalizada', 24: 'Perspectiva Moral Internalizada', 25: 'Perspectiva Moral Internalizada',
    26: 'Perspectiva Moral Internalizada', 27: 'Perspectiva Moral Internalizada', 28: 'Perspectiva Moral Internalizada', 29: 'Perspectiva Moral Internalizada', 30: 'Perspectiva Moral Internalizada',
    // Transparência de Relacionamentos (questões 31-40)
    31: 'Transparência de Relacionamentos', 32: 'Transparência de Relacionamentos', 33: 'Transparência de Relacionamentos', 34: 'Transparência de Relacionamentos', 35: 'Transparência de Relacionamentos',
    36: 'Transparência de Relacionamentos', 37: 'Transparência de Relacionamentos', 38: 'Transparência de Relacionamentos', 39: 'Transparência de Relacionamentos', 40: 'Transparência de Relacionamentos'
  }

  answers.forEach((answer, index) => {
    const questionNumber = index + 1
    const dimension = questionDimensionMap[questionNumber]
    const value = parseInt(answer.value) || 0
    
    if (dimension && dimensions[dimension as keyof typeof dimensions]) {
      dimensions[dimension as keyof typeof dimensions].score += value
      dimensions[dimension as keyof typeof dimensions].count += 1
    }
  })

  // Calcular médias por dimensão
  const dimensionScores: { [key: string]: number } = {}
  let totalScore = 0
  let totalCount = 0

  Object.entries(dimensions).forEach(([dimension, data]) => {
    if (data.count > 0) {
      const average = data.score / data.count
      dimensionScores[dimension] = Math.round(average * 100) / 100 // Manter 2 casas decimais
      totalScore += data.score
      totalCount += data.count
    } else {
      dimensionScores[dimension] = 0
    }
  })

  // Calcular pontuação geral (média das 40 questões)
  const overallAverage = totalCount > 0 ? totalScore / totalCount : 0
  const overallScore = Math.round(overallAverage * 100) / 100

  // Determinar classificação baseada na pontuação geral
  let classification = ''
  if (overallAverage >= 4.5) {
    classification = 'Liderança Autêntica Exemplar'
  } else if (overallAverage >= 4.0) {
    classification = 'Liderança Autêntica Desenvolvida'
  } else if (overallAverage >= 3.0) {
    classification = 'Liderança Autêntica Moderada'
  } else if (overallAverage >= 2.0) {
    classification = 'Baixa Autenticidade na Liderança'
  } else {
    classification = 'Conduta Não-Autêntica ou Ausente'
  }

  return {
    overallScore,
    dimensionScores,
    metadata: {
      classification,
      totalQuestions: answers.length,
      calculationMethod: 'authentic_leadership',
      dimensionCounts: Object.fromEntries(
        Object.entries(dimensions).map(([key, data]) => [key, data.count])
      ),
      interpretationRanges: {
        'Exemplar': '4.5 - 5.0',
        'Desenvolvida': '4.0 - 4.4',
        'Moderada': '3.0 - 3.9',
        'Baixa': '2.0 - 2.9',
        'Ausente': '1.0 - 1.9'
      }
    }
  }
}



// Cálculos para análise grafológica
function calculateGraphologyResults(answers: any[], test: any) {
  // Para a grafologia, as respostas são as imagens ou dados da escrita.
  // A pontuação será calculada pela IA, então aqui apenas preparamos os dados.
  const overallScore = 0; // Pontuação inicial, será atualizada pela IA.
  const dimensionScores = {}; // As dimensões serão geradas pela IA.

  // Extrair metadados relevantes das respostas, como URLs de imagem.
  const analysisData = answers.map(answer => ({
    questionId: answer.questionId,
    value: answer.value, // Pode ser a URL da imagem da escrita
    metadata: answer.metadata
  }));

  return {
    overallScore,
    dimensionScores,
    metadata: {
      totalQuestions: answers.length,
      calculationMethod: 'graphology_pending_ai_analysis',
      analysisData: analysisData, // Salvar os dados para a IA
      analysisType: 'automated_preliminary'
    }
  };
}

// Cálculos para avaliação corporativa
function calculateCorporateResults(answers: any[], test: any) {
  const dimensions = {
    'Clima Organizacional': { score: 0, count: 0 },
    'Qualidade de Vida': { score: 0, count: 0 },
    'Comunicação': { score: 0, count: 0 },
    'Liderança': { score: 0, count: 0 },
    'Desenvolvimento': { score: 0, count: 0 },
    'Reconhecimento': { score: 0, count: 0 }
  }

  answers.forEach(answer => {
    const questionConfig = answer.question?.configuration || {}
    const value = parseInt(answer.value) || 0
    
    if (questionConfig.corporateDimension && dimensions[questionConfig.corporateDimension as keyof typeof dimensions]) {
      dimensions[questionConfig.corporateDimension as keyof typeof dimensions].score += value
      dimensions[questionConfig.corporateDimension as keyof typeof dimensions].count += 1
    }
  })

  const dimensionScores: { [key: string]: number } = {}
  let totalScore = 0
  let totalCount = 0

  Object.entries(dimensions).forEach(([dimension, data]) => {
    if (data.count > 0) {
      const average = data.score / data.count
      dimensionScores[dimension] = (average / 5) * 100
      totalScore += data.score
      totalCount += data.count
    } else {
      dimensionScores[dimension] = 0
    }
  })

  const overallScore = totalCount > 0 ? (totalScore / (totalCount * 5)) * 100 : 0

  return {
    overallScore,
    dimensionScores,
    metadata: {
      totalQuestions: answers.length,
      calculationMethod: 'corporate_assessment',
      dimensionCounts: Object.fromEntries(
        Object.entries(dimensions).map(([key, data]) => [key, data.count])
      )
    }
  }
}

// Cálculos genéricos
function calculateGenericResults(answers: any[], test: any) {
  const totalScore = answers.reduce((sum, answer) => {
    return sum + (parseInt(answer.value) || 0)
  }, 0)

  const maxPossibleScore = answers.length * 5
  const overallScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0

  return {
    overallScore,
    dimensionScores: {
      'Pontuação Geral': overallScore
    },
    metadata: {
      totalQuestions: answers.length,
      calculationMethod: 'generic_scoring',
      totalRawScore: totalScore,
      maxPossibleScore
    }
  }
}

// Função para acionar análise de IA com timeout e tratamento não-bloqueante
async function triggerAIAnalysis(testResultId: string, testData: any) {
  try {
    // Criar AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

    // Fazer chamada para a API de análise de IA com timeout
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testResultId,
        testData
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('Erro na análise de IA:', response.statusText)
      return null
    }

    const aiResult = await response.json()
    return aiResult

  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('Análise de IA cancelada por timeout (10s) - continuando sem análise')
    } else {
      console.error('Erro ao acionar análise de IA:', error)
    }
    return null
  }
}

// GET - Obter status de submissão
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
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar resultado do teste
    const testResult = await prisma.testResult.findFirst({
      where: {
        sessionId,
        userId: session.user.id
      },
      include: {
        test: true,
        session: true
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado não encontrado' },
        { status: 404 }
      )
    }

    // Buscar análise de IA se existir
    const aiAnalysis = await prisma.aIAnalysis.findFirst({
      where: {
        testResultId: testResult.id,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      testResult: {
        id: testResult.id,
        overallScore: testResult.overallScore,
        dimensionScores: testResult.dimensionScores,
        interpretation: testResult.interpretation,
        recommendations: testResult.recommendations,
        completedAt: testResult.completedAt,
        duration: testResult.duration
      },
      aiAnalysis: aiAnalysis ? {
        id: aiAnalysis.id,
        analysis: aiAnalysis.analysis,

        createdAt: aiAnalysis.createdAt
      } : null,
      test: {
        id: testResult.test.id,
        name: testResult.test.name,
        testType: testResult.test.testType
      }
    })

  } catch (error) {
    console.error('Erro ao buscar status da submissão:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar status da submissão' },
      { status: 500 }
    )
  }
}