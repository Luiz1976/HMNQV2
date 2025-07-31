
import { db as prisma } from '@/lib/db'
import { ERPConnectorFactory } from './connector-factory'
import { ERPSyncType, ERPSyncStatus } from '@prisma/client'

export class ERPSyncService {
  async startSync(erpConfigId: string, syncType: ERPSyncType = 'MANUAL'): Promise<{ syncLogId: string }> {
    const erpConfig = await prisma.eRPConfig.findUnique({
      where: { id: erpConfigId }
    })

    if (!erpConfig) {
      throw new Error('ERP configuration not found')
    }

    // Create sync log
    const syncLog = await prisma.eRPSyncLog.create({
      data: {
        erpConfigId,
        syncType,
        status: 'SYNCING'
      }
    })

    // Update ERP config status
    await prisma.eRPConfig.update({
      where: { id: erpConfigId },
      data: { 
        syncStatus: 'SYNCING',
        lastError: null
      }
    })

    // Start sync in background
    this.performSync(erpConfigId, syncLog.id).catch(async (error) => {
      console.error('Background sync failed:', error)
      
      // Update sync log with error
      await prisma.eRPSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'ERROR',
          completedAt: new Date(),
          errorMessage: error.message
        }
      })

      // Update ERP config status
      await prisma.eRPConfig.update({
        where: { id: erpConfigId },
        data: { 
          syncStatus: 'ERROR',
          lastError: error.message
        }
      })
    })

    return { syncLogId: syncLog.id }
  }

  private async performSync(erpConfigId: string, syncLogId: string): Promise<void> {
    const startTime = Date.now()
    
    try {
      const erpConfig = await prisma.eRPConfig.findUnique({
        where: { id: erpConfigId }
      })

      if (!erpConfig) {
        throw new Error('ERP configuration not found')
      }

      // Get connector
      const connector = ERPConnectorFactory.createConnector(erpConfig.erpType)

      // Sync employees
      const syncResult = await connector.getEmployees(erpConfig as any, {
        lastSync: erpConfig.lastSync || undefined
      })

      if (!syncResult.success) {
        throw new Error(`Sync failed: ${syncResult.errors?.join(', ') || 'Unknown error'}`)
      }

      // Process employees
      let newRecords = 0
      let updatedRecords = 0
      let errorRecords = 0

      for (const employee of syncResult.employees || []) {
        try {
          const existing = await prisma.eRPEmployee.findUnique({
            where: {
              erpConfigId_erpEmployeeId: {
                erpConfigId,
                erpEmployeeId: employee.id
              }
            }
          })

          if (existing) {
            // Update existing
            await prisma.eRPEmployee.update({
              where: { id: existing.id },
              data: {
                email: employee.email,
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                position: employee.position,
                phone: employee.phone,
                status: employee.status,
                hireDate: employee.hireDate,
                erpData: employee.rawData,
                lastSyncAt: new Date()
              }
            })
            updatedRecords++
          } else {
            // Create new
            await prisma.eRPEmployee.create({
              data: {
                erpConfigId,
                erpEmployeeId: employee.id,
                email: employee.email,
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                position: employee.position,
                phone: employee.phone,
                status: employee.status,
                hireDate: employee.hireDate,
                erpData: employee.rawData
              }
            })
            newRecords++
          }
        } catch (error) {
          console.error(`Error processing employee ${employee.id}:`, error)
          errorRecords++
        }
      }

      const duration = Math.floor((Date.now() - startTime) / 1000)

      // Update sync log
      await prisma.eRPSyncLog.update({
        where: { id: syncLogId },
        data: {
          status: errorRecords > 0 ? 'PARTIAL_SUCCESS' : 'SUCCESS',
          completedAt: new Date(),
          duration,
          recordsTotal: syncResult.totalRecords,
          recordsNew: newRecords,
          recordsUpdated: updatedRecords,
          recordsErrors: errorRecords,
          details: {
            syncResult,
            processing: {
              newRecords,
              updatedRecords,
              errorRecords
            }
          } as any
        }
      })

      // Update ERP config
      await prisma.eRPConfig.update({
        where: { id: erpConfigId },
        data: {
          syncStatus: errorRecords > 0 ? 'PARTIAL_SUCCESS' : 'SUCCESS',
          lastSync: new Date(),
          nextSync: erpConfig.autoSync ? 
            new Date(Date.now() + erpConfig.syncFrequency * 60 * 60 * 1000) : null,
          employeeCount: newRecords + updatedRecords,
          lastError: null
        }
      })

    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      
      // Update sync log with error
      await prisma.eRPSyncLog.update({
        where: { id: syncLogId },
        data: {
          status: 'ERROR',
          completedAt: new Date(),
          duration,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      })

      // Update ERP config status
      await prisma.eRPConfig.update({
        where: { id: erpConfigId },
        data: { 
          syncStatus: 'ERROR',
          lastError: error instanceof Error ? error.message : 'Unknown error'
        }
      })

      throw error
    }
  }

  async scheduleAutoSync(): Promise<void> {
    // Get all active ERP configs with auto sync enabled and due for sync
    const dueConfigs = await prisma.eRPConfig.findMany({
      where: {
        isActive: true,
        autoSync: true,
        syncStatus: { not: 'SYNCING' },
        OR: [
          { nextSync: null },
          { nextSync: { lte: new Date() } }
        ]
      }
    })

    for (const config of dueConfigs) {
      try {
        await this.startSync(config.id, 'SCHEDULED')
      } catch (error) {
        console.error(`Failed to start scheduled sync for ${config.id}:`, error)
      }
    }
  }
}
