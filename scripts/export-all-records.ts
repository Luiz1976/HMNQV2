// Script para exportar todos os 237 registros do banco de dados SQLite
// e salvar em arquivo de texto para visualização completa

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportAllRecords() {
  try {
    let output = '';
    output += '\n=== LISTAGEM COMPLETA DOS 237 REGISTROS DO BANCO DE DADOS ===\n\n';

    // 1. TestResult (33 registros)
    output += '\n📊 RESULTADOS DE TESTES (TestResult) - 33 registros\n\n';
    output += '='.repeat(80) + '\n';
    
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
      
      output += `${index + 1}. ID: ${result.id}\n`;
      output += `   Teste: ${result.test?.name || 'N/A'} (${result.test?.category || 'N/A'})\n`;
      output += `   Usuário: ${result.user ? `${result.user.firstName} ${result.user.lastName}` : 'N/A'} (${result.user?.email || 'N/A'})\n`;
      output += `   Status: ${result.status}\n`;
      output += `   Iniciado em: ${startDate}\n`;
      output += `   Concluído em: ${endDate}\n`;
      output += `   Criado em: ${createdDate}\n`;
      output += `   Score: ${result.score || 'N/A'}\n`;
      output += '-'.repeat(60) + '\n';
    });

    // 2. TestSession (96 registros)
    output += '\n\n🎯 SESSÕES DE TESTE (TestSession) - 96 registros\n\n';
    output += '='.repeat(80) + '\n';
    
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
      
      output += `${index + 1}. ID: ${session.id}\n`;
      output += `   Teste: ${session.test?.name || 'N/A'} (${session.test?.category || 'N/A'})\n`;
      output += `   Usuário: ${session.user ? `${session.user.firstName} ${session.user.lastName}` : 'N/A'} (${session.user?.email || 'N/A'})\n`;
      output += `   Status: ${session.status}\n`;
      output += `   Iniciado em: ${startDate}\n`;
      output += `   Concluído em: ${endDate}\n`;
      output += `   Criado em: ${createdDate}\n`;
      output += `   Atualizado em: ${updatedDate}\n`;
      output += `   Progresso: ${session.currentQuestionIndex || 0}/${session.totalQuestions || 0}\n`;
      output += '-'.repeat(60) + '\n';
    });

    // 3. Answer (45 registros)
    output += '\n\n💬 RESPOSTAS INDIVIDUAIS (Answer) - 45 registros\n\n';
    output += '='.repeat(80) + '\n';
    
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
      
      output += `${index + 1}. ID: ${answer.id}\n`;
      output += `   Usuário: ${answer.user ? `${answer.user.firstName} ${answer.user.lastName}` : 'N/A'} (${answer.user?.email || 'N/A'})\n`;
      output += `   Sessão: ${answer.sessionId}\n`;
      output += `   Teste: ${answer.session?.test?.name || 'N/A'}\n`;
      output += `   Pergunta: ${answer.question?.questionText || 'N/A'} (Nº ${answer.question?.questionNumber || 'N/A'})\n`;
      output += `   Resposta: ${JSON.stringify(answer.answerValue)}\n`;
      output += `   Tempo gasto: ${answer.timeSpent || 0}ms\n`;
      output += `   Pulada: ${answer.isSkipped ? 'Sim' : 'Não'}\n`;
      output += `   Criado em: ${createdDate}\n`;
      output += `   Atualizado em: ${updatedDate}\n`;
      output += '-'.repeat(60) + '\n';
    });

    // 4. AIAnalysis (63 registros)
    output += '\n\n🤖 ANÁLISES DE IA (AIAnalysis) - 63 registros\n\n';
    output += '='.repeat(80) + '\n';
    
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
      
      output += `${index + 1}. ID: ${analysis.id}\n`;
      output += `   Resultado: ${analysis.testResultId}\n`;
      output += `   Teste: ${analysis.testResult?.test?.name || 'N/A'}\n`;
      output += `   Usuário: ${analysis.testResult?.user ? `${analysis.testResult.user.firstName} ${analysis.testResult.user.lastName}` : 'N/A'} (${analysis.testResult?.user?.email || 'N/A'})\n`;
      output += `   Tipo: ${analysis.analysisType}\n`;
      output += `   Status: ${analysis.status}\n`;
      output += `   Confiança: ${analysis.confidence || 'N/A'}\n`;
      output += `   Resumo: ${analysis.summary?.substring(0, 100) || 'N/A'}...\n`;
      output += `   Criado em: ${createdDate}\n`;
      output += `   Atualizado em: ${updatedDate}\n`;
      output += '-'.repeat(60) + '\n';
    });

    // Resumo final
    output += '\n\n📈 RESUMO FINAL\n\n';
    output += '='.repeat(50) + '\n';
    output += `TestResult: ${testResults.length} registros\n`;
    output += `TestSession: ${testSessions.length} registros\n`;
    output += `Answer: ${answers.length} registros\n`;
    output += `AIAnalysis: ${aiAnalyses.length} registros\n`;
    output += `TOTAL: ${testResults.length + testSessions.length + answers.length + aiAnalyses.length} registros\n`;
    
    // Estatísticas por data
    const allDates = [
      ...testResults.map(r => r.createdAt),
      ...testSessions.map(s => s.createdAt),
      ...answers.map(a => a.createdAt),
      ...aiAnalyses.map(a => a.createdAt)
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (allDates.length > 0) {
      output += `\nRegistro mais recente: ${new Date(allDates[0]).toLocaleString('pt-BR')}\n`;
      output += `Registro mais antigo: ${new Date(allDates[allDates.length - 1]).toLocaleString('pt-BR')}\n`;
    }
    
    output += '\n=== FIM DA LISTAGEM ===\n';

    // Salvar no arquivo
    const outputPath = path.join(process.cwd(), 'todos-os-237-registros.txt');
    fs.writeFileSync(outputPath, output, 'utf8');
    
    console.log(`✅ Todos os 237 registros foram exportados para: ${outputPath}`);
    console.log(`📊 Total de registros processados: ${testResults.length + testSessions.length + answers.length + aiAnalyses.length}`);
    
    // Também exibir no console (versão resumida)
    console.log('\n📋 RESUMO DOS REGISTROS:');
    console.log(`• TestResult: ${testResults.length} registros`);
    console.log(`• TestSession: ${testSessions.length} registros`);
    console.log(`• Answer: ${answers.length} registros`);
    console.log(`• AIAnalysis: ${aiAnalyses.length} registros`);
    console.log(`• TOTAL: ${testResults.length + testSessions.length + answers.length + aiAnalyses.length} registros`);
    
    // Exibir também a listagem completa no console
    console.log('\n' + output);

  } catch (error) {
    console.error('Erro ao exportar registros:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
exportAllRecords();