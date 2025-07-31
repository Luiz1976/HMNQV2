import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { isValidEmail } from '@/lib/utils'

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
    const { email, companyName, message, firstName, lastName } = body

    // Validate required fields
    if (!email?.trim() || !companyName?.trim()) {
      return NextResponse.json(
        { error: { message: 'Email e nome da empresa são obrigatórios' } },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: { message: 'Email inválido' } },
        { status: 400 }
      )
    }

    // Check if invite already exists for this email
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        status: { in: ['PENDING', 'SENT'] }
      }
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: { message: 'Já existe um convite pendente para este email' } },
        { status: 400 }
      )
    }



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

    // Generate unique token
    const inviteToken = randomBytes(32).toString('hex')
    
    // Set expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Create invite in database
    const invite = await prisma.invitation.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName ? firstName.trim() : null,
        lastName: lastName ? lastName.trim() : null,
        testId: null,
        companyId: company.id,
        invitedBy: session.user.id,
        token: inviteToken,
        expiresAt: expiresAt,
        status: 'PENDING',
        message: message?.trim() || null
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
        },

      }
    })

    return NextResponse.json({
      id: invite.id,
      email: invite.email,
      firstName: invite.firstName,
      lastName: invite.lastName,
      token: invite.token,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
      status: invite.status,
      company: invite.company,

      message: invite.message
    })
  } catch (error) {
    console.error('Error creating invite:', error)
    return NextResponse.json(
      { error: { message: 'Erro interno do servidor' } },
      { status: 500 }
    )
  }
}