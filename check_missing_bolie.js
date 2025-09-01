const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMissingBolie() {
  try {
    console.log('=== VERIFICAÇÃO DE TESTES BOLIE PERDIDOS ===\n');
    
    // Buscar todas as sessões BOLIE dos últimos 2 dias
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    console.log(`Buscando sessões BOLIE desde ${twoDaysAgo.toISOString()}\n`);
    
    const bolieSessions = await prisma.testSession.findMany({
      where: {
        createdAt: {
          gte: twoDaysAgo
        },
        test: {
          name: {
            contains: 'BOLIE'
          }
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        },
        test: {
          select: {
            name: true
          }
        },
        results: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📋 SESSÕES BOLIE ENCONTRADAS: ${bolieSessions.length}\n`);
    
    let sessionsWithoutResults = 0;
    let completedSessionsWithoutResults = 0;
    
    bolieSessions.forEach((session, index) => {
      console.log(`${index + 1}. Sessão ID: ${session.id}`);
      console.log(`   Usuário: ${session.user?.email || 'N/A'}`);
      console.log(`   Teste: ${session.test?.name || 'N/A'}`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Criada em: ${session.createdAt}`);
      console.log(`   Completada em: ${session.completedAt || 'Não completada'}`);
      console.log(`   Resultados associados: ${session.results?.length || 0}`);
      
      if (!session.results || session.results.length === 0) {
        sessionsWithoutResults++;
        console.log(`   ⚠️  SESSÃO SEM RESULTADO!`);
        
        if (session.status === 'COMPLETED') {
          completedSessionsWithoutResults++;
          console.log(`   🚨 SESSÃO COMPLETADA MAS SEM RESULTADO!`);
        }
      }
      
      console.log('---\n');
    });
    
    console.log(`\n📊 RESUMO:`);
    console.log(`   Total de sessões BOLIE: ${bolieSessions.length}`);
    console.log(`   Sessões sem resultado: ${sessionsWithoutResults}`);
    console.log(`   Sessões completadas sem resultado: ${completedSessionsWithoutResults}`);
    
    // Verificar respostas BOLIE recentes
    const bolieAnswers = await prisma.testAnswer.findMany({
      where: {
        createdAt: {
          gte: twoDaysAgo
        },
        test: {
          name: {
            contains: 'BOLIE'
          }
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        },
        session: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
    
    console.log(`\n📝 RESPOSTAS BOLIE ENCONTRADAS: ${bolieAnswers.length}`);
    
    if (bolieAnswers.length > 0) {
      const answersBySession = {};
      bolieAnswers.forEach(answer => {
        const sessionId = answer.sessionId;
        if (!answersBySession[sessionId]) {
          answersBySession[sessionId] = {
            count: 0,
            user: answer.user?.email || 'N/A',
            status: answer.session?.status || 'N/A'
          };
        }
        answersBySession[sessionId].count++;
      });
      
      console.log('\nRespostas por sessão:');
      Object.entries(answersBySession).forEach(([sessionId, data]) => {
        console.log(`   Sessão ${sessionId}: ${data.count} respostas (${data.user}, status: ${data.status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar testes BOLIE:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMissingBolie();