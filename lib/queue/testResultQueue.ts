import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { validateTestResult, validateQueueJobData, type TestResult, type QueueJobData } from '../validation/schemas';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { performanceMonitor } from '../monitoring/performance';
import { backupService } from '../backup/backupService';
import { cacheService } from '../cache/cacheService';

const prisma = new PrismaClient();

// Configurações da fila
const QUEUE_NAME = 'test-results';
const QUEUE_CONFIG = {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: parseInt(process.env.QUEUE_MAX_RETRIES || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.QUEUE_RETRY_DELAY || '2000'),
    },
  },
};

// Criar a fila
export const testResultQueue = new Queue(QUEUE_NAME, QUEUE_CONFIG);

// Tipos de jobs
export enum JobType {
  SAVE_TEST_RESULT = 'SAVE_RESULT',
  GENERATE_AI_ANALYSIS = 'GENERATE_AI_ANALYSIS',
  BACKUP_RESULT = 'BACKUP_RESULT',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION'
}

// Interface para dados do job
interface SaveTestResultJobData extends QueueJobData {
  type: JobType.SAVE_TEST_RESULT;
  testResult: TestResult;
  sessionId: string;
  userId: string;
  companyId?: string;
}

interface GenerateAIAnalysisJobData extends QueueJobData {
  type: JobType.GENERATE_AI_ANALYSIS;
  testResultId: string;
  testType: string;
}

interface BackupResultJobData extends QueueJobData {
  type: JobType.BACKUP_RESULT;
  testResultId: string;
}



interface SendNotificationJobData extends QueueJobData {
  type: JobType.SEND_NOTIFICATION;
  userId: string;
  testResultId: string;
  notificationType: 'test_completed' | 'ai_analysis_ready';
}

type AllJobData = SaveTestResultJobData | GenerateAIAnalysisJobData | BackupResultJobData | SendNotificationJobData;

