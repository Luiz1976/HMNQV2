import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { filterOfficialTests, validateSystemIntegrity } from '@/lib/test-validation'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é usuário empresa
    if (session.user.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas empresas podem acessar esta API.' },
        { status: 403 }
      )
    }

    // Verificar integridade do sistema
    const systemCheck = validateSystemIntegrity()
    if (!systemCheck.isValid) {
      console.error('Sistema de validação comprometido:', systemCheck.errors)
      return NextResponse.json(
        { error: 'Sistema de validação comprometido', details: systemCheck.errors },
        { status: 500 }
      )
    }

    // Buscar testes ativos com suas categorias
    const allTests = await db.test.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Filtrar apenas testes oficiais autorizados
    const officialTests = filterOfficialTests(allTests)
    
    // Log de testes bloqueados para auditoria
    const blockedTests = allTests.filter(test => !officialTests.includes(test))
    if (blockedTests.length > 0) {
      console.warn(`🚫 ${blockedTests.length} testes não oficiais foram bloqueados:`, 
        blockedTests.map(t => t.name))
    }

    return NextResponse.json({ 
      tests: officialTests,
      systemIntegrity: systemCheck,
      totalTests: allTests.length,
      officialTests: officialTests.length,
      blockedTests: blockedTests.length
    })

  } catch (error) {
    console.error('Erro ao buscar testes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}