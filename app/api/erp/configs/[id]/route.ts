
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { ERPType } from '@prisma/client'

export const dynamic = 'force-dynamic'

// GET - Get specific ERP configuration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const erpConfig = await prisma.eRPConfig.findFirst({
      where: { 
        id: params.id,
        companyId: user.company.id 
      },
      include: {
        syncLogs: {
          take: 10,
          orderBy: { startedAt: 'desc' }
        },
        employees: {
          take: 20,
          orderBy: { lastSyncAt: 'desc' }
        }
      }
    })

    if (!erpConfig) {
      return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
    }

    return NextResponse.json(erpConfig)
  } catch (error) {
    console.error('Error fetching ERP config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update ERP configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      name,
      erpType,
      apiUrl,
      apiKey,
      username,
      password,
      clientId,
      clientSecret,
      config,
      fieldMappings,
      autoSync,
      syncFrequency,
      isActive
    } = body

    // Validate ERP type if provided
    if (erpType && !Object.values(ERPType).includes(erpType)) {
      return NextResponse.json({ 
        error: 'Invalid ERP type' 
      }, { status: 400 })
    }

    const erpConfig = await prisma.eRPConfig.updateMany({
      where: { 
        id: params.id,
        companyId: user.company.id 
      },
      data: {
        ...(name && { name }),
        ...(erpType && { erpType: erpType as ERPType }),
        ...(apiUrl && { apiUrl }),
        ...(apiKey !== undefined && { apiKey }),
        ...(username !== undefined && { username }),
        ...(password !== undefined && { password }),
        ...(clientId !== undefined && { clientId }),
        ...(clientSecret !== undefined && { clientSecret }),
        ...(config && { config }),
        ...(fieldMappings && { fieldMappings }),
        ...(autoSync !== undefined && { autoSync }),
        ...(syncFrequency && { syncFrequency }),
        ...(isActive !== undefined && { isActive })
      }
    })

    if (erpConfig.count === 0) {
      return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
    }

    // Return updated config
    const updatedConfig = await prisma.eRPConfig.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error('Error updating ERP config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete ERP configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const deletedConfig = await prisma.eRPConfig.deleteMany({
      where: { 
        id: params.id,
        companyId: user.company.id 
      }
    })

    if (deletedConfig.count === 0) {
      return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'ERP configuration deleted successfully' })
  } catch (error) {
    console.error('Error deleting ERP config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
