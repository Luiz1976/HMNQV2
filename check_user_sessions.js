const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserSessions() {
  try {
    console.log('Verificando sessões do usuário colaborador@demo.com...');
    
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@demo.com'
      }
    });
    
    if (!user) {
      console.log('Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log(`Usuário encontrado: ${user.email} (ID: ${user.id})`);
    
    // Buscar todas as sessões recentes do usuário
    const recentSessions = await prisma.testSession.findMany({
      include: {
        test: true
      },
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    console.log(`\nSessões recentes encontradas: ${recentSessions.length}`);
    recentSessions.forEach((session, index) => {
      console.log(`${index + 1}. Teste: ${session.test.name}`);
      console.log(`   Criado em: ${session.createdAt}`);
      console.log(`   Progresso: ${session.progress}%`);
      console.log(`   Status: ${session.status}`);
      console.log(`   ID da sessão: ${session.id}`);
      console.log('---');
    });
    
    // Buscar todos os resultados do usuário
    const userResults = await prisma.testResult.findMany({
      include: {
        test: true
      },
      where: {
        userId: user.id
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\nResultados do usuário: ${userResults.length}`);
    userResults.forEach((result, index) => {
      console.log(`${index + 1}. Teste: ${result.test.name}`);
      console.log(`   Completado em: ${result.completedAt}`);
      console.log(`   Score: ${result.score}`);
      console.log(`   Status: ${result.status}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Erro ao consultar banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserSessions();