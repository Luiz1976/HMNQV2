import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { testResultQueue } from '../queue/testResultQueue';
import { logger, logUtils } from '../utils/logger';
import { performanceMonitor } from '../monitoring/performance';
import { cacheService } from '../cache/cacheService';
import { backupService, BackupType } from '../backup/backupService';
import { validateTestResult, validateQueueJobData } from '../validation/schemas';

const prisma = new PrismaClient();

// Interface para dados de interceptação
interface TestInterceptionContext {
  sessionId: string;
  userId: string;
  testId: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

// Interface para resultado de interceptação
interface InterceptionResult {
  success: boolean;
  testResultId?: string;
  queueJobId?: string;
  backupScheduled: boolean;
  cacheInvalidated: boolean;
  duration: number;
  error?: string;
}

// Classe principal do interceptador
class TestInterceptor {
  private interceptedSessions = new Set<string>();
  private processingQueue = new Map<string, Promise<InterceptionResult>>();

  // Middleware principal de interceptação
  async interceptTestCompletion(
    request: NextRequest,
    context: TestInterceptionContext
  ): Promise<InterceptionResult> {
    const start = Date.now();
    const { sessionId, userId, testId } = context;

    // Evitar processamento duplicado
    if (this.interceptedSessions.has(sessionId)) {
      logger.debug('Sessão já interceptada, ignorando', { sessionId });
      return {
        success: true,
        backupScheduled: false,
        cacheInvalidated: false,
        duration: Date.now() - start
      };
    }

    // Verificar se já está sendo processado
    const existingProcess = this.processingQueue.get(sessionId);
    if (existingProcess) {
      logger.debug('Sessão já em processamento, aguardando', { sessionId });
      return await existingProcess;
    }

    // Iniciar processamento
    const processingPromise = this.processTestCompletion(context, start);
    this.processingQueue.set(sessionId, processingPromise);

    try {
      const result = await processingPromise;
      this.interceptedSessions.add(sessionId);
      return result;
    } finally {
      this.processingQueue.delete(sessionId);
      
      // Limpar sessão interceptada após 1 hora
      setTimeout(() => {
        this.interceptedSessions.delete(sessionId);
      }, 60 * 60 * 1000);
    }
  }

  // Processar conclusão do teste
  private async processTestCompletion(
    context: TestInterceptionContext,
    startTime: number
  ): Promise<InterceptionResult> {
    const { sessionId, userId, testId } = context;

    try {
      // 1. Verificar se a sessão está realmente completa
      const session = await prisma.testSession.findUnique({
        where: { id: sessionId },
        include: {
          test: true,
          user: true,
          answers: {
            include: {
              question: true
            }
          }
        }
      });

      if (!session) {
        throw new Error(`Sessão não encontrada: ${sessionId}`);
      }

      if (session.status !== 'COMPLETED') {
        logger.debug('Sessão ainda não está completa', {
          sessionId,
          status: session.status
        });
        return {
          success: false,
          backupScheduled: false,
          cacheInvalidated: false,
          duration: Date.now() - startTime,
          error: 'Sessão não está completa'
        };
      }

      // 2. Verificar se já existe resultado para esta sessão
      const existingResult = await prisma.testResult.findFirst({
        where: { sessionId }
      });

      if (existingResult) {
        logger.debug('Resultado já existe para esta sessão', {
          sessionId,
          testResultId: existingResult.id
        });
        return {
          success: true,
          testResultId: existingResult.id,
          backupScheduled: false,
          cacheInvalidated: false,
          duration: Date.now() - startTime
        };
      }

      // 3. Calcular pontuação do teste
      const score = this.calculateTestScore(session.answers, session.test);
      
      // 4. Criar resultado do teste
      const testResult = await prisma.testResult.create({
        data: {
          userId,
          testId,
          sessionId,
          duration: session.completedAt && session.startedAt 
            ? Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / 1000)
            : 0,
          overallScore: score,
          completedAt: session.completedAt || new Date(),
          metadata: {
            userAgent: context.userAgent,
            ipAddress: context.ipAddress,
            interceptedAt: new Date().toISOString(),
            totalQuestions: session.answers.length,
            sessionDuration: session.completedAt && session.startedAt 
              ? session.completedAt.getTime() - session.startedAt.getTime()
              : null
          }
        }
      });

      // Validar dados do resultado
      try {
        validateTestResult({
          id: testResult.id,
          userId: testResult.userId,
          testId: testResult.testId,
          sessionId: testResult.sessionId,
          duration: testResult.duration,
          overallScore: testResult.overallScore,
          completedAt: testResult.completedAt,
          createdAt: testResult.createdAt,
          updatedAt: testResult.updatedAt,
          metadata: testResult.metadata
        });
      } catch (validationError) {
        logger.warn('Dados do resultado não passaram na validação', {
          testResultId: testResult.id,
          error: validationError instanceof Error ? validationError.message : String(validationError)
        });
      }

      // 5. Adicionar jobs à fila de processamento
      const queueJobs = await this.scheduleProcessingJobs(testResult, session);
      
      // 6. Agendar backup
      backupService.addToQueue(
        BackupType.TEST_RESULT,
        { testResultId: testResult.id },
        8 // Alta prioridade
      );

      // 7. Invalidar caches relacionados
      await this.invalidateRelatedCaches(userId, testId);

      // 8. Registrar métricas
      const duration = Date.now() - startTime;
      performanceMonitor.recordMetric(
        'test_interception_duration',
        duration,
        'ms',
        {
          success: 'true',
          testId,
          userId,
          score: score.toString()
        }
      );

      // 9. Log de auditoria
      logUtils.logAudit(
        'test_completion',
        userId,
        {
          testResultId: testResult.id,
          testId,
          score,
          success: true
        }
      );

      logger.info('Teste interceptado e processado com sucesso', {
        testResultId: testResult.id,
        sessionId,
        userId,
        testId,
        score,
        duration,
        queueJobs: queueJobs.length
      });

      return {
        success: true,
        testResultId: testResult.id,
        queueJobId: queueJobs[0]?.id,
        backupScheduled: true,
        cacheInvalidated: true,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Registrar erro
      performanceMonitor.recordMetric(
        'test_interception_duration',
        duration,
        'ms',
        {
          success: 'false',
          error: errorMessage,
          testId,
          userId
        }
      );

      logUtils.logAudit(
        'test_completion_error',
        userId,
        {
          testId,
          success: false,
          error: errorMessage
        }
      );

      logger.error('Erro ao interceptar conclusão do teste', {
        error: errorMessage,
        sessionId,
        userId,
        testId,
        duration
      });

      return {
        success: false,
        backupScheduled: false,
        cacheInvalidated: false,
        duration,
        error: errorMessage
      };
    }
  }