// Worker para processar jobs
export const testResultWorker = new Worker(
  QUEUE_NAME,
  async (job: Job<AllJobData>) => {
    const startTime = Date.now();
    const { type, ...data } = job.data;

    try {
      logger.info(`Processando job ${type}`, { jobId: job.id, data });
      
      // Validar dados do job
      try {
        validateQueueJobData(job.data);
      } catch (error) {
        throw new Error(`Dados do job inválidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }

      let result;
      
      switch (type) {
        case JobType.SAVE_TEST_RESULT:
          result = await processSaveTestResult(data as SaveTestResultJobData);
          break;
        case JobType.GENERATE_AI_ANALYSIS:
          result = await processGenerateAIAnalysis(data as GenerateAIAnalysisJobData);
          break;
        case JobType.BACKUP_RESULT:
          result = await processBackupResult(data as BackupResultJobData);
          break;

        case JobType.SEND_NOTIFICATION:
          result = await processSendNotification(data as SendNotificationJobData);
          break;
        default:
          throw new Error(`Tipo de job desconhecido: ${type}`);
      }

      const duration = Date.now() - startTime;
      performanceMonitor.recordJobProcessing(type, duration, 'success');
      
      logger.info(`Job ${type} processado com sucesso`, { 
        jobId: job.id, 
        duration,
        result 
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      performanceMonitor.recordJobProcessing(type, duration, 'error');
      
      logger.error(`Erro ao processar job ${type}`, {
        jobId: job.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration
      });
      
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5'),
    maxStalledCount: 3,
    stalledInterval: 30000,
  }
);

// Processadores específicos para cada tipo de job
async function processSaveTestResult(data: SaveTestResultJobData): Promise<any> {
  const { testResult, sessionId, userId, companyId } = data;
  
  // Validar dados do resultado do teste
  try {
    validateTestResult(testResult);
  } catch (error) {
    throw new Error(`Dados do resultado inválidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  // Verificar se já existe um resultado para esta sessão
  const existingResult = await prisma.testResult.findFirst({
    where: { sessionId }
  });

  if (existingResult) {
    logger.warn('Resultado já existe para esta sessão', { sessionId, existingResultId: existingResult.id });
    return { resultId: existingResult.id, action: 'skipped' };
  }

  // Criar novo resultado
  const newResult = await prisma.testResult.create({
    data: {
      sessionId,
      userId,
      testId: testResult.testId,
      duration: testResult.timeSpent || 0,
      overallScore: testResult.score || 0,
      completedAt: testResult.completedAt ? new Date(testResult.completedAt) : new Date(),
      metadata: testResult.metadata || {},
    }
  });

  // Atualizar status da sessão
  await prisma.testSession.update({
    where: { id: sessionId },
    data: { 
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });

  // Invalidar cache relacionado
  await cacheService.invalidateUserResults(userId);
  if (companyId) {
    await cacheService.invalidateCompanyResults(companyId);
  }

  // Agendar jobs relacionados
  await scheduleRelatedJobs(newResult.id, userId, companyId, 'UNKNOWN');

  logger.info('Resultado do teste salvo com sucesso', {
    resultId: newResult.id,
    sessionId,
    userId
  });

  return { resultId: newResult.id, action: 'created' };
}

async function processGenerateAIAnalysis(data: GenerateAIAnalysisJobData): Promise<any> {
  const { testResultId, testType } = data;
  
  // Buscar resultado do teste
  const testResult = await prisma.testResult.findUnique({
    where: { id: testResultId }
  });

  if (!testResult) {
    throw new Error(`Resultado do teste não encontrado: ${testResultId}`);
  }

  // Verificar se já existe análise AI
  const existingAnalysis = await prisma.aIAnalysis.findFirst({
    where: { testResultId }
  });

  if (existingAnalysis) {
    logger.warn('Análise AI já existe para este resultado', { testResultId, analysisId: existingAnalysis.id });
    return { analysisId: existingAnalysis.id, action: 'skipped' };
  }

  // Gerar análise AI (implementação simplificada)
  const analysis = await generateAIAnalysis(testResult, testType);
  
  // Salvar análise
  const newAnalysis = await prisma.aIAnalysis.create({
    data: {
      testResultId,
      analysis: analysis.content,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      confidence: analysis.confidence,
      generatedAt: new Date(),
      metadata: analysis.metadata || {}
    }
  });

  // Invalidar cache
  await cacheService.invalidateTestResult(testResultId);

  logger.info('Análise AI gerada com sucesso', {
    analysisId: newAnalysis.id,
    testResultId,
    confidence: analysis.confidence
  });

  return { analysisId: newAnalysis.id, action: 'created' };
}

async function processBackupResult(data: BackupResultJobData): Promise<any> {
  const { testResultId } = data;
  
  const result = await backupService.backupTestResult(testResultId);
  
  logger.info('Backup do resultado criado', {
    testResultId,
    backupPath: result.backupPath,
    size: result.size
  });
  
  return result;
}



async function processSendNotification(data: SendNotificationJobData): Promise<any> {
  const { userId, testResultId, notificationType } = data;
  
  // Implementar envio de notificação
  // Por enquanto, apenas log
  logger.info('Notificação enviada', {
    userId,
    testResultId,
    notificationType
  });
  
  return { action: 'sent' };
}

// Funções auxiliares
async function scheduleRelatedJobs(resultId: string, userId: string, companyId: string | undefined, testType: string) {
  // Agendar geração de análise AI
  await testResultQueue.add(JobType.GENERATE_AI_ANALYSIS, {
    type: JobType.GENERATE_AI_ANALYSIS,
    testResultId: resultId,
    testType
  }, {
    delay: 1000, // 1 segundo de delay
    priority: 5
  });

  // Agendar backup
  await testResultQueue.add(JobType.BACKUP_RESULT, {
    type: JobType.BACKUP_RESULT,
    testResultId: resultId
  }, {
    delay: 5000, // 5 segundos de delay
    priority: 3
  });



  // Agendar notificação
  await testResultQueue.add(JobType.SEND_NOTIFICATION, {
    type: JobType.SEND_NOTIFICATION,
    userId,
    testResultId: resultId,
    notificationType: 'test_completed'
  }, {
    delay: 3000, // 3 segundos de delay
    priority: 2
  });
}

async function generateAIAnalysis(testResult: any, testType: string) {
  // Implementação simplificada da análise AI
  // Em produção, integrar com serviços de AI como OpenAI, Google AI, etc.
  
  const insights = [
    `Pontuação obtida: ${testResult.score}/${testResult.maxScore} (${testResult.percentage}%)`,
    `Tempo gasto: ${Math.round(testResult.timeSpent / 60)} minutos`,
    `Status: ${testResult.status}`
  ];
  
  const recommendations = [
    'Continue praticando para melhorar seus resultados',
    'Foque nas áreas com menor pontuação',
    'Considere refazer o teste em algumas semanas'
  ];
  
  return {
    content: `Análise detalhada do teste ${testType}`,
    insights,
    recommendations,
    confidence: 0.85,
    metadata: {
      generatedBy: 'HumaniQ AI',
      version: '1.0',
      timestamp: new Date().toISOString()
    }
  };
}

async function updateUserStatistics(userId: string, testType: string) {
  // Implementar atualização de estatísticas do usuário
  // Por enquanto, apenas log
  logger.info('Atualizando estatísticas do usuário', { userId, testType });
}

async function updateCompanyStatistics(companyId: string, testType: string) {
  // Implementar atualização de estatísticas da empresa
  // Por enquanto, apenas log
  logger.info('Atualizando estatísticas da empresa', { companyId, testType });
}

// Event listeners para monitoramento
testResultWorker.on('completed', (job) => {
  logger.info('Job completado', { jobId: job.id, jobType: job.data.type });
});

testResultWorker.on('failed', (job, err) => {
  logger.error('Job falhou', {
    jobId: job?.id,
    jobType: job?.data?.type,
    error: err.message,
    stack: err.stack
  });
});

testResultWorker.on('stalled', (jobId) => {
  logger.warn('Job travado', { jobId });
});

// Funções de utilidade para adicionar jobs à fila
export const queueService = {
  async addSaveTestResultJob(data: Omit<SaveTestResultJobData, 'type'>) {
    return await testResultQueue.add(JobType.SAVE_TEST_RESULT, {
      type: JobType.SAVE_TEST_RESULT,
      ...data
    }, {
      priority: 10, // Alta prioridade
      attempts: 5
    });
  },

  async addGenerateAIAnalysisJob(data: Omit<GenerateAIAnalysisJobData, 'type'>) {
    return await testResultQueue.add(JobType.GENERATE_AI_ANALYSIS, {
      type: JobType.GENERATE_AI_ANALYSIS,
      ...data
    }, {
      priority: 5,
      delay: 1000
    });
  },

  async getQueueStats() {
    const waiting = await testResultQueue.getWaiting();
    const active = await testResultQueue.getActive();
    const completed = await testResultQueue.getCompleted();
    const failed = await testResultQueue.getFailed();
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    };
  },

  async cleanQueue() {
    await testResultQueue.clean(24 * 60 * 60 * 1000, 100); // Limpar jobs antigos
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Encerrando worker graciosamente...');
  await testResultWorker.close();
  await testResultQueue.close();
  await prisma.$disconnect();
});

export default testResultQueue;