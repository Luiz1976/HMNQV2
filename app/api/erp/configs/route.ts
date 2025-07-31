
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { ERPType } from '@prisma/client'

export const dynamic = 'force-dynamic'

// GET - List ERP configurations for a company
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

    const erpConfigs = await prisma.eRPConfig.findMany({
      where: { companyId: user.company.id },
      include: {
        syncLogs: {
          take: 5,
          orderBy: { startedAt: 'desc' }
        },
        employees: {
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(erpConfigs)
  } catch (error) {
    console.error('Error fetching ERP configs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new ERP configuration
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
      syncFrequency
    } = body

    // Validate required fields
    if (!name || !erpType || !apiUrl) {
      return NextResponse.json({ 
        error: 'Name, ERP type, and API URL are required' 
      }, { status: 400 })
    }

    // Validate ERP type
    if (!Object.values(ERPType).includes(erpType)) {
      return NextResponse.json({ 
        error: 'Invalid ERP type' 
      }, { status: 400 })
    }

    const erpConfig = await prisma.eRPConfig.create({
      data: {
        name,
        companyId: user.company.id,
        erpType: erpType as ERPType,
        apiUrl,
        apiKey: apiKey || '',
        username,
        password, // Should be encrypted in production
        clientId,
        clientSecret, // Should be encrypted in production
        config,
        fieldMappings,
        autoSync: autoSync || false,
        syncFrequency: syncFrequency || 24
      }
    })

    return NextResponse.json(erpConfig, { status: 201 })
  } catch (error) {
    console.error('Error creating ERP config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
