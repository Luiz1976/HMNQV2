// HumaniQ AI - Invite-based Signup API
// Handles user registration through company invites

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db as prisma } from '@/lib/db'
import { isValidEmail, isValidPassword } from '@/lib/utils'

interface SignupInviteRequest {
  firstName: string
  lastName: string
  email: string
  companyName: string
  password: string
  userType: 'COMPANY' | 'EMPLOYEE' | 'CANDIDATE'
  inviteToken: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupInviteRequest = await request.json()
    const { firstName, lastName, email, companyName, password, userType, inviteToken } = body

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !companyName?.trim() || !password || !inviteToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Todos os campos são obrigatórios'
          }
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Email inválido'
          }
        },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: passwordValidation.errors[0]
          }
        },
        { status: 400 }
      )
    }

    // Validate invite token
    const invite = await prisma.invitation.findUnique({
      where: {
        token: inviteToken
      },
      include: {
        company: true
      }
    })

    if (!invite) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INVITE',
            message: 'Convite inválido'
          }
        },
        { status: 400 }
      )
    }

    // Check if invite is expired
    const now = new Date()
    if (invite.expiresAt < now) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVITE_EXPIRED',
            message: 'Convite expirado'
          }
        },
        { status: 400 }
      )
    }

    // Check if invite was already used
    if (invite.acceptedAt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVITE_ALREADY_USED',
            message: 'Convite já foi utilizado'
          }
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'Usuário já existe com este email'
          }
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Start transaction to create user and company, and mark invite as used
    const result = await prisma.$transaction(async (tx) => {
      // Create or find company
      let company = invite.company
      
      if (!company) {
        // Create new company if not exists
        company = await tx.company.create({
          data: {
            name: companyName.trim(),
            isActive: true
          }
        })
      }

      // Create user
      const user = await tx.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          userType,
          isActive: true,
          companyId: company.id
        }
      })

      // If user type is COMPANY, set as company owner
      if (userType === 'COMPANY') {
        await tx.company.update({
          where: { id: company.id },
          data: { ownerId: user.id }
        })
      }

      // Mark invite as used
      await tx.invitation.update({
        where: {
          id: invite.id
        },
        data: {
          acceptedAt: now
        }
      })

      return { user, company }
    })

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso',
      data: {
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          userType: result.user.userType
        },
        company: {
          id: result.company.id,
          name: result.company.name
        }
      }
    })

  } catch (error) {
    console.error('Signup invite error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor'
        }
      },
      { status: 500 }
    )
  }
}