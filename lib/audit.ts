import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Tipos de ação para auditoria LGPD
 */
export enum AcaoAuditoria {
  ARMAZENAMENTO_RESULTADO = 'ARMAZENAMENTO_RESULTADO',
  CONSULTA_RESULTADO = 'CONSULTA_RESULTADO',
  EXPORTACAO_DADOS = 'EXPORTACAO_DADOS',
  TENTATIVA_ACESSO_NAO_AUTORIZADO = 'TENTATIVA_ACESSO_NAO_AUTORIZADO',
  LOGIN_USUARIO = 'LOGIN_USUARIO',
  LOGOUT_USUARIO = 'LOGOUT_USUARIO',
  MODIFICACAO_DADOS = 'MODIFICACAO_DADOS',
  EXCLUSAO_DADOS = 'EXCLUSAO_DADOS'
}

/**
 * Níveis de segurança para eventos de auditoria
 */
export enum NivelSeguranca {
  BAIXO = 'BAIXO',
  NORMAL = 'NORMAL',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO'
}

/**
 * Interface para dados do dispositivo
 */
export interface DispositivoInfo {
  userAgent: string;
  platform?: string;
  language?: string;
  screen?: {
    width: number;
    height: number;
  };
  timezone?: string;
}

/**
 * Interface para metadata de eventos
 */
export interface MetadataEvento {
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  errorMessage?: string;
  additionalData?: Record<string, any>;
}

/**
 * Parâmetros para registro de auditoria
 */
export interface AuditLogParams {
  idUsuario: string;
  acao: AcaoAuditoria;
  ipOrigem: string;
  dispositivo?: DispositivoInfo;
  idResultado?: string;
  metadataEvento?: MetadataEvento;
  nivelSeguranca?: NivelSeguranca;
}

/**
 * Extrai informações do dispositivo a partir do request
 * @param request - Request do Next.js
 * @returns Informações do dispositivo
 */
export function extractDeviceInfo(request: NextRequest): DispositivoInfo {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const acceptLanguage = request.headers.get('accept-language');
  
  return {
    userAgent,
    language: acceptLanguage?.split(',')[0] || 'pt-BR',
    platform: getPlatformFromUserAgent(userAgent),
    timezone: request.headers.get('x-timezone') || 'America/Sao_Paulo'
  };
}

/**
 * Extrai plataforma do User-Agent
 * @param userAgent - String do User-Agent
 * @returns Nome da plataforma
 */
function getPlatformFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}

/**
 * Obtém o IP real do cliente
 * @param request - Request do Next.js
 * @returns Endereço IP do cliente
 */
export function getClientIP(request: NextRequest): string {
  // Verifica headers de proxy
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Fallback para desenvolvimento
  return request.ip || '127.0.0.1';
}

/**
 * Registra um evento de auditoria no banco de dados
 * @param params - Parâmetros do evento de auditoria
 * @returns ID do evento criado
 */
export async function logAuditEvent(params: AuditLogParams): Promise<string> {
  try {
    const evento = await prisma.humaniqAuditoria.create({
      data: {
        idUsuario: params.idUsuario,
        acao: params.acao,
        ipOrigem: params.ipOrigem,
        dispositivo: params.dispositivo ? JSON.stringify(params.dispositivo) : null,
        idResultado: params.idResultado || null,
        metadataEvento: params.metadataEvento ? JSON.stringify(params.metadataEvento) : null,
        nivelSeguranca: params.nivelSeguranca || NivelSeguranca.NORMAL
      }
    });
    
    console.log(`✅ Evento de auditoria registrado: ${params.acao} - Usuário: ${params.idUsuario}`);
    return evento.idEvento;
  } catch (error) {
    console.error('❌ Erro ao registrar evento de auditoria:', error);
    throw new Error('Falha no registro de auditoria');
  }
}

/**
 * Middleware de auditoria para APIs
 * @param request - Request do Next.js
 * @param acao - Ação sendo realizada
 * @param additionalData - Dados adicionais para o log
 * @returns Função para finalizar o log com resultado
 */
export async function auditMiddleware(
  request: NextRequest,
  acao: AcaoAuditoria,
  additionalData?: Record<string, any>
) {
  const startTime = Date.now();
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  // Obtém sessão do usuário
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    // Registra tentativa de acesso não autorizado
    await logAuditEvent({
      idUsuario: 'anonymous',
      acao: AcaoAuditoria.TENTATIVA_ACESSO_NAO_AUTORIZADO,
      ipOrigem,
      dispositivo,
      nivelSeguranca: NivelSeguranca.ALTO,
      metadataEvento: {
        endpoint: request.nextUrl.pathname,
        method: request.method,
        errorMessage: 'Usuário não autenticado',
        additionalData
      }
    });
    
    throw new Error('Acesso não autorizado');
  }
  
  const idUsuario = session.user.id;
  
  // Função para finalizar o log
  return {
    finishLog: async (success: boolean, result?: any, error?: Error) => {
      const duration = Date.now() - startTime;
      
      const metadata: MetadataEvento = {
        endpoint: request.nextUrl.pathname,
        method: request.method,
        duration,
        statusCode: success ? 200 : 500,
        additionalData
      };
      
      if (error) {
        metadata.errorMessage = error.message;
      }
      
      const nivelSeguranca = success ? NivelSeguranca.NORMAL : NivelSeguranca.ALTO;
      
      await logAuditEvent({
        idUsuario,
        acao,
        ipOrigem,
        dispositivo,
        metadataEvento: metadata,
        nivelSeguranca,
        idResultado: result?.idResultado
      });
    },
    userId: idUsuario,
    ipOrigem,
    dispositivo
  };
}

