import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { logger, logUtils } from '../utils/logger';
import { performanceMonitor } from '../monitoring/performance';
import { validateBackupResult, type BackupResult as BackupResultData } from '../validation/schemas';
import { redisConnection } from '../config/redis';

const prisma = new PrismaClient();

// Configurações de backup
interface BackupConfig {
  baseDir: string;
  maxBackupsPerType: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  retentionDays: number;
}

const BACKUP_CONFIG: BackupConfig = {
  baseDir: path.join(process.cwd(), 'backups'),
  maxBackupsPerType: 100,
  compressionEnabled: true,
  encryptionEnabled: false, // Implementar se necessário
  retentionDays: 30
};

// Tipos de backup
enum BackupType {
  TEST_RESULT = 'test_result',
  USER_DATA = 'user_data',
  COMPANY_DATA = 'company_data',
  SYSTEM_STATE = 'system_state',
  INCREMENTAL = 'incremental',
  FULL = 'full'
}

// Interface para metadados de backup
interface BackupMetadata {
  id: string;
  type: BackupType;
  timestamp: Date;
  size: number;
  checksum: string;
  version: string;
  source: string;
  compressed: boolean;
  encrypted: boolean;
  relatedIds?: string[];
}

// Interface para resultado de backup
interface BackupResult {
  success: boolean;
  backupId: string;
  backupPath: string;
  size: number;
  duration: number;
  checksum: string;
  error?: string;
}

// Classe principal do serviço de backup
class BackupService {
  private backupQueue: Array<{ type: BackupType; data: any; priority: number }> = [];
  private isProcessing = false;

  constructor() {
    this.initializeBackupDirectory();
    this.startBackupProcessor();
    this.scheduleCleanup();
  }

  // Inicializar diretório de backup
  private async initializeBackupDirectory() {
    try {
      await fs.mkdir(BACKUP_CONFIG.baseDir, { recursive: true });
      
      // Criar subdiretórios para cada tipo de backup
      for (const type of Object.values(BackupType)) {
        await fs.mkdir(path.join(BACKUP_CONFIG.baseDir, type), { recursive: true });
      }
      
      logger.info('Diretórios de backup inicializados', {
        baseDir: BACKUP_CONFIG.baseDir,
        types: Object.values(BackupType)
      });
    } catch (error) {
      logger.error('Erro ao inicializar diretórios de backup', {
        error: error instanceof Error ? error.message : String(error),
        baseDir: BACKUP_CONFIG.baseDir
      });
    }
  }

