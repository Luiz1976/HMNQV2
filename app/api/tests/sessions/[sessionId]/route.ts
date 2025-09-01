import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID da sessão é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar a sessão no banco de dados (permitir acesso sem autenticação para resultados)
    const testSession = await db.testSession.findUnique({
      where: {
        id: sessionId,
        status: 'COMPLETED' // Apenas sessões completadas podem ser acessadas sem autenticação
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            isActive: true
          }
        },
        results: {
          select: {
            id: true,
            overallScore: true,
            dimensionScores: true,
            interpretation: true,
            recommendations: true,
            metadata: true,
            createdAt: true
          }
        },
        answers: {
          select: {
            questionId: true,
            answerValue: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!testSession) {
      return NextResponse.json(
        { error: 'Sessão de teste não encontrada' },
        { status: 404 }
      )
    }

    // Formatar os dados para a página de resultado
    const formattedSession = {
      id: testSession.id,
      testId: testSession.testId,
      userId: testSession.userId,
      startedAt: testSession.startedAt,
      completedAt: testSession.completedAt,
      status: testSession.status,
      timeSpent: testSession.timeSpent,
      test: testSession.test,
      results: testSession.results?.[0] ? (() => {
        const result = testSession.results[0];
        const metadata = result.metadata as any;
        
        // Se overallScore é 0 e temos metadata, recalcular usando os dados do metadata
        if (result.overallScore === 0 && metadata) {
          const dimensionScores = {};
          
          // Calcular overallScore baseado nos dados do metadata
          let calculatedOverallScore = 0;
          if (metadata.totalRawScore && metadata.maxPossibleScore) {
            calculatedOverallScore = Math.round((metadata.totalRawScore / metadata.maxPossibleScore) * 100);
          } else if (metadata.totalAnswers && metadata.totalQuestions) {
            // Fallback: assumir que cada resposta vale 5 pontos (escala Likert)
            const assumedMaxScore = metadata.totalQuestions * 5;
            const assumedRawScore = metadata.totalAnswers * 2.5; // Valor médio assumido
            calculatedOverallScore = Math.round((assumedRawScore / assumedMaxScore) * 100);
          }
          
          if (metadata.dimensionCounts) {
            // Converter dimensionCounts para dimensionScores
            Object.keys(metadata.dimensionCounts).forEach((dimension: string) => {
              const counts = metadata.dimensionCounts[dimension] as Record<string, number>;
              // Calcular score baseado nas contagens (média ponderada)
              const total = Object.values(counts).reduce((sum: number, count: number) => sum + (typeof count === 'number' ? count : 0), 0);
              if (total > 0) {
                let score = 0;
                Object.entries(counts).forEach(([level, count]: [string, number]) => {
                  const levelValue = level === 'muitoBaixa' ? 1 : level === 'baixa' ? 2 : level === 'media' ? 3 : level === 'alta' ? 4 : 5;
                  const countValue = typeof count === 'number' ? count : 0;
                  score += levelValue * countValue;
                });
                (dimensionScores as Record<string, number>)[dimension] = Math.round((score / total) * 20); // Normalizar para 0-100
              }
            });
          }
          
          return {
            overallScore: calculatedOverallScore,
            classification: metadata.classification || result.interpretation || 'Resultado calculado automaticamente',
            dimensionScores: Object.keys(dimensionScores).length > 0 ? dimensionScores : result.dimensionScores,
            testScores: {}
          };
        }
        
        // Usar dados normais se não há problema
        return {
          overallScore: result.overallScore,
          classification: result.interpretation,
          dimensionScores: result.dimensionScores,
          testScores: {}
        };
      })() : null,
      answers: testSession.answers || [],
      totalQuestions: (() => {
        if (testSession.answers?.length > 0) return testSession.answers.length;
        const metadata = testSession.results?.[0]?.metadata as any;
        return metadata?.totalQuestions || 0;
      })(),
      duration: testSession.timeSpent || 0,
      answeredQuestions: testSession.answers?.length || 0
    }

    return NextResponse.json({
      success: true,
      data: formattedSession
    })

  } catch (error) {
    console.error('Erro ao buscar sessão de teste:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}