  // Calcular pontuação do teste
  private calculateTestScore(answers: any[], test: any): number {
    if (!answers || answers.length === 0) {
      return 0;
    }

    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const answer of answers) {
      const question = answer.question;
      if (!question) continue;

      maxPossibleScore += question.maxScore || 1;

      // Calcular pontuação baseada no tipo de questão
      switch (question.type) {
        case 'MULTIPLE_CHOICE':
          if (answer.selectedOption === question.correctAnswer) {
            totalScore += question.maxScore || 1;
          }
          break;
          
        case 'SCALE':
          // Para questões de escala, a pontuação é proporcional
          const scaleValue = parseInt(answer.scaleValue || '0');
          const maxScale = question.scaleMax || 10;
          totalScore += (scaleValue / maxScale) * (question.maxScore || 1);
          break;
          
        case 'TEXT':
          // Para questões de texto, assumir pontuação máxima por enquanto
          // (pode ser refinado com análise de IA posteriormente)
          totalScore += question.maxScore || 1;
          break;
          
        default:
          // Tipo desconhecido, assumir pontuação máxima
          totalScore += question.maxScore || 1;
      }
    }

    // Retornar pontuação como percentual (0-100)
    return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  }

  // Agendar jobs de processamento na fila
  private async scheduleProcessingJobs(testResult: any, session: any) {
    const jobs = [];

    try {
      // 1. Job para salvar resultado (alta prioridade)
      const saveJob = await testResultQueue.add(
        'save_test_result',
        {
          testResultId: testResult.id,
          userId: testResult.userId,
          testId: testResult.testId,
          sessionId: testResult.sessionId,
          overallScore: testResult.overallScore,
          timestamp: new Date().toISOString()
        },
        {
          priority: 10,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        }
      );
      jobs.push(saveJob);

      // 2. Job para análise de IA (prioridade média)
      const aiAnalysisJob = await testResultQueue.add(
        'generate_ai_analysis',
        {
          testResultId: testResult.id,
          testType: session.test.type,
          answers: session.answers,
          score: testResult.score,
          timestamp: new Date().toISOString()
        },
        {
          priority: 7,
          attempts: 2,
          delay: 5000, // Aguardar 5 segundos antes de processar
          backoff: {
            type: 'exponential',
            delay: 5000
          }
        }
      );
      jobs.push(aiAnalysisJob);

      // 3. Job para atualizar estatísticas (prioridade baixa)
      const statsJob = await testResultQueue.add(
        'update_statistics',
        {
          userId: testResult.userId,
          testId: testResult.testId,
          // companyId removido - não existe no modelo TestResult
          score: testResult.score,
          timestamp: new Date().toISOString()
        },
        {
          priority: 5,
          attempts: 2,
          delay: 10000, // Aguardar 10 segundos
          backoff: {
            type: 'fixed',
            delay: 3000
          }
        }
      );
      jobs.push(statsJob);

      // 4. Job para notificação (se necessário)
      if (testResult.score >= 80) {
        const notificationJob = await testResultQueue.add(
          'send_notification',
          {
            userId: testResult.userId,
            testResultId: testResult.id,
            type: 'high_score',
            overallScore: testResult.overallScore,
            timestamp: new Date().toISOString()
          },
          {
            priority: 6,
            attempts: 2,
            delay: 15000, // Aguardar 15 segundos
            backoff: {
              type: 'fixed',
              delay: 5000
            }
          }
        );
        jobs.push(notificationJob);
      }

      logger.debug('Jobs de processamento agendados', {
        testResultId: testResult.id,
        jobCount: jobs.length,
        jobIds: jobs.map(j => j.id)
      });

      return jobs;
    } catch (error) {
      logger.error('Erro ao agendar jobs de processamento', {
        error: error instanceof Error ? error.message : String(error),
        testResultId: testResult.id
      });
      return jobs;
    }
  }

