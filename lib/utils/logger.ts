// @ts-ignore - Winston é opcional
let winston: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  winston = require('winston');
} catch (_e) {
  console.warn('Winston não encontrado. Usando console como logger.');
  winston = {
    createLogger: () => ({ info: console.log, warn: console.warn, error: console.error, debug: console.debug }),
    format: { combine: () => undefined, timestamp: () => undefined, errors: () => undefined, json: () => undefined, prettyPrint: () => undefined, colorize: () => undefined, printf: (f: any) => f },
    transports: { Console: class { constructor() {} }, File: class { constructor() {} } },
  };
}
const { createLogger, format, transports } = winston;
import path from 'path';
import fs from 'fs';

// Criar diretório de logs se não existir
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuração do formato de log
const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.errors({ stack: true }),
  format.json(),
  format.prettyPrint()
);

// Configuração do formato para console
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format: 'HH:mm:ss'
  }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = ` ${JSON.stringify(meta)}`;
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Criar logger principal
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'humaniq-test-results',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport
    new transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),
    
    // Arquivo para todos os logs
    new transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Arquivo apenas para erros
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Arquivo para logs de performance
    new transports.File({
      filename: path.join(logsDir, 'performance.log'),
      level: 'info',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
      tailable: true,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format((info) => {
          // Filtrar apenas logs de performance
          return info.category === 'performance' ? info : false;
        })()
      )
    })
  ],
  
  // Tratamento de exceções não capturadas
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  
  // Tratamento de rejeições não capturadas
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Logger específico para performance
export const performanceLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: {
    category: 'performance',
    service: 'humaniq-test-results'
  },
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'performance.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    })
  ]
});

// Logger específico para auditoria
export const auditLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: {
    category: 'audit',
    service: 'humaniq-test-results'
  },
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'audit.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10
    })
  ]
});

// Logger específico para segurança
export const securityLogger = createLogger({
  level: 'warn',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: {
    category: 'security',
    service: 'humaniq-test-results'
  },
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'security.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10
    })
  ]
});

// Funções utilitárias para logging estruturado
export const logUtils = {
  // Log de performance de operações
  logPerformance(operation: string, duration: number, metadata?: any) {
    performanceLogger.info('Performance metric', {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  },

  // Log de auditoria para ações importantes
  logAudit(action: string, userId: string, details?: any) {
    auditLogger.info('Audit event', {
      action,
      userId,
      timestamp: new Date().toISOString(),
      details
    });
  },

  // Log de segurança para eventos suspeitos
  logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: any) {
    securityLogger.warn('Security event', {
      event,
      severity,
      timestamp: new Date().toISOString(),
      details
    });
  },

  // Log de erro com contexto
  logError(error: Error, context?: any) {
    logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  },

  // Log de operação de banco de dados
  logDatabaseOperation(operation: string, table: string, duration: number, success: boolean, details?: any) {
    logger.info('Database operation', {
      operation,
      table,
      duration,
      success,
      timestamp: new Date().toISOString(),
      details
    });
  },

  // Log de operação de cache
  logCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, duration?: number) {
    performanceLogger.info('Cache operation', {
      operation,
      key,
      duration,
      timestamp: new Date().toISOString()
    });
  },

  // Log de operação de fila
  logQueueOperation(operation: string, jobType: string, jobId: string, status: 'started' | 'completed' | 'failed', duration?: number, error?: string) {
    logger.info('Queue operation', {
      operation,
      jobType,
      jobId,
      status,
      duration,
      error,
      timestamp: new Date().toISOString()
    });
  },

  // Log de requisição HTTP
  logHttpRequest(method: string, url: string, statusCode: number, duration: number, userId?: string, userAgent?: string) {
    logger.info('HTTP request', {
      method,
      url,
      statusCode,
      duration,
      userId,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },

  // Log de backup
  logBackupOperation(operation: string, type: string, size?: number, success?: boolean, error?: string) {
    logger.info('Backup operation', {
      operation,
      type,
      size,
      success,
      error,
      timestamp: new Date().toISOString()
    });
  }
};

// Middleware para logging de requisições Express
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logUtils.logHttpRequest(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      req.user?.id,
      req.get('User-Agent')
    );
  });
  
  next();
};

// Função para configurar logs em produção
export const configureProductionLogging = () => {
  if (process.env.NODE_ENV === 'production') {
    // Adicionar transports específicos para produção
    // Por exemplo, envio para serviços externos como Loggly, Papertrail, etc.
    
    // Exemplo com transporte HTTP (descomentado quando necessário)
    /*
    logger.add(new transports.Http({
      host: 'logs.example.com',
      port: 80,
      path: '/logs'
    }));
    */
  }
};

// Configurar logging baseado no ambiente
if (process.env.NODE_ENV === 'production') {
  configureProductionLogging();
}

// Exportar logger padrão
export default logger;