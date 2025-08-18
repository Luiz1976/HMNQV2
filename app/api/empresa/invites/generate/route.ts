import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { validateMultipleTests, filterOfficialTests, validateSystemIntegrity } from '@/lib/test-validation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: { message: 'Acesso negado. Apenas empresas podem gerar convites.' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { tests = [], frequency = 'unico' } = body

    // Verificar integridade do sistema
    const systemCheck = validateSystemIntegrity()
    if (!systemCheck.isValid) {
      console.error('Sistema de validação comprometido:', systemCheck.errors)
      return NextResponse.json(
        { error: { message: 'Sistema de validação comprometido', details: systemCheck.errors } },
        { status: 500 }
      )
    }

    // Validar testes selecionados se fornecidos
    if (tests.length > 0) {
      const testNames = tests.map((test: any) => test.name || test.title || test.testName).filter(Boolean)
      if (testNames.length > 0) {
        const validation = validateMultipleTests(testNames)
        if (validation.invalidTests.length > 0) {
          return NextResponse.json(
            { 
              error: { 
                message: 'Testes não autorizados detectados',
                invalidTests: validation.invalidTests,
                errors: validation.errors
              }
            },
            { status: 403 }
          )
        }
      }
    }

    // Get user with company data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    })

    // Validate that user has a company
    if (!user?.company) {
      return NextResponse.json(
        { error: { message: 'Empresa não encontrada para este usuário' } },
        { status: 400 }
      )
    }

    const company = user.company

    if (!company || !company.isActive) {
      return NextResponse.json(
        { error: { message: 'Empresa não encontrada ou inativa' } },
        { status: 400 }
      )
    }

    // Generate unique token
    const inviteToken = randomBytes(32).toString('hex')
    
    // Set expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Buscar testes disponíveis e filtrar apenas os oficiais
    const allTests = await prisma.test.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true }
    })
    
    const officialTests = filterOfficialTests(allTests)
    
    if (officialTests.length === 0) {
      return NextResponse.json(
        { error: { message: 'Nenhum teste oficial disponível no sistema' } },
        { status: 400 }
      )
    }
    
    const firstTest = officialTests[0]

    // Create invite in database
    const invite = await prisma.invitation.create({
      data: {
        email: `company-invite-${Date.now()}@temp.com`, // Temporary email for company invites
        companyId: company.id,
        invitedBy: session.user.id,
        token: inviteToken,
        expiresAt: expiresAt,
        status: 'PENDING'
      },
      include: {
        inviter: {
          select: { firstName: true, lastName: true, email: true }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      id: invite.id,
      token: invite.token,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
      status: 'PENDING',
      company: invite.company,
      test: firstTest,
      inviteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${invite.token}`,
      systemIntegrity: systemCheck,
      availableOfficialTests: officialTests.length,
      totalTests: allTests.length
    })
  } catch (error) {
    console.error('Error generating company invite:', error)
    return NextResponse.json(
      { error: { message: 'Erro interno do servidor' } },
      { status: 500 }
    )
  }
}