  // Invalidar caches relacionados
  private async invalidateRelatedCaches(userId: string, testId: string) {
    try {
      const cacheKeys = [
        `user_results:${userId}`,
        `test_results:${testId}`,
        `user_statistics:${userId}`,
        'available_tests',
        'test_categories'
      ];

      // Company cache invalidation removed - companyId not available

      await Promise.all([
        cacheService.delete('user_results', userId),
        cacheService.delete('test_result', testId),
        cacheService.delete('user_statistics', userId),
        cacheService.delete('available_tests', 'global'),
        cacheService.delete('test_categories', 'all')
      ]);

      logger.debug('Caches invalidados', {
        userId,
        testId,
        // companyId removido
        cacheKeys
      });
    } catch (error) {
      logger.warn('Erro ao invalidar caches', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        testId
      });
    }
  }

  // Middleware para Next.js
  createNextMiddleware() {
    return async (request: NextRequest) => {
      const url = request.nextUrl.clone();
      
      // Verificar se é uma rota de finalização de teste
      const isTestCompletionRoute = (
        url.pathname.includes('/api/test-sessions/') && 
        url.pathname.endsWith('/complete')
      ) || (
        url.pathname.includes('/api/tests/') && 
        request.method === 'POST' &&
        url.searchParams.has('action') &&
        url.searchParams.get('action') === 'complete'
      );

      if (!isTestCompletionRoute) {
        return NextResponse.next();
      }

      // Extrair contexto da requisição
      const sessionId = this.extractSessionId(url);
      const userId = request.headers.get('x-user-id') || '';
      const testId = this.extractTestId(url);
      
      if (!sessionId || !userId || !testId) {
        logger.warn('Informações insuficientes para interceptação', {
          sessionId,
          userId,
          testId,
          url: url.pathname
        });
        return NextResponse.next();
      }

      const context: TestInterceptionContext = {
        userId,
        sessionId,
        testId,
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
      };

      // Processar interceptação em background
      this.interceptTestCompletion(request, context).catch(error => {
        logger.error('Erro na interceptação em background', {
          error: error instanceof Error ? error.message : String(error),
          context
        });
      });

      // Continuar com a requisição normal
      return NextResponse.next();
    };
  }

  // Extrair ID da sessão da URL
  private extractSessionId(url: URL): string {
    const pathParts = url.pathname.split('/');
    const sessionIndex = pathParts.findIndex(part => part === 'test-sessions');
    
    if (sessionIndex !== -1 && pathParts[sessionIndex + 1]) {
      return pathParts[sessionIndex + 1];
    }

    return url.searchParams.get('sessionId') || '';
  }

  // Extrair ID do teste da URL
  private extractTestId(url: URL): string {
    const pathParts = url.pathname.split('/');
    const testIndex = pathParts.findIndex(part => part === 'tests');
    
    if (testIndex !== -1 && pathParts[testIndex + 1]) {
      return pathParts[testIndex + 1];
    }

    return url.searchParams.get('testId') || '';
  }

  // Obter estatísticas de interceptação
  getInterceptionStats() {
    return {
      interceptedSessions: this.interceptedSessions.size,
      processingQueue: this.processingQueue.size,
      timestamp: new Date().toISOString()
    };
  }

  // Limpar sessões interceptadas antigas
  clearOldInterceptions(maxAge: number = 60 * 60 * 1000) {
    // Esta implementação é simplificada
    // Em produção, você poderia armazenar timestamps e limpar baseado neles
    const sizeBefore = this.interceptedSessions.size;
    
    // Por simplicidade, limpar metade das sessões se houver muitas
    if (this.interceptedSessions.size > 1000) {
      const sessionsArray = Array.from(this.interceptedSessions);
      const toKeep = sessionsArray.slice(-500); // Manter as últimas 500
      
      this.interceptedSessions.clear();
      toKeep.forEach(session => this.interceptedSessions.add(session));
    }

    const sizeAfter = this.interceptedSessions.size;
    
    if (sizeBefore !== sizeAfter) {
      logger.info('Sessões interceptadas antigas limpas', {
        before: sizeBefore,
        after: sizeAfter,
        cleared: sizeBefore - sizeAfter
      });
    }
  }
}

// Instância singleton do interceptador
export const testInterceptor = new TestInterceptor();

// Middleware para Next.js
export const testInterceptionMiddleware = testInterceptor.createNextMiddleware();

export type { TestInterceptionContext, InterceptionResult };
export default testInterceptor;