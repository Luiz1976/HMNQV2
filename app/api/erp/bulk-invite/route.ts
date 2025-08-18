
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

// POST - Generate bulk invitations from ERP employees
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    })

    if (!user?.company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const body = await request.json()
    const { 
      erpConfigId, 
      testId, 
      employeeIds, 
      employees, // Auto-imported employees data
      message, 
      expiresInDays = 7,
      isAutoImported = false
    } = body

    if (!testId) {
      return NextResponse.json({ 
        error: 'Test ID is required' 
      }, { status: 400 })
    }

    // Check if we have either ERP config or auto-imported employees
    if (!isAutoImported && !erpConfigId) {
      return NextResponse.json({ 
        error: 'ERP configuration ID is required when not using auto-import' 
      }, { status: 400 })
    }

    if (isAutoImported && (!employees || employees.length === 0)) {
      return NextResponse.json({ 
        error: 'Employee data is required for auto-import' 
      }, { status: 400 })
    }

    let erpConfig = null
    
    // Validate ERP config belongs to company (only if not auto-imported)
    if (!isAutoImported) {
      erpConfig = await prisma.eRPConfig.findFirst({
        where: { 
          id: erpConfigId,
          companyId: user.company.id 
        }
      })

      if (!erpConfig) {
        return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
      }
    }

    // Validate test exists
    const test = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Get employees data
    let employeesData
    if (isAutoImported) {
      // Use auto-imported employees data
      if (employeeIds && employeeIds.length > 0) {
        employeesData = employees.filter((emp: any) => employeeIds.includes(emp.id))
      } else {
        employeesData = employees
      }
    } else {
      // Get employees from ERP database
      if (employeeIds && employeeIds.length > 0) {
        // Specific employees
        employeesData = await prisma.eRPEmployee.findMany({
          where: {
            erpConfigId,
            id: { in: employeeIds }
          }
        })
      } else {
        // All active employees
        employeesData = await prisma.eRPEmployee.findMany({
          where: {
            erpConfigId,
            status: 'Active'
          }
        })
      }
    }

    if (employeesData.length === 0) {
      return NextResponse.json({ 
        error: 'No employees found for invitation' 
      }, { status: 400 })
    }

    // Create invitations
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const invitations = []
    const createdInvitations = []

    for (const employee of employeesData) {
      // Check if invitation already exists
      const existingInvitation = await prisma.invitation.findFirst({
        where: {
          email: employee.email,
          companyId: user.company.id,
          status: { in: ['PENDING', 'SENT'] }
        }
      })

      if (existingInvitation) {
        continue // Skip if already invited
      }

      const token = randomUUID()
      
      // Prepare metadata based on source
      const metadata = isAutoImported ? {
        isAutoImported: true,
        cpf: employee.cpf,
        matricula: employee.matricula,
        department: employee.department,
        position: employee.position
      } : {
        erpEmployeeId: employee.id,
        erpConfigId: erpConfig?.id,
        department: employee.department,
        position: employee.position
      }
      
      const invitation = await prisma.invitation.create({
        data: {
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          companyId: user.company.id,
          invitedBy: user.id,
          token,
          expiresAt,
          message: message || `Você foi convidado para realizar o teste ${test.name}`,
          metadata: {
            ...metadata,
            testId: testId
          }
        }
      })

      createdInvitations.push(invitation)
    }

    // Update invitation status to SENT (in a real system, you'd send emails here)
    await prisma.invitation.updateMany({
      where: {
        id: { in: createdInvitations.map(inv => inv.id) }
      },
      data: {
        status: 'SENT',
        sentAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `${createdInvitations.length} convites criados com sucesso`,
      invitations: createdInvitations.length,
      totalEmployees: employeesData.length,
      skipped: employeesData.length - createdInvitations.length,
      isAutoImported
    })

  } catch (error) {
    console.error('Error creating bulk invitations:', error)
    return NextResponse.json({ 
      error: 'Failed to create invitations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Get invitation statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    })

    if (!user?.company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const erpConfigId = searchParams.get('erpConfigId')

    if (!erpConfigId) {
      return NextResponse.json({ error: 'ERP configuration ID required' }, { status: 400 })
    }

    // Get ERP employees count
    const totalEmployees = await prisma.eRPEmployee.count({
      where: {
        erpConfigId,
        status: 'Active'
      }
    })

    // Get invitation statistics
    const invitationStats = await prisma.invitation.groupBy({
      by: ['status'],
      where: {
        companyId: user.company.id,
        metadata: {
          path: 'erpConfigId',
          equals: erpConfigId
        }
      },
      _count: {
        id: true
      }
    })

    const stats = {
      totalEmployees,
      totalInvitations: 0,
      pending: 0,
      sent: 0,
      accepted: 0,
      expired: 0,
      cancelled: 0
    }

    invitationStats.forEach((stat: any) => {
      stats.totalInvitations += stat._count.id
      stats[stat.status.toLowerCase() as keyof typeof stats] = stat._count.id
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching invitation stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
