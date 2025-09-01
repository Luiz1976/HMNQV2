// Script para listar todos os 237 registros do banco de dados SQLite
// com informações detalhadas de data, horário e usuário

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllDatabaseRecords() {
  try {
    console.log('\n=== LISTAGEM COMPLETA DOS 237 REGISTROS DO BANCO DE DADOS ===\n');

    // 1. TestResult (33 registros)
    console.log('\n📊 RESULTADOS DE TESTES (TestResult) - 33 registros\n');
    console.log('='.repeat(80));
    
    const testResults = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    testResults.forEach((result, index) => {
      const startDate = result.startedAt ? new Date(result.startedAt).toLocaleString('pt-BR') : 'N/A';
      const endDate = result.completedAt ? new Date(result.completedAt).toLocaleString('pt-BR') : 'N/A';
      const createdDate = new Date(result.createdAt).toLocaleString('pt-BR');
      
      console.log(`${index + 1}. ID: ${result.id}`);
      console.log(`   Teste: ${result.test?.name || 'N/A'} (${result.test?.category || 'N/A'})`);
      console.log(`   Usuário: ${result.user ? `${result.user.firstName} ${result.user.lastName}` : 'N/A'} (${result.user?.email || 'N/A'})`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Iniciado em: ${startDate}`);
      console.log(`   Concluído em: ${endDate}`);
      console.log(`   Criado em: ${createdDate}`);
      console.log(`   Score: ${result.score || 'N/A'}`);
      console.log('-'.repeat(60));
    });

    // 2. TestSession (96 registros)
    console.log('\n\n🎯 SESSÕES DE TESTE (TestSession) - 96 registros\n');
    console.log('=' .repeat(80));
    
    const testSessions = await prisma.testSession.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    testSessions.forEach((session, index) => {
      const createdDate = new Date(session.createdAt).toLocaleString('pt-BR');
      const updatedDate = new Date(session.updatedAt).toLocaleString('pt-BR');
      const startDate = session.startedAt ? new Date(session.startedAt).toLocaleString('pt-BR') : 'N/A';
      const endDate = session.completedAt ? new Date(session.completedAt).toLocaleString('pt-BR') : 'N/A';
      
      console.log(`${index + 1}. ID: ${session.id}`);
      console.log(`   Teste: ${session.test?.name || 'N/A'} (${session.test?.category || 'N/A'})`);
      console.log(`   Usuário: ${session.user ? `${session.user.firstName} ${session.user.lastName}` : 'N/A'} (${session.user?.email || 'N/A'})`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Iniciado em: ${startDate}`);
      console.log(`   Concluído em: ${endDate}`);
      console.log(`   Criado em: ${createdDate}`);
      console.log(`   Atualizado em: ${updatedDate}`);
      console.log(`   Progresso: ${session.currentQuestionIndex || 0}/${session.totalQuestions || 0}`);
      console.log('-'.repeat(60));
    });

    // 3. Answer (45 registros)
    console.log('\n\n💬 RESPOSTAS INDIVIDUAIS (Answer) - 45 registros\n');
    console.log('=' .repeat(80));
    
    const answers = await prisma.answer.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        session: {
          select: {
            id: true,
            test: {
              select: {
                name: true
              }
            }
          }
        },
        question: {
          select: {
            id: true,
            questionText: true,
            questionNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    answers.forEach((answer, index) => {
      const createdDate = new Date(answer.createdAt).toLocaleString('pt-BR');
      const updatedDate = new Date(answer.updatedAt).toLocaleString('pt-BR');
      
      console.log(`${index + 1}. ID: ${answer.id}`);
      console.log(`   Usuário: ${answer.user ? `${answer.user.firstName} ${answer.user.lastName}` : 'N/A'} (${answer.user?.email || 'N/A'})`);
      console.log(`   Sessão: ${answer.sessionId}`);
      console.log(`   Teste: ${answer.session?.test?.name || 'N/A'}`);
      console.log(`   Pergunta: ${answer.question?.questionText || 'N/A'} (Nº ${answer.question?.questionNumber || 'N/A'})`);
      console.log(`   Resposta: ${JSON.stringify(answer.answerValue)}`);
      console.log(`   Tempo gasto: ${answer.timeSpent || 0}ms`);
      console.log(`   Pulada: ${answer.isSkipped ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${createdDate}`);
      console.log(`   Atualizado em: ${updatedDate}`);
      console.log('-'.repeat(60));
    });

    // 4. AIAnalysis (63 registros)
    console.log('\n\n🤖 ANÁLISES DE IA (AIAnalysis) - 63 registros\n');
    console.log('=' .repeat(80));
    
    const aiAnalyses = await prisma.aIAnalysis.findMany({
      include: {
        testResult: {
          select: {
            id: true,
            test: {
              select: {
                name: true
              }
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    aiAnalyses.forEach((analysis, index) => {
      const createdDate = new Date(analysis.createdAt).toLocaleString('pt-BR');
      const updatedDate = new Date(analysis.updatedAt).toLocaleString('pt-BR');
      
      console.log(`${index + 1}. ID: ${analysis.id}`);
      console.log(`   Resultado: ${analysis.testResultId}`);
      console.log(`   Teste: ${analysis.testResult?.test?.name || 'N/A'}`);
      console.log(`   Usuário: ${analysis.testResult?.user ? `${analysis.testResult.user.firstName} ${analysis.testResult.user.lastName}` : 'N/A'} (${analysis.testResult?.user?.email || 'N/A'})`);
      console.log(`   Tipo: ${analysis.analysisType}`);
      console.log(`   Status: ${analysis.status}`);
      console.log(`   Confiança: ${analysis.confidence || 'N/A'}`);
      console.log(`   Resumo: ${analysis.summary?.substring(0, 100) || 'N/A'}...`);
      console.log(`   Criado em: ${createdDate}`);
      console.log(`   Atualizado em: ${updatedDate}`);
      console.log('-'.repeat(60));
    });

    // Resumo final
    console.log('\n\n📈 RESUMO FINAL\n');
    console.log('=' .repeat(50));
    console.log(`TestResult: ${testResults.length} registros`);
    console.log(`TestSession: ${testSessions.length} registros`);
    console.log(`Answer: ${answers.length} registros`);
    console.log(`AIAnalysis: ${aiAnalyses.length} registros`);
    console.log(`TOTAL: ${testResults.length + testSessions.length + answers.length + aiAnalyses.length} registros`);
    
    // Estatísticas por data
    const allDates = [
      ...testResults.map(r => r.createdAt),
      ...testSessions.map(s => s.createdAt),
      ...answers.map(a => a.createdAt),
      ...aiAnalyses.map(a => a.createdAt)
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (allDates.length > 0) {
      console.log(`\nRegistro mais recente: ${new Date(allDates[0]).toLocaleString('pt-BR')}`);
      console.log(`Registro mais antigo: ${new Date(allDates[allDates.length - 1]).toLocaleString('pt-BR')}`);
    }
    
    console.log('\n=== FIM DA LISTAGEM ===\n');

  } catch (error) {
    console.error('Erro ao listar registros:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
listAllDatabaseRecords();