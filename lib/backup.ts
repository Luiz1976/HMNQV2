// HumaniQ AI - Sistema de Backup Automático
// Utilitários para backup incremental, restauração e verificação de integridade

import fs from 'fs'
import path from 'path'
import { db } from './db'
import { PrismaClient } from '@prisma/client'

interface BackupMetadata {
  id: string
  timestamp: string
  type: 'full' | 'incremental'
  size: number
  checksum: string
  tables: string[]
  recordCount: number
  status: 'success' | 'failed' | 'in_progress'
  duration: number
  error?: string
}

interface BackupConfig {
  backupDir: string
  maxBackups: number
  compressionEnabled: boolean
  incrementalInterval: number // em horas
  fullBackupInterval: number // em dias
}

class BackupManager {
  private config: BackupConfig
  private backupDir: string
  private dbPath: string
  private logFile: string

  constructor() {
    this.config = {
      backupDir: path.join(process.cwd(), 'backups'),
      maxBackups: 30,
      compressionEnabled: true,
      incrementalInterval: 6, // 6 horas
      fullBackupInterval: 7 // 7 dias
    }
    
    this.backupDir = this.config.backupDir
    this.dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    this.logFile = path.join(this.backupDir, 'backup.log')
    
    this.ensureBackupDirectory()
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  private log(message: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`
    
    console.log(logEntry.trim())
    
    try {
      fs.appendFileSync(this.logFile, logEntry)
    } catch (error) {
      console.error('Erro ao escrever no log:', error)
    }
  }

  private generateChecksum(filePath: string): string {
    const crypto = require('crypto')
    const fileBuffer = fs.readFileSync(filePath)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    return hashSum.digest('hex')
  }

  private async getTableRecordCounts(): Promise<{ [table: string]: number }> {
    try {
      const counts = {
        users: await db.user.count(),
        companies: await db.company.count(),
        tests: await db.test.count(),
        testSessions: await db.testSession.count(),
        testResults: await db.testResult.count(),
        questions: await db.question.count(),
        answers: await db.answer.count(),
        aiAnalyses: await db.aIAnalysis.count(),
        invitations: await db.invitation.count(),
        testCategories: await db.testCategory.count()
      }
      
      return counts
    } catch (error) {
      this.log(`Erro ao contar registros: ${error}`, 'error')
      return {}
    }
  }

  async createFullBackup(): Promise<BackupMetadata> {
    const startTime = Date.now()
    const backupId = `full_${Date.now()}`
    const timestamp = new Date().toISOString()
    
    this.log(`Iniciando backup completo: ${backupId}`)
    
    try {
      // Verificar se o banco existe
      if (!fs.existsSync(this.dbPath)) {
        throw new Error(`Banco de dados não encontrado: ${this.dbPath}`)
      }

      // Criar nome do arquivo de backup
      const backupFileName = `${backupId}.db`
      const backupFilePath = path.join(this.backupDir, backupFileName)
      
      // Copiar arquivo do banco
      fs.copyFileSync(this.dbPath, backupFilePath)
      
      // Obter informações do backup
      const stats = fs.statSync(backupFilePath)
      const checksum = this.generateChecksum(backupFilePath)
      const recordCounts = await this.getTableRecordCounts()
      const totalRecords = Object.values(recordCounts).reduce((sum, count) => sum + count, 0)
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'full',
        size: stats.size,
        checksum,
        tables: Object.keys(recordCounts),
        recordCount: totalRecords,
        status: 'success',
        duration: Date.now() - startTime
      }
      
      // Salvar metadata
      const metadataPath = path.join(this.backupDir, `${backupId}.json`)
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
      
      this.log(`Backup completo criado com sucesso: ${backupFileName} (${this.formatBytes(stats.size)})`)
      
      // Limpar backups antigos
      await this.cleanupOldBackups()
      
      return metadata
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      this.log(`Erro ao criar backup completo: ${errorMessage}`, 'error')
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'full',
        size: 0,
        checksum: '',
        tables: [],
        recordCount: 0,
        status: 'failed',
        duration: Date.now() - startTime,
        error: errorMessage
      }
      
      return metadata
    }
  }

  async createIncrementalBackup(): Promise<BackupMetadata> {
    const startTime = Date.now()
    const backupId = `incremental_${Date.now()}`
    const timestamp = new Date().toISOString()
    
    this.log(`Iniciando backup incremental: ${backupId}`)
    
    try {
      // Para backup incremental, vamos exportar apenas dados modificados recentemente
      const lastBackup = await this.getLastBackupTime()
      const cutoffDate = lastBackup || new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h se não houver backup anterior
      
      // Exportar dados modificados desde o último backup
      const incrementalData = await this.exportIncrementalData(cutoffDate)
      
      const backupFileName = `${backupId}.json`
      const backupFilePath = path.join(this.backupDir, backupFileName)
      
      fs.writeFileSync(backupFilePath, JSON.stringify(incrementalData, null, 2))
      
      const stats = fs.statSync(backupFilePath)
      const checksum = this.generateChecksum(backupFilePath)
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'incremental',
        size: stats.size,
        checksum,
        tables: Object.keys(incrementalData),
        recordCount: Object.values(incrementalData).reduce((sum: number, records: any) => sum + (Array.isArray(records) ? records.length : 0), 0),
        status: 'success',
        duration: Date.now() - startTime
      }
      
      // Salvar metadata
      const metadataPath = path.join(this.backupDir, `${backupId}.json.meta`)
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
      
      this.log(`Backup incremental criado com sucesso: ${backupFileName} (${this.formatBytes(stats.size)})`)
      
      return metadata
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      this.log(`Erro ao criar backup incremental: ${errorMessage}`, 'error')
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'incremental',
        size: 0,
        checksum: '',
        tables: [],
        recordCount: 0,
        status: 'failed',
        duration: Date.now() - startTime,
        error: errorMessage
      }
      
      return metadata
    }
  }

  private async getLastBackupTime(): Promise<Date | null> {
    try {
      const backups = await this.listBackups()
      if (backups.length === 0) return null
      
      const lastBackup = backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      return new Date(lastBackup.timestamp)
    } catch (error) {
      this.log(`Erro ao obter último backup: ${error}`, 'error')
      return null
    }
  }

  private async exportIncrementalData(since: Date): Promise<any> {
    try {
      const data: any = {}
      
      // Exportar dados modificados desde a data especificada
      data.testResults = await db.testResult.findMany({
        where: {
          updatedAt: {
            gte: since
          }
        },
        include: {
          test: true,
          user: true,
          session: true
        }
      })
      
      data.testSessions = await db.testSession.findMany({
        where: {
          updatedAt: {
            gte: since
          }
        },
        include: {
          test: true,
          user: true,
          answers: true
        }
      })
      
      data.aiAnalyses = await db.aIAnalysis.findMany({
        where: {
          updatedAt: {
            gte: since
          }
        }
      })
      
      data.users = await db.user.findMany({
        where: {
          updatedAt: {
            gte: since
          }
        }
      })
      
      return data
    } catch (error) {
      this.log(`Erro ao exportar dados incrementais: ${error}`, 'error')
      throw error
    }
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    this.log(`Iniciando restauração do backup: ${backupId}`)
    
    try {
      const backupFilePath = path.join(this.backupDir, `${backupId}.db`)
      const metadataPath = path.join(this.backupDir, `${backupId}.json`)
      
      // Verificar se os arquivos existem
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Arquivo de backup não encontrado: ${backupFilePath}`)
      }
      