/**
 * Registra login do usuário
 * @param request - Request do Next.js
 * @param userId - ID do usuário
 * @param success - Se o login foi bem-sucedido
 */
export async function logUserLogin(
  request: NextRequest,
  userId: string,
  success: boolean = true
): Promise<void> {
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  await logAuditEvent({
    idUsuario: userId,
    acao: AcaoAuditoria.LOGIN_USUARIO,
    ipOrigem,
    dispositivo,
    nivelSeguranca: success ? NivelSeguranca.NORMAL : NivelSeguranca.ALTO,
    metadataEvento: {
      statusCode: success ? 200 : 401,
      errorMessage: success ? undefined : 'Falha na autenticação'
    }
  });
}

/**
 * Registra logout do usuário
 * @param request - Request do Next.js
 * @param userId - ID do usuário
 */
export async function logUserLogout(
  request: NextRequest,
  userId: string
): Promise<void> {
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  await logAuditEvent({
    idUsuario: userId,
    acao: AcaoAuditoria.LOGOUT_USUARIO,
    ipOrigem,
    dispositivo,
    nivelSeguranca: NivelSeguranca.NORMAL
  });
}

/**
 * Registra armazenamento de resultado
 * @param request - Request do Next.js
 * @param userId - ID do usuário
 * @param resultId - ID do resultado
 * @param testType - Tipo do teste
 */
export async function logResultStorage(
  request: NextRequest,
  userId: string,
  resultId: string,
  testType: string
): Promise<void> {
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  await logAuditEvent({
    idUsuario: userId,
    acao: AcaoAuditoria.ARMAZENAMENTO_RESULTADO,
    ipOrigem,
    dispositivo,
    idResultado: resultId,
    nivelSeguranca: NivelSeguranca.NORMAL,
    metadataEvento: {
      additionalData: { testType }
    }
  });
}

/**
 * Registra consulta de resultados
 * @param request - Request do Next.js
 * @param userId - ID do usuário
 * @param filters - Filtros aplicados na consulta
 */
export async function logResultQuery(
  request: NextRequest,
  userId: string,
  filters?: Record<string, any>
): Promise<void> {
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  await logAuditEvent({
    idUsuario: userId,
    acao: AcaoAuditoria.CONSULTA_RESULTADO,
    ipOrigem,
    dispositivo,
    nivelSeguranca: NivelSeguranca.NORMAL,
    metadataEvento: {
      additionalData: { filters }
    }
  });
}

/**
 * Registra exportação de dados
 * @param request - Request do Next.js
 * @param userId - ID do usuário
 * @param exportFormat - Formato da exportação
 * @param resultIds - IDs dos resultados exportados
 */
export async function logDataExport(
  request: NextRequest,
  userId: string,
  exportFormat: string,
  resultIds?: string[]
): Promise<void> {
  const ipOrigem = getClientIP(request);
  const dispositivo = extractDeviceInfo(request);
  
  await logAuditEvent({
    idUsuario: userId,
    acao: AcaoAuditoria.EXPORTACAO_DADOS,
    ipOrigem,
    dispositivo,
    nivelSeguranca: NivelSeguranca.ALTO, // Exportação é considerada alta segurança
    metadataEvento: {
      additionalData: {
        exportFormat,
        resultCount: resultIds?.length || 0,
        resultIds: resultIds?.slice(0, 10) // Limita para evitar logs muito grandes
      }
    }
  });
}

/**
 * Busca logs de auditoria com filtros
 * @param userId - ID do usuário (opcional, para admin)
 * @param filters - Filtros de busca
 * @returns Lista de eventos de auditoria
 */
export async function getAuditLogs({
  userId,
  acao,
  startDate,
  endDate,
  nivelSeguranca,
  page = 1,
  limit = 50
}: {
  userId?: string;
  acao?: AcaoAuditoria;
  startDate?: Date;
  endDate?: Date;
  nivelSeguranca?: NivelSeguranca;
  page?: number;
  limit?: number;
}) {
  const where: any = {};
  
  if (userId) where.idUsuario = userId;
  if (acao) where.acao = acao;
  if (nivelSeguranca) where.nivelSeguranca = nivelSeguranca;
  
  if (startDate || endDate) {
    where.dataEvento = {};
    if (startDate) where.dataEvento.gte = startDate;
    if (endDate) where.dataEvento.lte = endDate;
  }
  
  const [logs, total] = await Promise.all([
    prisma.humaniqAuditoria.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        resultado: {
          select: {
            idResultado: true,
            tipoTeste: true,
            dataCriacao: true
          }
        }
      },
      orderBy: { dataEvento: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.humaniqAuditoria.count({ where })
  ]);
  
  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}