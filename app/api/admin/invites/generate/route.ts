
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: { message: 'Acesso negado' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userType = 'COMPANY', companyName } = body

    // Validate required fields
    if (!companyName?.trim()) {
      return NextResponse.json(
        { error: { message: 'Nome da empresa é obrigatório' } },
        { status: 400 }
      )
    }

    // Generate unique token
    const inviteToken = randomBytes(32).toString('hex')
    
    // Set expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Create or find company
    let company = await prisma.company.findFirst({
      where: {
        name: companyName.trim()
      }
    })

    if (!company) {
      // Create new company
      company = await prisma.company.create({
        data: {
          name: companyName.trim(),
          isActive: true
        }
      })
    }

    // Get the first available test
    const firstTest = await prisma.test.findFirst({
      select: { id: true }
    })
    
    if (!firstTest) {
      return NextResponse.json(
        { error: { message: 'Nenhum teste disponível no sistema' } },
        { status: 400 }
      )
    }

    // Create invite in database
    const invite = await prisma.invitation.create({
      data: {
        email: `invite-${Date.now()}@temp.com`,
        testId: firstTest.id,
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
      id: invite.id,
      token: invite.token,
      userType: userType,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
      status: 'PENDING',
      company: invite.company
    })
  } catch (error) {
    console.error('Error generating invite:', error)
    return NextResponse.json(
      { error: { message: 'Erro interno do servidor' } },
      { status: 500 }
    )
  }
}
