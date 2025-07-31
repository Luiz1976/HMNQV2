
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { ERPSyncService } from '@/lib/erp/sync-service'

export const dynamic = 'force-dynamic'

// POST - Start manual sync
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
    const { erpConfigId, syncType = 'MANUAL' } = body

    if (!erpConfigId) {
      return NextResponse.json({ error: 'ERP configuration ID required' }, { status: 400 })
    }

    const erpConfig = await prisma.eRPConfig.findFirst({
      where: { 
        id: erpConfigId,
        companyId: user.company.id 
      }
    })

    if (!erpConfig) {
      return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
    }

    if (!erpConfig.isActive) {
      return NextResponse.json({ error: 'ERP configuration is not active' }, { status: 400 })
    }

    // Check if sync is already running
    if (erpConfig.syncStatus === 'SYNCING') {
      return NextResponse.json({ error: 'Sync already in progress' }, { status: 409 })
    }

    // Start sync
    const syncService = new ERPSyncService()
    const syncResult = await syncService.startSync(erpConfigId, syncType as any)

    return NextResponse.json({
      success: true,
      syncLogId: syncResult.syncLogId,
      message: 'Sync started successfully'
    })
  } catch (error) {
    console.error('Error starting ERP sync:', error)
    return NextResponse.json({ 
      error: 'Failed to start sync',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Get sync status
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

    const erpConfig = await prisma.eRPConfig.findFirst({
      where: { 
        id: erpConfigId,
        companyId: user.company.id 
      },
      include: {
        syncLogs: {
          take: 1,
          orderBy: { startedAt: 'desc' }
        }
      }
    })

    if (!erpConfig) {
      return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
    }

    return NextResponse.json({
      syncStatus: erpConfig.syncStatus,
      lastSync: erpConfig.lastSync,
      nextSync: erpConfig.nextSync,
      employeeCount: erpConfig.employeeCount,
      lastError: erpConfig.lastError,
      currentSync: erpConfig.syncLogs[0] || null
    })
  } catch (error) {
    console.error('Error getting sync status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
