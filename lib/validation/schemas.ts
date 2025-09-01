import { z } from 'zod';

// Schema base para IDs
const IdSchema = z.string().min(1, 'ID é obrigatório');

// Schema para status de teste
export const TestStatusSchema = z.enum([
  'PENDING',
  'IN_PROGRESS', 
  'COMPLETED',
  'FAILED',
  'CANCELLED'
]);

// Schema para tipos de teste
export const TestTypeSchema = z.enum([
  'GRAFOLOGIA',
  'PERSONALIDADE',
  'COGNITIVO',
  'COMPORTAMENTAL',
  'LIDERANCA',
  'VENDAS'
]);

// Schema para dados de resposta de questão
export const AnswerDataSchema = z.object({
  questionId: IdSchema,
  answer: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.record(z.any())
  ]),
  timeSpent: z.number().min(0).optional(),
  confidence: z.number().min(0).max(100).optional(),
});

// Schema para resultado de teste completo
export const TestResultSchema = z.object({
  id: IdSchema.optional(),
  userId: IdSchema,
  testId: IdSchema,
  sessionId: IdSchema,
  score: z.number().min(0).max(100),
  percentage: z.number().min(0).max(100),
  status: TestStatusSchema,
  answers: z.array(AnswerDataSchema),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  timeSpent: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional(),
  aiAnalysisId: IdSchema.optional(),
});

// Schema para dados de análise de IA
export const AIAnalysisSchema = z.object({
  id: IdSchema.optional(),
  testResultId: IdSchema,
  analysis: z.string().min(1, 'Análise é obrigatória'),
  insights: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(100).optional(),
  processingTime: z.number().min(0).optional(),
  model: z.string().optional(),
  version: z.string().optional(),
  createdAt: z.date().optional(),
});

// Schema para query de resultados
export const ResultsQuerySchema = z.object({
  userId: IdSchema.optional(),
  testType: TestTypeSchema.optional(),
  status: TestStatusSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().optional(),
  includeAI: z.boolean().default(true),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'score', 'completedAt', 'testType']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Schema para estatísticas
export const StatisticsSchema = z.object({
  totalTests: z.number().min(0),
  completedTests: z.number().min(0),
  averageScore: z.number().min(0).max(100),
  completionRate: z.number().min(0).max(100),
  aiAnalyses: z.number().min(0),
  testsByType: z.record(z.number().min(0)),
  scoreDistribution: z.record(z.number().min(0)),
  timeSpentAverage: z.number().min(0).optional(),
});

// Schema para paginação
export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  totalPages: z.number().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Schema para resposta da API de resultados
export const ResultsResponseSchema = z.object({
  results: z.array(TestResultSchema),
  statistics: StatisticsSchema,
  pagination: PaginationSchema,
  filters: z.object({
    availableTestTypes: z.array(TestTypeSchema),
    availableStatuses: z.array(TestStatusSchema),
    dateRange: z.object({
      min: z.date(),
      max: z.date(),
    }).optional(),
  }),
});

// Schema para dados de fila
export const QueueJobDataSchema = z.object({
  type: z.enum(['SAVE_RESULT', 'GENERATE_AI_ANALYSIS', 'BACKUP_RESULT', 'SEND_NOTIFICATION']),
  testResultId: IdSchema,
  userId: IdSchema,
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  metadata: z.record(z.any()).optional(),
  retryCount: z.number().min(0).default(0),
  maxRetries: z.number().min(0).default(3),
});

// Schema para métricas de performance
export const PerformanceMetricsSchema = z.object({
  timestamp: z.date(),
  operation: z.string(),
  duration: z.number().min(0),
  success: z.boolean(),
  errorMessage: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema para health check
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.date(),
  services: z.object({
    database: z.boolean(),
    redis: z.boolean(),
    queue: z.boolean(),
    ai: z.boolean().optional(),
  }),
  metrics: z.object({
    responseTime: z.number().min(0),
    memoryUsage: z.number().min(0),
    cpuUsage: z.number().min(0).max(100),
    activeConnections: z.number().min(0),
  }).optional(),
});

// Schema para backup de resultado
export const BackupResultSchema = z.object({
  id: IdSchema,
  originalId: IdSchema,
  data: TestResultSchema,
  aiAnalysis: AIAnalysisSchema.optional(),
  backupDate: z.date(),
  version: z.string(),
  checksum: z.string(),
  compressed: z.boolean().default(false),
});

// Schema para configuração de cache
export const CacheConfigSchema = z.object({
  key: z.string().min(1),
  ttl: z.number().min(0),
  tags: z.array(z.string()).optional(),
  compress: z.boolean().default(false),
  version: z.string().optional(),
});

// Tipos TypeScript derivados dos schemas
export type TestResult = z.infer<typeof TestResultSchema>;
export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;
export type ResultsQuery = z.infer<typeof ResultsQuerySchema>;
export type Statistics = z.infer<typeof StatisticsSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ResultsResponse = z.infer<typeof ResultsResponseSchema>;
export type QueueJobData = z.infer<typeof QueueJobDataSchema>;
export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type BackupResult = z.infer<typeof BackupResultSchema>;
export type CacheConfig = z.infer<typeof CacheConfigSchema>;
export type TestStatus = z.infer<typeof TestStatusSchema>;
export type TestType = z.infer<typeof TestTypeSchema>;
export type AnswerData = z.infer<typeof AnswerDataSchema>;

// Funções de validação com tratamento de erro
export const validateTestResult = (data: unknown): TestResult => {
  try {
    return TestResultSchema.parse(data);
  } catch (error) {
    console.error('Erro na validação do resultado do teste:', error);
    throw new Error('Dados do resultado do teste inválidos');
  }
};

export const validateResultsQuery = (data: unknown): ResultsQuery => {
  try {
    return ResultsQuerySchema.parse(data);
  } catch (error) {
    console.error('Erro na validação da query de resultados:', error);
    throw new Error('Parâmetros de consulta inválidos');
  }
};

export const validateQueueJobData = (data: unknown): QueueJobData => {
  try {
    return QueueJobDataSchema.parse(data);
  } catch (error) {
    console.error('Erro na validação dos dados da fila:', error);
    throw new Error('Dados da fila inválidos');
  }
};

export const validateAIAnalysis = (data: unknown): AIAnalysis => {
  try {
    return AIAnalysisSchema.parse(data);
  } catch (error) {
    console.error('Erro na validação da análise de IA:', error);
    throw new Error('Dados da análise de IA inválidos');
  }
};

export const validateBackupResult = (data: unknown): BackupResult => {
  try {
    return BackupResultSchema.parse(data);
  } catch (error) {
    console.error('Erro na validação do backup:', error);
    throw new Error('Dados do backup inválidos');
  }
};

// Schemas parciais para atualizações
export const PartialTestResultSchema = TestResultSchema.partial();
export const PartialAIAnalysisSchema = AIAnalysisSchema.partial();

export type PartialTestResult = z.infer<typeof PartialTestResultSchema>;
export type PartialAIAnalysis = z.infer<typeof PartialAIAnalysisSchema>;