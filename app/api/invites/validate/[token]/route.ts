// HumaniQ AI - Invite Validation API
// Validates invite tokens and returns invite data

import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Token é obrigatório'
          }
        },
        { status: 400 }
      )
    }

    // Find the invite by token
    const invite = await prisma.invitation.findUnique({
      where: {
        token: token
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!invite) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVITE_NOT_FOUND',
            message: 'Convite não encontrado'
          }
        },
        { status: 404 }
      )
    }

    // Check if invite is expired
    const now = new Date()
    const isExpired = invite.expiresAt < now

    // Check if invite was already used
    const isUsed = invite.acceptedAt !== null

    const isValid = !isExpired && !isUsed

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        token: invite.token,
        companyName: invite.company?.name || null,
        companyId: invite.companyId,
        isValid,
        isExpired,
        isUsed,
        expiresAt: invite.expiresAt.toISOString(),
        createdAt: invite.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error validating invite:', error)
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