
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { ERPConnectorFactory } from '@/lib/erp/connector-factory'

export const dynamic = 'force-dynamic'

// POST - Test ERP connection
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
    const { erpConfigId, testConfig } = body

    let erpConfig
    
    if (erpConfigId) {
      // Test existing configuration
      erpConfig = await prisma.eRPConfig.findFirst({
        where: { 
          id: erpConfigId,
          companyId: user.company.id 
        }
      })

      if (!erpConfig) {
        return NextResponse.json({ error: 'ERP configuration not found' }, { status: 404 })
      }
    } else if (testConfig) {
      // Test new configuration without saving
      erpConfig = testConfig
    } else {
      return NextResponse.json({ error: 'ERP configuration or test config required' }, { status: 400 })
    }

    // Get appropriate connector
    const connector = ERPConnectorFactory.createConnector(erpConfig.erpType)
    
    // Test connection
    const testResult = await connector.testConnection(erpConfig)

    // Update ERP config with test result if it's an existing config
    if (erpConfigId) {
      await prisma.eRPConfig.update({
        where: { id: erpConfigId },
        data: {
          syncStatus: testResult.success ? 'SUCCESS' : 'ERROR',
          lastError: testResult.success ? null : testResult.error
        }
      })
    }

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      error: testResult.error,
      details: testResult.details
    })
  } catch (error) {
    console.error('Error testing ERP connection:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to test connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
