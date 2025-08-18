/**
 * Sistema de validação e bloqueio automático para testes não autorizados
 * Apenas os 22 testes oficiais da HumaniQ AI são permitidos
 */

// Lista oficial dos 22 testes HumaniQ AI
const OFFICIAL_TESTS = [
  // Testes Psicossociais (8 testes corretos)
  'HumaniQ Insight',
  'HumaniQ COBE', 
  'HumaniQ QVT',
  'HumaniQ Karasek-Siegrist',
  'HumaniQ RPO',
  'HumaniQ EO',
  'HumaniQ PAS',
  'HumaniQ MGRP',
  // Testes de Perfil (9 testes)
  'HumaniQ BOLIE – Inteligência Emocional',
  'HumaniQ Big Five – Cinco Grandes Fatores da Personalidade',
  'HumaniQ Eneagrama – Tipos de Personalidade',
  'HumaniQ FLEX – Avaliação de Adaptabilidade',
  'HumaniQ MOTIVA – Perfil de Motivação Profissional',
  'HumaniQ QI – Quociente de Inteligência',
  'HumaniQ TAR – Teste de Atenção e Raciocínio',
  'HumaniQ TIPOS – Perfil Cognitivo (MBTI)',
  'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
  // Testes Corporativos (2 testes)
  'HumaniQ LIDERA',
  'HumaniQ TELA',
  // Testes Grafológicos (2 testes)
  'HumaniQ Grafologia',
  'HumaniQ Assinatura'
] as const

type OfficialTestName = typeof OFFICIAL_TESTS[number]

interface TestValidationResult {
  isValid: boolean
  error?: string
  testName?: string
}

interface TestValidationLog {
  timestamp: Date
  testName: string
  action: 'blocked' | 'allowed'
  userId?: string
  userType?: 'empresa' | 'colaborador' | 'candidato'
  reason?: string
}

/**
 * Valida se um teste está na lista oficial
 */
export function validateTestName(testName: string): TestValidationResult {
  if (!testName || typeof testName !== 'string') {
    return {
      isValid: false,
      error: 'Nome do teste é obrigatório e deve ser uma string'
    }
  }

  const normalizedTestName = testName.trim()
  
  // Verifica se o teste está na lista oficial
  const isOfficial = OFFICIAL_TESTS.some(officialTest => 
    normalizedTestName.toLowerCase().includes(officialTest.toLowerCase()) ||
    officialTest.toLowerCase().includes(normalizedTestName.toLowerCase())
  )

  if (!isOfficial) {
    logTestValidation({
      timestamp: new Date(),
      testName: normalizedTestName,
      action: 'blocked',
      reason: 'Teste não está na lista oficial de 21 testes HumaniQ AI'
    })

    return {
      isValid: false,
      error: `ERRO: Teste "${normalizedTestName}" não está autorizado. Apenas os 21 testes oficiais HumaniQ AI são permitidos.`,
      testName: normalizedTestName
    }
  }

  logTestValidation({
    timestamp: new Date(),
    testName: normalizedTestName,
    action: 'allowed'
  })

  return {
    isValid: true,
    testName: normalizedTestName
  }
}

/**
 * Valida múltiplos testes de uma vez
 */
export function validateMultipleTests(testNames: string[]): {
  validTests: string[]
  invalidTests: string[]
  errors: string[]
} {
  const validTests: string[] = []
  const invalidTests: string[] = []
  const errors: string[] = []

  for (const testName of testNames) {
    const validation = validateTestName(testName)
    
    if (validation.isValid) {
      validTests.push(validation.testName!)
    } else {
      invalidTests.push(testName)
      errors.push(validation.error!)
    }
  }

  return { validTests, invalidTests, errors }
}

/**
 * Filtra uma lista de testes, retornando apenas os oficiais
 */
export function filterOfficialTests(tests: any[]): any[] {
  return tests.filter(test => {
    const testName = test.name || test.title || test.testName
    if (!testName) return false
    
    const validation = validateTestName(testName)
    return validation.isValid
  })
}

/**
 * Verifica se um teste específico por ID está autorizado
 */
export async function validateTestById(testId: string): Promise<TestValidationResult> {
  try {
    // Buscar o teste no banco de dados
    const response = await fetch(`/api/tests/${testId}`)
    
    if (!response.ok) {
      return {
        isValid: false,
        error: `Teste com ID "${testId}" não encontrado`
      }
    }

    const test = await response.json()
    return validateTestName(test.name)
  } catch (error) {
    return {
      isValid: false,
      error: `Erro ao validar teste: ${error}`
    }
  }
}

/**
 * Registra eventos de validação para auditoria
 */
function logTestValidation(log: TestValidationLog): void {
  // Em produção, isso deveria ser salvo no banco de dados
  console.log(`[TEST_VALIDATION] ${log.action.toUpperCase()}: ${log.testName}`, {
    timestamp: log.timestamp.toISOString(),
    reason: log.reason,
    userId: log.userId,
    userType: log.userType
  })

  // Se for um bloqueio, também registrar como warning
  if (log.action === 'blocked') {
    console.warn(`🚫 TESTE BLOQUEADO: "${log.testName}" - ${log.reason}`);
  }
}

/**
 * Middleware para validação automática de testes em APIs
 */
export function createTestValidationMiddleware() {
  return (req: any, res: any, next: any) => {
    const testName = req.body?.testName || req.query?.testName || req.params?.testName
    const testNames = req.body?.testNames || req.body?.tests?.map((t: any) => t.name)

    // Validar teste único
    if (testName) {
      const validation = validateTestName(testName)
      if (!validation.isValid) {
        return res.status(403).json({
          error: 'Teste não autorizado',
          message: validation.error,
          code: 'UNAUTHORIZED_TEST'
        })
      }
    }

    // Validar múltiplos testes
    if (testNames && Array.isArray(testNames)) {
      const validation = validateMultipleTests(testNames)
      if (validation.invalidTests.length > 0) {
        return res.status(403).json({
          error: 'Testes não autorizados detectados',
          invalidTests: validation.invalidTests,
          errors: validation.errors,
          code: 'UNAUTHORIZED_TESTS'
        })
      }
    }

    next()
  }
}

/**
 * Retorna a lista completa dos testes oficiais
 */
export function getOfficialTests(): readonly string[] {
  return OFFICIAL_TESTS
}

/**
 * Verifica se o sistema está configurado corretamente
 */
export function validateSystemIntegrity(): {
  isValid: boolean
  testCount: number
  errors: string[]
} {
  const errors: string[] = []
  
  if (OFFICIAL_TESTS.length !== 21) {
    errors.push(`Lista oficial deve conter exatamente 21 testes, mas contém ${OFFICIAL_TESTS.length}`)
  }

  // Verificar duplicatas
  const uniqueTests = new Set(OFFICIAL_TESTS)
  if (uniqueTests.size !== OFFICIAL_TESTS.length) {
    errors.push('Lista oficial contém testes duplicados')
  }

  return {
    isValid: errors.length === 0,
    testCount: OFFICIAL_TESTS.length,
    errors
  }
}

export { OFFICIAL_TESTS, type OfficialTestName, type TestValidationResult, type TestValidationLog }