      if (!fs.existsSync(metadataPath)) {
        throw new Error(`Metadata do backup não encontrada: ${metadataPath}`)
      }
      
      // Verificar integridade
      const metadata: BackupMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      const currentChecksum = this.generateChecksum(backupFilePath)
      
      if (currentChecksum !== metadata.checksum) {
        throw new Error('Checksum do backup não confere - arquivo pode estar corrompido')
      }
      
      // Fazer backup do banco atual antes de restaurar
      const currentBackupId = `pre_restore_${Date.now()}`
      const currentBackupPath = path.join(this.backupDir, `${currentBackupId}.db`)
      
      if (fs.existsSync(this.dbPath)) {
        fs.copyFileSync(this.dbPath, currentBackupPath)
        this.log(`Backup do estado atual criado: ${currentBackupId}`)
      }
      
      // Restaurar o backup
      fs.copyFileSync(backupFilePath, this.dbPath)
      
      this.log(`Backup restaurado com sucesso: ${backupId}`)
      return true
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      this.log(`Erro ao restaurar backup: ${errorMessage}`, 'error')
      return false
    }
  }

  async verifyBackupIntegrity(backupId: string): Promise<boolean> {
    try {
      const backupFilePath = path.join(this.backupDir, `${backupId}.db`)
      const metadataPath = path.join(this.backupDir, `${backupId}.json`)
      
      if (!fs.existsSync(backupFilePath) || !fs.existsSync(metadataPath)) {
        return false
      }
      
      const metadata: BackupMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      const currentChecksum = this.generateChecksum(backupFilePath)
      
      return currentChecksum === metadata.checksum
    } catch (error) {
      this.log(`Erro ao verificar integridade: ${error}`, 'error')
      return false
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const files = fs.readdirSync(this.backupDir)
      const metadataFiles = files.filter(file => file.endsWith('.json') && !file.endsWith('.json.meta'))
      
      const backups: BackupMetadata[] = []
      
      for (const file of metadataFiles) {
        try {
          const filePath = path.join(this.backupDir, file)
          const metadata: BackupMetadata = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          backups.push(metadata)
        } catch (error) {
          this.log(`Erro ao ler metadata: ${file}`, 'warn')
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } catch (error) {
      this.log(`Erro ao listar backups: ${error}`, 'error')
      return []
    }
  }

  async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups()
      
      if (backups.length <= this.config.maxBackups) {
        return
      }
      
      const backupsToDelete = backups.slice(this.config.maxBackups)
      
      for (const backup of backupsToDelete) {
        try {
          const backupFile = path.join(this.backupDir, `${backup.id}.db`)
          const metadataFile = path.join(this.backupDir, `${backup.id}.json`)
          
          if (fs.existsSync(backupFile)) {
            fs.unlinkSync(backupFile)
          }
          
          if (fs.existsSync(metadataFile)) {
            fs.unlinkSync(metadataFile)
          }
          
          this.log(`Backup antigo removido: ${backup.id}`)
        } catch (error) {
          this.log(`Erro ao remover backup: ${backup.id} - ${error}`, 'error')
        }
      }
    } catch (error) {
      this.log(`Erro na limpeza de backups: ${error}`, 'error')
    }
  }

  async exportToCSV(tableName: string): Promise<string> {
    try {
      let data: any[] = []
      
      switch (tableName.toLowerCase()) {
        case 'tests':
          data = await db.test.findMany({
            include: {
              category: true
            }
          })
          break
        case 'testresults':
          data = await db.testResult.findMany({
            include: {
              test: true,
              user: true
            }
          })
          break
        case 'testsessions':
          data = await db.testSession.findMany({
            include: {
              test: true,
              user: true
            }
          })
          break
        case 'users':
          data = await db.user.findMany({
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              userType: true,
              createdAt: true,
              updatedAt: true
            }
          })
          break
        default:
          throw new Error(`Tabela não suportada: ${tableName}`)
      }
      
      if (data.length === 0) {
        return 'Nenhum dado encontrado'
      }
      
      // Converter para CSV
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""')
            return `"${String(value).replace(/"/g, '""')}"`
          }).join(',')
        )
      ].join('\n')
      
      return csvContent
    } catch (error) {
      this.log(`Erro ao exportar CSV: ${error}`, 'error')
      throw error
    }
  }

  async exportToJSON(tableName: string): Promise<any> {
    try {
      let data: any[] = []
      
      switch (tableName.toLowerCase()) {
        case 'tests':
          data = await db.test.findMany({
            include: {
              category: true,
              questions: true
            }
          })
          break
        case 'testresults':
          data = await db.testResult.findMany({
            include: {
              test: true,
              user: true,
              session: true
            }
          })
          break
        case 'testsessions':
          data = await db.testSession.findMany({
            include: {
              test: true,
              user: true,
              answers: true
            }
          })
          break
        case 'users':
          data = await db.user.findMany({
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              userType: true,
              createdAt: true,
              updatedAt: true
            }
          })
          break
        default:
          throw new Error(`Tabela não suportada: ${tableName}`)
      }
      
      return {
        table: tableName,
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        data
      }
    } catch (error) {
      this.log(`Erro ao exportar JSON: ${error}`, 'error')
      throw error
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async getBackupStatistics(): Promise<any> {
    try {
      const backups = await this.listBackups()
      const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0)
      const successfulBackups = backups.filter(b => b.status === 'success')
      const failedBackups = backups.filter(b => b.status === 'failed')
      
      return {
        totalBackups: backups.length,
        successfulBackups: successfulBackups.length,
        failedBackups: failedBackups.length,
        totalSize: this.formatBytes(totalSize),
        oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
        newestBackup: backups.length > 0 ? backups[0].timestamp : null,
        averageSize: backups.length > 0 ? this.formatBytes(totalSize / backups.length) : '0 Bytes'
      }
    } catch (error) {
      this.log(`Erro ao obter estatísticas: ${error}`, 'error')
      return null
    }
  }
}

