// HumaniQ AI - Agendador de Backup Automático
// Sistema de backup periódico com configuração flexível

import { createFullBackup, createIncrementalBackup } from './backup'
import * as cron from 'node-cron'

interface BackupScheduleConfig {
  incrementalInterval: string // Cron expression
  fullBackupInterval: string // Cron expression
  enabled: boolean
  maxRetries: number
  retryDelay: number // em minutos
}

class BackupScheduler {
  private config: BackupScheduleConfig
  private incrementalTask: any | null = null
  private fullBackupTask: any | null = null
  private isRunning: boolean = false

  constructor() {
    this.config = {
      // Backup incremental a cada 6 horas
      incrementalInterval: '0 */6 * * *',
      // Backup completo todos os dias às 2:00 AM
      fullBackupInterval: '0 2 * * *',
      enabled: process.env.NODE_ENV === 'production',
      maxRetries: 3,
      retryDelay: 5 // 5 minutos
    }
  }

  private log(message: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] [BACKUP-SCHEDULER] [${level.toUpperCase()}] ${message}`
    console.log(logEntry)
  }

  private async executeWithRetry(
    operation: () => Promise<any>,
    operationName: string,
    maxRetries: number = this.config.maxRetries
  ): Promise<boolean> {
    let attempt = 1
    
    while (attempt <= maxRetries) {
      try {
        this.log(`Executando ${operationName} (tentativa ${attempt}/${maxRetries})`)
        const result = await operation()
        
        if (result.status === 'success') {
          this.log(`${operationName} executado com sucesso`)
          return true
        } else {
          throw new Error(result.error || 'Operação falhou')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        this.log(`Erro na tentativa ${attempt}/${maxRetries} de ${operationName}: ${errorMessage}`, 'error')
        
        if (attempt === maxRetries) {
          this.log(`${operationName} falhou após ${maxRetries} tentativas`, 'error')
          return false
        }
        
        // Aguardar antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * 60 * 1000))
        attempt++
      }
    }
    
    return false
  }

  private async performIncrementalBackup(): Promise<void> {
    this.log('Iniciando backup incremental automático')
    
    const success = await this.executeWithRetry(
      () => createIncrementalBackup(),
      'backup incremental'
    )
    
    if (success) {
      this.log('Backup incremental automático concluído com sucesso')
    } else {
      this.log('Backup incremental automático falhou', 'error')
      // Enviar notificação de erro (implementar se necessário)
      await this.notifyBackupFailure('incremental')
    }
  }

  private async performFullBackup(): Promise<void> {
    this.log('Iniciando backup completo automático')
    
    const success = await this.executeWithRetry(
      () => createFullBackup(),
      'backup completo'
    )
    
    if (success) {
      this.log('Backup completo automático concluído com sucesso')
    } else {
      this.log('Backup completo automático falhou', 'error')
      // Enviar notificação de erro (implementar se necessário)
      await this.notifyBackupFailure('full')
    }
  }

  private async notifyBackupFailure(backupType: 'incremental' | 'full'): Promise<void> {
    try {
      // Implementar notificação de falha de backup
      // Pode ser email, webhook, log especial, etc.
      this.log(`Notificação de falha de backup ${backupType} enviada`, 'warn')
    } catch (error) {
      this.log(`Erro ao enviar notificação de falha: ${error}`, 'error')
    }
  }

  public start(): void {
    if (this.isRunning) {
      this.log('Agendador de backup já está em execução', 'warn')
      return
    }

    if (!this.config.enabled) {
      this.log('Agendador de backup está desabilitado')
      return
    }

    try {
      // Agendar backup incremental
      this.incrementalTask = cron.schedule(
        this.config.incrementalInterval,
        () => this.performIncrementalBackup(),
        {
          timezone: 'America/Sao_Paulo'
        }
      )

      // Agendar backup completo
      this.fullBackupTask = cron.schedule(
        this.config.fullBackupInterval,
        () => this.performFullBackup(),
        {
          timezone: 'America/Sao_Paulo'
        }
      )
      
      this.isRunning = true
      
      this.log(`Agendador de backup iniciado:`)
      this.log(`- Backup incremental: ${this.config.incrementalInterval}`)
      this.log(`- Backup completo: ${this.config.fullBackupInterval}`)
      
    } catch (error) {
      this.log(`Erro ao iniciar agendador de backup: ${error}`, 'error')
      throw error
    }
  }

  public stop(): void {
    if (!this.isRunning) {
      this.log('Agendador de backup não está em execução', 'warn')
      return
    }

    try {
      if (this.incrementalTask) {
        this.incrementalTask.stop()
        this.incrementalTask = null
      }

      if (this.fullBackupTask) {
        this.fullBackupTask.stop()
        this.fullBackupTask = null
      }

      this.isRunning = false
      this.log('Agendador de backup interrompido')
      
    } catch (error) {
      this.log(`Erro ao parar agendador de backup: ${error}`, 'error')
      throw error
    }
  }

  public restart(): void {
    this.log('Reiniciando agendador de backup')
    this.stop()
    setTimeout(() => this.start(), 1000)
  }

  public updateConfig(newConfig: Partial<BackupScheduleConfig>): void {
    const wasRunning = this.isRunning
    
    if (wasRunning) {
      this.stop()
    }
    
    this.config = { ...this.config, ...newConfig }
    this.log('Configuração do agendador atualizada')
    
    if (wasRunning && this.config.enabled) {
      this.start()
    }
  }

  public getConfig(): BackupScheduleConfig {
    return { ...this.config }
  }

  public getStatus(): {
    isRunning: boolean
    config: BackupScheduleConfig
    nextIncrementalRun?: string
    nextFullBackupRun?: string
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      nextIncrementalRun: this.incrementalTask?.nextDate()?.toISOString(),
      nextFullBackupRun: this.fullBackupTask?.nextDate()?.toISOString()
    }
  }

  // Executar backup manual (fora do agendamento)
  public async runManualBackup(type: 'incremental' | 'full' = 'incremental'): Promise<boolean> {
    this.log(`Executando backup manual: ${type}`)
    
    if (type === 'full') {
      return await this.executeWithRetry(
        () => createFullBackup(),
        'backup completo manual'
      )
    } else {
      return await this.executeWithRetry(
        () => createIncrementalBackup(),
        'backup incremental manual'
      )
    }
  }
}

// Instância singleton do agendador
export const backupScheduler = new BackupScheduler()

// Funções de conveniência
export function startBackupScheduler(): void {
  backupScheduler.start()
}

export function stopBackupScheduler(): void {
  backupScheduler.stop()
}

export function restartBackupScheduler(): void {
  backupScheduler.restart()
}

export function updateBackupConfig(config: Partial<BackupScheduleConfig>): void {
  backupScheduler.updateConfig(config)
}

export function getBackupSchedulerStatus(): any {
  return backupScheduler.getStatus()
}

export async function runManualBackup(type: 'incremental' | 'full' = 'incremental'): Promise<boolean> {
  return backupScheduler.runManualBackup(type)
}

// Auto-inicializar em produção
if (process.env.NODE_ENV === 'production') {
  // Aguardar um pouco antes de iniciar para garantir que o banco esteja pronto
  setTimeout(() => {
    try {
      startBackupScheduler()
    } catch (error) {
      console.error('Erro ao auto-inicializar agendador de backup:', error)
    }
  }, 30000) // 30 segundos
}

// Register cleanup with process manager
import { registerCleanup } from './process-manager'

// Cleanup function for backup scheduler
const schedulerCleanup = () => {
  console.log('[BACKUP-SCHEDULER] Parando agendador de backup...')
  stopBackupScheduler()
}

registerCleanup(schedulerCleanup)

export type { BackupScheduleConfig }