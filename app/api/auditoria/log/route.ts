import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getAuditLogs,
  AcaoAuditoria,
  NivelSeguranca,
  auditMiddleware
} from '@/lib/audit';
import { z } from 'zod';

// Schema de validação para consulta de logs
const auditQuerySchema = z.object({
  acao: z.nativeEnum(AcaoAuditoria).optional(),
  nivelSeguranca: z.nativeEnum(NivelSeguranca).optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  userId: z.string().optional() // Apenas para administradores
});

/**
 * Verifica se o usuário tem permissão de administrador
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const userPermissions = await prisma.userPermission.findMany({
      where: { userId }
    });
    
    return userPermissions.some(up => 
      up.permission === 'ADMIN' || 
      up.permission === 'AUDIT_VIEW'
    );
  } catch (error) {
    console.error('❌ Erro ao verificar permissões do usuário:', error);
    return false;
  }
}

/**
 * GET /api/auditoria/log
 * Consulta logs de auditoria com filtros
 */
export async function GET(request: NextRequest) {
  let auditLog: any;
  
  try {
    // Inicializa auditoria
    auditLog = await auditMiddleware(
      request, 
      AcaoAuditoria.CONSULTA_RESULTADO
    );
    
    const { searchParams } = new URL(request.url);
    
    // Valida parâmetros de consulta
    const queryParams = {
      acao: searchParams.get('acao'),
      nivelSeguranca: searchParams.get('nivelSeguranca'),
      dataInicio: searchParams.get('dataInicio'),
      dataFim: searchParams.get('dataFim'),
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      userId: searchParams.get('userId')
    };
    
    const validatedParams = auditQuerySchema.parse(queryParams);
    
    // Verifica permissões do usuário
    const isAdmin = await isUserAdmin(auditLog.userId);
    
    // Define filtros baseados nas permissões
    let targetUserId: string | undefined;
    
    if (isAdmin) {
      // Administradores podem consultar logs de qualquer usuário
      targetUserId = validatedParams.userId;
    } else {
      // Usuários comuns só podem ver seus próprios logs
      targetUserId = auditLog.userId;
    }
    
    const page = parseInt(validatedParams.page || '1');
    const limit = Math.min(parseInt(validatedParams.limit || '20'), 100); // Máximo 100 por página
    
    // Constrói filtros de data
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (validatedParams.dataInicio) {
      startDate = new Date(validatedParams.dataInicio);
    }
    
    if (validatedParams.dataFim) {
      endDate = new Date(validatedParams.dataFim);
    }
    
    // Busca logs de auditoria
    const result = await getAuditLogs({
      userId: targetUserId,
      acao: validatedParams.acao,
      nivelSeguranca: validatedParams.nivelSeguranca,
      startDate,
      endDate,
      page,
      limit
    });
    
    // Processa logs para retorno (remove dados sensíveis se necessário)
    const logsProcessados = result.logs.map(log => {
      const logProcessado: any = {
        idEvento: log.idEvento,
        idUsuario: log.idUsuario,
        acao: log.acao,
        dataEvento: log.dataEvento,
        ipOrigem: isAdmin ? log.ipOrigem : log.ipOrigem.replace(/\d+$/, 'xxx'), // Mascara IP para não-admins
        nivelSeguranca: log.nivelSeguranca,
        usuario: {
          email: log.usuario.email,
          firstName: log.usuario.firstName,
          lastName: log.usuario.lastName
        }
      };
      
      // Adiciona informações do dispositivo (sem dados sensíveis)
      if (log.dispositivo) {
        try {
          const dispositivo = JSON.parse(log.dispositivo);
          logProcessado.dispositivo = {
            platform: dispositivo.platform,
            language: dispositivo.language,
            timezone: dispositivo.timezone
          };
        } catch (error) {
          logProcessado.dispositivo = null;
        }
      }
      
      // Adiciona metadata do evento (filtrada)
      if (log.metadataEvento) {
        try {
          const metadata = JSON.parse(log.metadataEvento);
          logProcessado.metadataEvento = {
            endpoint: metadata.endpoint,
            method: metadata.method,
            statusCode: metadata.statusCode,
            duration: metadata.duration,
            errorMessage: metadata.errorMessage
          };
        } catch (error) {
          logProcessado.metadataEvento = null;
        }
      }
      
      // Adiciona informações do resultado se disponível
      if (log.resultado) {
        logProcessado.resultado = {
          idResultado: log.resultado.idResultado,
          tipoTeste: log.resultado.tipoTeste,
          dataCriacao: log.resultado.dataCriacao
        };
      }
      
      return logProcessado;
    });
    
    // Finaliza auditoria com sucesso
    await auditLog.finishLog(true, { 
      logCount: logsProcessados.length,
      isAdminQuery: isAdmin 
    });
    
    return NextResponse.json({
      success: true,
      data: {
        logs: logsProcessados,
        pagination: result.pagination,
        isAdmin,
        filtros: {
          acao: validatedParams.acao,
          nivelSeguranca: validatedParams.nivelSeguranca,
          dataInicio: validatedParams.dataInicio,
          dataFim: validatedParams.dataFim,
          userId: isAdmin ? validatedParams.userId : undefined
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao consultar logs de auditoria:', error);
    
    // Finaliza auditoria com erro
    if (auditLog) {
      await auditLog.finishLog(false, null, error as Error);
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

/**
 * GET /api/auditoria/log/stats
 * Estatísticas de auditoria para dashboard
 */
export async function POST(request: NextRequest) {
  let auditLog: any;
  
  try {
    // Inicializa auditoria
    auditLog = await auditMiddleware(
      request, 
      AcaoAuditoria.CONSULTA_RESULTADO
    );
    
    // Verifica se é administrador
    const isAdmin = await isUserAdmin(auditLog.userId);
    
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Acesso negado - permissão de administrador necessária'
      }, { status: 403 });
    }
    
    const { prisma } = await import('@/lib/prisma');
    
    // Período padrão: últimos 30 dias
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - 30);
    
    // Estatísticas gerais
    const [totalEventos, eventosPorAcao, eventosPorNivel, eventosRecentes] = await Promise.all([
      // Total de eventos no período
      prisma.humaniqAuditoria.count({
        where: {
          dataEvento: { gte: dataInicio }
        }
      }),
      
      // Eventos por ação
      prisma.humaniqAuditoria.groupBy({
        by: ['acao'],
        where: {
          dataEvento: { gte: dataInicio }
        },
        _count: { acao: true },
        orderBy: { _count: { acao: 'desc' } }
      }),
      
      // Eventos por nível de segurança
      prisma.humaniqAuditoria.groupBy({
        by: ['nivelSeguranca'],
        where: {
          dataEvento: { gte: dataInicio }
        },
        _count: { nivelSeguranca: true },
        orderBy: { _count: { nivelSeguranca: 'desc' } }
      }),
      
      // Eventos recentes (últimas 24h)
      prisma.humaniqAuditoria.count({
        where: {
          dataEvento: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);
    
    // Usuários mais ativos
    const usuariosAtivos = await prisma.humaniqAuditoria.groupBy({
      by: ['idUsuario'],
      where: {
        dataEvento: { gte: dataInicio }
      },
      _count: { idUsuario: true },
      orderBy: { _count: { idUsuario: 'desc' } },
      take: 10
    });
    
    // Busca informações dos usuários mais ativos
    const usuariosInfo = await prisma.user.findMany({
      where: {
        id: { in: usuariosAtivos.map(u => u.idUsuario) }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });
    
    const usuariosComContagem = usuariosAtivos.map(ua => {
      const usuario = usuariosInfo.find(u => u.id === ua.idUsuario);
      return {
        usuario: usuario || { id: ua.idUsuario, email: 'Usuário não encontrado' },
        totalEventos: ua._count.idUsuario
      };
    });
    
    // Finaliza auditoria com sucesso
    await auditLog.finishLog(true, { statsGenerated: true });
    
    return NextResponse.json({
      success: true,
      data: {
        periodo: {
          inicio: dataInicio.toISOString(),
          fim: new Date().toISOString()
        },
        estatisticas: {
          totalEventos,
          eventosRecentes,
          eventosPorAcao: eventosPorAcao.map(e => ({
            acao: e.acao,
            total: e._count.acao
          })),
          eventosPorNivel: eventosPorNivel.map(e => ({
            nivel: e.nivelSeguranca,
            total: e._count.nivelSeguranca
          })),
          usuariosMaisAtivos: usuariosComContagem
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar estatísticas de auditoria:', error);
    
    // Finaliza auditoria com erro
    if (auditLog) {
      await auditLog.finishLog(false, null, error as Error);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}