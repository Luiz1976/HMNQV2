const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayResults() {
  try {
    console.log('=== VERIFICAÇÃO DE RESULTADOS DE HOJE (30/08/2025) ===\n');
    
    // Data de hoje
    const today = new Date('2025-08-30');
    const tomorrow = new Date('2025-08-31');
    
    console.log(`Buscando resultados entre ${today.toISOString()} e ${tomorrow.toISOString()}\n`);
    
    // Buscar todos os resultados de hoje
    const todayResults = await prisma.testResult.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
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
        session: {
          select: {
            status: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 TOTAL DE RESULTADOS ENCONTRADOS HOJE: ${todayResults.length}\n`);
    
    if (todayResults.length === 0) {
      console.log('❌ Nenhum resultado encontrado para hoje.');
      
      // Verificar sessões de hoje
      const todaySessions = await prisma.testSession.findMany({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`\n📋 SESSÕES DE TESTE CRIADAS HOJE: ${todaySessions.length}`);
      
      todaySessions.forEach((session, index) => {
        console.log(`\n${index + 1}. Sessão ID: ${session.id}`);
        console.log(`   Usuário: ${session.user?.email || 'N/A'}`);
        console.log(`   Teste: ${session.test?.name || 'N/A'}`);
        console.log(`   Status: ${session.status}`);
        console.log(`   Criada em: ${session.createdAt}`);
        console.log(`   Completada em: ${session.completedAt || 'Não completada'}`);
      });
      
    } else {
      todayResults.forEach((result, index) => {
        console.log(`${index + 1}. Resultado ID: ${result.id}`);
        console.log(`   Usuário: ${result.user?.email || 'N/A'}`);
        console.log(`   Teste: ${result.test?.name || 'N/A'}`);
        console.log(`   Score: ${result.overallScore}`);
        console.log(`   Status da Sessão: ${result.session?.status || 'N/A'}`);
        console.log(`   Criado em: ${result.createdAt}`);
        console.log(`   Sessão completada em: ${result.session?.completedAt || 'N/A'}`);
        console.log('---');
      });
    }
    
    // Verificar respostas de hoje também
    const todayAnswers = await prisma.testAnswer.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    console.log(`\n📝 RESPOSTAS SALVAS HOJE: ${todayAnswers.length}`);
    
    if (todayAnswers.length > 0) {
      const userAnswers = {};
      todayAnswers.forEach(answer => {
        const email = answer.user?.email || 'N/A';
        if (!userAnswers[email]) {
          userAnswers[email] = 0;
        }
        userAnswers[email]++;
      });
      
      console.log('\nRespostas por usuário:');
      Object.entries(userAnswers).forEach(([email, count]) => {
        console.log(`   ${email}: ${count} respostas`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar resultados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayResults();