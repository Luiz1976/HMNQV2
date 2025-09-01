import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decryptFromDatabase } from '@/lib/crypto';
import { 
  auditMiddleware, 
  AcaoAuditoria, 
  logDataExport 
} from '@/lib/audit';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import { TestType } from '@prisma/client';

// Schema de validação para exportação
const exportSchema = z.object({
  formato: z.enum(['JSON', 'CSV', 'XLSX']),
  tipoTeste: z.enum(['DISC', 'COMPETENCIAS', 'LIDERANCA', 'VENDAS', 'ATENDIMENTO']).optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  incluirMetadados: z.boolean().optional().default(false),
  resultadosIds: z.array(z.string()).optional()
});

/**
 * Interface para dados de exportação
 */
interface ExportData {
  idResultado: string;
  tipoTeste: string;
  dataCriacao: string;
  dataAtualizacao: string;
  perfil?: any;
  pontuacao?: number | Record<string, number>;
  interpretacao?: string;
  recomendacoes?: string[];
  tempoResposta?: number;
  versaoTeste?: string;
  dispositivo?: string;
  navegador?: string;
  metadata?: any;
}

/**
 * Converte dados para formato CSV
 */
function convertToCSV(data: ExportData[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = (row as any)[header];
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

/**
 * Converte dados para formato XLSX
 */
function convertToXLSX(data: ExportData[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Processa dados para exportação
 */
function processDataForExport(
  resultados: any[],
  incluirMetadados: boolean
): ExportData[] {
  return resultados.map(resultado => {
    const exportData: ExportData = {
      idResultado: resultado.id,
      tipoTeste: resultado.testType,
      dataCriacao: resultado.completedAt.toISOString(),
      dataAtualizacao: resultado.updatedAt.toISOString()
    };
    
    // Adiciona dados do resultado
    if (resultado.overallScore !== null && resultado.overallScore !== undefined) {
      exportData.pontuacao = resultado.overallScore;
    }
    
    if (resultado.dimensionScores) {
      exportData.perfil = resultado.dimensionScores;
    }
    
    if (resultado.interpretation) {
      exportData.interpretacao = resultado.interpretation;
    }
    
    if (resultado.recommendations) {
      exportData.recomendacoes = resultado.recommendations;
    }
    
    // Adiciona metadados se solicitado
    if (incluirMetadados && resultado.metadata) {
      exportData.metadata = resultado.metadata;
    }
    
    return exportData;
  });
}

/**
 * POST /api/colaborador/export
 * Exporta resultados do usuário em formato seguro
 */
export async function POST(request: NextRequest) {
  let auditLog: any;
  
  try {
    // Inicializa auditoria
    auditLog = await auditMiddleware(
      request, 
      AcaoAuditoria.EXPORTACAO_DADOS
    );
    
    const body = await request.json();
    
    // Valida dados de entrada
    const validatedData = exportSchema.parse(body);
    
    // Constrói filtros de busca
    const where: any = {
      idUsuario: auditLog.userId // Isolamento de dados por usuário
    };
    
    if (validatedData.tipoTeste) {
      where.tipoTeste = validatedData.tipoTeste;
    }
    
    if (validatedData.resultadosIds && validatedData.resultadosIds.length > 0) {
      where.idResultado = {
        in: validatedData.resultadosIds
      };
    }
    
    if (validatedData.dataInicio || validatedData.dataFim) {
      where.dataCriacao = {};
      if (validatedData.dataInicio) {
        where.dataCriacao.gte = new Date(validatedData.dataInicio);
      }
      if (validatedData.dataFim) {
        where.dataCriacao.lte = new Date(validatedData.dataFim);
      }
    }
    
    // Busca resultados para exportação (máximo 1000 registros)
    const resultados = await prisma.testResult.findMany({
      where: {
        userId: auditLog.userId,
        ...(validatedData.tipoTeste && {
          test: {
            testType: validatedData.tipoTeste as TestType,
          },
        }),
        ...(validatedData.resultadosIds && validatedData.resultadosIds.length > 0 && { id: { in: validatedData.resultadosIds } }),
        completedAt: {
          ...(validatedData.dataInicio && { gte: new Date(validatedData.dataInicio) }),
          ...(validatedData.dataFim && { lte: new Date(validatedData.dataFim) })
        }
      },
      select: {
        id: true,
        testId: true,
        completedAt: true,
        updatedAt: true,
        overallScore: true,
        dimensionScores: true,
        interpretation: true,
        recommendations: true,
        metadata: true,
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 1000 // Limite de segurança
    });
    
    if (resultados.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum resultado encontrado para exportação'
      }, { status: 404 });
    }
    
    // Processa dados dos resultados
    const resultadosProcessados = resultados.map((resultado) => {
      return {
        id: resultado.id,
        testId: resultado.testId,
        testName: resultado.test?.name || 'Teste não identificado',
        testType: resultado.test?.testType || 'unknown',
        completedAt: resultado.completedAt,
        updatedAt: resultado.updatedAt,
        overallScore: resultado.overallScore,
        dimensionScores: resultado.dimensionScores,
        interpretation: resultado.interpretation,
        recommendations: resultado.recommendations,
        metadata: resultado.metadata
      };
    });
    
    // Processa dados para exportação
    const dadosExportacao = processDataForExport(
      resultadosProcessados,
      validatedData.incluirMetadados || false
    );
    
    // Registra log específico de exportação
    await logDataExport(
      request,
      auditLog.userId,
      validatedData.formato,
      resultados.map(r => r.id)
    );
    
    // Gera arquivo conforme formato solicitado
    let responseData: any;
    let contentType: string;
    let filename: string;
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (validatedData.formato) {
      case 'JSON':
        responseData = JSON.stringify(dadosExportacao, null, 2);
        contentType = 'application/json';
        filename = `resultados_${timestamp}.json`;
        break;
        
      case 'CSV':
        responseData = convertToCSV(dadosExportacao);
        contentType = 'text/csv';
        filename = `resultados_${timestamp}.csv`;
        break;
        
      case 'XLSX':
        responseData = convertToXLSX(dadosExportacao);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `resultados_${timestamp}.xlsx`;
        break;
        
      default:
        throw new Error('Formato de exportação não suportado');
    }
    
    // Finaliza auditoria com sucesso
    await auditLog.finishLog(true, { 
      exportFormat: validatedData.formato,
      recordCount: dadosExportacao.length 
    });
    
    // Retorna arquivo para download
    const response = new NextResponse(responseData);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
    
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    
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
 * GET /api/colaborador/export/preview
 * Visualiza dados que serão exportados (sem gerar arquivo)
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
    
    const queryParams = {
      tipoTeste: searchParams.get('tipoTeste'),
      dataInicio: searchParams.get('dataInicio'),
      dataFim: searchParams.get('dataFim'),
      incluirMetadados: searchParams.get('incluirMetadados') === 'true'
    };
    
    // Constrói filtros de busca
    const where: any = {
      idUsuario: auditLog.userId
    };
    
    if (queryParams.tipoTeste) {
      where.tipoTeste = queryParams.tipoTeste;
    }
    
    if (queryParams.dataInicio || queryParams.dataFim) {
      where.dataCriacao = {};
      if (queryParams.dataInicio) {
        where.dataCriacao.gte = new Date(queryParams.dataInicio);
      }
      if (queryParams.dataFim) {
        where.dataCriacao.lte = new Date(queryParams.dataFim);
      }
    }
    
    // Conta total de registros que seriam exportados
    const totalRegistros = await prisma.testResult.count({
      where: {
        userId: auditLog.userId,
        ...(queryParams.tipoTeste && {
          test: {
            testType: queryParams.tipoTeste as TestType,
          },
        }),
        ...(queryParams.dataInicio || queryParams.dataFim ? {
          completedAt: {
            ...(queryParams.dataInicio && { gte: new Date(queryParams.dataInicio) }),
            ...(queryParams.dataFim && { lte: new Date(queryParams.dataFim) })
          }
        } : {})
      }
    });
    
    // Busca amostra dos primeiros 10 registros
    const amostra = await prisma.testResult.findMany({
      where: {
        userId: auditLog.userId,
        ...(queryParams.tipoTeste && { test: { testType: queryParams.tipoTeste as TestType } }),
        ...(queryParams.dataInicio || queryParams.dataFim ? {
          completedAt: {
            ...(queryParams.dataInicio && { gte: new Date(queryParams.dataInicio) }),
            ...(queryParams.dataFim && { lte: new Date(queryParams.dataFim) })
          }
        } : {})
      },
      select: {
        id: true,
        testId: true,
        completedAt: true,
        updatedAt: true,
        overallScore: true,
        dimensionScores: true,
        interpretation: true,
        recommendations: true,
        metadata: true,
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 10
    });
    
    // Mapeia amostra para o formato esperado
    const amostraProcessada = amostra.map((resultado) => ({
      id: resultado.id,
      testId: resultado.testId,
      testName: resultado.test?.name || 'Teste não identificado',
      testType: resultado.test?.testType || 'PERSONALITY',
      completedAt: resultado.completedAt,
      updatedAt: resultado.updatedAt,
      overallScore: resultado.overallScore,
      dimensionScores: resultado.dimensionScores,
      interpretation: resultado.interpretation,
      recommendations: resultado.recommendations,
      metadata: resultado.metadata
    }));
    
    // Processa amostra para visualização
    const dadosVisualizacao = processDataForExport(
      amostraProcessada,
      queryParams.incluirMetadados
    );
    
    // Finaliza auditoria com sucesso
    await auditLog.finishLog(true, { previewRecords: dadosVisualizacao.length });
    
    return NextResponse.json({
      success: true,
      data: {
        totalRegistros,
        amostra: dadosVisualizacao,
        limiteMostrado: Math.min(10, totalRegistros),
        colunas: dadosVisualizacao.length > 0 ? Object.keys(dadosVisualizacao[0]) : []
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao visualizar dados para exportação:', error);
    
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