  // Gerar ID único para backup
  private generateBackupId(type: BackupType): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}_${timestamp}_${random}`;
  }

  // Calcular checksum dos dados
  private calculateChecksum(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Comprimir dados se habilitado
  private async compressData(data: string): Promise<string> {
    if (!BACKUP_CONFIG.compressionEnabled) {
      return data;
    }

    try {
      const zlib = require('zlib');
      const compressed = zlib.gzipSync(data);
      return compressed.toString('base64');
    } catch (error) {
      logger.warn('Erro ao comprimir dados, usando dados originais', {
        error: error instanceof Error ? error.message : String(error)
      });
      return data;
    }
  }

  // Descomprimir dados
  private async decompressData(compressedData: string, isCompressed: boolean): Promise<string> {
    if (!isCompressed) {
      return compressedData;
    }

    try {
      const zlib = require('zlib');
      const buffer = Buffer.from(compressedData, 'base64');
      const decompressed = zlib.gunzipSync(buffer);
      return decompressed.toString();
    } catch (error) {
      logger.error('Erro ao descomprimir dados', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Salvar backup no disco
  private async saveBackupToDisk(
    backupId: string,
    type: BackupType,
    data: string,
    metadata: BackupMetadata
  ): Promise<{ backupPath: string; size: number }> {
    const backupDir = path.join(BACKUP_CONFIG.baseDir, type);
    const backupPath = path.join(backupDir, `${backupId}.json`);
    const metadataPath = path.join(backupDir, `${backupId}.meta.json`);

    try {
      // Salvar dados do backup
      await fs.writeFile(backupPath, data, 'utf8');
      
      // Salvar metadados
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
      
      // Obter tamanho do arquivo
      const stats = await fs.stat(backupPath);
      
      return {
        backupPath,
        size: stats.size
      };
    } catch (error) {
      logger.error('Erro ao salvar backup no disco', {
        error: error instanceof Error ? error.message : String(error),
        backupPath,
        backupId
      });
      throw error;
    }
  }

  // Backup de resultado de teste
  async backupTestResult(testResultId: string): Promise<BackupResult> {
    const start = Date.now();
    const backupId = this.generateBackupId(BackupType.TEST_RESULT);

    try {
      // Buscar resultado do teste com dados relacionados
      const testResult = await prisma.testResult.findUnique({
        where: { id: testResultId },
        include: {
          test: {
            include: {
              category: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              companyId: true
            }
          },
          session: {
            include: {
              answers: {
                include: {
                  question: true
                }
              }
            }
          },
          aiAnalyses: true
        }
      });

      if (!testResult) {
        throw new Error(`Resultado do teste não encontrado: ${testResultId}`);
      }

      // Preparar dados para backup
      const backupData = {
        testResult,
        backupInfo: {
          id: backupId,
          timestamp: new Date().toISOString(),
          version: '1.0',
          type: BackupType.TEST_RESULT
        }
      };

      const serializedData = JSON.stringify(backupData, null, 2);
      const compressedData = await this.compressData(serializedData);
      const checksum = this.calculateChecksum(compressedData);

      // Criar metadados
      const metadata: BackupMetadata = {
        id: backupId,
        type: BackupType.TEST_RESULT,
        timestamp: new Date(),
        size: compressedData.length,
        checksum,
        version: '1.0',
        source: testResultId,
        compressed: BACKUP_CONFIG.compressionEnabled,
        encrypted: BACKUP_CONFIG.encryptionEnabled,
        relatedIds: [testResultId, testResult.userId, testResult.sessionId]
      };

      // Salvar backup
      const { backupPath, size } = await this.saveBackupToDisk(
        backupId,
        BackupType.TEST_RESULT,
        compressedData,
        metadata
      );

      // Registrar no Redis para consulta rápida
      await this.registerBackupInRedis(backupId, metadata);

      const duration = Date.now() - start;
      
      logUtils.logBackupOperation(
        'create',
        BackupType.TEST_RESULT,
        size,
        true
      );

      performanceMonitor.recordMetric(
        'backup_test_result_duration',
        duration,
        'ms',
        { success: 'true', size: size.toString() }
      );

      logger.info('Backup de resultado de teste criado com sucesso', {
        backupId,
        testResultId,
        backupPath,
        size,
        duration,
        checksum
      });

      return {
        success: true,
        backupId,
        backupPath,
        size,
        duration,
        checksum
      };
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logUtils.logBackupOperation(
        'create',
        BackupType.TEST_RESULT,
        0,
        false,
        errorMessage
      );

      performanceMonitor.recordMetric(
        'backup_test_result_duration',
        duration,
        'ms',
        { success: 'false', error: errorMessage }
      );

      logger.error('Erro ao criar backup de resultado de teste', {
        error: errorMessage,
        testResultId,
        backupId,
        duration
      });

      return {
        success: false,
        backupId,
        backupPath: '',
        size: 0,
        duration,
        checksum: '',
        error: errorMessage
      };
    }
  }

  // Backup incremental de dados do usuário
  async backupUserData(userId: string, includeResults: boolean = true): Promise<BackupResult> {
    const start = Date.now();
    const backupId = this.generateBackupId(BackupType.USER_DATA);

    try {
      // Buscar dados do usuário
      const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          company: true,
          testResults: includeResults ? {
            include: {
              test: true,
              session: true,
              aiAnalyses: true
            }
          } : false,
          testSessions: {
            where: {
              status: 'COMPLETED'
            }
          }
        }
      });

      if (!userData) {
        throw new Error(`Usuário não encontrado: ${userId}`);
      }

      const backupData = {
        userData,
        backupInfo: {
          id: backupId,
          timestamp: new Date().toISOString(),
          version: '1.0',
          type: BackupType.USER_DATA,
          includeResults
        }
      };

      const serializedData = JSON.stringify(backupData, null, 2);
      const compressedData = await this.compressData(serializedData);
      const checksum = this.calculateChecksum(compressedData);

      const metadata: BackupMetadata = {
        id: backupId,
        type: BackupType.USER_DATA,
        timestamp: new Date(),
        size: compressedData.length,
        checksum,
        version: '1.0',
        source: userId,
        compressed: BACKUP_CONFIG.compressionEnabled,
        encrypted: BACKUP_CONFIG.encryptionEnabled,
        relatedIds: [userId, ...(userData.testResults?.map(r => r.id) || [])]
      };

      const { backupPath, size } = await this.saveBackupToDisk(
        backupId,
        BackupType.USER_DATA,
        compressedData,
        metadata
      );

      await this.registerBackupInRedis(backupId, metadata);

      const duration = Date.now() - start;
      
      logUtils.logBackupOperation('create', BackupType.USER_DATA, size, true);

      logger.info('Backup de dados do usuário criado', {
        backupId,
        userId,
        includeResults,
        size,
        duration
      });

      return {
        success: true,
        backupId,
        backupPath,
        size,
        duration,
        checksum
      };
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logUtils.logBackupOperation('create', BackupType.USER_DATA, 0, false, errorMessage);

      logger.error('Erro ao criar backup de dados do usuário', {
        error: errorMessage,
        userId,
        duration
      });

      return {
        success: false,
        backupId,
        backupPath: '',
        size: 0,
        duration,
        checksum: '',
        error: errorMessage
      };
    }
  }

  // Restaurar backup
  async restoreBackup(backupId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const start = Date.now();

    try {
      // Buscar metadados do backup
      const metadata = await this.getBackupMetadata(backupId);
      if (!metadata) {
        throw new Error(`Backup não encontrado: ${backupId}`);
      }

      // Ler arquivo de backup
      const backupPath = path.join(BACKUP_CONFIG.baseDir, metadata.type, `${backupId}.json`);
      const compressedData = await fs.readFile(backupPath, 'utf8');
      
      // Verificar checksum
      const currentChecksum = this.calculateChecksum(compressedData);
      if (currentChecksum !== metadata.checksum) {
        throw new Error('Checksum do backup não confere - arquivo pode estar corrompido');
      }

      // Descomprimir dados
      const decompressedData = await this.decompressData(compressedData, metadata.compressed);
      const backupData = JSON.parse(decompressedData);

      const duration = Date.now() - start;
      
      logger.info('Backup restaurado com sucesso', {
        backupId,
        type: metadata.type,
        size: metadata.size,
        duration
      });

      return {
        success: true,
        data: backupData
      };
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logger.error('Erro ao restaurar backup', {
        error: errorMessage,
        backupId,
        duration
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Obter metadados de backup
  async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    try {
      // Tentar buscar no Redis primeiro
      const redisKey = `backup_metadata:${backupId}`;
      const cachedMetadata = await redisConnection.get(redisKey);
      
      if (cachedMetadata) {
        return JSON.parse(cachedMetadata);
      }

      // Buscar nos arquivos de metadados
      for (const type of Object.values(BackupType)) {
        const metadataPath = path.join(BACKUP_CONFIG.baseDir, type, `${backupId}.meta.json`);
        
        try {
          const metadataContent = await fs.readFile(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent);
          
          // Salvar no Redis para próximas consultas
          await redisConnection.setex(redisKey, 3600, JSON.stringify(metadata));
          
          return metadata;
        } catch {
          // Continuar procurando em outros tipos
          continue;
        }
      }

      return null;
    } catch (error) {
      logger.error('Erro ao obter metadados de backup', {
        error: error instanceof Error ? error.message : String(error),
        backupId
      });
      return null;
    }
  }

  // Registrar backup no Redis
  private async registerBackupInRedis(backupId: string, metadata: BackupMetadata) {
    try {
      const redisKey = `backup_metadata:${backupId}`;
      await redisConnection.setex(redisKey, 86400, JSON.stringify(metadata)); // 24 horas TTL
      
      // Adicionar à lista de backups por tipo
      const typeListKey = `backup_list:${metadata.type}`;
      await redisConnection.lpush(typeListKey, backupId);
      await redisConnection.ltrim(typeListKey, 0, BACKUP_CONFIG.maxBackupsPerType - 1);
    } catch (error) {
      logger.warn('Erro ao registrar backup no Redis', {
        error: error instanceof Error ? error.message : String(error),
        backupId
      });
    }
  }

  // Listar backups
  async listBackups(type?: BackupType, limit: number = 50): Promise<BackupMetadata[]> {
    try {
      const backups: BackupMetadata[] = [];
      const typesToSearch = type ? [type] : Object.values(BackupType);

      for (const searchType of typesToSearch) {
        const typeListKey = `backup_list:${searchType}`;
        const backupIds = await redisConnection.lrange(typeListKey, 0, limit - 1);
        
        for (const backupId of backupIds) {
          const metadata = await this.getBackupMetadata(backupId);
          if (metadata) {
            backups.push(metadata);
          }
        }
      }

      // Ordenar por timestamp (mais recentes primeiro)
      backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      return backups.slice(0, limit);
    } catch (error) {
      logger.error('Erro ao listar backups', {
        error: error instanceof Error ? error.message : String(error),
        type,
        limit
      });
      return [];
    }
  }

  // Limpar backups antigos
  async cleanupOldBackups(): Promise<{ deleted: number; errors: number }> {
    const cutoffDate = new Date(Date.now() - (BACKUP_CONFIG.retentionDays * 24 * 60 * 60 * 1000));
    let deleted = 0;
    let errors = 0;

    try {
      for (const type of Object.values(BackupType)) {
        const backupDir = path.join(BACKUP_CONFIG.baseDir, type);
        
        try {
          const files = await fs.readdir(backupDir);
          const metadataFiles = files.filter(f => f.endsWith('.meta.json'));
          
          for (const metadataFile of metadataFiles) {
            const metadataPath = path.join(backupDir, metadataFile);
            const backupId = metadataFile.replace('.meta.json', '');
            
            try {
              const metadataContent = await fs.readFile(metadataPath, 'utf8');
              const metadata: BackupMetadata = JSON.parse(metadataContent);
              
              if (new Date(metadata.timestamp) < cutoffDate) {
                // Deletar arquivos de backup e metadados
                const backupPath = path.join(backupDir, `${backupId}.json`);
                
                await fs.unlink(backupPath);
                await fs.unlink(metadataPath);
                
                // Remover do Redis
                await redisConnection.del(`backup_metadata:${backupId}`);
                
                deleted++;
                
                logger.debug('Backup antigo removido', {
                  backupId,
                  type,
                  timestamp: metadata.timestamp
                });
              }
            } catch (error) {
              errors++;
              logger.warn('Erro ao processar backup para limpeza', {
                error: error instanceof Error ? error.message : String(error),
                metadataFile
              });
            }
          }
        } catch (error) {
          errors++;
          logger.warn('Erro ao acessar diretório de backup', {
            error: error instanceof Error ? error.message : String(error),
            backupDir
          });
        }
      }

      logger.info('Limpeza de backups concluída', {
        deleted,
        errors,
        cutoffDate: cutoffDate.toISOString()
      });

      return { deleted, errors };
    } catch (error) {
      logger.error('Erro durante limpeza de backups', {
        error: error instanceof Error ? error.message : String(error)
      });
      return { deleted, errors: errors + 1 };
    }
  }

  // Iniciar processador de fila de backup
  private startBackupProcessor() {
    setInterval(async () => {
      if (this.isProcessing || this.backupQueue.length === 0) {
        return;
      }

      this.isProcessing = true;
      
      try {
        // Processar item de maior prioridade
        this.backupQueue.sort((a, b) => b.priority - a.priority);
        const item = this.backupQueue.shift();
        
        if (item) {
          await this.processBackupItem(item);
        }
      } catch (error) {
        logger.error('Erro no processador de backup', {
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        this.isProcessing = false;
      }
    }, 5000); // Processar a cada 5 segundos
  }

  // Processar item da fila de backup
  private async processBackupItem(item: { type: BackupType; data: any; priority: number }) {
    try {
      switch (item.type) {
        case BackupType.TEST_RESULT:
          await this.backupTestResult(item.data.testResultId);
          break;
        case BackupType.USER_DATA:
          await this.backupUserData(item.data.userId, item.data.includeResults);
          break;
        default:
          logger.warn('Tipo de backup não suportado na fila', { type: item.type });
      }
    } catch (error) {
      logger.error('Erro ao processar item de backup da fila', {
        error: error instanceof Error ? error.message : String(error),
        item
      });
    }
  }

  // Agendar limpeza automática
  private scheduleCleanup() {
    // Executar limpeza diariamente às 2:00 AM
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    
    const msUntilCleanup = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.cleanupOldBackups();
      
      // Agendar próximas limpezas a cada 24 horas
      setInterval(() => {
        this.cleanupOldBackups();
      }, 24 * 60 * 60 * 1000);
    }, msUntilCleanup);
    
    logger.info('Limpeza automática de backups agendada', {
      nextCleanup: tomorrow.toISOString()
    });
  }

  // Adicionar item à fila de backup
  addToQueue(type: BackupType, data: any, priority: number = 5) {
    this.backupQueue.push({ type, data, priority });
    
    logger.debug('Item adicionado à fila de backup', {
      type,
      priority,
      queueLength: this.backupQueue.length
    });
  }

  // Obter estatísticas de backup
  async getBackupStatistics(): Promise<{
    totalBackups: number;
    backupsByType: Record<BackupType, number>;
    totalSize: number;
    oldestBackup?: Date;
    newestBackup?: Date;
  }> {
    try {
      const backups = await this.listBackups(undefined, 1000);
      const backupsByType: Record<BackupType, number> = {} as any;
      let totalSize = 0;
      let oldestBackup: Date | undefined;
      let newestBackup: Date | undefined;

      for (const backup of backups) {
        backupsByType[backup.type] = (backupsByType[backup.type] || 0) + 1;
        totalSize += backup.size;
        
        if (!oldestBackup || backup.timestamp < oldestBackup) {
          oldestBackup = backup.timestamp;
        }
        
        if (!newestBackup || backup.timestamp > newestBackup) {
          newestBackup = backup.timestamp;
        }
      }

      return {
        totalBackups: backups.length,
        backupsByType,
        totalSize,
        oldestBackup,
        newestBackup
      };
    } catch (error) {
      logger.error('Erro ao obter estatísticas de backup', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        totalBackups: 0,
        backupsByType: {} as any,
        totalSize: 0
      };
    }
  }
}

// Instância singleton do serviço de backup
export const backupService = new BackupService();

export { BackupService, BackupType };
export type { BackupResult, BackupMetadata, BackupConfig };
export default backupService;