// Instância singleton do gerenciador de backup
export const backupManager = new BackupManager()

// Funções de conveniência para uso externo
export async function createFullBackup(): Promise<BackupMetadata> {
  return backupManager.createFullBackup()
}

export async function createIncrementalBackup(): Promise<BackupMetadata> {
  return backupManager.createIncrementalBackup()
}

export async function restoreBackup(backupId: string): Promise<boolean> {
  return backupManager.restoreBackup(backupId)
}

export async function listBackups(): Promise<BackupMetadata[]> {
  return backupManager.listBackups()
}

export async function verifyBackupIntegrity(backupId: string): Promise<boolean> {
  return backupManager.verifyBackupIntegrity(backupId)
}

export async function exportTableToCSV(tableName: string): Promise<string> {
  return backupManager.exportToCSV(tableName)
}

export async function exportTableToJSON(tableName: string): Promise<any> {
  return backupManager.exportToJSON(tableName)
}

export async function getBackupStatistics(): Promise<any> {
  return backupManager.getBackupStatistics()
}

// Configurar backup automático periódico
let backupInterval: NodeJS.Timeout | null = null

export function startAutomaticBackup(): void {
  if (backupInterval) {
    clearInterval(backupInterval)
  }
  
  // Backup incremental a cada 6 horas
  backupInterval = setInterval(async () => {
    try {
      await createIncrementalBackup()
    } catch (error) {
      console.error('Erro no backup automático:', error)
    }
  }, 6 * 60 * 60 * 1000) // 6 horas
  
  console.log('Backup automático iniciado (incremental a cada 6 horas)')
}

export function stopAutomaticBackup(): void {
  if (backupInterval) {
    clearInterval(backupInterval)
    backupInterval = null
    console.log('Backup automático interrompido')
  }
}

// Iniciar backup automático quando o módulo for carregado
if (process.env.NODE_ENV === 'production') {
  startAutomaticBackup()
}