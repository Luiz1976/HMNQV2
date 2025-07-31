
// HumaniQ AI - User Registration API
// Handles user signup with proper validation

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getDefaultPermissions } from '@/lib/auth'
import { isValidEmail, isValidPassword } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, userType = 'EMPLOYEE', companyId } = body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Todos os campos são obrigatórios',
            details: []
          }
        },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Email inválido',
            details: []
          }
        },
        { status: 400 }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Senha não atende aos critérios de segurança',
            details: passwordValidation.errors
          }
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'Usuário já existe com este email',
            details: []
          }
        },
        { status: 409 }
      )
    }

    // Validate company if provided
    if (companyId) {
      const company = await db.company.findUnique({
        where: { id: companyId, isActive: true }
      })

      if (!company) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'COMPANY_NOT_FOUND',
              message: 'Empresa não encontrada',
              details: []
            }
          },
          { status: 404 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Get default permissions for user type
    const defaultPermissions = getDefaultPermissions(userType)

    // Create user with transaction
    const user = await db.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          userType,
          companyId,
          isActive: true,
          emailVerified: new Date() // Auto-verify for demo
        },
        include: {
          company: true
        }
      })

      // Create user permissions
      if (defaultPermissions.length > 0) {
        await tx.userPermission.createMany({
          data: defaultPermissions.map(permission => ({
            userId: newUser.id,
            permission
          }))
        })
      }

      return newUser
    })

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          message: 'Usuário criado com sucesso'
        },
        message: 'Conta criada com sucesso! Você pode fazer login agora.'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor',
          details: []
        }
      },
      { status: 500 }
    )
  }
}
