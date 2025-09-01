const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDiscResults() {
  try {
    console.log('Procurando por testes DISC...');
    
    // Buscar todos os testes que contenham "DISC" no nome
    const discTests = await prisma.test.findMany({
      where: {
        name: {
          contains: 'DISC'
        }
      }
    });
    
    console.log('Testes DISC encontrados:', discTests.length);
    discTests.forEach(test => {
      console.log(`- ${test.name} (ID: ${test.id})`);
    });
    
    // Buscar resultados de testes DISC
    const discResults = await prisma.testResult.findMany({
      include: {
        test: true,
        user: true
      },
      where: {
        test: {
          name: {
            contains: 'DISC'
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log('\nResultados DISC encontrados:', discResults.length);
    discResults.forEach(result => {
      console.log(`- Usuário: ${result.user.email}`);
      console.log(`  Teste: ${result.test.name}`);
      console.log(`  Completado em: ${result.completedAt}`);
      console.log(`  Score: ${result.score}`);
      console.log(`  Status: ${result.status}`);
      console.log('---');
    });
    
    // Buscar sessões de teste DISC (incluindo não finalizadas)
    const discSessions = await prisma.testSession.findMany({
      include: {
        test: true,
        user: true
      },
      where: {
        test: {
          name: {
            contains: 'DISC'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\nSessões DISC encontradas:', discSessions.length);
    discSessions.forEach(session => {
      console.log(`- Usuário: ${session.user.email}`);
      console.log(`  Teste: ${session.test.name}`);
      console.log(`  Criado em: ${session.createdAt}`);
      console.log(`  Progresso: ${session.progress}%`);
      console.log(`  Status: ${session.status}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Erro ao consultar banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDiscResults();